"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Plus, Home, Briefcase, X } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { upsertStudentAddress } from "@/actions/profile"

type Address = {
  id: string
  apelido: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  referencia: string
  bairro: string
  cidade: string
  estado: string
  principal: boolean
}

const EMPTY_ADDRESS: Address = {
  id: "",
  apelido: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  referencia: "",
  bairro: "",
  cidade: "",
  estado: "",
  principal: false,
}

export function AddressesManager({ initialAddresses }: { initialAddresses: Address[] }) {
  const router = useRouter()
  const [addresses, setAddresses] = useState(initialAddresses)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<Address>(EMPTY_ADDRESS)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAddresses(initialAddresses)
  }, [initialAddresses])

  function updateField(field: keyof Address, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function openCreate() {
    setForm({
      ...EMPTY_ADDRESS,
      principal: addresses.length === 0,
    })
    setMessage(null)
    setError(null)
    setFormOpen(true)
  }

  function openEdit(address: Address) {
    setForm(address)
    setMessage(null)
    setError(null)
    setFormOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    setError(null)

    const result = await upsertStudentAddress({
      id: form.id || undefined,
      apelido: form.apelido,
      cep: form.cep,
      logradouro: form.logradouro,
      numero: form.numero,
      complemento: form.complemento,
      referencia: form.referencia,
      bairro: form.bairro,
      cidade: form.cidade,
      estado: form.estado,
      principal: form.principal,
    })

    if (!result.success) {
      setError(result.message || "Não foi possível salvar o endereço.")
      setSaving(false)
      return
    }

    setMessage(result.message)
    setFormOpen(false)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div className={`rounded-md border p-3 text-center text-sm font-medium ${
          error
            ? "border-destructive/20 bg-destructive/10 text-destructive"
            : "border-primary/20 bg-primary/10 text-primary"
        }`}>
          {error || message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Endereços salvos</p>
          <p className="text-xs text-muted-foreground">{addresses.length} endereço(s) cadastrado(s)</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Endereço
        </Button>
      </div>

      {formOpen && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{form.id ? "Editar Endereço" : "Novo Endereço"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setFormOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="apelido">Apelido</Label>
                <Input id="apelido" placeholder="Casa, Trabalho..." value={form.apelido} onChange={(e) => updateField("apelido", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cep">CEP *</Label>
                <Input id="cep" placeholder="00000-000" value={form.cep} onChange={(e) => updateField("cep", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado *</Label>
                <Input id="estado" placeholder="CE" maxLength={2} value={form.estado} onChange={(e) => updateField("estado", e.target.value.toUpperCase())} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade *</Label>
                <Input id="cidade" value={form.cidade} onChange={(e) => updateField("cidade", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bairro">Bairro *</Label>
                <Input id="bairro" value={form.bairro} onChange={(e) => updateField("bairro", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <div className="space-y-2">
                <Label htmlFor="logradouro">Rua/Logradouro *</Label>
                <Input id="logradouro" value={form.logradouro} onChange={(e) => updateField("logradouro", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero">Número *</Label>
                <Input id="numero" value={form.numero} onChange={(e) => updateField("numero", e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="complemento">Complemento</Label>
                <Input id="complemento" value={form.complemento} onChange={(e) => updateField("complemento", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referencia">Referência</Label>
                <Input id="referencia" value={form.referencia} onChange={(e) => updateField("referencia", e.target.value)} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.principal}
                onChange={(e) => updateField("principal", e.target.checked)}
              />
              Definir como endereço principal
            </label>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar Endereço"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {addresses.map((end) => (
        <Card key={end.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {end.apelido.toLowerCase() === "trabalho" ? <Briefcase className="h-4 w-4" /> : <Home className="h-4 w-4" />}
                <CardTitle className="text-base">{end.apelido || "Endereço"}</CardTitle>
                {end.principal && <span className="text-xs font-medium text-primary">Principal</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={() => openEdit(end)}>Editar</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {end.logradouro}, {end.numero}
              {end.complemento ? `, ${end.complemento}` : ""} - {end.bairro}, {end.cidade}/{end.estado} - CEP {end.cep}
            </p>
            {end.referencia && (
              <p className="text-xs text-muted-foreground">Referência: {end.referencia}</p>
            )}
          </CardContent>
        </Card>
      ))}

      {addresses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
            <MapPin className="h-8 w-8 text-muted-foreground" />
            <p className="font-medium">Nenhum endereço cadastrado</p>
            <p className="text-sm text-muted-foreground">Você ainda não possui endereços salvos.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
