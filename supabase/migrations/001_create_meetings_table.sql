-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    time TIMESTAMPTZ NOT NULL,
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER meetings_updated_at_trigger
    BEFORE UPDATE ON public.meetings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on authentication requirements)
-- For now, allow all operations for authenticated users
CREATE POLICY "Users can view all meetings" ON public.meetings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert meetings" ON public.meetings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update meetings" ON public.meetings
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete meetings" ON public.meetings
    FOR DELETE USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS meetings_time_idx ON public.meetings(time DESC);
CREATE INDEX IF NOT EXISTS meetings_created_at_idx ON public.meetings(created_at DESC); 