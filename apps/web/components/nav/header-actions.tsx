"use client"

import * as React from "react"
import { Moon, Sun, Palette, LayoutTemplate, Check, Dice5 } from "lucide-react"
import { useTheme } from "next-themes"
import { useLayout } from "@/contexts/layout-context"
import { themes } from "@/registry/themes"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@workspace/ui/components/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@workspace/ui/components/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { cn } from "@workspace/ui/lib/utils"

export function HeaderActions() {
  const { setTheme, theme: currentTheme } = useTheme()
  const { 
    variant, setVariant, 
    collapsible, setCollapsible, 
    side, setSide,
    contentLayout, setContentLayout,
    navbarBehavior, setNavbarBehavior,
    fontSize, setFontSize,
    radius, setRadius,
    primaryColor, setPrimaryColor,
    fontFamily, setFontFamily
  } = useLayout()

  return (
    <div className="flex items-center gap-1">
      
      {/* 1. Theme Toggle (Dark/Light) */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar Tema</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="rounded-xl mt-2 w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">Aparência</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-between">
                Claro <Sun className="h-3.5 w-3.5 opacity-40" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-between">
                Escuro <Moon className="h-3.5 w-3.5 opacity-40" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-between">
                Sistema <span className="text-[8px] opacity-40">AUTO</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 2. Theme Customizer (Palette) */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all group">
                <Palette className="h-[1.2rem] w-[1.2rem] group-hover:scale-110 transition-transform" />
                <span className="sr-only">Customizar Tema</span>
            </Button>
          }
        />
        <SheetContent className="w-[320px] sm:w-[400px] p-0 border-l border-border/40">
          <div className="flex flex-col h-full bg-background">
            <SheetHeader className="p-6 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <Palette className="w-4 h-4 text-primary" />
                    <SheetTitle className="text-xs font-black uppercase tracking-[0.2em]">Customização de Tema</SheetTitle>
                </div>
                <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
                    Ajuste as cores, fontes e formas do seu ambiente.
                </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                
                {/* MODO */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Modo</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setTheme("light")}
                            className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentTheme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40'}`}
                        >
                            <Sun className="w-3.5 h-3.5 mr-2" /> Claro
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => setTheme("dark")}
                            className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentTheme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40'}`}
                        >
                            <Moon className="w-3.5 h-3.5 mr-2" /> Escuro
                        </Button>
                    </div>
                </div>

                {/* SELEÇÃO DE TEMAS COM TABS */}
                <Tabs defaultValue="palettes" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 rounded-xl h-10 p-1 bg-muted/20 border border-border/40">
                        <TabsTrigger value="palettes" className="text-[10px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Paletas</TabsTrigger>
                        <TabsTrigger value="v3" className="text-[10px] font-black uppercase tracking-widest rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">Temas V3</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="palettes" className="mt-6 space-y-4">
                        <div className="flex flex-col gap-1 px-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest">Paletas de Cores</h4>
                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-tight">Altera apenas a cor principal do sistema.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {themes.filter(t => t.type === 'palette').map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setPrimaryColor(t.id)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                                        primaryColor === t.id 
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                            : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                    }`}
                                >
                                    <div 
                                        className="w-full aspect-[2/1] rounded-lg shadow-inner" 
                                        style={{ backgroundColor: t.activeColor }}
                                    />
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${primaryColor === t.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="v3" className="mt-6 space-y-4">
                        <div className="flex flex-col gap-1 px-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">Experiência Completa (V3)</h4>
                            <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-tight">Estes temas alteram cores, superfícies e fundos.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {themes.filter(t => t.type === 'experience').map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setPrimaryColor(t.id)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border transition-all ${
                                        primaryColor === t.id 
                                            ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                            : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                    }`}
                                >
                                    <div 
                                        className="w-full aspect-[2/1] rounded-lg shadow-inner" 
                                        style={{ backgroundColor: t.activeColor }}
                                    />
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${primaryColor === t.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                        {t.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* TAMANHO DA FONTE */}
                <div className="space-y-4">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Tamanho da Fonte</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'sm', label: 'Pequena' },
                            { id: 'base', label: 'Padrão' },
                            { id: 'lg', label: 'Grande' }
                        ].map((opt) => (
                            <Button
                                key={opt.id}
                                variant="outline"
                                onClick={() => setFontSize(opt.id as any)}
                                className={`h-11 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${fontSize === opt.id ? 'border-primary bg-primary/5 text-primary' : 'border-border/40'}`}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* TIPO DE FONTE */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Tipo de Fonte</h4>
                        <span className="text-[9px] font-bold text-primary/50 uppercase tracking-widest">Tipografia</span>
                    </div>
                    <Select value={fontFamily} onValueChange={(val) => setFontFamily(val as any)}>
                        <SelectTrigger 
                            className={cn(
                                "h-12 w-full rounded-xl text-[11px] font-black uppercase tracking-widest border-border/40 focus:ring-primary/20 bg-muted/5 px-4 transition-all hover:bg-muted/10",
                                fontFamily === "quicksand" && "font-[family-name:var(--font-quicksand)]",
                                fontFamily === "inter" && "font-[family-name:var(--font-inter)]",
                                fontFamily === "outfit" && "font-[family-name:var(--font-outfit)]",
                                fontFamily === "roboto" && "font-[family-name:var(--font-roboto)]",
                                fontFamily === "lexend" && "font-[family-name:var(--font-lexend)]",
                                fontFamily === "mono" && "font-[family-name:var(--font-mono)]",
                                fontFamily === "serif" && "font-serif"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center text-primary text-[10px]">Aa</div>
                                <SelectValue placeholder="Selecione uma fonte" />
                            </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border/40 bg-popover/95 backdrop-blur-md p-1 min-w-[280px]">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-2">Sans Serif</DropdownMenuLabel>
                                <SelectItem value="sans" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Moderna (Standard)
                                    </div>
                                </SelectItem>
                                <SelectItem value="inter" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-inter)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Inter (Interface)
                                    </div>
                                </SelectItem>
                                <SelectItem value="roboto" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-roboto)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Roboto (Geométrica)
                                    </div>
                                </SelectItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="opacity-5" />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-2">Display & Rounded</DropdownMenuLabel>
                                <SelectItem value="quicksand" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-quicksand)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40 text-lg">Aa</span> Quicksand (Arredondada)
                                    </div>
                                </SelectItem>
                                <SelectItem value="outfit" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-outfit)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Outfit (Moderna)
                                    </div>
                                </SelectItem>
                                <SelectItem value="lexend" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-lexend)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Lexend (Leitura)
                                    </div>
                                </SelectItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator className="opacity-5" />

                            <DropdownMenuGroup>
                                <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-2">Especiais</DropdownMenuLabel>
                                <SelectItem value="mono" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-[family-name:var(--font-mono)] focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40">Aa</span> Código (Monospace)
                                    </div>
                                </SelectItem>
                                <SelectItem value="serif" className="text-[10px] font-black uppercase tracking-widest cursor-pointer py-3 rounded-lg font-serif focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-3">
                                        <span className="opacity-40 text-lg">Aa</span> Clássica (Serifada)
                                    </div>
                                </SelectItem>
                            </DropdownMenuGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* BORDAS (RADIUS) */}
                <div className="space-y-4 pb-10">
                    <h4 className="text-[11px] font-black uppercase tracking-widest">Bordas (Radius)</h4>
                    <div className="grid grid-cols-5 gap-2">
                        {[0, 0.3, 0.5, 0.75, 1.0].map((r) => (
                            <Button
                                key={r}
                                variant="outline"
                                onClick={() => setRadius(r as any)}
                                className={`h-11 px-0 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${radius === r ? 'border-primary bg-primary/5 text-primary' : 'border-border/40'}`}
                            >
                                {r.toFixed(1)}
                            </Button>
                        ))}
                    </div>
                </div>

            </div>

            <div className="p-6 border-t border-border/10 bg-muted/5 shrink-0">
                <Button 
                    className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/10"
                    onClick={() => {
                        setTheme("system")
                        setFontSize("base")
                        setRadius(0.5)
                        setPrimaryColor("default")
                        setFontFamily("sans")
                    }}
                >
                    Resetar para o Padrão
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 3. Layout Switcher (Sheet) */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-primary/10 hover:text-primary transition-all group">
                <LayoutTemplate className="h-[1.2rem] w-[1.2rem] group-hover:scale-110 transition-transform" />
                <span className="sr-only">Configurar Layout</span>
            </Button>
          }
        />
        <SheetContent className="w-[320px] sm:w-[400px] p-0 border-l border-border/40">
          <div className="flex flex-col h-full bg-background">
            <SheetHeader className="p-6 border-b border-border/10 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <LayoutTemplate className="w-4 h-4 text-primary" />
                    <SheetTitle className="text-xs font-black uppercase tracking-[0.2em]">Configuração de Layout</SheetTitle>
                </div>
                <SheetDescription className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 leading-relaxed">
                    Personalize a experiência de navegação do seu portal.
                </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                
                {/* VARIANTE DA BARRA LATERAL */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Variante da Barra Lateral</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Escolha o estilo visual da barra.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'sidebar', label: 'Padrão' },
                            { id: 'floating', label: 'Flutuante' },
                            { id: 'inset', label: 'Inserida' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setVariant(opt.id as any)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    variant === opt.id 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                        : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                }`}
                            >
                                <div className="w-full aspect-[4/3] rounded bg-muted/20 flex items-center justify-center">
                                    {variant === opt.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${variant === opt.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MODO DE RECOLHIMENTO */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Modo de Recolhimento</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Como a barra se comporta ao fechar.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'offcanvas', label: 'Fora da Tela' },
                            { id: 'icon', label: 'Ícone' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setCollapsible(opt.id as any)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    collapsible === opt.id 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                        : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                }`}
                            >
                                <div className="w-full aspect-video rounded bg-muted/20 flex items-center justify-center">
                                    {collapsible === opt.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${collapsible === opt.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* LAYOUT DO CONTEÚDO */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Layout do Conteúdo</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Como o conteúdo é distribuído na tela.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'full', label: 'Total' },
                            { id: 'centered', label: 'Centralizado' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setContentLayout(opt.id as any)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    contentLayout === opt.id 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                        : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                }`}
                            >
                                <div className="w-full aspect-video rounded bg-muted/20 flex items-center justify-center">
                                    {contentLayout === opt.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${contentLayout === opt.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* COMPORTAMENTO DA BARRA DE NAVEGAÇÃO */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Barra de Navegação</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Posicionamento do menu superior.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'sticky', label: 'Fixo' },
                            { id: 'relative', label: 'Rolar' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setNavbarBehavior(opt.id as any)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    navbarBehavior === opt.id 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                        : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                }`}
                            >
                                <div className="w-full aspect-video rounded bg-muted/20 flex items-center justify-center">
                                    {navbarBehavior === opt.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${navbarBehavior === opt.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* POSIÇÃO DA BARRA LATERAL */}
                <div className="space-y-4 pb-10">
                    <div className="space-y-1">
                        <h4 className="text-[11px] font-black uppercase tracking-widest">Posição da Barra Lateral</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Lado em que a barra será exibida.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'left', label: 'Esquerda' },
                            { id: 'right', label: 'Direita' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSide(opt.id as any)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    side === opt.id 
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                                        : "border-border/40 hover:border-primary/40 hover:bg-muted/5"
                                }`}
                            >
                                <div className="w-full aspect-video rounded bg-muted/20 flex items-center justify-center">
                                    {side === opt.id && <Check className="w-4 h-4 text-primary" />}
                                </div>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${side === opt.id ? "text-primary" : "text-muted-foreground/60"}`}>
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            <div className="p-6 border-t border-border/10 bg-muted/5 shrink-0">
                <Button 
                    className="w-full h-11 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/10"
                    onClick={() => {
                        setVariant("sidebar")
                        setCollapsible("icon")
                        setSide("left")
                        setContentLayout("full")
                        setNavbarBehavior("sticky")
                    }}
                >
                    Resetar para o Padrão
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="w-[1px] h-4 bg-border/40 mx-1" />
    </div>
  )
}
