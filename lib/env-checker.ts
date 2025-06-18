/**
 * Utilitário para verificar variáveis de ambiente
 */
export function checkEnvironmentVariables() {
  const variables = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }

  const missing = Object.entries(variables)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.error(`⚠️ Variáveis de ambiente ausentes: ${missing.join(", ")}`)
    return {
      valid: false,
      missing,
    }
  }

  return {
    valid: true,
    missing: [],
  }
}

// Executar verificação durante inicialização
export const envCheck = checkEnvironmentVariables()
