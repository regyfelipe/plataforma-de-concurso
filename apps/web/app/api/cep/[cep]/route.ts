import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

type ViaCepResponse = {
  erro?: boolean
  cep?: string
  logradouro?: string
  complemento?: string
  bairro?: string
  localidade?: string
  uf?: string
}

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)

  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ cep: string }> }
) {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { cep } = await context.params
  const digits = cep.replace(/\D/g, "")

  if (!/^\d{8}$/.test(digits)) {
    return NextResponse.json({ error: "CEP inválido." }, { status: 400 })
  }

  const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 30 },
  })

  if (!response.ok) {
    return NextResponse.json({ error: "Não foi possível consultar o CEP." }, { status: 502 })
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    return NextResponse.json({ error: "CEP não encontrado." }, { status: 404 })
  }

  return NextResponse.json({
    cep: data.cep || formatCep(digits),
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
    complemento: data.complemento || "",
  })
}
