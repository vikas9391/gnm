import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <div className="container-custom text-center py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 404 Visual */}
          <div className="relative">
            <h1 className="text-9xl md:text-[12rem] font-bold text-primary/10 leading-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background px-8 py-4 rounded-lg shadow-elegant">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Page Not Found</h2>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4">
            <p className="text-xl text-muted-foreground">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-muted-foreground">
              Don't worry, let's get you back to planning amazing events!
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <button className="btn-hero px-8 py-3 rounded-lg font-medium transition-all hover:shadow-lg">
                Go Home
              </button>
            </Link>
            <Link to="/services">
              <button className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors">
                View Our Services
              </button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Popular pages:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/about" className="text-primary hover:text-primary-dark transition-colors">
                About Us
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/gallery" className="text-primary hover:text-primary-dark transition-colors">
                Gallery
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/booking" className="text-primary hover:text-primary-dark transition-colors">
                Book Event
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/contact" className="text-primary hover:text-primary-dark transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
