import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isPlaceholder } from "@/lib/birthday-utils";

const variants = {
  royal: "bg-navy text-cream hover:brightness-125 shadow-[var(--shadow-lift)]",
  gold: "bg-gold text-navy hover:brightness-105 shadow-[var(--shadow-lift)]",
  paper: "paper hover:-translate-y-0.5",
  ghost: "bg-transparent border-2 border-current hover:bg-cream/10",
};

export function Btn({ variant = "royal", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
    />
  );
}

export function ChapterHead({ n, title, subtitle, tone = "ink" }: { n: string; title: string; subtitle?: string; tone?: "ink" | "cream" }) {
  return (
    <header className="animate-rise text-center">
      <p className={cn("hand text-2xl", tone === "cream" ? "text-gold" : "text-blue")}>Chapter {n}</p>
      <h1 className={cn("text-3xl font-bold leading-tight sm:text-5xl", tone === "cream" ? "text-cream" : "text-navy")}>{title}</h1>
      {subtitle && <p className={cn("mt-2 text-base sm:text-lg", tone === "cream" ? "text-cream/80" : "text-ink/75")}>{subtitle}</p>}
    </header>
  );
}

export function Lily({ className, open = true }: { className?: string; open?: boolean }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <g style={{ transformOrigin: "50px 55px", transition: "transform .6s", transform: open ? "scale(1)" : "scale(.7)" }}>
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d="M50 55 C40 35 44 14 50 6 C56 14 60 35 50 55Z" fill="var(--paper)" stroke="var(--powder)" strokeWidth="1.5" transform={`rotate(${r} 50 55)`} />
        ))}
        <circle cx="50" cy="55" r="5" fill="var(--gold)" />
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <line key={r} x1="50" y1="55" x2="50" y2="44" stroke="var(--gold)" strokeWidth="1.2" transform={`rotate(${r} 50 55)`} />
        ))}
      </g>
    </svg>
  );
}

export function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 1l2.6 7.4H22l-6 4.6 2.3 7.5L12 16l-6.3 4.5L8 13 2 8.4h7.4z" fill="var(--gold)" />
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="var(--gold)" />
    </svg>
  );
}

/** Image that shows a tasteful paper placeholder when missing / still a placeholder. */
export function Photo({ src, alt, label, className }: { src: string; alt: string; label?: string; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (isPlaceholder(src) || broken) {
    return (
      <div className={cn("grid place-items-center bg-powder/60 text-navy/70", className)} role="img" aria-label={alt}>
        <div className="flex flex-col items-center gap-1 p-3 text-center">
          <Lily className="h-10 w-10 opacity-70" />
          <span className="hand text-lg leading-tight">{label ?? "photo coming soon"}</span>
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} className={cn("object-cover", className)} />;
}

export function Stage({ env, children }: { env: "cream" | "scrapbook" | "night"; children: ReactNode }) {
  const cls = env === "cream" ? "env-cream" : env === "scrapbook" ? "env-scrapbook" : "env-night";
  return (
    <main className={cn("relative min-h-dvh overflow-hidden", cls)}>
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center gap-8 px-4 pb-28 pt-20 sm:px-8">{children}</div>
    </main>
  );
}
