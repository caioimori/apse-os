// Auto-gerado a partir do schema Supabase remoto (projeto vamtjndfjhqtyiejxnbx).
// NÃO editar manualmente. Regenerar com `pnpm db:types:remote`.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string;
          document: string | null;
          email: string | null;
          id: string;
          kind: Database['public']['Enums']['client_kind'];
          name: string;
          notes: string | null;
          org_id: string;
          phone: string | null;
          status: Database['public']['Enums']['client_status'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          document?: string | null;
          email?: string | null;
          id?: string;
          kind: Database['public']['Enums']['client_kind'];
          name: string;
          notes?: string | null;
          org_id: string;
          phone?: string | null;
          status?: Database['public']['Enums']['client_status'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          document?: string | null;
          email?: string | null;
          id?: string;
          kind?: Database['public']['Enums']['client_kind'];
          name?: string;
          notes?: string | null;
          org_id?: string;
          phone?: string | null;
          status?: Database['public']['Enums']['client_status'];
          updated_at?: string;
        };
        Relationships: [];
      };
      contract_splits: {
        Row: {
          amount_cents: number | null;
          contract_id: string;
          created_at: string;
          id: string;
          kind: Database['public']['Enums']['split_kind'];
          label: string;
          order_idx: number;
          pct: number | null;
        };
        Insert: {
          amount_cents?: number | null;
          contract_id: string;
          created_at?: string;
          id?: string;
          kind: Database['public']['Enums']['split_kind'];
          label: string;
          order_idx?: number;
          pct?: number | null;
        };
        Update: {
          amount_cents?: number | null;
          contract_id?: string;
          created_at?: string;
          id?: string;
          kind?: Database['public']['Enums']['split_kind'];
          label?: string;
          order_idx?: number;
          pct?: number | null;
        };
        Relationships: [];
      };
      contracts: {
        Row: {
          client_id: string;
          created_at: string;
          currency: string;
          ended_at: string | null;
          id: string;
          monthly_value_cents: number;
          notes: string | null;
          org_id: string;
          started_at: string;
          status: Database['public']['Enums']['contract_status'];
          title: string;
          updated_at: string;
        };
        Insert: {
          client_id: string;
          created_at?: string;
          currency?: string;
          ended_at?: string | null;
          id?: string;
          monthly_value_cents: number;
          notes?: string | null;
          org_id: string;
          started_at: string;
          status?: Database['public']['Enums']['contract_status'];
          title: string;
          updated_at?: string;
        };
        Update: {
          client_id?: string;
          created_at?: string;
          currency?: string;
          ended_at?: string | null;
          id?: string;
          monthly_value_cents?: number;
          notes?: string | null;
          org_id?: string;
          started_at?: string;
          status?: Database['public']['Enums']['contract_status'];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          created_at: string;
          id: string;
          invited_at: string;
          joined_at: string | null;
          org_id: string;
          role: Database['public']['Enums']['member_role'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          invited_at?: string;
          joined_at?: string | null;
          org_id: string;
          role?: Database['public']['Enums']['member_role'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          invited_at?: string;
          joined_at?: string | null;
          org_id?: string;
          role?: Database['public']['Enums']['member_role'];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      current_user_org_ids: { Args: never; Returns: string[] };
    };
    Enums: {
      client_kind: 'PF' | 'PJ';
      client_status: 'active' | 'inactive' | 'archived';
      contract_status: 'active' | 'paused' | 'ended';
      member_role: 'owner' | 'admin' | 'member';
      split_kind: 'revenue_share' | 'collaborator' | 'tool' | 'tax' | 'other';
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export const Constants = {
  public: {
    Enums: {
      client_kind: ['PF', 'PJ'],
      client_status: ['active', 'inactive', 'archived'],
      contract_status: ['active', 'paused', 'ended'],
      member_role: ['owner', 'admin', 'member'],
      split_kind: ['revenue_share', 'collaborator', 'tool', 'tax', 'other'],
    },
  },
} as const;
