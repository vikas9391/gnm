// src/pages/ResetPassword.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { toast } = useToast();

  // Validate token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!uid || !token) {
        toast({
          title: "Invalid Link",
          description: "The password reset link is invalid or incomplete.",
          variant: "destructive"
        });
        setIsValidatingToken(false);
        setIsTokenValid(false);
        return;
      }

      try {
        const response = await api.post("/api/auth/custom/password-reset/validate/", {
          uid,
          token
        });

        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          toast({
            title: "Invalid or Expired Link",
            description: response.data.detail || "This password reset link is no longer valid.",
            variant: "destructive"
          });
          setIsTokenValid(false);
        }
      } catch (error: any) {
        console.error("Token validation error:", error);
        toast({
          title: "Validation Error",
          description: "Unable to validate reset link. Please try again.",
          variant: "destructive"
        });
        setIsTokenValid(false);
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please ensure both passwords are identical.",
        variant: "destructive"
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post("/api/auth/custom/password-reset/confirm/", {
        uid,
        token,
        password: formData.password
      });

      console.log("Password reset response:", response.data);
      
      setIsSuccess(true);
      toast({
        title: "Password Reset Successful!",
        description: response.data.detail || "Your password has been updated successfully."
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message || 
                          "Failed to reset password. Please try again.";
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Loading state while validating token
  if (isValidatingToken) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-elegant">
        <div className="container max-w-md mx-auto px-4 py-16">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Validating reset link...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!isTokenValid) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-elegant">
        <div className="container max-w-md mx-auto px-4 py-16">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  This password reset link is invalid or has expired.
                </p>
                <p className="text-sm text-muted-foreground">
                  Password reset links are only valid for 24 hours.
                </p>
              </div>

              <div className="space-y-3">
                <Link to="/forgot-password">
                  <Button className="w-full bg-gradient-hero hover:shadow-elegant transition-all duration-300">
                    Request New Reset Link
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-elegant">
        <div className="container max-w-md mx-auto px-4 py-16">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center text-primary">
                <CheckCircle className="w-5 h-5 mr-2" />
                Password Reset Complete
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Your password has been successfully updated.
                </p>
                <p className="text-sm text-muted-foreground">
                  You can now sign in with your new password.
                </p>
              </div>

              <Link to="/login">
                <Button className="w-full bg-gradient-hero hover:shadow-elegant transition-all duration-300">
                  Continue to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Reset password form
  return (
    <div className="min-h-screen pt-20 bg-gradient-elegant">
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Set New Password</h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center text-primary">
              <Lock className="w-5 h-5 mr-2" />
              Reset Password
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1 h-8 w-8 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-hero hover:shadow-elegant hover:text-white transition-all duration-300 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-primary hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;