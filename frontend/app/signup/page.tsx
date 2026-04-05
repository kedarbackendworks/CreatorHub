"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import api from "@/src/lib/api";
import toast from "react-hot-toast";
import CaptchaChallenge from "@/src/components/common/CaptchaChallenge";

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaRefreshNonce, setCaptchaRefreshNonce] = useState(0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captchaRequired && !captchaToken) {
      toast.error("Please complete the security check");
      return;
    }

    setLoading(true);
    try {
      let deviceFingerprint = '';
      try {
        const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        deviceFingerprint = result.visitorId;
      } catch {
        deviceFingerprint = '';
      }

      // Pass the role from searchParams if needed, or handle it in role selection later
      const res = await api.post('/auth/register', {
        name,
        username,
        phone,
        email,
        password,
        role,
        deviceFingerprint,
        captchaToken,
      });
      if (res.data.success) {
        toast.success("Account created! Check your email for OTP.");
        setCaptchaToken("");
        setCaptchaRefreshNonce((prev) => prev + 1);
        // Redirect to verify-email page with the email
        router.push(`/login/verify-email?email=${encodeURIComponent(email)}`);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";
      if (String(message).toLowerCase().includes('captcha')) {
        setCaptchaToken("");
        setCaptchaRefreshNonce((prev) => prev + 1);
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Password Validation Logic
  const hasMinLength = password.length >= 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaMetCount = [hasMinLength, hasLowerCase, hasSpecialChar].filter(Boolean).length;
  
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
      strengthColor = "bg-[#f95c4b]";
      barWidth = "w-full";
    }
  }

  return (
    <div className="flex-1 w-full max-w-[500px] flex flex-col gap-6 py-8 lg:py-10">
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
          {role === 'creator' ? 'Join as a Creator' : 'Join the Community'}
        </p>
      </div>

      <form className="flex flex-col gap-4 w-full" onSubmit={handleRegister}>
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label 
            className="text-[#1a1a1a] text-[20px] tracking-[0.4px] leading-tight"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            Full Name *
          </label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
            className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          />
        </div>

        {/* Username */}
        <div className="flex flex-col gap-2">
          <label 
            className="text-[#1a1a1a] text-[20px] tracking-[0.4px] leading-tight"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            Username *
          </label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            placeholder="your_unique_username"
            required
            className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          />
        </div>
        
        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label 
            className="text-[#1a1a1a] text-[20px] tracking-[0.4px] leading-tight"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            Phone Number *
          </label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            required
            className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label 
            className="text-[#1a1a1a] text-[20px] tracking-[0.4px] leading-tight"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            Email *
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@example.com"
            required
            className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#ff9465] transition-colors text-base text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 relative">
          <label 
            className="text-[#1a1a1a] text-[20px] tracking-[0.4px] leading-tight"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            Password *
          </label>
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
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
        <div className="flex flex-col gap-3 mt-1">
          <div className="flex items-center gap-4">
            <span className="text-[#3a3a3a] text-sm font-medium">Password strength</span>
            <div className="flex-1 h-1.5 bg-gray-300 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-300 ${strengthColor} ${barWidth}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-500 w-[50px]">{strengthLabel}</span>
          </div>
          
          <div className="flex flex-col gap-1.5 ml-2">
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
        <CaptchaChallenge
          onTokenChange={setCaptchaToken}
          onRequirementChange={setCaptchaRequired}
          refreshNonce={captchaRefreshNonce}
          className="mt-2"
        />

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 rounded-full border border-[#ff9465] text-[#f6f4f1] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] transition-transform hover:scale-105 active:scale-95 whitespace-nowrap opacity-90 hover:opacity-100 disabled:opacity-50"
            style={{
              background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
              fontFamily: "'Lexend', sans-serif",
            }}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>

        {/* Already have account */}
        <p className="text-center text-[#5a5a5a] text-sm mt-2" style={{ fontFamily: "'Figtree', sans-serif" }}>
          Already have an account?{" "}
          <Link href="/login" className="text-[#e14517] font-bold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#f6f4f1] p-6 lg:p-16 w-full flex items-center justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 lg:gap-[100px] items-center">
        
        {/* Left Form Area */}
        <Suspense fallback={<div>Loading form...</div>}>
          <SignUpForm />
        </Suspense>

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
