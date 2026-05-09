"use client"

import * as React from "react"
import {
    AlertTriangle,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    ExternalLink
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@workspace/ui/components/dialog"

const REPORTS_MOCK = [
    { id: 'REP-102', questionId: '#128374', type: 'Gabarito Errado', user: 'Carlos Silva', date: 'Há 5 min', status: 'pendente', priority: 'high' },
    { id: 'REP-101', questionId: '#124552', type: 'Erro no Enunciado', user: 'Ana Paula', date: 'Há 12 min', status: 'em_revisao', priority: 'medium' },
    { id: 'REP-100', questionId: '#122390', type: 'Alternativas Iguais', user: 'Roberto M.', date: 'Há 45 min', status: 'resolvido', priority: 'low' },
    { id: 'REP-099', questionId: '#120443', type: 'Imagem Quebrada', user: 'Juliana L.', date: 'Há 1h', status: 'pendente', priority: 'high' },
]

export default function QuestionReportsPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 rounded-xl md:min-h-min mx-auto w-full">
            {/* Header Operacional */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Gestão de Qualidade</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground uppercase">
                        Denúncias de Questões
                    </h1>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest opacity-60">Tratamento de erros e feedback dos usuários.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" className="h-11 px-6 rounded-xl border-border/40 text-[10px] font-black uppercase gap-2">
                        <Filter className="w-4 h-4" />
                        Filtros
                    </Button>
                    <Badge className="bg-primary text-primary-foreground font-black text-[10px] h-11 px-6 rounded-xl shadow-lg shadow-primary/20">
                        24 Pendentes
                    </Badge>
                </div>
            </div>

            {/* Container Master de Ações */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-8 shadow-sm">
                {/* Filtros Rápidos */}
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input
                            placeholder="Buscar denúncia..."
                            className="pl-10 h-12 bg-muted/20 border-border/40 rounded-xl focus-visible:ring-primary/20 text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" className="h-10 px-4 rounded-lg text-[10px] font-black uppercase text-primary bg-primary/5">Todos</Button>
                        <Button variant="ghost" className="h-10 px-4 rounded-lg text-[10px] font-black uppercase opacity-40 hover:opacity-100">Gabarito</Button>
                        <Button variant="ghost" className="h-10 px-4 rounded-lg text-[10px] font-black uppercase opacity-40 hover:opacity-100">Enunciado</Button>
                    </div>
                </div>

                {/* Tabela de Reports */}
                <div className="border border-border/40 rounded-2xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/5 border-b border-border/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Report ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Questão</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tipo de Erro</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Usuário</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase text-muted-foreground tracking-widest">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {REPORTS_MOCK.map((report) => (
                                <tr key={report.id} className="hover:bg-muted/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-bold text-muted-foreground/60">{report.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px] font-black border-foreground text-primary">{report.questionId}</Badge>
                                            <ExternalLink className="w-3 h-3 text-muted-foreground/20 group-hover:text-primary transition-colors cursor-pointer" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${report.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                            <span className="text-xs font-semibold text-foreground/90">{report.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                                {report.user[0]}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[11px] font-bold text-foreground/80">{report.user}</p>
                                                <p className="text-[9px] font-medium text-muted-foreground/40">{report.date}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {report.status === 'pendente' && (
                                            <Badge className="bg-amber-500/10 text-amber-600 border-none text-[9px] font-black uppercase px-2 py-0.5">
                                                <Clock className="w-3 h-3 mr-1" /> Pendente
                                            </Badge>
                                        )}
                                        {report.status === 'em_revisao' && (
                                            <Badge className="bg-blue-500/10 text-blue-600 border-none text-[9px] font-black uppercase px-2 py-0.5">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Em Revisão
                                            </Badge>
                                        )}
                                        {report.status === 'resolvido' && (
                                            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black uppercase px-2 py-0.5">
                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Resolvido
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline" className="h-8 text-[9px] font-black uppercase gap-1.5 border-border/40 hover:bg-primary hover:text-white transition-all">
                                                        <Eye className="w-3 h-3" />
                                                        Revisar
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="!max-w-none w-[60vw] h-[85vh] p-0 overflow-hidden rounded-xl border-border shadow-2xl">
                                                    <div className="flex flex-col h-full bg-background">
                                                        
                                                        {/* Header Compacto */}
                                                        <div className="shrink-0 p-4 border-b flex items-center justify-between bg-muted/20">
                                                            <div className="flex items-center gap-3">
                                                                <AlertTriangle className="w-4 h-4 text-primary" />
                                                                <div>
                                                                    <h2 className="text-sm font-bold text-foreground">Revisar Denúncia {report.id}</h2>
                                                                    <p className="text-[10px] text-muted-foreground uppercase">Questão {report.questionId}</p>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-[10px] uppercase font-bold px-2 py-0.5">{report.status}</Badge>
                                                        </div>

                                                        {/* Meio: Split-Screen Operacional */}
                                                        <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
                                                            
                                                            {/* Lado Esquerdo: Conteúdo da Questão */}
                                                            <div className="md:col-span-8 border-r overflow-y-auto p-5 space-y-5 bg-background">
                                                                <div className="space-y-2">
                                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Enunciado</p>
                                                                    <div className="p-4 bg-muted/10 border rounded-lg text-sm leading-relaxed">
                                                                        No que se refere aos direitos e deveres individuais e coletivos, assinale a opção correta considerando a Constituição Federal de 1988 no que tange aos direitos de nacionalidade e cidadania...
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2 pb-4">
                                                                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Alternativas</p>
                                                                    <div className="grid gap-2">
                                                                        {['A', 'B', 'C', 'D', 'E'].map((letter) => (
                                                                            <div key={letter} className={`flex items-start gap-3 p-3 rounded-md border transition-colors ${letter === 'B' ? 'border-foreground bg-background' : 'border-border/50 bg-background hover:bg-muted/5'}`}>
                                                                                <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${letter === 'B' ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}>{letter}</div>
                                                                                <p className="text-xs pt-0.5">Texto da alternativa {letter} para conferência.</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Lado Direito: Denúncia do Aluno */}
                                                            <div className="md:col-span-4 overflow-y-auto p-5 space-y-6 bg-muted/5">
                                                                <div className="space-y-4">
                                                                    {/* Autor */}
                                                                    <div className="flex items-center gap-3 pb-4 border-b">
                                                                        <div className="w-8 h-8 rounded bg-foreground/10 flex items-center justify-center text-primary font-bold text-[10px]">
                                                                            {report.user[0]}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs font-bold text-foreground">{report.user}</p>
                                                                            <p className="text-[9px] text-muted-foreground uppercase">{report.date}</p>
                                                                        </div>
                                                                    </div>

                                                                    {/* Texto da Denúncia */}
                                                                    <div className="space-y-2">
                                                                        <p className="text-[10px] font-bold uppercase text-red-500">Relato do Erro</p>
                                                                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg italic text-[11px] leading-normal text-foreground/80">
                                                                            "O gabarito desta questão consta como alternativa B, porém, de acordo com o Art. 5º da CF, a resposta correta deveria ser a C devido à jurisprudência recente do STF."
                                                                        </div>
                                                                    </div>

                                                                    {/* Detalhes Técnicos */}
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between text-[10px] border-b pb-1">
                                                                            <span className="text-muted-foreground font-bold uppercase">Tipo:</span>
                                                                            <span className="font-bold text-red-500 uppercase">Gabarito</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-[10px] border-b pb-1">
                                                                            <span className="text-muted-foreground font-bold uppercase">Reportado:</span>
                                                                            <span className="font-bold uppercase text-foreground">3 Vezes</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Footer: Botões Padrão */}
                                                        <div className="shrink-0 p-4 border-t flex items-center justify-between bg-muted/10">
                                                            <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase text-red-500">
                                                                Rejeitar
                                                            </Button>
                                                            <div className="flex items-center gap-2">
                                                                <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase h-8">
                                                                    Editar
                                                                </Button>
                                                                <Button size="sm" className="text-[10px] font-bold uppercase h-8 bg-primary text-primary-foreground shadow-sm shadow-primary/20">
                                                                    Corrigir
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground/40">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl border-border/40">
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase gap-2">
                                                        <MessageSquare className="w-3.5 h-3.5" /> Responder Aluno
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase gap-2 text-emerald-500">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Resolvido
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-[11px] font-bold uppercase gap-2 text-red-500">
                                                        <AlertCircle className="w-3.5 h-3.5" /> Rejeitar Denúncia
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer de Paginação */}
                    <div className="px-6 py-4 bg-muted/5 border-t border-border/5 flex items-center justify-between">
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase">Mostrando 4 de 124 denúncias</p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-border/40">1</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground/40">2</Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground/40">3</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
