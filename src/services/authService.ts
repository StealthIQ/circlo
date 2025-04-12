
import { supabase, Profile } from '@/integrations/supabase/client';
import { tables } from '@/utils/supabaseHelpers';

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export const signUpUser = async ({ email, password, name }: SignUpCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing up:', error);
    return { data: null, error };
  }
};

export const signInUser = async ({ email, password }: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error signing in:', error);
    return { data: null, error };
  }
};

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    if (!session) return { user: null, profile: null, error: null };

    const { data: profile, error: profileError } = await tables.profiles()
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;

    return { 
      user: session.user, 
      profile: profile as Profile, 
      error: null 
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return { user: null, profile: null, error };
  }
};

export const getUserRoles = async (userId: string) => {
  try {
    const { data, error } = await tables.user_roles()
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    
    return { 
      roles: data?.map(item => (item as any).role) || [], 
      error: null 
    };
  } catch (error) {
    console.error('Error getting user roles:', error);
    return { roles: [], error };
  }
};

export const isUserAdmin = async (userId: string) => {
  const { roles, error } = await getUserRoles(userId);
  if (error) return false;
  return roles.includes('admin');
};
