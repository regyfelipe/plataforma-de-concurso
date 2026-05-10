"use client"

import { Send, HelpCircle, AlertCircle, ChevronRight } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"

const FAQ = [
    "Como resetar meu progresso?",
    "Onde encontro meus certificados?",
    "Como funciona a repetição espaçada?",
    "Problemas com pagamento via PIX",
]

export default function NovoSuportePage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Central de Ajuda</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Novo Chamado</h1>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Suporte Online
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Formulário (2/3) */}
                <Card className="lg:col-span-2">
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select>
                                    <SelectTrigger>
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
                                <Label>Assunto</Label>
                                <Input placeholder="Ex: Erro no carregamento do PDF" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Descrição Detalhada</Label>
                            <Textarea
                                placeholder="Descreva seu problema com o máximo de detalhes possível..."
                                className="min-h-[200px] resize-none"
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button>
                                <Send className="mr-2 h-4 w-4" />
                                Enviar Chamado
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar FAQ (1/3) */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-sm">
                            <HelpCircle className="h-4 w-4" />
                            Dúvidas Frequentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        {FAQ.map((q, i) => (
                            <button
                                key={i}
                                className="w-full flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-muted/50 transition-colors text-left group"
                            >
                                <span className="text-sm text-muted-foreground group-hover:text-foreground">{q}</span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                            </button>
                        ))}

                        <Separator className="my-3" />

                        <div className="flex items-start gap-3 p-3 rounded-md bg-muted/40">
                            <AlertCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                            <div>
                                <p className="text-xs font-medium text-foreground mb-0.5">Tempo de Resposta</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Nossa equipe responde em menos de{" "}
                                    <span className="font-medium text-foreground">2 horas</span>.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
