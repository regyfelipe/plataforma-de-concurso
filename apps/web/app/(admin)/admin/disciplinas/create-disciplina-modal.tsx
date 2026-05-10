"use client"

import * as React from "react"
import { Plus, BookOpen, Hash, Power } from "lucide-react"
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
import { createDisciplinaInline } from "@/actions/admin-taxonomy"

export function CreateDisciplinaModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const code = formData.get("code") as string
    
    startTransition(async () => {
      await createDisciplinaInline(nome, code)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            Nova Disciplina
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogDescription>
            Cadastre uma nova disciplina no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                Nome da Disciplina
              </Label>
              <Input name="nome" required placeholder="Ex: Direito Administrativo" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                Sigla / Código
              </Label>
              <Input name="code" required placeholder="Ex: DADM" maxLength={10} className="uppercase" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Disciplina"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
