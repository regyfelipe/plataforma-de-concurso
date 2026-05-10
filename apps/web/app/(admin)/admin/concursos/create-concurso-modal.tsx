"use client"

import * as React from "react"
import { Plus, GraduationCap, Building2, Briefcase, Calendar, Info, Search } from "lucide-react"
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
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@workspace/ui/components/combobox"
import { createConcursoInline } from "@/actions/admin-taxonomy"

type CreateConcursoModalProps = {
  bancas: { id: string; nome: string; sigla: string }[]
  carreiras: { id: string; nome: string }[]
  niveis: { id: string; nome: string }[]
}

export function CreateConcursoModal({ bancas, carreiras, niveis }: CreateConcursoModalProps) {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  // Estados para os Comboboxes
  const [selectedBanca, setSelectedBanca] = React.useState<string | null>(null)
  const [selectedCarreira, setSelectedCarreira] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data = {
      nome: formData.get("nome") as string,
      bancaId: selectedBanca || undefined,
      carreiraId: selectedCarreira || undefined,
      nivelId: (formData.get("nivelId") as string) || undefined,
      ano: formData.get("ano") ? parseInt(formData.get("ano") as string) : undefined,
      status: formData.get("status") as "aberto" | "previsto" | "encerrado",
    }
    
    startTransition(async () => {
      await createConcursoInline(data)
      setOpen(false)
      setSelectedBanca(null)
      setSelectedCarreira(null)
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Concurso</DialogTitle>
          <DialogDescription>
            Preencha os dados do certame para organizar as questões e simulados.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                Nome do Concurso
              </Label>
              <Input name="nome" required placeholder="Ex: Tribunal de Justiça de SP - Escrevente" className="w-full" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                Banca
              </Label>
              <Combobox value={selectedBanca} onValueChange={setSelectedBanca}>
                <ComboboxInput 
                  placeholder="Selecione a banca..." 
                  className="w-full" 
                  showTrigger 
                />
                <ComboboxContent>
                  <ComboboxList>
                    {bancas.map((b) => (
                      <ComboboxItem key={b.id} value={b.id}>
                        {b.sigla} - {b.nome}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>Nenhuma banca encontrada.</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                Carreira
              </Label>
              <Combobox value={selectedCarreira} onValueChange={setSelectedCarreira}>
                <ComboboxInput 
                  placeholder="Selecione a carreira..." 
                  className="w-full"
                  showTrigger
                />
                <ComboboxContent>
                  <ComboboxList>
                    {carreiras.map((c) => (
                      <ComboboxItem key={c.id} value={c.id}>
                        {c.nome}
                      </ComboboxItem>
                    ))}
                    <ComboboxEmpty>Nenhuma carreira encontrada.</ComboboxEmpty>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
                Nível de Escolaridade
              </Label>
              <Select name="nivelId">
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  {niveis.map((n) => (
                    <SelectItem key={n.id} value={n.id}>
                      {n.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Ano
              </Label>
              <Input name="ano" type="number" placeholder="Ex: 2024" min={1900} max={2100} className="w-full" />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-semibold">Status do Certame</Label>
              <Select name="status" defaultValue="previsto">
                <SelectTrigger className="w-full bg-background">
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
