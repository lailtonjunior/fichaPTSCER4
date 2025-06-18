import { getSupabaseClient } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { v4 as uuidv4 } from "uuid"
import type { PacienteInsert, PacienteUpdate, AvaliacaoInsert, AvaliacaoUpdate } from "@/types/database.types"

// Função auxiliar para tratamento de erros
const handleError = (error: any, message: string) => {
  console.error(`${message}:`, error)
  console.error("Error details:", {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
  })

  // Determinar a mensagem de erro apropriada
  let errorMessage = error?.message || "Ocorreu um erro desconhecido"

  // Verificar se é um erro de rede/conectividade
  if (error?.message?.includes("Failed to fetch") || error?.name === "TypeError") {
    errorMessage = "Erro de conectividade. Verifique sua conexão com a internet e as configurações do Supabase."
  } else if (error?.code === "PGRST116") {
    errorMessage = "Registro não encontrado"
  } else if (error?.code === "23505") {
    errorMessage = "Já existe um registro com estes dados"
  } else if (error?.code === "23503") {
    errorMessage = "Este registro não pode ser excluído pois está sendo usado em outro lugar"
  } else if (error?.code?.startsWith("23")) {
    errorMessage = "Erro de validação no banco de dados"
  } else if (error?.code === "42P01") {
    errorMessage = "Tabela não encontrada. Verifique se o banco de dados foi configurado corretamente"
  } else if (error?.code?.startsWith("42")) {
    errorMessage = "Erro de sintaxe SQL"
  } else if (error?.code === "28P01") {
    errorMessage = "Credenciais inválidas para o banco de dados"
  } else if (error?.code === "PGRST301") {
    errorMessage = "Erro de permissão. Você não tem acesso a este recurso"
  }

  // Exibir toast com a mensagem de erro
  toast({
    title: "Erro",
    description: errorMessage,
    variant: "destructive",
  })

  return null
}

// Serviço para operações com pacientes
export const pacienteService = {
  // Buscar todos os pacientes
  async getPacientes() {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      const { data, error } = await client.from("pacientes").select("*").order("nome")

      if (error) throw error
      return data || []
    } catch (error: any) {
      return handleError(error, "Erro ao buscar pacientes") || []
    }
  },

  // Buscar paciente por ID
  async getPacienteById(id: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!id) throw new Error("ID do paciente não fornecido")

      const { data, error } = await client.from("pacientes").select("*").eq("id", id).single()

      if (error) throw error
      return data
    } catch (error: any) {
      return handleError(error, `Erro ao buscar paciente ${id}`)
    }
  },

  // Criar novo paciente
  async createPaciente(paciente: Omit<PacienteInsert, "id" | "created_at" | "updated_at">) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!paciente.nome) throw new Error("Nome do paciente é obrigatório")

      const { data, error } = await client
        .from("pacientes")
        .insert({
          ...paciente,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Paciente cadastrado com sucesso",
      })

      return data[0]
    } catch (error: any) {
      return handleError(error, "Erro ao cadastrar paciente")
    }
  },

  // Atualizar paciente
  async updatePaciente(id: string, paciente: PacienteUpdate) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!id) throw new Error("ID do paciente não fornecido")
      if (Object.keys(paciente).length === 0) throw new Error("Nenhum dado fornecido para atualização")

      const { data, error } = await client
        .from("pacientes")
        .update({
          ...paciente,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Dados do paciente atualizados com sucesso",
      })

      return data[0]
    } catch (error: any) {
      return handleError(error, `Erro ao atualizar paciente ${id}`)
    }
  },

  // Excluir paciente
  async deletePaciente(id: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }

      // Verificar se existem avaliações para este paciente
      const { data: avaliacoes, error: avaliacoesError } = await client
        .from("avaliacoes")
        .select("id")
        .eq("paciente_id", id)
        .limit(1)

      if (avaliacoesError) throw avaliacoesError

      if (avaliacoes && avaliacoes.length > 0) {
        throw new Error("Este paciente possui avaliações e não pode ser excluído")
      }

      const { error } = await client.from("pacientes").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Paciente excluído com sucesso",
      })

      return true
    } catch (error: any) {
      handleError(error, `Erro ao excluir paciente ${id}`)
      return false
    }
  },
}

