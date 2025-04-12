
# Circlo: Recycling Rewards Platform

## Local Deployment Guide

### Prerequisites

- Node.js (v16 or later)
- npm (v8 or later) or Yarn
- Git
- Docker (for local Supabase)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd circlo-app
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Set Up Supabase Locally

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Start a local Supabase instance:
```bash
supabase start
```

3. Take note of the local API URL and anon key that will be displayed after Supabase starts.

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:
```
VITE_SUPABASE_URL=<your-local-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-local-supabase-anon-key>
```

### Step 5: Run Database Migrations

Run the SQL setup script to create the necessary tables and policies:

```bash
supabase db reset
```

Alternatively, you can run the SQL commands manually through the Supabase Studio SQL Editor.

### Step 6: Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` to see your application.

### Step 7: Create Admin User

To create an admin user with the following credentials:
- Email: `admin@mail.com`
- Password: `Hii12345678`

1. First sign up using the application's signup form.
2. Then run the following SQL query in the Supabase SQL Editor:

```sql
-- Create admin role for the user
INSERT INTO public.user_roles (user_id, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@mail.com'),
  'admin'
);
```

## Replacing Placeholder Images

The application uses placeholder images located in the `src/assets/images` directory. Replace these files with your actual assets while keeping the same filenames to maintain compatibility.

## Project Structure

```
src/
├── assets/            # Static assets (images, placeholder files)
│   └── images/        # Organized image assets
│       ├── logos/     # App logos and partner logos
│       ├── icons/     # UI icons
│       ├── rewards/   # Rewards images
│       ├── marketplace/ # Product images sorted by category
│       └── partners/  # Partner brand images
├── components/        # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── layout/        # Layout components (navbar, footer, etc.)
│   ├── profile/       # Profile-related components
│   ├── auth/          # Authentication components
│   ├── marketplace/   # Marketplace components
│   └── sustainability/ # Sustainability features (quotes, etc.)
├── contexts/          # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Page components
│   └── admin/         # Admin-specific pages
├── services/          # API service modules
├── utils/             # Utility functions
└── data/              # Mock data and constants
```

## Database Schema

### Core Tables

#### profiles
```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  photo_url TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Beginner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### user_roles
```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

#### recycling_activities
```sql
CREATE TABLE public.recycling_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID,
  item_id UUID,
  points INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  photo_url TEXT,
  qr_code TEXT,
  status TEXT NOT NULL DEFAULT 'completed'
);
```

## Troubleshooting

### Common Issues

1. **Profile Updates Failing**: Ensure the Supabase RLS policies are correctly set up to allow profile updates.

2. **Admin Access Issues**: Verify that the user has an entry in the `user_roles` table with the `admin` role.

3. **QR Code Generation Errors**: Check that the QR code package is properly installed with `npm install qrcode`.

4. **Image Loading Errors**: If images fail to load, check that the paths match the actual location of assets in your project.

## For Production Deployment

When moving to production, you'll need to:

1. Set up a production Supabase project
2. Update environment variables
3. Run all migrations on the production database
4. Configure auth providers in the Supabase dashboard
5. Set up proper storage bucket policies for profile photos
