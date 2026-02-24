import Icon from "@/components/ui/icon";
import { useEffect, useState } from "react";

export default function Index() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const cls = (ms: number) =>
    `transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`;

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-montserrat"
      style={{ background: "#08090c" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Blue radial glow top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% -5%, rgba(59,130,246,0.09) 0%, transparent 65%)",
        }}
      />

      {/* ── NAV ── */}
      <nav
        className="relative z-10 flex items-center justify-between px-8 md:px-14 py-7"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-8px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <span
          className="text-sm font-semibold tracking-[0.2em] uppercase"
          style={{ color: "#e8eaf0" }}
        >
          Invest<span style={{ color: "#4f8ef7" }}>Starts</span>
        </span>

        <div className="hidden md:flex items-center gap-9 text-xs font-light tracking-widest uppercase">
          {["стартапам", "как это работает", "преимущества", "отзывы", "faq"].map((item) => (
            <a
              key={item}
              href="#"
              className="transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-xs font-light tracking-widest uppercase transition-colors duration-200"
            style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.14em" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.35)")}
          >
            вход
          </a>
          <a
            href="#"
            className="text-xs font-medium tracking-wider uppercase px-5 py-2.5 transition-all duration-300 hover:opacity-90"
            style={{
              background: "#4f8ef7",
              color: "#fff",
              letterSpacing: "0.08em",
            }}
          >
            я стартап — продать проект
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-8 pb-24">

        {/* Badge */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            marginBottom: "3rem",
          }}
        >
          <span
            className="inline-flex items-center gap-2.5 text-xs font-light tracking-widest px-5 py-2"
            style={{
              background: "rgba(79,142,247,0.07)",
              border: "1px solid rgba(79,142,247,0.18)",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.15em",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#4f8ef7" }}
            />
            128 инвесторов на платформе
          </span>
        </div>

        {/* Headline line 1 */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 3.9rem)",
              fontWeight: 300,
              color: "rgba(228,231,240,0.88)",
              letterSpacing: "0.05em",
              lineHeight: 1.1,
              margin: 0,
              marginBottom: "0.3rem",
            }}
          >
            Инвестируйте в IT-стартапы,
          </h1>
        </div>

        {/* Headline line 2 */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            marginBottom: "5rem",
          }}
        >
          <Icon name="ArrowUpRight" size={36} style={{ color: "#4f8ef7", flexShrink: 0 }} />
          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 3.9rem)",
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

        {/* Three columns */}
        <div
          className="w-full max-w-4xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
            marginBottom: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          {[
            {
              title: "InvestStarts",
              text: "инвестиционная платформа с предварительным отбором проектов.",
            },
            {
              title: "Demo Day",
              text: "для знакомства.",
            },
            {
              title: "Закрытая среда",
              text: "для сделок, аналитики и прямых контактов.",
            },
          ].map((col, i) => (
            <div
              key={col.title}
              className="px-8 py-6 text-left"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.1)",
                borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.18em" }}
              >
                {col.title}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.5)", fontWeight: 300, lineHeight: 1.7 }}
              >
                {col.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
            transition: "opacity 0.7s ease 0.75s, transform 0.7s ease 0.75s",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <a
            href="#"
            className="text-xs font-light tracking-widest uppercase px-9 py-3.5 transition-all duration-300"
            style={{
              color: "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.18)",
              letterSpacing: "0.14em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.9)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.65)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)";
            }}
          >
            подать заявку стартапу
          </a>
          <a
            href="#"
            className="text-xs font-medium tracking-widest uppercase px-9 py-3.5 transition-all duration-300 hover:opacity-85"
            style={{
              background: "#4f8ef7",
              color: "#fff",
              letterSpacing: "0.14em",
            }}
          >
            стать инвестором
          </a>
        </div>
      </div>

      {/* Bottom separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(79,142,247,0.25), transparent)" }}
      />
    </div>
  );
}
