# accounts/signals.py
from django.dispatch import receiver
from allauth.account.signals import user_logged_in
from rest_framework_simplejwt.tokens import RefreshToken
# from django.conf import settings
import logging

logger = logging.getLogger(__name__)

@receiver(user_logged_in)
def set_jwt_cookies_on_login(sender, request, user, **kwargs):
    """
    Set JWT cookies whenever a user logs in (including social login)
    """
    logger.info(f"User logged in: {user.email}")
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    # Store tokens in session for middleware to set as cookies
    # We'll use session because we can't directly modify the response here
    request.session['_jwt_access'] = access_token
    request.session['_jwt_refresh'] = refresh_token
    request.session.modified = True
    
    logger.info("JWT tokens stored in session for cookie setting")