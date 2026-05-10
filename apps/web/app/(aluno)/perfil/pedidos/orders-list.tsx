"use client"

import { useMemo, useState } from "react"
import { Search, ChevronDown, X, Check, Clock } from "lucide-react"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@workspace/ui/components/select"

type StatusPedido = "cancelado" | "pendente" | "processando" | "entregue"

type Order = {
  id: string
  codigo: string
  descricao: string
  valor: number
  status: StatusPedido
  data: string
  itens: number
}

const STATUS_CONFIG: Record<StatusPedido, { label: string; variant: "destructive" | "default" | "secondary" | "outline"; icon: React.ReactNode }> = {
  cancelado: { label: "Cancelado", variant: "destructive", icon: <X className="h-3 w-3" /> },
  pendente: { label: "Pendente", variant: "outline", icon: <Clock className="h-3 w-3" /> },
  processando: { label: "Processando", variant: "secondary", icon: <Clock className="h-3 w-3" /> },
  entregue: { label: "Entregue", variant: "default", icon: <Check className="h-3 w-3" /> },
}

const FILTROS = ["Todos", "Pendentes", "Processando", "Entregues"]

export function OrdersList({ orders }: { orders: Order[] }) {
  const [filtro, setFiltro] = useState("Todos")
  const [busca, setBusca] = useState("")
  const [ordem, setOrdem] = useState("recentes")

  const pedidosFiltrados = useMemo(() => {
    const filtered = orders.filter((p) => {
      const matchBusca = p.codigo.toLowerCase().includes(busca.toLowerCase()) || p.descricao.toLowerCase().includes(busca.toLowerCase())
      const matchFiltro = filtro === "Todos"
        || (filtro === "Pendentes" && p.status === "pendente")
        || (filtro === "Processando" && p.status === "processando")
        || (filtro === "Entregues" && p.status === "entregue")

      return matchBusca && matchFiltro
    })

    return [...filtered].sort((a, b) => {
      if (ordem === "valor") return b.valor - a.valor
      if (ordem === "antigos") return a.data.localeCompare(b.data)
      return b.data.localeCompare(a.data)
    })
  }, [busca, filtro, ordem, orders])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <Button
            key={f}
            variant={filtro === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFiltro(f)}
          >
            {f}
            {f === "Todos" && <Badge variant="secondary" className="ml-2">{orders.length}</Badge>}
          </Button>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por ID ou produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Select value={ordem} onValueChange={(value) => setOrdem(value || "recentes")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recentes">Mais recentes</SelectItem>
            <SelectItem value="antigos">Mais antigos</SelectItem>
            <SelectItem value="valor">Maior valor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {pedidosFiltrados.map((pedido) => {
          const cfg = STATUS_CONFIG[pedido.status]

          return (
            <Card key={pedido.id} className={`border-l-4 ${
              pedido.status === "cancelado" ? "border-l-destructive" :
              pedido.status === "entregue" ? "border-l-green-500" :
              "border-l-border"
            }`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    pedido.status === "cancelado" ? "bg-destructive/10 text-destructive" :
                    pedido.status === "entregue" ? "bg-green-500/10 text-green-600" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">#{pedido.codigo}</span>
                      <Badge variant={cfg.variant} className="text-xs">{cfg.label}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pedido.descricao} - {pedido.data}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {pedido.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </p>
                    <p className="text-xs text-muted-foreground">{pedido.itens} item(ns)</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {pedidosFiltrados.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-2 py-16">
              <p className="font-medium">Nenhum pedido encontrado</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
