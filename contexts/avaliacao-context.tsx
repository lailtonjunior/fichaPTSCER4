"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, Suspense } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { avaliacaoService } from "@/services/database-service"
import { useToast } from "@/components/ui/use-toast"
import type { Avaliacao } from "@/types/database.types"

type AvaliacaoContextType = {
  avaliacao: Avaliacao | null
  avaliacaoId: string | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  saveSecao: (secao: string, dados: any) => Promise<void>
  getSecao: (secao: string) => Promise<any>
  finalizarAvaliacao: () => Promise<void>
  saveMIF: (categoria: string, pontuacao: number, observacoes?: string) => Promise<void>
  getMIFAvaliacoes: () => Promise<any[]>
  reloadAvaliacao: () => Promise<void>
}

const AvaliacaoContext = createContext<AvaliacaoContextType | undefined>(undefined)

// Componente interno que usa useSearchParams
function AvaliacaoProviderInner({ children }: { children: React.ReactNode }) {
  // Movemos o useSearchParams para dentro deste componente
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const avaliacaoId = searchParams.get("id")

  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const loadAvaliacao = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (avaliacaoId) {
        const data = await avaliacaoService.getAvaliacaoById(avaliacaoId)
        if (data) {
          setAvaliacao(data)
        } else {
          setError("Avaliação não encontrada")
          toast({
            title: "Erro",
            description: "Avaliação não encontrada",
            variant: "destructive",
          })
          router.push("/avaliacoes")
        }
      } else {
        // Criar uma nova avaliação temporária (não salva no banco ainda)
        setAvaliacao({
          id: uuidv4(),
          created_at: new Date().toISOString(),
          paciente_id: "",
          especialidade: "",
          profissional: "",
          status: "rascunho",
          data_avaliacao: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Erro ao carregar avaliação",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [avaliacaoId, router, toast])

  // Carregar avaliação quando o ID mudar
  useEffect(() => {
    loadAvaliacao()
  }, [loadAvaliacao])

  // Função para recarregar a avaliação
  const reloadAvaliacao = async () => {
    await loadAvaliacao()
  }

  const saveSecao = async (secao: string, dados: any) => {
    if (!avaliacao) return

    setIsSaving(true)
    try {
      // Se a avaliação ainda não foi salva no banco
      if (!avaliacaoId) {
        toast({
          title: "Atenção",
          description: "Selecione um paciente antes de salvar",
        })
        return
      }

      await avaliacaoService.saveSecaoAvaliacao(avaliacao.id, secao, dados)

      toast({
        title: "Seção salva",
        description: "Dados salvos com sucesso",
      })
    } catch (err: any) {
      toast({
        title: "Erro ao salvar",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getSecao = async (secao: string) => {
    if (!avaliacao) return null

    try {
      return await avaliacaoService.getSecaoAvaliacao(avaliacao.id, secao)
    } catch (err: any) {
      console.error(`Erro ao carregar seção ${secao}:`, err)
      return null
    }
  }

  const finalizarAvaliacao = async () => {
    if (!avaliacao) return

    setIsSaving(true)
    try {
      const updatedAvaliacao = await avaliacaoService.updateAvaliacao(avaliacao.id, {
        status: "finalizado",
        updated_at: new Date().toISOString(),
      })

      if (updatedAvaliacao) {
        setAvaliacao({
          ...avaliacao,
          status: "finalizado",
          updated_at: new Date().toISOString(),
        })

        toast({
          title: "Avaliação finalizada",
          description: "Avaliação finalizada com sucesso",
        })
      }
    } catch (err: any) {
      toast({
        title: "Erro ao finalizar avaliação",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const saveMIF = async (categoria: string, pontuacao: number, observacoes?: string) => {
    if (!avaliacao) return

    setIsSaving(true)
    try {
      await avaliacaoService.saveMIFAvaliacao(avaliacao.id, categoria, pontuacao, observacoes)
    } catch (err: any) {
      toast({
        title: "Erro ao salvar MIF",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const getMIFAvaliacoes = async () => {
    if (!avaliacao) return []

    try {
      return await avaliacaoService.getMIFAvaliacoes(avaliacao.id)
    } catch (err: any) {
      console.error("Erro ao carregar MIF:", err)
      return []
    }
  }

  return (
    <AvaliacaoContext.Provider
      value={{
        avaliacao,
        avaliacaoId,
        isLoading,
        isSaving,
        error,
        saveSecao,
        getSecao,
        finalizarAvaliacao,
        saveMIF,
        getMIFAvaliacoes,
        reloadAvaliacao,
      }}
    >
      {children}
    </AvaliacaoContext.Provider>
  )
}

// Componente principal que usa Suspense
export function AvaliacaoProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando avaliação...</p>
          </div>
        </div>
      }
    >
      <AvaliacaoProviderInner>{children}</AvaliacaoProviderInner>
    </Suspense>
  )
}

export function useAvaliacao() {
  const context = useContext(AvaliacaoContext)
  if (context === undefined) {
    throw new Error("useAvaliacao must be used within an AvaliacaoProvider")
  }
  return context
}
