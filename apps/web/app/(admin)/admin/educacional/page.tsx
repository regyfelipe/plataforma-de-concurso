import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function EducacionalPage() {
  const niveis = await prisma.nivelEducacional.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Níveis Educacionais"
      description="Gestão de Questões"
      createHref="/admin/educacional/criar"
      createLabel="Criar Nível"
      items={niveis.map((item) => ({
        id: item.id,
        title: item.nome,
        active: item.ativo,
      }))}
    />
  )
}
