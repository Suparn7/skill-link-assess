import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Please set up Supabase integration.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface Candidate {
  id: string;
  registration_number: string;
  first_name: string;
  last_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  category: string;
  mobile: string;
  email: string;
  aadhar_number: string;
  address: string;
  state: string;
  district: string;
  pincode: string;
  tenth_board: string;
  tenth_year: string;
  tenth_marks: string;
  anm_institute: string;
  anm_year: string;
  anm_certificate: string;
  nursing_council_reg: string;
  application_status: 'draft' | 'submitted' | 'approved' | 'rejected';
  payment_status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  candidate_id: string;
  post_code: string;
  application_fee: number;
  payment_reference: string;
  documents: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  candidate_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export interface Document {
  id: string;
  candidate_id: string;
  document_type: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}