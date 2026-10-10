import { useEffect, useRef, useState } from "react";
import { Mail, Mic, X } from "lucide-react";
import { birthday as B, type Photo as PhotoT } from "@/content/birthday";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Btn, ChapterHead, Lily, Photo, Stage } from "./primitives";
import { LilyHeist } from "./LilyHeist";
export { LilyHeist };

type P = { onNext: () => void };

/* 05 ─ Friendship Documentary */
export function Documentary({ onNext }: P) {
  const c = B.documentary;
  const [active, setActive] = useState<PhotoT | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <Stage env="scrapbook">
      <ChapterHead n="05" title={c.title} subtitle={c.subtitle} tone="cream" />
      <div className="relative w-full">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-cream/40 sm:left-0 sm:top-1/2 sm:h-0.5 sm:w-full" />
        <ol className="flex flex-col gap-8 pl-10 sm:snap-x sm:flex-row sm:overflow-x-auto sm:px-2 sm:py-8 sm:pl-2">
          {c.photos.map((p, i) => (
            <li key={p.id} className="relative shrink-0 sm:w-56 sm:snap-center">
              <button
                aria-label={`View photo: ${p.alt}`}
                onClick={() => {
                  setActive(p);
                  sfx("whoosh");
                }}
                className="polaroid relative block w-full max-w-64 transition hover:-translate-y-1"
                style={{ rotate: `${i % 2 ? 2 : -2}deg` }}
              >
                <span className="tape -top-3 left-1/2 -translate-x-1/2" />
                <Photo
                  src={p.image}
                  alt={p.alt}
                  label=""
                  className="aspect-square w-full object-contain"
                />
              </button>
            </li>
          ))}
        </ol>
      </div>
      <Btn variant="gold" onClick={onNext}>{c.button}</Btn>

      {active && (
        <div
          role="dialog"
          aria-modal
          aria-label={active.alt}
          className="fixed inset-0 z-50 grid place-items-center bg-navy/85 p-4 animate-fadein"
          onClick={() => setActive(null)}
        >
          <div
            className="polaroid relative w-full max-w-md animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close photo"
              onClick={() => setActive(null)}
              className="absolute -right-2 -top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-navy text-cream"
            >
              <X className="h-5 w-5" />
            </button>
            <Photo
              src={active.image}
              alt={active.alt}
              className="aspect-square w-full object-contain"
            />
          </div>
        </div>
      )}
    </Stage>
  );
}

/* 07 ─ Birthday Ceremony */
type CState = "idle" | "counting" | "lit" | "out";
export function Ceremony({ onNext }: P) {
  const c = B.ceremony;
  const [state, setState] = useState<CState>("idle");
  const [tick, setTick] = useState(0);
  const [micErr, setMicErr] = useState("");
  const [listening, setListening] = useState(false);
  const stop = useRef<() => void>(() => {});

  useEffect(() => () => stop.current(), []);

  const light = () => {
    setState("counting");
    setTick(0);
    c.countdown.forEach((_, i) =>
      setTimeout(() => {
        setTick(i);
        sfx("boop");
      }, i * 900),
    );
    setTimeout(() => {
      setState("lit");
      sfx("chime");
    }, c.countdown.length * 900);
  };
  const blowOut = () => {
    stop.current();
    setListening(false);
    setState("out");
    sfx("whoosh");
  };
  const useMic = async () => {
    setMicErr("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicErr(c.micDenied);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(an);
      const buf = new Uint8Array(an.frequencyBinCount);
      let raf = 0,
        loud = 0;
      const loop = () => {
        an.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        loud = avg > 55 ? loud + 1 : Math.max(0, loud - 1);
        if (loud > 8) {
          blowOut();
          return;
        }
        raf = requestAnimationFrame(loop);
      };
      stop.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((t) => t.stop());
        void ctx.close();
        stop.current = () => {};
      };
      setListening(true);
      loop();
    } catch {
      setMicErr(c.micDenied);
    }
  };

  const lit = state === "lit";
  return (
    <Stage env="night">
      <ChapterHead n="07" title={c.title} subtitle={c.subtitle} tone="cream" />
      {/* cake */}
      <div className="relative mt-6 flex flex-col items-center">
        <div className="flex gap-6">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="relative flex flex-col items-center">
              <div className="h-8 w-5">
                {lit && (
                  <div className="animate-flicker mx-auto h-8 w-4 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gold shadow-[0_0_24px_var(--gold)]" />
                )}
                {state === "out" && (
                  <div className="mx-auto h-6 w-1 animate-fadein rounded-full bg-cream/40 blur-[2px]" />
                )}
              </div>
              <div
                className="h-14 w-3 rounded-sm"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, var(--cream) 0 5px, var(--powder) 5px 10px)",
                }}
              />
            </div>
          ))}
        </div>
        <div
          className="h-20 w-64 rounded-t-xl border-b-4 border-gold bg-powder sm:w-80"
          style={{
            backgroundImage:
              "radial-gradient(circle at 10px 0, var(--paper) 10px, transparent 11px)",
            backgroundSize: "24px 20px",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div
          className="h-24 w-80 rounded-b-md bg-blue sm:w-96"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12px 0, var(--powder) 12px, transparent 13px)",
            backgroundSize: "28px 22px",
            backgroundRepeat: "repeat-x",
          }}
        />
        <div className="h-3 w-[22rem] rounded-full bg-gold sm:w-[26rem]" />
        <Lily className="absolute -left-12 bottom-0 h-16 w-16" />
        <Lily className="absolute -right-12 bottom-2 h-14 w-14" />
        {lit && (
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-gold/20 blur-3xl" />
        )}
      </div>

      <div className="flex min-h-32 flex-col items-center gap-3 text-center">
        {state === "idle" && (
          <Btn variant="gold" onClick={light}>
            {c.light}
          </Btn>
        )}
        {state === "counting" && (
          <p key={tick} className="animate-pop text-7xl font-bold text-gold" aria-live="assertive">
            {c.countdown[tick]}
          </p>
        )}
        {lit && (
          <>
            <p className="hand text-3xl text-gold">{c.lit}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Btn variant="gold" onClick={useMic} disabled={listening}>
                <Mic className="h-5 w-5" />
                {listening ? "Listening… blow!" : c.micButton}
              </Btn>
              <Btn variant="ghost" className="text-cream" onClick={blowOut}>
                {c.manualButton}
              </Btn>
            </div>
            <p className="max-w-sm text-xs text-cream/60">{c.micExplain}</p>
            {micErr && <p className="text-sm text-gold">{micErr}</p>}
          </>
        )}
        {state === "out" && (
          <div
            className="flex flex-col items-center gap-4 animate-fadein"
            style={{ animationDelay: "1.2s" }}
          >
            <p className="hand text-2xl text-cream/90">{c.out}</p>
            <button
              onClick={onNext}
              className="group flex flex-col items-center gap-2"
              aria-label={c.button}
            >
              <div className="relative grid h-24 w-36 place-items-center rounded-md bg-cream shadow-[var(--shadow-lift)] transition group-hover:-translate-y-1">
                <Mail className="h-10 w-10 text-navy/40" />
                <div className="absolute grid h-10 w-10 place-items-center rounded-full bg-gold text-navy">
                  ♛
                </div>
              </div>
              <span className="text-cream">
                {c.envelopeLabel} <u>{c.button}</u>
              </span>
            </button>
          </div>
        )}
      </div>
    </Stage>
  );
}
