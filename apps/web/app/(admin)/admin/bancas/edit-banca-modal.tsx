"use client"

import { useState, useTransition } from "react"
import { Building2, Save, Loader2, Power, AlignLeft, Hash } from "lucide-react"
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
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { updateBanca } from "@/actions/admin-taxonomy"
import { toast } from "sonner"

interface EditBancaModalProps {
  item: {
    id: string
    title: string
    sigla: string
    subtitle?: string
    active: boolean
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditBancaModal({ item, open, onOpenChange }: EditBancaModalProps) {
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState(item.title)
  const [sigla, setSigla] = useState(item.sigla)
  const [descricao, setDescricao] = useState(item.subtitle || "")
  const [active, setActive] = useState(item.active)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    startTransition(async () => {
      try {
        await updateBanca(item.id, {
          nome,
          sigla,
          descricao,
          ativo: active
        })
        toast.success("Banca atualizada com sucesso!")
        onOpenChange(false)
      } catch (error) {
        toast.error("Erro ao atualizar banca.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500" />
            Editar Banca Examinadora
          </DialogTitle>
          <DialogDescription>
            Altere as informações da banca organizadora.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3 space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                  Nome da Banca
                </Label>
                <Input 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  placeholder="Ex: Fundação Carlos Chagas" 
                />
              </div>
              <div className="col-span-1 space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                  Sigla
                </Label>
                <Input 
                  value={sigla} 
                  onChange={(e) => setSigla(e.target.value.toUpperCase())} 
                  required 
                  placeholder="Ex: FCC" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                Descrição
              </Label>
              <Textarea 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                placeholder="Breve descrição sobre a banca..." 
                className="resize-none h-24"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
              <div className="space-y-0.5">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Power className="w-3.5 h-3.5 text-muted-foreground" />
                  Status da Banca
                </Label>
                <p className="text-xs text-muted-foreground">
                  Define se esta banca estará disponível para novos concursos.
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