// Serviço para operações com avaliações
export const avaliacaoService = {
  // Buscar todas as avaliações
  async getAvaliacoes() {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }

      // Testar a conectividade primeiro
      const { data: testData, error: testError } = await client
        .from("avaliacoes")
        .select("count", { count: "exact", head: true })
        .limit(0)

      if (testError) {
        console.error("Erro de conectividade:", testError)
        throw testError
      }

      const { data, error } = await client
        .from("avaliacoes")
        .select(`
          *,
          pacientes (*)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      return handleError(error, "Erro ao buscar avaliações") || []
    }
  },

  // Buscar avaliações de um paciente
  async getAvaliacoesByPacienteId(pacienteId: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!pacienteId) throw new Error("ID do paciente não fornecido")

      const { data, error } = await client
        .from("avaliacoes")
        .select("*")
        .eq("paciente_id", pacienteId)
        .order("created_at", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error: any) {
      return handleError(error, `Erro ao buscar avaliações do paciente ${pacienteId}`) || []
    }
  },

  // Buscar avaliação por ID
  async getAvaliacaoById(id: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!id) throw new Error("ID da avaliação não fornecido")

      const { data, error } = await client
        .from("avaliacoes")
        .select(`
          *,
          pacientes (*),
          secoes_avaliacao (*)
        `)
        .eq("id", id)
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      return handleError(error, `Erro ao buscar avaliação ${id}`)
    }
  },

  // Criar nova avaliação
  async createAvaliacao(avaliacao: Omit<AvaliacaoInsert, "id" | "created_at" | "updated_at">) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!avaliacao.paciente_id) throw new Error("ID do paciente é obrigatório")
      if (!avaliacao.especialidade) throw new Error("Especialidade é obrigatória")

      const avaliacaoId = uuidv4()
      // Verificar se o paciente existe
      const { data: paciente, error: pacienteError } = await client
        .from("pacientes")
        .select("id")
        .eq("id", avaliacao.paciente_id)
        .single()

      if (pacienteError) throw new Error("Paciente não encontrado")
      if (!paciente) throw new Error("Paciente não encontrado")

      const { data, error } = await client
        .from("avaliacoes")
        .insert({
          id: avaliacaoId,
          ...avaliacao,
          status: avaliacao.status || "rascunho",
          data_avaliacao: avaliacao.data_avaliacao || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Nova avaliação criada com sucesso",
      })

      return data[0]
    } catch (error: any) {
      return handleError(error, "Erro ao criar avaliação")
    }
  },

  // Atualizar avaliação
  async updateAvaliacao(id: string, avaliacao: AvaliacaoUpdate) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!id) throw new Error("ID da avaliação não fornecido")
      if (Object.keys(avaliacao).length === 0) throw new Error("Nenhum dado fornecido para atualização")

      const { data, error } = await client
        .from("avaliacoes")
        .update({
          ...avaliacao,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Avaliação atualizada com sucesso",
      })

      return data[0]
    } catch (error: any) {
      return handleError(error, `Erro ao atualizar avaliação ${id}`)
    }
  },

  // Excluir avaliação
  async deleteAvaliacao(id: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }

      // Primeiro excluímos as seções relacionadas
      const { error: secoesError } = await client.from("secoes_avaliacao").delete().eq("avaliacao_id", id)

      if (secoesError) throw secoesError

      // Excluímos as avaliações MIF relacionadas
      const { error: mifError } = await client.from("mif_avaliacoes").delete().eq("avaliacao_id", id)

      if (mifError) throw mifError

      // Depois excluímos a avaliação
      const { error } = await client.from("avaliacoes").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Avaliação excluída com sucesso",
      })

      return true
    } catch (error: any) {
      handleError(error, `Erro ao excluir avaliação ${id}`)
      return false
    }
  },

  // Salvar seção da avaliação
  async saveSecaoAvaliacao(avaliacaoId: string, secao: string, dados: any) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }

      if (!avaliacaoId) throw new Error("ID da avaliação não fornecido")
      if (!secao) throw new Error("Nome da seção não fornecido")
      if (!dados) throw new Error("Dados da seção não fornecidos")

      // Verificar se a avaliação existe
      const { data: avaliacao, error: avaliacaoError } = await client
        .from("avaliacoes")
        .select("id")
        .eq("id", avaliacaoId)
        .single()

      if (avaliacaoError && avaliacaoError.code !== "PGRST116") throw avaliacaoError
      if (!avaliacao) throw new Error("Avaliação não encontrada")

      // Verificar se a seção já existe
      const { data: existingData, error: queryError } = await client
        .from("secoes_avaliacao")
        .select("*")
        .eq("avaliacao_id", avaliacaoId)
        .eq("secao", secao)
        .single()

      if (queryError && queryError.code !== "PGRST116") throw queryError

      let result

      if (existingData) {
        // Atualizar seção existente
        const { data, error } = await client
          .from("secoes_avaliacao")
          .update({
            dados,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select()

        if (error) throw error
        result = data[0]

        toast({
          title: "Sucesso",
          description: "Seção atualizada com sucesso",
          variant: "default",
        })
      } else {
        // Criar nova seção
        const { data, error } = await client
          .from("secoes_avaliacao")
          .insert({
            avaliacao_id: avaliacaoId,
            secao,
            dados,
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error
        result = data[0]

        toast({
          title: "Sucesso",
          description: "Seção criada com sucesso",
          variant: "default",
        })
      }

      return result
    } catch (error: any) {
      return handleError(error, `Erro ao salvar seção ${secao} da avaliação ${avaliacaoId}`)
    }
  },

  // Buscar seção da avaliação
  async getSecaoAvaliacao(avaliacaoId: string, secao: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!avaliacaoId) throw new Error("ID da avaliação não fornecido")
      if (!secao) throw new Error("Nome da seção não fornecido")

      const { data, error } = await client
        .from("secoes_avaliacao")
        .select("*")
        .eq("avaliacao_id", avaliacaoId)
        .eq("secao", secao)
        .single()

      if (error && error.code !== "PGRST116") throw error // PGRST116 é o código para "nenhum resultado encontrado"

      return data?.dados || null
    } catch (error: any) {
      console.error(`Erro ao buscar seção ${secao} da avaliação ${avaliacaoId}:`, error)
      // Não exibimos toast aqui para não poluir a interface quando uma seção não existe
      return null
    }
  },

  // Salvar avaliação MIF
  async saveMIFAvaliacao(avaliacaoId: string, categoria: string, pontuacao: number, observacoes?: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!avaliacaoId) throw new Error("ID da avaliação não fornecido")
      if (!categoria) throw new Error("Categoria MIF não fornecida")
      if (pontuacao < 1 || pontuacao > 7) throw new Error("Pontuação MIF deve estar entre 1 e 7")

      // Verificar se a avaliação existe
      const { data: avaliacao, error: avaliacaoError } = await client
        .from("avaliacoes")
        .select("id")
        .eq("id", avaliacaoId)
        .single()

      if (avaliacaoError && avaliacaoError.code !== "PGRST116") throw avaliacaoError
      if (!avaliacao) throw new Error("Avaliação não encontrada")

      // Verificar se já existe uma avaliação MIF para esta categoria
      const { data: existingData, error: queryError } = await client
        .from("mif_avaliacoes")
        .select("*")
        .eq("avaliacao_id", avaliacaoId)
        .eq("categoria", categoria)
        .single()

      if (queryError && queryError.code !== "PGRST116") throw queryError

      let result

      if (existingData) {
        // Atualizar avaliação MIF existente
        const { data, error } = await client
          .from("mif_avaliacoes")
          .update({
            pontuacao,
            observacoes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingData.id)
          .select()

        if (error) throw error
        result = data[0]
      } else {
        // Criar nova avaliação MIF
        const { data, error } = await client
          .from("mif_avaliacoes")
          .insert({
            avaliacao_id: avaliacaoId,
            categoria,
            pontuacao,
            observacoes,
            updated_at: new Date().toISOString(),
          })
          .select()

        if (error) throw error
        result = data[0]
      }

      return result
    } catch (error: any) {
      return handleError(error, `Erro ao salvar avaliação MIF para categoria ${categoria}`)
    }
  },

  // Buscar avaliações MIF de uma avaliação
  async getMIFAvaliacoes(avaliacaoId: string) {
    try {
      const client = getSupabaseClient()

      // Verificar se o cliente foi configurado corretamente
      if (!client || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error("Supabase não está configurado corretamente. Verifique as variáveis de ambiente.")
      }
      if (!avaliacaoId) throw new Error("ID da avaliação não fornecido")

      const { data, error } = await client.from("mif_avaliacoes").select("*").eq("avaliacao_id", avaliacaoId)

      if (error) throw error
      return data || []
    } catch (error: any) {
      return handleError(error, `Erro ao buscar avaliações MIF da avaliação ${avaliacaoId}`) || []
    }
  },
}

// Exportar os serviços para compatibilidade com código existente
export const { getPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente } = pacienteService

export const {
  getAvaliacoes,
  getAvaliacoesByPacienteId,
  getAvaliacaoById,
  createAvaliacao,
  updateAvaliacao,
  deleteAvaliacao,
  saveSecaoAvaliacao,
  getSecaoAvaliacao,
  saveMIFAvaliacao,
  getMIFAvaliacoes,
} = avaliacaoService
