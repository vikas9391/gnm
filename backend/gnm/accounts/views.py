from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.views.decorators.http import require_http_methods
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.views.decorators.csrf import csrf_exempt
import json
import logging
import requests
from django.shortcuts import redirect
from django.views import View
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.core.cache import cache  
from urllib.parse import quote


logger = logging.getLogger(__name__)

# ----------------------------
# Custom JWT Authentication from Cookies
# ----------------------------
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access")
        if not access_token:
            return None
        try:
            validated = self.get_validated_token(access_token)
            return (self.get_user(validated), validated)
        except Exception as e:
            logger.debug(f"JWT authentication failed: {e}")
            return None

# ----------------------------
# Custom Google OAuth Callback
# ----------------------------
class CustomGoogleCallbackView(View):
    """
    Handles Google OAuth2 GET callback, creates/fetches user,
    and sets JWT cookies (access + refresh) on the response.
    """
    
    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        state = request.GET.get('state')
        
        if not code:
            logger.error("No code provided in Google callback")
            return self._error_redirect("No authorization code provided")
        
        # Prevent code reuse using Django cache
        code_key = f"oauth_code:{code}:{state}"
        if cache.get(code_key):
            logger.warning(f"Attempted reuse of authorization code: {code[:10]}...")
            return self._error_redirect("Authorization code already used")
        
        # Mark code as used for 5 minutes
        cache.set(code_key, True, timeout=300)
        
        try:
            # Exchange code for access token
            token_response = requests.post(
                'https://oauth2.googleapis.com/token',
                data={
                    'code': code,
                    'client_id': settings.GOOGLE_CLIENT_ID,
                    'client_secret': settings.GOOGLE_CLIENT_SECRET,
                    'redirect_uri': settings.GOOGLE_REDIRECT_URI,
                    'grant_type': 'authorization_code'
                },
                timeout=10
            )
            
            token_data = token_response.json()
            access_token = token_data.get('access_token')
            
            if not access_token:
                error_msg = token_data.get('error_description', 'Failed to obtain access token')
                logger.error(f"Token exchange failed: {token_data}")
                return self._error_redirect(error_msg)

            # Fetch user info
            user_info_resp = requests.get(
                'https://www.googleapis.com/oauth2/v2/userinfo',
                headers={'Authorization': f'Bearer {access_token}'},
                timeout=10
            )
            
            if user_info_resp.status_code != 200:
                logger.error(f"Failed to fetch user info: {user_info_resp.status_code}")
                return self._error_redirect("Failed to retrieve user information")
            
            user_info = user_info_resp.json()
            email = user_info.get('email')
            first_name = user_info.get('given_name', '')
            last_name = user_info.get('family_name', '')

            if not email:
                return self._error_redirect("Failed to retrieve user email")

            # Create or get user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )

            logger.info(f"Google OAuth user: {email} | Created: {created}")

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_jwt = str(refresh.access_token)
            refresh_jwt = str(refresh)

            # Redirect to frontend root
            frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:8080')
            frontend_url = frontend_url.rstrip('/')
            response = redirect(frontend_url)

            # Set JWT cookies
            secure = getattr(settings, 'SESSION_COOKIE_SECURE', False)
            response.set_cookie(
                'access',
                access_jwt,
                httponly=True,
                secure=secure,
                samesite='Lax',
                max_age=60*15,
                path='/'
            )
            response.set_cookie(
                'refresh',
                refresh_jwt,
                httponly=True,
                secure=secure,
                samesite='Lax',
                max_age=60*60*24*7,
                path='/'
            )

            logger.info("JWT cookies set successfully for Google OAuth")
            return response

        except requests.Timeout:
            logger.error("Google OAuth request timed out")
            return self._error_redirect("Authentication request timed out")
        except requests.RequestException as e:
            logger.exception(f"Network error in Google OAuth: {str(e)}")
            return self._error_redirect("Network error during authentication")
        except Exception as e:
            logger.exception(f"Error in Google OAuth callback: {str(e)}")
            return self._error_redirect("Internal server error")
    
    def _error_redirect(self, error_message):
        """Helper method to redirect to frontend with error"""
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:8080')
        frontend_url = frontend_url.rstrip('/')
        return redirect(f"{frontend_url}/?auth=error&message={quote(error_message)}")
    
