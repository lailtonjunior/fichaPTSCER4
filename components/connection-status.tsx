"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { testConnection } from "@/lib/supabase"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [error, setError] = useState<string | null>(null)
  const [testing, setTesting] = useState(false)

  const checkConnection = async () => {
    setTesting(true)
    setStatus("loading")
    setError(null)

    try {
      const result = await testConnection()

      if (result.success) {
        setStatus("connected")
      } else {
        setStatus("error")
        setError(result.error)
      }
    } catch (err: any) {
      setStatus("error")
      setError(err.message || "Erro desconhecido")
    } finally {
      setTesting(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "connected":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Conectado
          </Badge>
        )
      case "error":
        return <Badge variant="destructive">Erro de Conexão</Badge>
      default:
        return <Badge variant="secondary">Verificando...</Badge>
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Status da Conexão
        </CardTitle>
        <CardDescription>Status da conexão com o banco de dados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Supabase:</span>
          {getStatusBadge()}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Variáveis de Ambiente:</h4>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_SUPABASE_URL:</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurado" : "Não configurado"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "Não configurado"}
              </Badge>
            </div>
          </div>
        </div>

        <Button onClick={checkConnection} disabled={testing} className="w-full" variant="outline">
          {testing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Testando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Testar Conexão
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
