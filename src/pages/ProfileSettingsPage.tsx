import React, { useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { MilestoneTracker } from '@/components/profile/MilestoneTracker';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { mockUserData, Milestone, Activity } from '@/mockData/userData';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Lock, 
  Eye, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  User,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProfileSettingsPage: React.FC = () => {
  const { getUserDisplayName, user, logout } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({
    ...mockUserData,
    name: getUserDisplayName(),
    email: user?.email || mockUserData.email
  });

  const handleProfileUpdate = (updatedData: typeof mockUserData) => {
    setUserData(updatedData);
    // Here we would also send the updated data to the backend
    console.log('Profile updated:', updatedData);
    toast.success("Profile updated successfully");
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    setUserData({ ...userData, photoUrl });
    // Here we would also send the updated photo to the backend
    console.log('Profile photo updated:', photoUrl);
    toast.success("Profile photo updated successfully");
  };

  const handleLogout = () => {
    toast.success('Logged out successfully');
    logout();
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
      </div>
      
      <div className="px-4 mt-[-50px] mb-6">
        <ProfileHeader 
          user={userData} 
          onPhotoUpdate={handlePhotoUpdate}
        />
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center justify-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-4">
            <div>
              <ProfileInfo 
                user={userData} 
                onProfileUpdate={handleProfileUpdate} 
              />
              
              <div className="my-8">
                <h2 className="text-lg font-semibold mb-4 text-primary">Recycling Milestones</h2>
                <MilestoneTracker 
                  currentPoints={userData.points} 
                  milestones={userData.milestones as Milestone[]}
                />
              </div>
              
              <div className="my-8">
                <h2 className="text-lg font-semibold mb-4 text-primary">Recent Activity</h2>
                <RecentActivity activities={userData.recentActivity as Activity[]} />
              </div>
            </div>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-4">
            <div>
              <div className="bg-white rounded-xl overflow-hidden shadow-md">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500">NOTIFICATIONS</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <SettingItem 
                    icon={<Bell size={18} />}
                    label="Push Notifications"
                    action={<Switch />}
                  />
                  
                  <SettingItem 
                    icon={<Bell size={18} />}
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
              
              {/* Admin Access - would be conditional based on user role in a real app */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md mt-6">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500">ADMIN</h3>
                </div>
                
                <div className="divide-y divide-gray-100">
                  <div onClick={goToAdmin}>
                    <SettingItem 
                      icon={<ShieldAlert size={18} className="text-primary" />}
                      label="Admin Dashboard"
                      action={<ChevronRight size={18} className="text-gray-400" />}
                    />
                  </div>
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
          </TabsContent>
        </Tabs>
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

export default ProfileSettingsPage;
