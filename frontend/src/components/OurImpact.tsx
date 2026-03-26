"use client";
import Link from "next/link";

const impacts = [
  {
    label: "CREATOR SUCCESS MILESTONE",
    title: "10,000+ Creators Successfully Launched Their Digital Businesses",
    buttonText: "Explore Creator",
  },
  {
    label: "PLATFORM GROWTH",
    title: "₹1 Crore+ Earned by Creators Through Subscriptions and Content",
    buttonText: "Join as Creator",
  },
  {
    label: "COMMUNITY IMPACT",
    title: "120,000+ Active Learners Engaging With Premium Content",
    buttonText: "Join as Creator",
  },
  {
    label: "PRODUCT INNOVATION",
    title: "All-in-One Platform for Content, Community, and Monetization",
    buttonText: "Join as Creator",
  },
];

export default function OurImpact() {
  return (
    <section className="w-full bg-[#121212] px-8 sm:px-16 py-16 sm:py-20 relative">
      <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row gap-12 xl:gap-24 relative z-10">
        
        {/* Left column: "OUR IMPACT" text */}
        <div className="shrink-0 xl:w-[200px]">
          <p
            className="text-[#d6d6d6] text-base tracking-[0.32px] leading-[26px] whitespace-nowrap"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            OUR IMPACT
          </p>
        </div>

        {/* Right side content */}
        <div className="flex flex-col gap-14 flex-1 max-w-[900px]">
          <div className="flex flex-col gap-4 max-w-[700px]">
            <h2
              className="text-[#f2f2f2] text-[32px] sm:text-[40px] tracking-[0.8px] leading-[1.44]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Celebrating Excellence in the Creator <span className="text-[#d6d6d6]">Economy.</span>
            </h2>
            <p className="text-[#b8b8b8] text-base font-medium tracking-[0.32px] leading-[26px] font-[var(--font-figtree)] max-w-[550px]">
              We are proud to empower creators and learners worldwide by building
              a platform that drives real growth, income, and impact across industries.
            </p>
          </div>

          <div className="flex flex-col w-full">
            {impacts.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-[#3a3a3a]"
              >
                <div className="flex flex-col gap-2 max-w-[600px]">
                  <p className="text-[#f95c4b] text-base font-medium tracking-[0.32px] leading-[26px] font-[var(--font-figtree)]">
                    {item.label}
                  </p>
                  <h3
                    className="text-[#d6d6d6] text-[24px] sm:text-[28px] tracking-[0.56px] leading-[1.3]"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                </div>

                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] bg-[#121212] text-[#f2f2f2] text-base cursor-pointer self-start md:self-auto shrink-0 hover:bg-[#1e1e1e] transition-colors"
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)",
                  }}
                >
                  <span className="whitespace-nowrap">{item.buttonText}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 3.82-13 1.5 1.5 0 0 1 2.18 2.18A22 22 0 0 1 12 15Z" />
                    <path d="M9 12H4.8a5 5 0 0 0-3.8 1.5l3.8 3.8" />
                    <path d="M12 15v4.2a5 5 0 0 0 1.5 3.8l3.8-3.8" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
