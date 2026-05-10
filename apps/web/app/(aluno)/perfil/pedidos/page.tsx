import { OrdersList } from "./orders-list"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function PedidosPage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const pedidos = await prisma.pedido.findMany({
    where: { usuarioId: session.user.id },
    include: {
      itens: true,
    },
    orderBy: { criadoEm: "desc" },
  })

  return (
    <OrdersList
      orders={pedidos.map((pedido) => ({
        id: pedido.id,
        codigo: pedido.codigo,
        descricao: pedido.descricao,
        valor: Number(pedido.total),
        status: pedido.status,
        data: pedido.criadoEm.toISOString(),
        itens: pedido.itens.length || pedido.quantidadeItens,
      }))}
    />
  )
}
