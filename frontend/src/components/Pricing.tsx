"use client";

import React from "react";
import Link from "next/link";

const plans = [
  {
    name: "Basic Plan",
    price: "$12",
    period: "/Month",
    bgColor: "bg-[#e4ded2]",
    textColor: "text-[#1e1e1e]",
    buttonBg: "bg-[#f6f4f1]",
    buttonText: "text-[#1a1a1a]",
    iconBg: "bg-[#fb6503]",
    gridIconStroke: "#fffefd",
    features: [
      "Create your creator profile",
      "Upload limited content",
      "Basic audience insights",
      "Community access",
      "Email support",
    ],
    footer: "Perfect for Individuals.",
    featured: false,
  },
  {
    name: "Business Plan",
    price: "$39",
    period: "/Month",
    bgColor: "bg-[#fb6503]",
    textColor: "text-[#fffefd]",
    buttonBg: "bg-[#f6f4f1]",
    buttonText: "text-[#1a1a1a]",
    iconBg: "bg-[#fffefd]",
    gridIconStroke: "#fb6503",
    features: [
      "Unlimited content uploads",
      "Monetization tools (subscriptions & products)",
      "Advanced analytics & insights",
      "Priority support",
      "Custom branding options",
    ],
    footer: "Perfect for Individuals.",
    featured: true,
  },
  {
    name: "Enterprise Plan",
    price: "$59",
    period: "/Month",
    bgColor: "bg-[#e4ded2]",
    textColor: "text-[#1e1e1e]",
    buttonBg: "bg-[#f6f4f1]",
    buttonText: "text-[#1a1a1a]",
    iconBg: "bg-[#fb6503]",
    gridIconStroke: "#fffefd",
    features: [
      "Everything in Pro plan",
      "1:1 coaching & consultation tools",
      "Advanced audience segmentation",
      "Dedicated account support",
      "Early access to new features",
    ],
    footer: "Perfect for Individuals.",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section className="w-full bg-[#f6f4f1] px-4 sm:px-8 xl:px-[120px] py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex flex-col gap-12 sm:gap-16">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 w-full">
          <div className="flex flex-col gap-4 max-w-[500px]">
            <p
              className="text-[#1a1a1a] text-base tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              PRICING
            </p>
            <h2
              className="text-[#1a1a1a] text-[40px] sm:text-[48px] lg:text-[56px] tracking-[0.8px] leading-[1.2]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Pricing That Grows as You Grow
            </h2>
          </div>
          <div className="max-w-[508px]">
            <p
              className="text-[#5a5a5a] text-base font-medium tracking-[0.32px] leading-[26px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              Choose a plan that fits your creator journey. Start for free and
              upgrade anytime as your audience and income grow.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 w-full mt-4 lg:mt-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className="flex flex-col rounded-[24px] overflow-hidden shadow-sm border border-black/5 transition-transform duration-300 hover:-translate-y-2 h-full"
            >
              {/* Top Colored Section */}
              <div className={`p-6 sm:p-8 flex flex-col gap-6 ${plan.bgColor}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${plan.iconBg}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke={plan.gridIconStroke} strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke={plan.gridIconStroke} strokeWidth="2" />
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke={plan.gridIconStroke} strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke={plan.gridIconStroke} strokeWidth="2" />
                    </svg>
                  </div>
                  <h3
                    className={`text-base font-bold tracking-[0.32px] ${plan.textColor}`}
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    {plan.name}
                  </h3>
                </div>

                <div className={`flex items-baseline ${plan.textColor}`}>
                  <span
                    className="text-[36px] sm:text-[42px] tracking-[0.6px] leading-tight"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {plan.price}/
                  </span>
                  <span
                    className={`text-[13px] font-bold ${plan.featured ? 'opacity-100 text-white' : 'opacity-80 text-[#3a3a3a]'}`}
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    Month
                  </span>
                </div>

                <Link
                  href="/signup"
                  className={`w-full py-3 px-6 rounded-[42px] border border-[#ff9465] flex items-center justify-center gap-2 ${plan.buttonBg} ${plan.buttonText} hover:opacity-90 transition-opacity`}
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)",
                  }}
                >
                  <span>Get Started</span>
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

              {/* Bottom White Section */}
              <div className="p-6 sm:p-8 bg-white flex-1 flex flex-col justify-between">
                <ul className="flex flex-col gap-4 mb-8">
                  {plan.features.map((feat, j) => (
                    <li
                      key={j}
                      className="flex gap-3 text-[15px] sm:text-[16px] text-[#5a5a5a] items-start font-[var(--font-figtree)] tracking-[0.3px]"
                    >
                      <svg
                        className="w-[18px] h-[18px] shrink-0 mt-[3px] text-[#5a5a5a]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-6 border-t border-[#f2f2f2]">
                  <p className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a] font-[var(--font-figtree)]">
                    {plan.footer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
