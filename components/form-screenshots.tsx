import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function FormScreenshots() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Visualização do Formulário PTS</h1>

      <Tabs defaultValue="light" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="light">Tema Claro</TabsTrigger>
          <TabsTrigger value="dark">Tema Escuro</TabsTrigger>
        </TabsList>

        <TabsContent value="light" className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                <Image
                  src="/medical-form-clean.png"
                  alt="Formulário PTS - Tema Claro"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center mt-4 text-muted-foreground">Visão geral do formulário com tema claro</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src="/patient-identification-form.png"
                    alt="Seção de Identificação - Tema Claro"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center mt-4 text-muted-foreground">Seção de Identificação do Paciente</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src="/medical-form-progress.png"
                    alt="Barra de Progresso - Tema Claro"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center mt-4 text-muted-foreground">Barra de Progresso e Navegação</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dark" className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                <Image
                  src="/dark-themed-medical-form.png"
                  alt="Formulário PTS - Tema Escuro"
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center mt-4 text-muted-foreground">Visão geral do formulário com tema escuro</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src="/dark-mif-assessment-form.png"
                    alt="Resumo MIF - Tema Escuro"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center mt-4 text-muted-foreground">Resumo da Avaliação MIF</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="aspect-video relative rounded-lg overflow-hidden border">
                  <Image
                    src="/placeholder.svg?height=720&width=1280&query=formulário médico seletor de especialidade, tema escuro"
                    alt="Seletor de Especialidade - Tema Escuro"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center mt-4 text-muted-foreground">Seletor de Especialidade</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-muted/20 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Principais Melhorias</h2>
        <ul className="space-y-2 list-disc pl-6">
          <li>Layout de duas colunas em telas maiores para melhor organização</li>
          <li>Cabeçalho com gradiente para destacar o título do formulário</li>
          <li>Cartões com sombras sutis para criar profundidade visual</li>
          <li>Melhor espaçamento entre elementos para reduzir a sensação de aglomeração</li>
          <li>Seções claramente delimitadas com bordas e espaçamento consistente</li>
          <li>Campos agrupados visualmente quando relevantes para a especialidade</li>
          <li>Ícones adicionados em vários componentes para melhorar a compreensão visual</li>
          <li>Indicadores de progresso redesenhados com bordas arredondadas</li>
          <li>Cores semânticas para indicar status (verde para completo, âmbar para parcial)</li>
          <li>Botões de navegação aprimorados com ícones e melhor posicionamento</li>
          <li>Suporte completo para tema escuro</li>
          <li>Layout responsivo que se adapta a diferentes tamanhos de tela</li>
        </ul>
      </div>
    </div>
  )
}
