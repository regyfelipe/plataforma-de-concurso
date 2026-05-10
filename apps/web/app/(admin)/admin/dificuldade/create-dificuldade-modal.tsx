"use client"

import * as React from "react"
import { Plus, Gauge, Link as LinkIcon } from "lucide-react"
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
import { createDificuldadeInline } from "@/actions/admin-taxonomy"

export function CreateDificuldadeModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const slug = formData.get("slug") as string
    
    startTransition(async () => {
      await createDificuldadeInline(nome, slug)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            Novo Nível
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Nível de Dificuldade</DialogTitle>
          <DialogDescription>
            Cadastre um novo nível para classificar as questões.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                Nome do Nível
              </Label>
              <Input name="nome" required placeholder="Ex: Fácil, Médio, Difícil..." />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                Slug (Identificador)
              </Label>
              <Input name="slug" required placeholder="Ex: facil, medio, dificil" className="lowercase" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Nível"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
