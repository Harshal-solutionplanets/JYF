-- Run this in your Supabase SQL Editor
-- This table will store temporary locks for ticket reservations

CREATE TABLE IF NOT EXISTS public.ticket_locks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    locked_by TEXT NOT NULL,         -- session ID or user identification
    locked_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL, -- now + 15 seconds
    is_active BOOLEAN DEFAULT true
);

-- Enable access (Consistent with project pattern of disabling RLS for ease)
ALTER TABLE public.ticket_locks DISABLE ROW LEVEL SECURITY;

-- Index for performance on cleanup and checks
CREATE INDEX IF NOT EXISTS idx_ticket_locks_event_expires ON public.ticket_locks(event_id, expires_at);

-- Cleanup expired locks (optional but good practice)
-- You can run this periodically or we handle it via frontend logic by ignoring expired locks
