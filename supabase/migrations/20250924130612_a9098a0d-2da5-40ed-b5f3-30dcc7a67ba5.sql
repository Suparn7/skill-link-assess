-- 1) Add phone verification to profiles and OTP storage table
-- Add phone_verified column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false;

-- Create phone_otps table for storing OTPs per user
CREATE TABLE IF NOT EXISTS public.phone_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  mobile text NOT NULL,
  code text NOT NULL,
  purpose text NOT NULL DEFAULT 'registration',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  used boolean NOT NULL DEFAULT false,
  attempts integer NOT NULL DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Policies: users can manage their own OTPs
CREATE POLICY "Users can insert their own otps"
ON public.phone_otps FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own otps"
ON public.phone_otps FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own otps"
ON public.phone_otps FOR UPDATE
USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_phone_otps_user_mobile ON public.phone_otps (user_id, mobile);
CREATE INDEX IF NOT EXISTS idx_phone_otps_active ON public.phone_otps (user_id, mobile, created_at DESC) WHERE used = false;

-- Trigger to maintain updated_at
CREATE TRIGGER update_phone_otps_updated_at
BEFORE UPDATE ON public.phone_otps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
