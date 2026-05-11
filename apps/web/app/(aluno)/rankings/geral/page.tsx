import { getSession } from "@workspace/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { RankingGeralClient } from "./ranking-geral-client"
import { getGeneralRankingData } from "../ranking-data"

export default async function RankingGeralPage() {
    const session = await getSession(await headers())

    if (!session?.user?.id) {
        redirect("/login")
    }

    const data = await getGeneralRankingData(session.user.id)

    return <RankingGeralClient rankings={data.rankings} labels={data.labels} />
}
