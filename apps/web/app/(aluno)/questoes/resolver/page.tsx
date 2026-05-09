import { QuestionCard } from "@/components/questoes/card"
import { QuestionFilter } from "@/components/questoes/filter"
import { MOCK_QUESTIONS } from "@/mocks/questions"

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 pt-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col gap-2">
        {/* <h1 className="text-3xl font-bold tracking-tight">Resolver Questões</h1> */}
        {/* <p className="text-muted-foreground">
          Pratique com nossa base de questões atualizadas e comentadas.
        </p> */}
      </div>

      {/* Componente de Filtro adicionado aqui */}
      <QuestionFilter />

      <div className="grid gap-6">
        {MOCK_QUESTIONS.map((q) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>

      <div className="flex justify-center py-8">
        <p className="text-sm text-muted-foreground italic">
          Você chegou ao fim da lista inicial. Use os filtros para encontrar mais questões.
        </p>
      </div>
    </div>
  )
}
