import { questionSchema } from "./schema";
import * as repository from "./repository";

export async function createQuestionService(data: unknown) {
  // 1. Validação com Zod
  const parsedData = questionSchema.parse(data);
  
  // 2. Regras de negócio adicionais
  // Ex: verificar se o subjectId existe, ou manipular anexo
  
  // 3. Persistência
  return await repository.createQuestion(parsedData);
}

export async function listQuestionsService() {
  return await repository.getQuestions();
}
