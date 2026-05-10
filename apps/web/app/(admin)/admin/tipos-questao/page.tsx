import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function TiposQuestaoPage() {
  const tipos = await prisma.tipoQuestao.findMany({ orderBy: { nome: "asc" } })

  return (
    <TaxonomyList
      title="Tipos de Questão"
      description="Gestão de Questões"
      createHref="/admin/tipos-questao/criar"
      createLabel="Criar Tipo"
      items={tipos.map((item) => ({
        id: item.id,
        title: item.nome,
        meta: item.slug,
        active: item.ativo,
      }))}
    />
  )
}
