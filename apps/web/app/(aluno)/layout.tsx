import { AlunoLayoutClient } from "@/components/layout/aluno-layout-client"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function AlunoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession(await headers())

  if (!session) {
    redirect("/login")
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { perfil: true },
  })

  return (
    <AlunoLayoutClient showAdmin={usuario?.perfil === "admin"}>
      {children}
    </AlunoLayoutClient>
  )
}
