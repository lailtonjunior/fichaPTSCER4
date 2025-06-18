"use client"

import { useState, useEffect } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PDFDownloadLink } from "@react-pdf/renderer"
import {
  ChevronLeft,
  ChevronRight,
  Save,
  FileText,
  UserCircle,
  ClipboardList,
  Eye,
  Activity,
  Home,
  Heart,
  Footprints,
  ShowerHead,
  User,
  Users,
  Target,
  Calendar,
  ArrowRightCircle,
  LogOut,
  FileBarChart,
} from "lucide-react"

import IdentificacaoPaciente from "./form-sections/identificacao-paciente"
import HistoricoMedico from "./form-sections/historico-medico"
import PercepcaoPaciente from "./form-sections/percepcao-paciente"
import AtividadeParticipacao from "./form-sections/atividade-participacao"
import FatoresAmbientais from "./form-sections/fatores-ambientais"
import FuncoesEstruturas from "./form-sections/funcoes-estruturas"
import MarchaEquilibrio from "./form-sections/marcha-equilibrio"
import FatoresPessoais from "./form-sections/fatores-pessoais"
import AvaliacaoAVDs from "./form-sections/avaliacao-avds"
import AvaliacaoInterdisciplinar from "./form-sections/avaliacao-interdisciplinar"
import ObjetivosPTS from "./form-sections/objetivos-pts"
import PlanejamentoTerapeutico from "./form-sections/planejamento-terapeutico"
import EncaminhamentosRedes from "./form-sections/encaminhamentos-redes"
import CriteriosAlta from "./form-sections/criterios-alta"
import PDFDocument from "./pdf-document"
import MIFSummary from "./mif-summary"
import ResumoEspecialidades from "./resumo-especialidades"
import SeletorEspecialidade from "./seletor-especialidade"
import SelecionarPaciente from "./selecionar-paciente"
import NavegacaoCamposRelevantes from "./navegacao-campos-relevantes"
import { EspecialidadeProvider } from "./especialidade-context"
import { useLayoutContext } from "./layout-context"
import { cn } from "@/lib/utils"
import ReportBuilder from "./report-builder"
import FloatingMenu from "./floating-menu"
import FormProgress from "./form-progress"
import { useTheme } from "./theme-provider"
import { useAvaliacao } from "@/contexts/avaliacao-context"
import { useToast } from "./ui/use-toast"

// Definição das abas com ícones
const tabs = [
  { id: "identificacao", label: "1. Identificação", icon: UserCircle },
  { id: "historico", label: "2. Histórico Médico", icon: ClipboardList },
  { id: "percepcao", label: "3. Percepção", icon: Eye },
  { id: "atividade", label: "4. Atividade", icon: Activity },
  { id: "ambientais", label: "5. Fatores Ambientais", icon: Home },
  { id: "funcoes", label: "6. Funções e Estruturas", icon: Heart },
  { id: "marcha", label: "6.1. Marcha e Equilíbrio", icon: Footprints },
  { id: "avds", label: "6.2. AVDs", icon: ShowerHead },
  { id: "pessoais", label: "7. Fatores Pessoais", icon: User },
  { id: "avaliacao", label: "8. Avaliação", icon: Users },
  { id: "objetivos", label: "9. Objetivos", icon: Target },
  { id: "planejamento", label: "10. Planejamento", icon: Calendar },
  { id: "encaminhamentos", label: "11. Encaminhamentos", icon: ArrowRightCircle },
  { id: "criterios", label: "12. Critérios de Alta", icon: LogOut },
  { id: "resumos", label: "13. Resumos", icon: FileBarChart },
]

// Descrições das seções para exibição consistente, agora mais específicas
const sectionDescriptions = {
  identificacao: "Dados cadastrais e informações de contato do paciente para registro e acompanhamento.",
  historico: "Registro cronológico de condições médicas, tratamentos anteriores e evolução clínica do paciente.",
  percepcao: "Registro das expectativas, dificuldades e prioridades relatadas pelo paciente e seus familiares.",
  atividade: "Análise da capacidade funcional do paciente em mobilidade, autocuidado e interação social no dia a dia.",
  ambientais: "Avaliação de elementos externos que facilitam ou dificultam a participação do paciente na sociedade.",
  funcoes: "Exame detalhado dos sistemas corporais e suas alterações funcionais relacionadas à condição do paciente.",
  marcha: "Avaliação específica do padrão de caminhada, equilíbrio estático/dinâmico e risco de quedas.",
  avds: "Mensuração da independência nas atividades diárias como alimentação, higiene e vestuário.",
  pessoais:
    "Análise de fatores individuais como idade, escolaridade, ocupação e motivação que influenciam o tratamento.",
  avaliacao:
    "Registro das impressões clínicas e objetivos terapêuticos de cada profissional da equipe multidisciplinar.",
  objetivos: "Definição de metas terapêuticas de curto, médio e longo prazo para o projeto singular do paciente.",
  planejamento: "Organização da frequência, métodos e estratégias de intervenção para alcançar os objetivos propostos.",
  encaminhamentos: "Indicação de serviços complementares necessários para a continuidade do cuidado integral.",
  criterios: "Parâmetros para determinar quando o paciente deve receber alta, ser transferido ou reavaliado.",
  resumos: "Síntese das avaliações e condutas para documentação em prontuário e comunicação entre profissionais.",
}

