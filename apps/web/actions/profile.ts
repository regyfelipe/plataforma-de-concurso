"use server"

import { auth } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { z } from "zod"

const profileSchema = z.object({
  nome: z.string().trim().min(2).max(150),
  cpf: z.string().trim().max(14).optional(),
  dataNascimento: z.string().trim().optional(),
  nomeExibicao: z.string().trim().max(100).optional(),
  telefone: z.string().trim().max(20).optional(),
  bio: z.string().trim().max(2000).optional(),
  instagram: z.string().trim().max(100).optional(),
  tiktok: z.string().trim().max(100).optional(),
  facebook: z.string().trim().max(100).optional(),
  carreiraId: z.string().uuid().optional().or(z.literal("")),
  visibilidade: z.enum(["privado", "basico_publico", "completo_publico"]),
})

const addressSchema = z.object({
  id: z.string().uuid().optional(),
  apelido: z.string().trim().max(50).optional(),
  cep: z.string().trim().min(8).max(9),
  logradouro: z.string().trim().min(2).max(200),
  numero: z.string().trim().min(1).max(20),
  complemento: z.string().trim().max(100).optional(),
  referencia: z.string().trim().max(200).optional(),
  bairro: z.string().trim().min(2).max(100),
  cidade: z.string().trim().min(2).max(100),
  estado: z.string().trim().length(2),
  principal: z.boolean().optional(),
})

function emptyToNull(value?: string) {
  return value && value.length > 0 ? value : null
}

function parseOptionalDate(value?: string) {
  if (!value) return null

  const date = new Date(`${value}T00:00:00.000Z`)
  return Number.isNaN(date.getTime()) ? null : date
}

export async function updateStudentProfile(values: z.infer<typeof profileSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sessão expirada. Faça login novamente.",
    }
  }

  const parsed = profileSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os dados informados.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data
  const currentUser = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: {
      cpf: true,
      dataNascimento: true,
    },
  })

  if (!currentUser) {
    return {
      success: false,
      message: "Usuário não encontrado.",
    }
  }

  await prisma.$transaction([
    prisma.usuario.update({
      where: { id: session.user.id },
      data: {
        nome: data.nome,
        telefone: emptyToNull(data.telefone),
        cpf: currentUser.cpf ? undefined : emptyToNull(data.cpf),
        dataNascimento: currentUser.dataNascimento ? undefined : parseOptionalDate(data.dataNascimento),
      },
    }),
    prisma.perfil.upsert({
      where: { usuarioId: session.user.id },
      create: {
        usuarioId: session.user.id,
        nomeExibicao: emptyToNull(data.nomeExibicao),
        avatarUrl: null,
        telefone: emptyToNull(data.telefone),
        bio: emptyToNull(data.bio),
        visibilidade: data.visibilidade,
        carreiraId: emptyToNull(data.carreiraId),
        instagram: emptyToNull(data.instagram),
        tiktok: emptyToNull(data.tiktok),
        facebook: emptyToNull(data.facebook),
      },
      update: {
        nomeExibicao: emptyToNull(data.nomeExibicao),
        telefone: emptyToNull(data.telefone),
        bio: emptyToNull(data.bio),
        visibilidade: data.visibilidade,
        carreiraId: emptyToNull(data.carreiraId),
        instagram: emptyToNull(data.instagram),
        tiktok: emptyToNull(data.tiktok),
        facebook: emptyToNull(data.facebook),
      },
    }),
  ])

  return {
    success: true,
    message: "Perfil atualizado com sucesso.",
  }
}

export async function upsertStudentAddress(values: z.infer<typeof addressSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Sessão expirada. Faça login novamente.",
    }
  }

  const parsed = addressSchema.safeParse(values)

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os dados do endereço.",
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  const data = parsed.data
  const principal = Boolean(data.principal)

  if (principal) {
    await prisma.endereco.updateMany({
      where: { usuarioId: session.user.id },
      data: { principal: false },
    })
  }

  if (data.id) {
    await prisma.endereco.updateMany({
      where: {
        id: data.id,
        usuarioId: session.user.id,
      },
      data: {
        apelido: emptyToNull(data.apelido),
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: emptyToNull(data.complemento),
        referencia: emptyToNull(data.referencia),
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado.toUpperCase(),
        principal,
      },
    })
  } else {
    const hasAddress = await prisma.endereco.count({
      where: { usuarioId: session.user.id },
    })

    await prisma.endereco.create({
      data: {
        usuarioId: session.user.id,
        apelido: emptyToNull(data.apelido),
        cep: data.cep,
        logradouro: data.logradouro,
        numero: data.numero,
        complemento: emptyToNull(data.complemento),
        referencia: emptyToNull(data.referencia),
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado.toUpperCase(),
        principal: principal || hasAddress === 0,
      },
    })
  }

  return {
    success: true,
    message: "Endereço salvo com sucesso.",
  }
}
