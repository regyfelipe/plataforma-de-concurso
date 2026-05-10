import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"

export default async function ConcursosPage() {
  const concursos = await prisma.concurso.findMany({
    include: {
      banca: true,
      carreira: true,
      nivel: true,
    },
    orderBy: { criadoEm: "desc" },
  })

  return (
    <TaxonomyList
      title="Concursos"
      description="Gestão de Certames"
      createHref="/admin/concursos/criar"
      createLabel="Criar Concurso"
      items={concursos.map((item) => ({
        id: item.id,
        title: item.nome,
        subtitle: [item.banca?.sigla, item.carreira?.nome, item.nivel?.nome].filter(Boolean).join(" · "),
        meta: item.ano ? String(item.ano) : item.status,
        active: item.ativo,
      }))}
    />
  )
}
