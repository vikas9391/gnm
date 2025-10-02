// src/pages/Profile.tsx
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Mail, Calendar, Shield, Edit2, Save, X, Loader2, 
  Phone, MapPin, Briefcase, Globe, Camera, Trash2, Upload 
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface UserData {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone?: string;
  location?: string;
  bio?: string;
  occupation?: string;
  website?: string;
  profile_image?: string;
  profile_image_url?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface EditableData {
  first_name: string;
  last_name: string;
  username: string;
  phone: string;
  location: string;
  bio: string;
  occupation: string;
  website: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editableData, setEditableData] = useState<EditableData>({
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
    location: "",
    bio: "",
    occupation: "",
    website: "",
  });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/api/auth/custom/me/");
      
      if (response.data) {
        setUserData(response.data);
        setEditableData({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          username: response.data.username || "",
          phone: response.data.phone || "",
          location: response.data.location || "",
          bio: response.data.bio || "",
          occupation: response.data.occupation || "",
          website: response.data.website || "",
        });
        if (response.data.profile_image_url) {
          setImagePreview(response.data.profile_image_url);
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      
      if (error.response?.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your profile.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    handleImageUpload(file);
  };

 const handleImageUpload = async (file: File) => {
  try {
    setUploadingImage(true);
    
    const formData = new FormData();
    formData.append('profile_image', file);

    console.log("Uploading image...");
    
    const response = await axios.patch(
      `${API_BASE}/api/auth/custom/profile/update/`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log("Upload response:", response.data);

    if (response.data) {
      setUserData(response.data);
      
      // Add cache-busting timestamp to avoid browser caching old image
      if (response.data.profile_image_url) {
        const urlWithTimestamp = `${response.data.profile_image_url}?t=${Date.now()}`;
        console.log("Setting image preview:", urlWithTimestamp);
        setImagePreview(urlWithTimestamp);
      }
      
      toast({
        title: "Success",
        description: "Profile image updated successfully.",
      });
      
      // Refetch user data to ensure sync
      setTimeout(() => fetchUserData(), 500);
    }
  } catch (error: any) {
    console.error("Failed to upload image:", error);
    console.error("Error response:", error.response?.data);
    
    const errorMessage = error?.response?.data?.detail || 
                        error?.response?.data?.errors?.profile_image?.[0] ||
                        "Failed to upload image. Please try again.";
    
    toast({
      title: "Upload Failed",
      description: errorMessage,
      variant: "destructive",
    });
    
    // Reset preview on error
    if (userData?.profile_image_url) {
      setImagePreview(userData.profile_image_url);
    } else {
      setImagePreview(null);
    }
  } finally {
    setUploadingImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

const handleDeleteImage = async () => {
  if (!userData?.profile_image_url) return;

  try {
    setUploadingImage(true);
    
    console.log("Deleting profile image...");
    const response = await api.delete("/api/auth/custom/profile/image/");
    
    console.log("Delete response:", response.data);
    
    // Update state with response data
    if (response.data) {
      setUserData(response.data);
      setImagePreview(null);
    }
    
    toast({
      title: "Success",
      description: "Profile image deleted successfully.",
    });
    
    // Refetch to ensure sync
    setTimeout(() => fetchUserData(), 500);
  } catch (error: any) {
    console.error("Failed to delete image:", error);
    
    toast({
      title: "Delete Failed",
      description: "Failed to delete image. Please try again.",
      variant: "destructive",
    });
  } finally {
    setUploadingImage(false);
  }
};
  const handleEditField = (field: string) => {
    setEditingField(field);
  };

  const handleCancelField = (field: keyof EditableData) => {
    setEditingField(null);
    setEditableData(prev => ({
      ...prev,
      [field]: userData?.[field] || ""
    }));
  };

 const handleSaveField = async (field: keyof EditableData) => {
    const value = editableData[field];
    
    // Validation for required fields
    if ((field === "first_name" || field === "last_name" || field === "username") && !value) {
      toast({
        title: "Validation Error",
        description: `${field.replace("_", " ")} is required.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setSavingField(field);
      
      await api.patch("/api/auth/custom/profile/update/", {
        [field]: value
      });
      
      // Refetch complete user data after successful update
      await fetchUserData();
      setEditingField(null);
      
      toast({
        title: "Success",
        description: `${field.replace("_", " ")} has been updated successfully.`,
      });
    } catch (error: any) {
      console.error(`Failed to update ${field}:`, error);
      
      const errorMessage = error?.response?.data?.errors?.[field]?.[0] ||
                          error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          `Failed to update ${field}. Please try again.`;
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSavingField(null);
    }
  };
  
  const handleInputChange = (field: keyof EditableData, value: string) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (
    field: keyof EditableData,
    label: string,
    type: string = "text",
    icon?: any,
    placeholder?: string,
    isTextarea: boolean = false,
    isRequired: boolean = false
  ) => {
    const isEditing = editingField === field;
    const isSaving = savingField === field;
    const Icon = icon;

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="flex items-center justify-between">
          <span className="text-sm font-medium">{label} {isRequired && <span className="text-red-500">*</span>}</span>
          {!isEditing && (
            <Button
              onClick={() => handleEditField(field)}
              variant="ghost"
              size="sm"
              className="h-7 px-2 hover:bg-accent"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </Label>
        {isEditing ? (
          <div className="flex gap-2">
            {isTextarea ? (
              <textarea
                id={field}
                value={editableData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={placeholder}
                className="flex-1 min-h-[100px] p-3 rounded-md border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            ) : (
              <Input
                id={field}
                type={type}
                value={editableData[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={placeholder}
                className="flex-1"
              />
            )}
            <div className="flex gap-1">
              <Button
                onClick={() => handleSaveField(field)}
                size="sm"
                disabled={isSaving}
                className="bg-gradient-hero hover:opacity-90"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => handleCancelField(field)}
                variant="outline"
                size="sm"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className={`p-3 bg-muted/50 rounded-md ${Icon ? 'flex items-center' : ''} min-h-[42px]`}>
            {Icon && <Icon className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />}
            {field === "website" && userData?.[field] ? (
              <a 
                href={userData[field]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline break-all"
              >
                {userData[field]}
              </a>
            ) : (
              <span className="text-sm">{userData?.[field] || <span className="text-muted-foreground italic">Not set</span>}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const getUserInitials = () => {
    if (!userData) return "U";
    const firstInitial = userData.first_name?.charAt(0).toUpperCase() || "";
    const lastInitial = userData.last_name?.charAt(0).toUpperCase() || "";
    return firstInitial + lastInitial || userData.username?.charAt(0).toUpperCase() || "U";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-elegant">
        <div className="container max-w-4xl mx-auto px-4 py-16">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
            <CardContent className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-elegant pt-20">
      <div className="container max-w-4xl mx-auto px-4 py-8">

        {/* Profile Header Card */}
        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury mb-6">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image Section */}
              <div className="relative group">
                <Avatar className="h-28 w-28 text-2xl ring-4 ring-background shadow-lg">
                  {imagePreview ? (
                    <AvatarImage src={imagePreview} alt={userData.username} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-hero text-white text-2xl font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Image Upload Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    
                    {imagePreview && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-white hover:bg-white/20"
                        onClick={handleDeleteImage}
                        disabled={uploadingImage}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-1">
                  {userData.first_name} {userData.last_name}
                </h2>
                <p className="text-muted-foreground mb-2 flex items-center justify-center md:justify-start gap-1">
                  <Mail className="h-4 w-4" />
                  {userData.email}
                </p>
                {userData.occupation && (
                  <p className="text-sm text-muted-foreground mb-3 flex items-center justify-center md:justify-start gap-1">
                    <Briefcase className="h-4 w-4" />
                    {userData.occupation}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <User className="h-3 w-3 mr-1" />
                    {userData.username}
                  </span>
                  
                  {userData.location && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <MapPin className="h-3 w-3 mr-1" />
                      {userData.location}
                    </span>
                  )}
                  
                  {userData.is_staff && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Staff
                    </span>
                  )}
                  
                  {userData.is_superuser && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Super Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Profile Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 pt-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderEditableField("first_name", "First Name", "text", null, "Enter first name", false, true)}
                {renderEditableField("last_name", "Last Name", "text", null, "Enter last name", false, true)}
                {renderEditableField("phone", "Phone Number", "tel", Phone, "+1 (555) 123-4567")}
                {renderEditableField("location", "Location", "text", MapPin, "City, Country")}
                {renderEditableField("occupation", "Occupation", "text", Briefcase, "Software Engineer")}
                {renderEditableField("website", "Website", "url", Globe, "https://example.com")}
              </div>

              <div className="mt-4">
                {renderEditableField("bio", "Bio", "text", null, "Tell us about yourself...", true)}
              </div>
            </div>

            <Separator />

            {/* Account Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Account Information
              </h3>
              
              <div className="space-y-4">
                {renderEditableField("username", "Username", "text", User, "Enter username", false, true)}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="p-3 bg-muted/50 rounded-md flex items-center justify-between min-h-[42px]">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{userData.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground italic">Cannot be changed</span>
                  </div>
                </div>

                {userData.is_staff && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">User ID</Label>
                    <div className="p-3 bg-muted/50 rounded-md flex items-center min-h-[42px]">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">#{userData.id}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </h3>
              <Button
                variant="outline"
                onClick={() => navigate("/forgot-password")}
                className="w-full md:w-auto"
              >
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;