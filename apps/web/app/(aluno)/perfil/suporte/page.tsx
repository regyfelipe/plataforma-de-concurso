import Link from "next/link"
import { HeadphonesIcon, MessageSquare } from "lucide-react"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

const STATUS_LABEL: Record<string, string> = {
  aberto: "Aberto",
  em_atendimento: "Em atendimento",
  aguardando_usuario: "Aguardando usuário",
  resolvido: "Resolvido",
  fechado: "Fechado",
}

export default async function SuportePage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const tickets = await prisma.ticket.findMany({
    where: { usuarioId: session.user.id },
    include: {
      mensagens: {
        select: { id: true },
      },
    },
    orderBy: { atualizadoEm: "desc" },
    take: 5,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <HeadphonesIcon className="h-4 w-4" />
            <CardTitle>Suporte</CardTitle>
          </div>
          <CardDescription>Precisa de ajuda? Acesse a central de suporte.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-center text-sm text-muted-foreground">
            Abra um ticket e nossa equipe responderá em até 24 horas.
          </p>
          <Button nativeButton={false} render={<Link href="/suporte/novo" />}>
            <HeadphonesIcon className="mr-2 h-4 w-4" />
            Abrir Ticket
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Recentes</CardTitle>
          <CardDescription>Últimos chamados associados à sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">#{ticket.codigo}</p>
                        <Badge variant="secondary">{STATUS_LABEL[ticket.status] || ticket.status}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{ticket.assunto}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{ticket.mensagens.length} mensagem(ns)</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Nenhum ticket aberto</p>
              <p className="text-sm text-muted-foreground">Se precisar de ajuda, abra um novo chamado.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
