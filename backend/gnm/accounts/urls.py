from django.urls import path,include
from .views import (
    CookieLoginView,
    CookieLogoutView,
    CookieTokenRefreshView,
    MeView,
    csrf,
    register_user,
    password_reset_request,
    password_reset_confirm,
    validate_reset_token,
)

urlpatterns = [
    # Authentication endpoints
    path("login/", CookieLoginView.as_view(), name="cookie_login"),
    path("logout/", CookieLogoutView.as_view(), name="cookie_logout"),
    path("token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("me/", MeView.as_view(), name="current_user"),
    path("csrf/", csrf, name="csrf"),
    path("register/", register_user, name="register"),

    
    # Password reset endpoints
    path("password-reset/", password_reset_request, name="password_reset_request"),
    path("password-reset/confirm/", password_reset_confirm, name="password_reset_confirm"),
    path("password-reset/validate/", validate_reset_token, name="validate_reset_token"),

    path('', include('profile.urls')),
]