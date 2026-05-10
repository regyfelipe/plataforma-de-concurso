import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function CarreirasPage() {
  const carreiras = await prisma.carreira.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Carreiras"
      description="Gestão de Conteúdo"
      createHref="/admin/carreiras/criar"
      createLabel="Criar Carreira"
      items={carreiras.map((item) => ({
        id: item.id,
        title: item.nome,
        subtitle: item.descricao || undefined,
        active: item.ativo,
      }))}
    />
  )
}
