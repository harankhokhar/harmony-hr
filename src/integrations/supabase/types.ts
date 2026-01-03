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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          id: string
          location: string | null
          remarks: string | null
          status: Database["public"]["Enums"]["attendance_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          id?: string
          location?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          id?: string
          location?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      holidays: {
        Row: {
          created_at: string
          date: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          created_at: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          total_days: number
          updated_at: string
          used_days: number
          user_id: string
          year: number
        }
        Insert: {
          created_at?: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id: string
          year?: number
        }
        Update: {
          created_at?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          total_days?: number
          updated_at?: string
          used_days?: number
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      leaves: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          created_at: string
          end_date: string
          id: string
          is_half_day: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          rejection_reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string
          end_date: string
          id?: string
          is_half_day?: boolean | null
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          rejection_reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string
          end_date?: string
          id?: string
          is_half_day?: boolean | null
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          rejection_reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payroll: {
        Row: {
          basic_salary: number
          created_at: string
          gross_salary: number
          id: string
          month: number
          net_salary: number
          payment_date: string | null
          payment_status: string | null
          total_deductions: number
          updated_at: string
          user_id: string
          year: number
        }
        Insert: {
          basic_salary?: number
          created_at?: string
          gross_salary?: number
          id?: string
          month: number
          net_salary?: number
          payment_date?: string | null
          payment_status?: string | null
          total_deductions?: number
          updated_at?: string
          user_id: string
          year: number
        }
        Update: {
          basic_salary?: number
          created_at?: string
          gross_salary?: number
          id?: string
          month?: number
          net_salary?: number
          payment_date?: string | null
          payment_status?: string | null
          total_deductions?: number
          updated_at?: string
          user_id?: string
          year?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          department_id: string | null
          designation: string | null
          email: string
          employee_id: string | null
          employment_type: Database["public"]["Enums"]["employment_type"] | null
          first_name: string | null
          gender: string | null
          id: string
          join_date: string | null
          last_name: string | null
          phone: string | null
          postal_code: string | null
          reporting_manager_id: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          email: string
          employee_id?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          first_name?: string | null
          gender?: string | null
          id: string
          join_date?: string | null
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          reporting_manager_id?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string
          employee_id?: string | null
          employment_type?:
            | Database["public"]["Enums"]["employment_type"]
            | null
          first_name?: string | null
          gender?: string | null
          id?: string
          join_date?: string | null
          last_name?: string | null
          phone?: string | null
          postal_code?: string | null
          reporting_manager_id?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_reporting_manager_id_fkey"
            columns: ["reporting_manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_structures: {
        Row: {
          basic_salary: number
          created_at: string
          da: number
          hra: number
          id: string
          medical_allowance: number
          other_deductions: number
          pf_deduction: number
          special_allowance: number
          tax_deduction: number
          transport_allowance: number
          updated_at: string
          user_id: string
        }
        Insert: {
          basic_salary?: number
          created_at?: string
          da?: number
          hra?: number
          id?: string
          medical_allowance?: number
          other_deductions?: number
          pf_deduction?: number
          special_allowance?: number
          tax_deduction?: number
          transport_allowance?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          basic_salary?: number
          created_at?: string
          da?: number
          hra?: number
          id?: string
          medical_allowance?: number
          other_deductions?: number
          pf_deduction?: number
          special_allowance?: number
          tax_deduction?: number
          transport_allowance?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_hr: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "employee" | "hr" | "admin"
      attendance_status: "present" | "absent" | "half_day" | "leave" | "holiday"
      employment_type: "full_time" | "part_time" | "contract" | "intern"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      leave_type: "paid" | "sick" | "casual" | "unpaid"
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
      app_role: ["employee", "hr", "admin"],
      attendance_status: ["present", "absent", "half_day", "leave", "holiday"],
      employment_type: ["full_time", "part_time", "contract", "intern"],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      leave_type: ["paid", "sick", "casual", "unpaid"],
    },
  },
} as const
