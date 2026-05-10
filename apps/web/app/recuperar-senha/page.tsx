import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function RecuperarSenhaPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden p-6 md:p-10">

      {/* ── Fundo desfocado ── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-muted to-background" />

      {/* Blobs desfocados */}
      <div className="absolute -top-32 -left-32 -z-10 size-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 -z-10 size-[500px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -z-10 size-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px]" />

      {/* Grade sutil */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      <div className="w-full max-w-sm md:max-w-4xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
