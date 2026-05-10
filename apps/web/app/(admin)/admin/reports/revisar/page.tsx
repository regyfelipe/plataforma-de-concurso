"use client"

import * as React from "react"
import { 
    AlertTriangle, ArrowLeft, CheckCircle2, 
    XCircle, Edit3, ExternalLink, MessageSquare, 
    User, Calendar, Hash, Flag
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import Link from "next/link"

export default function ReviewReportPage() {
    // Simulating data - in a real app this would come from a query param/id
    const report = {
        id: "REP-102",
        questionId: "#128374",
        type: "Gabarito Errado",
        user: "Carlos Silva",
        date: "09/05/2026 - 11:45",
        status: "pendente",
        priority: "high",
        description: "O gabarito desta questão consta como alternativa B, porém, de acordo com o Art. 5º da CF, a resposta correta deveria ser a C devido à jurisprudência recente do STF."
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Top Bar / Header */}
            <header className="shrink-0 border-b bg-background/95 backdrop-blur px-6 h-14 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-[10px]">{report.id}</Badge>
                        <h1 className="text-sm font-semibold">Revisar Denúncia</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <XCircle className="mr-2 h-4 w-4" />
                        Rejeitar
                    </Button>
                    <Button variant="outline" size="sm">
                        <Edit3 className="mr-2 h-4 w-4" />
                        Editar Questão
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground shadow-sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Marcar como Resolvido
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex min-h-0 bg-muted/20">
                
                {/* Left Side: Question Content (The "Evidence") */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-6">
                    <Card>
                        <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <CardTitle className="text-base">Conteúdo da Questão</CardTitle>
                                <CardDescription>Versão atual no banco de dados</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8">
                                <ExternalLink className="mr-2 h-3.5 w-3.5" />
                                Ver no site
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Enunciado */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <Hash className="h-3.5 w-3.5" />
                                    Enunciado
                                </div>
                                <div className="p-5 rounded-lg border bg-background text-sm leading-relaxed shadow-sm">
                                    No que se refere aos direitos e deveres individuais e coletivos, assinale a opção correta considerando a Constituição Federal de 1988 no que tange aos direitos de nacionalidade e cidadania. O brasileiro nato que tiver sua nacionalidade declarada perdida por autoridade estrangeira em decorrência de naturalização voluntária poderá readquiri-la...
                                </div>
                            </div>

                            {/* Alternativas */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    <Flag className="h-3.5 w-3.5" />
                                    Alternativas e Gabarito
                                </div>
                                <div className="grid gap-2.5">
                                    {["A", "B", "C", "D", "E"].map((letter) => (
                                        <div 
                                            key={letter} 
                                            className={`flex items-start gap-4 p-4 rounded-md border transition-all ${
                                                letter === "B" 
                                                ? "border-primary bg-primary/5 ring-1 ring-primary/10" 
                                                : "bg-background hover:border-muted-foreground/30"
                                            }`}
                                        >
                                            <div className={`shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-xs font-bold shadow-sm ${
                                                letter === "B" 
                                                ? "bg-primary text-primary-foreground" 
                                                : "bg-muted text-muted-foreground"
                                            }`}>
                                                {letter}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm pt-0.5 leading-relaxed">
                                                    Texto da alternativa {letter} para conferência técnica do professor revisor.
                                                </p>
                                                {letter === "B" && (
                                                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-none uppercase py-0 px-2">
                                                        Gabarito Atual
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Report Metadata & User Feedback */}
                <aside className="w-[400px] border-l bg-background overflow-y-auto scrollbar-hide flex flex-col">
                    <div className="p-6 space-y-8">
                        
                        {/* Report Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant={report.priority === "high" ? "destructive" : "outline"} className="uppercase text-[10px]">
                                    Prioridade {report.priority === "high" ? "Alta" : "Média"}
                                </Badge>
                                <Badge variant="secondary" className="uppercase text-[10px]">
                                    {report.status}
                                </Badge>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold leading-none mb-1">{report.type}</h2>
                                <p className="text-sm text-muted-foreground">Reportado por aluno em tempo real</p>
                            </div>
                        </div>

                        <Separator />

                        {/* User Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarFallback className="bg-muted text-muted-foreground">{report.user[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">{report.user}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {report.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description / Content */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="h-3.5 w-3.5" />
                                Relato do Usuário
                            </h3>
                            <div className="relative">
                                <div className="absolute -left-2 top-0 bottom-0 w-1 bg-destructive/20 rounded-full" />
                                <blockquote className="pl-4 text-sm italic text-foreground/90 leading-relaxed">
                                    "{report.description}"
                                </blockquote>
                            </div>
                        </div>

                        <Separator />

                        {/* Action Suggestions */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações sugeridas</h3>
                            <div className="grid gap-2">
                                <Button variant="outline" size="sm" className="justify-start font-normal text-xs h-9">
                                    <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" />
                                    Responder ao aluno
                                </Button>
                                <Button variant="outline" size="sm" className="justify-start font-normal text-xs h-9">
                                    <AlertTriangle className="mr-2 h-4 w-4 text-muted-foreground" />
                                    Mover para banco de revisão
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto p-6 border-t bg-muted/5">
                        <p className="text-[10px] text-center text-muted-foreground uppercase leading-relaxed">
                            A revisão altera o estado global da questão. <br/>
                            Certifique-se da base legal antes de corrigir.
                        </p>
                    </div>
                </aside>
            </main>
        </div>
    )
}
