"use client"

import * as React from "react"
import { Plus, Briefcase, AlignLeft, Camera, Loader2, Trash2 } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { createCarreiraInline } from "@/actions/admin-taxonomy"
import { uploadToR2 } from "@/actions/upload"
import { toast } from "sonner"

export function CreateCarreiraModal() {
  const [open, setOpen] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const [isUploading, setIsUploading] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.")
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (formData: FormData) => {
    const nome = formData.get("nome") as string
    const descricao = formData.get("descricao") as string
    
    startTransition(async () => {
      let finalIconUrl = ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadData = new FormData()
        uploadData.append("file", selectedFile)
        uploadData.append("path", "careers")

        const result = await uploadToR2(uploadData)
        if (result.success && result.url) {
          finalIconUrl = result.url
        } else {
          toast.error("Erro ao enviar imagem, salvando sem ícone.")
        }
        setIsUploading(false)
      }

      await createCarreiraInline(nome, descricao, finalIconUrl)
      setSelectedFile(null)
      setPreviewUrl("")
      setOpen(false)
      toast.success("Carreira criada com sucesso!")
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setPreviewUrl("")
        setSelectedFile(null)
      }
    }}>
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
          <div className="flex flex-col items-center justify-center gap-4 py-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-muted-foreground/25 group-hover:border-primary/50 transition-colors overflow-hidden bg-muted flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed"
              >
                <Camera className="w-6 h-6 text-white" />
              </button>

              {previewUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl("")
                    setSelectedFile(null)
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 shadow-md hover:scale-110 transition-transform z-10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Brasão da Carreira (Opcional)
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>

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
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending ? "Salvando..." : "Salvar Carreira"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
