"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import api from "@/src/lib/api";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useBanStore } from "@/src/store/useBanStore";
import toast from "react-hot-toast";
import CaptchaChallenge from "@/src/components/common/CaptchaChallenge";
import BrandLogo from "@/src/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaRefreshNonce, setCaptchaRefreshNonce] = useState(0);

  const login = useAuthStore((state) => state.login);
  const setBanData = useBanStore((state) => state.setBanData);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (captchaRequired && !captchaToken) {
      toast.error("Please complete the security check");
      return;
    }

    setLoading(true);
    try {
        const res = await api.post('/auth/login', { email, password, captchaToken });
        login(res.data);
        toast.success(`Welcome back, ${res.data.name}!`);
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
        
        // RBAC Redirection
        if (res.data.role === 'creator') {
          try {
            const banRes = await api.get('/appeals/my-appeal');
            setBanData({
              activeBan: banRes.data?.activeBan ?? null,
              appeal: banRes.data?.appeal ?? null,
            });
          } catch {
            setBanData({ activeBan: null, appeal: null });
          }
          router.push('/creator');
        }
        else if (res.data.role === 'admin') router.push('/admin');
        else router.push('/user');
    } catch (err: any) {
        const message = err.response?.data?.message || "Login failed";
        if (String(message).toLowerCase().includes('captcha')) {
          setCaptchaToken('');
          setCaptchaRefreshNonce((prev) => prev + 1);
        }
        toast.error(message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f1] p-6 sm:p-10 lg:p-16 w-full flex items-center justify-center" suppressHydrationWarning>
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[calc(100vh-128px)]">
        
        {/* Left Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8 py-10">
          
          <Link href="/" className="mb-4">
            <BrandLogo
              iconSize={30}
              className="inline-flex items-center gap-3"
              textClassName="text-[30px] font-bold tracking-tight text-slate-800"
            />
          </Link>

          {/* Heading */}
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <h1 className="text-[#1a1a1a] text-[32px] sm:text-[40px] tracking-[0.8px] leading-tight font-['Fjalla_One'] uppercase">
              Welcome Back
            </h1>
            <p className="text-[#3a3a3a] text-sm sm:text-base font-medium font-['Figtree'] max-w-[400px]">
              Log in to manage your fan base and settings.
            </p>
          </div>

          {/* Login Form */}
          <form className="w-full max-w-[400px] flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
               <label className="text-[20px] font-bold text-[#1a1a1a] font-['Fjalla_One'] uppercase tracking-tight">Email</label>
               <input 
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="your@email.com"
                 className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#e14517] transition-all"
               />
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-[20px] font-bold text-[#1a1a1a] font-['Fjalla_One'] uppercase tracking-tight">Password</label>
               <div className="relative">
                 <input 
                   type={showPassword ? "text" : "password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   placeholder="********"
                   className="w-full bg-[#faf8f5] border border-[#d8d1c7] rounded-full px-6 py-4 outline-none focus:border-[#e14517] transition-all"
                 />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <CaptchaChallenge
                onTokenChange={setCaptchaToken}
                onRequirementChange={setCaptchaRequired}
                refreshNonce={captchaRefreshNonce}
              />

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#ff9465] text-[#f6f4f1] shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
                  fontFamily: "'Lexend', sans-serif",
                }}
              >
                <span>{loading ? "Logging in..." : "Log in"}</span>
                <LogIn className="w-5 h-5 ml-1" />
              </button>

              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-full border border-[#d8d1c7] text-[#1a1a1a] bg-white shadow-sm transition-all hover:bg-slate-50"
              >
                <span>Don&apos;t have an account? Sign up</span>
                <UserPlus className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </form>
        </div>

        {/* Right Image Area */}
        <div className="flex-1 w-full min-h-[500px] lg:h-full rounded-[16px] border border-[#e4ded2] overflow-hidden relative shadow-sm">
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
