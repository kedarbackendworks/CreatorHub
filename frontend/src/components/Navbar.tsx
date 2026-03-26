"use client";
import Link from "next/link";
export default function Navbar() {
  const navLinks = [
    { label: "Home", active: true },
    { label: "Marketplace", active: false },
    { label: "Features", active: false },
    { label: "Blogs", active: false },
    { label: "About Us", active: false },
  ];

  return (
    <nav className="w-full bg-white px-8 sm:px-16 py-[22px] flex items-center justify-between relative z-50 shadow-[inset_0px_-1px_1px_0px_rgba(0,0,0,0.1)]">
      {/* Logo */}
      <div className="shrink-0 h-[34px] w-[134px]">
        <img
          src="/assets/icons/logo ipsum logo.svg"
          alt="logoipsum"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-[25px]">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href="#"
            className={`text-sm font-medium tracking-[0.2px] transition-colors hover:text-[#f95c4b] ${
              link.active ? "text-[#f95c4b] text-base tracking-[0.32px]" : "text-[#424242]"
            }`}
            style={{
              fontFamily: link.active
                ? "var(--font-figtree), 'Figtree', sans-serif"
                : "'Inter', sans-serif",
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right Side: Language + CTA */}
      <div className="flex items-center gap-5">
        {/* Language */}
        <div className="hidden sm:flex items-center gap-[7px]">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#616161"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span
            className="text-[#616161] text-base font-bold tracking-[0.2px] uppercase"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            EN
          </span>
        </div>

        {/* Join as Creator CTA */}
        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] bg-[#f6f4f1] text-[#1a1a1a] text-base cursor-pointer hover:shadow-lg transition-shadow"
          style={{
            fontFamily: "'Lexend', sans-serif",
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
    </nav>
  );
}
