import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const stats = [
  { value: 847, suffix: "M+", label: "Активы под управлением", prefix: "$" },
  { value: 32, suffix: "%", label: "Средняя доходность", prefix: "+" },
  { value: 12400, suffix: "+", label: "Инвесторов", prefix: "" },
  { value: 99, suffix: ".8%", label: "Надёжность", prefix: "" },
];

const chartPoints = [
  { x: 0, y: 80 },
  { x: 60, y: 70 },
  { x: 120, y: 75 },
  { x: 180, y: 50 },
  { x: 240, y: 55 },
  { x: 300, y: 30 },
  { x: 360, y: 35 },
  { x: 420, y: 15 },
  { x: 480, y: 20 },
  { x: 540, y: 5 },
];

function AnimatedCounter({ target, suffix, prefix }: { target: number; suffix: string; prefix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1800;
          const step = target / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("ru-RU")}{suffix}
    </span>
  );
}

const polylinePoints = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");
const areaPoints = `0,80 ${polylinePoints} 540,80`;

export default function Index() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-montserrat"
      style={{ background: "linear-gradient(135deg, #080808 0%, #0d0d0d 50%, #0a0808 100%)" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div
        className="absolute animate-glow-pulse pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          top: "-100px",
          right: "-100px",
          background: "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute animate-glow-pulse pointer-events-none"
        style={{
          width: "400px",
          height: "400px",
          bottom: "50px",
          left: "-80px",
          background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
          animationDelay: "2s",
        }}
      />

      {/* Nav */}
      <nav
        className={`relative z-10 flex items-center justify-between px-8 md:px-16 py-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #C9A84C, #9A7A32)",
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
          <span className="text-white font-semibold text-lg tracking-widest uppercase">
            Apex <span style={{ color: "#C9A84C" }}>Capital</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider uppercase">
          {["Стратегии", "Результаты", "О нас"].map((item) => (
            <a
              key={item}
              href="#"
              className="transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.45)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >
              {item}
            </a>
          ))}
        </div>

        <a
          href="#"
          className="text-sm font-semibold tracking-widest uppercase px-5 py-2.5 transition-all duration-300"
          style={{
            color: "#C9A84C",
            border: "1px solid rgba(201,168,76,0.4)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.1)";
            (e.currentTarget as HTMLElement).style.borderColor = "#C9A84C";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)";
          }}
        >
          Войти
        </a>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 pt-8 pb-12 lg:pt-12 min-h-[calc(100vh-88px)] gap-12">

        {/* Left: Text */}
        <div className="flex-1 max-w-xl">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold tracking-widest uppercase transition-all duration-700 ${visible ? "animate-fade-in" : "opacity-0"}`}
            style={{
              border: "1px solid rgba(201,168,76,0.35)",
              color: "#C9A84C",
              background: "rgba(201,168,76,0.06)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-glow-pulse"
              style={{ background: "#C9A84C" }}
            />
            Лицензированная платформа · ЦБ РФ
          </div>

          {/* Headline */}
          <h1
            className={`font-black leading-none mb-6 text-white transition-all duration-700 ${visible ? "animate-fade-in-d1" : "opacity-0"}`}
            style={{
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              letterSpacing: "-0.02em",
              opacity: visible ? undefined : 0,
            }}
          >
            Инвестиции нового{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #C9A84C, #E2C97E, #C9A84C)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              поколения
            </span>
          </h1>

          <p
            className={`text-base md:text-lg leading-relaxed mb-10 transition-all duration-700 ${visible ? "animate-fade-in-d2" : "opacity-0"}`}
            style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300, opacity: visible ? undefined : 0 }}
          >
            Управляйте капиталом на платформе, которой доверяют тысячи инвесторов.
            Алгоритмические стратегии, прозрачная отчётность и доходность выше рынка.
          </p>

          {/* CTA buttons */}
          <div
            className={`flex flex-wrap gap-4 mb-14 transition-all duration-700 ${visible ? "animate-fade-in-d3" : "opacity-0"}`}
            style={{ opacity: visible ? undefined : 0 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-bold text-sm tracking-widest uppercase transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #C9A84C, #9A7A32)",
                color: "#0a0a0a",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #E2C97E, #C9A84C)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #C9A84C, #9A7A32)";
              }}
            >
              Начать инвестировать
              <Icon name="ArrowRight" size={16} />
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2.5 px-8 py-4 font-semibold text-sm tracking-widest uppercase transition-all duration-300"
              style={{
                color: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              }}
            >
              <Icon name="Play" size={14} />
              Смотреть демо
            </a>
          </div>

          {/* Stats row */}
          <div
            className={`grid grid-cols-2 gap-x-8 gap-y-6 transition-all duration-700 ${visible ? "animate-fade-in-d4" : "opacity-0"}`}
            style={{ opacity: visible ? undefined : 0 }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="text-2xl md:text-3xl font-black mb-1"
                  style={{ color: "#C9A84C", letterSpacing: "-0.02em" }}
                >
                  <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart infographic */}
        <div
          className={`flex-1 max-w-lg w-full transition-all duration-700 ${visible ? "animate-fade-in-d2" : "opacity-0"}`}
          style={{ opacity: visible ? undefined : 0 }}
        >
          <div
            className="relative animate-float"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(201,168,76,0.15)",
              padding: "2rem",
            }}
          >
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Портфель · Всё время
                </div>
                <div className="text-2xl font-black text-white">
                  $2 847 430
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold"
                style={{
                  background: "rgba(34,197,94,0.1)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <Icon name="TrendingUp" size={14} />
                +32.4%
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative mb-6">
              <svg
                viewBox="0 0 540 100"
                className="w-full"
                style={{ height: "140px" }}
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#9A7A32" />
                    <stop offset="100%" stopColor="#E2C97E" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                {[20, 40, 60, 80].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="540"
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="1"
                  />
                ))}

                {/* Area fill */}
                <polygon
                  points={areaPoints}
                  fill="url(#chartGradient)"
                />

                {/* Line */}
                <polyline
                  points={polylinePoints}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  style={{
                    strokeDasharray: "1000",
                    strokeDashoffset: "0",
                    animation: "chart-draw 2.5s ease-out 0.5s both",
                  }}
                />

                {/* Last point dot */}
                <circle cx="540" cy="5" r="5" fill="#E2C97E" filter="url(#glow)" />
                <circle cx="540" cy="5" r="10" fill="rgba(226,201,126,0.2)" className="animate-glow-pulse" />
              </svg>
            </div>

            {/* Mini cards */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "BarChart3", label: "Акции", val: "+28%", color: "#C9A84C" },
                { icon: "Globe", label: "Облигации", val: "+12%", color: "#94a3b8" },
                { icon: "Zap", label: "Крипто", val: "+67%", color: "#a78bfa" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 flex flex-col gap-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <Icon name={item.icon as "BarChart3"} size={16} style={{ color: item.color }} />
                  <div className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>{item.label}</div>
                  <div className="text-sm font-bold" style={{ color: item.color }}>{item.val}</div>
                </div>
              ))}
            </div>

            {/* Corner decoration */}
            <div
              className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(225deg, rgba(201,168,76,0.15) 0%, transparent 60%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none"
              style={{
                background: "linear-gradient(45deg, rgba(201,168,76,0.08) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* Bottom trust badges */}
          <div className="flex items-center gap-6 mt-6 justify-center">
            {[
              { icon: "Shield", text: "Защита активов" },
              { icon: "Lock", text: "256-bit шифрование" },
              { icon: "Award", text: "ЦБ РФ лицензия" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5">
                <Icon name={b.icon as "Shield"} size={12} style={{ color: "rgba(201,168,76,0.6)" }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {b.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)" }}
      />
    </div>
  );
}
