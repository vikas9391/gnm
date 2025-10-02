import os
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserProfileUpdateSerializer
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get current authenticated user's profile data
    Endpoint: GET /api/auth/custom/me/
    """
    try:
        # Refresh from database to get latest data
        request.user.refresh_from_db()
        user = request.user
        
        logger.info(f"MeView called for user: {user.email}")
        logger.info(f"User model: {user.__class__.__name__}")
        logger.info(f"User ID: {user.id}")
        logger.info(f"User data - phone: {user.phone}")
        logger.info(f"User data - location: {user.location}")
        logger.info(f"User data - bio: {user.bio}")
        logger.info(f"User data - occupation: {user.occupation}")
        logger.info(f"User data - website: {user.website}")
        logger.info(f"Profile image field: {user.profile_image}")
        
        # Serialize with context to build absolute URLs
        serializer = UserSerializer(user, context={'request': request})
        serialized_data = serializer.data
        
        logger.info(f"Serializer class: {serializer.__class__.__name__}")
        logger.info(f"Serializer fields: {list(serializer.fields.keys())}")
        logger.info(f"Serialized data keys: {list(serialized_data.keys())}")
        logger.info(f"Serialized data: {serialized_data}")
        
        # Double check each field
        for field in ['phone', 'location', 'bio', 'occupation', 'website']:
            logger.info(f"Field '{field}' in response: {serialized_data.get(field)}")
        
        logger.info(f"Response size: {len(str(serialized_data))} chars")
        
        return Response(serialized_data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.exception(f"Error fetching user profile: {str(e)}")
        return Response(
            {'detail': 'Failed to fetch user data.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['PATCH', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def update_user_profile(request):
    """
    Update current user's profile information
    Endpoint: PATCH /api/auth/custom/profile/update/
    Supports both JSON data and multipart/form-data for image uploads
    """
    try:
        user = request.user
        logger.info(f"=== Profile update request from: {user.email} ===")
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request data: {request.data}")
        logger.info(f"Request FILES: {request.FILES}")
        logger.info(f"Content-Type: {request.content_type}")
        logger.info(f"Current profile_image: {user.profile_image}")
        
        # Handle old profile image deletion if new image is uploaded
        if 'profile_image' in request.FILES and user.profile_image:
            try:
                old_image_path = user.profile_image.path
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
                    logger.info(f"Deleted old image: {old_image_path}")
            except Exception as e:
                logger.warning(f"Could not delete old image: {str(e)}")
        
        # Use partial=True for PATCH, False for PUT
        partial = request.method == 'PATCH'
        
        serializer = UserProfileUpdateSerializer(
            user, 
            data=request.data, 
            partial=partial,
            context={'request': request}
        )
        
        if serializer.is_valid():
            updated_user = serializer.save()
            logger.info("Profile saved to database")
            logger.info(f"Updated fields - phone: {updated_user.phone}, location: {updated_user.location}")
            logger.info(f"Updated fields - bio: {updated_user.bio}, occupation: {updated_user.occupation}")
            logger.info(f"Updated fields - website: {updated_user.website}")
            logger.info(f"Updated profile_image field: {updated_user.profile_image}")
            
            if updated_user.profile_image:
                logger.info(f"Image path: {updated_user.profile_image.path}")
                logger.info(f"Image URL: {updated_user.profile_image.url}")
                logger.info(f"File exists: {os.path.exists(updated_user.profile_image.path)}")
            
            # Refresh from database to ensure we have the latest data
            updated_user.refresh_from_db()
            
            # Return complete user data using UserSerializer
            user_serializer = UserSerializer(updated_user, context={'request': request})
            
            logger.info(f"Returning complete user data: {user_serializer.data}")
            logger.info(f"Returning profile_image_url: {user_serializer.data.get('profile_image_url')}")
            logger.info("=== Profile update complete ===\n")
            
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        
        # Log validation errors
        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            {
                'detail': 'Validation failed',
                'errors': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    except Exception as e:
        logger.exception(f"Profile update error: {str(e)}")
        return Response(
            {'detail': f'Failed to update profile: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_image(request):
    """
    Delete current user's profile image
    Endpoint: DELETE /api/auth/custom/profile/image/
    """
    try:
        user = request.user
        logger.info(f"=== Delete profile image for: {user.email} ===")
        
        if user.profile_image:
            try:
                old_image_path = user.profile_image.path
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
                    logger.info(f"Deleted image file: {old_image_path}")
            except Exception as e:
                logger.warning(f"Could not delete image file: {str(e)}")
            
            # Clear database field
            user.profile_image = None
            user.save()
            user.refresh_from_db()
            
            logger.info("Profile image cleared from database")
            
            # Return updated user data
            user_serializer = UserSerializer(user, context={'request': request})
            logger.info("=== Delete complete ===\n")
            return Response(user_serializer.data, status=status.HTTP_200_OK)
        
        logger.warning("No profile image to delete")
        return Response(
            {'detail': 'No profile image to delete'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    except Exception as e:
        logger.exception(f"Error deleting profile image: {str(e)}")
        return Response(
            {'detail': 'Failed to delete profile image'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )