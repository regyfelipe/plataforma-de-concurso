import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { AdminLayoutClient } from "@/components/layout/admin-layout-client"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { perfil: true },
  })

  if (usuario?.perfil !== "admin") {
    redirect("/dashboard")
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
