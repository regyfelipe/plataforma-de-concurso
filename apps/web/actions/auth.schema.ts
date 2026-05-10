import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres")
  .max(72, "A senha é muito longa")
  .regex(/[A-Z]/, "A senha deve conter ao menos uma letra maiúscula")
  .regex(/[a-z]/, "A senha deve conter ao menos uma letra minúscula")
  .regex(/[0-9]/, "A senha deve conter ao menos um número")
  .regex(/[^A-Za-z0-9]/, "A senha deve conter ao menos um caractere especial")

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "O nome deve ter pelo menos 2 caracteres")
      .max(100, "O nome é muito longo"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("E-mail inválido")
      .max(255, "E-mail muito longo"),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido"),

  password: z
    .string()
    .min(1, "A senha é obrigatória")
    .max(72, "Senha inválida"),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido"),
})