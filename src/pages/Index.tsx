import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Custom cursor с magnetic-эффектом ─── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
      }
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button")) {
        scale.current = 2.2;
        if (ring.current) {
          ring.current.style.borderColor = "rgba(79,142,247,0.9)";
          ring.current.style.background = "rgba(79,142,247,0.06)";
        }
      } else {
        scale.current = 1;
        if (ring.current) {
          ring.current.style.borderColor = "rgba(79,142,247,0.45)";
          ring.current.style.background = "transparent";
        }
      }
    };
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px) translate(-50%,-50%) scale(${scale.current})`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ width: 6, height: 6, background: "#4f8ef7", borderRadius: "50%" }} />
      <div ref={ring} className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ width: 38, height: 38, border: "1px solid rgba(79,142,247,0.45)", borderRadius: "50%", transition: "transform 0s, border-color 0.3s, background 0.3s, width 0.3s, height 0.3s" }} />
    </>
  );
}

/* ─── Spotlight — прожектор следует за мышью ─── */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(79,142,247,0.07) 0%, transparent 60%)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="fixed inset-0 pointer-events-none z-[3]" />;
}

/* ─── Particles ─── */
function Particles() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = (c.width = window.innerWidth);
    let H = (c.height = window.innerHeight);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.1 + 0.2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      a: Math.random() * 0.4 + 0.07,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${p.a})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(79,142,247,${0.06 * (1 - d / 110)})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvas} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ─── Scramble text hook ─── */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
function useScramble(target: string, startDelay = 0) {
  const [display, setDisplay] = useState(() => target.replace(/[^ ]/g, "_"));
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 28;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        setDisplay(
          target
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              const reveal = Math.floor((frame / totalFrames) * target.replace(/ /g, "").length);
              const pos = target.slice(0, i).replace(/ /g, "").length;
              if (pos < reveal) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        if (frame >= totalFrames) {
          setDisplay(target);
          setDone(true);
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [target, startDelay]);

  return { display, done };
}

/* ─── Reveal clip-path ─── */
function Reveal({ children, delay = 0, style, className }: {
  children: React.ReactNode; delay?: number;
  style?: React.CSSProperties; className?: string;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div className={className} style={{
      ...style,
      clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : "translateY(10px)",
      transition: "clip-path 0.9s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {children}
    </div>
  );
}

/* ─── HLine reveal ─── */
function HLine({ delay = 0 }: { delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", width: on ? "100%" : "0%", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
  );
}

/* ─── Counting number ─── */
function CountUp({ to, suffix = "", duration = 1600, delay = 0 }: { to: number; suffix?: string; duration?: number; delay?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.floor(p * p * to));
        if (p < 1) raf = requestAnimationFrame(step);
        else setVal(to);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [to, duration, delay]);
  return <>{val.toLocaleString("ru-RU")}{suffix}</>;
}

/* ══════════════════ MAIN ══════════════════ */
export default function Index() {
  const [introOut, setIntroOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroOut(true), 1600);
    const t2 = setTimeout(() => setShowContent(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const CONTENT_DELAY = 2200;  

  // Scramble для двух строк заголовка
  const line1 = useScramble("Инвестируйте в IT-стартапы,", showContent ? 300 : 99999);
  const line2 = useScramble("которые изменят будущее", showContent ? 700 : 99999);

  return (
    <div className="relative w-full font-montserrat" style={{ background: "#07080b", cursor: "none", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Cursor />
      <Spotlight />
      <Particles />

      {/* ── INTRO ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 100, background: "#07080b",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.2rem",
        opacity: introOut ? 0 : 1, pointerEvents: introOut ? "none" : "all",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <span className="text-sm font-semibold tracking-[0.3em] uppercase" style={{ color: "#e8eaf0" }}>
          Invest<span style={{ color: "#4f8ef7" }}>Starts</span>
        </span>
        <div style={{ width: 160, height: "1px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#4f8ef7", animation: "progress 1.4s cubic-bezier(0.4,0,0.6,1) forwards" }} />
        </div>
        <style>{`@keyframes progress { from { width:0 } to { width:100% } }`}</style>
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)`,
        backgroundSize: "80px 80px", zIndex: 1,
      }} />

      {/* Top glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(59,130,246,0.1) 0%, transparent 65%)", zIndex: 1,
      }} />

      {showContent && (
        <div style={{ position: "relative", zIndex: 4, flex: 1, display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box" }}>

          {/* ── NAV ── */}
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, marginBottom: "auto" }}>
            <Reveal delay={100}>
              <span style={{ fontSize: "clamp(0.75rem, 1.1vw, 1rem)", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "#e8eaf0" }}>
                Invest<span style={{ color: "#4f8ef7" }}>Starts</span>
              </span>
            </Reveal>

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem, 2.5vw, 2.5rem)" }}>
              {["стартапам", "как это работает", "преимущества", "отзывы", "faq"].map((item, i) => (
                <Reveal key={item} delay={150 + i * 55}>
                  <a href="#" className="transition-colors duration-300"
                    style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)", fontWeight: 300, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)")}>
                    {item}
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem, 1.5vw, 1.5rem)" }}>
                <a href="#" className="transition-colors duration-300"
                  style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)", fontWeight: 300, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)")}>
                  вход
                </a>
                <a href="#" className="transition-all duration-300"
                  style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.75rem)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", background: "#4f8ef7", color: "#fff", padding: "clamp(0.45rem, 0.7vh, 0.7rem) clamp(0.9rem, 1.5vw, 1.5rem)", borderRadius: "2rem" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#3a7ae0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4f8ef7")}>
                  я стартап — продать проект
                </a>
              </div>
            </Reveal>
          </nav>

          {/* ── ЗАГОЛОВОК — центр тяжести ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>

            <Reveal delay={280}>
              <div className="inline-flex items-center gap-2"
                style={{ background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.16)", color: "rgba(255,255,255,0.4)", padding: "clamp(0.3rem, 0.5vh, 0.5rem) clamp(0.8rem, 1.2vw, 1.2rem)", borderRadius: "2rem", marginBottom: "clamp(1rem, 2.5vh, 2.5rem)", display: "inline-flex" }}>
                <span className="animate-pulse" style={{ width: 6, height: 6, borderRadius: "50%", background: "#4f8ef7", flexShrink: 0 }} />
                <span style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.72rem)", fontWeight: 300, letterSpacing: "0.16em" }}>128 инвесторов на платформе</span>
              </div>
            </Reveal>

            <div style={{ marginBottom: "clamp(1.5rem, 3vh, 3rem)" }}>
              <div style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s",
              }}>
                <h1 style={{
                  fontSize: "clamp(2.4rem, 6.5vw, 6.5rem)",
                  fontWeight: 200,
                  color: "rgba(228,231,242,0.9)",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                  margin: 0,
                  fontFamily: "Montserrat, sans-serif",
                }}>
                  {line1.display}
                </h1>
              </div>
              <div style={{
                opacity: showContent ? 1 : 0,
                transform: showContent ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.6s ease 0.52s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.52s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon name="ArrowUpRight" style={{ color: "#4f8ef7", flexShrink: 0, width: "clamp(2rem, 4.5vw, 4.5rem)", height: "clamp(2rem, 4.5vw, 4.5rem)" }} />
                  <h1 style={{
                    fontSize: "clamp(2.4rem, 6.5vw, 6.5rem)",
                    fontWeight: 200,
                    color: "#4f8ef7",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.05,
                    margin: 0,
                    fontFamily: "Montserrat, sans-serif",
                  }}>
                    {line2.display}
                  </h1>
                </div>
              </div>
            </div>

            <Reveal delay={850}>
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem, 3vw, 4rem)" }}>
                <p style={{ fontSize: "clamp(0.7rem, 0.95vw, 0.9rem)", fontWeight: 300, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em", lineHeight: 1.7, maxWidth: "min(360px, 28vw)", margin: 0 }}>
                  Инвестиционная платформа с предварительным отбором проектов. Demo Day для знакомства. Закрытая среда для сделок.
                </p>
                <div style={{ display: "flex", gap: "clamp(0.5rem, 1vw, 0.75rem)", flexShrink: 0 }}>
                  <a href="#" className="transition-all duration-300"
                    style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.72rem)", fontWeight: 400, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", border: "1px solid rgba(255,255,255,0.14)", padding: "clamp(0.55rem, 0.9vh, 0.85rem) clamp(1.2rem, 2vw, 2rem)", borderRadius: "2rem" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    подать заявку
                  </a>
                  <a href="#" className="transition-all duration-300"
                    style={{ fontSize: "clamp(0.55rem, 0.75vw, 0.72rem)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#fff", background: "#4f8ef7", padding: "clamp(0.55rem, 0.9vh, 0.85rem) clamp(1.2rem, 2vw, 2rem)", borderRadius: "2rem" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#3a7ae0"; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#4f8ef7"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                    стать инвестором
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── НИЖНЯЯ ПОЛОСА ── */}
          <div style={{ flexShrink: 0 }}>
            <HLine delay={1100} />
            <Reveal delay={1200}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "clamp(0.6rem, 1.2vh, 1.2rem)" }}>
                <div style={{ display: "flex", gap: "clamp(1.5rem, 3vw, 3.5rem)" }}>
                  {[
                    { value: 128, suffix: "", label: "инвесторов" },
                    { value: 47, suffix: "+", label: "стартапов отобрано" },
                    { value: 3, suffix: "", label: "Demo Day проведено" },
                  ].map((s, i) => (
                    <div key={s.label}>
                      <div style={{ fontSize: "clamp(1.1rem, 2vw, 1.8rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                        <CountUp to={s.value} suffix={s.suffix} delay={1250 + i * 120} />
                      </div>
                      <div style={{ marginTop: "0.3rem", fontSize: "clamp(0.5rem, 0.65vw, 0.65rem)", color: "rgba(255,255,255,0.25)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "clamp(0.4rem, 0.7vw, 0.7rem)" }}>
                  {[
                    { icon: "Shield", text: "Отбор проектов" },
                    { icon: "Users", text: "Закрытое сообщество" },
                    { icon: "Zap", text: "Прямые сделки" },
                  ].map((b) => (
                    <div key={b.text} className="transition-all duration-300"
                      style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "clamp(0.3rem, 0.5vh, 0.5rem) clamp(0.7rem, 1.1vw, 1.1rem)", border: "1px solid rgba(79,142,247,0.16)", background: "rgba(79,142,247,0.04)", borderRadius: "2rem", cursor: "default" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,142,247,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(79,142,247,0.09)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,142,247,0.16)"; (e.currentTarget as HTMLElement).style.background = "rgba(79,142,247,0.04)"; }}>
                      <Icon name={b.icon as "Shield"} size={11} style={{ color: "#4f8ef7" }} />
                      <span style={{ fontSize: "clamp(0.5rem, 0.65vw, 0.65rem)", fontWeight: 300, color: "rgba(255,255,255,0.45)", letterSpacing: "0.1em" }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.2), transparent)", zIndex: 2 }} />
    </div>
  );
}