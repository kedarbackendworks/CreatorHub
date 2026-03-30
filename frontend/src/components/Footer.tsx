'use client';

import { usePathname } from 'next/navigation';
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (
    pathname?.startsWith('/role-selection') ||
    pathname?.startsWith('/explore-as-fan') ||
    pathname?.startsWith('/user') ||
    pathname?.startsWith('/livestream')
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-[#f9fafb]">
      <div className="max-w-[1440px] mx-auto px-5 md:px-[64px] py-10 md:py-[64px] flex flex-col gap-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 justify-between items-start">
          
          {/* Brand and Description */}
          <div className="flex flex-col gap-4 max-w-[320px]">
            <h4
              className="text-[#f95c4b] text-[28px] tracking-[0.56px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              CreatorHub
            </h4>
            <p
              className="text-[#6b7280] text-[16px] leading-[25.6px]"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              Discover and support talented creators across design, fitness, tech, and more.
              Access exclusive content, learn new skills, and connect directly with creators
              who inspire you every day.
            </p>
            <div className="flex gap-4 items-center mt-2 text-[#4b5563]">
              <a href="#" className="hover:opacity-75 transition-opacity opacity-100 flex items-center justify-center w-[20px] h-[20px]">
                <img src="/assets/icons/Instagram.svg" alt="Instagram" className="w-full h-full" />
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity opacity-100 flex items-center justify-center w-[20px] h-[20px]">
                <img src="/assets/icons/Twitter.svg" alt="Twitter" className="w-full h-full" />
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity opacity-100 flex items-center justify-center w-[20px] h-[20px]">
                <img src="/assets/icons/linkedin.svg" alt="LinkedIn" className="w-full h-full" />
              </a>
              <a href="#" className="hover:opacity-75 transition-opacity opacity-100 flex items-center justify-center w-[20px] h-[20px]">
                <img src="/assets/icons/Facebook.svg" alt="Facebook" className="w-full h-full" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-12 lg:gap-24 flex-1 justify-between">
            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h5
                className="text-[#111827] text-[20px] font-medium"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Quick Links
              </h5>
              <div className="flex flex-col gap-3 text-[#4b5563] text-[16px]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                <a href="#" className="hover:text-black transition-colors">Home</a>
                <a href="#" className="hover:text-black transition-colors">Explore Creators</a>
                <a href="#" className="hover:text-black transition-colors">Categories</a>
                <a href="#" className="hover:text-black transition-colors">Collections</a>
                <a href="#" className="hover:text-black transition-colors">Pricing</a>
                <a href="#" className="hover:text-black transition-colors">FAQs</a>
              </div>
            </div>

            {/* Creator Categories */}
            <div className="flex flex-col gap-4">
              <h5
                className="text-[#111827] text-[20px] font-medium whitespace-nowrap"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Creator Categories
              </h5>
              <div className="flex flex-col gap-3 text-[#4b5563] text-[16px]" style={{ fontFamily: "'Figtree', sans-serif" }}>
                <a href="#" className="hover:text-black transition-colors">Fitness & Health</a>
                <a href="#" className="hover:text-black transition-colors">Technology & Coding</a>
                <a href="#" className="hover:text-black transition-colors">Music & Audio</a>
                <a href="#" className="hover:text-black transition-colors">Education & Learning</a>
                <a href="#" className="hover:text-black transition-colors">Lifestyle & Productivity</a>
                <a href="#" className="hover:text-black transition-colors">Art & Illustration</a>
              </div>
            </div>

            {/* Contact / Support */}
            <div className="flex flex-col gap-4">
              <h5
                className="text-[#1a1a1a] text-[20px] font-medium whitespace-nowrap"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              >
                Contact / Support
              </h5>
              <div className="flex flex-col gap-4 text-[#3a3a3a] text-[16px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
                <div className="flex gap-3 items-start">
                  <MapPin size={20} className="shrink-0 mt-0.5" />
                  <p>123 Business Avenue Street<br/>Road Bangalore</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail size={20} className="shrink-0" />
                  <p>info@finovo.com</p>
                </div>
                <div className="flex gap-3 items-center">
                  <Phone size={20} className="shrink-0" />
                  <p>+123456987</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-8 border-t border-gray-200 uppercase tracking-wide">
          <p
            className="text-[#3a3a3a] text-[11px] tracking-[2px]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            © 2025 LOGOIPSUM. ALL RIGHTS RESERVED.
          </p>
          <div
            className="flex gap-6 text-[#5a5a5a] text-[11px] font-bold tracking-[1px] md:tracking-[0.32px]"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            <a href="#" className="hover:text-black transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-black transition-colors">TERM & CONDITION</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
