-- Migration: Create other_details table for storing additional user info
CREATE TABLE public.other_details (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nationality text,
  religion text,
  disability_status text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT other_details_pkey PRIMARY KEY (id),
  CONSTRAINT other_details_user_id_key UNIQUE (user_id),
  CONSTRAINT other_details_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_other_details_user_id ON public.other_details USING btree (user_id) TABLESPACE pg_default;

CREATE TRIGGER update_other_details_updated_at BEFORE UPDATE ON other_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
