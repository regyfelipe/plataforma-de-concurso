"use server"

import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const importedAlternativeSchema = z.object({
  letra: z.string().trim().min(1).max(1).optional(),
  letter: z.string().trim().min(1).max(1).optional(),
  texto: z.string().trim().min(1).optional(),
  text: z.string().trim().min(1).optional(),
  correta: z.boolean().optional(),
  isCorrect: z.boolean().optional(),
  explicacao: z.string().trim().optional(),
  explanation: z.string().trim().optional(),
  referencia: z.string().trim().optional(),
  reference: z.string().trim().optional(),
  dica: z.string().trim().optional(),
  tip: z.string().trim().optional(),
})

const importedQuestionSchema = z.object({
  disciplina: z.string().trim().optional(),
  assunto: z.string().trim().optional(),
  topico: z.string().trim().optional(),
  subtopico: z.string().trim().optional(),
  banca: z.string().trim().optional(),
  concurso: z.string().trim().optional(),
  carreira: z.string().trim().optional(),
  nivel: z.string().trim().optional(),
  dificuldade: z.string().trim().optional(),
  tipo: z.string().trim().optional(),
  instituicao: z.string().trim().optional(),
  cargo: z.string().trim().optional(),
  ano: z.coerce.number().int().min(1900).max(2100).optional().nullable(),
  inedita: z.boolean().optional(),
  isInedita: z.boolean().optional(),
  enunciado: z.string().trim().min(1),
  textoApoio: z.string().trim().optional(),
  resolucao: z.string().trim().optional(),
  objetivo: z.string().trim().optional(),
  referencia: z.string().trim().optional(),
  dica: z.string().trim().optional(),
  videoUrl: z.string().trim().url().optional().or(z.literal("")),
  alternativas: z.array(importedAlternativeSchema).min(2).max(5),
})

const importSchema = z.object({
  content: z.string().trim().min(2).max(500_000),
  fileName: z.string().trim().max(255).optional(),
  fileType: z.string().trim().max(30).optional(),
  defaults: z.object({
    disciplinaId: z.string().uuid().optional().or(z.literal("")),
    assuntoId: z.string().uuid().optional().or(z.literal("")),
    topicoId: z.string().uuid().optional().or(z.literal("")),
    subtopicoId: z.string().uuid().optional().or(z.literal("")),
    bancaId: z.string().uuid().optional().or(z.literal("")),
    concursoId: z.string().uuid().optional().or(z.literal("")),
    carreiraId: z.string().uuid().optional().or(z.literal("")),
    nivelId: z.string().uuid().optional().or(z.literal("")),
    dificuldadeId: z.string().uuid().optional().or(z.literal("")),
    tipoId: z.string().uuid().optional().or(z.literal("")),
    cargo: z.string().trim().optional(),
    year: z.string().trim().optional(),
    isUnique: z.enum(["sim", "nao"]).optional(),
  }).optional(),
})

type ImportQuestionInput = z.infer<typeof importedQuestionSchema>

type Taxonomy = Awaited<ReturnType<typeof getTaxonomy>>
type ImportDefaults = NonNullable<z.infer<typeof importSchema>["defaults"]>
type InspectedQuestion = {
  question: ImportQuestionInput
  taxonomy: ReturnType<typeof resolveQuestionTaxonomy>
  alternatives: ReturnType<typeof normalizeAlternatives>
  preview: {
    index: number
    title: string
    alternatives: number
    correctLetter: string
    errors: string[]
    warnings: string[]
    infos: string[]
  }
}

function normalize(value?: string | null) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase()
}

function nullable(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : null
}

async function requireAdmin() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { id: true, perfil: true },
  })

  if (user?.perfil !== "admin") {
    redirect("/dashboard")
  }

  return user.id
}

async function generateQuestionCode() {
  for (let attempt = 0; attempt < 5; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase()
    const code = `Q${Date.now().toString().slice(-9)}${suffix}`.slice(0, 20)
    const exists = await prisma.questao.findUnique({
      where: { code },
      select: { id: true },
    })

    if (!exists) return code
  }

  throw new Error("Não foi possível gerar código único para a questão.")
}

