import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function DificuldadePage() {
  const dificuldades = await prisma.dificuldade.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Níveis de Dificuldade"
      description="Gestão de Questões"
      createHref="/admin/dificuldade/criar"
      createLabel="Criar Nível"
      items={dificuldades.map((item) => ({
        id: item.id,
        title: item.nome,
        meta: item.slug,
        active: item.ativo,
      }))}
    />
  )
}
