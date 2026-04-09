import type { Metadata } from "next";
import { Figtree, Lexend, Comfortaa } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Footer from "../src/components/Footer";
import { Toaster } from 'react-hot-toast';
import { ModerationProvider } from '@/Moderation/components/ModerationProvider';

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CreatorHub – For The Next Gen Creators",
  description:
    "Join a new wave of creators building income, influence, and impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const stripInjectedAttrs = `
    (() => {
      const removeInjectedAttrs = () => {
        const nodes = document.querySelectorAll('[fdprocessedid]');
        nodes.forEach((node) => node.removeAttribute('fdprocessedid'));
      };

      removeInjectedAttrs();
      const observer = new MutationObserver(removeInjectedAttrs);
      observer.observe(document.documentElement, {
        subtree: true,
        attributes: true,
        attributeFilter: ['fdprocessedid'],
      });
    })();
  `;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${lexend.variable} ${comfortaa.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="strip-fdprocessedid"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: stripInjectedAttrs }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-[var(--font-figtree)] bg-white">
        <Toaster position="bottom-right" />
        <ModerationProvider />
        <div className="flex-1 shrink-0">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
