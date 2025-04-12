
import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { updateProfilePhoto } from '@/services/profileService';
import { toast } from 'sonner';
import { storage } from '@/utils/supabaseHelpers';

interface ProfileHeaderProps {
  user: {
    name: string;
    photoUrl?: string;
    points: number;
    level: string;
  };
  onPhotoUpdate: (photoUrl: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onPhotoUpdate }) => {
  const { user: authUser, refreshProfile } = useAuth();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!authUser) {
        toast.error('You must be logged in to update your profile photo');
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `${authUser.id}/${fileName}`;
        
        // Upload the file to Supabase Storage
        const { error: uploadError } = await storage.upload('avatars', filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: { publicUrl } } = storage.getPublicUrl('avatars', filePath);
        
        // Update the profile photo URL in the database
        const { error: updateError } = await updateProfilePhoto(authUser.id, publicUrl);
        
        if (updateError) throw updateError;
        
        // Update local state and refresh profile
        onPhotoUpdate(publicUrl);
        await refreshProfile();
        
        toast.success('Profile photo updated successfully');
        setIsPhotoDialogOpen(false);
      } catch (error) {
        console.error('Error updating profile photo:', error);
        toast.error('Failed to update profile photo');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex items-center">
      <div className="relative">
        <div className="h-20 w-20 rounded-full overflow-hidden bg-accent">
          {user.photoUrl ? (
            <img 
              src={user.photoUrl} 
              alt={`${user.name}'s profile`} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary text-white text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
          )}
        </div>
        
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogTrigger asChild>
            <button 
              className="absolute bottom-0 right-0 bg-secondary text-white p-1 rounded-full"
              aria-label="Change profile picture"
            >
              <Camera size={16} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Profile Photo</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload size={24} className="text-gray-500" />
                <span className="text-sm text-gray-500">Select a photo from your gallery</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
              <Button 
                variant="outline" 
                onClick={() => setIsPhotoDialogOpen(false)}
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Cancel'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="ml-4 flex-1">
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <div className="flex items-center mt-1">
          <span className="text-sm text-gray-600">{user.level}</span>
          <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
          <span className="text-sm font-medium text-secondary">{user.points} Points</span>
        </div>
      </div>
    </div>
  );
};
