-- Add priority column to team and supporters tables if they don't exist
-- This enables drag-and-drop reordering in the admin panel

ALTER TABLE public.team ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;
ALTER TABLE public.supporters ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Optional: Initialize priority with values to maintain current order
-- team
WITH ordered_team AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.team
)
UPDATE public.team
SET priority = (SELECT count(*) FROM public.team) - ot.row_num + 1
FROM ordered_team ot
WHERE public.team.id = ot.id;

-- supporters
WITH ordered_supporters AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.supporters
)
UPDATE public.supporters
SET priority = (SELECT count(*) FROM public.supporters) - os.row_num + 1
FROM ordered_supporters os
WHERE public.supporters.id = os.id;
