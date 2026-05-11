"use client"

import { useState, useTransition, useRef, ChangeEvent, useEffect } from "react"
import { Briefcase, AlignLeft, Camera, Loader2, Trash2, Check } from "lucide-react"
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
import { updateCarreira } from "@/actions/admin-taxonomy"
import { uploadToR2 } from "@/actions/upload"
import { toast } from "sonner"

interface EditCarreiraModalProps {
  carreira: {
    id: string
    nome: string
    descricao?: string
    iconUrl?: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCarreiraModal({ carreira, open, onOpenChange }: EditCarreiraModalProps) {
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [nome, setNome] = useState("")
  const [descricao, setDescricao] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (carreira) {
      setNome(carreira.nome)
      setDescricao(carreira.descricao || "")
      setPreviewUrl(carreira.iconUrl || "")
      setSelectedFile(null)
    }
  }, [carreira, open])

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB.")
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!carreira || !nome.trim()) return
    
    startTransition(async () => {
      let finalIconUrl = previewUrl

      if (selectedFile) {
        setIsUploading(true)
        const uploadData = new FormData()
        uploadData.append("file", selectedFile)
        uploadData.append("path", "careers")

        const result = await uploadToR2(uploadData)
        if (result.success && result.url) {
          finalIconUrl = result.url
        } else {
          toast.error("Erro ao enviar imagem, mantendo a anterior.")
        }
        setIsUploading(false)
      }

      try {
        await updateCarreira(carreira.id, {
          nome,
          descricao,
          iconUrl: finalIconUrl
        })
        onOpenChange(false)
        toast.success("Carreira atualizada com sucesso!")
      } catch (error) {
        toast.error("Erro ao atualizar carreira.")
      }
    })
  }

  if (!carreira) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Carreira</DialogTitle>
          <DialogDescription>
            Atualize as informações da carreira selecionada.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
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
              Brasão da Carreira
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
              <Input 
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                required 
                placeholder="Ex: Policial, Jurídica, Fiscal..." 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                Descrição (Opcional)
              </Label>
              <Textarea 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Breve descrição sobre esta carreira..." 
                className="resize-none h-24"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button">Cancelar</Button>} />
            <Button onClick={handleSave} disabled={isPending || isUploading || !nome.trim()}>
              {isPending ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
