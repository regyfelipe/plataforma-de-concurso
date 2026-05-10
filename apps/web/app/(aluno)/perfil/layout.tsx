"use client"

import { usePathname, useRouter } from "next/navigation"
import { Button } from "@workspace/ui/components/button"
import {
  User, Users, Shield, MapPin, ShoppingBag, HeadphonesIcon
} from "lucide-react"

const TABS = [
  { label: "Perfil", href: "/perfil", icon: User },
  { label: "Comunidade", href: "/perfil/comunidade", icon: Users },
  { label: "Segurança", href: "/perfil/seguranca", icon: Shield },
  { label: "Endereços", href: "/perfil/enderecos", icon: MapPin },
  { label: "Pedidos", href: "/perfil/pedidos", icon: ShoppingBag },
  { label: "Suporte", href: "/perfil/suporte", icon: HeadphonesIcon },
]

export default function PerfilLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const activeTab = TABS.find((t) => pathname === t.href || (t.href !== "/perfil" && pathname.startsWith(t.href)))?.href ?? "/perfil"

  return (
    <div className="flex-1 flex flex-col p-8 pt-6 gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Meu Perfil</h1>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais, endereços, segurança e muito mais.</p>
      </div>

      {/* Tab bar — minimal underline */}
      <div className="flex items-center border-b overflow-hidden">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.href
          const Icon = tab.icon

          return (
            <button
              key={tab.href}
              onClick={() => router.push(tab.href)}
              className={`
          flex-1 flex items-center justify-center gap-1.5
          px-4 py-2.5 text-sm transition-colors
          border-b-2 -mb-px min-w-0 whitespace-nowrap
          ${isActive
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                }
        `}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>

      {children}
    </div>
  )
}
