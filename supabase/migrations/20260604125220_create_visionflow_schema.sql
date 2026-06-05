/*
  # VisionFlow AI - Initial Schema

  ## Overview
  Creates the core tables for the VisionFlow AI video generation platform.

  ## New Tables

  ### profiles
  - Stores extended user profile data linked to auth.users
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `avatar_url` (text)
  - `credits` (integer) - remaining generation credits
  - `plan` (text) - free/pro/premium
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### projects
  - Stores generated video projects
  - `id` (uuid, primary key)
  - `user_id` (uuid, FK to profiles)
  - `title` (text)
  - `prompt` (text)
  - `style` (text) - video style (cinematic, anime, etc.)
  - `duration` (integer) - seconds
  - `resolution` (text)
  - `aspect_ratio` (text)
  - `status` (text) - pending/processing/completed/failed
  - `thumbnail_url` (text)
  - `video_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### templates
  - Stores video templates
  - `id` (uuid, primary key)
  - `title` (text)
  - `category` (text)
  - `description` (text)
  - `thumbnail_url` (text)
  - `preview_url` (text)
  - `prompt_template` (text)
  - `style` (text)
  - `duration` (integer)
  - `is_pro` (boolean)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Profiles: users can read/update their own profile
  - Projects: users can CRUD their own projects
  - Templates: all authenticated users can read; no write access from client
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  credits integer DEFAULT 5,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Project',
  prompt text NOT NULL DEFAULT '',
  style text DEFAULT 'cinematic',
  duration integer DEFAULT 15,
  resolution text DEFAULT '1080p',
  aspect_ratio text DEFAULT '16:9',
  status text DEFAULT 'pending',
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  description text DEFAULT '',
  thumbnail_url text DEFAULT '',
  preview_url text DEFAULT '',
  prompt_template text DEFAULT '',
  style text DEFAULT 'cinematic',
  duration integer DEFAULT 30,
  is_pro boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, credits, plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    5,
    'free'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Seed templates
INSERT INTO templates (title, category, description, thumbnail_url, style, duration, is_pro) VALUES
  ('YouTube Intro', 'YouTube Videos', 'Professional YouTube channel introduction', 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400', 'cinematic', 15, false),
  ('Product Showcase', 'Business Ads', 'Sleek product demonstration video', 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?w=400', 'marketing', 30, false),
  ('Instagram Reel', 'Instagram Reels', 'Trendy short-form Instagram content', 'https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?w=400', 'cinematic', 15, false),
  ('TikTok Dance', 'TikTok Videos', 'Viral TikTok style video content', 'https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?w=400', 'cinematic', 30, false),
  ('Business Ad', 'Business Ads', 'Professional corporate advertisement', 'https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?w=400', 'marketing', 60, true),
  ('Educational Content', 'Educational Content', 'Engaging educational explainer video', 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?w=400', 'educational', 120, false),
  ('Anime Intro', 'Anime Videos', 'Japanese anime style opening sequence', 'https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?w=400', 'anime', 30, true),
  ('News Report', 'News Videos', 'Professional news broadcast style', 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?w=400', 'documentary', 60, true)
ON CONFLICT DO NOTHING;
