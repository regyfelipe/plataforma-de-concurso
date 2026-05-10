"use client"

import * as React from "react"
import { Plus, HelpCircle, Link as LinkIcon, ListOrdered, CheckCircle2 } from "lucide-react"
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
import { createTipoQuestaoInline } from "@/actions/admin-taxonomy"

export function CreateTipoQuestaoModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const [modelo, setModelo] = React.useState("multipla_escolha")
  const [quantidade, setQuantidade] = React.useState("5")

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const slug = formData.get("slug") as string
    
    startTransition(async () => {
      await createTipoQuestaoInline(nome, slug, modelo, parseInt(quantidade))
      setOpen(false)
      // Reset defaults
      setModelo("multipla_escolha")
      setQuantidade("5")
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          <Button className="gap-2 shadow-lg hover:scale-[1.02] transition-transform">
            <Plus className="w-4 h-4" />
            Novo Tipo
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Tipo de Questão</DialogTitle>
          <DialogDescription>
            Defina o formato e a quantidade de alternativas para este tipo.
          </DialogDescription>
        </DialogHeader>
        
        <form action={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  Nome do Tipo
                </Label>
                <Input name="nome" required placeholder="Ex: Múltipla Escolha - 5 Itens" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  Slug (ID)
                </Label>
                <Input name="slug" required placeholder="Ex: multipla-5" className="lowercase" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                  Modelo de Resposta
                </Label>
                <Select value={modelo} onValueChange={(val) => {
                  setModelo(val)
                  if (val === "certo_errado") setQuantidade("2")
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multipla_escolha">Múltipla Escolha</SelectItem>
                    <SelectItem value="certo_errado">Certo ou Errado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold flex items-center gap-2">
                  <ListOrdered className="w-3.5 h-3.5 text-muted-foreground" />
                  Qtd. de Alternativas
                </Label>
                <Select 
                  value={quantidade} 
                  onValueChange={setQuantidade}
                  disabled={modelo === "certo_errado"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelo === "certo_errado" ? (
                      <SelectItem value="2">2 (C/E)</SelectItem>
                    ) : (
                      <>
                        <SelectItem value="3">3 Alternativas</SelectItem>
                        <SelectItem value="4">4 Alternativas</SelectItem>
                        <SelectItem value="5">5 Alternativas</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Tipo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
