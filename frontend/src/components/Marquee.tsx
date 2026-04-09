"use client";

const categories = [
  "DESIGN", "FITNESS", "TECH", "MUSIC",
  "BUSINESS", "LIFESTYLE", "CONTENT", "EDUCATION",
];

function AsteriskIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2V22M12 2L7 7M12 2L17 7M12 22L7 17M12 22L17 17M2 12H22M2 12L7 7M2 12L7 17M22 12L17 7M22 12L17 17"
        stroke="#3a3a3a"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Marquee({ animate = true }: { animate?: boolean }) {
  const unit = [...categories];

  const renderUnit = (keyPrefix: string, hidden = false) => (
    <div
      aria-hidden={hidden ? true : undefined}
      className="inline-flex h-full items-center whitespace-nowrap"
    >
      {unit.map((cat, i) => (
        <div
          key={`${keyPrefix}-${i}`}
          className="flex shrink-0 items-center gap-3 md:gap-8"
        >
          <span
            className="text-[#3a3a3a]"
            style={{
              fontFamily: "'Fjalla One', sans-serif",
              fontSize: "clamp(22px, 2vw, 28px)",
              fontWeight: 400,
              lineHeight: "1.5",
              letterSpacing: "0.02em",
            }}
          >
            {cat}
          </span>
          <AsteriskIcon className="size-5 shrink-0 text-[#3a3a3a] md:size-8" />
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative z-20 w-full overflow-x-clip">
        <div className="relative left-1/2 w-[calc(100%+80px)] -translate-x-1/2 -rotate-[1.5deg] overflow-hidden border-y border-[#d9d3c8] bg-[#e4ded2]">
          <div
            className={`marquee-track inline-flex h-[56px] min-w-max items-center whitespace-nowrap px-4 leading-none md:h-[74px] md:px-6 ${animate ? "marquee-slide" : ""}`}
            style={{ gap: "16px" }}
          >
            {renderUnit("primary")}
            {renderUnit("clone", true)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-slide {
          animation: marquee-slide 45s linear infinite;
          will-change: transform;
        }
      `}</style>
    </>
  );
}