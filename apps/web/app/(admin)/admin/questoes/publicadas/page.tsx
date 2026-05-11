import { AdminQuestionsList } from "../questions-list"
import { getAdminQuestionsListData } from "../question-list-data"

export default async function QuestoesPublicadasPage() {
  const data = await getAdminQuestionsListData("published")

  return (
    <AdminQuestionsList
      questions={data.questions}
      totalPages={data.totalPages}
    />
  )
}
