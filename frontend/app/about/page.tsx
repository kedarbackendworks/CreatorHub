"use client";
import Link from "next/link";
import Footer from "../../src/components/Footer";
import "./about-responsive.css";

import Navbar from "@/src/components/Navbar";

// Hero Section with Creator Cards
function AboutHero() {
  return (
    <section className="relative w-full pt-[100px] pb-[60px] px-8 sm:px-16">
      {/* Background Image - World Map */}
      <div className="absolute inset-0 w-full h-[823px] opacity-20">
        <img
          src="/assets/images/bg img..png"
          alt=""
          className="w-full h-full object-cover mix-blend-lighten pointer-events-none"
        />
      </div>

      <div className="relative z-10 max-w-[1312px] mx-auto flex flex-col lg:flex-row gap-16 items-start">
        {/* Left Content */}
        <div className="flex flex-col gap-8 max-w-[520px]">
          <div className="flex flex-col gap-4">
            <h1
              className="text-[#1a1a1a] text-[48px] tracking-[0.96px] leading-[67.9px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Build your creator journey with confidence
            </h1>
            <p
              className="text-[#5a5a5a] text-base tracking-[0.32px] leading-[25.8px] font-medium"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              We empower creators to turn their passion into a sustainable digital business. From content creation to monetization, our platform provides everything you need to grow, connect, and succeed in the creator economy.
            </p>
          </div>

          <Link
            href="#"
            className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] text-[#f6f4f1] text-base w-fit"
            style={{
              fontFamily: "'Lexend', sans-serif",
              backgroundImage: "linear-gradient(147deg, #e14517 57.5%, #d6361f 100%)",
              boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.35)",
            }}
          >
            <span>Explore Creators</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M13.33 3.33L16.67 6.67M16.67 6.67L13.33 10M16.67 6.67H3.33" stroke="#f6f4f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45, 10, 10)"/>
            </svg>
          </Link>
        </div>

        {/* Right - Creator Cards Grid */}
        <div className="relative w-full lg:w-[656px] h-[422px]">
          {/* Aarav Sharma - Top Left */}
          <div className="absolute left-0 top-0 w-[244px] h-[238px] rounded-[24px] border border-[#e4ded2] overflow-hidden">
            <img
              src="/assets/images/Frame 2147243731.png"
              alt="Aarav Sharma"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[5px] left-[-1px] bg-[#f6f4f1] px-2 rounded-tr-[24px] rounded-br-[24px]">
              <span className="text-black text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
                Aarav Sharma
              </span>
            </div>
          </div>

          {/* Global Creator Network Card - Top Middle */}
          <div
            className="absolute left-[268px] top-0 w-[200px] h-[160px] rounded-[24px] border border-[#e4ded2] overflow-hidden p-4 flex flex-col gap-[10px] justify-center"
            style={{ backgroundImage: "linear-gradient(231deg, rgb(223, 238, 215) 1.5%, rgb(238, 240, 243) 96.7%)" }}
          >
            <p className="text-[#3a3a3a] text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
              Global Creator Network
            </p>
            <p className="text-[#5a5a5a] text-[13px] tracking-[0.26px] leading-[18.3px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
              Connect with creators, learners, and communities worldwide and expand your reach effortlessly.
            </p>
          </div>

          {/* Sakti Kapoor - Top Right */}
          <div className="absolute left-[492px] top-0 w-[164px] h-[194px] rounded-[24px] border border-[#e4ded2] overflow-hidden">
            <img
              src="/assets/images/Frame 2147243736.png"
              alt="Sakti Kapoor"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[11px] left-[-1px] bg-[#f6f4f1] px-2 rounded-tr-[24px] rounded-br-[24px]">
              <span className="text-black text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
                Sakti Kapoor
              </span>
            </div>
          </div>

          {/* Riya Kapoor - Middle */}
          <div className="absolute left-[268px] top-[184px] w-[200px] h-[238px] rounded-[24px] border border-[#e4ded2] overflow-hidden">
            <img
              src="/assets/images/Frame 2147243734.png"
              alt="Riya Kapoor"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-[5px] left-[-1px] bg-[#f6f4f1] px-2 rounded-tr-[24px] rounded-br-[24px]">
              <span className="text-black text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
                Riya Kapoor
              </span>
            </div>
          </div>

          {/* Global Creator Network Card - Bottom Right */}
          <div
            className="absolute left-[492px] top-[218px] w-[164px] rounded-[24px] border border-[#e4ded2] overflow-hidden p-4 flex flex-col gap-[10px]"
            style={{ backgroundImage: "linear-gradient(53deg, rgb(238, 240, 243) 0%, rgb(255, 186, 134) 100%)" }}
          >
            <p className="text-[#3a3a3a] text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
              Global Creator Network
            </p>
            <p className="text-[#5a5a5a] text-[13px] tracking-[0.26px] leading-[18.3px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
              Connect with creators, learners, and communities worldwide and expand your reach effortlessly.
            </p>
          </div>

          {/* Flexible and Scalable Card - Bottom Left */}
          <div
            className="absolute left-0 top-[262px] w-[244px] h-[160px] rounded-[24px] border border-[#e4ded2] overflow-hidden p-4 flex flex-col gap-[5px] justify-center"
            style={{ backgroundImage: "linear-gradient(233deg, rgb(196, 173, 229) 2.9%, rgb(218, 221, 227) 87.7%)" }}
          >
            <p className="text-[#3a3a3a] text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
              Flexible and Scalable
            </p>
            <p className="text-[#5a5a5a] text-[13px] tracking-[0.26px] leading-[18.3px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
              Build your creator business at your own pace. Grow your audience and income without limitations.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <p
        className="text-center text-[#9a9a9a] text-base tracking-[0.32px] leading-[25.8px] font-medium mt-12"
        style={{ fontFamily: "'Figtree', sans-serif" }}
      >
        Join 10,000+ creators building their future with CreatorHub
      </p>
    </section>
  );
}

// Social Media Banner
function SocialMediaBanner() {
  const platforms = [
    { name: "YOUTUBE", icon: "youtube" },
    { name: "INSTAGRAM", icon: "instagram" },
    { name: "LINKEDIN", icon: "linkedin" },
    { name: "DRIBBBLE", icon: "dribbble" },
  ];

  return (
    <section className="w-full bg-[#e4ded2] py-4 px-8">
      <div className="max-w-[1312px] mx-auto flex items-center justify-center gap-[80px] flex-wrap">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center gap-3">
            <img
              src={`/assets/icons/${platform.icon}.svg`}
              alt={platform.name}
              className="w-8 h-8"
            />
            <span
              className="text-[#3a3a3a] text-[28px] tracking-[0.56px] leading-[42.1px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              {platform.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// Quote Section
function QuoteSection() {
  return (
    <section className="w-full py-[80px] px-8 sm:px-16">
      <div className="max-w-[1312px] mx-auto">
        <p
          className="text-[#3a3a3a] text-[48px] tracking-[0.96px] leading-[67.9px]"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          <span className="text-[#f95c4b]">"</span>
          A creator's true value grows when their knowledge reaches the right audience. At{" "}
          <span className="text-[#f95c4b]">CreatorHub</span>, we believe growth happens when ideas are shared, communities are built, and impact is created together.
          <span className="text-[#f95c4b]">"</span>
        </p>
      </div>
    </section>
  );
}

// Creator Growth Section
function CreatorGrowthSection() {
  return (
    <section className="w-full py-[40px] px-8 sm:px-16">
      <div className="max-w-[1312px] mx-auto flex gap-6 flex-col lg:flex-row">
        {/* Main Card */}
        <div
          className="flex-1 h-[400px] rounded-[32px] border border-[#7a7a7a] overflow-hidden p-4 flex gap-4"
          style={{ backgroundImage: "linear-gradient(122deg, rgb(225, 69, 23) 57.5%, rgb(214, 54, 31) 100%)" }}
        >
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <p className="text-[#d6d6d6] text-base tracking-[0.32px] leading-[25.8px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
              Creator Growth
            </p>
            <p
              className="text-[#f2f2f2] text-[33px] tracking-[0.66px] leading-[48.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              We provide the tools, audience, and support creators need to turn their skills into meaningful opportunities.
            </p>
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] bg-[#121212] text-[#f2f2f2] text-base w-fit mt-4"
              style={{ fontFamily: "'Lexend', sans-serif", boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)" }}
            >
              Learn More
            </button>
          </div>
          <div className="w-[282px] h-full rounded-[16px] overflow-hidden shrink-0 hidden lg:block">
            <img
              src="/assets/images/Frame 2147243760.png"
              alt="Creator Growth"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Side Images */}
        <div className="w-full lg:w-[282px] h-[400px] rounded-[32px] border border-[#9a9a9a] overflow-hidden">
          <img
            src="/assets/images/Frame 2147243761.png"
            alt="Creator"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full lg:w-[282px] h-[400px] rounded-[32px] border border-[#9a9a9a] overflow-hidden hidden lg:block">
          <img
            src="/assets/images/Frame 2147243550.png"
            alt="Creator"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// Built For Creators Section
function BuiltForCreatorsSection() {
  return (
    <section className="w-full py-[60px] px-8 sm:px-16">
      <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Label */}
        <p
          className="text-[#5a5a5a] text-base tracking-[0.32px] leading-[25.8px] w-[224px] shrink-0"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          BUILT FOR CREATORS WHO WANT TO GROW, IMPACT, AND LEAD
        </p>

        {/* Right Quote */}
        <p
          className="text-[#3a3a3a] text-[33px] tracking-[0.66px] leading-[48.6px] flex-1"
          style={{ fontFamily: "'Fjalla One', sans-serif" }}
        >
          When creators share knowledge, they don't just teach they inspire, empower, and build the future.
        </p>
      </div>
    </section>
  );
}

// Content Cards Section (Creator Stories, Premium Content, Creator Tools)
function ContentCardsSection() {
  const cards = [
    {
      category: "Community",
      title: "Creator Stories",
      description: "Real journeys of creators building their audience and income",
      image: "/assets/images/Frame 2147243547.png",
    },
    {
      category: "Learning",
      title: "Premium Content",
      description: "Courses, guides, and exclusive content designed to deliver real value",
      image: "/assets/images/Frame 2147243550.png",
    },
    {
      category: "Platform",
      title: "Creator Tools",
      description: "Everything you need to create, grow, and monetize in one place",
      image: "/assets/images/Frame 2147243551.png",
    },
  ];

  return (
    <section className="w-full py-[40px] px-8 sm:px-16">
      <div className="max-w-[1312px] mx-auto flex gap-6 flex-col lg:flex-row">
        {cards.map((card, index) => (
          <div key={index} className="flex flex-col gap-[10px] flex-1">
            <div className="h-[400px] rounded-[32px] overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[#3a3a3a] text-[13px] tracking-[0.26px] leading-[18.3px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
                {card.category}
              </p>
              <p className="text-[#3a3a3a] text-base tracking-[0.32px] leading-[25.8px]" style={{ fontFamily: "'Fjalla One', sans-serif" }}>
                {card.title}
              </p>
              <p className="text-[#9a9a9a] text-base tracking-[0.32px] leading-[25.8px] font-medium" style={{ fontFamily: "'Figtree', sans-serif" }}>
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Vision & Mission Section (Dark)
function VisionMissionSection() {
  const bodyTextStyle = {
    color: "#B8B8B8",
    fontFamily: "'Figtree', sans-serif",
    fontSize: "16px",
    fontStyle: "normal" as const,
    fontWeight: 500,
    lineHeight: "25.8px",
    letterSpacing: "0.32px",
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#121212] px-8 py-[80px] sm:px-16">
      {/* Background Image */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[823px] w-full"
        style={{
          aspectRatio: "1440 / 823",
          opacity: 0.2,
          background: 'url("/assets/images/bg img..png") lightgray 50% / cover no-repeat',
          backgroundBlendMode: 'lighten',
          boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1312px] lg:min-h-[600px]">
        {/* Mobile/Tablet layout */}
        <div className="flex flex-col gap-10 lg:hidden">
          <div className="w-[200px] shrink-0">
            <p
              className="text-[#d6d6d6] text-[40px] tracking-[0.8px] leading-[57.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              OUR<br />VISION
            </p>
          </div>
          <p
            className="max-w-[520px]"
            style={bodyTextStyle}
          >
            We envision a world where every creator has the opportunity to turn their passion into purpose and their skills into sustainable income. Our goal is to build a platform where creativity is not limited by access, but amplified through the right tools, audience, and opportunities.
          </p>
          <p style={bodyTextStyle}>
            At <span className="text-[#f95c4b]">CreatorHub</span>, we are redefining how creators grow and succeed in the digital world. By combining powerful technology with a community-driven approach, we aim to unlock new possibilities for creators to share knowledge, build influence, and create lasting impact.
          </p>
          <p
            className="max-w-[520px]"
            style={bodyTextStyle}
          >
            Our mission is to empower creators at every stage of their journey by providing simple, scalable tools to create, connect, and monetize. We are committed to building an ecosystem where creators can grow confidently, engage meaningfully, and build businesses that thrive over time.
          </p>
          <div className="w-[200px] shrink-0 text-left sm:text-right">
            <p
              className="text-[#d6d6d6] text-[40px] tracking-[0.8px] leading-[57.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              OUR<br />MISSION
            </p>
          </div>
        </div>

        {/* Desktop layout matching Figma card */}
        <div className="relative hidden lg:block h-[600px]">
          <div className="absolute left-0 top-0 w-[200px]">
            <p
              className="text-[#d6d6d6] text-[40px] tracking-[0.8px] leading-[57.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              OUR<br />VISION
            </p>
          </div>

          <p
            className="absolute left-[388px] top-[10px] w-[720px]"
            style={bodyTextStyle}
          >
            We envision a world where every creator has the opportunity to turn their passion into purpose and their skills into sustainable income. Our goal is to build a platform where creativity is not limited by access, but amplified through the right tools, audience, and opportunities.
          </p>

          <p
            className="absolute left-[470px] top-[188px] w-[690px]"
            style={bodyTextStyle}
          >
            At <span className="text-[#f95c4b]">CreatorHub</span>, we are redefining how creators grow and succeed in the digital world. By combining powerful technology with a community-driven approach, we aim to unlock new possibilities for creators to share knowledge, build influence, and create lasting impact.
          </p>

          <p
            className="absolute left-[246px] top-[386px] w-[710px]"
            style={bodyTextStyle}
          >
            Our mission is to empower creators at every stage of their journey by providing simple, scalable tools to create, connect, and monetize. We are committed to building an ecosystem where creators can grow confidently, engage meaningfully, and build businesses that thrive over time.
          </p>

          <div className="absolute right-[70px] top-[392px] w-[200px] text-right">
            <p
              className="text-[#d6d6d6] text-[40px] tracking-[0.8px] leading-[57.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              OUR<br />MISSION
            </p>
          </div>

          {/* Curved dashed arrow from Figma */}
          <div className="absolute left-[86px] top-[146px] h-[348px] w-[132px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="132" height="348" viewBox="0 0 135 350" fill="none" aria-hidden="true">
              <path d="M81.1002 1C-22.6194 35.8473 3.5741 224.656 98.5439 185.596C138.617 169.115 100.387 92.731 36.1535 135.841C-28.0801 178.951 -9.21943 333.092 132.96 318.189M132.96 318.189L113.873 291.166M132.96 318.189L103.468 349" stroke="#FF7A6C" strokeWidth="2" strokeLinecap="round" strokeDasharray="8 8"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Us CTA Section
function AboutCTASection() {
  return (
    <section className="w-full py-[60px] px-8 sm:px-16">
      <div className="max-w-[1312px] mx-auto bg-[#f95c4b] rounded-[32px] overflow-hidden p-4 flex flex-col lg:flex-row gap-[80px] items-center">
        {/* Left Content */}
        <div className="flex flex-col gap-[42px] w-full lg:w-[526px] p-4">
          <p
            className="text-[#d6d6d6] text-base tracking-[0.32px] leading-[25.8px]"
            style={{ fontFamily: "'Fjalla One', sans-serif" }}
          >
            ABOUT US.
          </p>

          <div className="flex flex-col gap-3">
            <p
              className="text-[#f2f2f2] text-[40px] tracking-[0.8px] leading-[57.6px]"
              style={{ fontFamily: "'Fjalla One', sans-serif" }}
            >
              Creator growth is shaped by the communities they build
            </p>
            <p
              className="text-[#f2f2f2] text-base tracking-[0.32px] leading-[25.8px] font-medium"
              style={{ fontFamily: "'Figtree', sans-serif" }}
            >
              At CreatorHub, we believe that true success doesn't happen in isolation. It grows through meaningful connections, shared knowledge, and engaged communities. Our platform empowers creators to reach the right audience, build trust, and create lasting impact through their work.
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-4 py-3 rounded-[42px] border border-[#ff9465] bg-[#121212] text-[#f2f2f2] text-base w-fit"
            style={{ fontFamily: "'Lexend', sans-serif", boxShadow: "8px 8px 20px rgba(69, 9, 0, 0.16)" }}
          >
            Learn More
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 h-[400px] rounded-[16px] overflow-hidden">
          <img
            src="/assets/images/Frame 2147243551.png"
            alt="Community"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

// Main About Us Page
export default function AboutUsPage() {
  return (
    <main className="bg-[#f6f4f1] min-h-screen">
      <Navbar />
      <AboutHero />
      <SocialMediaBanner />
      <QuoteSection />
      <CreatorGrowthSection />
      <BuiltForCreatorsSection />
      <ContentCardsSection />
      <VisionMissionSection />
      <AboutCTASection />
      <Footer />
    </main>
  );
}
