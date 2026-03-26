"use client";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(58,58,58,0.2) 13.9%, rgba(228,222,210,0.2) 48.5%, rgba(246,244,241,0.2) 86.6%), linear-gradient(90deg, #e14f40 0%, #e14f40 100%)",
      }}
    >
      {/* Background image with mix-blend-hard-light */}
      <div className="absolute inset-0 w-full h-full mix-blend-hard-light">
        <img
          src="/image-001.png"
          alt=""
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* ── Top-left: Creator Avatars & Tagline ── */}
      <div className="absolute left-8 sm:left-16 top-20 sm:top-[104px] flex flex-col gap-2 z-20">
        <div className="flex items-center border-b border-[#e4ded2] pb-2 pr-2">
          <img
            src="/image-002.png"
            alt="Creator 1"
            className="w-11 h-11 rounded-full border border-[#f6f4f1] object-cover -mr-2"
          />
          <img
            src="/image-003.png"
            alt="Creator 2"
            className="w-11 h-11 rounded-full border border-[#f6f4f1] object-cover -mr-2"
          />
          <img
            src="/image-004.png"
            alt="Creator 3"
            className="w-11 h-11 rounded-full border border-[#f6f4f1] object-cover"
          />
        </div>
        <p
          className="text-white text-base tracking-[0.32px] text-center"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          FOR THE NEXT GEN CREATORS
        </p>
      </div>

      {/* ── Left Stats ── */}
      <div className="absolute left-8 sm:left-16 top-[300px] sm:top-[361px] flex flex-col gap-4 z-20 w-[169px] text-white">
        {/* 500+ */}
        <div className="flex flex-col items-start pb-2 border-b border-[#faf8f5]">
          <p
            className="text-[28px] tracking-[0.56px] leading-[42px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            500+
          </p>
          <p className="text-[19px] font-semibold tracking-[0.38px] leading-[29px] font-[var(--font-figtree)]">
            Active Creators
          </p>
        </div>
        {/* 120K+ */}
        <div className="flex flex-col items-start pb-2 border-b border-[#faf8f5]">
          <p
            className="text-[28px] tracking-[0.56px] leading-[42px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            120K+
          </p>
          <p className="text-[19px] font-semibold tracking-[0.38px] leading-[29px] font-[var(--font-figtree)]">
            Subscriber
          </p>
        </div>
        {/* 1M+ */}
        <div className="flex flex-col items-start pb-2">
          <p
            className="text-[28px] tracking-[0.56px] leading-[42px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            1M+
          </p>
          <p className="text-[19px] font-semibold tracking-[0.38px] leading-[29px] font-[var(--font-figtree)]">
            Content Views
          </p>
        </div>
      </div>

      {/* ── Center: Giant Text ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 backdrop-blur-[12px] pointer-events-none">
        <div className="w-[920px] max-w-[90vw] flex flex-col items-center py-9">
          <div className="w-full flex flex-col items-center justify-center mix-blend-overlay h-[180px] sm:h-[223px]">
            <p
              className="text-[clamp(80px,15vw,220px)] text-[#f6f4f1] tracking-[4.4px] leading-none text-center"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              CREATOR
            </p>
          </div>
          <div className="w-full flex flex-col items-center justify-center h-[160px] sm:h-[202px]">
            <p
              className="text-[clamp(80px,15vw,220px)] text-[#f6f4f1] tracking-[4.4px] leading-none text-center"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              MONETIZE
            </p>
          </div>
        </div>
      </div>

      {/* ── Top-right: Arrow icon ── */}
      <div className="absolute right-8 sm:right-16 top-[130px] sm:top-[155px] z-20">
        <div
          className="w-[72px] h-[72px] rounded-full border-2 border-white/50 flex items-center justify-center rotate-45"
          style={{
            boxShadow:
              "0 0 250px #dc3f1a, 0 0 180px #dc3f1a, 0 0 105px #dc3f1a, 0 0 52px #dc3f1a, 0 0 15px #dc3f1a",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f6f4f1"
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

      {/* ── Bottom-right: Description Text ── */}
      <div className="absolute right-8 sm:right-16 bottom-[80px] sm:bottom-auto sm:top-[630px] w-[214px] z-20">
        <p className="text-base text-white font-bold tracking-[0.32px] leading-[26px] font-[var(--font-figtree)]">
          Join a new wave of creators building income, influence, and impact.
          Unlock exclusive content, connect with your audience, and turn your
          passion into profit.
        </p>
      </div>

      {/* ── Center CTA Button ── */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[40px] sm:bottom-auto sm:top-[694px] z-20">
        <Link
          href="/login"
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-[#ff9465] text-[#f6f4f1] font-normal text-base cursor-pointer hover:scale-105 transition-transform"
          style={{
            fontFamily: "'Lexend', sans-serif",
            backgroundImage:
              "linear-gradient(147deg, #e14517 57.5%, #d6361f 100%)",
            boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.35)",
          }}
        >
          <span>Explore Creators</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 2L10 14M10 2L5 7M10 2L15 7"
              stroke="#f6f4f1"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform="rotate(45, 10, 10)"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