async function getTaxonomy() {
  const [disciplinas, assuntos, topicos, subtopicos, bancas, concursos, carreiras, niveis, dificuldades, tipos] = await Promise.all([
    prisma.disciplina.findMany({ select: { id: true, nome: true, code: true } }),
    prisma.assunto.findMany({ select: { id: true, nome: true, disciplinaId: true } }),
    prisma.topico.findMany({ select: { id: true, nome: true, assuntoId: true } }),
    prisma.subtopico.findMany({ select: { id: true, nome: true, topicoId: true } }),
    prisma.banca.findMany({ select: { id: true, nome: true, sigla: true } }),
    prisma.concurso.findMany({ select: { id: true, nome: true, cargo: true, ano: true, bancaId: true, carreiraId: true } }),
    prisma.carreira.findMany({ select: { id: true, nome: true } }),
    prisma.nivelEducacional.findMany({ select: { id: true, nome: true } }),
    prisma.dificuldade.findMany({ select: { id: true, nome: true, slug: true } }),
    prisma.tipoQuestao.findMany({ select: { id: true, nome: true, slug: true, modelo: true, quantidadeAlternativas: true } }),
  ])

  return { disciplinas, assuntos, topicos, subtopicos, bancas, concursos, carreiras, niveis, dificuldades, tipos }
}

function findByName<T extends { id: string; nome: string }>(items: T[], value?: string) {
  const key = normalize(value)
  if (!key) return null

  return items.find((item) => item.id === value || normalize(item.nome) === key) ?? null
}

function emptyToNull(value?: string | null) {
  return value && value.length > 0 ? value : null
}

function resolveQuestionTaxonomy(question: ImportQuestionInput, taxonomy: Taxonomy, defaults?: ImportDefaults) {
  const disciplina = findByName(taxonomy.disciplinas, question.disciplina)
  const assunto = question.assunto
    ? taxonomy.assuntos.find((item) => normalize(item.nome) === normalize(question.assunto) && (!disciplina || item.disciplinaId === disciplina.id))
    : null
  const topico = question.topico
    ? taxonomy.topicos.find((item) => normalize(item.nome) === normalize(question.topico) && (!assunto || item.assuntoId === assunto.id))
    : null
  const subtopico = question.subtopico
    ? taxonomy.subtopicos.find((item) => normalize(item.nome) === normalize(question.subtopico) && (!topico || item.topicoId === topico.id))
    : null
  const bancaKey = normalize(question.banca)
  const banca = bancaKey
    ? taxonomy.bancas.find((item) => item.id === question.banca || normalize(item.nome) === bancaKey || normalize(item.sigla) === bancaKey)
    : null
  const carreira = findByName(taxonomy.carreiras, question.carreira)
  const concursoKey = normalize(question.concurso)
  const concurso = concursoKey
    ? taxonomy.concursos.find((item) => {
        const matchesName = item.id === question.concurso || normalize(item.nome) === concursoKey
        const matchesBanca = !banca || item.bancaId === banca.id
        const matchesCareer = !carreira || item.carreiraId === carreira.id

        return matchesName && matchesBanca && matchesCareer
      })
    : null
  const nivel = findByName(taxonomy.niveis, question.nivel)
  const dificuldadeKey = normalize(question.dificuldade)
  const dificuldade = dificuldadeKey
    ? taxonomy.dificuldades.find((item) => item.id === question.dificuldade || normalize(item.nome) === dificuldadeKey || normalize(item.slug) === dificuldadeKey)
    : null
  const tipoKey = normalize(question.tipo)
  const tipo = tipoKey
    ? taxonomy.tipos.find((item) => item.id === question.tipo || normalize(item.nome) === tipoKey || normalize(item.slug) === tipoKey)
    : null

  return {
    disciplinaId: disciplina?.id ?? emptyToNull(defaults?.disciplinaId),
    assuntoId: assunto?.id ?? emptyToNull(defaults?.assuntoId),
    topicoId: topico?.id ?? emptyToNull(defaults?.topicoId),
    subtopicoId: subtopico?.id ?? emptyToNull(defaults?.subtopicoId),
    bancaId: banca?.id ?? concurso?.bancaId ?? emptyToNull(defaults?.bancaId),
    concursoId: concurso?.id ?? emptyToNull(defaults?.concursoId),
    carreiraId: carreira?.id ?? concurso?.carreiraId ?? emptyToNull(defaults?.carreiraId),
    nivelId: nivel?.id ?? emptyToNull(defaults?.nivelId),
    dificuldadeId: dificuldade?.id ?? emptyToNull(defaults?.dificuldadeId),
    tipoId: tipo?.id ?? emptyToNull(defaults?.tipoId),
  }
}

