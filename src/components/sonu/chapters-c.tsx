import { useEffect, useRef, useState, type FormEvent } from "react";
import { Camera, Download, KeyRound, RotateCcw } from "lucide-react";
import { birthday as B } from "@/content/birthday";
import { txt } from "@/lib/birthday-utils";
import { sfx } from "@/lib/sound";
import { Btn, Lily, Moon, Stage, Star } from "./primitives";

/* 08 ─ The Letter */
const LETTER_ACCESS_KEY = "sonu-exe-letter-unlocked";
const LETTER_PASSCODE = "0000";

export function Letter({ onNext }: { onNext: () => void }) {
  const c = B.letter;
  const body = txt(c.body, c.bodyFallback);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(LETTER_ACCESS_KEY) === "1");
  }, []);

  const unlockLetter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (passcode !== LETTER_PASSCODE) {
      setPasscode("");
      setPasscodeError("Not quite, Sonu. Try your four-digit birthday code again.");
      return;
    }
    sessionStorage.setItem(LETTER_ACCESS_KEY, "1");
    setPasscodeError("");
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <Stage env="night">
        <section
          className="my-auto flex w-full max-w-md flex-col items-center gap-5 rounded-[2rem] border-2 border-gold/70 bg-paper/95 p-7 text-center text-navy shadow-[var(--shadow-lift)] sm:p-10"
          aria-labelledby="letter-passcode-title"
        >
          <div className="relative grid h-16 w-16 place-items-center rounded-full bg-powder/55">
            <KeyRound className="h-8 w-8 text-blue" aria-hidden />
            <Lily className="absolute -right-4 -top-4 h-8 w-8" />
          </div>
          <p className="font-mono text-xs tracking-[0.28em] text-blue">
            {B.siteTitle} · PRIVATE ROYAL MAIL
          </p>
          <h1 id="letter-passcode-title" className="hand text-4xl font-bold sm:text-5xl">
            One last little secret
          </h1>
          <p className="max-w-sm text-ink/75">
            The birthday letter is just for you. Enter your four-digit royal passcode to read it.
          </p>
          <form className="flex w-full flex-col items-center gap-4" onSubmit={unlockLetter}>
            <label htmlFor="letter-passcode" className="sr-only">
              Four-digit passcode
            </label>
            <input
              id="letter-passcode"
              type="password"
              inputMode="numeric"
              pattern="[0-9]{4}"
              maxLength={4}
              autoComplete="current-password"
              autoFocus
              required
              value={passcode}
              onChange={(event) => {
                setPasscode(event.target.value.replace(/\D/g, "").slice(0, 4));
                setPasscodeError("");
              }}
              aria-invalid={!!passcodeError}
              aria-describedby={passcodeError ? "letter-passcode-error" : undefined}
              className="w-48 rounded-2xl border-2 border-blue/40 bg-white px-5 py-3 text-center font-mono text-3xl tracking-[0.5em] text-navy shadow-inner focus:border-blue focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="••••"
            />
            {passcodeError && (
              <p
                id="letter-passcode-error"
                role="alert"
                className="text-sm font-semibold text-rose-700"
              >
                {passcodeError}
              </p>
            )}
            <Btn type="submit" variant="gold" className="w-full max-w-xs">
              OPEN THE LETTER →
            </Btn>
          </form>
        </section>
      </Stage>
    );
  }

  return (
    <Stage env="night">
      <p className="hand animate-rise text-2xl text-gold">Chapter 08 · The Plot Twist: I Mean It</p>
      <article
        className="paper letterface relative w-full max-w-2xl animate-rise rounded-sm px-6 py-10 sm:px-14 sm:py-14"
        style={{ animationDelay: ".2s" }}
      >
        <Lily className="absolute -left-6 -top-6 h-16 w-16" />
        <Star className="absolute -right-3 top-8 h-6 w-6" />
        <h1 className="text-3xl italic text-navy sm:text-4xl">
          {txt(c.salutation, c.salutationFallback)}
        </h1>
        <div className="mt-6 space-y-5 text-xl leading-relaxed text-ink sm:text-2xl">
          {body.split(/\n\s*\n/).map((para, i) => (
            <p key={i} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
        {txt(c.signature, c.signatureFallback) && (
          <p className="mt-10 text-right text-2xl italic text-navy">
            {txt(c.signature, c.signatureFallback)}
          </p>
        )}
        {txt(c.postscript) && <p className="hand mt-6 text-xl text-blue">P.S. {c.postscript}</p>}
      </article>
      <Btn variant="gold" onClick={onNext}>
        {c.button}
      </Btn>
    </Stage>
  );
}

/* 09 ─ Portrait */
type PState = "intro" | "starting" | "live" | "counting" | "shot" | "unavailable";
export function Portrait({ onReplay }: { onReplay: () => void }) {
  const c = B.portrait;
  const [state, setState] = useState<PState>("intro");
  const [count, setCount] = useState(3);
  const [shot, setShot] = useState("");
  const [caption, setCaption] = useState(c.caption);
  const [flash, setFlash] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);

  const stopCam = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
  };
  useEffect(() => stopCam, []);

  const start = async () => {
    setState("starting");
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unavailable");
      return;
    }
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 720, height: 720 },
      });
      setState("live");
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = stream.current;
          void video.current.play();
        }
      });
    } catch {
      setState("unavailable");
    }
  };
  const snap = () => {
    setState("counting");
    [3, 2, 1].forEach((n, i) =>
      setTimeout(() => {
        setCount(n);
        sfx("boop");
      }, i * 800),
    );
    setTimeout(() => {
      const v = video.current;
      if (!v) return;
      const size = Math.min(v.videoWidth, v.videoHeight) || 720;
      const cv = document.createElement("canvas");
      cv.width = cv.height = size;
      const ctx = cv.getContext("2d")!;
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(
        v,
        (v.videoWidth - size) / 2,
        (v.videoHeight - size) / 2,
        size,
        size,
        0,
        0,
        size,
        size,
      );
      setShot(cv.toDataURL("image/jpeg", 0.92));
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
      sfx("chime");
      stopCam();
      setState("shot");
    }, 2400);
  };
  const download = () => {
    const img = new Image();
    img.onload = () => {
      const s = img.width,
        pad = Math.round(s * 0.06),
        bottom = Math.round(s * 0.24);
      const cv = document.createElement("canvas");
      cv.width = s + pad * 2;
      cv.height = s + pad + bottom;
      const ctx = cv.getContext("2d")!;
      const css = getComputedStyle(document.documentElement);
      ctx.fillStyle = css.getPropertyValue("--paper") || "#fdfaf3";
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.drawImage(img, pad, pad, s, s);
      ctx.fillStyle = css.getPropertyValue("--navy") || "#20365B";
      ctx.font = `${Math.round(s * 0.07)}px Caveat, cursive`;
      ctx.textAlign = "center";
      ctx.fillText(caption, cv.width / 2, s + pad + bottom * 0.6);
      const a = document.createElement("a");
      a.href = cv.toDataURL("image/jpeg", 0.92);
      a.download = "royal-portrait.jpg";
      a.click();
    };
    img.src = shot;
  };

  const done = state === "shot" || state === "unavailable";
  return (
    <Stage env="scrapbook">
      <header className="text-center">
        <p className="hand text-2xl text-gold">Epilogue</p>
        <h1 className="text-3xl font-bold text-cream sm:text-5xl">{c.title}</h1>
        <p className="mt-2 text-cream/85">{c.subtitle}</p>
      </header>

      <div className="polaroid relative w-full max-w-sm rotate-[-1.5deg]">
        <span className="tape -top-3 left-6 -rotate-6" />
        <span className="tape -top-3 right-6 rotate-6" />
        <Moon className="absolute -right-5 -top-5 z-10 h-10 w-10" />
        <Lily className="absolute -bottom-6 -left-6 z-10 h-16 w-16" />
        <div className="relative aspect-square w-full overflow-hidden bg-powder/60">
          {(state === "live" || state === "counting") && (
            <video
              ref={video}
              playsInline
              muted
              className="h-full w-full -scale-x-100 object-cover"
            />
          )}
          {state === "shot" && (
            <img src={shot} alt="Your royal portrait" className="h-full w-full object-cover" />
          )}
          {(state === "intro" || state === "starting" || state === "unavailable") && (
            <div className="grid h-full place-items-center p-6 text-center text-navy">
              <div>
                <span className="text-6xl">♛</span>
                <p className="hand mt-2 text-2xl">
                  {state === "unavailable"
                    ? c.unavailable
                    : state === "starting"
                      ? "Waking the royal camera…"
                      : "Your portrait goes here"}
                </p>
              </div>
            </div>
          )}
          {state === "counting" && (
            <div
              key={count}
              className="absolute inset-0 grid animate-pop place-items-center text-8xl font-bold text-paper drop-shadow-lg"
            >
              {count}
            </div>
          )}
          {flash && <div className="absolute inset-0 animate-flash bg-paper" />}
          <div className="pointer-events-none absolute inset-0 border-[6px] border-gold/60" />
        </div>
        <input
          aria-label="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="hand absolute inset-x-3 bottom-1.5 bg-transparent text-center text-xl text-navy outline-none"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {state === "intro" && (
          <div className="flex max-w-md flex-col items-center gap-3 text-center">
            <p className="text-sm text-cream/90">{c.explain}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Btn variant="gold" onClick={start}>
                <Camera className="h-5 w-5" />
                {c.startButton}
              </Btn>
              <Btn variant="ghost" className="text-cream" onClick={() => setState("unavailable")}>
                {c.skipButton}
              </Btn>
            </div>
          </div>
        )}
        {state === "live" && (
          <Btn variant="gold" onClick={snap}>
            <Camera className="h-5 w-5" />
            {c.capture}
          </Btn>
        )}
        {state === "shot" && (
          <>
            <Btn variant="ghost" className="text-cream" onClick={start}>
              <RotateCcw className="h-5 w-5" />
              {c.retake}
            </Btn>
            <Btn variant="gold" onClick={download}>
              <Download className="h-5 w-5" />
              {c.download}
            </Btn>
          </>
        )}
      </div>

      {done && (
        <section className="mt-4 animate-rise text-center">
          <h2 className="letterface text-4xl italic text-cream sm:text-6xl">{c.finalTitle}</h2>
          <p className="mx-auto mt-3 max-w-md text-cream/85">{txt(c.finalBody, c.finalFallback)}</p>
          <Btn variant="paper" className="mt-6" onClick={onReplay}>
            <RotateCcw className="h-5 w-5" />
            {B.nav.replay}
          </Btn>
        </section>
      )}
    </Stage>
  );
}
