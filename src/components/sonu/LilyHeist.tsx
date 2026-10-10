import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowUpRight, Heart, RotateCcw, Sparkles } from "lucide-react";
import { birthday as B } from "@/content/birthday";
import { sfx } from "@/lib/sound";
import { Btn, ChapterHead, Moon, Stage } from "./primitives";

type TargetKind = "lily" | "matcha" | "bonus" | "king";
type Target = {
  id: number;
  kind: TargetKind;
  x: number;
  y: number;
  baseY: number;
  size: number;
  speed: number;
  phase: number;
  age: number;
};
type Arrow = { x: number; y: number; px: number; py: number; vx: number; vy: number; age: number };
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
};
type HitEffect = { target: Target; life: number; rotation: number };
type Aim = { pointerId: number; x: number; y: number; pullX: number; pullY: number };
type Counts = { lily: number; matcha: number; bonus: number };
type GameModel = {
  targets: Target[];
  arrows: Arrow[];
  particles: Particle[];
  hitEffects: HitEffect[];
  score: number;
  counts: Counts;
  arrowsLeft: number;
  startedAt: number;
  endsAt: number;
  nextArrowAt: number;
  nextSpawnAt: number;
  nextKingAt: number;
  nextId: number;
  hitKing: boolean;
  reaction: string;
  reactionKind: TargetKind | null;
  reactionUntil: number;
};
type GameView = {
  seconds: number;
  arrows: number;
  score: number;
  counts: Counts;
  reaction: string;
};
type Result = { score: number; counts: Counts; hitKing: boolean };
type Assets = Partial<Record<TargetKind, HTMLImageElement>>;

