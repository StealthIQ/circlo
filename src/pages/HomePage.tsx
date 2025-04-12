
import React, { useState } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Trophy, Recycle, QrCode, TrendingUp, Award, Gift, Users, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { QuoteCarousel } from '@/components/sustainability/QuoteCarousel';
import { motion } from 'framer-motion';
import { CommunityEventList } from '@/components/community/CommunityEventList';

const HomePage: React.FC = () => {
  const { getUserDisplayName } = useAuth();
  const navigate = useNavigate();
  
  // Sample community events
  const communityEvents = [
    {
      id: 1,
      title: "Beach Cleanup Drive",
      location: "Marina Beach, Chennai",
      date: "Apr 22, 2023 • 9:00 AM",
      participants: 42,
      imageUrl: "/src/assets/images/community_events/beach_cleanup.jpg"
    },
    {
      id: 2,
      title: "Tree Plantation Workshop",
      location: "Cubbon Park, Bangalore",
      date: "Apr 30, 2023 • 10:30 AM",
      participants: 35,
      imageUrl: "/src/assets/images/community_events/tree_plantation.jpg"
    },
    {
      id: 3,
      title: "Recycling Workshop",
      location: "Community Center, Delhi",
      date: "May 5, 2023 • 11:00 AM",
      participants: 28,
      imageUrl: "/src/assets/images/community_events/recycling_workshop.jpg"
    }
  ];
  
  const stats = [
    { 
      label: 'Total Points', 
      value: '1,250', 
      icon: <Trophy className="text-yellow-500" />,
      change: '+150 this week' 
    },
    { 
      label: 'Items Recycled', 
      value: '87', 
      icon: <Recycle className="text-secondary" />,
      change: '+12 this week' 
    },
    { 
      label: 'CO₂ Saved', 
      value: '35kg', 
      icon: <Leaf className="text-green-600" />,
      change: '+4kg this week'
    },
  ];

  const recentScans = [
    {
      id: 1,
      location: 'Central Park Bin',
      date: 'Today, 10:30 AM',
      points: 50,
    },
    {
      id: 2,
      location: 'Main Street Bin',
      date: 'Yesterday, 3:15 PM',
      points: 25,
    },
    {
      id: 3,
      location: 'City Hall Bin',
      date: '2 days ago, 11:45 AM',
      points: 35,
    },
  ];

  const handleScanNow = () => {
    navigate('/scan');
  };

  const handleViewRewards = () => {
    navigate('/rewards');
  };
  
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  const displayName = getUserDisplayName();
  const userInitial = displayName.charAt(0);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-lg"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-1">Hi, {displayName}</h1>
            <p className="text-white/80 text-sm">Welcome back to Circlo</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile-settings')} 
            className="cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center drop-shadow-md">
              <span className="text-xl font-semibold">{userInitial}</span>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-3">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleScanNow}
              className="bg-white text-primary hover:bg-white/90 flex items-center justify-center py-6 w-full shadow-md" 
            >
              <QrCode className="mr-2" />
              <span>Scan Now</span>
            </Button>
          </motion.div>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleViewRewards}
              className="bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center py-6 w-full shadow-md" 
            >
              <Gift className="mr-2" />
              <span>Rewards</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Sustainability Quote */}
      <div className="px-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold mb-4 text-primary">Today's Inspiration</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
            <QuoteCarousel interval={15000} />
          </div>
        </motion.div>
      </div>
      
      {/* Stats Cards */}
      <div className="px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Your Impact</h2>
            <Button 
              onClick={handleViewLeaderboard} 
              variant="ghost" 
              size="sm"
              className="text-secondary text-sm flex items-center"
            >
              Leaderboard <ArrowRight className="ml-1" size={16} />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex justify-center mb-2">
                  <div className="p-2 bg-gray-50 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  <p className="text-xs text-secondary mt-1">{stat.change}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Recent Activity */}
      <div className="px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Recent Scans</h2>
            <button 
              className="text-secondary text-sm flex items-center"
              onClick={() => navigate('/profile-settings')}
            >
              View All <ArrowRight className="ml-1" size={14} />
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {recentScans.map((scan, index) => (
              <motion.div 
                key={scan.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`px-4 py-3 flex items-center justify-between ${
                  index !== recentScans.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Recycle size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{scan.location}</p>
                    <p className="text-xs text-gray-500">{scan.date}</p>
                  </div>
                </div>
                <div className="text-secondary font-medium">
                  +{scan.points} pts
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Community Events Section */}
      <div className="px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Community Events</h2>
            <button className="text-secondary text-sm flex items-center">
              View All <ArrowRight className="ml-1" size={14} />
            </button>
          </div>
          
          <CommunityEventList events={communityEvents} />
        </motion.div>
      </div>
      
      {/* Achievements Section */}
      <div className="px-4 mt-8 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Achievements</h2>
            <button 
              className="text-secondary text-sm flex items-center"
              onClick={() => toast.info('Achievements section coming soon!')}
            >
              View All <ArrowRight className="ml-1" size={14} />
            </button>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Award size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Eco Warrior</p>
                  <p className="text-xs text-gray-500">Recycle 100 items</p>
                </div>
              </div>
              <div className="text-sm font-medium">
                87/100
              </div>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1, delay: 1 }}
                className="h-full bg-secondary rounded-full"
              ></motion.div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <TrendingUp size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Point Collector</p>
                  <p className="text-xs text-gray-500">Earn 2,000 points</p>
                </div>
              </div>
              <div className="text-sm font-medium">
                1250/2000
              </div>
            </div>
            
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "62.5%" }}
                transition={{ duration: 1, delay: 1.2 }}
                className="h-full bg-blue-500 rounded-full"
              ></motion.div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <NavBar />
    </div>
  );
};

export default HomePage;
