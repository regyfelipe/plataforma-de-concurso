"use client"

import * as React from "react"
import { Search, ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { Badge } from "@workspace/ui/components/badge"

const FAQ_DATA = [
    {
        category: "Conta e Acesso",
        items: [
            { q: "Como resetar minha senha?", a: "Acesse a tela de login e clique em 'Esqueci minha senha'. Você receberá um e-mail com as instruções." },
            { q: "Posso usar a plataforma em dois dispositivos?", a: "Sim. Sua conta pode ser acessada de qualquer dispositivo. Porém, sessões simultâneas não são permitidas no plano básico." },
        ],
    },
    {
        category: "Questões e Estudo",
        items: [
            { q: "Como funciona a repetição espaçada?", a: "O sistema identifica questões com 2+ erros consecutivos e as coloca em um ciclo de revisão de 7 dias para fixação." },
            { q: "Posso comentar em questões?", a: "Sim, alunos com plano Premium podem comentar e interagir nas questões comentadas." },
            { q: "Como resetar meu progresso?", a: "Acesse Perfil > Configurações > Dados de Estudo e clique em 'Resetar Progresso'. A ação é irreversível." },
        ],
    },
    {
        category: "Financeiro",
        items: [
            { q: "Problemas com pagamento via PIX?", a: "Certifique-se de usar a chave correta. Caso o problema persista, abra um chamado no suporte com o comprovante." },
            { q: "Posso cancelar minha assinatura?", a: "Sim, a qualquer momento em Perfil > Assinatura. O acesso continua até o fim do período pago." },
        ],
    },
]

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = React.useState(false)
    return (
        <div>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-3 text-sm text-left"
            >
                <span className="font-medium pr-4">{q}</span>
                {open
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                }
            </button>
            {open && (
                <p className="text-sm text-muted-foreground pb-3 leading-relaxed">{a}</p>
            )}
        </div>
    )
}

export default function FaqPage() {
    const [search, setSearch] = React.useState("")

    const filtered = FAQ_DATA.map((cat) => ({
        ...cat,
        items: cat.items.filter(
            (item) =>
                item.q.toLowerCase().includes(search.toLowerCase()) ||
                item.a.toLowerCase().includes(search.toLowerCase())
        ),
    })).filter((cat) => cat.items.length > 0)

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">

            {/* Header */}
            <div>
                <p className="text-xs text-muted-foreground mb-1">Central de Ajuda</p>
                <h1 className="text-2xl font-semibold tracking-tight">Perguntas Frequentes</h1>
            </div>

            {/* Busca */}
            <div className="relative max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar dúvidas..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Categorias */}
            <div className="space-y-4">
                {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        Nenhuma dúvida encontrada para "{search}".
                    </p>
                ) : filtered.map((cat) => (
                    <Card key={cat.category}>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                {cat.category}
                                <Badge variant="secondary" className="ml-auto">{cat.items.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="divide-y">
                            {cat.items.map((item, i) => (
                                <FaqItem key={i} q={item.q} a={item.a} />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
