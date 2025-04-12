
import { supabase, Profile, RecyclingActivity } from '@/integrations/supabase/client';
import { tables } from '@/utils/supabaseHelpers';

export const getProfileById = async (id: string) => {
  try {
    const { data, error } = await tables.profiles()
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { profile: data as Profile, error: null };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { profile: null, error };
  }
};

export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  try {
    // Create a clean updates object that only contains valid fields
    const validUpdates: Record<string, string | number | boolean | null> = {};
    
    // Check each field and only add valid ones to the update
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        validUpdates[key] = value;
      }
    });
    
    const { data, error } = await tables.profiles()
      .update(validUpdates as any)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    return { profile: data as Profile, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { profile: null, error };
  }
};

export const updateProfilePhoto = async (id: string, photoUrl: string) => {
  return updateProfile(id, { photo_url: photoUrl });
};

export const getUserActivities = async (userId: string, limit: number = 10) => {
  try {
    const { data, error } = await tables.recycling_activities()
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return { activities: data as RecyclingActivity[], error: null };
  } catch (error) {
    console.error('Error fetching user activities:', error);
    return { activities: [], error };
  }
};

export const addUserPoints = async (userId: string, pointsToAdd: number) => {
  try {
    // First get current points
    const { profile, error: fetchError } = await getProfileById(userId);
    
    if (fetchError || !profile) throw fetchError;
    
    const newPoints = profile.points + pointsToAdd;
    
    const { profile: updatedProfile, error: updateError } = await updateProfile(userId, {
      points: newPoints
    });
    
    if (updateError) throw updateError;
    
    return { 
      success: true, 
      points: updatedProfile?.points || newPoints, 
      error: null 
    };
  } catch (error) {
    console.error('Error adding user points:', error);
    return { success: false, points: 0, error };
  }
};
