# accounts/authentication.py
from rest_framework_simplejwt.authentication import JWTAuthentication
import logging

logger = logging.getLogger(__name__)

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that reads tokens from httpOnly cookies
    instead of Authorization headers
    """
    
    def authenticate(self, request):
        # Get access token from cookie instead of header
        access_token = request.COOKIES.get("access")
        
        if not access_token:
            logger.debug("No access token found in cookies")
            return None
        
        try:
            # Validate the token
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            
            logger.debug(f"Successfully authenticated user: {user.email}")
            return (user, validated_token)
            
        except Exception as e:
            logger.debug(f"JWT authentication failed: {str(e)}")
            return None