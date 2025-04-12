
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white p-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-6">404</h1>
        <p className="text-xl mb-8">Oops! This page has been recycled.</p>
        <Link to="/">
          <Button className="bg-secondary hover:bg-secondary/90 text-white flex items-center">
            <ArrowLeft size={18} className="mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
