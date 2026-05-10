"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Camera, AlertTriangle, Trash2, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Badge } from "@workspace/ui/components/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { updateStudentProfile } from "@/actions/profile"
import { uploadToR2 } from "@/actions/upload"
import { toast } from "sonner"

const VISIBILIDADE_OPTIONS = [
  { value: "privado", label: "Privado", desc: "Seu perfil não é visível para outros usuários" },
  { value: "basico_publico", label: "Básico Público", desc: "Apenas nome e foto de perfil são visíveis" },
  { value: "completo_publico", label: "Completo Público", desc: "Perfil completo visível (sobre mim, redes sociais, etc.)" },
] as const

type ProfileData = {
  email: string
  nome: string
  cpf: string
  cpfValue: string
  canEditCpf: boolean
  dataNascimento: string
  dataNascimentoValue: string
  canEditDataNascimento: boolean
  avatarUrl: string
  iniciais: string
  nomeExibicao: string
  telefone: string
  bio: string
  instagram: string
  tiktok: string
  facebook: string
  visibilidade: "privado" | "basico_publico" | "completo_publico"
  carreira: string
  carreiraId: string
  carreiras: Array<{
    id: string
    nome: string
  }>
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [nome, setNome] = useState(profile.nome)
  const [cpf, setCpf] = useState(profile.cpfValue)
  const [dataNascimento, setDataNascimento] = useState(profile.dataNascimentoValue)
  const [visibilidade, setVisibilidade] = useState(profile.visibilidade)
  const [carreiraId, setCarreiraId] = useState(profile.carreiraId)
  const [nomeExibicao, setNomeExibicao] = useState(profile.nomeExibicao)
  const [telefone, setTelefone] = useState(profile.telefone)
  const [bio, setBio] = useState(profile.bio)
  const [instagram, setInstagram] = useState(profile.instagram)
  const [tiktok, setTiktok] = useState(profile.tiktok)
  const [facebook, setFacebook] = useState(profile.facebook)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl)
  
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tamanho (ex: 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("path", "avatars")

      const result = await uploadToR2(formData)
      
      if (result.success && result.url) {
        setAvatarUrl(result.url)
        toast.success("Foto carregada com sucesso! Lembre-se de salvar o perfil.")
      } else {
        toast.error(result.message || "Erro ao carregar foto")
      }
    } catch (err) {
      toast.error("Erro ao enviar imagem")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    setError(null)

    const result = await updateStudentProfile({
      nome,
      cpf,
      dataNascimento,
      nomeExibicao,
      telefone,
      bio,
      instagram,
      tiktok,
      facebook,
      carreiraId,
      visibilidade,
      avatarUrl,
    })

    if (result.success) {
      setMessage(result.message)
      toast.success(result.message)
      router.refresh() // Força a atualização de todos os componentes (incluindo Sidebar)
    } else {
      setError(result.message || "Não foi possível atualizar o perfil.")
      toast.error(result.message || "Erro ao atualizar perfil")
    }

    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div className={`rounded-md border p-3 text-center text-sm font-medium ${
          error
            ? "border-destructive/20 bg-destructive/10 text-destructive"
            : "border-primary/20 bg-primary/10 text-primary"
        }`}>
          {error || message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize suas informações pessoais e de contato.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20 border-2 border-muted">
                <AvatarImage src={avatarUrl} alt={nome} className="object-cover" />
                <AvatarFallback className="text-xl">{profile.iniciais}</AvatarFallback>
              </Avatar>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
              />

              <Button 
                variant="outline" 
                size="sm" 
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="relative"
              >
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {uploading ? "Enviando..." : "Alterar foto"}
              </Button>
              <p className="text-center text-[10px] text-muted-foreground max-w-[100px]">PNG, JPG ou WebP (Máx. 2MB)</p>
            </div>

            <div className="flex flex-1 gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Sua foto de perfil ajuda outros estudantes e professores a identificarem você na plataforma.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" value={profile.email} disabled />
              <p className="text-xs text-muted-foreground">O email não pode ser alterado. Entre em contato com o suporte se necessário.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome <span className="text-destructive">*</span></Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                <p className="text-xs text-muted-foreground">Use seu nome completo.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nome-exibicao">Nome de Exibição</Label>
                <Input
                  id="nome-exibicao"
                  placeholder="Como você prefere ser chamado"
                  value={nomeExibicao}
                  onChange={(e) => setNomeExibicao(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Um nome alternativo que será exibido no seu perfil.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={profile.canEditCpf ? cpf : profile.cpf}
                  disabled={!profile.canEditCpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.canEditCpf ? "Informe seu CPF. Depois de salvo, ele não poderá ser alterado aqui." : "CPF não pode ser alterado."}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-nasc">Data de Nascimento</Label>
                <Input
                  id="data-nasc"
                  type={profile.canEditDataNascimento ? "date" : "text"}
                  value={profile.canEditDataNascimento ? dataNascimento : profile.dataNascimento}
                  disabled={!profile.canEditDataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {profile.canEditDataNascimento ? "Informe sua data de nascimento. Depois de salva, ela não poderá ser alterada aqui." : "Data de nascimento não pode ser alterada."}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferência de Carreira</CardTitle>
          <CardDescription>Selecione a carreira em que você está se preparando para participar do ranking específico.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <span className="text-xs font-semibold text-primary">{profile.carreira.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <span className="font-medium">{profile.carreira}</span>
                <p className="text-xs text-muted-foreground">Carreira atual</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={carreiraId || "none"} onValueChange={(value) => setCarreiraId(value === "none" || !value ? "" : value)}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecionar carreira" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Não definida</SelectItem>
                  {profile.carreiras.map((carreira) => (
                    <SelectItem key={carreira.id} value={carreira.id}>
                      {carreira.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                Alterar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biografia e Redes Sociais</CardTitle>
          <CardDescription>Compartilhe informações sobre você e suas redes sociais.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Sobre Mim</Label>
            <Textarea
              id="bio"
              placeholder="Fale mais detalhadamente sobre sua trajetória..."
              className="resize-none"
              rows={4}
              maxLength={2000}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <div className="flex justify-between">
              <p className="text-xs text-muted-foreground">Máximo de 2000 caracteres.</p>
              <p className="text-xs text-muted-foreground">{bio.length}/2000</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input id="instagram" placeholder="@seu_usuario" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input id="tiktok" placeholder="@seu_usuario" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input id="facebook" placeholder="seu_usuario" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacidade e Visibilidade</CardTitle>
          <CardDescription>Controle quem pode ver seu perfil e suas informações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Visibilidade do Perfil</Label>
          {VISIBILIDADE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setVisibilidade(opt.value)}
              className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition-colors ${
                visibilidade === opt.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.desc}</p>
              </div>
              {visibilidade === opt.value && <Badge variant="secondary">Ativo</Badge>}
            </button>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-destructive" />
            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          </div>
          <CardDescription>Ações irreversíveis que afetam seus dados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Limpar Estatísticas</p>
              <p className="text-xs text-muted-foreground">
                Limpa todas as suas estatísticas e rankings, incluindo dados de desempenho por matéria, carreira e posições em rankings.
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              <Trash2 className="mr-2 h-4 w-4" />
              Limpar Estatísticas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
