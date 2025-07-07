export interface Database {
  public: {
    Tables: {
      meetings: {
        Row: {
          id: string
          title: string
          time: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          time: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          time?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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