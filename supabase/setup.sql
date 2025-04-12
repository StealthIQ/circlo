
-- Create storage buckets for files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-uploads', 'User Uploaded Files', true)
ON CONFLICT DO NOTHING;

-- Create RLS policies for storage
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'user-uploads');
  
CREATE POLICY "Users can upload their own files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'user-uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'user-uploads' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'user-uploads' AND auth.uid() = owner);

-- Create a trigger to automatically update profiles.updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

-- Ensure that when a user signs up, a profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, points, level)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    NEW.email,
    0,
    'Beginner'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Function to give a user admin privileges
CREATE OR REPLACE FUNCTION public.create_admin_user(user_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = uid AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql;

-- RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- RLS for the recycling_activities table
ALTER TABLE public.recycling_activities ENABLE ROW LEVEL SECURITY;

-- Users can read their own activities
CREATE POLICY "Users can view their own activities"
ON public.recycling_activities FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own activities
CREATE POLICY "Users can add their own activities"
ON public.recycling_activities FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- RLS for the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Only admins can manage roles
CREATE POLICY "Only admins can view roles"
ON public.user_roles FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
USING (public.is_admin(auth.uid()));

-- Create the admin user if not exists
DO $$
BEGIN
  -- Check if admin@mail.com exists in auth.users
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@mail.com') THEN
    -- Make sure user has admin role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (
      (SELECT id FROM auth.users WHERE email = 'admin@mail.com'),
      'admin'
    )
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END
$$;
