import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Registrar fontes para melhorar a aparência
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: "bold",
    },
  ],
})

interface PDFDocumentProps {
  data: any
  title?: string
  includeSections?: Record<string, boolean>
}

// Cria estilos para o PDF com melhor formatação
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Roboto",
  },
  title: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2563eb", // Azul para o título
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center",
    color: "#4b5563", // Cinza para o subtítulo
  },
  section: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f3f4f6", // Fundo cinza claro para títulos de seção
    padding: 5,
    borderRadius: 3,
    color: "#1f2937",
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 10,
    color: "#374151",
  },
  field: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontWeight: "bold",
    marginBottom: 3,
    color: "#4b5563",
  },
  fieldValue: {
    marginBottom: 5,
    paddingLeft: 10,
    lineHeight: 1.4,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 15,
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#d1d5db",
    flex: 1,
  },
  tableCellLast: {
    padding: 6,
    flex: 1,
  },
  footer: {
    marginTop: 30,
    fontSize: 8,
    textAlign: "center",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "center",
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 5,
    textAlign: "center",
  },
  checkboxLabel: {
    flex: 1,
  },
  note: {
    fontSize: 9,
    fontStyle: "italic",
    marginTop: 5,
    color: "#6b7280",
  },
  mifTable: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginTop: 10,
    marginBottom: 15,
  },
  mifScore: {
    marginLeft: 5,
    fontSize: 9,
    fontStyle: "italic",
    color: "#4b5563",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#6b7280",
  },
  headerLine: {
    borderBottom: "1px solid #e5e7eb",
    marginBottom: 15,
    paddingBottom: 5,
  },
})

