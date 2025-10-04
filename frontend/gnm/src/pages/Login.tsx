// src/pages/Login.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "http://localhost:8000";

console.log("🔍 API_BASE:", API_BASE);
console.log("🔍 ENV:", import.meta.env.VITE_API_BASE_URL);
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send/receive cookies
  headers: {
    "Content-Type": "application/json",
  },
});

function getCSRFCookie(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

type LoginForm = {
  email: string;
  password: string;
};

const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await api.get("/api/auth/custom/csrf/"); // ✅ Fixed endpoint
      } catch (err) {
        console.warn("CSRF fetch failed", err);
      }
    })();
  }, []);

  useEffect(() => {
    // if already logged in (me returns), redirect
    (async () => {
      try {
        const res = await api.get("/api/auth/custom/me/"); // ✅ Fixed endpoint
        if (res?.data) {
          navigate("/", { replace: true });
        }
      } catch {
        // not logged in, continue
      }
    })();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      // ensure CSRF cookie present
      await api.get("/api/auth/custom/csrf/"); // ✅ Fixed endpoint

      await api.post(
        "/api/auth/custom/login/", // ✅ Fixed endpoint
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "X-CSRFToken": getCSRFCookie() || "",
          },
        }
      );

      // optional: fetch /me to load user data or confirm
      await api.get("/api/auth/custom/me/"); // ✅ Fixed endpoint

      toast({
        title: "Login Successful!",
        description: "Welcome back to GMN Events.",
      });

      navigate("/");
    } catch (err: any) {
      console.error("Login error", err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Invalid credentials or server error";
      toast({
        title: "Login Failed",
        description: String(detail),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

// In Login.tsx, update openSocial:
const openSocial = (provider: "google" | "apple") => {
  // Navigate to your confirmation page FIRST
  navigate(`/auth/${provider}/confirm`);
};

const handleContinue = () => {
  const frontendUrl = import.meta.env.VITE_FRONTEND_URL || "http://localhost:8080";
  const redirectUri = `${frontendUrl}/auth/google/callback`;
  const socialUrl = `${API_BASE}/accounts/google/login/?next=${encodeURIComponent(redirectUri)}`;
  window.location.href = socialUrl;
};

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen  bg-gradient-elegant">
      <div className="container max-w-md mx-auto px-4  py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your account</p>
        </div>

        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-luxury">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center text-primary">
              <LogIn className="w-5 h-5 mr-2" />
              Sign In
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
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded border-gray-300" />
                  <Label htmlFor="remember" className="text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                 variant="outline"
                className="w-full bg-gradient-hero hover:shadow-elegant transition-all duration-300 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <Separator className="my-6" />

            {/* Social Login Options */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => openSocial("google")}>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* <Button variant="outline" className="w-full" onClick={() => openSocial("apple")}>
                <Mail className="w-4 h-4 mr-2" />
                Continue with Apple
              </Button> */}
            </div>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;