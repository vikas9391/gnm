# gnm/urls.py
from django.contrib import admin
from django.urls import path, include
from accounts.views import CustomGoogleCallbackView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Your app APIs
    path('api/', include('app1.urls')),
    
    # Authentication endpoints
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    
    # Custom auth endpoints (with cookie JWT)
    path("api/auth/custom/", include("accounts.urls")),
    
    # IMPORTANT: Override Google OAuth callback BEFORE allauth include
    # Use the SocialLoginView-based custom view
    path(
        "accounts/google/login/callback/",
        CustomGoogleCallbackView.as_view(),
        name="google_callback"
    ),
    # Allauth social authentication (must come AFTER the override)
    path("accounts/", include("allauth.urls")),
]
