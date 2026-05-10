"use server";

import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { notebookService } from "@/app/api/notebooks/service";
import { notebookSchema, NotebookInput } from "./notebooks.schema";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = any> = {
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

  if (!session || session.user.role !== "admin") {
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
    const { nome, descricao, disciplinaId, concursoId, isPublic } = validatedFields.data;

    const result = await notebookService.createNotebook({
      nome,
      descricao,
      disciplinaId: disciplinaId || undefined,
      concursoId: concursoId || undefined,
      isPublic,
      userId: session.user.id,
    });

    revalidatePath("/admin/cadernos");
    
    return {
      success: true,
      message: "Caderno criado com sucesso!",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao criar caderno.",
    };
  }
}
