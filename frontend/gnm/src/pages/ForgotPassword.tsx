// src/pages/ForgotPassword.tsx
import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post("/api/auth/custom/password-reset/", { email });
      
      console.log("Password reset response:", response.data);
      
      setIsEmailSent(true);
      toast({
        title: "Reset Email Sent!",
        description: response.data.detail || "Check your email for password reset instructions."
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // Even on error, show generic message (security best practice)
      setIsEmailSent(true);
      toast({
        title: "Request Processed",
        description: "If an account exists with this email, you will receive reset instructions."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-elegant">
        <div className="container max-w-md mx-auto px-4 py-16">
          <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center text-primary">
                <Mail className="w-5 h-5 mr-2" />
                Check Your Email
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium text-primary">{email}</p>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Didn't receive the email? Check your spam folder.</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setIsEmailSent(false)}
                  className="text-primary hover:underline"
                >
                  Try a different email address
                </Button>
              </div>

              <Link to="/login">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-elegant">
      <div className="container max-w-md mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Enter your email to receive reset instructions</p>
        </div>

        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center text-primary">
              <Mail className="w-5 h-5 mr-2" />
              Forgot Password
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-hero hover:shadow-elegant transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reset Instructions
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-primary hover:underline text-sm flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;