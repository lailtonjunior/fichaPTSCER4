import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Layout, Palette, Smartphone, Zap, Eye, Accessibility } from "lucide-react"

export default function DesignFeatures() {
  const features = [
    {
      icon: Layout,
      title: "Layout Aprimorado",
      description: "Layout de duas colunas em telas maiores, com melhor organização e hierarquia visual.",
    },
    {
      icon: Palette,
      title: "Design Moderno",
      description:
        "Cartões com sombras sutis, bordas arredondadas e cores harmoniosas para uma aparência contemporânea.",
    },
    {
      icon: Smartphone,
      title: "Totalmente Responsivo",
      description: "Adaptação perfeita a qualquer tamanho de tela, de smartphones a desktops.",
    },
    {
      icon: Zap,
      title: "Desempenho Otimizado",
      description: "Componentes leves e eficientes para garantir uma experiência rápida e fluida.",
    },
    {
      icon: Eye,
      title: "Tema Escuro",
      description: "Suporte completo para tema escuro, reduzindo a fadiga visual em ambientes com pouca luz.",
    },
    {
      icon: Accessibility,
      title: "Acessibilidade",
      description: "Componentes acessíveis com suporte para navegação por teclado e leitores de tela.",
    },
  ]

  return (
    <div className="py-12 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Características do Novo Design</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            O formulário foi completamente redesenhado para oferecer uma experiência mais moderna, intuitiva e agradável
            para os profissionais de saúde.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-muted/40">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-sm">
                        {index === 0 && item === 1 && "Melhor organização de conteúdo"}
                        {index === 0 && item === 2 && "Seções claramente delimitadas"}
                        {index === 0 && item === 3 && "Navegação intuitiva entre seções"}

                        {index === 1 && item === 1 && "Espaçamento otimizado entre elementos"}
                        {index === 1 && item === 2 && "Cores semânticas para indicar status"}
                        {index === 1 && item === 3 && "Ícones para melhorar a compreensão visual"}

                        {index === 2 && item === 1 && "Layout adaptativo para todos os dispositivos"}
                        {index === 2 && item === 2 && "Elementos reposicionados em telas menores"}
                        {index === 2 && item === 3 && "Componentes colapsáveis para economizar espaço"}

                        {index === 3 && item === 1 && "Carregamento rápido de componentes"}
                        {index === 3 && item === 2 && "Renderização eficiente de formulários complexos"}
                        {index === 3 && item === 3 && "Otimização de reações a mudanças de estado"}

                        {index === 4 && item === 1 && "Contraste adequado para leitura noturna"}
                        {index === 4 && item === 2 && "Cores ajustadas para conforto visual"}
                        {index === 4 && item === 3 && "Transição suave entre temas claro e escuro"}

                        {index === 5 && item === 1 && "Navegação completa por teclado"}
                        {index === 5 && item === 2 && "Textos alternativos para elementos visuais"}
                        {index === 5 && item === 3 && "Suporte para alto contraste e zoom"}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
