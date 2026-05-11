import { Prisma } from "@prisma/client"
import { prisma } from "@workspace/database"

export type RankingEntry = {
  rank: number
  name: string
  points: number
  precision: number
  solved: number
  avatar: string
  trend: "up" | "down"
  isCurrentUser: boolean
}

export type RankingPeriod = "Semanal" | "Mensal" | "Geral"
export type RankingCategory = "Geral" | "Disciplina" | "Carreira" | "Assunto"

type RankingRow = {
  usuario_id: string
  nome: string
  total: bigint | number
  corretas: bigint | number
}

type LabelRow = {
  id: string
  nome: string
}

function startOfWeek(date = new Date()) {
  const next = new Date(date)
  const day = next.getDay()
  const diff = day === 0 ? -6 : 1 - day

  next.setDate(next.getDate() + diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function fromPeriod(period: RankingPeriod) {
  if (period === "Semanal") return startOfWeek()
  if (period === "Mensal") return startOfMonth()
  return null
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  return (parts.length > 0 ? parts : ["AL"])
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function toNumber(value: bigint | number) {
  return typeof value === "bigint" ? Number(value) : value
}

function mapRows(rows: RankingRow[], currentUserId: string): RankingEntry[] {
  return rows.map((row, index) => {
    const solved = toNumber(row.total)
    const correct = toNumber(row.corretas)
    const precision = solved > 0 ? Math.round((correct / solved) * 100) : 0

    return {
      rank: index + 1,
      name: row.nome,
      points: correct * 10 + Math.max(solved - correct, 0),
      precision,
      solved,
      avatar: initials(row.nome),
      trend: "up",
      isCurrentUser: row.usuario_id === currentUserId,
    }
  })
}

async function getTopLabel(field: "disciplina_id" | "carreira_id" | "assunto_id", table: "disciplinas" | "carreiras" | "assuntos") {
  const rows = await prisma.$queryRaw<LabelRow[]>(Prisma.sql`
    SELECT entity.id::text AS id, entity.nome
    FROM respostas_usuarios ru
    INNER JOIN questoes q ON q.id = ru.questao_id
    INNER JOIN ${Prisma.raw(table)} entity ON entity.id = q.${Prisma.raw(field)}
    WHERE q.${Prisma.raw(field)} IS NOT NULL
      AND q.status::text = 'published'
      AND q.visibilidade::text = 'publica'
    GROUP BY entity.id, entity.nome
    ORDER BY COUNT(*) DESC, entity.nome ASC
    LIMIT 1
  `)

  return rows[0] ?? null
}

async function getAggregatedRanking(params: {
  currentUserId: string
  period: RankingPeriod
  categoryField?: "disciplina_id" | "carreira_id" | "assunto_id" | "concurso_id"
  categoryId?: string
}) {
  const from = fromPeriod(params.period)
  const periodFilter = from ? Prisma.sql`AND ru.respondido_em >= ${from}` : Prisma.empty
  const categoryFilter = params.categoryField && params.categoryId
    ? Prisma.sql`AND q.${Prisma.raw(params.categoryField)} = ${params.categoryId}::uuid`
    : Prisma.empty

  const rows = await prisma.$queryRaw<RankingRow[]>(Prisma.sql`
    SELECT
      u.id::text AS usuario_id,
      COALESCE(NULLIF(p.nome_exibicao, ''), u.nome) AS nome,
      COUNT(*) AS total,
      COALESCE(SUM(CASE WHEN ru.is_correta THEN 1 ELSE 0 END), 0) AS corretas
    FROM respostas_usuarios ru
    INNER JOIN questoes q ON q.id = ru.questao_id
    INNER JOIN usuarios u ON u.id = ru.usuario_id
    LEFT JOIN perfis p ON p.usuario_id = u.id
    WHERE u.status::text = 'ativo'
      AND q.status::text = 'published'
      AND q.visibilidade::text = 'publica'
      ${periodFilter}
      ${categoryFilter}
    GROUP BY u.id, p.nome_exibicao, u.nome
    ORDER BY
      COALESCE(SUM(CASE WHEN ru.is_correta THEN 1 ELSE 0 END), 0) * 10 + (COUNT(*) - COALESCE(SUM(CASE WHEN ru.is_correta THEN 1 ELSE 0 END), 0)) DESC,
      COUNT(*) DESC,
      nome ASC
    LIMIT 50
  `)

  return mapRows(rows, params.currentUserId)
}

export async function getGeneralRankingData(currentUserId: string) {
  const [discipline, career, subject] = await Promise.all([
    getTopLabel("disciplina_id", "disciplinas"),
    getTopLabel("carreira_id", "carreiras"),
    getTopLabel("assunto_id", "assuntos"),
  ])

  const result: Record<RankingCategory, Record<RankingPeriod, RankingEntry[]>> = {
    Geral: { Semanal: [], Mensal: [], Geral: [] },
    Disciplina: { Semanal: [], Mensal: [], Geral: [] },
    Carreira: { Semanal: [], Mensal: [], Geral: [] },
    Assunto: { Semanal: [], Mensal: [], Geral: [] },
  }

  await Promise.all(
    (["Semanal", "Mensal", "Geral"] as RankingPeriod[]).flatMap((period) => [
      getAggregatedRanking({ currentUserId, period }).then((data) => {
        result.Geral[period] = data
      }),
      discipline
        ? getAggregatedRanking({ currentUserId, period, categoryField: "disciplina_id", categoryId: discipline.id }).then((data) => {
            result.Disciplina[period] = data
          })
        : Promise.resolve(),
      career
        ? getAggregatedRanking({ currentUserId, period, categoryField: "carreira_id", categoryId: career.id }).then((data) => {
            result.Carreira[period] = data
          })
        : Promise.resolve(),
      subject
        ? getAggregatedRanking({ currentUserId, period, categoryField: "assunto_id", categoryId: subject.id }).then((data) => {
            result.Assunto[period] = data
          })
        : Promise.resolve(),
    ])
  )

  return {
    rankings: result,
    labels: {
      Disciplina: discipline?.nome ?? "Sem dados",
      Carreira: career?.nome ?? "Sem dados",
      Assunto: subject?.nome ?? "Sem dados",
    },
  }
}

export async function getContestRankingData(currentUserId: string) {
  const contest = await prisma.concurso.findFirst({
    where: {
      ativo: true,
      questoes: {
        some: {
          status: "published",
          visibilidade: "publica",
          respostas: { some: {} },
        },
      },
    },
    orderBy: [{ ano: "desc" }, { nome: "asc" }],
    select: {
      id: true,
      nome: true,
      cargo: true,
    },
  })

  if (!contest) {
    return {
      selectedConcurso: "Nenhum concurso com respostas",
      ranking: [],
    }
  }

  const ranking = await getAggregatedRanking({
    currentUserId,
    period: "Geral",
    categoryField: "concurso_id",
    categoryId: contest.id,
  })

  return {
    selectedConcurso: contest.cargo ? `${contest.nome} - ${contest.cargo}` : contest.nome,
    ranking,
  }
}
