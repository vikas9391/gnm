"""
Django settings for gnm project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from decouple import config


load_dotenv()

# Build paths inside the project
BASE_DIR = Path(__file__).resolve().parent.parent

# ----------------------------
# SECURITY SETTINGS
# ----------------------------
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable must be set")
DEBUG = os.getenv("DEBUG", "False").lower() in ('true', '1', 'yes')
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

AUTH_USER_MODEL = 'profile.CustomUser'

AXES_FAILURE_LIMIT = 5
AXES_COOLOFF_TIME = 1  # hours
AXES_LOCKOUT_URL = '/locked'
AUTHENTICATION_BACKENDS = [
    'axes.backends.AxesStandaloneBackend',
    'django.contrib.auth.backends.ModelBackend',
]
# ----------------------------
# MEDIA FILES (UPLOADS)
# ----------------------------
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Ensure the media directory exists
os.makedirs(MEDIA_ROOT, exist_ok=True)

# Maximum upload size (5MB)
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024

# Allowed image formats
ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

# ----------------------------
# INSTALLED APPS
# ----------------------------
INSTALLED_APPS = [
    # Django default apps
    'axes',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    # Local apps
    'app1',
    'accounts.apps.AccountsConfig',
    'profile',

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.apple',
    'corsheaders',
]

SITE_ID = 1

# ----------------------------
# MIDDLEWARE
# ----------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'axes.middleware.AxesMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'accounts.middleware.JWTCookieMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'gnm.urls'

# ----------------------------
# TEMPLATES
# ----------------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / "templates"],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ----------------------------
# CORS & CSRF SETTINGS
# ----------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

CORS_ALLOW_CREDENTIALS = True  # CRITICAL - allows cookies to be sent

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

CSRF_COOKIE_HTTPONLY = False  # Allow JS to read CSRF token
CSRF_USE_SESSIONS = False
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = False  # Set to True in production with HTTPS
CSRF_FAILURE_VIEW = 'django.views.csrf.csrf_failure'

# ----------------------------
# SESSION & COOKIE SETTINGS
# ----------------------------
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False  # False for local development
SESSION_COOKIE_HTTPONLY = True
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 1209600  # 2 weeks

# ----------------------------
# DATABASE CONFIGURATION (MySQL)
# ----------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USER"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': os.getenv("DB_HOST"),
        'PORT': os.getenv("DB_PORT"),
    }
}

# ----------------------------
# CACHE CONFIGURATION
# ----------------------------
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# ----------------------------
# AUTHENTICATION & REST FRAMEWORK
# ----------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# JWT Cookie Auth
REST_USE_JWT = True
JWT_AUTH_COOKIE = "access"
JWT_AUTH_REFRESH_COOKIE = "refresh"

# REST Framework Configuration (COMBINED - only one definition)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'accounts.authentication.CookieJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
    ],
}

# Override dj-rest-auth serializers to use your custom ones
REST_AUTH = {
    'USER_DETAILS_SERIALIZER': 'profile.serializers.UserSerializer',
    'LOGIN_SERIALIZER': 'dj_rest_auth.serializers.LoginSerializer',
}

# ----------------------------
# ALLAUTH & SOCIAL AUTH SETTINGS
# ----------------------------
ACCOUNT_USER_MODEL_USERNAME_FIELD = "username"

# Modern allauth configuration (matches what allauth expects)
ACCOUNT_LOGIN_METHODS = ['email']  # Use email for login
ACCOUNT_SIGNUP_FIELDS = ['email*', 'username*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = "optional"

# Adapters
SOCIALACCOUNT_ADAPTER = "accounts.adapters.MySocialAccountAdapter"
ACCOUNT_ADAPTER = "accounts.adapters.MyAccountAdapter"

# Redirect URLs
LOGIN_REDIRECT_URL = os.getenv("LOGIN_REDIRECT_URL", "http://localhost:8080/auth/google/success")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:8080")

# Social providers
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "APP": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
            "secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
            "key": ""
        },
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    },
    "apple": {
        "APP": {
            "client_id": os.getenv("APPLE_CLIENT_ID", ""),
            "secret": os.getenv("APPLE_CLIENT_SECRET", ""),
        }
    }
}

# Social Account Settings
SOCIALACCOUNT_AUTO_SIGNUP = True  # Automatically create account
SOCIALACCOUNT_LOGIN_ON_GET = True  # Skip confirmation, login directly
SOCIALACCOUNT_EMAIL_VERIFICATION = 'none'
SOCIALACCOUNT_QUERY_EMAIL = False

# SSL/HTTPS Settings
# Set to False for local development, True for production
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=False, cast=bool)
SECURE_HSTS_SECONDS = config('SECURE_HSTS_SECONDS', default=0, cast=int)  # Use 31536000 in production
SECURE_HSTS_INCLUDE_SUBDOMAINS = config('SECURE_HSTS_INCLUDE_SUBDOMAINS', default=False, cast=bool)
SECURE_HSTS_PRELOAD = config('SECURE_HSTS_PRELOAD', default=False, cast=bool)

# Cookie Security
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=False, cast=bool)

# Development vs Production settings
if DEBUG:
    # Local development - no SSL
    SECURE_SSL_REDIRECT = False
    SECURE_HSTS_SECONDS = 0
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
else:
    # Production - with SSL/HTTPS
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

# Add this after the if DEBUG / else block around line 218
if not DEBUG:
    # Trust proxy headers (required for platforms like Heroku, Railway, AWS ELB)
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    
    # Update CORS and CSRF for production domain
    PRODUCTION_DOMAIN = os.getenv("PRODUCTION_DOMAIN", "")
    if PRODUCTION_DOMAIN:
        CORS_ALLOWED_ORIGINS.append(f"https://{PRODUCTION_DOMAIN}")
        CSRF_TRUSTED_ORIGINS.append(f"https://{PRODUCTION_DOMAIN}")
# ----------------------------
# GOOGLE OAUTH CREDENTIALS
# ----------------------------
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = "http://localhost:8000/accounts/google/login/callback/"

# ----------------------------
# EMAIL CONFIGURATION
# ----------------------------
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
DEFAULT_FROM_EMAIL = 'GNM Events <gnmevents95@gmail.com>'

# ----------------------------
# LOGGING CONFIGURATION
# ----------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'accounts': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': False,
        },
    },
}

# ----------------------------
# INTERNATIONALIZATION
# ----------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ----------------------------
# STATIC FILES
# ----------------------------
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  

# ----------------------------
# DEFAULT AUTO FIELD
# ----------------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'