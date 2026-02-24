import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState, useCallback } from "react";

/* ─── Custom cursor ─── */
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
          ring.current.style.borderColor = "rgba(37,99,235,0.9)";
          ring.current.style.background = "rgba(37,99,235,0.06)";
        }
      } else {
        scale.current = 1;
        if (ring.current) {
          ring.current.style.borderColor = "rgba(37,99,235,0.35)";
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
        style={{ width: 6, height: 6, background: "#2563eb", borderRadius: "50%" }} />
      <div ref={ring} className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ width: 38, height: 38, border: "1px solid rgba(37,99,235,0.35)", borderRadius: "50%", transition: "transform 0s, border-color 0.3s, background 0.3s" }} />
    </>
  );
}

/* ─── Spotlight ─── */
function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.background = `radial-gradient(500px circle at ${e.clientX}px ${e.clientY}px, rgba(37,99,235,0.04) 0%, transparent 60%)`;
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
    const pts = Array.from({ length: 45 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.25 + 0.06,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.a})`; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(37,99,235,${0.07 * (1 - d / 120)})`; ctx.lineWidth = 0.6; ctx.stroke();
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

  useEffect(() => {
    let frame = 0;
    const totalFrames = 28;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        setDisplay(
          target.split("").map((char, i) => {
            if (char === " ") return " ";
            const reveal = Math.floor((frame / totalFrames) * target.replace(/ /g, "").length);
            const pos = target.slice(0, i).replace(/ /g, "").length;
            if (pos < reveal) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join("")
        );
        if (frame >= totalFrames) {
          setDisplay(target);
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [target, startDelay]);

  return { display };
}

/* ─── FitText ─── */
function FitText({ children, fontWeight = 700, color = "#0f172a", style }: {
  children: string; fontWeight?: number; color?: string; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(120);

  const fit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const available = parent.offsetWidth;
    el.style.fontSize = "120px";
    el.style.whiteSpace = "nowrap";
    const natural = el.scrollWidth;
    if (natural > 0) setFontSize(120 * (available / natural));
  }, []);

  useEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit, children]);

  return (
    <div ref={ref} style={{
      fontSize, fontWeight, color, letterSpacing: "-0.03em", lineHeight: 1.0,
      margin: 0, fontFamily: "Montserrat, sans-serif", whiteSpace: "nowrap",
      ...style,
    }}>
      {children}
    </div>
  );
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

/* ─── HLine ─── */
function HLine({ delay = 0 }: { delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{ height: "1px", background: "rgba(15,23,42,0.1)", width: on ? "100%" : "0%", transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
  );
}

/* ─── CountUp ─── */
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

  const line1 = useScramble("Инвестируйте в IT-стартапы,", showContent ? 300 : 99999);
  const line2 = useScramble("которые изменят будущее", showContent ? 700 : 99999);

  return (
    <div className="relative w-full font-montserrat" style={{ background: "#f8faff", cursor: "none", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <Cursor />
      <Spotlight />
      <Particles />

      {/* ── INTRO ── */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 100, background: "#f8faff",
        display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1.2rem",
        opacity: introOut ? 0 : 1, pointerEvents: introOut ? "none" : "all",
        transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#0f172a" }}>
          Invest<span style={{ color: "#2563eb" }}>Starts</span>
        </span>
        <div style={{ width: 160, height: "1px", background: "rgba(15,23,42,0.1)", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#2563eb", animation: "progress 1.4s cubic-bezier(0.4,0,0.6,1) forwards" }} />
        </div>
        <style>{`@keyframes progress { from { width:0 } to { width:100% } }`}</style>
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)`,
        backgroundSize: "80px 80px", zIndex: 1,
      }} />

      {/* Top light gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(37,99,235,0.08) 0%, transparent 65%)", zIndex: 1,
      }} />

      {/* Декоративные кольца — правый край */}
      <div className="absolute pointer-events-none" style={{ right: "-18vw", top: "50%", transform: "translateY(-50%)", zIndex: 1 }}>
        {[420, 580, 740, 900].map((size, i) => (
          <div key={size} className="absolute" style={{
            width: size, height: size, borderRadius: "50%",
            border: `1px solid rgba(37,99,235,${0.1 - i * 0.02})`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}
        <div className="absolute" style={{ width: 1, height: 120, background: "linear-gradient(180deg, transparent, rgba(37,99,235,0.25), transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div className="absolute" style={{ width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(37,99,235,0.25), transparent)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
        <div className="absolute" style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", boxShadow: "0 0 14px rgba(37,99,235,0.6)", top: "calc(50% - 210px)", left: "50%", transform: "translateX(-50%)", animation: "spin 18s linear infinite", transformOrigin: "0 210px" }} />
      </div>

      {/* Угловой элемент — левый низ */}
      <div className="absolute pointer-events-none" style={{ left: "-6vw", bottom: "8vh", zIndex: 1 }}>
        {[200, 300].map((size, i) => (
          <div key={size} style={{
            position: "absolute", width: size, height: size, borderRadius: "50%",
            border: `1px solid rgba(37,99,235,${0.08 - i * 0.03})`,
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          }} />
        ))}
      </div>

      <style>{`@keyframes spin { from { transform: translateX(-50%) rotate(0deg); } to { transform: translateX(-50%) rotate(360deg); } }`}</style>

      {showContent && (
        <div style={{ position: "relative", zIndex: 4, flex: 1, display: "flex", flexDirection: "column", padding: "24px 32px", boxSizing: "border-box" }}>

          {/* ── NAV ── */}
          <Reveal delay={100}>
            <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0f172a", whiteSpace: "nowrap" }}>
                Invest<span style={{ color: "#2563eb" }}>Starts</span>
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "2.2rem" }}>
                {["Стартапам", "Как это работает", "Преимущества", "Отзывы", "FAQ"].map((item) => (
                  <a key={item} href="#" className="transition-colors duration-200"
                    style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.08em", color: "rgba(15,23,42,0.4)", whiteSpace: "nowrap", textDecoration: "none" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(15,23,42,0.9)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(15,23,42,0.4)")}>
                    {item}
                  </a>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <a href="#" style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "0.08em", color: "rgba(15,23,42,0.4)", textDecoration: "none" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(15,23,42,0.9)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(15,23,42,0.4)")}>
                  Вход
                </a>
                <a href="#" className="transition-all duration-200"
                  style={{ fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", background: "#2563eb", color: "#fff", padding: "0.55rem 1.4rem", borderRadius: "2rem", whiteSpace: "nowrap", textDecoration: "none", boxShadow: "0 2px 12px rgba(37,99,235,0.25)" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1d4ed8")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#2563eb")}>
                  Я стартап — продать проект
                </a>
              </div>
            </nav>
          </Reveal>

          {/* Разделитель шапка / хиро */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.4) 30%, rgba(37,99,235,0.7) 50%, rgba(37,99,235,0.4) 70%, transparent 100%)", margin: "0.8rem 0", flexShrink: 0, boxShadow: "0 0 8px rgba(37,99,235,0.15)" }} />

          {/* ── ЦЕНТР ── */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "2vh" }}>

            {/* Badge */}
            <Reveal delay={300}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", background: "rgba(37,99,235,0.06)", border: "1px solid rgba(37,99,235,0.18)", padding: "0.45rem 1.2rem", borderRadius: "2rem" }}>
                <span className="animate-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(15,23,42,0.6)", letterSpacing: "0.05em" }}>128 инвесторов на платформе</span>
              </div>
            </Reveal>

            {/* Заголовок */}
            <div style={{ overflow: "hidden" }}>
              <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.3s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
                <FitText fontWeight={300} color="#0f172a">{line1.display}</FitText>
              </div>
              <div style={{ opacity: showContent ? 1 : 0, transform: showContent ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease 0.52s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.52s" }}>
                <FitText fontWeight={300} color="#2563eb">{line2.display}</FitText>
              </div>
            </div>

            {/* Описание + кнопки */}
            <Reveal delay={750}>
              <div style={{ display: "flex", alignItems: "center", gap: "3rem", paddingTop: "0.5vh" }}>
                <p style={{ fontSize: "1rem", fontWeight: 400, color: "rgba(15,23,42,0.5)", lineHeight: 1.7, margin: 0, maxWidth: "420px" }}>
                  InvestStarts объединяет инвесторов и технологические команды в единой инвестиционной экосистеме.
                </p>
                <div style={{ display: "flex", gap: "1.1rem", flexShrink: 0 }}>
                  <a href="#" className="transition-all duration-200"
                    style={{ fontSize: "1rem", fontWeight: 500, letterSpacing: "0.04em", color: "rgba(15,23,42,0.7)", border: "1px solid rgba(15,23,42,0.2)", padding: "1.1rem 2.8rem", borderRadius: "3rem", whiteSpace: "nowrap", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#0f172a"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,23,42,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(15,23,42,0.04)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(15,23,42,0.7)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(15,23,42,0.2)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                    Подать заявку
                  </a>
                  <a href="#" className="transition-all duration-200"
                    style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.04em", color: "#fff", background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", padding: "1.1rem 2.8rem", borderRadius: "3rem", whiteSpace: "nowrap", textDecoration: "none", boxShadow: "0 4px 24px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 32px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"; (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
                    Стать инвестором
                  </a>
                </div>
              </div>
            </Reveal>

          </div>

          {/* ── НИЖНЯЯ ПОЛОСА ── */}
          <div style={{ flexShrink: 0 }}>
            <HLine delay={1000} />
            <Reveal delay={1100}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1.2rem", gap: "2rem" }}>
                <div style={{ display: "flex", alignItems: "stretch", gap: "0" }}>
                  {[
                    { value: 750, suffix: "", label: "зарегистрированных инвесторов" },
                    { value: 10, suffix: " млн ₽", label: "привлечено через платформу" },
                    { value: 14, suffix: "", label: "проектов привлекли инвестиции" },
                    { value: 2, suffix: "%", label: "стартапов проходят отбор" },
                  ].map((s, i) => (
                    <div key={s.label} style={{ display: "flex", alignItems: "stretch" }}>
                      <div style={{ paddingRight: i < 3 ? "2.8rem" : "0", paddingLeft: i === 0 ? "0" : "2.8rem" }}>
                        <div style={{ fontSize: "3.2rem", fontWeight: 300, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1 }}>
                          <CountUp to={s.value} suffix={s.suffix} delay={1150 + i * 100} />
                        </div>
                        <div style={{ marginTop: "0.4rem", fontSize: "0.9rem", fontWeight: 400, color: "rgba(15,23,42,0.45)", lineHeight: 1.4 }}>
                          {s.label}
                        </div>
                      </div>
                      {i < 3 && <div style={{ width: "1px", background: "rgba(15,23,42,0.1)", alignSelf: "stretch" }} />}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "0.7rem", flexShrink: 0 }}>
                  {[
                    { icon: "Shield", text: "Отбор проектов" },
                    { icon: "Users", text: "Закрытое сообщество" },
                    { icon: "Zap", text: "Прямые сделки" },
                  ].map((b) => (
                    <div key={b.text} className="transition-all duration-200"
                      style={{ display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.6rem 1.2rem", border: "1px solid rgba(37,99,235,0.18)", background: "rgba(37,99,235,0.05)", borderRadius: "2rem", cursor: "default", whiteSpace: "nowrap" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.4)"; (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(37,99,235,0.18)"; (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.05)"; }}>
                      <Icon name={b.icon as "Shield"} size={15} style={{ color: "#2563eb" }} />
                      <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "rgba(15,23,42,0.65)" }}>{b.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      )}

      {/* Нижнее синее свечение */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "180px", background: "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(37,99,235,0.08) 0%, transparent 75%)", zIndex: 2 }} />
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(37,99,235,0.5) 30%, rgba(37,99,235,0.8) 50%, rgba(37,99,235,0.5) 70%, transparent 100%)", zIndex: 3 }} />
    </div>
  );
}
