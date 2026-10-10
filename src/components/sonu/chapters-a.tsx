import { useEffect, useRef, useState } from "react";
import { Crown, Fingerprint, ShieldCheck, Sparkles } from "lucide-react";
import { birthday as B } from "@/content/birthday";
import { txt } from "@/lib/birthday-utils";
import { sfx } from "@/lib/sound";
import { cn } from "@/lib/utils";
import { Btn, ChapterHead, Lily, Stage, Star } from "./primitives";

type P = { onNext: () => void };

/* 01 ─ Secret Invitation */
export function Invitation({ onNext }: P) {
  const [open, setOpen] = useState(false);
  const c = B.invitation;
  return (
    <Stage env="cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <img src="/assets/photos/flower1.png" alt="" className="absolute left-4 top-[44%] h-16 w-16 -rotate-12 object-contain opacity-90 sm:left-[calc(50%_-_19rem)] sm:h-24 sm:w-24" />
        <img src="/assets/photos/jellyfish.png" alt="" className="absolute right-4 top-[50%] h-20 w-16 rotate-6 object-contain opacity-90 sm:right-[calc(50%_-_19rem)] sm:h-28 sm:w-24" />
      </div>
      <div className="relative z-10">
        <ChapterHead n="01" title={c.title} subtitle={c.subtitle} />
      </div>
      <button
        aria-label={open ? "Envelope opened" : "Open the envelope"}
        aria-expanded={open}
        onClick={() => { if (!open) { setOpen(true); sfx("fanfare"); } }}
        className={cn("invitation-envelope relative z-10 mt-24 h-56 w-80 sm:w-96", open && "env-open")}
      >
        {/* letter */}
        <div className="env-letter paper absolute inset-x-4 top-4 z-10 h-[min(32rem,calc(100dvh-19rem))] rounded-md p-4 text-left sm:p-5">
          <div className="h-full overflow-y-auto pr-1">
            <p className="hand text-2xl font-bold uppercase text-blue">{c.letterHeading}</p>
            <div className="mt-2 space-y-2 text-xs leading-relaxed sm:text-sm">
              {txt(c.letterBody, c.letterFallback).split("\n\n").map((paragraph, index) => (
                <p key={paragraph} className={cn((index === 0 || index === 9) && "italic", index === 8 && "font-bold")}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
        {/* body */}
        <div className="invitation-envelope-body absolute inset-0 z-20 rounded-md bg-powder" style={{ clipPath: "polygon(0 0, 50% 55%, 100% 0, 100% 100%, 0 100%)" }} />
        <div className="env-flap absolute inset-x-0 top-0 z-30 h-32 bg-blue" style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }} />
        {!open && <img src="/assets/photos/seal.png" alt="" className="absolute left-1/2 top-24 z-40 h-14 w-14 -translate-x-1/2 object-contain drop-shadow-md" />}
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap text-center">
          <p className="hand text-xl leading-none text-navy">For Sonu ♡</p>
          <p className="mt-1 text-[0.5rem] font-semibold tracking-[0.16em] text-navy/65">ROYAL MAIL · STRICTLY PERSONAL</p>
        </div>
        <img src="/assets/photos/envelope-stamp.jpg" alt="" className="absolute bottom-3 right-3 z-30 h-14 w-14 rotate-6 object-contain drop-shadow-sm" />
        <Lily className="absolute -left-6 bottom-0 z-30 h-16 w-16 -rotate-12" />
      </button>
      {!open && <p className="relative z-10 -mt-5 text-center text-xs tracking-wide text-ink/60">tap to open · your royal summons awaits</p>}
      {open && <Btn className="relative z-10 mt-8 animate-rise" onClick={onNext}>{c.button}</Btn>}
    </Stage>
  );
}

/* 02 ─ Welcome, Your Majesty */
export function Welcome({ onNext }: P) {
  const c = B.welcome;
  const dancerPositions = [
    "left-0 top-[14%] h-28 w-24 sm:left-[1%] sm:top-[14%] sm:h-44 sm:w-40",
    "right-0 top-[14%] h-28 w-24 sm:right-[1%] sm:top-[14%] sm:h-44 sm:w-40",
    "bottom-[5%] left-0 h-28 w-24 sm:bottom-[5%] sm:left-[2%] sm:h-44 sm:w-40",
    "bottom-[5%] right-0 h-28 w-24 sm:bottom-[5%] sm:right-[2%] sm:h-44 sm:w-40",
    "left-[12%] top-[40%] h-24 w-20 sm:left-[12%] sm:top-[38%] sm:h-36 sm:w-32",
    "right-[12%] top-[40%] h-24 w-20 sm:right-[12%] sm:top-[38%] sm:h-36 sm:w-32",
    "left-[1%] bottom-[26%] h-24 w-20 sm:left-[20%] sm:bottom-[5%] sm:h-32 sm:w-28",
    "right-[1%] bottom-[26%] h-24 w-20 sm:right-[20%] sm:bottom-[5%] sm:h-32 sm:w-28",
  ];
  return (
    <main className="relative min-h-dvh overflow-hidden env-cream">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {[{ side: "left", rotation: "35deg" }, { side: "right", rotation: "-35deg" }].map(({ side, rotation }) => (
          <div key={side} className={`party-popper party-popper-${side}`}>
            {Array.from({ length: 10 }, (_, index) => <span key={index} className="party-confetti" />)}
            <span className="party-popper-cone" style={{ transform: `rotate(${rotation})` }} />
          </div>
        ))}
      </div>
      <div className="relative z-10 mx-auto flex min-h-dvh max-w-none flex-col items-center gap-2 px-4 pb-20 pt-16 sm:px-8 sm:pb-20 sm:pt-16">
      <ChapterHead n="02" title={c.title} subtitle={c.subtitle} />
      <section className="relative flex h-[min(27rem,calc(100dvh-23rem))] min-h-[23rem] w-full max-w-none flex-col items-center justify-center px-1 py-2 text-center max-sm:h-auto max-sm:min-h-[34rem]">
        <svg aria-hidden="true" viewBox="0 0 1000 80" preserveAspectRatio="none" className="pointer-events-none absolute left-[7%] top-0 h-10 w-[86%] overflow-visible sm:h-12">
          <path d="M0 4 Q125 42 250 14 T500 14 T750 14 T1000 4" fill="none" stroke="var(--navy)" strokeOpacity=".35" strokeWidth="2" />
          {[80, 180, 280, 380, 500, 620, 720, 820, 920].map((x, index) => (
            <g key={x} transform={`translate(${x} ${index % 2 === 0 ? 20 : 25})`}>
              <path d="M0 -8v5" stroke="var(--navy)" strokeOpacity=".45" strokeWidth="2" />
              <path d="M-6 -3h12l-2 11h-8z" fill={index % 2 === 0 ? "var(--gold)" : "var(--blue)"} stroke="var(--navy)" strokeOpacity=".35" />
              <path d="M-4 0h8" stroke="var(--paper)" strokeOpacity=".8" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {c.dancers.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" className={cn("absolute object-contain", dancerPositions[index])} />
          ))}
        </div>
        <div className="paper relative z-10 flex max-w-[min(100%,36rem)] flex-col items-center rounded-2xl bg-cream/90 px-3 py-2 sm:px-5">
          <div className="mb-1 grid h-9 w-9 place-items-center rounded-full border-2 border-gold bg-blue text-gold shadow-md">
            <Crown className="h-6 w-6" aria-hidden="true" />
          </div>
          <img src={c.sticker} alt="Sonu's birthday queen sticker" className="h-24 w-24 object-contain sm:h-28 sm:w-28" />
          <p className="hand -mt-1 text-base text-blue sm:text-lg">{c.stickerCaption}</p>
          <h2 className="mt-1 text-xl font-bold leading-tight text-navy sm:text-3xl">{c.announcement}</h2>
          <p className="mt-1 max-w-lg text-xs leading-relaxed text-ink/80 sm:text-sm">{c.message}</p>
          <div className="royal-chaos-ticker mt-2 w-full max-w-lg overflow-hidden border-y border-navy/20 py-1.5 text-[0.65rem] font-semibold tracking-wide text-navy sm:text-xs" aria-label={c.ticker}>
            <div className="royal-chaos-ticker-track" aria-hidden="true">
              <span>{c.ticker}&nbsp;</span><span>{c.ticker}&nbsp;</span>
            </div>
          </div>
          <p className="mt-2 text-[0.7rem] italic text-ink/70 sm:text-xs">{c.closing}</p>
        </div>
      </section>
      <Btn className="relative z-10" onClick={onNext}>{c.button}</Btn>
      </div>
    </main>
  );
}

/* 03 ─ Security Is a Joke */
export function Security({ onNext }: P) {
  const c = B.security;
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [finalQuestion, setFinalQuestion] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [continueReady, setContinueReady] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [verdict, setVerdict] = useState<"" | "yes" | "no">("");
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState<{ left: number; top: number } | null>(null);
  const [privilegesFlash, setPrivilegesFlash] = useState(false);
  const [peeling, setPeeling] = useState(false);
  const area = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const answerQuestion = (answerIndex: number) => {
    if (selected !== null) return;
    setSelected(answerIndex);
    setShowStamp(true);
    setContinueReady(false);
    sfx("boop");
    const linger = activeQuestion === 0 && answerIndex === 2 ? 1500 : 0;
    if (linger === 0) setContinueReady(true);
    else timer.current = setTimeout(() => setContinueReady(true), linger);
  };

  const continueQuestion = () => {
    if (!continueReady) return;
    setShowStamp(false);
    setSelected(null);
    setContinueReady(false);
    if (activeQuestion === 0) setActiveQuestion(1);
    else setFinalQuestion(true);
  };

  const setClearance = (answer: "yes" | "no") => {
    setVerdict(answer);
    setPrivilegesFlash(true);
    sfx("stamp");
    timer.current = setTimeout(() => setPrivilegesFlash(false), 2600);
  };

  const dodgeNo = (button: HTMLButtonElement, pointerX: number, pointerY: number) => {
    if (!area.current) return;
    const bounds = button.getBoundingClientRect();
    const margin = 16;
    const minLeft = margin;
    const maxLeft = Math.max(minLeft, window.innerWidth - bounds.width - margin);
    const minTop = 76;
    const maxTop = Math.max(minTop, window.innerHeight - bounds.height - 90);
    let destination = { left: minLeft, top: minTop };
    for (let attempt = 0; attempt < 20; attempt += 1) {
      destination = {
        left: minLeft + Math.random() * (maxLeft - minLeft),
        top: minTop + Math.random() * (maxTop - minTop),
      };
      const avoidsPointer =
        pointerX < destination.left - 40 ||
        pointerX > destination.left + bounds.width + 40 ||
        pointerY < destination.top - 40 ||
        pointerY > destination.top + bounds.height + 40;
      const movedEnough =
        Math.abs(destination.left - bounds.left) > 100 ||
        Math.abs(destination.top - bounds.top) > 60;
      if (avoidsPointer && movedEnough) break;
    }
    setNoAttempts((attempts) => attempts + 1);
    setNoPosition(destination);
    sfx("boop");
  };

  const beginPeel = () => {
    setPeeling(true);
    timer.current = setTimeout(onNext, 750);
  };

  return (
    <Stage env="cream">
      <ChapterHead n="03" title={c.title} subtitle={c.subtitle} />
      <section className={cn("security-paper paper relative w-full max-w-3xl rounded-2xl p-5 sm:p-8", peeling && "security-peel")}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-2 top-16 rotate-6 text-navy/70">
          <svg viewBox="0 0 72 92" className="h-20 w-16 sm:h-24 sm:w-20">
            <path d="M18 35c0-10 6-17 18-17s18 7 18 17v11l8 16H10l8-16z" fill="var(--powder)" stroke="var(--navy)" strokeWidth="2" />
            <circle cx="29" cy="38" r="2" fill="var(--navy)" /><circle cx="43" cy="38" r="2" fill="var(--navy)" />
            <path d="M31 47q5 5 10 0M22 64v15m28-15v15M14 79h44" fill="none" stroke="var(--navy)" strokeLinecap="round" strokeWidth="2" />
            <path d="m14 28 7 3m37-3-7 3" stroke="var(--navy)" strokeWidth="2" />
            <text x="36" y="88" fill="var(--navy)" fontSize="7" fontWeight="bold" textAnchor="middle">GUARD?</text>
          </svg>
        </div>
        <div className="relative z-10 flex items-center justify-between gap-4 border-b-2 border-dashed border-navy/20 pb-3 pr-12 text-navy sm:pr-16">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.14em] text-blue sm:text-sm">{privilegesFlash ? c.birthdayPrivileges : c.backgroundCheck}</p>
            <div className="mt-2 h-2 w-full max-w-64 overflow-hidden rounded-full bg-navy/10">
              <div className={cn("h-full rounded-full bg-blue transition-all duration-700", verdict && privilegesFlash ? "w-full" : "w-0")} />
            </div>
          </div>
          <Fingerprint className="h-10 w-10 shrink-0 text-blue/60" />
        </div>
        {!finalQuestion && !verdict && (
          <div className="relative z-10 mt-4 max-w-2xl">
            <div className="space-y-2 text-sm leading-relaxed text-ink/85">
              {c.intro.split("\n\n").map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-4 border-t-2 border-dashed border-navy/20 pt-4">
              <p className="stamp w-fit -rotate-2 text-[0.6rem] text-blue">{c.questions[activeQuestion]!.label}</p>
              <p className="mt-3 font-semibold text-navy">{c.questions[activeQuestion]!.prompt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.questions[activeQuestion]!.answers.map((answer, index) => (
                  <button key={answer.label} disabled={selected !== null} onClick={() => answerQuestion(index)}
                    className="rounded-full border-2 border-blue/50 px-4 py-2 text-sm font-medium text-navy transition hover:bg-powder disabled:opacity-60">
                    {answer.label}
                  </button>
                ))}
              </div>
              {selected !== null && (
                <div className="relative mt-4 min-h-24 rounded-xl bg-powder/40 p-4">
                  <p className="animate-fadein whitespace-pre-line text-sm leading-relaxed text-navy">{c.questions[activeQuestion]!.answers[selected]!.response}</p>
                  {showStamp && <div className="security-protest-stamp stamp absolute -right-1 -top-3 rotate-6 bg-paper px-2 py-1 text-xs text-blue">{c.approved}</div>}
                </div>
              )}
              {selected !== null && (
                <Btn className="mt-4" disabled={!continueReady} onClick={continueQuestion}>
                  {activeQuestion === 0 ? "Next question →" : "Proceed to final statement →"}
                </Btn>
              )}
            </div>
          </div>
        )}
        {finalQuestion && !verdict && (
          <div className="relative z-10 mt-5 border-t-2 border-dashed border-navy/20 pt-5">
            <p className="stamp w-fit -rotate-2 text-[0.6rem] text-blue">QUESTION 03 — FINAL LEGAL REQUIREMENT</p>
            <h2 className="mt-4 text-xl font-bold text-navy">{c.finalPrompt}</h2>
            <p className="mt-2 font-semibold text-navy">{c.finalQuestion}</p>
            <p className="mt-1 text-xs italic text-ink/65">{c.percentageNote}</p>
            <div ref={area} className="relative mt-4 flex min-h-24 flex-wrap items-center justify-center gap-4 overflow-hidden px-2">
              <Btn onClick={() => setClearance("yes")}>{c.yes}</Btn>
              <span className="relative inline-flex h-12 w-32 shrink-0 items-center justify-center">
                <Btn
                  variant="paper"
                  className="relative whitespace-nowrap transition-[left,top] duration-200"
                  style={noPosition ? { position: "fixed", left: noPosition.left, top: noPosition.top, zIndex: 60 } : undefined}
                  onPointerEnter={(event) => { if (event.pointerType === "mouse") dodgeNo(event.currentTarget, event.clientX, event.clientY); }}
                  onClick={(event) => {
                    if (window.matchMedia("(pointer: coarse)").matches) setClearance("no");
                    else dodgeNo(event.currentTarget, event.clientX, event.clientY);
                  }}
                >
                  {c.no}
                </Btn>
              </span>
            </div>
            {noAttempts > 0 && <p aria-live="polite" className="mx-auto mt-2 max-w-md whitespace-pre-line text-sm italic text-blue">{c.noTaunts[Math.min(noAttempts - 1, c.noTaunts.length - 1)]}</p>}
            <p className="mt-1 text-xs text-ink/65">The king remembers everything. Especially this.</p>
          </div>
        )}
        {verdict && (
          <div className="relative z-10 mt-5 animate-rise border-t-2 border-dashed border-navy/20 pt-5 text-center">
            <div className="relative mx-auto grid h-12 w-12 place-items-center text-gold">
              <Crown className="h-8 w-8" />
              <span className="absolute -bottom-2 text-xs font-bold text-navy">SONU</span>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-navy">{verdict === "yes" ? c.yesResponse : c.noResponse}</p>
            <img
              src="/assets/photos/hbd.jpg"
              alt="Birthday cats celebrating with a Happy Birthday sign"
              className="mx-auto mt-4 h-36 w-56 rounded-2xl border-4 border-paper object-cover object-[center_38%] shadow-[var(--shadow-paper)] sm:h-44 sm:w-72"
            />
            <div className="security-protest-stamp animate-stamp stamp mx-auto mt-4 w-fit max-w-full rotate-2 bg-paper px-3 py-2 text-sm text-blue sm:text-base">{c.approved}</div>
            <div className="relative mt-7 rounded-xl border-2 border-dashed border-blue/40 bg-powder/40 p-4 text-left">
              <div className="security-protest-stamp pointer-events-none absolute -right-2 -top-4 rotate-12 stamp bg-paper text-[0.6rem] text-blue">{c.accessGranted}</div>
              <h2 className="text-center text-lg font-bold text-navy">VERIFICATION COMPLETE.</h2>
              <ul className="mt-3 grid gap-1 text-xs text-ink/80 sm:grid-cols-2 sm:text-sm">
                {c.clearance.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <Btn className="mt-5 cursor-pointer font-extrabold tracking-wide" onClick={beginPeel}>{c.button}</Btn>
            <p className="mt-2 text-xs italic text-ink/60">{c.footer}</p>
          </div>
        )}
        <div className="pointer-events-none absolute -right-3 -top-4 rotate-12 stamp bg-paper text-xs text-navy">OFFICIAL</div>
      </section>
    </Stage>
  );
}

/* 04 ─ The Benefits of Knowing Me */
const icons = { heart: Sparkles, tv: Sparkles, crown: Crown, sparkles: Sparkles };
export function Benefits({ onNext }: P) {
  const c = B.benefits;
  const [flipped, setFlipped] = useState<number[]>([]);
  const toggle = (i: number) => { setFlipped((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i])); sfx("whoosh"); };
  return (
    <Stage env="cream">
      <ChapterHead n="04" title={c.title} subtitle={c.subtitle} />
      <p className="max-w-3xl text-center text-xs italic leading-relaxed text-ink/65 sm:text-sm">{c.disclaimer}</p>
      <h2 className="text-center text-sm font-bold tracking-[0.16em] text-blue sm:text-base">{c.numbersHeading}</h2>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
        {c.stats.map((s, i) => (
          <div key={i} className="paper rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-blue sm:text-4xl">{txt(s.value, s.fallback)}</p>
            <p className="mt-1 text-sm text-ink/75">{s.label}</p>
            {s.note && <p className="hand mt-1 text-base text-navy">{s.note}</p>}
          </div>
        ))}
      </div>
      <div className="grid w-full gap-5 sm:grid-cols-3">
        {c.cards.map((card, i) => {
          const Icon = icons[card.icon];
          return (
            <button key={card.title} onClick={() => toggle(i)} aria-pressed={flipped.includes(i)} aria-label={`${card.title}: ${flipped.includes(i) ? "show card front" : "tap to reveal details"}`} className={cn("flip h-[25rem] text-left sm:h-[29rem]", flipped.includes(i) && "is-flipped")}>
              <div className="flip-inner h-full">
                <div className="flip-face paper flex h-full flex-col justify-between rounded-2xl p-5">
                  <Icon className="h-8 w-8 text-blue" />
                  <div>
                    <p className="stamp mb-2 w-fit -rotate-2 text-[0.55rem] text-blue">CARD 0{i + 1}</p>
                    <h2 className="text-xl font-bold text-navy">{card.title}</h2>
                    <p className="hand mt-1 text-lg text-blue">{card.front}</p>
                  </div>
                  <span className="stamp w-fit -rotate-6 text-xs text-gold">{card.stat}</span>
                </div>
                <div className="flip-face flip-back overflow-y-auto rounded-2xl bg-navy p-5 text-cream">
                  <h3 className="mb-3 pr-12 text-lg font-bold text-gold">{card.title}</h3>
                  <div className="space-y-3 text-sm leading-relaxed">
                    {txt(card.reveal, c.revealFallback).split("\n\n").map((paragraph, paragraphIndex) => {
                      const lines = paragraph.split("\n");
                      const isList = lines.every((line) => line.startsWith("- "));
                      return isList ? (
                        <ul key={paragraphIndex} className="list-disc space-y-1 pl-5">
                          {lines.map((line) => <li key={line.slice(2)}>{line.slice(2)}</li>)}
                        </ul>
                      ) : (
                        <p key={paragraphIndex} className="whitespace-pre-line">{paragraph}</p>
                      );
                    })}
                  </div>
                  {card.sticker && <span className="absolute -right-2 -top-3 rotate-12 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase text-navy">{card.sticker}</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="paper relative w-full max-w-3xl rounded-2xl p-5 text-center">
        <p className="stamp mx-auto mb-3 w-fit -rotate-1 text-[0.6rem] text-blue">{c.softCard.title}</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-navy sm:text-base">{txt(c.finePrint, c.revealFallback)}</p>
      </div>
      <div className="paper relative w-full max-w-2xl rounded-2xl border-2 border-dashed border-gold p-5 text-center">
        <Star className="absolute -left-3 -top-3 h-8 w-8" />
        <p className="stamp mx-auto mb-3 w-fit text-[0.55rem] text-gold">APPROVED BY THE KING</p>
        <p className="whitespace-pre-line text-sm leading-relaxed text-navy sm:text-base">{txt(c.softCard.reveal, c.softCard.fallback)}</p>
      </div>
      <Btn onClick={onNext}>{c.button}</Btn>
    </Stage>
  );
}
