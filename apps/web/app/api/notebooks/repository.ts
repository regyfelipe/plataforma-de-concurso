import { prisma } from "@workspace/database";
import { Prisma } from "@prisma/client";

export class NotebookRepository {
  /**
   * Lista cadernos com filtros e paginação
   */
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CadernoWhereInput;
    orderBy?: Prisma.CadernoOrderByWithRelationInput;
  }) {
    const [items, total] = await Promise.all([
      prisma.caderno.findMany({
        ...params,
        include: {
          disciplina: true,
          concurso: true,
          _count: {
            select: { questoes: true },
          },
        },
      }),
      prisma.caderno.count({ where: params.where }),
    ]);

    return { items, total };
  }

  /**
   * Busca um caderno por ID
   */
  async findById(id: string) {
    return prisma.caderno.findUnique({
      where: { id },
      include: {
        disciplina: true,
        concurso: true,
        questoes: {
          include: {
            questao: true,
          },
        },
      },
    });
  }

  /**
   * Cria um novo caderno
   */
  async create(data: Prisma.CadernoCreateInput) {
    return prisma.caderno.create({
      data,
    });
  }

  /**
   * Atualiza um caderno existente
   */
  async update(id: string, data: Prisma.CadernoUpdateInput) {
    return prisma.caderno.update({
      where: { id },
      data,
    });
  }

  /**
   * Deleta um caderno
   */
  async delete(id: string) {
    return prisma.caderno.delete({
      where: { id },
    });
  }
}

export const notebookRepository = new NotebookRepository();
