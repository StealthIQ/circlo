
import { supabase, Profile, RecyclingActivity, RecyclingLocation, RecyclingItem } from '@/integrations/supabase/client';
import { tables } from '@/utils/supabaseHelpers';

export const getAllUsers = async () => {
  try {
    const { data, error } = await tables.profiles()
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { users: data as Profile[], error: null };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], error };
  }
};

export const getAllActivities = async (limit: number = 100) => {
  try {
    const { data, error } = await tables.recycling_activities()
      .select(`
        *,
        profiles:user_id (name, email),
        recycling_items:item_id (name, category)
      `)
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return { activities: data as any[], error: null };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { activities: [], error };
  }
};

export const getRecyclingLocations = async () => {
  try {
    const { data, error } = await tables.recycling_locations()
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return { locations: data as RecyclingLocation[], error: null };
  } catch (error) {
    console.error('Error fetching recycling locations:', error);
    return { locations: [], error };
  }
};

export const getRecyclingItems = async () => {
  try {
    const { data, error } = await tables.recycling_items()
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    
    return { items: data as RecyclingItem[], error: null };
  } catch (error) {
    console.error('Error fetching recycling items:', error);
    return { items: [], error };
  }
};

export const createRecyclingLocation = async (location: Omit<RecyclingLocation, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await tables.recycling_locations()
      .insert(location)
      .select()
      .single();
    
    if (error) throw error;
    
    return { location: data as RecyclingLocation, error: null };
  } catch (error) {
    console.error('Error creating recycling location:', error);
    return { location: null, error };
  }
};

export const createRecyclingItem = async (item: Omit<RecyclingItem, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const { data, error } = await tables.recycling_items()
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    
    return { item: data as RecyclingItem, error: null };
  } catch (error) {
    console.error('Error creating recycling item:', error);
    return { item: null, error };
  }
};
