CREATE POLICY "Backend can manage phone OTP challenges"
ON public.phone_otp_challenges
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Backend can manage phone auth users"
ON public.phone_auth_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);