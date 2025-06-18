export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      pacientes: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          nome: string
          data_nascimento: string | null
          cpf: string | null
          telefone: string | null
          email: string | null
          endereco: string | null
          responsavel: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          nome: string
          data_nascimento?: string | null
          cpf?: string | null
          telefone?: string | null
          email?: string | null
          endereco?: string | null
          responsavel?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          nome?: string
          data_nascimento?: string | null
          cpf?: string | null
          telefone?: string | null
          email?: string | null
          endereco?: string | null
          responsavel?: string | null
        }
      }
      avaliacoes: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          paciente_id: string
          especialidade: string
          profissional: string | null
          status: string
          data_avaliacao: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          paciente_id: string
          especialidade: string
          profissional?: string | null
          status?: string
          data_avaliacao?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          paciente_id?: string
          especialidade?: string
          profissional?: string | null
          status?: string
          data_avaliacao?: string
        }
      }
      secoes_avaliacao: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          avaliacao_id: string
          secao: string
          dados: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          avaliacao_id: string
          secao: string
          dados: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          avaliacao_id?: string
          secao?: string
          dados?: Json
        }
      }
      mif_avaliacoes: {
        Row: {
          id: string
          created_at: string
          updated_at: string | null
          avaliacao_id: string
          categoria: string
          pontuacao: number
          observacoes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string | null
          avaliacao_id: string
          categoria: string
          pontuacao: number
          observacoes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string | null
          avaliacao_id?: string
          categoria?: string
          pontuacao?: number
          observacoes?: string | null
        }
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

// Tipos auxiliares para uso na aplicação
export type Paciente = Database["public"]["Tables"]["pacientes"]["Row"]
export type PacienteInsert = Database["public"]["Tables"]["pacientes"]["Insert"]
export type PacienteUpdate = Database["public"]["Tables"]["pacientes"]["Update"]

export type Avaliacao = Database["public"]["Tables"]["avaliacoes"]["Row"]
export type AvaliacaoInsert = Database["public"]["Tables"]["avaliacoes"]["Insert"]
export type AvaliacaoUpdate = Database["public"]["Tables"]["avaliacoes"]["Update"]

export type SecaoAvaliacao = Database["public"]["Tables"]["secoes_avaliacao"]["Row"]
export type SecaoAvaliacaoInsert = Database["public"]["Tables"]["secoes_avaliacao"]["Insert"]
export type SecaoAvaliacaoUpdate = Database["public"]["Tables"]["secoes_avaliacao"]["Update"]

export type MIFAvaliacao = Database["public"]["Tables"]["mif_avaliacoes"]["Row"]
export type MIFAvaliacaoInsert = Database["public"]["Tables"]["mif_avaliacoes"]["Insert"]
export type MIFAvaliacaoUpdate = Database["public"]["Tables"]["mif_avaliacoes"]["Update"]
