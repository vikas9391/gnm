# profile/urls.py
from django.urls import path
from . import views

app_name = 'profile'

urlpatterns = [
    path('me/', views.get_current_user, name='get_current_user'),
    path('profile/update/', views.update_user_profile, name='update_user_profile'),
    path('profile/image/', views.delete_profile_image, name='delete_profile_image'),
]