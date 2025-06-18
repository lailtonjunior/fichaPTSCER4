"use client"

import { useEffect, useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"

export function EnvVariablesCheck() {
  const [variables, setVariables] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Verificar quais variáveis de ambiente estão disponíveis
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anon_public: !!process.env.anon_public,
      // Adicione outras variáveis conforme necessário
    }

    setVariables(envVars)
  }, [])

  const missingVars = Object.entries(variables)
    .filter(([_, value]) => !value)
    .map(([key]) => key)
  const allConfigured = missingVars.length === 0

  if (!Object.keys(variables).length) {
    return null // Ainda carregando
  }

  return (
    <div className="mb-4">
      {allConfigured ? (
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Variáveis de ambiente configuradas</AlertTitle>
          <AlertDescription>
            Todas as variáveis de ambiente necessárias estão configuradas corretamente.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Variáveis de ambiente ausentes</AlertTitle>
          <AlertDescription>
            <p>As seguintes variáveis de ambiente não estão configuradas:</p>
            <ul className="list-disc pl-5 mt-2">
              {missingVars.map((variable) => (
                <li key={variable}>{variable}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
