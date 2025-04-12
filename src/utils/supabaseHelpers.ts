
/**
 * This file provides helper functions to work around TypeScript issues with the Supabase client
 * until we can generate proper types for our tables.
 */

import { supabase } from '@/integrations/supabase/client';

// Type-safe table access to suppress TypeScript errors
export const tables = {
  profiles: () => supabase.from('profiles'),
  recycling_activities: () => supabase.from('recycling_activities'),
  qr_codes: () => supabase.from('qr_codes'),
  user_roles: () => supabase.from('user_roles'),
  milestones: () => supabase.from('milestones'),
  recycling_locations: () => supabase.from('recycling_locations'),
  recycling_items: () => supabase.from('recycling_items'),
  reward_products: () => supabase.from('reward_products'),
  reward_coupons: () => supabase.from('reward_coupons'),
  reward_partners: () => supabase.from('reward_partners'),
  user_redemptions: () => supabase.from('user_redemptions'),
}

// RPC function helpers
export const rpc = {
  decrement: (x: number) => supabase.rpc('decrement', { x })
}

// Authentication helpers
export const auth = {
  getSession: () => supabase.auth.getSession(),
  getUser: () => supabase.auth.getUser(),
  signUp: (data: { email: string, password: string, options?: { data?: { name: string } } }) => 
    supabase.auth.signUp(data),
  signIn: (data: { email: string, password: string }) => 
    supabase.auth.signInWithPassword(data),
  signOut: () => supabase.auth.signOut(),
  onAuthStateChange: (callback: any) => 
    supabase.auth.onAuthStateChange(callback)
}

// Storage helpers
export const storage = {
  getPublicUrl: (bucket: string, path: string) => 
    supabase.storage.from(bucket).getPublicUrl(path),
  upload: (bucket: string, path: string, file: File) => 
    supabase.storage.from(bucket).upload(path, file),
  delete: (bucket: string, paths: string[]) => 
    supabase.storage.from(bucket).remove(paths)
}
