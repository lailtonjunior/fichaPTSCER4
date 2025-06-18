"use client"

import { useConnection } from "@/contexts/connection-context"
import { Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ConnectionIndicator() {
  const { status, error, reconnect } = useConnection()

  if (status === "online") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <Wifi className="h-4 w-4 mr-1" />
              <span className="text-xs">Online</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Conectado ao banco de dados</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (status === "offline") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={reconnect}
              className="h-8 px-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            >
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="text-xs">Offline</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clique para tentar reconectar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (status === "reconnecting") {
    return (
      <div className="flex items-center text-blue-600 dark:text-blue-400">
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        <span className="text-xs">Reconectando...</span>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={reconnect}
            className="h-8 px-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            <span className="text-xs">Erro</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Erro: {error || "Desconhecido"}. Clique para tentar novamente.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
