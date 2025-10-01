import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

const GoogleAuthSuccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we're now authenticated
        const response = await api.get('/api/auth/custom/me/');
        
        if (response.data) {
          toast({
            title: 'Login Successful!',
            description: 'Welcome to GNM Events.',
          });
          navigate('/', { replace: true });
        } else {
          throw new Error('Not authenticated');
        }
      } catch (error) {
        toast({
          title: 'Authentication Failed',
          description: 'Please try logging in again.',
          variant: 'destructive',
        });
        navigate('/login', { replace: true });
      }
    };

    verifyAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-white" />
        <p className="text-white text-lg">Completing sign in...</p>
      </div>
    </div>
  );
};

export default GoogleAuthSuccess;