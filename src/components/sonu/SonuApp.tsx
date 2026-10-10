import { useEffect, useState, type ComponentType } from "react";
import { ChevronLeft, ChevronRight, Music, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { birthday as B } from "@/content/birthday";
import { timeUntil, type TimeLeft } from "@/lib/birthday-utils";
import { isMusicPlaying, pauseMusic, playMusic, setMuted, sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Benefits, Invitation, Security, Welcome } from "./chapters-a";
import { Ceremony, Documentary, LilyHeist } from "./chapters-b";
import { Letter, Portrait } from "./chapters-c";
import { Btn, Lily, Stage } from "./primitives";

const KEY = "sonu-exe-progress";
type Ch = ComponentType<{ onNext: () => void }>;
const CHAPTERS: Ch[] = [
  Invitation,
  Welcome,
  Security,
  Benefits,
  Documentary,
  LilyHeist,
  Ceremony,
  Letter,
];

export function SonuApp() {
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);
  const [gate, setGate] = useState<TimeLeft | null>(null);
  const [peek, setPeek] = useState(false);
  const [muted, setMute] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [noMusic, setNoMusic] = useState(false);

  useEffect(() => {
    const saved = Number(localStorage.getItem(KEY));
    if (saved >= 0 && saved <= CHAPTERS.length) setStep(saved);
    setPeek(localStorage.getItem(KEY + "-peek") === "1");
    setGate(timeUntil(B.birthdayISO));
    setReady(true);
    const t = setInterval(() => setGate(timeUntil(B.birthdayISO)), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem(KEY, String(step));
  }, [step, ready]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);
  // Heartfelt soundtrack after the ceremony (only if user already started music)
  useEffect(() => {
    if (step === 7 && isMusicPlaying())
      void playMusic(B.audio.heartfelt).then((ok) => ok || void playMusic(B.audio.music));
  }, [step]);

  const go = (n: number) => {
    setStep(Math.max(0, Math.min(CHAPTERS.length, n)));
    sfx("whoosh");
  };
  const replay = () => {
    if (
      step > 0 &&
      !window.confirm("Restart from Chapter 01? Your chapter progress will be reset.")
    )
      return;
    localStorage.removeItem(KEY);
    setStep(0);
  };
  const toggleMusic = async () => {
    if (playing) {
      pauseMusic();
      setPlaying(false);
      return;
    }
    const ok = await playMusic(step >= 7 ? B.audio.heartfelt : B.audio.music);
    setPlaying(ok);
    setNoMusic(!ok);
    if (!ok) setTimeout(() => setNoMusic(false), 2500);
  };

  useEffect(() => {
    if (!ready) return;
    let active = true;
    void playMusic(B.audio.music).then((ok) => {
      if (!active) return;
      setPlaying(ok);
      setNoMusic(!ok);
    });
    return () => {
      active = false;
    };
  }, [ready]);

  if (!ready) return <div className="env-cream min-h-dvh" />;

  if (gate && !gate.done && !peek) {
    const c = B.countdown;
    return (
      <Stage env="night">
        <div className="my-auto flex flex-col items-center gap-6 text-center">
          <Lily className="h-20 w-20 animate-float" />
          <p className="font-mono text-sm tracking-[0.3em] text-gold">{B.siteTitle}</p>
          <h1 className="text-3xl font-bold sm:text-5xl">{c.title}</h1>
          <p className="text-cream/80">{c.subtitle}</p>
          <div className="grid grid-cols-4 gap-3">
            {(["days", "hours", "minutes", "seconds"] as const).map((k) => (
              <div
                key={k}
                className="rounded-2xl border-2 border-gold/50 bg-navy/60 px-3 py-4 sm:px-6"
              >
                <p className="text-3xl font-bold tabular-nums text-gold sm:text-5xl">
                  {String(gate[k]).padStart(2, "0")}
                </p>
                <p className="text-xs uppercase tracking-widest text-cream/70">{k}</p>
              </div>
            ))}
          </div>
          {noMusic && (
            <Btn variant="ghost" className="text-cream" onClick={toggleMusic}>
              <Music aria-hidden className="h-4 w-4" /> Play music
            </Btn>
          )}
          <Btn
            variant="ghost"
            className="text-cream"
            onClick={() => {
              localStorage.setItem(KEY + "-peek", "1");
              setPeek(true);
            }}
          >
            {c.peekLabel}
          </Btn>
        </div>
      </Stage>
    );
  }

  const total = CHAPTERS.length + 1;
  const Current = step < CHAPTERS.length ? CHAPTERS[step] : null;
  const dark = step >= 4;

  return (
    <div className="relative">
      {/* top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-2 px-3 py-3 sm:px-5">
        <div
          className={cn(
            "flex min-w-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur",
            dark ? "bg-navy/60 text-cream" : "bg-paper/80 text-navy shadow",
          )}
        >
          <span className="font-mono">{B.siteTitle}</span>
          <span className="hidden truncate opacity-70 sm:inline">· {B.chapters[step]}</span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {[
            {
              label: playing ? "Pause music" : "Play music",
              icon: playing ? Pause : Music,
              on: toggleMusic,
            },
            {
              label: muted ? "Unmute" : "Mute",
              icon: muted ? VolumeX : Volume2,
              on: () => {
                setMuted(!muted);
                setMute(!muted);
              },
            },
            { label: B.nav.replay, icon: RotateCcw, on: replay },
          ].map(({ label, icon: I, on }) => (
            <button
              key={label}
              aria-label={label}
              title={label}
              onClick={on}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full backdrop-blur transition hover:scale-105",
                dark ? "bg-navy/60 text-cream" : "bg-paper/80 text-navy shadow",
              )}
            >
              <I className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
      {noMusic && (
        <div
          role="status"
          className="fixed right-4 top-16 z-50 rounded-xl bg-paper px-4 py-2 text-sm text-navy shadow"
        >
          Autoplay was blocked. Use the music button to start playback.
        </div>
      )}

      <div key={step}>
        {Current ? <Current onNext={() => go(step + 1)} /> : <Portrait onReplay={replay} />}
      </div>

      {/* bottom progress */}
      <nav
        aria-label="Chapter progress"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-3 p-3"
      >
        <div
          className={cn(
            "flex items-center gap-2 rounded-full px-2 py-1.5 backdrop-blur",
            dark ? "bg-navy/60" : "bg-paper/85 shadow",
          )}
        >
          <button
            aria-label={B.nav.back}
            disabled={step === 0}
            onClick={() => go(step - 1)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full disabled:opacity-30",
              dark ? "text-cream" : "text-navy",
            )}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <ol className="flex items-center gap-1.5">
            {Array.from({ length: total }, (_, i) => (
              <li key={i}>
                <button
                  aria-label={`Chapter ${i + 1}: ${B.chapters[i]}`}
                  aria-current={i === step ? "step" : undefined}
                  disabled={i > step}
                  onClick={() => go(i)}
                  className={cn(
                    "block h-2.5 rounded-full transition-all",
                    i === step
                      ? "w-7 bg-gold"
                      : i < step
                        ? "w-2.5 bg-blue"
                        : dark
                          ? "w-2.5 bg-cream/30"
                          : "w-2.5 bg-navy/20",
                  )}
                />
              </li>
            ))}
          </ol>
          <button
            aria-label={B.nav.next}
            disabled={step >= total - 1}
            onClick={() => go(step + 1)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full disabled:opacity-30",
              step === 0
                ? "border border-navy/25 bg-paper/60 text-navy/65 hover:bg-paper"
                : dark
                  ? "text-cream"
                  : "text-navy",
            )}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
