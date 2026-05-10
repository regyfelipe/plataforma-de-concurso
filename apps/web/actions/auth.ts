"use server";

import { auth } from "@workspace/auth";
import { headers } from "next/headers";
import { signInSchema, signUpSchema, forgotPasswordSchema } from "./auth.schema";
import { z } from "zod";

export type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  redirectTo?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

/**
 * Ação de Cadastro (Sign Up)
 */
export async function signUpAction(values: z.infer<typeof signUpSchema>): Promise<ActionResponse> {
  const validatedFields = signUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Removemos o confirmPassword antes de enviar para o Better Auth
    const { name, email, password } = validatedFields.data;

    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Cadastro realizado com sucesso. Bem-vindo!",
      redirectTo: "/dashboard",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Erro ao realizar cadastro.",
    };
  }
}

/**
 * Ação de Login (Sign In)
 */
export async function signInAction(values: z.infer<typeof signInSchema>): Promise<ActionResponse> {
  const validatedFields = signInSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, password } = validatedFields.data;

    // Nota: No Next.js App Router, o Better Auth gerencia os cookies automaticamente
    // se usarmos o headers() no contexto correto.
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });

    return {
      success: true,
      message: "Login realizado com sucesso!",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "E-mail ou senha incorretos.",
    };
  }
}

/**
 * Ação de Esqueci a Senha
 */
export async function forgotPasswordAction(values: z.infer<typeof forgotPasswordSchema>): Promise<ActionResponse> {
  const validatedFields = forgotPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { email } = validatedFields.data;

    // @ts-ignore - forgetPassword existe no runtime através do plugin email-and-password
    await auth.api.forgetPassword({
      body: {
        email,
        redirectTo: "/auth/reset-password",
      },
    });

    return {
      success: true,
      message: "Se o e-mail existir em nossa base, você receberá um link de recuperação.",
    };
  } catch (error: any) {
    // Por segurança, muitas vezes retornamos sucesso mesmo que o e-mail não exista
    return {
      success: true,
      message: "Se o e-mail existir em nossa base, você receberá um link de recuperação.",
    };
  }
}
