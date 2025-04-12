
type MilestoneIcon = 'leaf' | 'trophy' | 'award' | 'star' | 'alert';
type ActivityType = 'scan' | 'redemption' | 'reward';

export const mockUserData = {
  id: '12345',
  name: 'Arjun R',
  email: 'arjun@circlo.com',
  phone: '91 8610999342',
  address: 'Chennai, Pallavaram 60064',
  photoUrl: '',
  points: 350,
  level: 'Eco Enthusiast',
  milestones: [
    {
      id: 1,
      label: 'Beginner',
      points: 0,
      icon: 'leaf' as MilestoneIcon
    },
    {
      id: 2,
      label: 'Recycler',
      points: 100,
      icon: 'trophy' as MilestoneIcon
    },
    {
      id: 3,
      label: 'Eco Warrior',
      points: 300,
      icon: 'award' as MilestoneIcon
    },
    {
      id: 4,
      label: 'Sustainability Champion',
      points: 500,
      icon: 'star' as MilestoneIcon
    },
    {
      id: 5,
      label: 'Earth Guardian',
      points: 1000,
      icon: 'alert' as MilestoneIcon
    }
  ],
  recentActivity: [
    {
      id: 'act1',
      type: 'scan' as ActivityType,
      points: 50,
      location: 'Downtown Recycling Center',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      description: 'Recycled plastic bottles'
    },
    {
      id: 'act2',
      type: 'scan' as ActivityType,
      points: 30,
      location: 'City Park',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      description: 'Recycled aluminum cans'
    },
    {
      id: 'act3',
      type: 'redemption' as ActivityType,
      location: 'Green Store',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      description: 'Redeemed 200 points for a reusable water bottle'
    },
    {
      id: 'act4',
      type: 'scan' as ActivityType,
      points: 40,
      location: 'Community Center',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      description: 'Recycled paper products'
    }
  ]
};

// Export these types for use in other files
export type Milestone = {
  id: number;
  label: string;
  points: number;
  icon: MilestoneIcon;
};

export type Activity = {
  id: string;
  type: ActivityType;
  points?: number;
  location: string;
  timestamp: Date;
  description: string;
};
