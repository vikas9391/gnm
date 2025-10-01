import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Blog from "./pages/Blog";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import History from "./pages/History";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SocialCallback from "./pages/SocialCallback";
import Profile from "./pages/Profile";
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import GoogleAuthConfirm from './pages/GoogleAuthConfirm';





const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />

          <div className="flex-1">
         
              {/* Public Routes */}
              <Routes>
  {/* Public Routes */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/services" element={<Services />} />
  <Route path="/gallery" element={<Gallery />} />
  <Route path="/blog" element={<Blog />} />
  <Route path="/booking" element={<Booking />} />
  <Route path="/contact" element={<Contact />} />
  
  {/* Authentication Routes */}
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  
  {/* Google OAuth Routes */}
  <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
  <Route path="/social-callback" element={<SocialCallback />} />
  <Route path="/auth/google/confirm" element={<GoogleAuthConfirm />} />
  
  {/* Protected Routes */}
  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

  {/* Catch-all for 404 */}
  <Route path="*" element={<NotFound />} />
</Routes>           
          </div>

          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
