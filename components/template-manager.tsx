"use client"

import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useEspecialidade, type Especialidade } from "./especialidade-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Save, FileText, Trash2, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { camposEspecialidades } from "./especialidade-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Interface para o template
interface Template {
  id: string
  nome: string
  especialidade: Especialidade
  dataCriacao: string
  dados: Record<string, any>
}

interface TemplateManagerProps {
  onClose?: () => void
}

export default function TemplateManager({ onClose }: TemplateManagerProps) {
  const { especialidadeSelecionada } = useEspecialidade()
  const { getValues, reset } = useFormContext()

  const [templates, setTemplates] = useState<Template[]>([])
  const [novoTemplateName, setNovoTemplateName] = useState("")
  const [templateSelecionado, setTemplateSelecionado] = useState<string | null>(null)
  const [dialogoSalvarAberto, setDialogoSalvarAberto] = useState(false)
  const [activeTab, setActiveTab] = useState<"salvar" | "carregar" | "gerenciar">("carregar")

  // Carregar templates do localStorage ao iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const templatesArmazenados = localStorage.getItem("pts_templates")
      if (templatesArmazenados) {
        try {
          setTemplates(JSON.parse(templatesArmazenados))
        } catch (error) {
          console.error("Erro ao carregar templates:", error)
        }
      }
    }
  }, [])

  // Filtrar templates pela especialidade atual
  const templatesEspecialidade = templates.filter((template) => template.especialidade === especialidadeSelecionada)

  // Salvar um novo template
  const salvarTemplate = () => {
    if (!novoTemplateName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe um nome para o template.",
        variant: "destructive",
      })
      return
    }

    // Obter apenas os campos relevantes para a especialidade
    const todosValores = getValues()
    const dadosTemplate: Record<string, any> = {}

    // Se for "todas", salva todos os campos
    if (especialidadeSelecionada === "todas") {
      Object.assign(dadosTemplate, todosValores)
    } else {
      // Caso contrário, salva apenas os campos relevantes para a especialidade
      Object.entries(camposEspecialidades).forEach(([campo, especialidades]) => {
        if (especialidades.includes(especialidadeSelecionada) || especialidades.includes("todas")) {
          dadosTemplate[campo] = todosValores[campo]

          // Também salvar os valores MIF associados, se existirem
          const campoMIF = `mif_${campo}`
          if (todosValores[campoMIF]) {
            dadosTemplate[campoMIF] = todosValores[campoMIF]
          }
        }
      })
    }

    const novoTemplate: Template = {
      id: Date.now().toString(),
      nome: novoTemplateName,
      especialidade: especialidadeSelecionada,
      dataCriacao: new Date().toISOString(),
      dados: dadosTemplate,
    }

    const novosTemplates = [...templates, novoTemplate]
    setTemplates(novosTemplates)

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_templates", JSON.stringify(novosTemplates))
    }

    setNovoTemplateName("")
    setDialogoSalvarAberto(false)
    setActiveTab("carregar")

    toast({
      title: "Template salvo",
      description: `O template "${novoTemplateName}" foi salvo com sucesso.`,
    })
  }

  // Carregar um template
  const carregarTemplate = () => {
    if (!templateSelecionado) return

    const template = templates.find((t) => t.id === templateSelecionado)
    if (!template) return

    // Obter valores atuais do formulário para manter campos não incluídos no template
    const valoresAtuais = getValues()

    // Mesclar os dados do template com os valores atuais
    const dadosMesclados = { ...valoresAtuais, ...template.dados }

    // Resetar o formulário com os dados mesclados
    reset(dadosMesclados)

    setTemplateSelecionado(null)

    toast({
      title: "Template carregado",
      description: `O template "${template.nome}" foi carregado com sucesso.`,
    })

    if (onClose) {
      onClose()
    }
  }

  // Excluir um template
  const excluirTemplate = (id: string) => {
    const novosTemplates = templates.filter((template) => template.id !== id)
    setTemplates(novosTemplates)

    if (typeof window !== "undefined") {
      localStorage.setItem("pts_templates", JSON.stringify(novosTemplates))
    }

    toast({
      title: "Template excluído",
      description: "O template foi excluído com sucesso.",
    })
  }

  // Formatar data para exibição
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO)
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Obter nome da especialidade para exibição
  const getNomeEspecialidade = (esp: Especialidade) => {
    const nomes: Record<Especialidade, string> = {
      todas: "Todas as Especialidades",
      fisioterapia: "Fisioterapia",
      terapia_ocupacional: "Terapia Ocupacional",
      fonoaudiologia: "Fonoaudiologia",
      psicologia: "Psicologia",
      assistencia_social: "Assistência Social",
      enfermagem: "Enfermagem",
      medicina: "Medicina",
      nutricao: "Nutrição",
      pedagogia: "Pedagogia",
      educador_fisico: "Educador Físico",
      musicoterapia: "Musicoterapia",
    }
    return nomes[esp]
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="carregar">Carregar</TabsTrigger>
          <TabsTrigger value="salvar">Salvar Novo</TabsTrigger>
          <TabsTrigger value="gerenciar">Gerenciar</TabsTrigger>
        </TabsList>

        {/* Aba Carregar */}
        <TabsContent value="carregar" className="space-y-4">
          {templatesEspecialidade.length > 0 ? (
            <div className="grid gap-4">
              <Label htmlFor="template-select">Selecione um template para carregar:</Label>
              <Select value={templateSelecionado || ""} onValueChange={setTemplateSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Templates disponíveis</SelectLabel>
                    {templatesEspecialidade.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.nome} ({formatarData(template.dataCriacao)})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button onClick={carregarTemplate} disabled={!templateSelecionado} className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Carregar Template Selecionado
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum template disponível para {getNomeEspecialidade(especialidadeSelecionada)}.</p>
              <Button variant="outline" onClick={() => setActiveTab("salvar")} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Template
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Aba Salvar */}
        <TabsContent value="salvar" className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nome-template">Nome do Template</Label>
              <Input
                id="nome-template"
                value={novoTemplateName}
                onChange={(e) => setNovoTemplateName(e.target.value)}
                placeholder="Ex: Avaliação padrão"
              />
            </div>

            <div className="grid gap-2">
              <Label>Especialidade</Label>
              <div className="p-2 bg-muted rounded-md">
                <span className="font-medium">{getNomeEspecialidade(especialidadeSelecionada)}</span>
                {especialidadeSelecionada !== "todas" && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Apenas os campos relevantes para esta especialidade serão salvos.
                  </p>
                )}
              </div>
            </div>

            <Button onClick={salvarTemplate} disabled={!novoTemplateName.trim()}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Template
            </Button>
          </div>
        </TabsContent>

        {/* Aba Gerenciar */}
        <TabsContent value="gerenciar" className="space-y-4">
          {templates.length > 0 ? (
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{template.nome}</CardTitle>
                        <CardDescription>
                          {getNomeEspecialidade(template.especialidade)} • {formatarData(template.dataCriacao)}
                        </CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir template</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o template "{template.nome}"? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => excluirTemplate(template.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTemplateSelecionado(template.id)
                        carregarTemplate()
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Carregar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum template salvo. Crie templates para agilizar o preenchimento do formulário.</p>
              <Button variant="outline" onClick={() => setActiveTab("salvar")} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Criar Novo Template
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
