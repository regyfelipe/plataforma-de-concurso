"use client"

import * as React from "react"
import { Plus, Building2, Hash, AlignLeft } from "lucide-react"
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
import { createBancaInline } from "@/actions/admin-taxonomy"

export function CreateBancaModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const sigla = formData.get("sigla") as string
    const descricao = formData.get("descricao") as string
    
    startTransition(async () => {
      await createBancaInline(nome, sigla, descricao)
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            Nova Banca
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Banca Examinadora</DialogTitle>
          <DialogDescription>
            Cadastre uma nova banca (Ex: Cebraspe, FGV, FCC...).
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                Nome da Banca
              </Label>
              <Input name="nome" required placeholder="Ex: Fundação Getulio Vargas" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                Sigla
              </Label>
              <Input name="sigla" required placeholder="Ex: FGV" maxLength={20} className="uppercase" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                Descrição (Opcional)
              </Label>
              <Textarea 
                name="descricao" 
                placeholder="Breve histórico ou detalhes da banca..." 
                className="resize-none h-24"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Banca"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
