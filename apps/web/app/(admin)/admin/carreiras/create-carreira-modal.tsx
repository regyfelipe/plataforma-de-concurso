"use client"

import * as React from "react"
import { Plus, Briefcase, AlignLeft } from "lucide-react"
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
import { Textarea } from "@workspace/ui/components/textarea"
import { createCarreiraInline } from "@/actions/admin-taxonomy"

export function CreateCarreiraModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const descricao = formData.get("descricao") as string
    
    startTransition(async () => {
      await createCarreiraInline(nome, descricao)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            Nova Carreira
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Carreira</DialogTitle>
          <DialogDescription>
            Cadastre uma nova carreira para organizar os concursos.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                Nome da Carreira
              </Label>
              <Input name="nome" required placeholder="Ex: Policial, Jurídica, Fiscal..." />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                Descrição (Opcional)
              </Label>
              <Textarea 
                name="descricao" 
                placeholder="Breve descrição sobre esta carreira..." 
                className="resize-none h-24"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Carreira"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
