
import React, { useState, useEffect } from 'react';
import { NavBar } from '@/components/layout/NavBar';
import { Trophy, Award, Users, Calendar, Clock, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from 'framer-motion';

// Types for our leaderboard data
interface LeaderboardUser {
  id: string;
  name: string;
  points: number;
  avatarUrl?: string;
  rank: number;
  isCurrentUser?: boolean;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<{
    daily: LeaderboardUser[];
    weekly: LeaderboardUser[];
    allTime: LeaderboardUser[];
  }>({
    daily: [],
    weekly: [],
    allTime: [],
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be a fetch from Supabase
    setTimeout(() => {
      const mockData = {
        daily: [
          { id: '1', name: 'Raj Kumar', points: 250, rank: 1 },
          { id: '2', name: 'Priya Sharma', points: 230, rank: 2 },
          { id: '3', name: 'Vikram Singh', points: 210, rank: 3 },
          { id: '4', name: 'Meera Patel', points: 180, rank: 4 },
          { id: '5', name: 'Arjun Nair', points: 170, rank: 5, isCurrentUser: true },
          { id: '6', name: 'Sunita Reddy', points: 160, rank: 6 },
          { id: '7', name: 'Karan Malhotra', points: 150, rank: 7 },
          { id: '8', name: 'Ananya Das', points: 140, rank: 8 },
          { id: '9', name: 'Rohit Verma', points: 130, rank: 9 },
          { id: '10', name: 'Divya Kapoor', points: 120, rank: 10 },
        ],
        weekly: [
          { id: '3', name: 'Vikram Singh', points: 890, rank: 1 },
          { id: '2', name: 'Priya Sharma', points: 760, rank: 2 },
          { id: '1', name: 'Raj Kumar', points: 720, rank: 3 },
          { id: '5', name: 'Arjun Nair', points: 680, rank: 4, isCurrentUser: true },
          { id: '4', name: 'Meera Patel', points: 650, rank: 5 },
          { id: '7', name: 'Karan Malhotra', points: 610, rank: 6 },
          { id: '6', name: 'Sunita Reddy', points: 590, rank: 7 },
          { id: '9', name: 'Rohit Verma', points: 540, rank: 8 },
          { id: '8', name: 'Ananya Das', points: 520, rank: 9 },
          { id: '10', name: 'Divya Kapoor', points: 480, rank: 10 },
        ],
        allTime: [
          { id: '2', name: 'Priya Sharma', points: 5230, rank: 1 },
          { id: '3', name: 'Vikram Singh', points: 4890, rank: 2 },
          { id: '1', name: 'Raj Kumar', points: 4720, rank: 3 },
          { id: '6', name: 'Sunita Reddy', points: 3960, rank: 4 },
          { id: '4', name: 'Meera Patel', points: 3850, rank: 5 },
          { id: '7', name: 'Karan Malhotra', points: 3610, rank: 6 },
          { id: '5', name: 'Arjun Nair', points: 3580, rank: 7, isCurrentUser: true },
          { id: '8', name: 'Ananya Das', points: 3320, rank: 8 },
          { id: '9', name: 'Rohit Verma', points: 3140, rank: 9 },
          { id: '10', name: 'Divya Kapoor', points: 2980, rank: 10 },
        ]
      };
      
      setLeaderboardData(mockData);
      setIsLoading(false);
    }, 1000); // Simulating fetch delay
  }, []);
  
  // Function to render trophy/medal for top 3
  const renderRankIcon = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="absolute -top-1 -right-1">
          <div className="bg-yellow-400 p-1 rounded-full shadow-lg">
            <Trophy size={14} className="text-white" />
          </div>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="absolute -top-1 -right-1">
          <div className="bg-gray-300 p-1 rounded-full shadow-md">
            <Award size={14} className="text-white" />
          </div>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="absolute -top-1 -right-1">
          <div className="bg-amber-600 p-1 rounded-full shadow-md">
            <Award size={14} className="text-white" />
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Function to get avatar styles based on rank
  const getAvatarStyles = (rank: number, isCurrentUser?: boolean) => {
    if (isCurrentUser) {
      return "ring-2 ring-primary ring-offset-2";
    }
    
    switch (rank) {
      case 1:
        return "ring-2 ring-yellow-400 ring-offset-2";
      case 2:
        return "ring-2 ring-gray-300 ring-offset-2";
      case 3:
        return "ring-2 ring-amber-600 ring-offset-2";
      default:
        return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const getUserBgColor = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
    if (rank === 2) return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
    if (rank === 3) return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
    return "bg-white";
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-primary text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-lg"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            <Trophy className="mr-2" /> Leaderboard
          </h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users size={14} /> {leaderboardData.allTime.length}
          </Badge>
        </div>
        <p className="text-primary-foreground/80 text-sm mt-1">
          See how you rank against other eco-warriors
        </p>
      </motion.div>
      
      <div className="px-4 pt-6">
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily" className="flex items-center gap-1">
              <Calendar size={14} /> Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-1">
              <BarChart3 size={14} /> Weekly
            </TabsTrigger>
            <TabsTrigger value="allTime" className="flex items-center gap-1">
              <Clock size={14} /> All Time
            </TabsTrigger>
          </TabsList>
          
          {['daily', 'weekly', 'allTime'].map((period) => (
            <TabsContent key={period} value={period} className="space-y-4">
              {isLoading ? (
                // Loading state
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="bg-white h-16 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Top 3 podium for larger screens */}
                  <div className="hidden md:flex justify-center items-end h-48 mb-6 mt-2">
                    {/* 2nd Place */}
                    <div className="w-1/4 mx-2">
                      <div className="flex flex-col items-center">
                        <Avatar className={`w-16 h-16 ${getAvatarStyles(2)}`}>
                          <AvatarImage src={leaderboardData[period as keyof typeof leaderboardData][1]?.avatarUrl} />
                          <AvatarFallback className="bg-gray-300 text-white">
                            {getInitials(leaderboardData[period as keyof typeof leaderboardData][1]?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-2 text-center">
                          <p className="font-semibold">{leaderboardData[period as keyof typeof leaderboardData][1]?.name}</p>
                          <Badge variant="outline" className="mt-1">{leaderboardData[period as keyof typeof leaderboardData][1]?.points} pts</Badge>
                        </div>
                        <div className="bg-gray-300 h-24 w-full rounded-t-md mt-3 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">2</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 1st Place */}
                    <div className="w-1/3 mx-2 -mb-4">
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <Avatar className={`w-20 h-20 ${getAvatarStyles(1)}`}>
                            <AvatarImage src={leaderboardData[period as keyof typeof leaderboardData][0]?.avatarUrl} />
                            <AvatarFallback className="bg-yellow-400 text-white">
                              {getInitials(leaderboardData[period as keyof typeof leaderboardData][0]?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute -top-4 -right-2">
                            <Trophy size={24} className="text-yellow-500" />
                          </div>
                        </div>
                        <div className="mt-2 text-center">
                          <p className="font-semibold">{leaderboardData[period as keyof typeof leaderboardData][0]?.name}</p>
                          <Badge className="mt-1 bg-yellow-500">{leaderboardData[period as keyof typeof leaderboardData][0]?.points} pts</Badge>
                        </div>
                        <div className="bg-yellow-400 h-32 w-full rounded-t-md mt-3 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">1</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 3rd Place */}
                    <div className="w-1/4 mx-2">
                      <div className="flex flex-col items-center">
                        <Avatar className={`w-16 h-16 ${getAvatarStyles(3)}`}>
                          <AvatarImage src={leaderboardData[period as keyof typeof leaderboardData][2]?.avatarUrl} />
                          <AvatarFallback className="bg-amber-600 text-white">
                            {getInitials(leaderboardData[period as keyof typeof leaderboardData][2]?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-2 text-center">
                          <p className="font-semibold">{leaderboardData[period as keyof typeof leaderboardData][2]?.name}</p>
                          <Badge variant="outline" className="mt-1">{leaderboardData[period as keyof typeof leaderboardData][2]?.points} pts</Badge>
                        </div>
                        <div className="bg-amber-600 h-16 w-full rounded-t-md mt-3 flex items-center justify-center">
                          <span className="text-lg font-bold text-white">3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Leaderboard list */}
                  <div className="space-y-3">
                    {leaderboardData[period as keyof typeof leaderboardData].map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative rounded-xl p-3 border flex items-center ${
                          user.isCurrentUser 
                            ? "border-primary/30 bg-primary/5" 
                            : `border-gray-100 ${getUserBgColor(user.rank)}`
                        }`}
                      >
                        <div className="w-8 flex justify-center mr-3">
                          <span className={`font-bold ${user.rank <= 3 ? "text-lg" : ""} ${
                            user.rank === 1 
                              ? "text-yellow-500" 
                              : user.rank === 2 
                              ? "text-gray-500" 
                              : user.rank === 3 
                              ? "text-amber-600" 
                              : "text-gray-400"
                          }`}>
                            {user.rank}
                          </span>
                        </div>
                        
                        <div className="relative">
                          <Avatar className={`h-10 w-10 ${getAvatarStyles(user.rank, user.isCurrentUser)}`}>
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className={`
                              ${user.rank === 1 ? "bg-yellow-400" : 
                                user.rank === 2 ? "bg-gray-300" : 
                                user.rank === 3 ? "bg-amber-600" : 
                                "bg-primary/20"} 
                              text-white`}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          {renderRankIcon(user.rank)}
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <p className="font-medium">
                            {user.name}
                            {user.isCurrentUser && <span className="ml-2 text-xs text-primary">(You)</span>}
                          </p>
                        </div>
                        
                        <div>
                          <Badge className={`${
                            user.rank === 1 ? "bg-yellow-500 hover:bg-yellow-600" : 
                            user.rank === 2 ? "bg-gray-500 hover:bg-gray-600" : 
                            user.rank === 3 ? "bg-amber-600 hover:bg-amber-700" : 
                            "bg-secondary hover:bg-secondary/80"
                          }`}>
                            {user.points} pts
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      <NavBar />
    </div>
  );
};

export default LeaderboardPage;
