DROP POLICY IF EXISTS "Anyone can view settings" ON public.cms_settings;
CREATE POLICY "Admins can view settings" ON public.cms_settings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
REVOKE SELECT ON public.cms_settings FROM anon;