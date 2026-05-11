"use client"

import { useState, useTransition } from "react"
import { Gauge, Hash, Save, Loader2, Power } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { updateDificuldade } from "@/actions/admin-taxonomy"
import { toast } from "sonner"

interface EditDificuldadeModalProps {
  item: {
    id: string
    title: string
    slug: string
    active: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDificuldadeModal({ item, open, onOpenChange }: EditDificuldadeModalProps) {
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState(item.title)
  const [slug, setSlug] = useState(item.slug)
  const [active, setActive] = useState(item.active)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        await updateDificuldade(item.id, {
          nome,
          slug,
          ativo: active
        })
        toast.success("Dificuldade atualizada com sucesso!")
        onOpenChange(false)
      } catch (error) {
        toast.error("Erro ao atualizar dificuldade.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-500" />
            Editar Nível de Dificuldade
          </DialogTitle>
          <DialogDescription>
            Altere as informações do nível de dificuldade.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5 text-muted-foreground" />
                Nome do Nível
              </Label>
              <Input 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                required 
                placeholder="Ex: Fácil, Médio, Difícil..." 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                Identificador (Slug)
              </Label>
              <Input 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                required 
                placeholder="Ex: facil, medio, dificil" 
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Power className="w-3.5 h-3.5 text-muted-foreground" />
                  Status do Nível
                </Label>
                <p className="text-xs text-muted-foreground">
                  Define se este nível estará disponível para filtros.
                </p>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
