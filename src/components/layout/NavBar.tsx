
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, QrCode, Gift, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;
  
  // Determine active tab based on current path
  const getActiveTab = (path: string) => {
    if (path === '/home') return 'home';
    if (path === '/scan') return 'scan';
    if (path === '/rewards') return 'rewards';
    if (path === '/leaderboard') return 'leaderboard';
    if (path === '/profile-settings') return 'profile-settings';
    return '';
  };
  
  const activeTab = getActiveTab(currentPath);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around items-center z-10 shadow-lg">
      <NavItem 
        icon={<Home size={22} />} 
        label="Home" 
        path="/home" 
        isActive={activeTab === 'home'} 
      />
      <NavItem 
        icon={<QrCode size={22} />} 
        label="Scan" 
        path="/scan" 
        isActive={activeTab === 'scan'} 
      />
      <NavItem 
        icon={<Award size={22} />} 
        label="Leaderboard" 
        path="/leaderboard" 
        isActive={activeTab === 'leaderboard'} 
      />
      <NavItem 
        icon={<Gift size={22} />} 
        label="Rewards" 
        path="/rewards" 
        isActive={activeTab === 'rewards'} 
      />
      <NavItem 
        icon={<User size={22} />} 
        label="Profile" 
        path="/profile-settings" 
        isActive={activeTab === 'profile-settings'} 
      />
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, path, isActive }) => {
  return (
    <Link 
      to={path} 
      className="flex flex-col items-center"
    >
      <div className={cn(
        "p-2 rounded-full transition-all",
        isActive ? "text-secondary bg-secondary/10" : "text-gray-500"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-xs",
        isActive ? "text-secondary font-medium" : "text-gray-500"
      )}>
        {label}
      </span>
    </Link>
  );
};
