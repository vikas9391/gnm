from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer for reading user profile data"""
    full_name = serializers.ReadOnlyField()
    profile_image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'first_name', 'last_name',
            'full_name', 'phone', 'location', 'bio', 'occupation', 
            'website', 'profile_image', 'profile_image_url',
            'is_staff', 'is_superuser', 'date_joined'
        ]
        read_only_fields = ['id', 'email', 'is_staff', 'is_superuser', 'date_joined']
    
    def get_profile_image_url(self, obj):
        """Get full URL for profile image"""
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    profile_image = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'username',
            'phone', 'location', 'bio', 'occupation', 'website',
            'profile_image'
        ]
    
    def validate_username(self, value):
        """Check if username is unique (excluding current user)"""
        if not value or not value.strip():
            raise serializers.ValidationError("Username cannot be empty.")
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value.strip()
    
    def validate_first_name(self, value):
        """Validate first name"""
        if value is not None and not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        return value.strip() if value else value

    def validate_last_name(self, value):
        """Validate last name"""
        if value is not None and not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        return value.strip() if value else value
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if value:
            cleaned = value.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")
            if len(cleaned) > 20:
                raise serializers.ValidationError("Phone number is too long.")
        return value
    
    def validate_website(self, value):
        """Validate website URL"""
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Website must start with http:// or https://")
        return value
    
    def validate_profile_image(self, value):
        """Validate profile image"""
        if value:
            # Check file size (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Image file size cannot exceed 5MB.")
            
            # Check file type
            allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            if value.content_type not in allowed_types:
                raise serializers.ValidationError("Only JPEG, PNG, GIF, and WebP images are allowed.")
        
        return value