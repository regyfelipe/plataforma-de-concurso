import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { RankingPorConcursoClient } from "./ranking-por-concurso-client"
import { getContestRankingData } from "../ranking-data"

export default async function RankingPorConcursoPage() {
    const session = await getSession(await headers())

    if (!session?.user?.id) {
        redirect("/login")
    }

    const data = await getContestRankingData(session.user.id)

    return <RankingPorConcursoClient selectedConcurso={data.selectedConcurso} ranking={data.ranking} />
}
