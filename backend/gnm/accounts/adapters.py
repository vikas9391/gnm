# accounts/adapters.py
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter to handle social login, populate user, and redirect to frontend
    """

    def get_login_redirect_url(self, request):
        """
        Redirect to React app after successful social login
        """
        return f"{settings.FRONTEND_URL}/auth/google/success"

    def pre_social_login(self, request, sociallogin):
        """
        Called after social login is validated but before user is logged in
        """
        pass

    def save_user(self, request, sociallogin, form=None):
        """
        Called when saving a new social account
        """
        user = super().save_user(request, sociallogin, form)
        # Add any additional custom user processing here
        return user

    def populate_user(self, request, sociallogin, data):
        """
        Populates user information from social provider data
        """
        user = super().populate_user(request, sociallogin, data)
        # Add any custom data population here
        return user


class MyAccountAdapter(DefaultAccountAdapter):
    """
    Custom account adapter for normal login
    """

    def get_login_redirect_url(self, request):
        """
        Redirect to React app after normal login
        """
        return f"{settings.FRONTEND_URL}/auth/google/success"