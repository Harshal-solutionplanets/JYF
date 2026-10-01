-- Create sadhu_medical_details table
CREATE TABLE IF NOT EXISTS public.sadhu_medical_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    person_id TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female')) NOT NULL,
    age INTEGER,
    samuday_name TEXT,
    entry_date DATE,
    contact_number TEXT,
    form_images TEXT[],
    report_images TEXT[],
    prescription_images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.sadhu_medical_details ENABLE ROW LEVEL SECURITY;

-- Create policies (Admin only full access)
CREATE POLICY "Enable all for authenticated users only" ON public.sadhu_medical_details
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Create storage buckets for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('sadhu_medical', 'sadhu_medical', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public read access to sadhu_medical bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'sadhu_medical');

CREATE POLICY "Allow authenticated insert to sadhu_medical bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sadhu_medical' AND auth.role() = 'authenticated');
