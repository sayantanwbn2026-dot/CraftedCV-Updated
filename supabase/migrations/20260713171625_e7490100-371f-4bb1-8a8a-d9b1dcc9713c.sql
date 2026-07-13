CREATE TABLE public.phone_otp_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  consumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.phone_otp_challenges TO service_role;

ALTER TABLE public.phone_otp_challenges ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_phone_otp_challenges_phone_created
  ON public.phone_otp_challenges (phone, created_at DESC);

CREATE INDEX idx_phone_otp_challenges_expiry
  ON public.phone_otp_challenges (expires_at)
  WHERE consumed_at IS NULL;

CREATE TRIGGER update_phone_otp_challenges_updated_at
  BEFORE UPDATE ON public.phone_otp_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.phone_auth_users (
  phone TEXT NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.phone_auth_users TO service_role;

ALTER TABLE public.phone_auth_users ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_phone_auth_users_updated_at
  BEFORE UPDATE ON public.phone_auth_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();