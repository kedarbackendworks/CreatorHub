import type { Metadata } from "next";
import { Figtree, Lexend } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "CreatorHub – For The Next Gen Creators",
  description:
    "Join a new wave of creators building income, influence, and impact.",
};

import Footer from "../src/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${lexend.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-figtree)]">
        <div className="flex-1 shrink-0">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
