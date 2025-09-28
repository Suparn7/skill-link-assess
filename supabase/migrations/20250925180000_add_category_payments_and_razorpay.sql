-- Category table for payment amounts
CREATE TABLE IF NOT EXISTS public.category_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL
);

-- Add Razorpay fields to payments table
ALTER TABLE public.payments
ADD COLUMN IF NOT EXISTS razorpay_order_id text,
ADD COLUMN IF NOT EXISTS razorpay_payment_id text,
ADD COLUMN IF NOT EXISTS razorpay_signature text;

-- Sample categories and amounts
INSERT INTO public.category_payments (category, amount) VALUES
  ('general', 500.00),
  ('obc', 400.00),
  ('sc', 0.00),
  ('st', 0.00),
  ('ews', 300.00)
ON CONFLICT (category) DO NOTHING;
