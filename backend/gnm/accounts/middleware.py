# accounts/middleware.py
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class JWTCookieMiddleware:
    """
    Middleware to set JWT cookies from session data
    This works with the signals approach
    """
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Check if we have JWT tokens in session (set by signals)
        access_token = request.session.get('_jwt_access')
        refresh_token = request.session.get('_jwt_refresh')
        
        if access_token and refresh_token:
            logger.info("Setting JWT cookies from session")
            
            # Set cookies
            secure = getattr(settings, 'SESSION_COOKIE_SECURE', False)
            
            response.set_cookie(
                'access',
                access_token,
                httponly=True,
                secure=secure,
                samesite='Lax',
                max_age=60*15,  # 15 minutes
                path='/'
            )
            
            response.set_cookie(
                'refresh',
                refresh_token,
                httponly=True,
                secure=secure,
                samesite='Lax',
                max_age=60*60*24*7,  # 7 days
                path='/api/auth/token/refresh/'
            )
            
            # Clear from session after setting cookies
            del request.session['_jwt_access']
            del request.session['_jwt_refresh']
            request.session.modified = True
            
            logger.info("JWT cookies set and session cleared")
        
        return response