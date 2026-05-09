"use client"

import * as React from "react"
import { Plus, Search, Filter, ExternalLink, Clock, CheckCircle2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import { Input } from "@workspace/ui/components/input"
import { MY_TICKETS, type Ticket } from "../../../../data/mocks/suporte"

const statusMap: Record<Ticket['status'], { label: string; variant: "outline" | "default" | "secondary"; icon: React.ElementType }> = {
    open: { label: "Aberto", variant: "outline", icon: Clock },
    replied: { label: "Respondido", variant: "default", icon: MessageSquare },
    closed: { label: "Finalizado", variant: "secondary", icon: CheckCircle2 },
}

export default function MeusChamadosPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full">
            
            {/* Header Master */}
            <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Atendimento</p>
                    <h1 className="text-3xl font-black tracking-tighter text-foreground">
                        Meus Chamados
                    </h1>
                </div>

                <Link href="/suporte/novo">
                    <Button className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all gap-2 shadow-sm">
                        <Plus className="w-4 h-4" />
                        Novo Chamado
                    </Button>
                </Link>
            </div>

            {/* Dashboard / Filtros */}
            <div className="bg-card dark:bg-muted/10 border border-border/40 rounded-[2rem] p-8 space-y-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
                        <Input 
                            placeholder="Buscar por protocolo ou assunto..." 
                            className="pl-10 h-11 bg-muted/20 border-border/40 rounded-xl focus-visible:ring-primary/20"
                        />
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-11 rounded-xl border-border/40 gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Filter className="w-4 h-4 text-muted-foreground/40" />
                            Filtrar Status
                        </Button>
                    </div>
                </div>

                {/* Tabela Master */}
                <div className="border border-border/40 rounded-2xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow className="hover:bg-transparent border-border/40">
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Protocolo</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assunto</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoria</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                <TableHead className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Última Atualização</TableHead>
                                <TableHead className="py-4 px-6 text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MY_TICKETS.map((ticket: Ticket) => {
                                const status = statusMap[ticket.status]
                                const StatusIcon = status.icon
                                
                                return (
                                    <TableRow key={ticket.id} className="group border-border/40 hover:bg-muted/10 transition-colors">
                                        <TableCell className="py-5 px-6 font-mono text-[11px] font-bold text-muted-foreground">
                                            {ticket.protocol}
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            <p className="text-xs font-black text-foreground line-clamp-1">{ticket.subject}</p>
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            <span className="text-[10px] font-bold text-muted-foreground/60">{ticket.category}</span>
                                        </TableCell>
                                        <TableCell className="py-5 px-6">
                                            <Badge variant={status.variant} className="gap-1.5 h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                <StatusIcon className="w-3 h-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-5 px-6 text-xs text-muted-foreground">
                                            {new Date(ticket.lastUpdate).toLocaleDateString('pt-BR', {
                                                day: '2-digit',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell className="py-5 px-6 text-right">
                                            <Link href={`/suporte/meus/${ticket.id}`}>
                                                <Button variant="ghost" size="icon" className="rounded-lg hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
