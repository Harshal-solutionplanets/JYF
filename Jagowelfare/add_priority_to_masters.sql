-- Add priority column to masters table if it doesn't exist
-- This enables drag-and-drop reordering for Event Categories, Seat Types, and Honorary Volunteers

ALTER TABLE public.masters ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Optional: Initialize priority with values to maintain current order
WITH ordered_masters AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as row_num
  FROM public.masters
)
UPDATE public.masters
SET priority = (SELECT count(*) FROM public.masters) - om.row_num + 1
FROM ordered_masters om
WHERE public.masters.id = om.id;
