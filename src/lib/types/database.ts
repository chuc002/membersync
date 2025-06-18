export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          club_id: string | null
          preferences: Json
          family_members: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          club_id?: string | null
          preferences?: Json
          family_members?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          club_id?: string | null
          preferences?: Json
          family_members?: Json
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          date: string
          time: string
          category: string
          price: number
          registration_url: string | null
          club_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          date: string
          time: string
          category: string
          price?: number
          registration_url?: string | null
          club_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          category?: string
          price?: number
          registration_url?: string | null
          club_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          member_id: string
          event_id: string
          status: string
          registered_at: string
        }
        Insert: {
          id?: string
          member_id: string
          event_id: string
          status?: string
          registered_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          event_id?: string
          status?: string
          registered_at?: string
        }
      }
    }
  }
}

export type Member = Database['public']['Tables']['members']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type Registration = Database['public']['Tables']['registrations']['Row']

export interface FamilyMember {
  name: string
  age: number
  relationship: string
  notificationPreferences: {
    email: boolean
    sms: boolean
  }
}

export interface MemberPreferences {
  categories: string[]
  notifications: {
    email: boolean
    sms: boolean
    reminders: boolean
  }
  familyEvents: boolean
}

export type EventCategory = 'Golf' | 'Dining' | 'Kids' | 'Fitness' | 'Social'