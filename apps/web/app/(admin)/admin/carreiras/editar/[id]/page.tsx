"use client"

import * as React from "react"
import { ChevronLeft, Save, X, Briefcase, AlignLeft, Power } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Textarea } from "@workspace/ui/components/textarea"
import { Switch } from "@workspace/ui/components/switch"
import { useParams } from "next/navigation"
import { CARREIRAS_MOCK } from "@/data/mocks/admin"

export default function EditarCarreiraPage() {
    const params = useParams()
    const id = params.id as string
    
    const carreira = CARREIRAS_MOCK.find((c: any) => c.id === id)

    const [nome, setNome] = React.useState(carreira?.name || "")

    if (!carreira) {
        return <div className="p-8 text-center text-muted-foreground">Carreira não encontrada.</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full max-w-4xl">
            
            {/* Header de Navegação */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/carreiras" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar para Lista
                </Link>

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Gestão Estratégica</p>
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">
                            Editar Carreira
                        </h1>
                    </div>
                </div>
            </div>

            {/* Formulário Principal */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2.5rem] p-10 space-y-10 shadow-sm">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Ajuste de Área</h3>
                        <p className="text-[11px] font-medium text-muted-foreground/60 leading-relaxed">
                            Mantenha o nome da carreira padronizado para não confundir os alunos que já utilizam os filtros.
                        </p>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <Briefcase className="w-3 h-3" />
                                Nome da Carreira
                            </Label>
                            <Input 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Ex: Policial" 
                                className="h-12 px-5 bg-muted/10 border-border/40 rounded-xl focus-visible:ring-primary/20 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex items-center gap-2">
                                <AlignLeft className="w-3 h-3" />
                                Descrição da Área
                            </Label>
                            <Textarea 
                                defaultValue={carreira.description}
                                placeholder="Ex: PF, PRF, Polícias Civis e Militares..." 
                                className="bg-muted/10 border-border/40 rounded-xl p-5 min-h-[120px] resize-none focus-visible:ring-primary/20 font-medium"
                            />
                        </div>

                        <div className="pt-6 border-t border-border/10">
                            <div className="flex items-center justify-between p-4 bg-muted/5 rounded-2xl border border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <Power className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black text-foreground">Status da Carreira</p>
                                        <p className="text-[10px] font-medium text-muted-foreground/60">Define se a carreira estará visível para os alunos.</p>
                                    </div>
                                </div>
                                <Switch defaultChecked={carreira.status === 'active'} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-border/10">
                    <Link href="/admin/carreiras">
                        <Button variant="ghost" className="h-12 px-8 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2">
                            <X className="w-4 h-4" />
                            Cancelar
                        </Button>
                    </Link>
                    <Button className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 shadow-lg shadow-primary/20 gap-2 transition-all">
                        <Save className="w-4 h-4" />
                        Salvar Alterações
                    </Button>
                </div>
            </div>
        </div>
    )
}
