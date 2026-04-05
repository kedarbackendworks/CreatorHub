"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CheckCircle2, XCircle, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/src/lib/api";
import { useAuthStore } from "@/src/store/useAuthStore";
import CaptchaChallenge from "@/src/components/common/CaptchaChallenge";

export default function VerifyEmail({ initialEmail = "" }: { initialEmail?: string }) {
  const [step, setStep] = useState<"EMAIL_INPUT" | "OTP_INPUT">(
    initialEmail ? "OTP_INPUT" : "EMAIL_INPUT"
  );
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(initialEmail ? 30 : 0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaRefreshNonce, setCaptchaRefreshNonce] = useState(0);
  
  const login = useAuthStore((state) => state.login);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "" }>({
    message: "",
    type: "",
  });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 5000);
  };

  // Cooldown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (captchaRequired && !captchaToken) {
      showToast("Please complete the security check.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/request-otp', { email, captchaToken });
      
      if (res.data.success) {
        showToast("OTP sent to your email!", "success");
        setStep("OTP_INPUT");
        setCooldown(30);
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
      } else {
        showToast(res.data.message || "Failed to send OTP", "error");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Network error. Please try again.";
      if (String(message).toLowerCase().includes('captcha')) {
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
      }
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter a 6-digit OTP", "error");
      return;
    }

    if (captchaRequired && !captchaToken) {
      showToast("Please complete the security check.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp: otpString, captchaToken });
      
      if (res.data.success) {
        // Store token and user data
        if (res.data.user) {
          login(res.data.user);
        }
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        // Show success popup for 1.75 seconds
        setShowSuccessPopup(true);
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
        setTimeout(() => {
          window.location.href = "/role-selection";
        }, 1750);
      } else {
        showToast(res.data.message || "Invalid or expired OTP", "error");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Network error. Please try again.";
      if (String(message).toLowerCase().includes('captcha')) {
        setCaptchaToken('');
        setCaptchaRefreshNonce((prev) => prev + 1);
      }
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newOtp[index + i] = pasted[i];
      }
      setOtp(newOtp);
      const nextInput = document.getElementById(`otp-${Math.min(5, index + pasted.length - 1)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f4f1] py-16 px-6 lg:px-[120px] w-full flex items-center justify-center relative">
      
      {/* Verification Successful Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-10 flex flex-col items-center gap-5 shadow-2xl animate-[fadeInScale_0.3s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <h2
              className="text-[#1a1a1a] text-[28px] tracking-[0.56px] text-center"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Verification Successful
            </h2>
            <p
              className="text-[#5a5a5a] text-base font-medium text-center"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              Redirecting you to select your role...
            </p>
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl z-50 text-white font-medium transition-all transform duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast({ message: "", type: "" })} className="ml-4 hover:opacity-75">
            <XCircle size={20} />
          </button>
        </div>
      )}

      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row shadow-[0px_4px_40px_rgba(0,0,0,0.05)] rounded-[24px] overflow-hidden bg-[#faf8f5]">
        
        {/* Left Side: Form Content */}
        <div className="flex-1 flex flex-col justify-center items-center py-16 px-8 sm:px-16 relative">
          
          {/* Header Texts */}
          <div className="max-w-[500px] text-center flex flex-col gap-6">
            <h1
              className="text-[#1a1a1a] text-[40px] tracking-[0.8px] leading-tight"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Verify your email
            </h1>
            
            {step === "EMAIL_INPUT" ? (
              <p
                className="text-[#3a3a3a] text-base font-medium tracking-[0.32px] leading-[1.6]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Enter your email address to receive a secure verification code.
              </p>
            ) : (
              <p
                className="text-[#3a3a3a] text-[15px] font-medium tracking-[0.3px] leading-[1.6]"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                We sent a 6-digit code to{" "}
                <span className="font-bold text-[#1a1a1a]">{email}</span>.
                Please check your inbox and enter the code below. The code is valid for 5 minutes.
              </p>
            )}
          </div>

          <div className="w-full max-w-[500px] mt-10">
            {step === "EMAIL_INPUT" && (
              <form onSubmit={handleRequestOtp} className="flex flex-col gap-8 w-full items-center">
                <input
                  type="email"
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white border border-[#d8d1c7] rounded-[16px] px-6 py-5 outline-none focus:border-[#ff9465] transition-colors text-lg text-[#1a1a1a] font-medium placeholder:text-[#9a9a9a]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />

                <div className="w-full">
                  <CaptchaChallenge
                    onTokenChange={setCaptchaToken}
                    onRequirementChange={setCaptchaRequired}
                    refreshNonce={captchaRefreshNonce}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-max items-center justify-center px-12 py-4 rounded-full text-[#f6f4f1] text-[17px] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
                    fontFamily: "'Lexend', sans-serif",
                  }}
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            )}

            {step === "OTP_INPUT" && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-10 w-full items-center relative z-10">
                <div className="flex justify-between w-full gap-2 sm:gap-4 flex-wrap pb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit || ""}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-[50px] h-[60px] sm:w-[65px] sm:h-[75px] text-center text-[28px] font-bold bg-white border border-[#d8d1c7] rounded-[12px] outline-none focus:border-[#ff9465] transition-colors text-[#1a1a1a]"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      maxLength={6}
                    />
                  ))}
                </div>

                <div className="w-full">
                  <CaptchaChallenge
                    onTokenChange={setCaptchaToken}
                    onRequirementChange={setCaptchaRequired}
                    refreshNonce={captchaRefreshNonce}
                  />
                </div>

                <div className="w-full flex flex-col gap-6 items-center py-6 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/20 -z-10 -translate-y-[45px]"></div>
                  <button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    className="inline-flex w-max items-center justify-center px-10 py-3 rounded-full text-[#f6f4f1] text-[17px] shadow-[8px_8px_20px_0px_rgba(69,9,0,0.35)] transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    style={{
                      background: "linear-gradient(131.5deg, #e14517 57.5%, #d6361f 100%)",
                      fontFamily: "'Lexend', sans-serif",
                    }}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                  
                  <div className="flex items-center justify-center w-full gap-1.5 mt-4">
                    <span
                      className="text-[#5a5a5a] text-[15px] tracking-[0.3px]"
                      style={{ fontFamily: "'Figtree', sans-serif" }}
                    >
                      Don&apos;t Receive the email?
                    </span>
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={(e) => handleRequestOtp(e)}
                      className={`text-[15px] font-bold tracking-[0.3px] transition-colors ${
                        cooldown > 0 ? "text-[#9a9a9a]" : "text-[#1a1a1a] hover:text-[#e14517]"
                      }`}
                      style={{ fontFamily: "'Figtree', sans-serif" }}
                    >
                      {cooldown > 0 ? `Resend Code (${cooldown}s)` : "Resend Code"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side Image */}
        <div className="flex-1 min-h-[500px] lg:min-h-[700px] relative w-full border-l border-[#e4ded2]">
          <Image
            src="/assets/images/Frame 2121453719-10.png"
            alt="Verification"
            fill
            className="object-cover"
            priority
          />
        </div>
        
      </div>
    </div>
  );
}
