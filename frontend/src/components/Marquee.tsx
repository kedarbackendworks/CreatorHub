"use client";

const categories = [
  "DESIGN", "FITNESS", "TECH", "MUSIC",
  "BUSINESS", "LIFESTYLE", "CONTENT", "EDUCATION",
];

export default function Marquee() {
  const items = [...categories, ...categories, ...categories];

  return (
    <div className="relative w-full z-20 flex flex-col justify-center -my-4 md:-my-8" style={{ overflowX: "clip" }}>
      {/* INNER BANNER */}
      <section
        className="w-[110%] -ml-[5%] bg-[#f6f4f1] border-t border-b border-[#e4ded2]"
        style={{ transform: "rotate(1.64deg) scaleX(1.02)" }}
      >
        <div className="flex items-center gap-8 py-5 whitespace-nowrap marquee-track">
          {items.map((cat, i) => (
            <div key={i} className="flex items-center gap-8 shrink-0">
              <span
                className="text-[28px] text-[#3a3a3a] tracking-[0.56px] leading-[42px]"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                {cat}
              </span>
              <span className="text-[#3a3a3a] text-2xl leading-none">✱</span>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .marquee-track {
          animation: marquee-scroll 25s linear infinite;
          will-change: transform;
        }
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}