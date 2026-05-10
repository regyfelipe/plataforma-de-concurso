import { ProfileForm } from "./profile-form"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

function formatDate(date: Date | null) {
  if (!date) return "Não informado"

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatDateInput(date: Date | null) {
  if (!date) return ""

  return date.toISOString().slice(0, 10)
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) return "AL"

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export default async function PerfilPage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const [usuario, carreiras] = await Promise.all([
    prisma.usuario.findUnique({
      where: { id: session.user.id },
      include: {
        perfilExtra: {
          include: {
            carreira: true,
          },
        },
      },
    }),
    prisma.carreira.findMany({
      where: { ativo: true },
      orderBy: { nome: "asc" },
    }),
  ])

  if (!usuario) {
    redirect("/login")
  }

  const nomeCompleto = [usuario.nome, usuario.sobrenome].filter(Boolean).join(" ")
  const avatarUrl = usuario.perfilExtra?.avatarUrl || usuario.avatarUrl || ""
  const telefone = usuario.perfilExtra?.telefone || usuario.telefone || ""

  return (
    <ProfileForm
      profile={{
        email: usuario.email,
        nome: nomeCompleto,
        cpf: usuario.cpf || "Não informado",
        cpfValue: usuario.cpf || "",
        canEditCpf: !usuario.cpf,
        dataNascimento: formatDate(usuario.dataNascimento),
        dataNascimentoValue: formatDateInput(usuario.dataNascimento),
        canEditDataNascimento: !usuario.dataNascimento,
        avatarUrl,
        iniciais: getInitials(nomeCompleto),
        nomeExibicao: usuario.perfilExtra?.nomeExibicao || "",
        telefone,
        bio: usuario.perfilExtra?.bio || "",
        instagram: usuario.perfilExtra?.instagram || "",
        tiktok: usuario.perfilExtra?.tiktok || "",
        facebook: usuario.perfilExtra?.facebook || "",
        visibilidade: usuario.perfilExtra?.visibilidade || "privado",
        carreira: usuario.perfilExtra?.carreira?.nome || "Não definida",
        carreiraId: usuario.perfilExtra?.carreiraId || "",
        carreiras: carreiras.map((carreira) => ({
          id: carreira.id,
          nome: carreira.nome,
        })),
      }}
    />
  )
}