function normalizeAlternatives(question: ImportQuestionInput, index: number) {
  const alternatives = question.alternativas.map((alternative, alternativeIndex) => ({
    letra: (alternative.letra ?? alternative.letter ?? String.fromCharCode(65 + alternativeIndex)).toUpperCase(),
    texto: alternative.texto ?? alternative.text ?? "",
    isCorreta: alternative.correta ?? alternative.isCorrect ?? false,
    explicacao: nullable(alternative.explicacao ?? alternative.explanation),
    referencia: nullable(alternative.referencia ?? alternative.reference),
    dica: nullable(alternative.dica ?? alternative.tip),
  }))

  const letters = new Set(alternatives.map((alternative) => alternative.letra))
  const correctCount = alternatives.filter((alternative) => alternative.isCorreta).length

  if (letters.size !== alternatives.length) {
    throw new Error(`Questão ${index + 1}: alternativas com letras repetidas.`)
  }

  if (correctCount !== 1) {
    throw new Error(`Questão ${index + 1}: informe exatamente uma alternativa correta.`)
  }

  return alternatives
}

function parseImportContent(content: string) {
  const trimmed = content.trim()

  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return parsePlainTextQuestions(trimmed)
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(trimmed)
  } catch {
    throw new Error("JSON inválido. Verifique vírgulas, aspas e colchetes.")
  }

  const list = Array.isArray(parsed) ? parsed : [parsed]

  if (list.length === 0) {
    throw new Error("Nenhuma questão encontrada no JSON.")
  }

  if (list.length > 100) {
    throw new Error("Importe no máximo 100 questões por lote.")
  }

  return list.map((item, index) => {
    const parsedQuestion = importedQuestionSchema.safeParse(item)

    if (!parsedQuestion.success) {
      const message = parsedQuestion.error.issues[0]?.message ?? "Dados inválidos."
      throw new Error(`Questão ${index + 1}: ${message}`)
    }

    return parsedQuestion.data
  })
}

