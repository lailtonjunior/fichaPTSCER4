-- Habilitar a extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de pacientes
CREATE TABLE IF NOT EXISTS public.pacientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT NOT NULL,
  data_nascimento DATE,
  cpf TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  responsavel TEXT
);

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paciente_id UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  especialidade TEXT NOT NULL,
  profissional TEXT,
  status TEXT DEFAULT 'rascunho',
  data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de seções de avaliação
CREATE TABLE IF NOT EXISTS public.secoes_avaliacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avaliacao_id UUID REFERENCES public.avaliacoes(id) ON DELETE CASCADE,
  secao TEXT NOT NULL,
  dados JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Tabela de avaliações MIF
CREATE TABLE IF NOT EXISTS public.mif_avaliacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  avaliacao_id UUID REFERENCES public.avaliacoes(id) ON DELETE CASCADE,
  categoria TEXT NOT NULL,
  pontuacao INTEGER NOT NULL,
  observacoes TEXT
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_paciente_id ON public.avaliacoes(paciente_id);
CREATE INDEX IF NOT EXISTS idx_secoes_avaliacao_id ON public.secoes_avaliacao(avaliacao_id);
CREATE INDEX IF NOT EXISTS idx_mif_avaliacoes_avaliacao_id ON public.mif_avaliacoes(avaliacao_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_nome ON public.pacientes(nome);

-- Políticas de segurança (RLS)
-- Por enquanto, vamos permitir acesso público para testes
ALTER TABLE public.pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secoes_avaliacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mif_avaliacoes ENABLE ROW LEVEL SECURITY;

-- Políticas que permitem acesso público (para testes)
CREATE POLICY "Acesso público aos pacientes" ON public.pacientes FOR ALL USING (true);
CREATE POLICY "Acesso público às avaliações" ON public.avaliacoes FOR ALL USING (true);
CREATE POLICY "Acesso público às seções" ON public.secoes_avaliacao FOR ALL USING (true);
CREATE POLICY "Acesso público às avaliações MIF" ON public.mif_avaliacoes FOR ALL USING (true);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pacientes_updated_at
BEFORE UPDATE ON pacientes
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_avaliacoes_updated_at
BEFORE UPDATE ON avaliacoes
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_secoes_avaliacao_updated_at
BEFORE UPDATE ON secoes_avaliacao
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_mif_avaliacoes_updated_at
BEFORE UPDATE ON mif_avaliacoes
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
