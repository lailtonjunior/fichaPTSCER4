import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

// Variável para controlar o estado offline
let _isOffline = false

// Criando um singleton para o cliente Supabase
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Função para obter o cliente Supabase
export function getSupabaseClient() {
  // Se já temos uma instância, retorna ela
  if (supabaseInstance) return supabaseInstance

  // Obtendo as variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.anon_public || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Log para debug (apenas em desenvolvimento)
  if (process.env.NODE_ENV === "development") {
    console.log("Supabase Config:", {
      url: supabaseUrl ? "Configurado" : "Não configurado",
      key: supabaseAnonKey ? "Configurado" : "Não configurado",
    })
  }

  // Verificação de segurança para garantir que as variáveis de ambiente estão definidas
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("As variáveis de ambiente do Supabase não estão configuradas corretamente.")
    console.error("URL:", supabaseUrl ? "Configurado" : "Não configurado")
    console.error("Chave anônima:", supabaseAnonKey ? "Configurado" : "Não configurado")
    console.error(
      "Variáveis disponíveis:",
      Object.keys(process.env).filter((key) => key.includes("SUPABASE")),
    )

    // Retorna um cliente com URLs vazias para evitar erros de runtime
    // Isso permitirá que a aplicação carregue, mas as operações de BD falharão graciosamente
    return createClient<Database>("", "")
  }

  // Criando o cliente Supabase
  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        apikey: supabaseAnonKey,
      },
    },
  })

  return supabaseInstance
}

// Exportando o cliente para compatibilidade com código existente
export const supabase = getSupabaseClient()

// Função para testar a conexão
export async function testConnection() {
  try {
    const client = getSupabaseClient()

    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        success: false,
        error:
          "Variáveis de ambiente do Supabase não configuradas. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      }
    }

    // Tentar fazer uma consulta simples
    const { data, error } = await client.from("pacientes").select("count()", { count: "exact" }).limit(1)

    if (error) {
      console.error("Erro na conexão com Supabase:", error)

      // Se o erro for relacionado a tabela não existente, pode ser que o banco de dados não esteja configurado
      if (error.code === "42P01") {
        return {
          success: false,
          error: "A tabela 'pacientes' não existe. Execute o script SQL para criar as tabelas.",
        }
      }

      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Erro ao testar conexão:", error)
    return {
      success: false,
      error: error.message || "Erro desconhecido ao conectar com o Supabase",
    }
  }
}

// Função para limpar o cache do cliente (útil para testes e logout)
export function clearSupabaseCache() {
  supabaseInstance = null
}

// Função para verificar se a aplicação está em modo offline
export function isOffline(): boolean {
  // Verificar se estamos no navegador
  if (typeof window === "undefined") return false

  // Verificar se o navegador está online
  if (!navigator.onLine) return true

  // Verificar se definimos manualmente o modo offline
  return _isOffline
}

// Função para definir manualmente o modo offline
export function setOfflineMode(offline: boolean): void {
  _isOffline = offline

  // Armazenar o estado no localStorage para persistir entre recarregamentos
  if (typeof window !== "undefined") {
    localStorage.setItem("supabase_offline_mode", offline ? "true" : "false")
  }
}

// Função para tentar reconectar ao Supabase
export async function tryReconnect(): Promise<{ success: boolean; error?: string }> {
  // Se não estamos no navegador, não podemos reconectar
  if (typeof window === "undefined") {
    return { success: false, error: "Não estamos em um ambiente de navegador" }
  }

  // Se o navegador está offline, não podemos reconectar
  if (!navigator.onLine) {
    return { success: false, error: "O navegador está offline" }
  }

  try {
    // Limpar o cache do cliente para forçar uma nova conexão
    clearSupabaseCache()

    // Tentar fazer uma nova conexão
    const result = await testConnection()

    if (result.success) {
      // Se a conexão foi bem-sucedida, desativar o modo offline
      setOfflineMode(false)
      return { success: true }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro desconhecido ao tentar reconectar",
    }
  }
}

// Inicializar o modo offline com base no localStorage
if (typeof window !== "undefined") {
  const savedOfflineMode = localStorage.getItem("supabase_offline_mode")
  if (savedOfflineMode === "true") {
    _isOffline = true
  }
}
