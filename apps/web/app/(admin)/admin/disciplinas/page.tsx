import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function DisciplinasPage() {
  const disciplinas = await prisma.disciplina.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Disciplinas"
      description="Gestão de Conteúdo"
      createHref="/admin/disciplinas/criar"
      createLabel="Criar Disciplina"
      items={disciplinas.map((item) => ({
        id: item.id,
        title: item.nome,
        subtitle: item.descricao || undefined,
        meta: item.code,
        active: item.ativo,
      }))}
    />
  )
}
