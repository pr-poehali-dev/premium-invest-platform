import Icon from "@/components/ui/icon";
import { useEffect, useRef, useState } from "react";

/* ─── Custom cursor ─── */
function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", move);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dot}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ width: 6, height: 6, background: "#4f8ef7", borderRadius: "50%" }}
      />
      <div
        ref={ring}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 36,
          height: 36,
          border: "1px solid rgba(79,142,247,0.5)",
          borderRadius: "50%",
        }}
      />
    </>
  );
}

/* ─── Floating particles ─── */
function Particles() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let W = (c.width = window.innerWidth);
    let H = (c.height = window.innerHeight);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2 + 0.2,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      alpha: Math.random() * 0.45 + 0.08,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,142,247,${p.alpha})`;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      }

      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79,142,247,${0.07 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => {
      W = c.width = window.innerWidth;
      H = c.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── Reveal text via clip-path ─── */
function Reveal({
  children,
  delay = 0,
  style,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        ...style,
        clipPath: on ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
        opacity: on ? 1 : 0,
        transform: on ? "translateY(0)" : "translateY(10px)",
        transition: "clip-path 0.85s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Horizontal reveal line ─── */
function HLine({ delay = 0 }: { delay?: number }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        height: "1px",
        background: "rgba(255,255,255,0.1)",
        width: on ? "100%" : "0%",
        transition: "width 1.1s cubic-bezier(0.16,1,0.3,1)",
      }}
    />
  );
}

/* ══════════════════════════════════════════════════════════ */
export default function Index() {
  const [introOut, setIntroOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // Кинематографический intro-экран
  useEffect(() => {
    const t1 = setTimeout(() => setIntroOut(true), 1600);
    const t2 = setTimeout(() => setShowContent(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-montserrat"
      style={{ background: "#07080b", cursor: "none" }}
    >
      <Cursor />
      <Particles />

      {/* ── INTRO SCREEN ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background: "#07080b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          opacity: introOut ? 0 : 1,
          pointerEvents: introOut ? "none" : "all",
          transition: "opacity 0.9s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <span
          className="text-base font-semibold tracking-[0.3em] uppercase"
          style={{ color: "#e8eaf0" }}
        >
          Invest<span style={{ color: "#4f8ef7" }}>Starts</span>
        </span>
        <div style={{ width: 160, height: "1px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              background: "#4f8ef7",
              animation: "progress 1.4s cubic-bezier(0.4,0,0.6,1) forwards",
            }}
          />
        </div>
        <style>{`@keyframes progress { from { width: 0 } to { width: 100% } }`}</style>
      </div>

      {/* ── GRID OVERLAY ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          zIndex: 1,
        }}
      />

      {/* Top vignette glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(59,130,246,0.1) 0%, transparent 65%)",
          zIndex: 1,
        }}
      />

      {showContent && (
        <div style={{ position: "relative", zIndex: 2 }}>
          {/* ── NAV ── */}
          <nav
            className="flex items-center justify-between px-8 md:px-14 py-7"
            style={{
              opacity: showContent ? 1 : 0,
              transition: "opacity 0.8s ease 0.1s",
            }}
          >
            <Reveal delay={100}>
              <span className="text-sm font-semibold tracking-[0.22em] uppercase" style={{ color: "#e8eaf0" }}>
                Invest<span style={{ color: "#4f8ef7" }}>Starts</span>
              </span>
            </Reveal>

            <div className="hidden md:flex items-center gap-9">
              {["стартапам", "как это работает", "преимущества", "отзывы", "faq"].map((item, i) => (
                <Reveal key={item} delay={150 + i * 60}>
                  <a
                    href="#"
                    className="text-xs font-light tracking-widest uppercase transition-colors duration-300"
                    style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.14em" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)")}
                  >
                    {item}
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="flex items-center gap-5">
                <a
                  href="#"
                  className="text-xs font-light tracking-widest uppercase transition-colors duration-300"
                  style={{ color: "rgba(255,255,255,0.32)", letterSpacing: "0.14em" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.32)")}
                >
                  вход
                </a>
                <a
                  href="#"
                  className="text-xs font-medium tracking-wider uppercase px-5 py-2.5 transition-all duration-300"
                  style={{ background: "#4f8ef7", color: "#fff", letterSpacing: "0.08em" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#3a7ae0")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4f8ef7")}
                >
                  я стартап — продать проект
                </a>
              </div>
            </Reveal>
          </nav>

          {/* ── HERO ── */}
          <div className="flex flex-col items-center text-center px-6 pt-10 pb-24">

            {/* Badge */}
            <Reveal delay={350}>
              <div
                className="inline-flex items-center gap-2.5 text-xs font-light tracking-widest px-5 py-2 mb-14"
                style={{
                  background: "rgba(79,142,247,0.06)",
                  border: "1px solid rgba(79,142,247,0.16)",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.16em",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4f8ef7" }} />
                128 инвесторов на платформе
              </div>
            </Reveal>

            {/* Headline */}
            <div className="max-w-5xl mb-16">
              <Reveal delay={500}>
                <h1
                  style={{
                    fontSize: "clamp(2rem, 5.2vw, 4rem)",
                    fontWeight: 300,
                    color: "rgba(228,231,242,0.85)",
                    letterSpacing: "0.05em",
                    lineHeight: 1.1,
                    margin: "0 0 0.25rem",
                  }}
                >
                  Инвестируйте в IT-стартапы,
                </h1>
              </Reveal>

              <Reveal delay={680}>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <Icon name="ArrowUpRight" size={38} style={{ color: "#4f8ef7", flexShrink: 0 }} />
                  <h1
                    style={{
                      fontSize: "clamp(2rem, 5.2vw, 4rem)",
                      fontWeight: 300,
                      color: "#4f8ef7",
                      letterSpacing: "0.05em",
                      lineHeight: 1.1,
                      margin: 0,
                    }}
                  >
                    которые изменят будущее
                  </h1>
                </div>
              </Reveal>
            </div>

            {/* Columns with line reveal */}
            <div className="w-full max-w-4xl mb-16">
              <HLine delay={900} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
                {[
                  { title: "InvestStarts", text: "инвестиционная платформа с предварительным отбором проектов." },
                  { title: "Demo Day", text: "для знакомства." },
                  { title: "Закрытая среда", text: "для сделок, аналитики и прямых контактов." },
                ].map((col, i) => (
                  <Reveal key={col.title} delay={1000 + i * 100}>
                    <div
                      className="px-8 py-7 text-left"
                      style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
                    >
                      <p
                        className="text-xs font-semibold tracking-widest uppercase mb-3"
                        style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.18em" }}
                      >
                        {col.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.48)", fontWeight: 300, lineHeight: 1.75 }}
                      >
                        {col.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
              <HLine delay={1100} />
            </div>

            {/* CTA */}
            <Reveal delay={1250}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#"
                  className="text-xs font-light tracking-widest uppercase px-9 py-3.5 transition-all duration-400 group relative overflow-hidden"
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(255,255,255,0.16)",
                    letterSpacing: "0.14em",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.38)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  подать заявку стартапу
                </a>
                <a
                  href="#"
                  className="text-xs font-medium tracking-widest uppercase px-9 py-3.5 transition-all duration-300 relative overflow-hidden"
                  style={{ background: "#4f8ef7", color: "#fff", letterSpacing: "0.14em" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#3a7ae0";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "#4f8ef7";
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  }}
                >
                  стать инвестором
                </a>
              </div>
            </Reveal>

            {/* Bottom trust row */}
            <Reveal delay={1400}>
              <div className="flex items-center gap-8 mt-16">
                {[
                  { icon: "Shield", text: "Предварительный отбор проектов" },
                  { icon: "Users", text: "Закрытое сообщество" },
                  { icon: "Zap", text: "Прямой доступ к сделкам" },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2">
                    <Icon name={b.icon as "Shield"} size={13} style={{ color: "rgba(79,142,247,0.55)" }} />
                    <span className="text-xs font-light" style={{ color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>
                      {b.text}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      )}

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.2), transparent)", zIndex: 2 }}
      />
    </div>
  );
}
