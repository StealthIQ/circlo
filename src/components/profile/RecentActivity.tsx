
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Recycle, MapPin, Plus, Gift, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserActivities } from '@/services/profileService';
import { RecyclingActivity } from '@/integrations/supabase/client';

interface Activity {
  id: string;
  type: 'scan' | 'redemption' | 'reward';
  points?: number;
  location?: string;
  timestamp: Date;
  description: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities: propActivities }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>(propActivities);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      loadUserActivities();
    } else {
      setActivities(propActivities);
    }
  }, [user, propActivities]);
  
  const loadUserActivities = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { activities: userActivities, error } = await getUserActivities(user.id, 10);
      
      if (error) throw error;
      
      if (userActivities && userActivities.length > 0) {
        const formattedActivities = userActivities.map((activity: RecyclingActivity) => ({
          id: activity.id,
          // Cast the type to ensure it matches our Activity interface
          type: (activity.qr_code ? 'scan' : 'redemption') as 'scan' | 'redemption',
          points: activity.points,
          location: 'Unknown location',
          timestamp: new Date(activity.timestamp),
          description: activity.description
        }));
        
        setActivities(formattedActivities);
      } else {
        setActivities(propActivities);
      }
    } catch (error) {
      console.error('Error loading user activities:', error);
      setActivities(propActivities);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="divide-y divide-gray-100">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'scan':
        return <Recycle className="text-secondary" size={18} />;
      case 'redemption':
        return <Gift className="text-orange-500" size={18} />;
      case 'reward':
        return <Award className="text-purple-500" size={18} />;
      default:
        return <Recycle className="text-secondary" size={18} />;
    }
  };
  
  const timestamp = activity.timestamp instanceof Date 
    ? activity.timestamp 
    : new Date(activity.timestamp);
  
  return (
    <div className="p-4 flex">
      <div className="mr-4 mt-1">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          {getActivityIcon()}
        </div>
      </div>
      
      <div className="flex-1">
        <p className="font-medium">{activity.description}</p>
        
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
          <span>
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
          
          {activity.location && (
            <span className="flex items-center">
              <MapPin size={12} className="mr-1" />
              {activity.location}
            </span>
          )}
          
          {activity.points && (
            <span className="font-medium text-secondary">
              +{activity.points} points
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
