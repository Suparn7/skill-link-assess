-- Force types regeneration by adding a comment
COMMENT ON TABLE public.applications IS 'Stores user application data for exam registration';

-- Ensure all tables have proper structure
COMMENT ON TABLE public.personal_info IS 'Stores candidate personal information';
COMMENT ON TABLE public.educational_qualifications IS 'Stores candidate educational qualifications';
COMMENT ON TABLE public.experience_info IS 'Stores candidate work experience';
COMMENT ON TABLE public.documents IS 'Stores candidate uploaded documents';
COMMENT ON TABLE public.payments IS 'Stores payment transaction records';
COMMENT ON TABLE public.other_details IS 'Stores additional candidate details';
COMMENT ON TABLE public.posts IS 'Stores available exam posts';
COMMENT ON TABLE public.profiles IS 'Stores user profile data';
COMMENT ON TABLE public.phone_otps IS 'Stores OTP verification data';