export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          application_number: string
          created_at: string
          id: string
          post_id: string
          status: Database["public"]["Enums"]["application_status"] | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_number: string
          created_at?: string
          id?: string
          post_id: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_number?: string
          created_at?: string
          id?: string
          post_id?: string
          status?: Database["public"]["Enums"]["application_status"] | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      category_payments: {
        Row: {
          amount: number
          category: string
          id: string
        }
        Insert: {
          amount: number
          category: string
          id?: string
        }
        Update: {
          amount?: number
          category?: string
          id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_path: string
          file_size: number | null
          file_url: string | null
          id: string
          mime_type: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          updated_at: string
          uploaded_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string
          uploaded_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          updated_at?: string
          uploaded_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      educational_qualifications: {
        Row: {
          board_university: string
          created_at: string
          grade: string | null
          id: string
          passing_year: number
          percentage: number | null
          qualification_type: string
          roll_number: string | null
          subjects: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          board_university: string
          created_at?: string
          grade?: string | null
          id?: string
          passing_year: number
          percentage?: number | null
          qualification_type: string
          roll_number?: string | null
          subjects?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          board_university?: string
          created_at?: string
          grade?: string | null
          id?: string
          passing_year?: number
          percentage?: number | null
          qualification_type?: string
          roll_number?: string | null
          subjects?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      experience_info: {
        Row: {
          company_name: string
          created_at: string
          designation: string
          from_date: string
          id: string
          is_current: boolean | null
          job_description: string | null
          salary: number | null
          to_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string
          designation: string
          from_date: string
          id?: string
          is_current?: boolean | null
          job_description?: string | null
          salary?: number | null
          to_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string
          designation?: string
          from_date?: string
          id?: string
          is_current?: boolean | null
          job_description?: string | null
          salary?: number | null
          to_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      other_details: {
        Row: {
          category: string | null
          created_at: string
          disability_status: string | null
          id: string
          nationality: string | null
          religion: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          disability_status?: string | null
          id?: string
          nationality?: string | null
          religion?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          disability_status?: string | null
          id?: string
          nationality?: string | null
          religion?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string
          id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_info: {
        Row: {
          aadhar_number: string | null
          address: string
          alternative_mobile: string | null
          category: Database["public"]["Enums"]["category_type"]
          correspondence_address: string | null
          correspondence_district: string | null
          correspondence_pincode: string | null
          correspondence_state: string | null
          created_at: string
          date_of_birth: string
          district: string
          father_name: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          last_name: string
          middle_name: string | null
          mother_name: string
          pincode: string
          post_id: string | null
          registration_number: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhar_number?: string | null
          address: string
          alternative_mobile?: string | null
          category: Database["public"]["Enums"]["category_type"]
          correspondence_address?: string | null
          correspondence_district?: string | null
          correspondence_pincode?: string | null
          correspondence_state?: string | null
          created_at?: string
          date_of_birth: string
          district: string
          father_name: string
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name: string
          middle_name?: string | null
          mother_name: string
          pincode: string
          post_id?: string | null
          registration_number?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhar_number?: string | null
          address?: string
          alternative_mobile?: string | null
          category?: Database["public"]["Enums"]["category_type"]
          correspondence_address?: string | null
          correspondence_district?: string | null
          correspondence_pincode?: string | null
          correspondence_state?: string | null
          created_at?: string
          date_of_birth?: string
          district?: string
          father_name?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          last_name?: string
          middle_name?: string | null
          mother_name?: string
          pincode?: string
          post_id?: string | null
          registration_number?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_info_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_otps: {
        Row: {
          attempts: number
          code: string
          created_at: string
          expires_at: string
          id: string
          mobile: string
          purpose: string
          updated_at: string
          used: boolean
          user_id: string
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          expires_at: string
          id?: string
          mobile: string
          purpose?: string
          updated_at?: string
          used?: boolean
          user_id: string
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          mobile?: string
          purpose?: string
          updated_at?: string
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          application_fee: number | null
          created_at: string
          description: string | null
          end_date: string | null
          exam_date: string | null
          id: string
          is_active: boolean | null
          post_code: string
          post_name: string
          start_date: string | null
          total_vacancies: number | null
          updated_at: string
        }
        Insert: {
          application_fee?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          exam_date?: string | null
          id?: string
          is_active?: boolean | null
          post_code: string
          post_name: string
          start_date?: string | null
          total_vacancies?: number | null
          updated_at?: string
        }
        Update: {
          application_fee?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          exam_date?: string | null
          id?: string
          is_active?: boolean | null
          post_code?: string
          post_name?: string
          start_date?: string | null
          total_vacancies?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean | null
          mobile_number: string | null
          phone_verified: boolean
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean | null
          mobile_number?: string | null
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean | null
          mobile_number?: string | null
          phone_verified?: boolean
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_application_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_registration_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      application_status:
        | "draft"
        | "submitted"
        | "payment_pending"
        | "payment_completed"
        | "document_pending"
        | "completed"
        | "rejected"
      category_type: "general" | "obc" | "sc" | "st" | "ews"
      document_status: "pending" | "uploaded" | "verified" | "rejected"
      gender_type: "male" | "female" | "other"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      user_role: "candidate" | "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "draft",
        "submitted",
        "payment_pending",
        "payment_completed",
        "document_pending",
        "completed",
        "rejected",
      ],
      category_type: ["general", "obc", "sc", "st", "ews"],
      document_status: ["pending", "uploaded", "verified", "rejected"],
      gender_type: ["male", "female", "other"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      user_role: ["candidate", "admin", "client"],
    },
  },
} as const
