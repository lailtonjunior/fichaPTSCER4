"use client"

import { useEffect, useState } from "react"
import { supabase, isOffline, tryReconnect } from "@/lib/supabase"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, AlertCircle, CheckCircle, WifiOff, RefreshCw } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error" | "offline">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [diagnosticInfo, setDiagnosticInfo] = useState<Record<string, any>>({})

  const checkConnection = async () => {
    setIsChecking(true)
    setStatus("loading")

    try {
      // Verificar se estamos em modo offline
      if (isOffline()) {
        setStatus("offline")
        setErrorMessage("Aplicação em modo offline devido a problemas de conexão")
        setDiagnosticInfo({
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurado" : "Não configurado",
          supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "Não configurado",
          navegador: typeof window !== "undefined" ? window.navigator.userAgent : "Desconhecido",
          online: typeof navigator !== "undefined" ? navigator.onLine : "Desconhecido",
        })
        return
      }

      // Verificar se as variáveis de ambiente estão definidas
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Variáveis de ambiente do Supabase não configuradas")
      }

      // Tentar fazer uma consulta simples
      const { data, error } = await supabase.from("pacientes").select("count()", { count: "exact" }).limit(1)

      if (error) {
        throw error
      }

      setStatus("connected")
      setErrorMessage("")
      setDiagnosticInfo({
        supabaseUrl: "Conectado com sucesso",
        count: data[0]?.count || 0,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      console.error("Erro de conexão:", error)
      setStatus("error")

      // Determinar se é um erro de rede
      const isNetworkError =
        error.message?.includes("fetch") ||
        error.message?.includes("network") ||
        error.code === "NETWORK_ERROR" ||
        error.code === "ECONNREFUSED" ||
        !navigator.onLine

      if (isNetworkError) {
        setErrorMessage(`Erro de rede: ${error.message}. Verifique sua conexão com a internet.`)
      } else {
        setErrorMessage(error.message || "Erro desconhecido ao conectar com o Supabase")
      }

      // Coletar informações de diagnóstico
      setDiagnosticInfo({
        errorType: isNetworkError ? "Erro de rede" : "Erro de API",
        errorCode: error.code || "Desconhecido",
        errorDetails: error.details || "Sem detalhes adicionais",
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configurado" : "Não configurado",
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Configurado" : "Não configurado",
        navegador: typeof window !== "undefined" ? window.navigator.userAgent : "Desconhecido",
        online: typeof navigator !== "undefined" ? navigator.onLine : "Desconhecido",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsChecking(false)
    }
  }

  const handleReconnect = async () => {
    setIsChecking(true)
    const result = await tryReconnect()

    if (result.success) {
      await checkConnection()
    } else {
      setStatus("error")
      setErrorMessage(`Falha ao reconectar: ${result.error}`)
      setIsChecking(false)
    }
  }

  // Monitorar o estado online/offline do navegador
  useEffect(() => {
    const handleOnline = () => {
      if (status === "offline" || status === "error") {
        checkConnection()
      }
    }

    const handleOffline = () => {
      setStatus("offline")
      setErrorMessage("Seu dispositivo está offline. Verifique sua conexão com a internet.")
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [status])

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="mb-6">
      {status === "loading" && (
        <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
          <Loader2 className="h-4 w-4 animate-spin text-yellow-600 dark:text-yellow-400" />
          <AlertTitle>Verificando conexão com o banco de dados</AlertTitle>
          <AlertDescription>Aguarde enquanto verificamos a conexão com o Supabase...</AlertDescription>
        </Alert>
      )}

      {status === "connected" && (
        <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle>Conexão estabelecida</AlertTitle>
          <AlertDescription>A conexão com o banco de dados Supabase está funcionando corretamente.</AlertDescription>
        </Alert>
      )}

      {status === "offline" && (
        <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <WifiOff className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle>Modo Offline</AlertTitle>
          <AlertDescription>
            <p className="mb-2">{errorMessage}</p>
            <p className="mb-4">
              Você pode continuar usando algumas funcionalidades básicas, mas os dados não serão salvos até que a
              conexão seja restaurada.
            </p>
            <Button
              variant="outline"
              onClick={handleReconnect}
              disabled={isChecking}
              className="bg-white hover:bg-gray-100 text-blue-600 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700 dark:hover:bg-blue-800"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar reconectar
                </>
              )}
            </Button>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="diagnostics">
                <AccordionTrigger className="text-sm text-blue-600 dark:text-blue-400">
                  Informações de diagnóstico
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs bg-blue-50 dark:bg-blue-900 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(diagnosticInfo, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription>
            <p className="mb-2">Não foi possível conectar ao banco de dados Supabase.</p>
            <p className="mb-2">{errorMessage}</p>
            <p className="mb-4">
              Verifique se as variáveis de ambiente estão configuradas corretamente e se você tem acesso à internet.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={checkConnection}
                disabled={isChecking}
                className="bg-white hover:bg-gray-100 text-red-600 border-red-200"
              >
                {isChecking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Tentar novamente"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => setStatus("offline")}
                disabled={isChecking}
                className="bg-white hover:bg-gray-100 text-blue-600 border-blue-200"
              >
                <WifiOff className="mr-2 h-4 w-4" />
                Continuar offline
              </Button>
            </div>

            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="diagnostics">
                <AccordionTrigger className="text-sm text-red-600 dark:text-red-400">
                  Informações de diagnóstico
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="text-xs bg-red-50 dark:bg-red-900 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(diagnosticInfo, null, 2)}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
