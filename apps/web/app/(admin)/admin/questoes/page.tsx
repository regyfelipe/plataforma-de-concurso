import { AdminQuestionsList } from "./questions-list"
import { getAdminQuestionsListData } from "./question-list-data"

export default async function AdminQuestionsListPage() {
  const data = await getAdminQuestionsListData()

  return (
    <AdminQuestionsList
      questions={data.questions}
      totalPages={data.totalPages}
    />
  )
}
