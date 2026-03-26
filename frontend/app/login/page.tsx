"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f6f4f1] p-6 sm:p-10 lg:p-16 w-full flex items-center justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[calc(100vh-128px)]">
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-10">
          
          {/* Logo Placeholder */}
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex text-[#ff4c24] items-center text-[28px] tracking-tight font-bold">
              <span className="text-3xl">🛡</span> {/* Mock logo icon */}
              <span style={{ fontFamily: "'Fjalla One', sans-serif" }}>Renown</span>
            </div>
          </Link>

          {/* Heading */}
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <h1
              className="text-[#1a1a1a] text-[32px] sm:text-[40px] tracking-[0.8px] leading-tight"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Make you own Fan Base
            </h1>
            <p
              className="text-[#3a3a3a] text-sm sm:text-base font-medium tracking-[0.32px] leading-[26px] max-w-[400px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              This website empowers creators and influencers to turn their passion into carreer
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* Log In Button */}
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#ff9465] text-[#f6f4f1] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] transition-transform hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
                fontFamily: "'Lexend', sans-serif",
              }}
            >
              <span>Log in</span>
              <LogIn className="w-5 h-5 ml-1" />
            </Link>

            {/* Sign Up Button */}
            <Link
              href="/signup"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-[#ff9465] text-[#1a1a1a] bg-[#f6f4f1] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.16)] transition-transform hover:scale-105 active:scale-95"
              style={{ fontFamily: "'Lexend', sans-serif" }}
            >
              <span>Sign up</span>
              <UserPlus className="w-5 h-5 ml-1" />
            </Link>
          </div>

        </div>

        {/* Right Image Area */}
        <div className="flex-1 w-full h-[500px] lg:h-auto rounded-[16px] border border-[#e4ded2] overflow-hidden relative shadow-sm">
          <Image
            src="/assets/images/Frame 2121453719.png"
            alt="Creators Fan Base"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
