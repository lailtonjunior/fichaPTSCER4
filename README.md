
# 📋 PTS Form

Sistema web para construção, visualização e gestão de **Planos Terapêuticos Singulares (PTS)** e **Avaliações Interdisciplinares** para instituições de saúde.

---

## ✨ Funcionalidades Principais

- 📝 **Formulário de Avaliação Interdisciplinar**  
  Preenchimento de campos clínicos estruturados (Histórico médico, Fatores Ambientais, Atividade e Participação, Marcha e Equilíbrio, etc.).

- 🧭 **Navegação por Seções Relevantes**  
  Navegação por áreas específicas do formulário, com destaque para campos obrigatórios ou ainda não preenchidos.

- 📊 **Dashboard de Análises (MIF Analytics Dashboard)**  
  Visualização de métricas de evolução do paciente com base nos dados preenchidos.

- 📃 **Geração de Relatórios PDF**  
  Exportação dos formulários preenchidos em formato PDF com layout limpo e profissional.

- 🔎 **Seleção de Paciente**  
  Interface para selecionar o paciente a ser avaliado.

- 🔌 **Verificação de Conexão com Supabase**  
  Testes de conectividade e status da base de dados.

- 🎨 **Switch de Tema (Claro/Escuro)**  
  Suporte a temas escuro e claro.

- ✅ **Controle de Progresso de Formulário**  
  Indicação visual do progresso de preenchimento.

- 💡 **Sugestões Baseadas na MIF**  
  Recomendações automáticas baseadas em escalas funcionais.

- ⚙️ **Gerenciamento de Templates de Avaliação**  
  Permite personalizar e salvar modelos de avaliação.

---

## 🧱 Estrutura do Projeto

```
pts-form/
├── app/                  # Páginas e rotas Next.js
├── components/           # Componentes reutilizáveis
├── contexts/             # Contextos React (Ex: Avaliação, Conexão)
├── hooks/                # Custom React Hooks
├── lib/                  # Integrações externas e utilitários
├── public/               # Imagens e arquivos públicos
├── scripts/              # Scripts para setup do banco
├── styles/               # CSS global
├── types/                # Tipagens TypeScript
├── next.config.mjs       # Configuração Next.js
├── tailwind.config.ts    # Configuração Tailwind CSS
└── tsconfig.json         # Configuração TypeScript
```

---

## 🚀 Tecnologias Usadas

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Supabase**
- **Shadcn UI Components**
- **Framer Motion**
- **PDF Export Tools**

---

## ⚙️ Instalação Local (Desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/seuusuario/pts-form.git

# 2. Acesse a pasta
cd pts-form

# 3. Instale as dependências (usando pnpm)
pnpm install

# 4. Configure as variáveis de ambiente
# Crie um arquivo .env.local com as configurações do Supabase

# 5. Execute o projeto
pnpm dev
```

---

## 🗃️ Configuração do Supabase

O projeto depende de um backend Supabase.

- Configure as chaves de API, URL e outras variáveis de ambiente no arquivo `.env.local`.
- Rode o script `scripts/setup-database.sql` para criar as tabelas necessárias.

---

## 📑 Scripts Úteis

- `pnpm dev` → Inicia o ambiente de desenvolvimento.
- `pnpm build` → Gera a build de produção.
- `pnpm lint` → Faz análise de linting.

---

## 👨‍⚕️ Público-Alvo

- Profissionais de saúde
- Equipes multiprofissionais
- Instituições que executam Avaliações Interdisciplinares e PTS

---

## 📄 Licença

MIT © [Seu Nome / Instituição]
