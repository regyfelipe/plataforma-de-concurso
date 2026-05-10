"use client"

import { ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardDescription } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"

interface StatCardProps {
    title: string
    value: string
    subtitle?: string
    icon: any
    trend?: string
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {title}
                </CardDescription>
                {trend && (
                    <Badge variant="secondary" className="text-emerald-600 dark:text-emerald-400 gap-1">
                        <ArrowUpRight className="h-3 w-3" />
                        {trend}
                    </Badge>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-semibold">{value}</span>
                    {subtitle && (
                        <span className="text-sm text-muted-foreground">{subtitle}</span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