function cleanLine(value: string) {
  return value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function fieldValue(line: string, labels: string[]) {
  for (const label of labels) {
    const regex = new RegExp(`^${label}\\s*:\\s*(.+)$`, "i")
    const match = line.match(regex)
    if (match?.[1]) return cleanLine(match[1])
  }

  return null
}

function parsePlainTextQuestions(content: string): ImportQuestionInput[] {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  const blocks = normalized
    .split(/\n(?=(?:quest[aã]o|q)\s*\d+\s*[:.-]?|quest[aã]o\s*:)/i)
    .map((block) => block.trim())
    .filter(Boolean)

  const sourceBlocks = blocks.length > 1 ? blocks : [normalized.trim()]

  return sourceBlocks.map((block, index) => parsePlainTextQuestion(block, index))
}

function parsePlainTextQuestion(block: string, index: number): ImportQuestionInput {
  const lines = block
    .split("\n")
    .map(cleanLine)
    .filter(Boolean)

  const meta: Partial<ImportQuestionInput> = {}
  const enunciado: string[] = []
  const textoApoio: string[] = []
  const resolucao: string[] = []
  const objetivo: string[] = []
  const referencia: string[] = []
  const dica: string[] = []
  const alternatives: Array<{ letra: string; texto: string; correta?: boolean; explicacao?: string }> = []
  let correctLetter = ""
  let section: "support" | "statement" | "resolution" | "objective" | "reference" | "tip" = "statement"
  let explanationLetter = ""

  for (const rawLine of lines) {
    const line = rawLine.replace(/^(?:quest[aã]o|q)\s*\d+\s*[:.-]?\s*/i, "").trim()
    if (!line) continue

    if (/^quest[aã]o\s*:\s*/i.test(line)) {
      const value = line.replace(/^quest[aã]o\s*:\s*/i, "").trim()
      if (value) enunciado.push(value)
      section = "statement"
      explanationLetter = ""
      continue
    }

    if (/^texto\s+de\s+apoio\s*:\s*/i.test(line)) {
      const value = line.replace(/^texto\s+de\s+apoio\s*:\s*/i, "").trim()
      if (value) textoApoio.push(value)
      section = "support"
      explanationLetter = ""
      continue
    }

    if (/^enunciado\s*:\s*/i.test(line)) {
      const value = line.replace(/^enunciado\s*:\s*/i, "").trim()
      if (value) enunciado.push(value)
      section = "statement"
      explanationLetter = ""
      continue
    }

    const disciplina = fieldValue(line, ["disciplina", "mat[eé]ria"])
    if (disciplina) {
      meta.disciplina = disciplina
      continue
    }

    const assunto = fieldValue(line, ["assunto"])
    if (assunto) {
      meta.assunto = assunto
      continue
    }

    const banca = fieldValue(line, ["banca"])
    if (banca) {
      meta.banca = banca
      continue
    }

    const concurso = fieldValue(line, ["concurso"])
    if (concurso) {
      meta.concurso = concurso
      continue
    }

    const carreira = fieldValue(line, ["carreira", "[oó]rg[aã]o"])
    if (carreira) {
      meta.carreira = carreira
      continue
    }

    const dificuldade = fieldValue(line, ["dificuldade"])
    if (dificuldade) {
      meta.dificuldade = dificuldade
      continue
    }

    const tipo = fieldValue(line, ["tipo", "tipo de quest[aã]o"])
    if (tipo) {
      meta.tipo = tipo
      continue
    }

    const ano = fieldValue(line, ["ano"])
    if (ano) {
      meta.ano = Number(ano)
      continue
    }

    const gabarito = fieldValue(line, ["gabarito", "resposta"])
    if (gabarito) {
      const normalizedAnswer = normalize(gabarito)
      correctLetter = normalizedAnswer.startsWith("certo") ? "C" : normalizedAnswer.startsWith("errado") ? "E" : gabarito[0]?.toUpperCase() ?? ""
      section = "resolution"
      explanationLetter = ""
      continue
    }

    if (/^(coment[aá]rio|coment[aá]rio\s+do\s+professor|resolu[cç][aã]o|justificativa)\s*:/i.test(line)) {
      section = "resolution"
      explanationLetter = ""
      const value = line.replace(/^(coment[aá]rio|coment[aá]rio\s+do\s+professor|resolu[cç][aã]o|justificativa)\s*:\s*/i, "").trim()
      if (value) resolucao.push(value)
      continue
    }

    if (/^objetivo\s*:/i.test(line)) {
      section = "objective"
      explanationLetter = ""
      const value = line.replace(/^objetivo\s*:\s*/i, "").trim()
      if (value) objetivo.push(value)
      continue
    }

    if (/^refer[eê]ncia\s*:/i.test(line)) {
      section = "reference"
      explanationLetter = ""
      const value = line.replace(/^refer[eê]ncia\s*:\s*/i, "").trim()
      if (value) referencia.push(value)
      continue
    }

    if (/^(dica|macete)\s*:/i.test(line)) {
      section = "tip"
      explanationLetter = ""
      const value = line.replace(/^(dica|macete)\s*:\s*/i, "").trim()
      if (value) dica.push(value)
      continue
    }

    if (/^(videoaula|v[ií]deo|video)\s*:/i.test(line)) {
      const value = line.replace(/^(videoaula|v[ií]deo|video)\s*:\s*/i, "").trim()
      if (value) meta.videoUrl = value
      section = "resolution"
      explanationLetter = ""
      continue
    }

    const explanationMatch = line.match(/^explica[cç][aã]o\s+([A-E]|C|E)\s*:\s*(.*)$/i)
    if (explanationMatch?.[1]) {
      explanationLetter = explanationMatch[1].toUpperCase()
      const value = explanationMatch[2]?.trim()
      const alternative = alternatives.find((item) => item.letra === explanationLetter)

      if (alternative && value) {
        alternative.explicacao = value
      }

      section = "resolution"
      continue
    }

    const alternativeMatch = line.match(/^([A-E]|C|E)[).-]\s*(.+)$/i)
    if (alternativeMatch?.[1] && alternativeMatch[2]) {
      alternatives.push({
        letra: alternativeMatch[1].toUpperCase(),
        texto: cleanLine(alternativeMatch[2]),
      })
      section = "statement"
      explanationLetter = ""
      continue
    }

    if (explanationLetter) {
      const alternative = alternatives.find((item) => item.letra === explanationLetter)

      if (alternative) {
        alternative.explicacao = [alternative.explicacao, line].filter(Boolean).join("\n")
      }
    } else if (section === "resolution") {
      resolucao.push(line)
    } else if (section === "support") {
      textoApoio.push(line)
    } else if (section === "objective") {
      objetivo.push(line)
    } else if (section === "reference") {
      referencia.push(line)
    } else if (section === "tip") {
      dica.push(line)
    } else {
      enunciado.push(line)
    }
  }

  const normalizedAlternatives = alternatives.length > 0
    ? alternatives
    : [
        { letra: "C", texto: "Certo" },
        { letra: "E", texto: "Errado" },
      ]

  const question = {
    ...meta,
    enunciado: enunciado.join("\n").trim(),
    textoApoio: textoApoio.join("\n").trim(),
    resolucao: resolucao.join("\n").trim(),
    objetivo: objetivo.join("\n").trim(),
    referencia: referencia.join("\n").trim(),
    dica: dica.join("\n").trim(),
    alternativas: normalizedAlternatives.map((alternative) => ({
      letra: alternative.letra,
      texto: alternative.texto,
      correta: alternative.letra === correctLetter,
      explicacao: alternative.explicacao,
    })),
  }

  const parsed = importedQuestionSchema.safeParse(question)

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Dados inválidos."
    throw new Error(`Questão ${index + 1}: ${message}`)
  }

  return parsed.data
}

