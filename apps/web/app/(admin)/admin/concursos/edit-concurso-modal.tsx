"use client"

import * as React from "react"
import { GraduationCap, Building2, Briefcase, Calendar, Info, UserCircle, Camera, Loader2, Trash2, Save } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { FilterSelect } from "@/components/questoes/filter/filter-select"
import { updateConcurso } from "@/actions/admin-taxonomy"
import { uploadToR2 } from "@/actions/upload"
import { toast } from "sonner"

type EditConcursoModalProps = {
  item: {
    id: string
    nome: string
    sigla: string | null
    cargo: string | null
    bancaId: string | null
    carreiraId: string | null
    nivelId: string | null
    ano: number | null
    status: "aberto" | "previsto" | "encerrado"
    logoUrl: string | null
    ativo: boolean
  }
  bancas: { id: string; nome: string; sigla: string }[]
  carreiras: { id: string; nome: string }[]
  niveis: { id: string; nome: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditConcursoModal({ item, bancas, carreiras, niveis, open, onOpenChange }: EditConcursoModalProps) {
  const [isPending, startTransition] = React.useTransition()
  const [isUploading, setIsUploading] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState(item.logoUrl || "")
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  // Estados para os seletores
  const [selectedBanca, setSelectedBanca] = React.useState(item.bancaId || "")
  const [selectedCarreira, setSelectedCarreira] = React.useState(item.carreiraId || "")
  const [selectedNivel, setSelectedNivel] = React.useState(item.nivelId || "")
  const [selectedStatus, setSelectedStatus] = React.useState<"aberto" | "previsto" | "encerrado">(item.status)

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    startTransition(async () => {
      let finalLogoUrl = item.logoUrl || ""

      if (selectedFile) {
        setIsUploading(true)
        const uploadData = new FormData()
        uploadData.append("file", selectedFile)
        uploadData.append("path", "contests")

        const result = await uploadToR2(uploadData)
        if (result.success && result.url) {
          finalLogoUrl = result.url
        } else {
          toast.error("Erro ao enviar imagem, mantendo a anterior ou sem logo.")
        }
        setIsUploading(false)
      }

      const selectedCarreiraObj = carreiras.find(c => c.id === selectedCarreira)
      if (!selectedCarreiraObj) {
        toast.error("Por favor, selecione o Órgão / Instituição.")
        return
      }

      const data = {
        nome: selectedCarreiraObj.nome,
        sigla: undefined,
        cargo: formData.get("cargo") as string || undefined,
        bancaId: selectedBanca || undefined,
        carreiraId: selectedCarreira || undefined,
        nivelId: selectedNivel || undefined,
        ano: formData.get("ano") ? parseInt(formData.get("ano") as string) : undefined,
        status: selectedStatus,
        logoUrl: finalLogoUrl || undefined,
      }
      
      try {
        await updateConcurso(item.id, data)
        toast.success("Concurso atualizado com sucesso!")
        onOpenChange(false)
      } catch (error) {
        toast.error("Erro ao atualizar concurso.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Editar Concurso</DialogTitle>
          <DialogDescription>
            Atualize as informações do certame.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center gap-4 py-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-muted-foreground/25 group-hover:border-primary/50 transition-colors overflow-hidden bg-muted flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                      <GraduationCap className="w-8 h-8 text-muted-foreground" />
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
              Logo do Órgão
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-2">
              <FilterSelect 
                label="Órgão / Instituição"
                placeholder="Pesquisar órgão..."
                options={carreiras.map(c => ({ label: c.nome, value: c.id }))}
                value={selectedCarreira}
                onValueChange={setSelectedCarreira}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <UserCircle className="w-3.5 h-3.5 text-muted-foreground" />
                Cargo
              </Label>
              <Input name="cargo" defaultValue={item.cargo || ""} placeholder="Ex: Agente, Delegado..." className="w-full h-9" />
            </div>

            <div className="space-y-2">
              <FilterSelect 
                label="Banca"
                placeholder="Selecione a banca..."
                options={bancas.map(b => ({ label: b.sigla, value: b.id }))}
                value={selectedBanca}
                onValueChange={setSelectedBanca}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <FilterSelect 
                label="Nível de Escolaridade"
                placeholder="Selecione o nível..."
                options={niveis.map(n => ({ label: n.nome, value: n.id }))}
                value={selectedNivel}
                onValueChange={setSelectedNivel}
                isMulti={false}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Ano
              </Label>
              <Input name="ano" type="number" defaultValue={item.ano || ""} placeholder="Ex: 2024" min={1900} max={2100} className="w-full h-9" />
            </div>

            <div className=" space-y-2">
              <Label className="text-xs font-semibold">Status do Certame</Label>
              <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as any)}>
                <SelectTrigger className="w-full bg-background h-9">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previsto">Previsto</SelectItem>
                  <SelectItem value="aberto">Inscrições Abertas</SelectItem>
                  <SelectItem value="encerrado">Encerrado / Provas Realizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose render={<Button variant="ghost" type="button" />}>
              Cancelar
            </DialogClose>
            <Button type="submit" disabled={isPending || isUploading} className="px-8 font-bold">
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
