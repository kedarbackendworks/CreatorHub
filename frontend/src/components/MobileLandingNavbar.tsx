"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/src/components/BrandLogo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
];

export default function MobileLandingNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative z-[70]">
      <nav className="flex h-[64px] items-center justify-between border-b border-[#e9e9e9] bg-white px-5">
        <Link href="/" aria-label="Go to home" className="flex items-center gap-2">
          <BrandLogo
            className="inline-flex items-center gap-2"
            iconSize={22}
            textClassName="text-[15px] font-bold tracking-tight text-slate-800"
          />
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Select language"
            className="flex touch-manipulation items-center gap-1 transition-transform duration-150 active:scale-95"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <img
              src="/assets/icons/Feather Icon.svg"
              alt=""
              aria-hidden="true"
              className="size-[18px]"
            />
            <span
              className="text-[13px] font-medium tracking-[0.26px] text-[#616161]"
              style={{
                fontFamily: "var(--font-figtree), 'Figtree', sans-serif",
                lineHeight: "18.3px",
              }}
            >
              En
            </span>
          </button>

          <button
            type="button"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-landing-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="relative size-[22px] touch-manipulation select-none transition-transform duration-150 active:scale-95"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            <span
              className={`absolute left-[3px] right-[3px] top-[5px] h-[1.6px] rounded-full bg-[#616161] transition-all duration-200 ${
                isMenuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-[3px] right-[3px] top-[10px] h-[1.6px] rounded-full bg-[#616161] transition-all duration-200 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-[3px] right-[3px] top-[15px] h-[1.6px] rounded-full bg-[#616161] transition-all duration-200 ${
                isMenuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-[71] bg-transparent"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        id="mobile-landing-menu"
        className={`absolute right-5 top-[calc(100%+8px)] z-[72] w-[220px] rounded-2xl border border-[#e9e9e9] bg-[rgba(255,254,253,0.96)] p-2 shadow-[0_14px_36px_rgba(20,20,20,0.14)] backdrop-blur-[10px] transition-all duration-200 ${
          isMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        }`}
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`block rounded-xl px-3 py-2 text-[13px] tracking-[0.26px] transition-colors ${
                isActive
                  ? "bg-[#fff0e6] text-[#f95c4b]"
                  : "text-[#424242] hover:bg-[#fff7f1]"
              }`}
              style={{
                fontFamily: "var(--font-figtree), 'Figtree', sans-serif",
                lineHeight: "18.3px",
              }}
            >
              {link.label}
            </Link>
          );
        })}

        <Link
          href="/signup"
          onClick={() => setIsMenuOpen(false)}
          className="mt-1 inline-flex w-full items-center justify-center rounded-[42px] border border-[#ff9465] bg-[#121212] px-3 py-2 text-[12px] text-[#f2f2f2] shadow-[8px_8px_20px_rgba(69,9,0,0.16)]"
          style={{ fontFamily: "var(--font-lexend), 'Lexend', sans-serif" }}
        >
          Join as Creator
        </Link>
      </div>
    </div>
  );
}
