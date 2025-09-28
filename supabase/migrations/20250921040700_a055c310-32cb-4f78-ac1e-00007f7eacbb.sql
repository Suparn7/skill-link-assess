-- Fix function search path security warnings by setting search_path
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    reg_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the current count of personal_info records
    SELECT COUNT(*) + 1 INTO counter FROM public.personal_info;
    
    -- Generate registration number with format: REG2024000001
    reg_number := 'REG' || EXTRACT(YEAR FROM NOW()) || LPAD(counter::TEXT, 6, '0');
    
    RETURN reg_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    app_number TEXT;
    counter INTEGER;
BEGIN
    -- Get the current count of applications records
    SELECT COUNT(*) + 1 INTO counter FROM public.applications;
    
    -- Generate application number with format: APP2024000001
    app_number := 'APP' || EXTRACT(YEAR FROM NOW()) || LPAD(counter::TEXT, 6, '0');
    
    RETURN app_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'candidate');
    RETURN NEW;
END;
$$;