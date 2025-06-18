"use client"

import { useState, useEffect } from "react"
import { testConnection } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export function SupabaseConnectionTest() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>("")

  const checkConnection = async () => {
    setStatus("loading")

    try {
      const result = await testConnection()

      if (result.success) {
        setStatus("success")
        setMessage("Conexão com o Supabase estabelecida com sucesso!")
      } else {
        setStatus("error")
        setMessage(`Erro ao conectar: ${result.error}`)
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(`Erro inesperado: ${error.message}`)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="space-y-4">
      {status === "loading" && (
        <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Verificando conexão</AlertTitle>
          <AlertDescription>Testando a conexão com o Supabase...</AlertDescription>
        </Alert>
      )}

      {status === "success" && (
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Conexão estabelecida</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription>
            <p className="mb-4">{message}</p>
            <Button
              variant="outline"
              onClick={checkConnection}
              className="bg-white hover:bg-gray-100 text-red-600 border-red-200"
            >
              Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
