
import React from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { MilestoneTracker } from '@/components/profile/MilestoneTracker';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { mockUserData, Milestone, Activity } from '@/mockData/userData';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { getUserDisplayName, user } = useAuth();
  const [userData, setUserData] = React.useState({
    ...mockUserData,
    name: getUserDisplayName(),
    email: user?.email || mockUserData.email
  });

  const handleProfileUpdate = (updatedData: typeof mockUserData) => {
    setUserData(updatedData);
    // Here we would also send the updated data to the backend
    console.log('Profile updated:', updatedData);
  };

  const handlePhotoUpdate = (photoUrl: string) => {
    setUserData({ ...userData, photoUrl });
    // Here we would also send the updated photo to the backend
    console.log('Profile photo updated:', photoUrl);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      </div>
      
      <div className="px-4 mt-[-50px]">
        <ProfileHeader 
          user={userData} 
          onPhotoUpdate={handlePhotoUpdate}
        />
        
        <div className="mt-6">
          <ProfileInfo 
            user={userData} 
            onProfileUpdate={handleProfileUpdate} 
          />
        </div>
        
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
      
      <NavBar />
    </div>
  );
};

export default ProfilePage;
