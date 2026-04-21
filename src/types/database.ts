export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          role: "user" | "editor" | "admin";
          xp: number;
          streak_days: number;
          current_level: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      courses: {
        Row: {
          id: string;
          title: string;
          description: string;
          long_description: string;
          level: "beginner" | "intermediate" | "advanced";
          duration: string;
          icon: string;
          color: string;
          tags: string[];
          order: number;
          is_free: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["courses"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
      };
      modules: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          order: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["modules"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["modules"]["Insert"]>;
      };
      lessons: {
        Row: {
          id: string;
          module_id: string;
          title: string;
          content_md: string;
          duration: string;
          order: number;
          media_urls: string[];
          is_free: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["lessons"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["lessons"]["Insert"]>;
      };
      quiz_questions: {
        Row: {
          id: string;
          lesson_id: string;
          question: string;
          options: string[];
          correct_index: number;
          explanation: string;
          order: number;
        };
        Insert: Database["public"]["Tables"]["quiz_questions"]["Row"];
        Update: Partial<Database["public"]["Tables"]["quiz_questions"]["Insert"]>;
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          quiz_score: number | null;
          quiz_total: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_lesson_progress"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["user_lesson_progress"]["Insert"]>;
      };
      user_course_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          started_at: string;
          completed_at: string | null;
          last_lesson_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["user_course_progress"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["user_course_progress"]["Insert"]>;
      };
      badges: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          icon: string;
          category: "course" | "streak" | "quiz" | "special";
          requirement_type: string;
          requirement_value: number;
        };
        Insert: Database["public"]["Tables"]["badges"]["Row"];
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_id: string;
          awarded_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["user_badges"]["Row"], "id" | "awarded_at">;
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          status: "active" | "canceled" | "past_due" | "trialing";
          plan: "free" | "pro" | "team";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["subscriptions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      admin_actions: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string;
          details: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_actions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["admin_actions"]["Insert"]>;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