# ----------------------------
# Login with HttpOnly cookie - FIXED
# ----------------------------
class CookieLoginView(APIView):
    """
    Custom login view that accepts email/password and sets JWT cookies
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')
        
        if not email or not password:
            return Response(
                {"detail": "Email and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Authenticate user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check password
        if not user.check_password(password):
            return Response(
                {"detail": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Check if user is active
        if not user.is_active:
            return Response(
                {"detail": "User account is disabled"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        
        logger.info(f"User logged in: {email}")
        
        # Create response
        response = Response({"detail": "Login successful"}, status=status.HTTP_200_OK)
        
        # Set JWT cookies
        secure = getattr(settings, "SESSION_COOKIE_SECURE", False)
        response.set_cookie(
            "access", 
            access_token, 
            httponly=True, 
            secure=secure,
            samesite="Lax", 
            max_age=60*15,  # 15 minutes
            path="/"
        )
        response.set_cookie(
            "refresh", 
            refresh_token, 
            httponly=True, 
            secure=secure,
            samesite="Lax", 
            max_age=60*60*24*7,  # 7 days
            path="/"
        )
        
        return response

# ----------------------------
# Refresh access token from HttpOnly refresh cookie
# ----------------------------
class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response = Response({"detail": "Token refreshed"})
            secure = getattr(settings, "SESSION_COOKIE_SECURE", False)
            response.set_cookie(
                "access", access_token, httponly=True, secure=secure,
                samesite="Lax", max_age=60*15, path="/"
            )
            return response
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

# ----------------------------
# Logout
# ----------------------------
class CookieLogoutView(APIView):
    """
    Custom logout that properly clears JWT cookies
    """
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        logger.info(f"Logout request received from: {request.user if request.user.is_authenticated else 'Anonymous'}")
        
        response = Response({"detail": "Successfully logged out"}, status=status.HTTP_200_OK)
        
        response.delete_cookie('access', path='/', samesite='Lax')
        response.delete_cookie('refresh', path='/', samesite='Lax')
        response.delete_cookie('refresh', path='/api/auth/token/refresh/', samesite='Lax')
        
        logger.info("Logout successful - cookies cleared")
        return response

# ----------------------------
# Current user info
# ----------------------------
class MeView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        logger.info(f"MeView called for user: {user.email if user.is_authenticated else 'Anonymous'}")
        
        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
        })

# ----------------------------
# CSRF endpoint
# ----------------------------
@api_view(['GET'])
@ensure_csrf_cookie
@permission_classes([AllowAny])
def csrf(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

# ----------------------------
# Register User
# ----------------------------
@csrf_exempt
@require_http_methods(["POST"])
def register_user(request):
    """
    Register a new user
    """
    try:
        data = json.loads(request.body.decode('utf-8'))
        
        first_name = data.get("first_name", "").strip()
        last_name = data.get("last_name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not all([first_name, last_name, email, password]):
            return JsonResponse(
                {"detail": "Missing required fields: first_name, last_name, email, password"}, 
                status=400
            )

        if len(password) < 8:
            return JsonResponse(
                {"detail": "Password must be at least 8 characters long"}, 
                status=400
            )

        if '@' not in email or '.' not in email:
            return JsonResponse(
                {"detail": "Invalid email format"}, 
                status=400
            )

        if User.objects.filter(email=email).exists():
            return JsonResponse(
                {"detail": "User with this email already exists"}, 
                status=400
            )

        user = User.objects.create(
            username=email,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=make_password(password)
        )

        logger.info(f"New user registered: {email}")
        
        return JsonResponse({
            "detail": "Account created successfully",
            "user_id": user.id,
            "email": user.email
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON data"}, status=400)
    except IntegrityError:
        return JsonResponse({"detail": "User with this email already exists"}, status=400)
    except Exception as e:
        logger.exception(f"Registration error: {str(e)}")
        return JsonResponse({"detail": "Registration failed. Please try again."}, status=500)

# ----------------------------
# Password Reset Request
# ----------------------------
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    """
    Send password reset email with token
    """
    try:
        data = json.loads(request.body.decode('utf-8')) if isinstance(request.body, bytes) else request.data
        email = data.get('email', '').strip().lower()
        
        if not email:
            return Response(
                {"detail": "Email is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "detail": "If an account exists with this email, you will receive reset instructions."
            }, status=status.HTTP_200_OK)
        
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:8080')
        frontend_url = frontend_url.rstrip('/')
        reset_url = f"{frontend_url}/reset-password?uid={uid}&token={token}"
        
        subject = "Password Reset Request - GNM Events"
        
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                          color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                .button {{ display: inline-block; padding: 12px 30px; background: #667eea; 
                          color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                .footer {{ text-align: center; margin-top: 20px; color: #777; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello {user.first_name or user.username},</p>
                    <p>We received a request to reset your password for your GNM Events account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center;">
                        <a href="{reset_url}" class="button">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 5px;">
                        {reset_url}
                    </p>
                    <p><strong>This link will expire in 24 hours.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>The GNM Events Team</p>
                </div>
                <div class="footer">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2025 GNM Events. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
Hello {user.first_name or user.username},

We received a request to reset your password for your GNM Events account.

Click the link below to reset your password:
{reset_url}

This link will expire in 24 hours.

If you didn't request this password reset, please ignore this email.

Best regards,
The GNM Events Team
        """
        
        try:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Password reset email sent to: {email}")
            
        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            return Response(
                {"detail": "Failed to send reset email. Please try again later."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            "detail": "If an account exists with this email, you will receive reset instructions."
        }, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response(
            {"detail": "Invalid JSON data"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"Password reset request error: {str(e)}")
        return Response(
            {"detail": "An error occurred. Please try again."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ----------------------------
# Password Reset Confirm
# ----------------------------
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    """
    Confirm password reset with token and set new password
    """
    try:
        data = json.loads(request.body.decode('utf-8')) if isinstance(request.body, bytes) else request.data
        
        uid = data.get('uid')
        token = data.get('token')
        new_password = data.get('password')
        
        if not all([uid, token, new_password]):
            return Response(
                {"detail": "Missing required fields: uid, token, password"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(new_password) < 8:
            return Response(
                {"detail": "Password must be at least 8 characters long"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid reset link"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reset link"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(new_password)
        user.save()
        
        logger.info(f"Password reset successful for user: {user.email}")
        
        try:
            send_mail(
                subject="Password Changed Successfully - GNM Events",
                message=f"""
Hello {user.first_name or user.username},

Your password has been changed successfully.

If you did not make this change, please contact our support team immediately.

Best regards,
The GNM Events Team
                """,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
            )
        except Exception as e:
            logger.warning(f"Failed to send password change confirmation: {str(e)}")
        
        return Response({
            "detail": "Password has been reset successfully. You can now log in with your new password."
        }, status=status.HTTP_200_OK)
        
    except json.JSONDecodeError:
        return Response(
            {"detail": "Invalid JSON data"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        logger.exception(f"Password reset confirm error: {str(e)}")
        return Response(
            {"detail": "An error occurred. Please try again."}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ----------------------------
# Validate Reset Token
# ----------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def validate_reset_token(request):
    """
    Validate if a password reset token is still valid
    """
    try:
        uid = request.data.get('uid')
        token = request.data.get('token')
        
        if not uid or not token:
            return Response(
                {"valid": False, "detail": "Missing uid or token"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"valid": False, "detail": "Invalid token"}, 
                status=status.HTTP_200_OK
            )
        
        is_valid = default_token_generator.check_token(user, token)
        
        return Response({
            "valid": is_valid,
            "detail": "Token is valid" if is_valid else "Token is invalid or expired"
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.exception(f"Token validation error: {str(e)}")
        return Response(
            {"valid": False, "detail": "Validation error"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
# Add this to your accounts/views.py file

# ----------------------------
# Update User Profile
# ----------------------------
class ProfileUpdateView(APIView):
    """
    Update user profile information
    """
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        
        first_name = request.data.get('first_name', '').strip()
        last_name = request.data.get('last_name', '').strip()
        username = request.data.get('username', '').strip()
        
        # Validation
        if not all([first_name, last_name, username]):
            return Response(
                {"detail": "First name, last name, and username are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if username is already taken by another user
        if username != user.username:
            if User.objects.filter(username=username).exclude(id=user.id).exists():
                return Response(
                    {"detail": "Username is already taken"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Update user
        try:
            user.first_name = first_name
            user.last_name = last_name
            user.username = username
            user.save()
            
            logger.info(f"Profile updated for user: {user.email}")
            
            return Response({
                "id": user.id,
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception(f"Profile update error: {str(e)}")
            return Response(
                {"detail": "Failed to update profile. Please try again."}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )