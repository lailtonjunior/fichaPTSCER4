"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { testConnection } from "@/lib/supabase"

export function SupabaseDiagnostics() {
  const [connectionStatus, setConnectionStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<{
    url: boolean
    anonKey: boolean
    anonPublic: boolean
  }>({
    url: false,
    anonKey: false,
    anonPublic: false,
  })

  const checkConnection = async () => {
    setConnectionStatus("loading")
    setErrorMessage(null)

    try {
      const result = await testConnection()

      if (result.success) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
        setErrorMessage(result.error || "Erro desconhecido")
      }
    } catch (error: any) {
      setConnectionStatus("error")
      setErrorMessage(error.message || "Erro desconhecido")
    }
  }

  useEffect(() => {
    // Verificar variáveis de ambiente
    setEnvVars({
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      anonPublic: !!process.env.anon_public,
    })

    // Verificar conexão
    checkConnection()
  }, [])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Diagnóstico do Supabase</CardTitle>
        <CardDescription>Verificação das variáveis de ambiente e conexão com o Supabase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Variáveis de Ambiente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <span>NEXT_PUBLIC_SUPABASE_URL</span>
              {envVars.url ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" /> Configurado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="w-3 h-3 mr-1" /> Ausente
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              {envVars.anonKey ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" /> Configurado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="w-3 h-3 mr-1" /> Ausente
                </Badge>
              )}
            </div>
            <div className="flex items-center justify-between p-2 border rounded">
              <span>anon_public</span>
              {envVars.anonPublic ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" /> Configurado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <AlertTriangle className="w-3 h-3 mr-1" /> Opcional
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Status da Conexão</h3>
          {connectionStatus === "loading" ? (
            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />
              <AlertTitle>Verificando conexão...</AlertTitle>
              <AlertDescription>Aguarde enquanto verificamos a conexão com o Supabase.</AlertDescription>
            </Alert>
          ) : connectionStatus === "success" ? (
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Conexão estabelecida</AlertTitle>
              <AlertDescription>A conexão com o Supabase foi estabelecida com sucesso.</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Erro de conexão</AlertTitle>
              <AlertDescription>
                <p>Não foi possível conectar ao Supabase. Erro: {errorMessage}</p>
                <p className="mt-2 text-sm">
                  Verifique se as variáveis de ambiente estão configuradas corretamente e se o projeto Supabase está
                  acessível.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={checkConnection} disabled={connectionStatus === "loading"} className="w-full">
          {connectionStatus === "loading" ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Verificar novamente
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
