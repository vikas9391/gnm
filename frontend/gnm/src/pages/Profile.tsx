// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Calendar, Shield, Edit2, Save, X, Loader2 } from "lucide-react";

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
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface EditableData {
  first_name: string;
  last_name: string;
  username: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editableData, setEditableData] = useState<EditableData>({
    first_name: "",
    last_name: "",
    username: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        });
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableData({
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      username: userData?.username || "",
    });
  };

  const handleSave = async () => {
    if (!editableData.first_name || !editableData.last_name || !editableData.username) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const response = await api.patch("/api/auth/custom/profile/update/", editableData);
      
      if (response.data) {
        setUserData(response.data);
        setIsEditing(false);
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          "Failed to update profile. Please try again.";
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof EditableData, value: string) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
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
    <div className="min-h-screen pt-20 bg-gradient-elegant">
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        {/* Profile Header Card */}
        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 text-2xl">
                <AvatarFallback className="bg-gradient-hero text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-1">
                  {userData.first_name} {userData.last_name}
                </h2>
                <p className="text-muted-foreground mb-3">{userData.email}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    <User className="h-3 w-3 mr-1" />
                    {userData.username}
                  </span>
                  
                  {userData.is_staff && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Admin
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

              {!isEditing && (
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  className="mt-4 md:mt-0"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Account Details</span>
              {isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    size="sm"
                    disabled={isSaving}
                    className="bg-gradient-hero"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={editableData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter first name"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      {userData.first_name || "Not set"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={editableData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter last name"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md">
                      {userData.last_name || "Not set"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  {isEditing ? (
                    <Input
                      id="username"
                      value={editableData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      placeholder="Enter username"
                    />
                  ) : (
                    <div className="p-3 bg-muted rounded-md flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {userData.username}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="p-3 bg-muted rounded-md flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {userData.email}
                    <span className="ml-2 text-xs">(Cannot be changed)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>User ID</Label>
                  <div className="p-3 bg-muted rounded-md flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    #{userData.id}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Security Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Security</h3>
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