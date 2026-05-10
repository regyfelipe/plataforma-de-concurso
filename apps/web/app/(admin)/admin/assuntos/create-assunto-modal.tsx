"use client"

import * as React from "react"
import { Plus, BookOpen, Bookmark, Power } from "lucide-react"
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
import { Switch } from "@workspace/ui/components/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { createAssunto } from "@/actions/admin-taxonomy"

type DisciplinaOption = {
  id: string
  nome: string
}

export function CreateAssuntoModal({
  disciplinas,
}: {
  disciplinas: DisciplinaOption[]
}) {
  const [open, setOpen] = React.useState(false)
  const [disciplinaId, setDisciplinaId] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  const disciplinaSelecionada = disciplinas.find((d) => d.id === disciplinaId)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      await createAssunto(formData)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
            <Plus className="mr-2 h-4 w-4" />
            Criar Assunto
          </Button>
        } 
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Assunto</DialogTitle>
          <DialogDescription>
            Crie um novo assunto base vinculado a uma disciplina.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <input type="hidden" name="disciplinaId" value={disciplinaId} />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                Disciplina Vinculada
              </Label>
              <Select value={disciplinaId} onValueChange={setDisciplinaId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a Disciplina">
                    {disciplinaSelecionada?.nome}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                Nome do Assunto
              </Label>
              <Input name="nome" required placeholder="Ex: Direito Constitucional" />
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Power className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">Status Ativo</p>
                </div>
              </div>
              <Switch name="ativo" defaultChecked />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose 
              render={
                <Button variant="ghost" type="button">Cancelar</Button>
              } 
            />
            <Button type="submit" disabled={isPending || !disciplinaId}>
              {isPending ? "Salvando..." : "Salvar Assunto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
