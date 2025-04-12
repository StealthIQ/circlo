
import React from 'react';
import { Trophy, Leaf, AlertCircle, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Milestone {
  id: number;
  label: string;
  points: number;
  icon: 'trophy' | 'leaf' | 'alert' | 'award' | 'star';
}

interface MilestoneTrackerProps {
  currentPoints: number;
  milestones: Milestone[];
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({ currentPoints, milestones }) => {
  const sortedMilestones = [...milestones].sort((a, b) => a.points - b.points);
  
  // Find the next milestone
  const nextMilestone = sortedMilestones.find(milestone => milestone.points > currentPoints);
  const currentMilestone = nextMilestone 
    ? sortedMilestones[sortedMilestones.indexOf(nextMilestone) - 1] 
    : sortedMilestones[sortedMilestones.length - 1];
    
  // Calculate progress percentage to next milestone
  const prevMilestonePoints = currentMilestone ? currentMilestone.points : 0;
  const nextMilestonePoints = nextMilestone ? nextMilestone.points : prevMilestonePoints;
  const progressPercentage = nextMilestone
    ? ((currentPoints - prevMilestonePoints) / (nextMilestonePoints - prevMilestonePoints)) * 100
    : 100;

  // Function to render the appropriate icon
  const renderIcon = (iconName: string, className: string = "") => {
    const iconProps = { size: 16, className };
    switch (iconName) {
      case 'trophy':
        return <Trophy {...iconProps} />;
      case 'leaf':
        return <Leaf {...iconProps} />;
      case 'alert':
        return <AlertCircle {...iconProps} />;
      case 'award':
        return <Award {...iconProps} />;
      case 'star':
        return <Star {...iconProps} />;
      default:
        return <Trophy {...iconProps} />;
    }
  };

  // Function to get a milestone's background color based on completion
  const getMilestoneBackground = (milestone: Milestone, isCompleted: boolean) => {
    if (!isCompleted) return "bg-gray-100";
    
    switch (milestone.icon) {
      case 'trophy':
        return "bg-yellow-400";
      case 'leaf':
        return "bg-green-500";
      case 'award':
        return "bg-purple-500";
      case 'star':
        return "bg-blue-500";
      default:
        return "bg-secondary";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
    >
      {/* Current progress */}
      <div className="mb-8">
        {nextMilestone ? (
          <>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{currentPoints} points</span>
              <span className="text-gray-500">{nextMilestonePoints} points</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-secondary rounded-full"
              />
            </div>
            <p className="text-center text-sm mt-3 text-gray-600">
              <span className="font-medium text-secondary">{nextMilestone.points - currentPoints} points</span> to unlock {nextMilestone.label}
            </p>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center justify-center p-3 bg-green-50 rounded-lg border border-green-100"
          >
            <Star className="text-yellow-500 mr-2" />
            <p className="text-center text-sm font-medium text-green-600">
              You've reached all milestones! 🎉
            </p>
          </motion.div>
        )}
      </div>
      
      {/* Pearl style roadmap */}
      <div className="relative flex justify-between items-center px-2 mt-6">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
        
        {/* Milestone pearls */}
        {sortedMilestones.map((milestone, index) => {
          const isCompleted = currentPoints >= milestone.points;
          const isCurrent = currentMilestone?.id === milestone.id;
          
          return (
            <motion.div 
              key={milestone.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="z-10 flex flex-col items-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1, y: -3 }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center mb-3 border-2 transition-all duration-300 ease-in-out",
                  isCompleted 
                    ? `${getMilestoneBackground(milestone, true)} text-white border-transparent` 
                    : "bg-gray-100 text-gray-400 border-gray-200",
                  isCurrent && "ring-4 ring-accent/30"
                )}
              >
                {renderIcon(milestone.icon, isCompleted ? "text-white" : "")}
              </motion.div>
              <span className={cn(
                "text-xs font-medium text-center max-w-[70px] line-clamp-2",
                isCompleted ? "text-secondary" : "text-gray-500"
              )}>
                {milestone.label}
              </span>
              <span className="text-[10px] text-gray-400 mt-1 font-mono">
                {milestone.points} pts
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
