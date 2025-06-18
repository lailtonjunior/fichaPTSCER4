"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, Plus, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { pacienteService, avaliacaoService } from "@/services/database-service"
import { useAvaliacao } from "@/contexts/avaliacao-context"

export default function SelecionarPaciente() {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pacientes, setPacientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const { avaliacao, avaliacaoId } = useAvaliacao()
  const router = useRouter()
  const { toast } = useToast()

  // Formulário de novo paciente
  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    data_nascimento: "",
    cpf: "",
    telefone: "",
    email: "",
    endereco: "",
    responsavel: "",
  })

  // Carregar pacientes
  useEffect(() => {
    async function loadPacientes() {
      setLoading(true)
      const data = await pacienteService.getPacientes()
      setPacientes(data)
      setLoading(false)
    }

    loadPacientes()
  }, [])

  // Selecionar paciente
  const handleSelectPaciente = async (pacienteId: string) => {
    if (!avaliacao) return

    try {
      // Se já temos um ID de avaliação, atualizamos
      if (avaliacaoId) {
        await avaliacaoService.updateAvaliacao(avaliacao.id, {
          paciente_id: pacienteId,
        })

        toast({
          title: "Paciente selecionado",
          description: "Paciente vinculado à avaliação com sucesso",
        })

        // Recarregar a página para atualizar os dados
        router.refresh()
      } else {
        // Se não temos um ID, criamos uma nova avaliação
        const novaAvaliacao = await avaliacaoService.createAvaliacao({
          paciente_id: pacienteId,
          especialidade: "Fisioterapia", // Valor padrão, pode ser alterado depois
          profissional: "",
          status: "rascunho",
          data_avaliacao: new Date().toISOString(),
        })

        if (novaAvaliacao) {
          toast({
            title: "Avaliação criada",
            description: "Nova avaliação criada com sucesso",
          })

          // Redirecionar para a nova avaliação
          router.push(`/avaliacao?id=${novaAvaliacao.id}`)
        }
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      })
    }

    setOpen(false)
  }

  // Criar novo paciente
  const handleCreatePaciente = async () => {
    try {
      // Validar campos obrigatórios
      if (!novoPaciente.nome) {
        toast({
          title: "Erro",
          description: "O nome do paciente é obrigatório",
          variant: "destructive",
        })
        return
      }

      const paciente = await pacienteService.createPaciente(novoPaciente)

      if (paciente) {
        // Atualizar lista de pacientes
        setPacientes([...pacientes, paciente])

        // Selecionar o paciente recém-criado
        handleSelectPaciente(paciente.id)

        // Fechar o diálogo
        setDialogOpen(false)

        // Limpar o formulário
        setNovoPaciente({
          nome: "",
          data_nascimento: "",
          cpf: "",
          telefone: "",
          email: "",
          endereco: "",
          responsavel: "",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar paciente",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Encontrar o paciente selecionado
  const selectedPaciente = pacientes.find((p) => avaliacao?.paciente_id === p.id)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="paciente">Paciente</Label>
        <div className="flex gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                {selectedPaciente ? (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {selectedPaciente.nome}
                  </div>
                ) : (
                  "Selecionar paciente..."
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput
                  placeholder="Buscar paciente..."
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>
                    {searchValue ? (
                      <div className="py-6 text-center text-sm">
                        <p>Nenhum paciente encontrado</p>
                        <Button
                          variant="link"
                          onClick={() => {
                            setDialogOpen(true)
                            setOpen(false)
                            setNovoPaciente({
                              ...novoPaciente,
                              nome: searchValue,
                            })
                          }}
                          className="mt-2"
                        >
                          Cadastrar novo paciente
                        </Button>
                      </div>
                    ) : (
                      "Nenhum paciente encontrado"
                    )}
                  </CommandEmpty>
                  <CommandGroup>
                    {pacientes.map((paciente) => (
                      <CommandItem
                        key={paciente.id}
                        value={paciente.id}
                        onSelect={() => handleSelectPaciente(paciente.id)}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{paciente.nome}</span>
                        </div>
                        {avaliacao?.paciente_id === paciente.id && <Check className="ml-auto h-4 w-4" />}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                <DialogDescription>Preencha os dados do paciente para cadastrá-lo no sistema.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome*
                  </Label>
                  <Input
                    id="nome"
                    value={novoPaciente.nome}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, nome: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="data_nascimento" className="text-right">
                    Data Nasc.
                  </Label>
                  <Input
                    id="data_nascimento"
                    type="date"
                    value={novoPaciente.data_nascimento}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, data_nascimento: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="cpf" className="text-right">
                    CPF
                  </Label>
                  <Input
                    id="cpf"
                    value={novoPaciente.cpf}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, cpf: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="telefone" className="text-right">
                    Telefone
                  </Label>
                  <Input
                    id="telefone"
                    value={novoPaciente.telefone}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, telefone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoPaciente.email}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreatePaciente}>
                  Cadastrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
