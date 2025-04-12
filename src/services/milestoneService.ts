
import { supabase, Milestone } from '@/integrations/supabase/client';
import { tables } from '@/utils/supabaseHelpers';

export const getAllMilestones = async () => {
  try {
    const { data, error } = await tables.milestones()
      .select('*')
      .order('points', { ascending: true });
    
    if (error) throw error;
    
    return { milestones: data as Milestone[], error: null };
  } catch (error) {
    console.error('Error fetching milestones:', error);
    return { milestones: [], error };
  }
};

export const getUserCurrentLevel = async (userPoints: number) => {
  try {
    const { milestones, error } = await getAllMilestones();
    
    if (error) throw error;
    
    // Find the highest milestone that the user has reached
    const currentMilestone = [...milestones]
      .sort((a, b) => b.points - a.points)
      .find(milestone => userPoints >= milestone.points);
    
    return { milestone: currentMilestone || null, error: null };
  } catch (error) {
    console.error('Error getting user level:', error);
    return { milestone: null, error };
  }
};

export const getNextMilestone = async (userPoints: number) => {
  try {
    const { milestones, error } = await getAllMilestones();
    
    if (error) throw error;
    
    // Find the next milestone that the user hasn't reached yet
    const nextMilestone = milestones
      .find(milestone => milestone.points > userPoints);
    
    return { milestone: nextMilestone || null, error: null };
  } catch (error) {
    console.error('Error getting next milestone:', error);
    return { milestone: null, error };
  }
};
