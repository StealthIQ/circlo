
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/home');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center animate-fade-in">
        <div className="text-7xl font-bold text-white mb-4">C</div>
        <h1 className="text-3xl font-bold text-white mb-2">CIRCLO</h1>
        <p className="text-accent mb-10">Recycle. Reward. Repeat.</p>
        
        <div className="space-y-4 w-full">
          <Button 
            className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 rounded-full text-lg w-full"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          
          <Button 
            className="bg-transparent hover:bg-white/10 text-white border border-white px-8 py-6 rounded-full text-lg w-full"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
        </div>
      </div>
      
      <p className="text-white/70 text-sm mt-16">
        Sustainability at your fingertips
      </p>
    </div>
  );
};

export default Index;
