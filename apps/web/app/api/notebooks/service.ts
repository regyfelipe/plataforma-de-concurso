import { notebookRepository } from "./repository";
import { Prisma } from "@prisma/client";

export class NotebookService {
  /**
   * Retorna a listagem de cadernos formatada para o Admin
   */
  async getAdminList(params: { page?: number; limit?: number; search?: string }) {
    const skip = ((params.page || 1) - 1) * (params.limit || 10);
    const take = params.limit || 10;

    const where: Prisma.CadernoWhereInput = {};

    if (params.search) {
      where.OR = [
        { nome: { contains: params.search, mode: "insensitive" } },
        { descricao: { contains: params.search, mode: "insensitive" } },
      ];
    }

    return notebookRepository.findAll({
      skip,
      take,
      where,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Cria um caderno validando permissões (exemplo simples)
   */
  async createNotebook(data: {
    nome: string;
    descricao?: string;
    disciplinaId?: string;
    concursoId?: string;
    isPublic?: boolean;
    userId: string; // ID do admin criando
  }) {
    // Aqui poderiam entrar validações extras
    return notebookRepository.create({
      nome: data.nome,
      descricao: data.descricao,
      isPublic: data.isPublic ?? true,
      disciplina: data.disciplinaId ? { connect: { id: data.disciplinaId } } : undefined,
      concurso: data.concursoId ? { connect: { id: data.concursoId } } : undefined,
      usuario: { connect: { id: data.userId } },
    });
  }

  /**
   * Adiciona questões a um caderno
   */
  async addQuestionsToNotebook(notebookId: string, questionIds: string[]) {
    // No Prisma, a relação N:N com campos extras (ordem) requer um createMany ou operações manuais
    // Aqui assumimos a tabela de ligação 'questoes' (QuestaoNoCaderno)
    const operations = questionIds.map((id, index) => ({
      cadernoId: notebookId,
      questaoId: id,
      ordem: index,
    }));

    // Usando uma transação para garantir integridade
    // Nota: Dependendo do schema, você pode precisar deletar as antigas primeiro
    return notebookRepository.update(notebookId, {
      questoes: {
        createMany: {
          data: operations,
          skipDuplicates: true,
        },
      },
    });
  }
}

export const notebookService = new NotebookService();