function inspectQuestion(question: ImportQuestionInput, index: number, taxonomy: Taxonomy, defaults?: ImportDefaults): InspectedQuestion {
  const errors: string[] = []
  const warnings: string[] = []
  const infos: string[] = []
  const resolvedTaxonomy = resolveQuestionTaxonomy(question, taxonomy, defaults)
  let alternatives: ReturnType<typeof normalizeAlternatives> = []

  try {
    alternatives = normalizeAlternatives(question, index)
  } catch (error) {
    errors.push(error instanceof Error ? error.message.replace(`Questão ${index + 1}: `, "") : "Alternativas inválidas.")
  }

  if (!resolvedTaxonomy.disciplinaId) errors.push("Disciplina obrigatória.")
  if (!resolvedTaxonomy.tipoId) errors.push("Tipo de questão obrigatório.")
  if (!question.enunciado.trim()) errors.push("Enunciado obrigatório.")

  if (!question.resolucao?.trim()) warnings.push("Resolução/comentário geral recomendado.")
  if (alternatives.length > 0 && alternatives.some((alternative) => !alternative.explicacao)) {
    warnings.push("Explicação por alternativa recomendada.")
  }
  if (!question.objetivo?.trim()) infos.push("Objetivo ajuda o aluno a entender a habilidade cobrada.")
  if (!question.referencia?.trim()) infos.push("Referência melhora a rastreabilidade do conteúdo.")

  return {
    question,
    taxonomy: resolvedTaxonomy,
    alternatives,
    preview: {
      index: index + 1,
      title: question.enunciado.split("\n")[0]?.slice(0, 120) || "Questão sem enunciado",
      alternatives: question.alternativas.length,
      correctLetter: question.alternativas.find((alternative) => alternative.correta || alternative.isCorrect)?.letra
        ?? question.alternativas.find((alternative) => alternative.correta || alternative.isCorrect)?.letter
        ?? "-",
      errors,
      warnings,
      infos,
    },
  }
}

