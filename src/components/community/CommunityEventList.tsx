
import React from 'react';
import { CalendarClock, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CommunityEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  participants: number;
  imageUrl: string;
}

interface CommunityEventListProps {
  events: CommunityEvent[];
}

export const CommunityEventList: React.FC<CommunityEventListProps> = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
        >
          <div className="h-32 overflow-hidden">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">{event.title}</h3>
            <div className="flex items-center text-gray-500 text-xs mb-2">
              <CalendarClock size={12} className="mr-1" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-gray-500 text-xs mb-3">
              <MapPin size={12} className="mr-1" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-primary">
                <Users size={12} className="mr-1" />
                <span>{event.participants} participants</span>
              </div>
              <Button variant="outline" size="sm" className="text-xs">Join</Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
