"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"

const chartConfig = {
  correct: {
    label: "Acertos",
    color: "var(--chart-1)",
  },
  wrong: {
    label: "Erros",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface PerformanceEvolutionChartProps {
    timeframe: string
    setTimeframe: (value: string) => void
}

export function PerformanceEvolutionChart({ timeframe, setTimeframe }: PerformanceEvolutionChartProps) {
  // Gerando dados dinâmicos baseados no período
  const chartData = React.useMemo(() => {
    if (timeframe === '90 dias') {
        // 90 dias = 3 meses (Ex: Abril, Maio, Junho)
        const months = ['Abr', 'Mai', 'Jun']
        // Criando pontos intermediários para a linha ficar fluida (10 pontos por mês)
        return Array.from({ length: 30 }).map((_, i) => ({
            label: i % 10 === 0 ? months[Math.floor(i / 10)] : '',
            correct: Math.floor(Math.random() * 200) + 100,
            wrong: Math.floor(Math.random() * 100) + 30,
        }))
    }

    const count = timeframe === '7 dias' ? 7 : 30
    return Array.from({ length: count }).map((_, i) => ({
      label: `${i + 1}`,
      correct: Math.floor(Math.random() * 50) + 20,
      wrong: Math.floor(Math.random() * 30) + 5,
    }))
  }, [timeframe])

  return (
    <Card className="flex flex-col bg-card dark:bg-muted/10 border-border/40 rounded-[2rem] shadow-none h-full border-0">
      <CardHeader className="pb-4 pt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1">Comparativo</p>
            <CardTitle className="text-xl font-black tracking-tight uppercase italic text-foreground">
                Evolução de Desempenho <span className="text-primary not-italic">.</span>
            </CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                Visualizando últimos {timeframe}
            </CardDescription>
        </div>
        
        <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-xl">
            {['7 dias', '30 dias', '90 dias'].map((tab) => (
                <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    onClick={() => setTimeframe(tab)}
                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all h-8 ${
                        timeframe === tab 
                            ? "bg-background text-primary shadow-sm" 
                            : "text-muted-foreground/40 hover:text-primary"
                    }`}
                >
                    {tab}
                </Button>
            ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-video max-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              top: 20,
              bottom: 20
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-[10px] font-bold uppercase text-muted-foreground/40"
              interval={0} // Garante que as labels vazias não quebrem o espaçamento
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="correct"
              type="monotone"
              stroke="var(--color-correct)"
              strokeWidth={3}
              dot={timeframe === '7 dias' ? { r: 4, fill: "var(--color-correct)", strokeWidth: 0 } : false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              dataKey="wrong"
              type="monotone"
              stroke="var(--color-wrong)"
              strokeWidth={3}
              dot={timeframe === '7 dias' ? { r: 4, fill: "var(--color-wrong)", strokeWidth: 0 } : false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pb-8">
        <div className="flex items-center gap-2 text-[11px] font-black leading-none uppercase tracking-widest text-emerald-500">
            Tendência de alta de 5.2% este mês <TrendingUp className="h-3 w-3" />
        </div>
        <div className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/40">
            Exibindo comparativo trimestral (90 dias)
        </div>
      </CardFooter>
    </Card>
  )
}
