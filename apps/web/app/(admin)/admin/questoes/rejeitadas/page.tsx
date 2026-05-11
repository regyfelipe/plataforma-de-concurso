import { AdminQuestionsList } from "../questions-list"
import { getAdminQuestionsListData } from "../question-list-data"

export default async function QuestoesRejeitadasPage() {
  const data = await getAdminQuestionsListData("archived")

  return (
    <AdminQuestionsList
      questions={data.questions}
      totalPages={data.totalPages}
    />
  )
}
