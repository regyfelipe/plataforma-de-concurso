"use client"

export function AuthPanel() {
  return (
    <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden select-none">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.08); }
          66% { transform: translate(-15px, 20px) scale(0.95); }
        }
        @keyframes float-med {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, -20px) scale(1.1); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(18px, 25px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.15); opacity: 0.3; }
        }
        .auth-orb-1 { animation: float-slow 9s ease-in-out infinite; }
        .auth-orb-2 { animation: float-med 12s ease-in-out infinite; }
        .auth-orb-3 { animation: float-fast 7s ease-in-out infinite; }
        .auth-ring  { animation: pulse-ring 4s ease-in-out infinite; }
        .auth-text-1 { animation: fade-up 0.9s ease both; animation-delay: 0.1s; opacity: 0; }
        .auth-text-2 { animation: fade-up 0.9s ease both; animation-delay: 0.3s; opacity: 0; }
        .auth-text-3 { animation: fade-up 0.9s ease both; animation-delay: 0.55s; opacity: 0; }
        .auth-dots   { animation: fade-in 1.4s ease both; animation-delay: 0.7s; opacity: 0; }
      `}</style>

      {/* ── Fundo escuro ── */}
      <div className="absolute inset-0" style={{ background: "#080c14" }} />

      {/* ── Orbs animados ── */}
      <div
        className="auth-orb-1 absolute top-[15%] left-[20%] size-56 rounded-full blur-[80px]"
        style={{ background: "rgba(99,102,241,0.22)" }}
      />
      <div
        className="auth-orb-2 absolute bottom-[15%] right-[10%] size-72 rounded-full blur-[100px]"
        style={{ background: "rgba(59,130,246,0.18)" }}
      />
      <div
        className="auth-orb-3 absolute top-[55%] left-[50%] size-40 rounded-full blur-[60px]"
        style={{ background: "rgba(139,92,246,0.15)" }}
      />

      {/* ── Anel central pulsante ── */}
      <div
        className="auth-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-80 rounded-full"
        style={{ border: "1px solid rgba(99,102,241,0.2)" }}
      />
      <div
        className="auth-ring absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[22rem] rounded-full"
        style={{ border: "1px solid rgba(99,102,241,0.1)", animationDelay: "1s" }}
      />

      {/* ── Noise sutil ── */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px"
        }}
      />

      {/* ── Conteúdo minimalista ── */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">

        {/* Ponto / logo minimal */}
        <div className="auth-text-1 flex flex-col items-center gap-3">
          <div className="flex gap-1.5">
            <div className="size-2 rounded-full" style={{ background: "#6366f1" }} />
            <div className="size-2 rounded-full" style={{ background: "#3b82f6" }} />
            <div className="size-2 rounded-full" style={{ background: "#8b5cf6" }} />
          </div>
        </div>

        {/* Headline */}
        <div className="auth-text-2 flex flex-col gap-2">
          <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
            Estude menos.<br />
            <span style={{
              background: "linear-gradient(90deg, #818cf8 0%, #60a5fa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Aprenda mais.
            </span>
          </h2>
        </div>

        {/* Subtítulo */}
        <p className="auth-text-3 text-sm leading-relaxed max-w-[220px]"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          Questões inteligentes, estatísticas precisas e foco total na sua aprovação.
        </p>

        {/* Dots decorativos */}
        <div className="auth-dots flex gap-2 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="size-1.5 rounded-full"
              style={{
                background: i === 0 ? "rgba(99,102,241,0.7)" : "rgba(255,255,255,0.15)"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
