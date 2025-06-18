"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { LayoutProvider } from "@/components/layout-context"
import { EspecialidadeProvider } from "@/components/especialidade-context"
import { FormProvider, useForm } from "react-hook-form"

import FormSectionWrapper from "@/components/form-section-wrapper"
import CampoEspecialidade from "@/components/campo-especialidade"
import SeletorEspecialidade from "@/components/seletor-especialidade"
import FormProgress from "@/components/form-progress"
import MIFSummary from "@/components/mif-summary"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function DemoPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [layout, setLayout] = useState<"detalhado" | "compacto" | "simplificado">("detalhado")
  const [activeTab, setActiveTab] = useState("identificacao")
  const methods = useForm()

  return (
    <ThemeProvider defaultTheme={theme} storageKey="pts-theme">
      <LayoutProvider defaultLayout={layout}>
        <EspecialidadeProvider>
          <FormProvider {...methods}>
            <div className="min-h-screen bg-background">
              <header className="border-b bg-card">
                <div className="container flex items-center justify-between py-4">
                  <h1 className="text-xl font-bold">Demonstração do Formulário PTS</h1>
                  <div className="flex items-center gap-4">
                    <Tabs value={theme} onValueChange={(v) => setTheme(v as "light" | "dark")}>
                      <TabsList>
                        <TabsTrigger value="light">Claro</TabsTrigger>
                        <TabsTrigger value="dark">Escuro</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <Tabs
                      value={layout}
                      onValueChange={(v) => setLayout(v as "detalhado" | "compacto" | "simplificado")}
                    >
                      <TabsList>
                        <TabsTrigger value="detalhado">Detalhado</TabsTrigger>
                        <TabsTrigger value="compacto">Compacto</TabsTrigger>
                        <TabsTrigger value="simplificado">Simplificado</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </header>

              <main className="container mx-auto py-8 px-4 max-w-5xl">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg mb-8 text-center">
                  <h1 className="text-3xl font-bold mb-2">Avaliação Funcional e Projeto Terapêutico Singular (PTS)</h1>
                  <p className="text-muted-foreground">Centro Especializado em Reabilitação – Modalidade Física</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
                  <div className="space-y-6">
                    <SeletorEspecialidade />
                    <MIFSummary />
                  </div>

                  <div className="space-y-6">
                    <FormProgress activeTab={activeTab} onTabChange={setActiveTab} />

                    <Card className="shadow-sm border-muted/40">
                      <CardHeader>
                        <CardTitle>Demonstração de Componentes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-8">
                        {/* Demonstração de FormSectionWrapper */}
                        <FormSectionWrapper
                          title="Demonstração de Seção"
                          description="Esta é uma demonstração de como as seções do formulário são exibidas com o novo design."
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="demo-nome">Nome Completo</Label>
                              <Input id="demo-nome" placeholder="Digite o nome completo" />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="demo-data">Data de Nascimento</Label>
                              <Input id="demo-data" type="date" />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="demo-diagnostico">Diagnóstico</Label>
                              <Textarea id="demo-diagnostico" placeholder="Digite o diagnóstico" />
                            </div>
                          </div>
                        </FormSectionWrapper>

                        {/* Demonstração de CampoEspecialidade */}
                        <FormSectionWrapper
                          title="Campos por Especialidade"
                          description="Demonstração de como os campos são destacados por especialidade."
                        >
                          <CampoEspecialidade campo="fisioterapia_avaliacao">
                            <div className="space-y-2">
                              <Label>Avaliação Fisioterapêutica</Label>
                              <Textarea placeholder="Digite a avaliação fisioterapêutica" />
                            </div>
                          </CampoEspecialidade>

                          <CampoEspecialidade campo="terapia_ocupacional_avaliacao">
                            <div className="space-y-2">
                              <Label>Avaliação de Terapia Ocupacional</Label>
                              <Textarea placeholder="Digite a avaliação de terapia ocupacional" />
                            </div>
                          </CampoEspecialidade>
                        </FormSectionWrapper>

                        {/* Demonstração de Campos MIF */}
                        <FormSectionWrapper
                          title="Avaliação MIF"
                          description="Demonstração dos campos de avaliação MIF."
                        >
                          <div className="space-y-4">
                            <div>
                              <Label className="mb-2 block">Mobilidade/Locomoção</Label>
                              <RadioGroup className="flex space-x-2" defaultValue="4" name="mif_mobilidadeLocomocao">
                                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                  <div key={value} className="flex flex-col items-center">
                                    <RadioGroupItem
                                      value={value.toString()}
                                      id={`mif-mob-${value}`}
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor={`mif-mob-${value}`}
                                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-muted bg-background 
                                      peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                                    >
                                      {value}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>

                            <div>
                              <Label className="mb-2 block">Autocuidado</Label>
                              <RadioGroup className="flex space-x-2" defaultValue="5" name="mif_autocuidado">
                                {[1, 2, 3, 4, 5, 6, 7].map((value) => (
                                  <div key={value} className="flex flex-col items-center">
                                    <RadioGroupItem
                                      value={value.toString()}
                                      id={`mif-auto-${value}`}
                                      className="peer sr-only"
                                    />
                                    <Label
                                      htmlFor={`mif-auto-${value}`}
                                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-muted bg-background 
                                      peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                                    >
                                      {value}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        </FormSectionWrapper>

                        {/* Botões de navegação */}
                        <div className="flex justify-between pt-4">
                          <Button variant="outline">Anterior</Button>
                          <Button>Próximo</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </main>
            </div>
          </FormProvider>
        </EspecialidadeProvider>
      </LayoutProvider>
    </ThemeProvider>
  )
}
