"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Plus, Search, MoreVertical, Edit, Trash2, Copy, FileOutput, AlertCircle } from "lucide-react"
import { avaliacaoService } from "@/services/database-service"
import { formatarData } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { ConnectionStatus } from "@/components/connection-status"
import { testConnection } from "@/lib/supabase"

export default function AvaliacoesPage() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [avaliacaoToDelete, setAvaliacaoToDelete] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const [showDiagnostics, setShowDiagnostics] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // Carregar avaliações
  const loadAvaliacoes = async () => {
    setLoading(true)
    setConnectionError(null)

    try {
      // Testar a conexão primeiro
      const connectionTest = await testConnection()
      if (!connectionTest.success) {
        setConnectionError(connectionTest.error)
        setShowDiagnostics(true)
        setLoading(false)
        return
      }

      const data = await avaliacaoService.getAvaliacoes()
      setAvaliacoes(data)
    } catch (error: any) {
      console.error("Erro ao carregar avaliações:", error)
      setConnectionError(error.message || "Erro desconhecido")
      setShowDiagnostics(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAvaliacoes()
  }, [])

  // Filtrar avaliações pelo termo de busca
  const filteredAvaliacoes = avaliacoes.filter((avaliacao) => {
    const pacienteNome = avaliacao.pacientes?.nome || ""
    const especialidade = avaliacao.especialidade || ""
    const profissional = avaliacao.profissional || ""
    const searchTermLower = searchTerm.toLowerCase()

    return (
      pacienteNome.toLowerCase().includes(searchTermLower) ||
      especialidade.toLowerCase().includes(searchTermLower) ||
      profissional.toLowerCase().includes(searchTermLower)
    )
  })

  // Excluir avaliação
  const handleDeleteAvaliacao = async () => {
    if (!avaliacaoToDelete) return

    const success = await avaliacaoService.deleteAvaliacao(avaliacaoToDelete)

    if (success) {
      setAvaliacoes(avaliacoes.filter((a) => a.id !== avaliacaoToDelete))
    }

    setAvaliacaoToDelete(null)
    setDeleteDialogOpen(false)
  }

  // Confirmar exclusão
  const confirmDelete = (id: string) => {
    setAvaliacaoToDelete(id)
    setDeleteDialogOpen(true)
  }

  // Duplicar avaliação
  const handleDuplicateAvaliacao = async (id: string) => {
    const avaliacao = avaliacoes.find((a) => a.id === id)

    if (!avaliacao) return

    const novaAvaliacao = await avaliacaoService.createAvaliacao({
      paciente_id: avaliacao.paciente_id,
      especialidade: avaliacao.especialidade,
      profissional: avaliacao.profissional,
      status: "rascunho",
      data_avaliacao: new Date().toISOString(),
    })

    if (novaAvaliacao) {
      toast({
        title: "Avaliação duplicada",
        description: "Uma nova avaliação foi criada com base na selecionada",
      })

      // Recarregar a lista
      const data = await avaliacaoService.getAvaliacoes()
      setAvaliacoes(data)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">Avaliações</CardTitle>
              <CardDescription>Gerencie todas as avaliações de pacientes</CardDescription>
            </div>
            <Button onClick={() => router.push("/avaliacao")} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nova Avaliação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showDiagnostics && (
            <div className="mb-6">
              <ConnectionStatus />
              <Button onClick={() => setShowDiagnostics(false)} variant="outline" className="mt-4">
                Ocultar Diagnóstico
              </Button>
            </div>
          )}
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar avaliações..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : connectionError && !loading ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 opacity-50" />
              <h3 className="mt-4 text-lg font-semibold text-red-600">Erro de Conexão</h3>
              <p className="text-muted-foreground mt-2">{connectionError}</p>
              <div className="mt-4 space-x-2">
                <Button onClick={loadAvaliacoes} variant="outline">
                  Tentar Novamente
                </Button>
                <Button onClick={() => setShowDiagnostics(true)} variant="secondary">
                  Mostrar Diagnóstico
                </Button>
              </div>
            </div>
          ) : filteredAvaliacoes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">Nenhuma avaliação encontrada</h3>
              <p className="text-muted-foreground mt-2">
                {searchTerm ? "Tente outro termo de busca" : "Comece criando uma nova avaliação"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Profissional</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAvaliacoes.map((avaliacao) => (
                    <TableRow key={avaliacao.id}>
                      <TableCell className="font-medium">{avaliacao.pacientes?.nome || "Sem paciente"}</TableCell>
                      <TableCell>{avaliacao.especialidade}</TableCell>
                      <TableCell>{avaliacao.profissional || "Não informado"}</TableCell>
                      <TableCell>
                        {avaliacao.data_avaliacao ? formatarData(new Date(avaliacao.data_avaliacao)) : "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            avaliacao.status === "finalizado"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                          }`}
                        >
                          {avaliacao.status === "finalizado" ? "Finalizado" : "Rascunho"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/avaliacao?id=${avaliacao.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateAvaliacao(avaliacao.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              <span>Duplicar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => confirmDelete(avaliacao.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                            {avaliacao.status === "finalizado" && (
                              <DropdownMenuItem onClick={() => router.push(`/relatorio?id=${avaliacao.id}`)}>
                                <FileOutput className="mr-2 h-4 w-4" />
                                <span>Gerar relatório</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAvaliacao}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
