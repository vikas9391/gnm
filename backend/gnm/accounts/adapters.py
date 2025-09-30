# accounts/adapters.py - CLEAN VERSION
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import DefaultAccountAdapter


class MySocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Custom adapter to set JWT cookies after social login
    """
    
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
        return user
    
    def populate_user(self, request, sociallogin, data):
        """
        Populates user information from social provider data
        """
        user = super().populate_user(request, sociallogin, data)
        return user


class MyAccountAdapter(DefaultAccountAdapter):
    """
    Custom account adapter
    """
    pass