// Componente para o documento PDF
const PDFDocument = ({
  data,
  title = "AVALIAÇÃO FUNCIONAL E PROJETO TERAPÊUTICO SINGULAR (PTS)",
  includeSections = {},
}: PDFDocumentProps) => {
  // Função para verificar se uma seção deve ser incluída
  const shouldIncludeSection = (sectionId: string) => {
    // Se não houver configuração específica, incluir todas as seções
    if (Object.keys(includeSections).length === 0) return true
    return includeSections[sectionId] === true
  }

  // Função para obter a descrição da pontuação MIF
  const getMIFDescription = (score: number) => {
    if (!score) return ""

    switch (score) {
      case 1:
        return "Dependência Total"
      case 2:
        return "Dependência Máxima"
      case 3:
        return "Dependência Moderada"
      case 4:
        return "Dependência Mínima"
      case 5:
        return "Supervisão/Preparo"
      case 6:
        return "Independência Modificada"
      case 7:
        return "Independência Completa"
      default:
        return ""
    }
  }

  // Verificar se existem pontuações MIF
  const hasMIFScores = Object.keys(data).some((key) => key.startsWith("mif_") && data[key])

  // Calcular média MIF se houver pontuações
  const calculateMIFAverage = () => {
    if (!hasMIFScores) return null

    const mifFields = [
      "mif_mobilidadeLocomocao",
      "mif_autocuidado",
      "mif_comunicacaoInteracao",
      "mif_vidaDomestica",
      "mif_educacaoTrabalhoLazer",
      "mif_forcaTonosCoord",
      "mif_controlePostural",
      "mif_funcoesSensoriais",
      "mif_funcoesCognitivas",
    ]

    const validScores = mifFields.filter((field) => data[field])
    if (validScores.length === 0) return null

    const total = validScores.reduce((sum, field) => sum + Number.parseInt(data[field] || 0), 0)
    return Math.round((total / validScores.length) * 10) / 10
  }

  const mifAverage = calculateMIFAverage()

  // Formatar data atual
  const formatDate = () => {
    const date = new Date()
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Centro Especializado em Reabilitação – Modalidade Física</Text>
        <View style={styles.headerLine} />

        {shouldIncludeSection("identificacao") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. IDENTIFICAÇÃO DO PACIENTE</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Nome completo:</Text>
              <Text style={styles.fieldValue}>{data?.nome || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Data de nascimento / Idade:</Text>
              <Text style={styles.fieldValue}>{data?.dataNascimento || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Sexo:</Text>
              <Text style={styles.fieldValue}>{data?.sexo || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Endereço / Município de origem:</Text>
              <Text style={styles.fieldValue}>{data?.endereco || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Contato (telefone/e-mail):</Text>
              <Text style={styles.fieldValue}>{data?.contato || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Diagnóstico principal (CID-10):</Text>
              <Text style={styles.fieldValue}>{data?.diagnostico || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Motivo do encaminhamento / Queixa principal:</Text>
              <Text style={styles.fieldValue}>{data?.motivoEncaminhamento || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Modalidade de entrada:</Text>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.modalidadeFisica && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Física</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.modalidadeAuditiva && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Auditiva</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.modalidadeIntelectual && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Intelectual</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.modalidadeVisual && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Visual</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.modalidadeOPM && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>OPM/Bolsas</Text>
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Profissionais envolvidos:</Text>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profFisioterapia && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Fisioterapia</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profTO && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>TO</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profFono && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Fono</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profPsicologia && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Psicologia</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profAssistenciaSocial && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Assistência Social</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profEnfermagem && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Enfermagem</Text>
              </View>
              <View style={styles.checkboxContainer}>
                <View style={styles.checkbox}>{data?.profMedicina && <Text>X</Text>}</View>
                <Text style={styles.checkboxLabel}>Medicina</Text>
              </View>
            </View>
          </View>
        )}

        {shouldIncludeSection("percepcao") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. PERCEPÇÃO DO PACIENTE/FAMÍLIA</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Quais as principais dificuldades relatadas pelo paciente/família?</Text>
              <Text style={styles.fieldValue}>{data?.dificuldadesRelatadas || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>O que o paciente/família espera do tratamento?</Text>
              <Text style={styles.fieldValue}>{data?.expectativasTratamento || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>
                Quais metas ou atividades são consideradas mais importantes para ele/ela?
              </Text>
              <Text style={styles.fieldValue}>{data?.metasImportantes || ""}</Text>
            </View>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>

      {/* Página 2 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Centro Especializado em Reabilitação – Modalidade Física</Text>
        <View style={styles.headerLine} />

        {shouldIncludeSection("atividadeParticipacao") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. ATIVIDADE E PARTICIPAÇÃO</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Mobilidade/Locomoção:</Text>
              <Text style={styles.fieldValue}>
                {data?.mobilidadeLocomocao || ""}
                {data?.mif_mobilidadeLocomocao && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_mobilidadeLocomocao} -{" "}
                    {getMIFDescription(Number.parseInt(data.mif_mobilidadeLocomocao))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Autocuidado:</Text>
              <Text style={styles.fieldValue}>
                {data?.autocuidado || ""}
                {data?.mif_autocuidado && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_autocuidado} - {getMIFDescription(Number.parseInt(data.mif_autocuidado))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Comunicação e interação social:</Text>
              <Text style={styles.fieldValue}>
                {data?.comunicacaoInteracao || ""}
                {data?.mif_comunicacaoInteracao && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_comunicacaoInteracao} -{" "}
                    {getMIFDescription(Number.parseInt(data.mif_comunicacaoInteracao))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Vida doméstica e rotinas diárias:</Text>
              <Text style={styles.fieldValue}>
                {data?.vidaDomestica || ""}
                {data?.mif_vidaDomestica && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_vidaDomestica} - {getMIFDescription(Number.parseInt(data.mif_vidaDomestica))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Educação/Trabalho/Lazer:</Text>
              <Text style={styles.fieldValue}>
                {data?.educacaoTrabalhoLazer || ""}
                {data?.mif_educacaoTrabalhoLazer && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_educacaoTrabalhoLazer} -{" "}
                    {getMIFDescription(Number.parseInt(data.mif_educacaoTrabalhoLazer))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Principais Barreiras ou Dificuldades Enfrentadas:</Text>
              <Text style={styles.fieldValue}>{data?.principaisBarreiras || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Principais Potencialidades ou Capacidades Mantidas:</Text>
              <Text style={styles.fieldValue}>{data?.principaisPotencialidades || ""}</Text>
            </View>
          </View>
        )}

        {shouldIncludeSection("fatoresAmbientais") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. FATORES AMBIENTAIS</Text>

            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>4.1. Barreiras</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Residência adaptada? Riscos de acessibilidade no domicílio?</Text>
                <Text style={styles.fieldValue}>{data?.residenciaAdaptada || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Dificuldade de transporte?</Text>
                <Text style={styles.fieldValue}>{data?.dificuldadeTransporte || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Barreiras comunicacionais ou tecnológicas?</Text>
                <Text style={styles.fieldValue}>{data?.barreirasComTec || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Falta de apoio familiar ou sobrecarga do cuidador?</Text>
                <Text style={styles.fieldValue}>{data?.faltaApoioFamiliar || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Barreiras atitudinais (preconceitos, discriminação)?</Text>
                <Text style={styles.fieldValue}>{data?.barreirasAtitudinais || ""}</Text>
              </View>
            </View>

            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>4.2. Facilitadores</Text>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Presença de cuidador fixo ou rede de apoio?</Text>
                <Text style={styles.fieldValue}>{data?.presencaCuidador || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Uso de tecnologia assistiva?</Text>
                <Text style={styles.fieldValue}>{data?.usoTecnologia || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Acesso a benefícios sociais ou programas de auxílio?</Text>
                <Text style={styles.fieldValue}>{data?.acessoBeneficios || ""}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Boa compreensão das orientações pela família?</Text>
                <Text style={styles.fieldValue}>{data?.boaCompreensao || ""}</Text>
              </View>
            </View>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>

      {/* Página 3 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Centro Especializado em Reabilitação – Modalidade Física</Text>
        <View style={styles.headerLine} />

        {shouldIncludeSection("funcoesEstruturas") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. FUNÇÕES E ESTRUTURAS CORPORAIS</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Sistemas Comprometidos:</Text>
              <Text style={styles.fieldValue}>{data?.sistemasComprometidos || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Força, tônus, coordenação, equilíbrio:</Text>
              <Text style={styles.fieldValue}>
                {data?.forcaTonosCoord || ""}
                {data?.mif_forcaTonosCoord && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_forcaTonosCoord} - {getMIFDescription(Number.parseInt(data.mif_forcaTonosCoord))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Presença de dor:</Text>
              <Text style={styles.fieldValue}>{data?.presencaDor || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Deformidades, contraturas ou amputações:</Text>
              <Text style={styles.fieldValue}>{data?.deformidades || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Controle postural:</Text>
              <Text style={styles.fieldValue}>
                {data?.controlePostural || ""}
                {data?.mif_controlePostural && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_controlePostural} - {getMIFDescription(Number.parseInt(data.mif_controlePostural))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Funções sensoriais:</Text>
              <Text style={styles.fieldValue}>
                {data?.funcoesSensoriais || ""}
                {data?.mif_funcoesSensoriais && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_funcoesSensoriais} -{" "}
                    {getMIFDescription(Number.parseInt(data.mif_funcoesSensoriais))}]
                  </Text>
                )}
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Funções cognitivas/comportamentais:</Text>
              <Text style={styles.fieldValue}>
                {data?.funcoesCognitivas || ""}
                {data?.mif_funcoesCognitivas && (
                  <Text style={styles.mifScore}>
                    {" "}
                    [MIF: {data.mif_funcoesCognitivas} -{" "}
                    {getMIFDescription(Number.parseInt(data.mif_funcoesCognitivas))}]
                  </Text>
                )}
              </Text>
            </View>
          </View>
        )}

        {hasMIFScores && mifAverage && shouldIncludeSection("resumoMif") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>RESUMO DA AVALIAÇÃO MIF</Text>
            <View style={styles.mifTable}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Média MIF</Text>
                <Text style={styles.tableCell}>Interpretação</Text>
                <Text style={styles.tableCellLast}>Nível de Dependência</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{mifAverage}</Text>
                <Text style={styles.tableCell}>
                  {mifAverage < 3
                    ? "1-2: Dependência Completa"
                    : mifAverage < 5
                      ? "3-4: Dependência Modificada"
                      : mifAverage < 7
                        ? "5-6: Dependência Modificada/Supervisão"
                        : "7: Independência Completa"}
                </Text>
                <Text style={styles.tableCellLast}>
                  {mifAverage < 3 ? "Severa" : mifAverage < 5 ? "Moderada" : mifAverage < 7 ? "Leve" : "Independente"}
                </Text>
              </View>
            </View>
            <Text style={styles.note}>
              Escala MIF: 1 (Dependência Total), 2 (Dependência Máxima), 3 (Dependência Moderada), 4 (Dependência
              Mínima), 5 (Supervisão), 6 (Independência Modificada), 7 (Independência Completa)
            </Text>
          </View>
        )}

        {shouldIncludeSection("fatoresPessoais") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. FATORES PESSOAIS</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Idade, gênero, escolaridade:</Text>
              <Text style={styles.fieldValue}>{data?.idadeGeneroEscolaridade || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Ocupação / Papel social:</Text>
              <Text style={styles.fieldValue}>{data?.ocupacaoPapelSocial || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Condição socioeconômica:</Text>
              <Text style={styles.fieldValue}>{data?.condicaoSocioeconomica || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Hábitos e estilo de vida:</Text>
              <Text style={styles.fieldValue}>{data?.habitosEstiloVida || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Crenças, espiritualidade, práticas culturais:</Text>
              <Text style={styles.fieldValue}>{data?.crencasEspiritualidade || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Motivação e engajamento no tratamento:</Text>
              <Text style={styles.fieldValue}>{data?.motivacaoEngajamento || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Expectativas e prioridades pessoais:</Text>
              <Text style={styles.fieldValue}>{data?.expectativasPrioridades || ""}</Text>
            </View>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>

      {/* Página 4 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Centro Especializado em Reabilitação – Modalidade Física</Text>
        <View style={styles.headerLine} />

        {shouldIncludeSection("avaliacaoInterdisciplinar") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. AVALIAÇÃO INTERDISCIPLINAR</Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Profissional</Text>
                <Text style={styles.tableCell}>Impressões Clínicas / Avaliação</Text>
                <Text style={styles.tableCellLast}>Metas Específicas</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Fisioterapia</Text>
                <Text style={styles.tableCell}>{data?.fisioterapiaImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.fisioterapiaMetas || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Terapia Ocupacional</Text>
                <Text style={styles.tableCell}>{data?.terapiaOcupacionalImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.terapiaOcupacionalMetas || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Fonoaudiologia</Text>
                <Text style={styles.tableCell}>{data?.fonoaudiologiaImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.fonoaudiologiaMetas || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Psicologia</Text>
                <Text style={styles.tableCell}>{data?.psicologiaImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.psicologiaMetas || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Serviço Social</Text>
                <Text style={styles.tableCell}>{data?.servicoSocialImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.servicoSocialMetas || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Enfermagem/Medicina</Text>
                <Text style={styles.tableCell}>{data?.enfermagemMedicinaImpressoes || ""}</Text>
                <Text style={styles.tableCellLast}>{data?.enfermagemMedicinaMetas || ""}</Text>
              </View>
            </View>
          </View>
        )}

        {shouldIncludeSection("objetivosPts") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. OBJETIVOS DO PROJETO TERAPÊUTICO SINGULAR (PTS)</Text>

            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Prazo</Text>
                <Text style={styles.tableCellLast}>Objetivos Individualizados</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Curto prazo</Text>
                <Text style={styles.tableCellLast}>{data?.curtoPrazo || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Médio prazo</Text>
                <Text style={styles.tableCellLast}>{data?.medioPrazo || ""}</Text>
              </View>

              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Longo prazo</Text>
                <Text style={styles.tableCellLast}>{data?.longoPrazo || ""}</Text>
              </View>
            </View>

            <Text style={styles.note}>
              (Esses objetivos devem ser traçados com a participação do paciente/família.)
            </Text>
          </View>
        )}

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>

      {/* Página 5 */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Centro Especializado em Reabilitação – Modalidade Física</Text>
        <View style={styles.headerLine} />

        {shouldIncludeSection("planejamentoTerapeutico") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. PLANEJAMENTO TERAPÊUTICO E ACOMPANHAMENTO</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Frequência de atendimentos:</Text>
              <Text style={styles.fieldValue}>{data?.frequenciaAtendimentos || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Métodos e estratégias:</Text>
              <Text style={styles.fieldValue}>{data?.metodosEstrategias || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Escalas e testes aplicados:</Text>
              <Text style={styles.fieldValue}>{data?.escalasTestesAplicados || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Data(s) prevista(s) para reavaliação:</Text>
              <Text style={styles.fieldValue}>{data?.dataReavaliacao || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Registro de evolução:</Text>
              <Text style={styles.fieldValue}>{data?.registroEvolucao || ""}</Text>
            </View>
          </View>
        )}

        {shouldIncludeSection("encaminhamentos") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. POSSÍVEIS ENCAMINHAMENTOS INTERMODALIDADES / OUTRAS REDES</Text>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.reabilitacaoAuditiva && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>
                Avaliação em Reabilitação Auditiva (perda auditiva, uso de AASI, etc.)
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.reabilitacaoIntelectual && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>
                Avaliação em Reabilitação Intelectual (dificuldades cognitivas, comportamentais, inclusão escolar)
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.reabilitacaoVisual && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>
                Avaliação em Reabilitação Visual (dúvidas sobre acuidade visual, uso de recursos de baixa visão)
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.dispensacaoOPM && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>
                Dispensação de OPM / Bolsas Coletoras (aparelhos ortopédicos, próteses, bolsas etc.)
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.encaminhamentoSaude && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>
                Encaminhamento para outros serviços de saúde (alta complexidade, especialistas)
              </Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.encaminhamentoAssistencia && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>Encaminhamento à assistência social / serviços de convivência</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.encaminhamentoEducacao && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>Encaminhamento à educação (escolas inclusivas)</Text>
            </View>

            <View style={styles.checkboxContainer}>
              <View style={styles.checkbox}>{data?.encaminhamentoOutros && <Text>X</Text>}</View>
              <Text style={styles.checkboxLabel}>Outros</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Especifique outros encaminhamentos:</Text>
              <Text style={styles.fieldValue}>{data?.outrosEncaminhamentos || ""}</Text>
            </View>
          </View>
        )}

        {shouldIncludeSection("criteriosAlta") && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. CRITÉRIOS DE ALTA / TRANSFERÊNCIA / REAVALIAÇÃO</Text>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Critérios para alta ou transferência:</Text>
              <Text style={styles.fieldValue}>{data?.criteriosAlta || ""}</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Registrar data, motivos, e orientações pós-alta:</Text>
              <Text style={styles.fieldValue}>{data?.registroAlta || ""}</Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>AVALIAÇÃO FUNCIONAL E PROJETO TERAPÊUTICO SINGULAR (PTS) - Gerado em {formatDate()}</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

export default PDFDocument