export default function PTSForm() {
  const [activeTab, setActiveTab] = useState("identificacao")
  const methods = useForm()
  const [formData, setFormData] = useState({})
  const [isFormComplete, setIsFormComplete] = useState(false)
  const { layout } = useLayoutContext()
  const { theme } = useTheme()
  const { avaliacao, saveSecao, finalizarAvaliacao, isLoading, getSecao } = useAvaliacao()
  const { toast } = useToast()

  // Substitua o useEffect existente por esta versão melhorada:

  // Carregar dados do formulário quando a avaliação mudar
  useEffect(() => {
    async function loadFormData() {
      if (avaliacao) {
        try {
          // Carregar dados de todas as seções
          for (const tab of tabs) {
            const secaoData = await getSecao(tab.id)
            if (secaoData) {
              // Preencher o formulário com os dados da seção
              Object.entries(secaoData).forEach(([key, value]) => {
                methods.setValue(key, value)
              })
            }
          }
        } catch (error) {
          console.error("Erro ao carregar dados do formulário:", error)
        }
      }
    }

    loadFormData()
  }, [avaliacao, methods, getSecao])

  const handleTabChange = (value: string) => {
    // Salvar dados da aba atual antes de mudar
    const currentFormData = methods.getValues()
    if (avaliacao && Object.keys(currentFormData).length > 0) {
      saveSecao(activeTab, currentFormData)
    }

    setActiveTab(value)
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const nextTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id)
    }
  }

  const prevTab = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
    if (currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id)
    }
  }

  const onSubmit = async (data: any) => {
    if (!avaliacao) {
      toast({
        title: "Erro",
        description: "Selecione um paciente antes de finalizar a avaliação",
        variant: "destructive",
      })
      return
    }

    try {
      // Salvar todos os dados do formulário
      await saveSecao(activeTab, data)

      // Finalizar a avaliação
      await finalizarAvaliacao()

      // Atualizar os dados do formulário para o PDF
      const formattedData = {
        ...data,
        nome: avaliacao.paciente_nome || data.nome,
        dataNascimento: data.dataNascimento || "",
        sexo: data.sexo || "",
        endereco: data.endereco || "",
        contato: data.contato || "",
        diagnostico: data.diagnostico || "",
        motivoEncaminhamento: data.motivoEncaminhamento || "",
      }

      setFormData(formattedData)
      setIsFormComplete(true)

      toast({
        title: "Avaliação finalizada",
        description: "Avaliação finalizada com sucesso. Você pode baixar o PDF agora.",
      })

      // Após finalizar, vá para a aba de resumos
      setActiveTab("resumos")
    } catch (error: any) {
      toast({
        title: "Erro ao finalizar",
        description: error.message || "Ocorreu um erro ao finalizar a avaliação",
        variant: "destructive",
      })
    }
  }

  // Determinar o índice da aba atual
  const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab)
  const isFirstTab = currentTabIndex === 0
  const isLastTab = currentTabIndex === tabs.length - 1
  const isResumoTab = activeTab === "resumos"

  // Obter o ícone da aba ativa
  const activeTabIcon = tabs.find((tab) => tab.id === activeTab)?.icon || FileText
  const ActiveIcon = activeTabIcon

  // Mostrar loading enquanto carrega a avaliação
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando avaliação...</p>
        </div>
      </div>
    )
  }

  return (
    <EspecialidadeProvider>
      <FormProvider {...methods}>
        {/* Skip link para acessibilidade */}
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>

        <div className="container mx-auto py-8 px-4 max-w-5xl">
          <div className="p-4 border border-muted rounded-lg mb-6 text-center bg-card">
            <h1 className="text-2xl font-bold uppercase">Avaliação Funcional e Projeto Terapêutico Singular (PTS)</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Centro Especializado em Reabilitação – Modalidade Física
            </p>
          </div>

          <div className="space-y-6">
            <div className="mb-6">
              <Card className="p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <SelecionarPaciente />
                  <SeletorEspecialidade />
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <form onSubmit={methods.handleSubmit(onSubmit)} id="main-content">
                {/* Barra de Progresso */}
                <FormProgress activeTab={activeTab} onTabChange={handleTabChange} />

                <Card className="mb-8 shadow-sm border-muted/40">
                  <CardContent
                    className={cn("pt-6", layout === "compacto" && "pt-4", layout === "simplificado" && "pt-3 px-3")}
                  >
                    <Tabs value={activeTab} onValueChange={handleTabChange}>
                      <TabsList className="flex flex-wrap mb-6 bg-muted/50 gap-1 p-1" aria-label="Seções do formulário">
                        {tabs.map((tab) => {
                          const TabIcon = tab.icon
                          return (
                            <TabsTrigger
                              key={tab.id}
                              value={tab.id}
                              className={cn(
                                "text-xs py-1.5 px-2 flex items-center gap-1",
                                activeTab === tab.id && "bg-primary text-primary-foreground",
                              )}
                            >
                              <TabIcon className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">{tab.label}</span>
                              <span className="sm:hidden">{tab.id === activeTab ? tab.label : ""}</span>
                            </TabsTrigger>
                          )
                        })}
                      </TabsList>

                      <div className="p-4 bg-muted/20 rounded-md mb-6">
                        <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                          <ActiveIcon className="h-5 w-5 text-primary" />
                          {tabs.find((tab) => tab.id === activeTab)?.label}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {sectionDescriptions[activeTab as keyof typeof sectionDescriptions]}
                        </p>
                      </div>

                      <div className="bg-card p-4 rounded-lg border border-muted">
                        <TabsContent value="identificacao">
                          <IdentificacaoPaciente />
                        </TabsContent>
                        <TabsContent value="historico">
                          <HistoricoMedico />
                        </TabsContent>
                        <TabsContent value="percepcao">
                          <PercepcaoPaciente />
                        </TabsContent>
                        <TabsContent value="atividade">
                          <AtividadeParticipacao />
                        </TabsContent>
                        <TabsContent value="ambientais">
                          <FatoresAmbientais />
                        </TabsContent>
                        <TabsContent value="funcoes">
                          <FuncoesEstruturas />
                        </TabsContent>
                        <TabsContent value="marcha">
                          <MarchaEquilibrio />
                        </TabsContent>
                        <TabsContent value="avds">
                          <AvaliacaoAVDs />
                        </TabsContent>
                        <TabsContent value="pessoais">
                          <FatoresPessoais />
                        </TabsContent>
                        <TabsContent value="avaliacao">
                          <AvaliacaoInterdisciplinar />
                        </TabsContent>
                        <TabsContent value="objetivos">
                          <ObjetivosPTS />
                        </TabsContent>
                        <TabsContent value="planejamento">
                          <PlanejamentoTerapeutico />
                        </TabsContent>
                        <TabsContent value="encaminhamentos">
                          <EncaminhamentosRedes />
                        </TabsContent>
                        <TabsContent value="criterios">
                          <CriteriosAlta />
                        </TabsContent>
                        <TabsContent value="resumos">
                          <ResumoEspecialidades />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="flex flex-wrap justify-between items-center gap-2 mt-4 border border-muted p-3 rounded-lg bg-card">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevTab}
                    disabled={isFirstTab}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const currentFormData = methods.getValues()
                        if (avaliacao) {
                          saveSecao(activeTab, currentFormData)
                          toast({
                            title: "Dados salvos",
                            description: "Os dados desta seção foram salvos com sucesso",
                          })
                        } else {
                          toast({
                            title: "Erro ao salvar",
                            description: "Selecione um paciente antes de salvar",
                            variant: "destructive",
                          })
                        }
                      }}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>

                    <ReportBuilder />

                    {isFormComplete && (
                      <PDFDownloadLink
                        document={<PDFDocument data={formData} />}
                        fileName="avaliacao-pts.pdf"
                        className="inline-block"
                      >
                        {({ loading }) => (
                          <Button variant="outline" disabled={loading} className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            {loading ? "Preparando documento..." : "Baixar PDF Completo"}
                          </Button>
                        )}
                      </PDFDownloadLink>
                    )}

                    {isLastTab ? (
                      <Button
                        type="submit"
                        className="flex items-center gap-2"
                        onClick={() => {
                          // Garantir que os dados atuais sejam salvos antes de finalizar
                          const currentFormData = methods.getValues()
                          if (avaliacao && Object.keys(currentFormData).length > 0) {
                            saveSecao(activeTab, currentFormData)
                          }
                        }}
                      >
                        <Save className="h-4 w-4" />
                        Finalizar e Gerar PDF
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={nextTab}
                        disabled={isResumoTab}
                        className="flex items-center gap-2"
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </form>

              <div className="mt-6">
                <MIFSummary />
              </div>
            </div>
          </div>

          {/* Menu flutuante */}
          <FloatingMenu />

          {/* Navegação entre campos relevantes */}
          <NavegacaoCamposRelevantes />
        </div>
      </FormProvider>
    </EspecialidadeProvider>
  )
}
