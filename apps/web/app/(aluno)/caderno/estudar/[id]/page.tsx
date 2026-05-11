import { prisma } from "@workspace/database"
import { notFound } from "next/navigation"
import { MinimalQuestionCard } from "@/components/questoes/card/minimal-question-card"
import { Button } from "@workspace/ui/components/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function EstudarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const notebook = await prisma.caderno.findUnique({
    where: { id },
    select: {
      nome: true,
      questoes: {
        orderBy: { ordem: "asc" },
        select: {
          questao: {
            select: {
              id: true,
              code: true,
              enunciado: true,
              textoApoio: true,
              resolucao: true,
              disciplina: { select: { nome: true } },
              alternativas: {
                orderBy: { letra: "asc" },
                select: {
                  id: true,
                  letra: true,
                  texto: true,
                  isCorreta: true,
                  explicacao: true,
                  referencia: true,
                  dica: true,
                },
              },
              objetivos: { select: { descricao: true } },
              referencias: { select: { texto: true } },
            }
          }
        }
      }
    }
  })

  if (!notebook) notFound()

  const questions = notebook.questoes.map((cq) => {
    const q = cq.questao
    return {
      id: q.id,
      code: q.code,
      discipline: q.disciplina?.nome ?? "Sem disciplina",
      questionText: q.enunciado,
      supportText: q.textoApoio,
      resolution: q.resolucao,
      alternatives: q.alternativas.map((alt) => ({
        id: alt.id,
        letter: alt.letra,
        text: alt.texto,
        isCorrect: alt.isCorreta,
        explanation: alt.explicacao ?? undefined,
        reference: alt.referencia ?? undefined,
        tip: alt.dica ?? undefined,
      })),
      objectives: q.objetivos.map((obj) => obj.descricao),
      references: q.referencias.map((ref) => ref.texto),
    }
  })

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-background max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Link href="/caderno">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-border/40">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight uppercase">{notebook.nome}</h1>
            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
              Simulado • {questions.length} Questões
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-20 mt-8">
        {questions.map((q, index) => (
          <div key={q.id} className="space-y-6">
             <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Questão {index + 1}</span>
                <div className="h-px flex-1 bg-border/20" />
             </div>
             <MinimalQuestionCard question={q} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-20">
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] opacity-40">
          Fim do Simulado • {notebook.nome}
        </p>
      </div>
    </div>
  )
}
