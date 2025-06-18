"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { isOffline, tryReconnect } from "@/lib/supabase"

type ConnectionStatus = "online" | "offline" | "reconnecting" | "error"

interface ConnectionContextType {
  status: ConnectionStatus
  isOnline: boolean
  lastSync: Date | null
  error: string | null
  reconnect: () => Promise<void>
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined)

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<ConnectionStatus>(isOffline() ? "offline" : "online")
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reconnect = async () => {
    setStatus("reconnecting")
    setError(null)

    try {
      const result = await tryReconnect()

      if (result.success) {
        setStatus("online")
        setLastSync(new Date())
      } else {
        setStatus("error")
        setError(result.error)
      }
    } catch (err: any) {
      setStatus("error")
      setError(err.message || "Erro desconhecido ao tentar reconectar")
    }
  }

  // Monitorar o estado online/offline do navegador
  useEffect(() => {
    const handleOnline = () => {
      reconnect()
    }

    const handleOffline = () => {
      setStatus("offline")
    }

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      // Verificar o estado inicial
      if (!navigator.onLine) {
        setStatus("offline")
      }

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
      }
    }
  }, [])

  const value = {
    status,
    isOnline: status === "online",
    lastSync,
    error,
    reconnect,
  }

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>
}

export function useConnection() {
  const context = useContext(ConnectionContext)

  if (context === undefined) {
    throw new Error("useConnection deve ser usado dentro de um ConnectionProvider")
  }

  return context
}
