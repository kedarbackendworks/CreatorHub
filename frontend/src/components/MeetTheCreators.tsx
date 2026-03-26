"use client";

import React from "react";
import Image from "next/image";

export default function MeetTheCreators() {
  return (
    <section className="w-full bg-[#f6f4f1] px-[64px] py-16 sm:py-24">
      <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row items-center xl:items-end justify-between gap-12 xl:gap-20">
        
        {/* Left Side: Text and Stats */}
        <div className="flex flex-col gap-8 lg:gap-12 w-full xl:w-[508px] shrink-0">
          <div className="flex flex-col gap-4">
            <p
              className="text-[#1a1a1a] text-base tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              MEET THE CREATORS
            </p>
            <h2
              className="text-[#1a1a1a] text-[32px] sm:text-[40px] tracking-[0.8px] leading-[1.2]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              A Community of Creators, Innovators, and Industry Experts
            </h2>
            <p
              className="text-[#5a5a5a] text-base font-medium tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              Our platform brings together passionate creators from across the globe
              designers, developers, fitness coaches, educators, and more all dedicated
              to sharing knowledge, building communities, and creating meaningful impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 w-full">
            <div className="flex flex-col gap-2 flex-1">
              <p
                className="text-[#1a1a1a] text-[40px] tracking-[0.8px] leading-[1.2]"
                style={{
                  fontFamily: "'Fjalla One', sans-serif",
                  textShadow: "0px 4px 4px #e4ded2",
                }}
              >
                300+
              </p>
              <p
                className="text-[#5a5a5a] text-base tracking-[0.32px] leading-[26px]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Active Creators Across Multiple Categories
              </p>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <p
                className="text-[#1a1a1a] text-[40px] tracking-[0.8px] leading-[1.2]"
                style={{
                  fontFamily: "'Fjalla One', sans-serif",
                  textShadow: "0px 4px 4px #e4ded2",
                }}
              >
                200+
              </p>
              <p
                className="text-[#5a5a5a] text-base tracking-[0.32px] leading-[26px]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Premium Courses & Programs Created
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Image Grid */}
        <div className="flex gap-4 h-[420px] shrink-0 w-full xl:w-auto overflow-x-auto snap-x pb-4 xl:pb-0 scrollbar-hide">
          {/* Image 1 */}
          <div className="relative w-[126px] sm:w-[150px] shrink-0 h-full rounded-[16px] overflow-hidden snap-center">
            <img
              src="/assets/images/Frame 2147243634.png"
              alt="Creator 1"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Image 2 */}
          <div className="relative w-[126px] sm:w-[150px] shrink-0 h-full rounded-[16px] overflow-hidden snap-center">
            <img
              src="/assets/images/Frame 2147243635.png"
              alt="Creator 2"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Image 3 with Glassmorphism Card */}
          <div className="relative w-[236px] sm:w-[280px] shrink-0 h-full rounded-[16px] overflow-hidden flex flex-col justify-end p-3 snap-center">
            <img
              src="/assets/images/Frame 2147243636.png"
              alt="Aarav Sharma"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="relative z-10 w-full p-4 rounded-xl bg-[#f6f4f1]/10 backdrop-blur-[12px] flex flex-col gap-1 border border-white/10">
              <p
                className="text-[#e4ded2] text-base tracking-[0.32px] leading-tight"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                Aarav Sharma
              </p>
              <p
                className="text-[#f6f4f1] text-[15px] font-medium tracking-[0.32px] leading-tight"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                UI/UX Designer
              </p>
              <p
                className="text-[#f6f4f1]/90 text-[13px] font-medium tracking-[0.26px] leading-[1.4] mt-1 line-clamp-3"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Helping aspiring designers build real-world skills through practical
                projects and case studies.
              </p>
            </div>
          </div>

          {/* Image 4 */}
          <div className="relative w-[126px] sm:w-[150px] shrink-0 h-full rounded-[16px] overflow-hidden snap-center">
            <img
              src="/assets/images/Frame 2147243637.png"
              alt="Creator 4"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
