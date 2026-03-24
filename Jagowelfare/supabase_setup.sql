-- Run these commands in your Supabase SQL Editor to set up the database schema

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    description TEXT,
    content TEXT,
    venue TEXT,
    image_url TEXT,
    startAt TIMESTAMPTZ,
    endAt TIMESTAMPTZ,
    status TEXT DEFAULT 'published',
    category TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    seatsAvailable INTEGER,
    organizerName TEXT,
    organizerRole TEXT,
    organizerCompany TEXT,
    organizerImageUrl TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Causes Table
CREATE TABLE IF NOT EXISTS public.causes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    infokey1 TEXT,
    infoval1 TEXT,
    infokey2 TEXT,
    infoval2 TEXT,
    infokey3 TEXT,
    infoval3 TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. News Table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT DEFAULT '#News',
    summary TEXT,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Team Table
CREATE TABLE IF NOT EXISTS public.team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    comment TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    location TEXT,
    is_checked_in BOOLEAN DEFAULT false,
    selected_section TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Disable RLS for easy testing
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE causes DISABLE ROW LEVEL SECURITY;
ALTER TABLE news DISABLE ROW LEVEL SECURITY;
ALTER TABLE gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE team DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations DISABLE ROW LEVEL SECURITY;

-- IMPORTANT: STORAGE SETUP
-- Go to 'Storage' in your Supabase Dashboard
-- Create a new bucket named 'JYF'
-- Make sure to set it to 'Public'
