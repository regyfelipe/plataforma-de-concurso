import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { prisma } from "@workspace/database"
import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AL"
}

export default async function ComunidadePage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [seguidores, seguindo] = await Promise.all([
    prisma.seguidor.findMany({
      where: { usuarioId: session.user.id },
      include: {
        seguidor: {
          select: {
            nome: true,
            sobrenome: true,
            avatarUrl: true,
            email: true,
          },
        },
      },
      orderBy: { criadoEm: "desc" },
    }),
    prisma.seguidor.count({
      where: { seguidorId: session.user.id },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Seguidores</p>
            <p className="text-2xl font-semibold">{seguidores.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Seguindo</p>
            <p className="text-2xl font-semibold">{seguindo}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle>Seguidores</CardTitle>
          </div>
          <CardDescription>Pessoas que estão te acompanhando na plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          {seguidores.length > 0 ? (
            <div className="space-y-3">
              {seguidores.map(({ id, seguidor }) => {
                const nome = [seguidor.nome, seguidor.sobrenome].filter(Boolean).join(" ")

                return (
                  <div key={id} className="flex items-center gap-3 rounded-lg border p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={seguidor.avatarUrl || ""} alt={nome} />
                      <AvatarFallback>{getInitials(nome)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{nome}</p>
                      <p className="truncate text-xs text-muted-foreground">{seguidor.email}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="font-medium">Ninguém está te seguindo ainda</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Continue respondendo questões e subindo no ranking para ganhar seguidores.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
