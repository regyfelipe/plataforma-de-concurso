import { AdminQuestionsList } from "../questions-list"
import { getAdminQuestionsListData } from "../question-list-data"

export default async function QuestoesRevisaoPage() {
  const data = await getAdminQuestionsListData("draft")

  return (
    <AdminQuestionsList
      questions={data.questions}
      totalPages={data.totalPages}
    />
  )
}
