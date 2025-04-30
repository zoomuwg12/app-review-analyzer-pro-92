export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_reviews: {
        Row: {
          app_id: string
          content: string
          created_at: string
          id: string
          processed_content: string | null
          reply_content: string | null
          reply_date: string | null
          review_created_version: string | null
          review_date: string
          review_id: string
          score: number
          sentiment: string | null
          thumbs_up_count: number
          user_name: string
        }
        Insert: {
          app_id: string
          content: string
          created_at?: string
          id?: string
          processed_content?: string | null
          reply_content?: string | null
          reply_date?: string | null
          review_created_version?: string | null
          review_date: string
          review_id: string
          score: number
          sentiment?: string | null
          thumbs_up_count?: number
          user_name: string
        }
        Update: {
          app_id?: string
          content?: string
          created_at?: string
          id?: string
          processed_content?: string | null
          reply_content?: string | null
          reply_date?: string | null
          review_created_version?: string | null
          review_date?: string
          review_id?: string
          score?: number
          sentiment?: string | null
          thumbs_up_count?: number
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_reviews_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
      }
      apps: {
        Row: {
          app_id: string
          created_at: string
          developer: string
          free: boolean
          icon: string
          id: string
          installs: string | null
          price_text: string | null
          score: number
          summary: string | null
          title: string
          url: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          developer: string
          free?: boolean
          icon: string
          id?: string
          installs?: string | null
          price_text?: string | null
          score: number
          summary?: string | null
          title: string
          url?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          developer?: string
          free?: boolean
          icon?: string
          id?: string
          installs?: string | null
          price_text?: string | null
          score?: number
          summary?: string | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      ml_comparisons: {
        Row: {
          accuracy: number
          app_id: string
          created_at: string
          f1_score: number
          false_negatives: number
          false_positives: number
          id: string
          model_name: string
          precision: number
          prediction_time: number
          recall: number
          split_ratio: string
          true_negatives: number
          true_positives: number
        }
        Insert: {
          accuracy: number
          app_id: string
          created_at?: string
          f1_score: number
          false_negatives: number
          false_positives: number
          id?: string
          model_name: string
          precision: number
          prediction_time: number
          recall: number
          split_ratio: string
          true_negatives: number
          true_positives: number
        }
        Update: {
          accuracy?: number
          app_id?: string
          created_at?: string
          f1_score?: number
          false_negatives?: number
          false_positives?: number
          id?: string
          model_name?: string
          precision?: number
          prediction_time?: number
          recall?: number
          split_ratio?: string
          true_negatives?: number
          true_positives?: number
        }
        Relationships: [
          {
            foreignKeyName: "ml_comparisons_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "apps"
            referencedColumns: ["app_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
