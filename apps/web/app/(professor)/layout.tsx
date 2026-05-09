import { AppSidebar } from "@/components/sidebar/sidebar-left"
import { AppSidebarRight } from "@/components/sidebar/sidebar-right"
import { SidebarTriggerRight } from "@/components/sidebar/sidebar-trigger-right"
import { RightSidebarProvider } from "@/contexts/right-sidebar-context"
import { DynamicBreadcrumb } from "@/components/nav/dynamic-breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <RightSidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DynamicBreadcrumb />
            <SidebarTriggerRight />
          </header>
          
          <main className="flex flex-1 flex-col overflow-auto">
            {children}
          </main>
        </SidebarInset>
        <AppSidebarRight />
      </RightSidebarProvider>
    </SidebarProvider>
  )
}
