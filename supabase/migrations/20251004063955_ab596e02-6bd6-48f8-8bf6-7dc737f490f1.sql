-- Enable RLS on category_payments table
ALTER TABLE public.category_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for category_payments
CREATE POLICY "Only admins can view category payments"
ON public.category_payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

CREATE POLICY "Only admins can manage category payments"
ON public.category_payments
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Enable RLS on other_details table
ALTER TABLE public.other_details ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for other_details
CREATE POLICY "Users can view their own other details"
ON public.other_details
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own other details"
ON public.other_details
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own other details"
ON public.other_details
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all other details"
ON public.other_details
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.role = 'admin'
  )
);