"use client";

export default function FeaturedCreatorsHeader() {
  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-[63px] py-16 md:py-[60px]">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        
        {/* Left Side: Headings */}
        <div className="flex flex-col w-full lg:w-auto">
          <p
            className="text-[#3a3a3a] text-[16px] uppercase tracking-[0.32px] leading-[25.8px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            FEATURED CREATORS
          </p>
          <div className="mt-4 md:mt-6 sm:pl-[175px]">
            <p
              className="text-[#1a1a1a] text-[32px] md:text-[40px] tracking-[0.8px] leading-[1.2] md:leading-[57.6px] max-w-[508px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Meet the Creators Who Are Redefining the Digital Economy
            </p>
          </div>
        </div>

        {/* Right Side: Description and Subscribe Button */}
        <div className="flex flex-col items-start lg:items-end gap-[32px] w-full lg:w-auto max-w-[508px] lg:max-w-[411px] mt-12 lg:mt-4">
          <p
            className="text-[#5a5a5a] text-[16px] md:text-[19px] font-semibold tracking-[0.38px] leading-[1.5] md:leading-[29.2px] text-left lg:text-right"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            Learn from industry experts, discover new perspectives, and gain access
            to high-quality content designed to help you succeed.
          </p>
          
          <button
            className="bg-[#f6f4f1] border border-[#ff9465] px-[16px] py-[12px] rounded-[42px] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.16)] transition-transform hover:scale-105"
          >
            <span
              className="text-[#1a1a1a] text-[16px] font-normal tracking-wide whitespace-nowrap"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              SUBSCRIBE
            </span>
          </button>
        </div>
        
      </div>
    </section>
  );
}
