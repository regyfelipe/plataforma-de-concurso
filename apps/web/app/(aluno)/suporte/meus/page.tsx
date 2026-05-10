"use client"

import * as React from "react"
import { Plus, Search, Filter, ExternalLink, Clock, CheckCircle2, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@workspace/ui/components/table"
import { MY_TICKETS, type Ticket } from "../../../../data/mocks/suporte"

const STATUS_MAP: Record<Ticket["status"], { label: string; variant: "outline" | "default" | "secondary"; icon: React.ElementType }> = {
    open:    { label: "Aberto",      variant: "outline",   icon: Clock          },
    replied: { label: "Respondido",  variant: "default",   icon: MessageSquare  },
    closed:  { label: "Finalizado",  variant: "secondary", icon: CheckCircle2   },
}

export default function MeusChamadosPage() {
    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Atendimento</p>
                    <h1 className="text-2xl font-semibold tracking-tight">Meus Chamados</h1>
                </div>
                <Link href="/suporte/novo">
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Chamado
                    </Button>
                </Link>
            </div>

            {/* Busca e filtro + Tabela */}
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Buscar por protocolo ou assunto..." className="pl-9" />
                        </div>
                        <Button variant="outline" size="sm">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtrar Status
                        </Button>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Protocolo</TableHead>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Última Atualização</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {MY_TICKETS.map((ticket: Ticket) => {
                                const status = STATUS_MAP[ticket.status]
                                const StatusIcon = status.icon
                                return (
                                    <TableRow key={ticket.id}>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {ticket.protocol}
                                        </TableCell>
                                        <TableCell className="text-sm font-medium max-w-[200px] truncate">
                                            {ticket.subject}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {ticket.category}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={status.variant} className="gap-1.5">
                                                <StatusIcon className="h-3 w-3" />
                                                {status.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(ticket.lastUpdate).toLocaleDateString("pt-BR", {
                                                day: "2-digit", month: "short",
                                                hour: "2-digit", minute: "2-digit",
                                            })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/suporte/meus/${ticket.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <ExternalLink className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
