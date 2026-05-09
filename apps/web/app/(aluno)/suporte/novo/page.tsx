"use client"

import * as React from "react"
import { Send, Upload, HelpCircle, MessageSquare, AlertCircle, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"

export default function NovoSuportePage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">

            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Central de Ajuda</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Novo Chamado
                    </h1>
                </div>

                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Suporte Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário Principal (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-10 space-y-8 shadow-sm">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Categoria</Label>
                                <Select>
                                    <SelectTrigger className="w-full bg-muted/10 border border-border/40 rounded-xl px-5 !h-11 text-sm focus:border-primary transition-all text-foreground">
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tecnica">Dúvida Técnica</SelectItem>
                                        <SelectItem value="erro">Erro em Questão</SelectItem>
                                        <SelectItem value="sugestao">Sugestão de Melhoria</SelectItem>
                                        <SelectItem value="financeiro">Financeiro / Assinatura</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Assunto</Label>
                                <Input 
                                    placeholder="Ex: Erro no carregamento do PDF" 
                                    className="h-11 bg-muted/10 border-border/40 rounded-xl focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Descrição Detalhada</Label>
                            <Textarea 
                                placeholder="Descreva seu problema com o máximo de detalhes possível..." 
                                className="bg-muted/10 border-border/40 rounded-2xl min-h-[200px] resize-none focus-visible:ring-primary/20"
                            />
                        </div>

                        <div className="flex items-center justify-end pt-4">
                            <Button className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-all gap-2">
                                <Send className="w-4 h-4" />
                                Enviar Chamado
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Sidebar FAQ/Apoio (1/3) */}
                <div className="space-y-6">
                    <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-5 h-5 text-primary" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Dúvidas Frequentes</h4>
                        </div>

                        <div className="space-y-3">
                            {[
                                "Como resetar meu progresso?",
                                "Onde encontro meus certificados?",
                                "Como funciona a repetição espaçada?",
                                "Problemas com pagamento via PIX"
                            ].map((q, i) => (
                                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted/20 transition-all text-left group">
                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">{q}</span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary" />
                                </button>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-border/20">
                            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest">Tempo de Resposta</p>
                                    <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">Nossa equipe costuma responder chamados em menos de <span className="text-foreground font-black">2 horas</span>.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
