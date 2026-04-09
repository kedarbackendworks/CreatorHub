"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/src/components/BrandLogo";

const navLinks = [
  { label: "Home", href: "/", activeOnHome: true },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Features", href: "/#features" },
  { label: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="relative z-50 flex w-full items-center justify-between border-b border-[#e9e9e9] bg-[rgba(255,254,253,0.4)] px-6 py-2 backdrop-blur-[10px] md:bg-[rgba(255,254,253,0.85)] md:px-16 md:py-[22px]">
      <Link href="/" aria-label="Go to home" className="flex items-center gap-2 shrink-0">
        <BrandLogo
          className="inline-flex items-center gap-2"
          iconSize={24}
          textClassName="hidden md:inline text-xl font-bold tracking-tight text-slate-800"
        />
      </Link>

      <div className="hidden items-center gap-[25px] md:flex">
        {navLinks.map((link) => {
          const isActive = link.activeOnHome
            ? pathname === "/"
            : !link.href.includes("#") && pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-[0.2px] transition-colors hover:text-[#f95c4b] ${
                isActive ? "text-[#f95c4b] text-base tracking-[0.32px]" : "text-[#424242]"
              }`}
              style={{
                fontFamily: isActive
                  ? "var(--font-figtree), 'Figtree', sans-serif"
                  : "var(--font-figtree), 'Figtree', sans-serif",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <button
          type="button"
          aria-label="Select language"
          className="flex items-center gap-1 md:gap-[7px]"
        >
          <img
            src="/assets/icons/Feather Icon.svg"
            alt=""
            aria-hidden="true"
            className="size-4 md:size-6"
          />
          <span
            className="text-[13px] font-medium tracking-[0.26px] text-[#616161] md:text-base md:font-bold md:tracking-[0.2px] md:uppercase"
            style={{ fontFamily: "var(--font-figtree), 'Figtree', sans-serif", lineHeight: "18.3px" }}
          >
            En
          </span>
        </button>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav-menu"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="relative size-[18px] overflow-hidden md:hidden"
        >
          <span className="absolute left-[3px] right-[3px] top-[4px] h-[1.4px] rounded-full bg-[#616161]" />
          <span className="absolute left-[3px] right-[3px] top-[8px] h-[1.4px] rounded-full bg-[#616161]" />
          <span className="absolute left-[3px] right-[3px] top-[12px] h-[1.4px] rounded-full bg-[#616161]" />
        </button>

        <Link
          href="/signup"
          className="hidden cursor-pointer items-center gap-2 rounded-[42px] border border-[#ff9465] bg-[#f6f4f1] px-4 py-3 text-base text-[#1a1a1a] transition-shadow hover:shadow-lg md:flex"
          style={{
            fontFamily: "var(--font-lexend), 'Lexend', sans-serif",
            boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)",
          }}
        >
          <span>Join as Creator</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </Link>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="absolute right-6 top-[calc(100%+8px)] z-[70] w-[210px] rounded-2xl border border-[#e9e9e9] bg-[rgba(255,254,253,0.96)] p-2 shadow-[0_14px_36px_rgba(20,20,20,0.14)] backdrop-blur-[10px] md:hidden"
        >
          {navLinks.map((link) => {
            const isActive = link.activeOnHome
              ? pathname === "/"
              : !link.href.includes("#") && pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block rounded-xl px-3 py-2 text-[13px] tracking-[0.26px] transition-colors ${
                  isActive ? "bg-[#fff0e6] text-[#f95c4b]" : "text-[#424242] hover:bg-[#fff7f1]"
                }`}
                style={{ fontFamily: "var(--font-figtree), 'Figtree', sans-serif", lineHeight: "18.3px" }}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/signup"
            onClick={() => setIsMenuOpen(false)}
            className="mt-1 inline-flex w-full items-center justify-center gap-1 rounded-[42px] border border-[#ff9465] bg-[#121212] px-3 py-2 text-[12px] text-[#f2f2f2] shadow-[8px_8px_20px_rgba(69,9,0,0.16)]"
            style={{ fontFamily: "var(--font-lexend), 'Lexend', sans-serif" }}
          >
            <span>Join as Creator</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
