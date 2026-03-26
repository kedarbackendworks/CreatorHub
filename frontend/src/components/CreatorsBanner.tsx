import Link from "next/link";

export default function CreatorsBanner() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-[63px] pb-16 md:pb-[140px]">
      <div
        className="flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-between p-8 md:p-16 rounded-[24px] w-full"
        style={{
          backgroundImage: "linear-gradient(125.955deg, rgb(225, 69, 23) 57.525%, rgb(214, 54, 31) 100%)",
        }}
      >
        <div className="flex flex-col gap-4 text-white max-w-[600px]">
          <h2
            className="text-[32px] md:text-[40px] tracking-[0.8px] leading-[1.2]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            OUR CREATORS ARE BUILDING REAL BUSINESSES
          </h2>
          <p
            className="text-[#e4ded2] text-[16px] md:text-[18px] tracking-[0.26px] leading-[1.4]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            From courses to coaching programs, creators on our platform are generating
            income, building communities, and scaling their impact globally.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-4 shrink-0">
          <Link href="/login" className="bg-[#f6f4f1] border border-[#ff9465] text-[#1a1a1a] flex items-center justify-center gap-2 px-6 py-4 rounded-full shadow-[8px_8px_20px_0px_rgba(69,9,0,0.16)] hover:bg-white transition-colors duration-300">
            <span
              className="font-normal text-[16px]"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              Explore All Creators
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-rotate-45"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <p
            className="text-[#e4ded2] text-[13px] tracking-[0.26px] font-medium text-center md:text-right"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            Join 10,000+ learners growing every day
          </p>
        </div>
      </div>
    </section>
  );
}
