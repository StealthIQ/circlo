
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadProfilePhoto = async (userId: string, file: File) => {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `profiles/${fileName}`;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath);
      
    if (!data.publicUrl) {
      throw new Error('Failed to get public URL');
    }
    
    // Return the public URL
    return {
      photoUrl: data.publicUrl,
      error: null
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return {
      photoUrl: null,
      error
    };
  }
};

// Handles file uploads for any purpose, not just profile photos
export const uploadFile = async (file: File, bucketName: string = 'user-uploads', folderPath: string = '') => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Create a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { upsert: true });
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    if (!data.publicUrl) {
      throw new Error('Failed to get public URL');
    }
    
    // Return the public URL
    return {
      url: data.publicUrl,
      path: filePath,
      error: null
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      url: null,
      path: null,
      error
    };
  }
};
