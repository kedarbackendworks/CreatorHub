"use client";

const categories = [
  "DESIGN",
  "FITNESS",
  "TECH",
  "MUSIC",
  "BUSINESS",
  "LIFESTYLE",
  "CONTENT",
  "EDUCATION",
];

export default function Marquee() {
  const items = [...categories, ...categories]; // duplicate for seamless loop

  return (
    <section className="w-full bg-[#f6f4f1] overflow-hidden relative z-10 border-t border-b border-[#e4ded2]">
      <div
        className="flex items-center gap-8 py-5 animate-marquee whitespace-nowrap"
        style={{ alignSelf: "stretch" }}
      >
        {items.map((cat, i) => (
          <div key={i} className="flex items-center gap-8 shrink-0">
            <span
              className="text-[28px] text-[#3a3a3a] tracking-[0.56px] leading-[42px] whitespace-nowrap"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              {cat}
            </span>
            <span className="text-[#3a3a3a] text-2xl leading-none">✱</span>
          </div>
        ))}
      </div>
    </section>
  );
}
