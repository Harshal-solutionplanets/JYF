-- Update Causes Table to match new requirements
ALTER TABLE public.causes DROP COLUMN IF EXISTS tag;
ALTER TABLE public.causes DROP COLUMN IF EXISTS goal;
ALTER TABLE public.causes DROP COLUMN IF EXISTS raised;

ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infokey1 TEXT;
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infoval1 TEXT;
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infokey2 TEXT;
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infoval2 TEXT;
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infokey3 TEXT;
ALTER TABLE public.causes ADD COLUMN IF NOT EXISTS infoval3 TEXT;

-- Note: image_url already exists from previous fixes.
