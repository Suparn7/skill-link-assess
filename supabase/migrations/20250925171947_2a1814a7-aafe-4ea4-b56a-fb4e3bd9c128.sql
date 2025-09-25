-- Performance optimizations for high-volume registration
-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_personal_info_user_id ON public.personal_info(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_educational_qualifications_user_id ON public.educational_qualifications(user_id);
CREATE INDEX IF NOT EXISTS idx_experience_info_user_id ON public.experience_info(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON public.documents(status);
CREATE INDEX IF NOT EXISTS idx_payments_application_id ON public.payments(application_id);
CREATE INDEX IF NOT EXISTS idx_phone_otps_mobile ON public.phone_otps(mobile);
CREATE INDEX IF NOT EXISTS idx_phone_otps_expires_at ON public.phone_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);