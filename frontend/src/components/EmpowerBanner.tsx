"use client";

export default function EmpowerBanner() {
  return (
    <section className="w-full bg-[#121212] relative" style={{ padding: "164px 65px 164px 83px" }}>
      {/* Arrow icon top-right — positioned per Figma: top 42px, right ~65px */}
      <div className="absolute" style={{ top: "42px", right: "65px" }}>
        <div className="w-[62px] h-[62px] rounded-full border-2 border-[#f2f2f2]/40 flex items-center justify-center rotate-45">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f2f2f2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="8 12 12 8 16 12" />
            <line x1="12" y1="16" x2="12" y2="8" />
          </svg>
        </div>
      </div>

      {/* Main text — max-width 1288px as per Figma */}
      <div className="max-w-[1288px] mx-auto">
        <p
          className="text-[#f2f2f2] text-[28px] sm:text-[36px] lg:text-[48px] tracking-[0.96px] leading-[1.41] text-center"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          WE EMPOWER{" "}
          <span className="text-[#ff7a6c]">CREATORS</span> TO TURN IDEAS INTO
          INCOME AND PASSION INTO PROFITS FROM ASPIRING BEGINNERS TO EXPERIENCED
          PROFESSIONALS, OUR PLATFORM IS{" "}
          <span className="text-[#ff7a6c]">DESIGNED</span> TO SUPPORT EVERY
          STAGE OF YOUR JOURNEY HELPING YOU GROW FASTER AND SMARTER.
        </p>
      </div>
    </section>
  );
}
