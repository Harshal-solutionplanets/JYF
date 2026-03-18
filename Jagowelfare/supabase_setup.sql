-- Run these commands in your Supabase SQL Editor to set up the database schema

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    description TEXT,
    content TEXT,
    venue TEXT,
    heroImageUrl TEXT,
    startAt TIMESTAMPTZ,
    endAt TIMESTAMPTZ,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Causes Table
CREATE TABLE IF NOT EXISTS public.causes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    description TEXT,
    content TEXT,
    goal NUMERIC DEFAULT 0,
    raised NUMERIC DEFAULT 0,
    imageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    summary TEXT,
    content TEXT,
    imageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    imageUrl TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Team Table
CREATE TABLE IF NOT EXISTS public.team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    imageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    comment TEXT,
    imageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS for easy testing (Enable later for security)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE causes DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: STORAGE SETUP
-- Go to 'Storage' in your Supabase Dashboard
-- Create a new bucket named 'JYF'
-- Make sure to set it to 'Public'
