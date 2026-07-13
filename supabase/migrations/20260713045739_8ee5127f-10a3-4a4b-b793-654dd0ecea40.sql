
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.cms_ai_prompts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_key text NOT NULL UNIQUE,
  system_instruction text NOT NULL DEFAULT '',
  model_params jsonb NOT NULL DEFAULT '{"temperature": 0.7, "max_tokens": 1024}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_ai_prompts TO authenticated;
GRANT ALL ON public.cms_ai_prompts TO service_role;
ALTER TABLE public.cms_ai_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view AI prompts" ON public.cms_ai_prompts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert AI prompts" ON public.cms_ai_prompts
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update AI prompts" ON public.cms_ai_prompts
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete AI prompts" ON public.cms_ai_prompts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER update_cms_ai_prompts_updated_at
  BEFORE UPDATE ON public.cms_ai_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cms_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cms_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.cms_settings TO authenticated;
GRANT ALL ON public.cms_settings TO service_role;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.cms_settings
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert settings" ON public.cms_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update settings" ON public.cms_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete settings" ON public.cms_settings
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE TRIGGER update_cms_settings_updated_at
  BEFORE UPDATE ON public.cms_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
