"use client"

import { ArrowUp } from "lucide-react"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Card } from "@workspace/ui/components/card"
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from "@workspace/ui/components/table"

interface RankingTableProps {
    data: any[]
}

export function RankingTable({ data }: RankingTableProps) {
    const tableData = data.slice(3)

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16">Posição</TableHead>
                        <TableHead>Estudante</TableHead>
                        <TableHead className="text-center">Precisão</TableHead>
                        <TableHead className="text-right">Pontuação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((user: any) => (
                        <TableRow
                            key={user.rank}
                            className={user.isCurrentUser ? "bg-primary/5" : ""}
                        >
                            <TableCell>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-sm font-medium">{user.rank}º</span>
                                    {user.trend === "up" && (
                                        <ArrowUp className="h-3 w-3 text-emerald-500" />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className={`text-sm font-medium ${user.isCurrentUser ? "text-primary" : ""}`}>
                                        {user.name} {user.isCurrentUser && "(Você)"}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">
                                {user.precision}%
                            </TableCell>
                            <TableCell className="text-right text-sm font-medium tabular-nums">
                                {user.points.toLocaleString()} pts
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    )
}
