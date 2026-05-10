import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function BancasPage() {
  const bancas = await prisma.banca.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Bancas Examinadoras"
      description="Gestão de Certames"
      createHref="/admin/bancas/criar"
      createLabel="Criar Banca"
      items={bancas.map((item) => ({
        id: item.id,
        title: item.nome,
        subtitle: item.descricao || undefined,
        meta: item.sigla,
        active: item.ativo,
      }))}
    />
  )
}
