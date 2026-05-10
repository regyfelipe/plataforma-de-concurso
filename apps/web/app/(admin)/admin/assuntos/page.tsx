import { TaxonomyList } from "@/components/admin/taxonomy-list"
import { prisma } from "@workspace/database"
import { CreateAssuntoModal } from "./create-assunto-modal"

export default async function AssuntosPage() {
  const [assuntos, disciplinas] = await Promise.all([
    prisma.assunto.findMany({
      include: {
        disciplina: true,
        topicos: {
          include: {
            subtopicos: true
          },
          orderBy: { nome: "asc" }
        }
      },
      orderBy: { nome: "asc" }
    }),
    prisma.disciplina.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
      select: { id: true, nome: true }
    })
  ])

  // Achatar a hierarquia para exibição na tabela com indentação visual
  const items: any[] = []

  assuntos.forEach((assunto) => {
    // Nível 0: Assunto
    items.push({
      id: `assunto-${assunto.id}`,
      title: assunto.nome,
      subtitle: `Disciplina: ${assunto.disciplina.nome}`,
      active: assunto.ativo,
      meta: "Assunto Base",
      indent: 0,
      editHref: `/admin/assuntos/editar/${assunto.id}`
    })

    assunto.topicos.forEach((topico) => {
      // Nível 1: Tópico Principal
      items.push({
        id: `topico-${topico.id}`,
        title: topico.nome,
        subtitle: "",
        active: topico.ativo,
        meta: "Tópico Principal",
        indent: 1,
        parentId: `assunto-${assunto.id}`,
        editHref: `/admin/assuntos/editar/${topico.id}`
      })

      topico.subtopicos.forEach((sub) => {
        // Nível 2: Subtópico
        items.push({
          id: `subtopico-${sub.id}`,
          title: sub.nome,
          subtitle: "",
          active: sub.ativo,
          meta: "Subtópico",
          indent: 2,
          parentId: `topico-${topico.id}`,
          editHref: `/admin/assuntos/subtopicos/editar/${sub.id}`
        })
      })
    })
  })

  return (
    <TaxonomyList
      title="Arquitetura de Assuntos"
      description="Gestão Hierárquica Completa"
      createHref="/admin/assuntos/criar"
      createLabel="Criar Item"
      createAction={<CreateAssuntoModal disciplinas={disciplinas} />}
      items={items}
    />
  )
}

