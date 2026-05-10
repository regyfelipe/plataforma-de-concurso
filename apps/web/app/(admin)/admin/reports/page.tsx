"use client"

import {
    AlertTriangle, Search, Filter, MoreHorizontal,
    Eye, CheckCircle2, Clock, AlertCircle, MessageSquare, ExternalLink
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@workspace/ui/components/table"

const REPORTS_MOCK = [
    { id: "REP-102", questionId: "#128374", type: "Gabarito Errado",    user: "Carlos Silva", date: "Há 5 min",  status: "pendente",   priority: "high"   },
    { id: "REP-101", questionId: "#124552", type: "Erro no Enunciado",  user: "Ana Paula",    date: "Há 12 min", status: "em_revisao", priority: "medium" },
    { id: "REP-100", questionId: "#122390", type: "Alternativas Iguais",user: "Roberto M.",   date: "Há 45 min", status: "resolvido",  priority: "low"    },
    { id: "REP-099", questionId: "#120443", type: "Imagem Quebrada",    user: "Juliana L.",   date: "Há 1h",     status: "pendente",   priority: "high"   },
]

const STATUS_BADGE: Record<string, { label: string; icon: React.ElementType; variant: "outline" | "secondary" | "default" }> = {
    pendente:   { label: "Pendente",    icon: Clock,         variant: "outline"   },
    em_revisao: { label: "Em Revisão",  icon: AlertCircle,   variant: "secondary" },
    resolvido:  { label: "Resolvido",   icon: CheckCircle2,  variant: "default"   },
}

export default function QuestionReportsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Gestão de Qualidade</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Denúncias de Questões</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Tratamento de erros e feedback dos usuários.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                    <Badge className="p-3">24 Pendentes</Badge>
                </div>
            </div>

            <Card>
                <CardContent className="space-y-4 pt-6">
                    {/* Busca + filtros rápidos */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar denúncia..." className="pl-9" />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="secondary" size="sm">Todos</Button>
                            <Button variant="ghost" size="sm">Gabarito</Button>
                            <Button variant="ghost" size="sm">Enunciado</Button>
                        </div>
                    </div>

                    {/* Tabela */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Report ID</TableHead>
                                <TableHead>Questão</TableHead>
                                <TableHead>Tipo de Erro</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {REPORTS_MOCK.map((report) => {
                                const badgeConfig = STATUS_BADGE[report.status] || STATUS_BADGE.pendente
                                const { label, icon: StatusIcon, variant } = badgeConfig!
                                return (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {report.id}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5">
                                                <Badge variant="outline">{report.questionId}</Badge>
                                                <ExternalLink className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${report.priority === "high" ? "bg-destructive" : "bg-amber-500"}`} />
                                                <span className="text-sm">{report.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-7 w-7">
                                                    <AvatarFallback className="text-xs">{report.user[0]}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="text-sm font-medium leading-none">{report.user}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{report.date}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={variant} className="gap-1">
                                                <StatusIcon className="h-3 w-3" />
                                                {label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {/* Modal de revisão */}
                                                <Dialog>
                                                    <DialogTrigger >
                                                        <Button size="sm" variant="outline" className="h-7 gap-1.5">
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Revisar
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="!max-w-none !w-[55vw] max-h-[85vh] p-0 overflow-hidden flex flex-col">
                                                        <DialogHeader className="px-6 py-4 border-b bg-muted/10 shrink-0">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="bg-primary/10 p-1.5 rounded-md">
                                                                        <AlertTriangle className="h-4 w-4 text-primary" />
                                                                    </div>
                                                                    <DialogTitle className="text-base font-semibold">
                                                                        Revisar Denúncia {report.id}
                                                                    </DialogTitle>
                                                                </div>
                                                                <Badge variant="outline" className="font-mono text-[10px] px-2 py-0.5">
                                                                    Questão {report.questionId}
                                                                </Badge>
                                                            </div>
                                                        </DialogHeader>

                                                        <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
                                                            {/* Esquerda: Conteúdo da Questão */}
                                                            <div className="col-span-7 border-r overflow-y-auto p-6 space-y-6 bg-background">
                                                                <div className="space-y-3">
                                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enunciado</p>
                                                                    <div className="p-4 bg-muted/5 border rounded-lg text-sm leading-relaxed text-foreground/90">
                                                                        No que se refere aos direitos e deveres individuais e coletivos, assinale a opção correta considerando a Constituição Federal de 1988 no que tange aos direitos de nacionalidade e cidadania...
                                                                    </div>
                                                                </div>
                                                                
                                                                <div className="space-y-3">
                                                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Alternativas</p>
                                                                    <div className="grid gap-2">
                                                                        {["A","B","C","D","E"].map((letter) => (
                                                                            <div key={letter} className={`flex items-start gap-3.5 p-3.5 rounded-md border transition-colors ${letter === "B" ? "border-primary/50 bg-primary/5 ring-1 ring-primary/10" : "border-border bg-background"}`}>
                                                                                <div className={`shrink-0 h-6 w-6 rounded flex items-center justify-center text-[10px] font-bold ${letter === "B" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                                                                                    {letter}
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                    <p className="text-sm pt-0.5 leading-relaxed text-foreground/80">Texto da alternativa {letter} para conferência técnica.</p>
                                                                                    {letter === "B" && <Badge variant="secondary" className="text-[9px] h-4 px-1.5 uppercase font-bold tracking-tight">Gabarito Atual</Badge>}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Direita: Dados da Denúncia */}
                                                            <div className="col-span-5 overflow-y-auto p-6 space-y-6 bg-muted/10">
                                                                <div className="flex items-center gap-3 pb-4 border-b">
                                                                    <Avatar className="h-9 w-9 border">
                                                                        <AvatarFallback className="text-xs bg-muted">{report.user[0]}</AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <p className="text-sm font-semibold">{report.user}</p>
                                                                        <p className="text-[11px] text-muted-foreground">{report.date}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Relato do Erro</p>
                                                                        <Badge variant="destructive" className="text-[9px] h-4 px-1.5 uppercase">{report.type}</Badge>
                                                                    </div>
                                                                    <div className="relative">
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive/20 rounded-full" />
                                                                        <blockquote className="pl-4 text-sm italic leading-relaxed text-foreground/70">
                                                                            "O gabarito desta questão consta como alternativa B, porém, de acordo com o Art. 5º da CF, a resposta correta deveria ser a C."
                                                                        </blockquote>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1 rounded-lg border bg-background overflow-hidden">
                                                                    <div className="flex justify-between px-4 py-2.5 text-xs border-b">
                                                                        <span className="text-muted-foreground">Tipo de Ocorrência</span>
                                                                        <span className="font-medium text-destructive">{report.type}</span>
                                                                    </div>
                                                                    <div className="flex justify-between px-4 py-2.5 text-xs">
                                                                        <span className="text-muted-foreground">Frequência Reportada</span>
                                                                        <span className="font-medium">3 vezes</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="shrink-0 px-6 py-4 border-t flex items-center justify-between bg-muted/5">
                                                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-destructive transition-colors">
                                                                Rejeitar Denúncia
                                                            </Button>
                                                            <div className="flex gap-2">
                                                                <Button variant="outline" size="sm" className="h-9 px-4 text-xs">Editar Questão</Button>
                                                                <Button size="sm" className="h-9 px-4 text-xs shadow-sm">Aplicar Correção</Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* Dropdown */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger >
                                                        <Button size="icon" variant="ghost" className="h-7 w-7">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem className="gap-2">
                                                            <MessageSquare className="h-3.5 w-3.5" /> Responder Aluno
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-emerald-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Marcar Resolvido
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="gap-2 text-destructive">
                                                            <AlertCircle className="h-3.5 w-3.5" /> Rejeitar Denúncia
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>

                    {/* Paginação */}
                    <div className="flex items-center justify-between pt-2 border-t">
                        <p className="text-sm text-muted-foreground">Mostrando 4 de 124 denúncias</p>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">1</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
