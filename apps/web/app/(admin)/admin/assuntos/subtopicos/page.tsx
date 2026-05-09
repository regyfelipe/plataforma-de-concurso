"use client"

import * as React from "react"
import { ChevronLeft, Save, X, Bookmark, BookOpen, Layers, Power, Target } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Switch } from "@workspace/ui/components/switch"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@workspace/ui/components/select"
import { DISCIPLINAS_MOCK, ASSUNTOS_MOCK } from "@/data/mocks/admin"

export default function CriarHierarquiaPage() {
    const [tipo, setTipo] = React.useState<"topico" | "subtopico">("topico")

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full max-w-4xl">
            
            {/* Header de Navegação */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/assuntos" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar para Exploração
                </Link>

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Arquitetura de Conteúdo</p>
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">
                            Criar Tópico ou Subtópico
                        </h1>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Coluna de Info (1/3) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Definição de Nível</h3>
                        <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
                            Escolha se você deseja criar um novo **Tópico** (vinculado a um Assunto) ou um **Subtópico** (vinculado a um Tópico existente).
                        </p>
                        
                        <div className="flex flex-col gap-2 pt-4">
                            <Button 
                                onClick={() => setTipo("topico")}
                                variant={tipo === "topico" ? "default" : "outline"}
                                className={`justify-start gap-3 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipo === "topico" ? "bg-primary shadow-lg shadow-primary/20" : "border-border/40"}`}
                            >
                                <Bookmark className="w-4 h-4" />
                                Novo Tópico
                            </Button>
                            <Button 
                                onClick={() => setTipo("subtopico")}
                                variant={tipo === "subtopico" ? "default" : "outline"}
                                className={`justify-start gap-3 h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tipo === "subtopico" ? "bg-primary shadow-lg shadow-primary/20" : "border-border/40"}`}
                            >
                                <Layers className="w-4 h-4" />
                                Novo Subtópico
                            </Button>
                        </div>
                    </div>

                    {/* Coluna de Campos (2/3) */}
                    <div className="md:col-span-2 space-y-6">
                        
                        {/* Seleção do Pai Dependendo do Tipo */}
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                {tipo === "topico" ? <Bookmark className="w-3 h-3" /> : <Layers className="w-3 h-3" />}
                                Selecionar {tipo === "topico" ? "Assunto Pai" : "Tópico Pai"}
                            </Label>
                            <Select>
                                <SelectTrigger className="w-full h-12 bg-muted/10 border-border/40 rounded-xl focus:ring-primary/20">
                                    <SelectValue placeholder={`Selecione o ${tipo === "topico" ? "Assunto" : "Tópico"}`} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                                    {ASSUNTOS_MOCK
                                        .filter(a => a.level === (tipo === "topico" ? "assunto" : "topico"))
                                        .map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                <span className="font-bold">{p.name}</span>
                                                <span className="ml-2 text-[9px] text-muted-foreground opacity-60">({p.disciplina})</span>
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Target className="w-3 h-3" />
                                Nome do Novo {tipo === "topico" ? "Tópico" : "Subtópico"}
                            </Label>
                            <Input 
                                placeholder={`Ex: ${tipo === "topico" ? "Elementos do Ato" : "Competência e Finalidade"}`} 
                                className="h-12 px-5 bg-muted/10 border-border/40 rounded-xl focus-visible:ring-primary/20 font-medium"
                            />
                        </div>

                        <div className="pt-6 border-t border-border/10">
                            <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl border border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Power className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground">Status de Ativação</p>
                                        <p className="text-[10px] font-medium text-muted-foreground/60">Define se este item estará disponível para filtros de questões.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ações do Formulário */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/10">
                    <Link href="/admin/assuntos">
                        <Button variant="ghost" className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                            <X className="w-4 h-4" />
                            Cancelar
                        </Button>
                    </Link>
                    <Button className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/20 gap-2 transition-all">
                        <Save className="w-4 h-4" />
                        Salvar {tipo === "topico" ? "Tópico" : "Subtópico"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
