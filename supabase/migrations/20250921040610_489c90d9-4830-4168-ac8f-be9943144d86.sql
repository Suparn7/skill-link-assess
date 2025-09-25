-- Create enum types
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');
CREATE TYPE public.category_type AS ENUM ('general', 'obc', 'sc', 'st', 'ews');
CREATE TYPE public.application_status AS ENUM ('draft', 'submitted', 'payment_pending', 'payment_completed', 'document_pending', 'completed', 'rejected');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.document_status AS ENUM ('pending', 'uploaded', 'verified', 'rejected');
CREATE TYPE public.user_role AS ENUM ('candidate', 'admin', 'client');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  mobile_number TEXT,
  role user_role DEFAULT 'candidate',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create posts/vacancies table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_name TEXT NOT NULL,
  post_code TEXT UNIQUE NOT NULL,
  description TEXT,
  application_fee DECIMAL(10,2) DEFAULT 0,
  total_vacancies INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  exam_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create personal_info table
CREATE TABLE public.personal_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  registration_number TEXT UNIQUE,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender gender_type NOT NULL,
  category category_type NOT NULL,
  aadhar_number TEXT,
  address TEXT NOT NULL,
  state TEXT DEFAULT 'Jharkhand',
  district TEXT NOT NULL,
  pincode TEXT NOT NULL,
  alternative_mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create educational_qualifications table
CREATE TABLE public.educational_qualifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  qualification_type TEXT NOT NULL, -- '10th', '12th', 'graduation', 'post_graduation'
  board_university TEXT NOT NULL,
  passing_year INTEGER NOT NULL,
  percentage DECIMAL(5,2),
  grade TEXT,
  subjects TEXT,
  roll_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create experience_info table
CREATE TABLE public.experience_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE,
  is_current BOOLEAN DEFAULT false,
  salary DECIMAL(10,2),
  job_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  status application_status DEFAULT 'draft',
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES public.applications(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  payment_method TEXT,
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'photo', 'signature', 'aadhar', 'certificate', etc.
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status document_status DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Fixed: Avoid infinite recursion by using JWT custom claim for admin role
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (auth.role() = 'admin');

-- Create RLS policies for posts
CREATE POLICY "Anyone can view active posts" ON public.posts FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage posts" ON public.posts FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for personal_info
CREATE POLICY "Users can view their own personal info" ON public.personal_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own personal info" ON public.personal_info FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own personal info" ON public.personal_info FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all personal info" ON public.personal_info FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for educational_qualifications
CREATE POLICY "Users can view their own qualifications" ON public.educational_qualifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own qualifications" ON public.educational_qualifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all qualifications" ON public.educational_qualifications FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for experience_info
CREATE POLICY "Users can view their own experience" ON public.experience_info FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own experience" ON public.experience_info FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all experience" ON public.experience_info FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for applications
CREATE POLICY "Users can view their own applications" ON public.applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own applications" ON public.applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all applications" ON public.applications FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert their own payments" ON public.payments FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.applications WHERE id = application_id AND user_id = auth.uid()));
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own documents" ON public.documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create function to generate registration number
CREATE OR REPLACE FUNCTION public.generate_registration_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create function to generate application number
CREATE OR REPLACE FUNCTION public.generate_application_number()
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON public.personal_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_educational_qualifications_updated_at BEFORE UPDATE ON public.educational_qualifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experience_info_updated_at BEFORE UPDATE ON public.experience_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, role)
    VALUES (NEW.id, NEW.email, 'candidate');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample posts/vacancies
INSERT INTO public.posts (post_name, post_code, description, application_fee, total_vacancies, start_date, end_date, exam_date) VALUES
('Junior Assistant Cum Computer Operator', 'JACO-2024', 'Junior Assistant Cum Computer Operator position for various departments', 500.00, 50, '2024-01-15', '2024-02-15', '2024-03-15'),
('Data Entry Operator', 'DEO-2024', 'Data Entry Operator for government offices', 300.00, 30, '2024-01-20', '2024-02-20', '2024-03-20'),
('Junior Clerk', 'JC-2024', 'Junior Clerk position in various offices', 400.00, 40, '2024-02-01', '2024-03-01', '2024-04-01');