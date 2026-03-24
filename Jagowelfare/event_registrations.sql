-- Run this in your Supabase SQL Editor
-- This table will store user registrations for upcoming events

CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    eventId UUID REFERENCES public.events(id) ON DELETE CASCADE,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phoneNumber TEXT NOT NULL,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable access (Disable RLS for ease of use as per project pattern)
ALTER TABLE public.event_registrations DISABLE ROW LEVEL SECURITY;

-- Also, ensure the 'causes' table has the correct column name if it doesn't already
-- (Though our check confirms it currently has 'image_url')
DO $$ 
BEGIN 
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='causes' AND column_name='imageUrl'
    ) THEN
        ALTER TABLE public.causes RENAME COLUMN "imageUrl" TO image_url;
    END IF;
END $$;