export async function analyzeAdminQuestionImport(values: z.infer<typeof importSchema>) {
  const userId = await requireAdmin()
  const { content, defaults, fileName, fileType } = importSchema.parse(values)
  const questions = parseImportContent(content)
  const taxonomy = await getTaxonomy()
  const items = questions.map((question, index) => inspectQuestion(question, index, taxonomy, defaults))
  const errors = items.flatMap((item) => item.preview.errors.map((message) => ({ questao: item.preview.index, message })))
  const warnings = items.flatMap((item) => item.preview.warnings.map((message) => ({ questao: item.preview.index, message })))

  await prisma.importacaoQuestao.create({
    data: {
      usuarioId: userId,
      arquivoNome: nullable(fileName),
      tipoArquivo: fileType || "texto",
      status: errors.length > 0 ? "com_erro" : "validado",
      totalQuestoes: items.length,
      totalImportadas: 0,
      totalErros: errors.length,
      totalAvisos: warnings.length,
      erros: errors,
      avisos: warnings,
    },
  })

  return {
    total: items.length,
    errors: errors.length,
    warnings: warnings.length,
    infos: items.reduce((sum, item) => sum + item.preview.infos.length, 0),
    items: items.map((item) => item.preview),
  }
}

export async function importAdminQuestions(values: z.infer<typeof importSchema>) {
  const autorId = await requireAdmin()
  const { content, defaults, fileName, fileType } = importSchema.parse(values)
  const questions = parseImportContent(content)
  const taxonomy = await getTaxonomy()
  const inspected = questions.map((question, index) => inspectQuestion(question, index, taxonomy, defaults))
  const blockingErrors = inspected.flatMap((item) => item.preview.errors.map((error) => `Questão ${item.preview.index}: ${error}`))
  const warnings = inspected.flatMap((item) => item.preview.warnings.map((message) => ({ questao: item.preview.index, message })))

  if (blockingErrors.length > 0) {
    await prisma.importacaoQuestao.create({
      data: {
        usuarioId: autorId,
        arquivoNome: nullable(fileName),
        tipoArquivo: fileType || "texto",
        status: "com_erro",
        totalQuestoes: inspected.length,
        totalImportadas: 0,
        totalErros: blockingErrors.length,
        totalAvisos: warnings.length,
        erros: blockingErrors,
        avisos: warnings,
      },
    })
    throw new Error(blockingErrors.slice(0, 3).join(" "))
  }

  const prepared = await Promise.all(
    inspected.map(async (item) => ({
      ...item,
      code: await generateQuestionCode(),
    }))
  )

  await prisma.$transaction([
    prisma.importacaoQuestao.create({
      data: {
        usuarioId: autorId,
        arquivoNome: nullable(fileName),
        tipoArquivo: fileType || "texto",
        status: "importado",
        totalQuestoes: prepared.length,
        totalImportadas: prepared.length,
        totalErros: 0,
        totalAvisos: warnings.length,
        avisos: warnings,
      },
    }),
    ...prepared.map((item) =>
      prisma.questao.create({
          data: {
            code: item.code,
            ...item.taxonomy,
            instituicao: nullable(item.question.instituicao),
            cargo: nullable(item.question.cargo ?? defaults?.cargo),
            ano: item.question.ano ?? (defaults?.year ? Number(defaults.year) : null),
            isInedita: item.question.inedita ?? item.question.isInedita ?? defaults?.isUnique === "sim",
            enunciado: item.question.enunciado,
            textoApoio: nullable(item.question.textoApoio),
            resolucao: nullable(item.question.resolucao),
            hasVideo: Boolean(item.question.videoUrl),
            visibilidade: "publica",
            status: "draft",
            autorId,
            alternativas: {
              create: item.alternatives.map((alternative) => ({
                ...alternative,
                dica: alternative.dica ?? nullable(item.question.dica),
              })),
            },
            objetivos: item.question.objetivo ? { create: [{ descricao: item.question.objetivo }] } : undefined,
            referencias: item.question.referencia ? { create: [{ texto: item.question.referencia }] } : undefined,
            videos: item.question.videoUrl ? { create: [{ titulo: "Videoaula", url: item.question.videoUrl }] } : undefined,
          },
        })
    ),
  ])

  revalidatePath("/admin/questoes")
  revalidatePath("/admin/questoes/importar")
  revalidatePath("/admin/questoes/revisao")

  return {
    success: true,
    imported: prepared.length,
  }
}