const MAX_ARROWS = 10;
const ARROW_REFILL_MS = 2_500;
const SPRITES: Record<TargetKind, string> = {
  lily: "/assets/photos/gamelili.png",
  matcha: "/assets/photos/gamematcha.png",
  bonus: "",
  king: "/assets/photos/gameyash.png",
};
const NEW_GAME = (now: number, roundSeconds: number): GameModel => ({
  targets: [],
  arrows: [],
  particles: [],
  hitEffects: [],
  score: 0,
  counts: { lily: 0, matcha: 0, bonus: 0 },
  arrowsLeft: MAX_ARROWS,
  startedAt: now,
  endsAt: now + roundSeconds * 1000,
  nextArrowAt: now + ARROW_REFILL_MS,
  nextSpawnAt: now + 250,
  nextKingAt: now + 8_000,
  nextId: 0,
  hitKing: false,
  reaction: "",
  reactionKind: null,
  reactionUntil: 0,
});

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function hitTest(ax: number, ay: number, bx: number, by: number, target: Target) {
  const dx = bx - ax;
  const dy = by - ay;
  const denom = dx * dx + dy * dy;
  const t = denom
    ? Math.max(0, Math.min(1, ((target.x - ax) * dx + (target.y - ay) * dy) / denom))
    : 0;
  const x = ax + t * dx - target.x;
  const y = ay + t * dy - target.y;
  if (target.kind === "king") {
    const rx = target.size * 0.29;
    const ry = target.size * 0.42;
    return (x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1;
  }
  const radius = target.kind === "bonus" ? target.size * 0.42 : target.size * 0.38;
  return x * x + y * y <= radius * radius;
}

function drawImageContain(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  ctx.drawImage(image, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight);
}

function drawGarden(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  game: GameModel | null,
  assets: Assets,
  aim: Aim | null,
  now: number,
) {
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#adc6e9");
  sky.addColorStop(0.62, "#8099c5");
  sky.addColorStop(1, "#52658f");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.strokeStyle = "#fff8e9";
  ctx.lineWidth = 1;
  for (let y = 8; y < height; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  const moonX = width * 0.82;
  const moonY = height * 0.16;
  ctx.fillStyle = "#f4d991";
  ctx.beginPath();
  ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#adc6e9";
  ctx.beginPath();
  ctx.arc(moonX + 12, moonY - 8, 25, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 13; i++) {
    const x = (i * 83 + 41) % Math.max(width, 1);
    const y = 24 + ((i * 47) % Math.max(height * 0.56, 1));
    ctx.globalAlpha = 0.5 + Math.sin(now / 650 + i) * 0.2;
    ctx.fillStyle = i % 2 ? "#fff8e9" : "#f4d991";
    ctx.beginPath();
    ctx.arc(x, y, i % 3 === 0 ? 2 : 1.3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  const ground = ctx.createLinearGradient(0, height * 0.72, 0, height);
  ground.addColorStop(0, "#546885");
  ground.addColorStop(1, "#273756");
  ctx.fillStyle = ground;
  ctx.beginPath();
  ctx.moveTo(0, height * 0.78);
  ctx.quadraticCurveTo(width * 0.25, height * 0.7, width * 0.48, height * 0.79);
  ctx.quadraticCurveTo(width * 0.74, height * 0.69, width, height * 0.78);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 9; i++) {
    const x = (i / 8) * width;
    const stemHeight = 38 + (i % 3) * 13;
    ctx.strokeStyle = "#d9d6c5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, height);
    ctx.quadraticCurveTo(x + (i % 2 ? 12 : -12), height - stemHeight / 2, x, height - stemHeight);
    ctx.stroke();
    ctx.fillStyle = "#f8f5ea";
    ctx.beginPath();
    ctx.ellipse(x, height - stemHeight, 8, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!game) return;

  const bowX = Math.max(54, width * 0.105);
  const bowY = height - 64;
  ctx.save();
  ctx.strokeStyle = "#6a3f38";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.arc(bowX - 7, bowY, 31, -Math.PI * 0.78, Math.PI * 0.78);
  ctx.stroke();
  ctx.strokeStyle = "#f5e7c5";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(bowX - 29, bowY - 22);
  ctx.lineTo(bowX - 29, bowY + 22);
  ctx.stroke();
  ctx.fillStyle = "#f4d991";
  ctx.beginPath();
  ctx.arc(bowX, bowY, 5, 0, Math.PI * 2);
  ctx.fill();

  if (aim) {
    const pull = Math.hypot(aim.pullX, aim.pullY);
    const angle = Math.atan2(-aim.pullY, -aim.pullX);
    const power = 480 + Math.min(130, pull) * 4.8;
    const vx = Math.cos(angle) * power;
    const vy = Math.sin(angle) * power;
    ctx.setLineDash([4, 7]);
    ctx.strokeStyle = "#fff8e9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const t = i * 0.075;
      const x = bowX + 14 + vx * t;
      const y = bowY + vy * t + 0.5 * 220 * t * t;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#fff8e9";
    ctx.beginPath();
    ctx.arc(aim.x, aim.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  game.targets.forEach((target) => {
    ctx.save();
    const bobY = target.y + Math.sin(target.age * 2.4 + target.phase) * 5;
    if (target.kind === "lily") {
      const image = assets.lily;
      if (image?.complete && image.naturalWidth)
        drawImageContain(ctx, image, target.x, bobY, target.size, target.size);
      else drawFlower(ctx, target.x, bobY, target.size * 0.43);
    } else if (target.kind === "matcha") {
      const image = assets.matcha;
      if (image?.complete && image.naturalWidth)
        drawImageContain(ctx, image, target.x, bobY, target.size * 0.82, target.size * 1.25);
      else drawCup(ctx, target.x, bobY, target.size);
    } else if (target.kind === "king") {
      const image = assets.king;
      if (image?.complete && image.naturalWidth) {
        const recoil = game.hitEffects.find((effect) => effect.target.id === target.id);
        ctx.translate(target.x, bobY);
        if (recoil) ctx.rotate(recoil.rotation);
        drawImageContain(ctx, image, 0, 0, target.size * 0.9, target.size * 1.2);
      } else {
        drawKingFallback(ctx, target.x, bobY, target.size);
      }
    } else {
      ctx.fillStyle = "#f4d991";
      ctx.strokeStyle = "#fff8e9";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(target.x, bobY, target.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#8e4e70";
      ctx.font = `bold ${target.size * 0.42}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("♥", target.x, bobY + 1);
    }
    ctx.restore();
  });

  game.arrows.forEach((arrow) => {
    const angle = Math.atan2(arrow.vy, arrow.vx);
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(angle);
    ctx.strokeStyle = "#fff8e9";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-22, 0);
    ctx.lineTo(9, 0);
    ctx.stroke();
    ctx.fillStyle = "#f4d991";
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(5, -5);
    ctx.lineTo(7, 0);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  game.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life / 0.75);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.ellipse(
      particle.x,
      particle.y,
      particle.size,
      particle.size * 0.6,
      particle.life * 5,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  game.hitEffects.forEach(({ target, life, rotation }) => {
    const image = assets.king;
    if (target.kind !== "king" || !image?.complete || !image.naturalWidth) return;
    ctx.save();
    ctx.globalAlpha = life / 0.65;
    ctx.translate(target.x + (0.65 - life) * 95, target.y - (0.65 - life) * 45);
    ctx.rotate(rotation);
    drawImageContain(ctx, image, 0, 0, target.size * 0.9, target.size * 1.2);
    ctx.restore();
  });
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
  ctx.fillStyle = "#fff8e9";
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.ellipse(
      x,
      y - radius * 0.48,
      radius * 0.36,
      radius * 0.62,
      (i * Math.PI) / 3,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = "#f4d991";
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.22, 0, Math.PI * 2);
  ctx.fill();
}

function drawCup(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#d4e39d";
  ctx.strokeStyle = "#fff8e9";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - size * 0.28, y - size * 0.33, size * 0.56, size * 0.68, 9);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#9bb36a";
  ctx.beginPath();
  ctx.ellipse(x, y - size * 0.31, size * 0.3, size * 0.11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawKingFallback(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.fillStyle = "#f0c7a7";
  ctx.beginPath();
  ctx.arc(x, y, size * 0.27, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#273756";
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.36, size * 0.34, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4d991";
  ctx.font = `bold ${size * 0.3}px sans-serif`;
  ctx.textAlign = "center";
  ctx.fillText("♛", x, y - size * 0.25);
}

function createTarget(
  game: GameModel,
  width: number,
  height: number,
  kind: TargetKind,
  forcedX?: number,
): Target {
  const size =
    kind === "king"
      ? 92 + Math.random() * 14
      : kind === "matcha"
        ? 62 + Math.random() * 13
        : 59 + Math.random() * 18;
  const minX = width * 0.3;
  const maxX = Math.max(minX + 20, width - size);
  const minY = Math.min(75, height * 0.2);
  const maxY = Math.max(minY + 25, height * 0.69);
  const x = forcedX ?? minX + Math.random() * (maxX - minX);
  const y = minY + Math.random() * (maxY - minY);
  return {
    id: game.nextId++,
    kind,
    x,
    y,
    baseY: y,
    size,
    speed: kind === "king" ? 28 + Math.random() * 14 : 36 + Math.random() * 52,
    phase: Math.random() * Math.PI * 2,
    age: 0,
  };
}

function burst(game: GameModel, x: number, y: number, color: string) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 * i) / 12;
    const speed = 55 + Math.random() * 95;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 30,
      life: 0.75,
      size: 3 + Math.random() * 3,
      color,
    });
  }
}

function nearestPointToTarget(target: Target, dt: number) {
  return { x: target.x + target.speed * dt * 0.5, y: target.y };
}

export function LilyHeist({ onNext }: { onNext: () => void }) {
  const c = B.lilies.game;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<GameModel | null>(null);
  const aimRef = useRef<Aim | null>(null);
  const assetsRef = useRef<Assets>({});
  const [phase, setPhase] = useState<"intro" | "playing" | "results">("intro");
  const phaseRef = useRef(phase);
  const [view, setView] = useState<GameView>({
    seconds: c.roundSeconds,
    arrows: MAX_ARROWS,
    score: 0,
    counts: { lily: 0, matcha: 0, bonus: 0 },
    reaction: "",
  });
  const [result, setResult] = useState<Result | null>(null);
  const [assetErrors, setAssetErrors] = useState<string[]>([]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    let cancelled = false;
    (Object.entries(SPRITES) as [TargetKind, string][]).forEach(([kind, src]) => {
      if (!src) return;
      const image = new Image();
      image.onload = () => {
        if (!cancelled) assetsRef.current[kind] = image;
      };
      image.onerror = () => {
        if (!cancelled) setAssetErrors((errors) => [...new Set([...errors, src])]);
      };
      image.src = src;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (phase !== "playing" && phase !== "results") return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastUiTime = 0;
    let disposed = false;
    const renderStatic = (now: number) => {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
      const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawGarden(context, rect.width, rect.height, gameRef.current, assetsRef.current, null, now);
    };
    const render = (now: number) => {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.max(1, Math.round(rect.width * dpr));
      const pixelHeight = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const width = rect.width;
      const height = rect.height;
      const game = gameRef.current;
      if (phaseRef.current === "playing" && game) {
        const elapsed = Math.min(0.08, Math.max(0, (now - lastTime) / 1000));
        lastTime = now;
        const wallTime = Date.now();

        if (game.arrowsLeft < MAX_ARROWS && wallTime >= game.nextArrowAt) {
          game.arrowsLeft += 1;
          game.nextArrowAt = wallTime + ARROW_REFILL_MS;
        }

        game.targets.forEach((target) => {
          target.x -= target.speed * elapsed;
          target.age += elapsed;
          target.y = target.baseY + Math.sin(target.age * 2.4 + target.phase) * 7;
        });
        game.targets = game.targets.filter((target) => target.x > -target.size);
        game.particles.forEach((particle) => {
          particle.x += particle.vx * elapsed;
          particle.y += particle.vy * elapsed;
          particle.vy += 150 * elapsed;
          particle.life -= elapsed;
        });
        game.particles = game.particles.filter((particle) => particle.life > 0);
        game.hitEffects.forEach((effect) => {
          effect.life -= elapsed;
          effect.rotation += elapsed * 10;
        });
        game.hitEffects = game.hitEffects.filter((effect) => effect.life > 0);

        if (wallTime >= game.nextSpawnAt && game.targets.length < 3) {
          let kind: TargetKind;
          if (
            wallTime >= game.nextKingAt &&
            !game.targets.some((target) => target.kind === "king")
          ) {
            kind = "king";
            game.nextKingAt = wallTime + 8_000 + Math.random() * 3_000;
          } else {
            const roll = Math.random();
            kind = roll < 0.46 ? "lily" : roll < 0.75 ? "matcha" : roll < 0.94 ? "bonus" : "king";
            if (kind === "king" && game.targets.some((target) => target.kind === "king"))
              kind = "lily";
          }
          game.targets.push(createTarget(game, width, height, kind));
          game.nextSpawnAt = wallTime + 2_700 + Math.random() * 900;
        }

        const survivingArrows: Arrow[] = [];
        for (const arrow of game.arrows) {
          arrow.px = arrow.x;
          arrow.py = arrow.y;
          arrow.x += arrow.vx * elapsed;
          arrow.y += arrow.vy * elapsed;
          arrow.vy += 220 * elapsed;
          arrow.age += elapsed;
          let hitIndex = -1;
          for (let i = 0; i < game.targets.length; i++) {
            const target = game.targets[i]!;
            const midpoint = nearestPointToTarget(target, elapsed);
            if (
              hitTest(arrow.px, arrow.py, arrow.x, arrow.y, {
                ...target,
                x: midpoint.x,
                y: midpoint.y,
              })
            ) {
              hitIndex = i;
              break;
            }
          }
          if (hitIndex >= 0) {
            const [target] = game.targets.splice(hitIndex, 1);
            if (target) {
              game.score += c.points[target.kind];
              if (target.kind !== "king") game.counts[target.kind] += 1;
              const color =
                target.kind === "bonus" || target.kind === "king" ? "#f4d991" : "#fff8e9";
              burst(game, target.x, target.y, color);
              if (target.kind === "king") {
                game.hitKing = true;
                game.hitEffects.push({ target, life: 0.65, rotation: -0.15 });
                sfx("boop");
              }
              if (target.kind !== "king") sfx(target.kind === "bonus" ? "chime" : "pluck");
              if (
                target.kind === "king" ||
                wallTime >= game.reactionUntil ||
                game.reactionKind !== "king"
              ) {
                game.reaction =
                  target.kind === "lily" || target.kind === "matcha"
                    ? `+${c.points[target.kind]}`
                    : randomFrom(c.reactions[target.kind]);
                game.reactionKind = target.kind;
                game.reactionUntil = wallTime + (target.kind === "king" ? 9_000 : 4_500);
              }
            }
            continue;
          }
          if (arrow.age < 2.4 && arrow.x < width + 50 && arrow.y < height + 100 && arrow.y > -100)
            survivingArrows.push(arrow);
        }
        game.arrows = survivingArrows;

        if (wallTime >= game.endsAt) {
          const finalResult = {
            score: game.score,
            counts: { ...game.counts },
            hitKing: game.hitKing,
          };
          setResult(finalResult);
          setView({
            seconds: Math.max(0, Math.ceil((game.endsAt - wallTime) / 1000)),
            arrows: game.arrowsLeft,
            score: game.score,
            counts: { ...game.counts },
            reaction: game.reaction,
          });
          setPhase("results");
          phaseRef.current = "results";
        } else if (now - lastUiTime > 140) {
          lastUiTime = now;
          setView({
            seconds: Math.max(0, Math.ceil((game.endsAt - wallTime) / 1000)),
            arrows: game.arrowsLeft,
            score: game.score,
            counts: { ...game.counts },
            reaction: wallTime < game.reactionUntil ? game.reaction : "",
          });
        }
        drawGarden(context, width, height, game, assetsRef.current, aimRef.current, now);
        if (phaseRef.current === "playing") animationFrame = requestAnimationFrame(render);
      } else {
        drawGarden(context, width, height, game, assetsRef.current, null, now);
      }
    };
    const observer = new ResizeObserver(() => {
      if (phaseRef.current === "results") renderStatic(performance.now());
    });
    observer.observe(canvas);
    render(lastTime);
    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [phase, c.points, c.reactions]);

  const start = () => {
    const now = Date.now();
    gameRef.current = NEW_GAME(now, c.roundSeconds);
    aimRef.current = null;
    setResult(null);
    setView({
      seconds: c.roundSeconds,
      arrows: MAX_ARROWS,
      score: 0,
      counts: { lily: 0, matcha: 0, bonus: 0 },
      reaction: "",
    });
    setPhase("playing");
    phaseRef.current = "playing";
  };

  const localPoint = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const pointerDown = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const game = gameRef.current;
    if (!game || game.arrowsLeft < 1 || aimRef.current) return;
    const point = localPoint(event);
    const bowX = Math.max(54, event.currentTarget.clientWidth * 0.105);
    const bowY = event.currentTarget.clientHeight - 64;
    if (Math.hypot(point.x - bowX, point.y - bowY) > 94) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    aimRef.current = {
      pointerId: event.pointerId,
      x: point.x,
      y: point.y,
      pullX: point.x - bowX,
      pullY: point.y - bowY,
    };
  };

  const pointerMove = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const aim = aimRef.current;
    if (!aim || aim.pointerId !== event.pointerId) return;
    event.preventDefault();
    const point = localPoint(event);
    const bowX = Math.max(54, event.currentTarget.clientWidth * 0.105);
    const bowY = event.currentTarget.clientHeight - 64;
    const pullX = point.x - bowX;
    const pullY = point.y - bowY;
    const length = Math.hypot(pullX, pullY);
    const clamp = Math.min(130, length);
    const scale = length ? clamp / length : 0;
    aimRef.current = { ...aim, x: point.x, y: point.y, pullX: pullX * scale, pullY: pullY * scale };
  };

  const pointerUp = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const aim = aimRef.current;
    const game = gameRef.current;
    if (!aim || !game || aim.pointerId !== event.pointerId) return;
    event.preventDefault();
    const pull = Math.hypot(aim.pullX, aim.pullY);
    if (pull >= 18) {
      const bowX = Math.max(54, event.currentTarget.clientWidth * 0.105);
      const bowY = event.currentTarget.clientHeight - 64;
      const angle = Math.max(-1.28, Math.min(0.18, Math.atan2(-aim.pullY, -aim.pullX)));
      const power = 480 + Math.min(130, pull) * 4.8;
      const vx = Math.cos(angle) * power;
      const vy = Math.sin(angle) * power;
      game.arrows.push({ x: bowX + 14, y: bowY, px: bowX + 14, py: bowY, vx, vy, age: 0 });
      if (game.arrowsLeft === MAX_ARROWS) game.nextArrowAt = Date.now() + ARROW_REFILL_MS;
      game.arrowsLeft -= 1;
      sfx("whoosh");
    }
    aimRef.current = null;
  };

  const pointerCancel = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (aimRef.current?.pointerId === event.pointerId) aimRef.current = null;
  };

  return (
    <Stage env="scrapbook">
      <ChapterHead
        n="06"
        title={c.heading}
        subtitle="One bow. Ten arrows. One king with questionable survival instincts."
        tone="cream"
      />

      {phase === "intro" && (
        <section
          className="lily-paper animate-rise z-10 w-full max-w-2xl rounded-[2rem] border-2 border-gold/70 p-6 text-center shadow-[var(--shadow-lift)] sm:p-9"
          aria-labelledby="heist-intro-title"
        >
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-powder/60 text-blue">
            <Moon className="h-9 w-9" />
          </div>
          <p className="stamp inline-block -rotate-3 border-gold text-blue">Royal garden notice</p>
          <h2 id="heist-intro-title" className="hand mt-3 text-4xl font-bold text-navy sm:text-5xl">
            THE LILY HEIST
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink/85">{c.opening}</p>
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-powder/35 px-4 py-3 font-semibold text-navy">
            <ArrowUpRight aria-hidden className="h-5 w-5" />
            <span>{c.controls}</span>
          </div>
          <Btn variant="gold" className="mt-6" onClick={start}>
            {c.armButton}
          </Btn>
        </section>
      )}

      {phase !== "intro" && (
        <>
          <div
            className="z-10 flex w-full flex-wrap justify-center gap-2 sm:gap-3"
            aria-label="Game status"
          >
            <div className="lily-hud-pill">
              <span>Time</span>
              <strong className={view.seconds <= 8 ? "text-rose-300" : "text-gold"}>
                {view.seconds}s
              </strong>
            </div>
            <div className="lily-hud-pill">
              <span>Arrows</span>
              <strong className="text-gold">
                {view.arrows}/{MAX_ARROWS}
              </strong>
            </div>
            <div className="lily-hud-pill">
              <span>Score</span>
              <strong className="text-gold">{view.score}</strong>
            </div>
            <div className="lily-hud-pill">
              <span>Lilies</span>
              <strong>{view.counts.lily}</strong>
            </div>
            <div className="lily-hud-pill">
              <span>Matcha</span>
              <strong>{view.counts.matcha}</strong>
            </div>
            <div className="lily-hud-pill">
              <span>Bonus tokens</span>
              <strong>{view.counts.bonus}</strong>
            </div>
          </div>

          <div className="lily-game-frame relative z-10 w-full max-w-5xl overflow-hidden rounded-[1.6rem] border-4 border-cream/70 shadow-[var(--shadow-lift)]">
            <canvas
              ref={canvasRef}
              aria-label="Royal garden archery game. Drag backwards from the bow at the bottom left, then release to shoot floating targets."
              aria-describedby="lily-game-controls"
              className={`lily-game-canvas block w-full ${phase === "playing" ? "lily-game-active" : ""}`}
              onPointerDown={phase === "playing" ? pointerDown : undefined}
              onPointerMove={phase === "playing" ? pointerMove : undefined}
              onPointerUp={phase === "playing" ? pointerUp : undefined}
              onPointerCancel={phase === "playing" ? pointerCancel : undefined}
            />
            {phase === "playing" && view.reaction && (
              <div
                role="status"
                aria-live="polite"
                className="lily-reaction-bubble animate-pop absolute left-1/2 top-3 z-10 w-[92%] max-w-xl -translate-x-1/2 rounded-2xl border-2 border-gold bg-paper px-5 py-4 text-center text-base font-semibold leading-relaxed text-navy shadow-xl sm:text-lg"
              >
                {view.reaction}
              </div>
            )}
            {phase === "playing" && (
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-navy/75 px-4 py-1.5 text-xs font-semibold text-cream shadow">
                Drag back from the bow · release to shoot
              </p>
            )}
          </div>

          <p id="lily-game-controls" className="z-10 -mt-4 text-center text-sm text-cream/85">
            {phase === "playing"
              ? "10-arrow quiver · arrows refill every 2.5 seconds · aim for the King to earn his compliment."
              : "Round complete. The garden has filed a report."}
          </p>
        </>
      )}

      {assetErrors.length > 0 && (
        <p
          role="alert"
          className="z-10 max-w-2xl rounded-xl border border-gold/70 bg-navy/80 px-4 py-2 text-center text-sm text-cream"
        >
          Some local game art could not load: {assetErrors.join(", ")}. Please check the matching
          files in public/assets/photos.
        </p>
      )}

      {phase === "results" && result && (
        <section
          className="lily-paper animate-rise z-10 w-full max-w-3xl rounded-[2rem] border-2 border-gold/70 p-5 text-center shadow-[var(--shadow-lift)] sm:p-8"
          aria-labelledby="heist-results-title"
        >
          <div className="mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-gold/35 text-blue">
            <Sparkles className="h-7 w-7" />
          </div>
          <p className="stamp inline-block rotate-2 border-gold text-blue">Royal victory report</p>
          <h2
            id="heist-results-title"
            className="hand mt-3 text-3xl font-bold text-navy sm:text-5xl"
          >
            {result.hitKing ? c.resultsHeading : c.resultsEscapeHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl whitespace-pre-line leading-relaxed text-ink/85">
            {result.hitKing ? c.kingHitEnding : c.kingMissEnding}
          </p>
          <p className="mt-2 font-semibold text-navy">{c.ending}</p>
          <div
            className="my-5 flex flex-wrap justify-center gap-2"
            aria-label="Final game statistics"
          >
            <span className="lily-result-stat">Score: {result.score}</span>
            <span className="lily-result-stat">Lilies: {result.counts.lily}</span>
            <span className="lily-result-stat">Matcha: {result.counts.matcha}</span>
            <span className="lily-result-stat">Bonus tokens: {result.counts.bonus}</span>
            <span className="lily-result-stat">
              {result.hitKing ? "King hit: confirmed" : "King hit: escaped (for now)"}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Btn variant="paper" onClick={start}>
              <RotateCcw aria-hidden className="h-4 w-4" />
              {c.replay}
            </Btn>
            <Btn variant="gold" onClick={onNext}>
              <Heart aria-hidden className="h-4 w-4" />
              {c.continueButton}
            </Btn>
          </div>
        </section>
      )}
    </Stage>
  );
}
