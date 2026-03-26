"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  // Password Validation Logic
  const hasMinLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaMetCount = [hasMinLength, hasLowerCase, hasSpecialChar].filter(Boolean).length;
  
  // Strength calculation
  let strengthLabel = "";
  let strengthColor = "bg-gray-300";
  let barWidth = "w-0";

  if (password.length > 0) {
    if (criteriaMetCount === 1) {
      strengthLabel = "Weak";
      strengthColor = "bg-red-500";
      barWidth = "w-1/3";
    } else if (criteriaMetCount === 2) {
      strengthLabel = "Medium";
      strengthColor = "bg-yellow-500";
      barWidth = "w-2/3";
    } else if (criteriaMetCount === 3) {
      strengthLabel = "Strong";
      strengthColor = "bg-[#f95c4b]"; // Using the brand CTA color
      barWidth = "w-full";
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f4f1] p-6 lg:p-16 w-full flex items-center justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 lg:gap-[100px] items-center">
        
        {/* Left Form Area */}
        <div className="flex-1 w-full max-w-[500px] flex flex-col gap-8 py-8 lg:py-10">
          
          <div className="flex flex-col text-center items-center justify-center gap-2">
            <h1
              className="text-[#1a1a1a] text-[33px] tracking-[0.66px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Create Your Account
            </h1>
            <p
              className="text-[#3a3a3a] text-base font-medium tracking-[0.32px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              Join us and start creating
            </p>
          </div>

          <form className="flex flex-col gap-4 w-full" onSubmit={(e) => e.preventDefault()}>
            
            {/* Phone Number */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-[#1a1a1a] text-[28px] tracking-[0.56px] leading-tight"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                Phone Number
              </label>
              <input 
                type="tel"
                placeholder="+1 234 567 890"
                className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-[#1a1a1a] text-[28px] tracking-[0.56px] leading-tight"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                Email
              </label>
              <input 
                type="email"
                placeholder="hello@chainex.co"
                className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              />
            </div>

            {/* User Name */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-[#1a1a1a] text-[28px] tracking-[0.56px] leading-tight"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                User Name
              </label>
              <input 
                type="text"
                placeholder="********"
                className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 relative">
              <label 
                className="text-[#1a1a1a] text-[28px] tracking-[0.56px] leading-tight"
                style={{ fontFamily: "'Fjalla One', sans-serif" }}
              >
                Password
              </label>
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full pl-6 pr-12 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                </button>
              </div>
            </div>

            {/* Password Strength Section */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-4">
                <span className="text-[#3a3a3a] text-sm font-medium">Password strength</span>
                <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthColor} ${barWidth}`}></div>
                </div>
                <span className="text-sm font-medium text-gray-500 w-[50px]">{strengthLabel}</span>
              </div>
              
              <div className="flex flex-col gap-1.5 mt-2">
                <p className="text-[#3a3a3a] text-sm font-medium mb-1">Must contain at least</p>
                
                <div className="flex items-center gap-2">
                  {hasMinLength ? <CheckCircle2 size={16} className="text-[#f95c4b]" /> : <Circle size={16} className="text-gray-400" />}
                  <span className={`text-sm ${hasMinLength ? 'text-[#3a3a3a]' : 'text-gray-500'}`}>8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasLowerCase ? <CheckCircle2 size={16} className="text-[#f95c4b]" /> : <Circle size={16} className="text-gray-400" />}
                  <span className={`text-sm ${hasLowerCase ? 'text-[#3a3a3a]' : 'text-gray-500'}`}>1 lower case character</span>
                </div>
                <div className="flex items-center gap-2">
                  {hasSpecialChar ? <CheckCircle2 size={16} className="text-[#f95c4b]" /> : <Circle size={16} className="text-gray-400" />}
                  <span className={`text-sm ${hasSpecialChar ? 'text-[#3a3a3a]' : 'text-gray-500'}`}>1 special character</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-10 py-3 rounded-full border border-[#ff9465] text-[#f6f4f1] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                style={{
                  background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
                  fontFamily: "'Lexend', sans-serif",
                }}
              >
                Create Account
              </button>
            </div>
          </form>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 w-full h-[600px] lg:h-[800px] rounded-[16px] border border-[#e4ded2] overflow-hidden relative shadow-sm">
          <Image
            src="/assets/images/Frame 2121453719-10.png"
            alt="Join Creators"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
