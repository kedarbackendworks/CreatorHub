"use client";

const stats = [
  {
    label: "Successful Creator Launches",
    value: "86%",
    width: "85%",
    color: "bg-[#f95c4b]",
  },
  {
    label: "Monetization Success Rate",
    value: "76%",
    width: "76%",
    color: "bg-[#d8d1c7]",
  },
  {
    label: "Monetization Success Rate",
    value: "88%",
    width: "88%",
    color: "bg-[#9a9a9a]",
  },
];

export default function WhyCreatorHub() {
  return (
    <section className="w-full bg-[#f6f4f1] px-8 sm:px-16 py-16 sm:py-[72px] overflow-hidden relative">
      {/* Triangle decoration behind the center image */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] pointer-events-none hidden lg:block">
        <div className="w-full h-full rotate-[22deg]">
          <svg viewBox="0 0 520 600" fill="none" className="w-full h-full">
            <polygon
              points="260,0 520,600 0,600"
              stroke="#f95c4b"
              strokeWidth="3"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 lg:gap-4 items-start relative z-10 max-w-[1440px] mx-auto">
        {/* ── Left Column: Text & Features ── */}
        <div className="flex flex-col gap-4 max-w-[586px]">
          <p
            className="text-[#3a3a3a] text-base tracking-[0.32px] leading-[26px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            WHY CREATORHUB
          </p>

          <div className="flex flex-col gap-2">
            <h2
              className="text-[#1a1a1a] text-[32px] sm:text-[40px] tracking-[0.8px] leading-[1.44]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Where Creativity Meets Opportunity and Growth Becomes Scalable
            </h2>
            <p className="text-[#5a5a5a] text-base font-medium tracking-[0.32px] leading-[26px] max-w-[568px] font-[var(--font-figtree)]">
              We provide everything you need to transform your skills into a
              sustainable creator business from content tools to monetization
              systems.
            </p>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-[#f95c4b] flex items-center justify-center shadow-[-1px_2px_4px_rgba(0,0,0,0.25)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M15 9h.01" />
                </svg>
              </div>
              <span
                className="text-[#5a5a5a] text-base tracking-[0.32px]"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                OVER 10+ YEAR OF EXPERIENCE
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-[#e4ded2] flex items-center justify-center shadow-[-1px_2px_4px_rgba(0,0,0,0.25)]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#5a5a5a"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="M15 9h.01" />
                </svg>
              </div>
              <span
                className="text-[#5a5a5a] text-base tracking-[0.32px]"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                ALL-IN PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* ── Center Column: Skateboarder Image ── */}
        <div className="relative w-full lg:w-[500px] h-[500px] lg:h-[660px] flex items-center justify-center mx-auto lg:mx-0 -mt-4">
          <img
            src="/assets/images/unsplash_A3radfdQtJo.png"
            alt="Creator with skateboard"
            className="relative z-10 h-full w-full object-cover object-top"
          />
        </div>

        {/* ── Right Column: Photo + Stats ── */}
        <div className="flex flex-col gap-4 max-w-[343px] justify-self-end">
          {/* Small photo */}
          <div className="w-full h-[160px] rounded-2xl overflow-hidden">
            <img
              src="/assets/images/Frame 2147243567.png"
              alt="Beach scene"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats with progress bars */}
          <div className="flex flex-col gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[#1a1a1a] text-base tracking-[0.32px]"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="text-black text-base tracking-[0.32px]"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                </div>
                <div className="w-full bg-white rounded-full p-px">
                  <div
                    className={`h-[5px] rounded-full ${stat.color}`}
                    style={{ width: stat.width }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-[#5a5a5a] text-base font-medium tracking-[0.32px] leading-[26px] font-[var(--font-figtree)]">
            Our platform empowers creators to launch, grow, and monetize their
            content effectively. With high engagement rates and proven success
            metrics, CreatorHub ensures both creators and learners achieve real,
            measurable results.
          </p>
        </div>
      </div>
    </section>
  );
}
