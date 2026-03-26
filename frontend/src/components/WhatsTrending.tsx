"use client";

const cards = [
  {
    title: "Build a High-Income Design Career",
    description:
      "Learn how to master UI/UX design through real-world projects, case studies, and client workflows that prepare you for industry-level work.",
    image: "/image-005.png",
    layout: "title-top" as const,
    bg: "bg-[#2f2f2f]",
  },
  {
    title: "Create and Sell Digital Courses",
    description:
      "Turn your knowledge into structured learning experiences. Build, launch, and scale your own courses with ease.",
    image: "/image-006.png",
    layout: "image-top" as const,
    bg: "",
    gradient: true,
  },
  {
    title: "Monetize Your Audience Effectively",
    description:
      "Unlock multiple income streams through subscriptions, coaching, premium content, and community engagement.",
    image: "/image-007.png",
    layout: "title-top" as const,
    bg: "bg-[#2f2f2f]",
  },
];

function ArrowIcon() {
  return (
    <div className="w-[62px] h-[62px] rounded-full border-2 border-[#f2f2f2]/40 flex items-center justify-center rotate-45 shrink-0">
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
  );
}

export default function WhatsTrending() {
  return (
    <section className="w-full bg-[#121212] px-8 sm:px-16 py-16 sm:py-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-10">
        {/* Left label */}
        <p
          className="text-[#d6d6d6] text-base tracking-[0.32px] leading-[26px] shrink-0"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          WHAT&apos;S TRENDING
        </p>

        {/* Center heading */}
        <h2
          className="text-[#f2f2f2] text-[32px] sm:text-[40px] tracking-[0.8px] leading-[1.44] text-center max-w-[670px] mx-auto"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          Discover High-Value Content Designed to Help You Learn, Grow, and
          Succeed
        </h2>

        {/* View All button */}
        <button
          className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] bg-[#121212] text-[#f2f2f2] text-base cursor-pointer self-end sm:self-auto shrink-0 hover:bg-[#1e1e1e] transition-colors"
          style={{
            fontFamily: "'Lexend', sans-serif",
            boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)",
          }}
        >
          <span>View All</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f2f2f2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2L13 10L21 10" />
            <path d="M21 10L13 2" />
            <path d="M3 12A9 9 0 1 0 12 3" />
          </svg>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`rounded-[28px] overflow-hidden p-4 flex flex-col gap-[10px] ${
              card.gradient ? "" : card.bg
            }`}
            style={
              card.gradient
                ? {
                    backgroundImage:
                      "linear-gradient(105deg, #e14517 57.5%, #d6361f 100%)",
                  }
                : undefined
            }
          >
            {card.layout === "title-top" ? (
              <>
                {/* Title + Arrow */}
                <div className="flex items-center justify-between">
                  <h3
                    className="text-[#f2f2f2] text-[28px] tracking-[0.56px] leading-[42px] max-w-[247px]"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <ArrowIcon />
                </div>
                {/* Description */}
                <p className="text-[#b8b8b8] text-base font-medium tracking-[0.32px] leading-[26px] font-[var(--font-figtree)]">
                  {card.description}
                </p>
                {/* Image */}
                <div className="flex-1 min-h-[280px] rounded-xl overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Image on top */}
                <div className="h-[341px] rounded-xl overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Title + Arrow */}
                <div className="flex items-center justify-between">
                  <h3
                    className="text-[#f2f2f2] text-[28px] tracking-[0.56px] leading-[42px] max-w-[247px]"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <ArrowIcon />
                </div>
                {/* Description */}
                <p className="text-[#d6d6d6] text-base font-medium tracking-[0.32px] leading-[26px] font-[var(--font-figtree)]">
                  {card.description}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
