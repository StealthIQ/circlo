
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { 
  BellRing, 
  Lock, 
  Eye, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SettingsPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    toast.success('Logged out successfully');
    logout();
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">NOTIFICATIONS</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <SettingItem 
              icon={<BellRing size={18} />}
              label="Push Notifications"
              action={<Switch />}
            />
            
            <SettingItem 
              icon={<BellRing size={18} />}
              label="Email Notifications"
              action={<Switch />}
            />
          </div>
        </div>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-md mt-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">ACCOUNT & SECURITY</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <Link to="/settings/change-password">
              <SettingItem 
                icon={<Lock size={18} />}
                label="Change Password"
                action={<ChevronRight size={18} className="text-gray-400" />}
              />
            </Link>
            
            <Link to="/settings/privacy">
              <SettingItem 
                icon={<Eye size={18} />}
                label="Privacy Settings"
                action={<ChevronRight size={18} className="text-gray-400" />}
              />
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-md mt-6">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500">HELP & SUPPORT</h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            <Link to="/settings/help">
              <SettingItem 
                icon={<HelpCircle size={18} />}
                label="Help Center"
                action={<ChevronRight size={18} className="text-gray-400" />}
              />
            </Link>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            className="w-full py-3 px-4 bg-white rounded-xl shadow-md flex items-center justify-center text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={18} className="mr-2" />
            <span>Sign Out</span>
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-6">
          Circlo App v1.0.0
        </p>
      </div>
      
      <NavBar />
    </div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  action: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label, action }) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="text-gray-500 mr-3">{icon}</div>
        <span>{label}</span>
      </div>
      <div>{action}</div>
    </div>
  );
};

export default SettingsPage;
