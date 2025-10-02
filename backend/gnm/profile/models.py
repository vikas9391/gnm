from django.contrib.auth.models import AbstractUser
from django.db import models
import os


def user_profile_image_path(instance, filename):
    """Generate file path for user profile images"""
    ext = filename.split('.')[-1]
    filename = f"user_{instance.id}_profile.{ext}"
    return os.path.join('profile_images', filename)


class CustomUser(AbstractUser):
    """Extended User Model with additional profile fields"""
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Phone Number")
    location = models.CharField(max_length=100, blank=True, null=True, verbose_name="Location")
    bio = models.TextField(blank=True, null=True, verbose_name="Biography")
    occupation = models.CharField(max_length=100, blank=True, null=True, verbose_name="Occupation")
    website = models.URLField(max_length=200, blank=True, null=True, verbose_name="Website")
    profile_image = models.ImageField(
        upload_to=user_profile_image_path,
        blank=True,
        null=True,
        verbose_name="Profile Image"
    )
    
    class Meta:
        db_table = 'custom_user'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        """Returns the user's full name"""
        return f"{self.first_name} {self.last_name}".strip() or self.username