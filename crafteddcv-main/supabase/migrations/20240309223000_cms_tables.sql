-- Create cms_settings table for Global Settings
CREATE TABLE public.cms_settings (
    key text PRIMARY KEY,
    value jsonb DEFAULT '{}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert some default settings
INSERT INTO public.cms_settings (key, value) VALUES 
('global_brand', '{"primary_color": "#0ea5e9", "accent_color": "#f59e0b", "font_family": "Inter"}'),
('maintenance_mode', '{"enabled": false, "message": "We are currently undergoing maintenance."}');

-- Create cms_pages table for Pages Manager
CREATE TABLE public.cms_pages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    content jsonb DEFAULT '{}'::jsonb,
    seo_metadata jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    author_id uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create cms_ai_prompts table for AI improvement
CREATE TABLE public.cms_ai_prompts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt_key text UNIQUE NOT NULL,
    system_instruction text NOT NULL,
    model_params jsonb DEFAULT '{"temperature": 0.7, "max_tokens": 1024}'::jsonb,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) setup
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_ai_prompts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the frontend to fetch settings/pages)
CREATE POLICY "Allow public read access to cms_settings" ON public.cms_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access to cms_pages" ON public.cms_pages FOR SELECT USING (status = 'published');

-- Allow only authenticated admins to modify CMS data (Assuming Supabase Auth, simplistic policy for now)
-- Replace '(auth.role() = ''authenticated'')' with a more secure check based on your app's admin role logic 
CREATE POLICY "Allow admins full access to cms_settings" ON public.cms_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins full access to cms_pages" ON public.cms_pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admins full access to cms_ai_prompts" ON public.cms_ai_prompts FOR ALL USING (auth.role() = 'authenticated');
