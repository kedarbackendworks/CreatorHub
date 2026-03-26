"use client";

import React from "react";

const steps = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Define your niche and creator identity",
    bgColor: "bg-[#d8d1c7]",
    textColor: "text-[#faf8f5]",
    strokeColor: "#ffffff",
  },
  {
    number: "02",
    label: "CREATE",
    title: "Build content that delivers real value",
    bgColor: "bg-[#1a1a1a]",
    textColor: "text-[#f6f4f1]",
    strokeColor: "#ffffff",
  },
  {
    number: "03",
    label: "GROW",
    title: "Engage your audience and build community",
    bgColor: "bg-[#d8d1c7]",
    textColor: "text-[#faf8f5]",
    strokeColor: "#ffffff",
  },
];

export default function OurProcess() {
  return (
    <section className="w-full bg-[#f6f4f1] px-4 sm:px-8 xl:px-[120px] py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 w-full">
          <div className="flex flex-col gap-4 max-w-[440px]">
            <p
              className="text-[#1a1a1a] text-base tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              OUR PROCESS
            </p>
            <h2
              className="text-[#1a1a1a] text-[40px] sm:text-[48px] tracking-[0.8px] leading-[1.2]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              From Passion to Profitable Creator Journey
            </h2>
          </div>
          <div className="max-w-[508px]">
            <p
              className="text-[#5a5a5a] text-base font-medium tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              We simplify the entire creator journey from setting up your profile
              to building an audience and generating income all in one seamless
              platform.
            </p>
          </div>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[530px]">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between p-8 sm:p-10 rounded-[24px] ${step.bgColor} h-[400px] md:h-auto overflow-hidden`}
              style={
                idx === 1 
                  ? { height: "calc(100% - 58px)" } 
                  : {}
              }
            >
              {/* Top part: Number + Label */}
              <div className="flex items-center justify-between w-full">
                <span
                  className="text-[60px] sm:text-[80px] tracking-[1.6px] leading-none"
                  style={{
                    fontFamily: "'Fjalla One', sans-serif",
                    color: "transparent",
                    WebkitTextStroke: `1px ${step.strokeColor}`,
                  }}
                >
                  {step.number}
                </span>
                <span
                  className="text-[#f95c4b] text-[24px] sm:text-[33px] tracking-[0.66px]"
                  style={{ fontFamily: "'Fjalla One', sans-serif" }}
                >
                  {step.label}
                </span>
              </div>

              {/* Bottom part: Title */}
              <h3
                className={`text-[32px] sm:text-[40px] lg:text-[48px] tracking-[0.96px] leading-[1.2] lg:leading-[1.4] ${step.textColor}`}
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                {step.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
