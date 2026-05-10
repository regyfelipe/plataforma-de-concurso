"use server";

import { auth } from "@workspace/auth";
import { prisma } from "@workspace/database";
import { headers } from "next/headers";
import { notebookService } from "@/app/api/notebooks/service";
import { notebookSchema, NotebookInput } from "./notebooks.schema";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

/**
 * Ação para criar um novo caderno (Admin)
 */
export async function createNotebookAction(values: NotebookInput): Promise<ActionResponse> {
  // 1. Verificar Autenticação e Permissão
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Faça login para criar cadernos oficiais.",
    };
  }

  const user = await prisma.usuario.findUnique({
    where: { id: session.user.id },
    select: { perfil: true },
  });

  if (user?.perfil !== "admin") {
    return {
      success: false,
      message: "Acesso negado. Apenas administradores podem criar cadernos oficiais.",
    };
  }

  // 2. Validar Dados
  const validatedFields = notebookSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const {
      nome,
      descricao,
      carreiraId,
      disciplinaId,
      concursoId,
      dificuldadeId,
      anoReferencia,
      isPublic,
    } = validatedFields.data;

    const result = await notebookService.createNotebook({
      nome,
      descricao,
      carreiraId: carreiraId || undefined,
      disciplinaId: disciplinaId || undefined,
      concursoId: concursoId || undefined,
      dificuldadeId: dificuldadeId || undefined,
      anoReferencia: anoReferencia ?? undefined,
      isPublic,
      userId: session.user.id,
    });

    revalidatePath("/admin/cadernos");
    
    return {
      success: true,
      message: "Caderno criado com sucesso!",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao criar caderno.",
    };
  }
}
