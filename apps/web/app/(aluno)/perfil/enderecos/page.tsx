import { AddressesManager } from "./addresses-manager"
import { getSession } from "@workspace/auth"
import { prisma } from "@workspace/database"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function EnderecosPage() {
  const session = await getSession(await headers())

  if (!session?.user?.id) {
    redirect("/login")
  }

  const enderecos = await prisma.endereco.findMany({
    where: { usuarioId: session.user.id },
    orderBy: [
      { principal: "desc" },
      { criadoEm: "desc" },
    ],
  })

  return (
    <AddressesManager
      initialAddresses={enderecos.map((endereco) => ({
        id: endereco.id,
        apelido: endereco.apelido || "",
        cep: endereco.cep,
        logradouro: endereco.logradouro,
        numero: endereco.numero,
        complemento: endereco.complemento || "",
        referencia: endereco.referencia || "",
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        principal: endereco.principal,
      }))}
    />
  )
}
