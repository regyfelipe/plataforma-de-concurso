"use client"

import { AppSidebar } from "@/components/sidebar/sidebar-left"
import { AppSidebarRight } from "@/components/sidebar/sidebar-right"
import { SidebarTriggerRight } from "@/components/sidebar/sidebar-trigger-right"
import { RightSidebarProvider } from "@/contexts/right-sidebar-context"
import { LayoutProvider, useLayout } from "@/contexts/layout-context"
import { DynamicBreadcrumb } from "@/components/nav/dynamic-breadcrumb"
import { HeaderActions } from "@/components/nav/header-actions"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { cn } from "@workspace/ui/lib/utils"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { variant, collapsible, side, contentLayout, navbarBehavior } = useLayout()

  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <AppSidebar
          showAdmin
          variant={variant === "inset" ? "inset" : variant === "floating" ? "floating" : "sidebar"}
          collapsible={collapsible}
          side={side}
        />
        <SidebarInset>
          <header className={cn(
              "flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background transition-all duration-300",
              navbarBehavior === "sticky" ? "sticky top-0 z-40" : "relative"
          )}>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DynamicBreadcrumb />

            <div className="ml-auto flex items-center gap-1">
                <HeaderActions />
                <SidebarTriggerRight />
            </div>
          </header>

          <main className={cn(
              "flex flex-1 flex-col overflow-auto transition-all duration-500",
              contentLayout === "centered" ? "max-w-7xl mx-auto w-full px-4" : "w-full"
          )}>
            {children}
          </main>
        </SidebarInset>
        <AppSidebarRight />
      </RightSidebarProvider>
    </SidebarProvider>
  )
}

export function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </LayoutProvider>
  )
}
