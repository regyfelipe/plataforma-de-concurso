"use client"

import * as React from "react"
import { Plus, GraduationCap, Building2, Briefcase, Calendar, Info, UserCircle } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { createConcursoInline } from "@/actions/admin-taxonomy"

type CreateConcursoModalProps = {
  bancas: { id: string; nome: string; sigla: string }[]
  carreiras: { id: string; nome: string }[]
  niveis: { id: string; nome: string }[]
}

export function CreateConcursoModal({ bancas, carreiras, niveis }: CreateConcursoModalProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  // Estados para os seletores (usando FilterSelect)
  const [selectedBanca, setSelectedBanca] = React.useState("")
  const [selectedCarreira, setSelectedCarreira] = React.useState("")
  const [selectedNivel, setSelectedNivel] = React.useState("")
  const [selectedStatus, setSelectedStatus] = React.useState<"aberto" | "previsto" | "encerrado">("previsto")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      nome: formData.get("nome") as string,
      sigla: formData.get("sigla") as string || undefined,
      cargo: formData.get("cargo") as string || undefined,
      bancaId: selectedBanca || undefined,
      carreiraId: selectedCarreira || undefined,
      nivelId: selectedNivel || undefined,
      ano: formData.get("ano") ? parseInt(formData.get("ano") as string) : undefined,
      status: selectedStatus,
    }
    
    startTransition(async () => {
      await createConcursoInline(data)
      setOpen(false)
      setSelectedBanca("")
      setSelectedCarreira("")
      setSelectedNivel("")
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform font-semibold">
            <Plus className="w-4 h-4" />
            Novo Concurso
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Concurso</DialogTitle>
          <DialogDescription>
            Preencha os dados do certame para organizar as questões e simulados.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                Órgão / Instituição
              </Label>
              <Input name="nome" required placeholder="Ex: Polícia Federal" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                Sigla (Ex: PM, PRF, PC)
              </Label>
              <Input name="sigla" placeholder="Ex: PRF" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                Cargo
              </Label>
              <Input name="cargo" placeholder="Ex: Agente, Delegado..." className="w-full" />
            </div>

            <div className="space-y-2">
              <FilterSelect 
                label="Banca"
                placeholder="Selecione a banca..."
                options={bancas.map(b => ({ label: b.sigla, value: b.id }))}
                value={selectedBanca}
                onValueChange={setSelectedBanca}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <FilterSelect 
                label="Carreira"
                placeholder="Selecione a carreira..."
                options={carreiras.map(c => ({ label: c.nome, value: c.id }))}
                value={selectedCarreira}
                onValueChange={setSelectedCarreira}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <FilterSelect 
                label="Nível de Escolaridade"
                placeholder="Selecione o nível..."
                options={niveis.map(n => ({ label: n.nome, value: n.id }))}
                value={selectedNivel}
                onValueChange={setSelectedNivel}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Ano
              </Label>
              <Input name="ano" type="number" placeholder="Ex: 2024" min={1900} max={2100} className="w-full h-9" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold">Status do Certame</Label>
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
                <SelectTrigger className="w-full bg-background h-9">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previsto">Previsto</SelectItem>
                  <SelectItem value="aberto">Inscrições Abertas</SelectItem>
                  <SelectItem value="encerrado">Encerrado / Provas Realizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending} className="px-8 font-bold">
              {isPending ? "Salvando..." : "Salvar Concurso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
