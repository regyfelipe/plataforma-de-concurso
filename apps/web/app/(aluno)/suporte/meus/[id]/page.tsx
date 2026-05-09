"use client"

import * as React from "react"
import { ChevronLeft, Send, Clock, CheckCircle2, MessageSquare, User, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Textarea } from "@workspace/ui/components/textarea"
import { MY_TICKETS, type Ticket } from "../../../../../data/mocks/suporte"
import { useParams } from "next/navigation"

const statusMap = {
    open: { label: "Aberto", variant: "outline" as const, icon: Clock },
    replied: { label: "Respondido", variant: "default" as const, icon: MessageSquare },
    closed: { label: "Finalizado", variant: "secondary" as const, icon: CheckCircle2 },
}

export default function TicketDetailPage() {
    const params = useParams()
    const ticketId = params.id as string
    
    const ticket = MY_TICKETS.find(t => t.id === ticketId)

    if (!ticket) {
        return <div className="p-8 text-center text-muted-foreground">Chamado não encontrado.</div>
    }

    const status = statusMap[ticket.status]
    const StatusIcon = status.icon

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 bg-background min-h-[100vh] rounded-xl md:min-h-min mx-auto w-full max-w-5xl">
            
            {/* Header com Navegação */}
            <div className="flex flex-col gap-6">
                <Link href="/suporte/meus" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors w-fit">
                    <ChevronLeft className="w-4 h-4" />
                    Voltar para Meus Chamados
                </Link>

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <p className="font-mono text-[11px] font-bold text-muted-foreground/60">{ticket.protocol}</p>
                            <Badge variant={status.variant} className="gap-1.5 h-6 px-2 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                            </Badge>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter text-foreground leading-tight max-w-2xl">
                            {ticket.subject}
                        </h1>
                        <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{ticket.category}</p>
                    </div>
                </div>
            </div>

            {/* Thread de Conversa */}
            <div className="space-y-8 py-8 border-y border-border/20">
                {ticket.messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                            msg.sender === 'user' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        }`}>
                            {msg.sender === 'user' ? <User className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                        </div>

                        {/* Balão */}
                        <div className={`flex flex-col gap-2 max-w-[80%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                                    {msg.sender === 'user' ? 'Você' : 'Suporte Master'}
                                </span>
                                <span className="text-[9px] font-medium text-muted-foreground/60">
                                    {new Date(msg.createdAt).toLocaleDateString('pt-BR', {
                                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                    })}
                                </span>
                            </div>

                            <div className={`p-6 rounded-[2rem] text-sm leading-relaxed ${
                                msg.sender === 'user' 
                                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                                : 'bg-card border border-border/40 text-foreground rounded-tl-none shadow-sm'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Campo de Resposta (Apenas se não estiver finalizado) */}
            {ticket.status !== 'closed' && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Sua Resposta</span>
                    </div>
                    <div className="relative">
                        <Textarea 
                            placeholder="Digite sua mensagem aqui..." 
                            className="bg-muted/10 border-border/40 rounded-[2rem] p-8 min-h-[150px] resize-none focus-visible:ring-primary/20"
                        />
                        <div className="absolute bottom-4 right-4">
                            <Button className="rounded-xl bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest px-8 h-11 hover:opacity-90 transition-all gap-2 shadow-lg">
                                <Send className="w-4 h-4" />
                                Enviar Resposta
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
