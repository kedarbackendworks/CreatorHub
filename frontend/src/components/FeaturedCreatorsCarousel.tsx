"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const cards = [
  {
    id: 1,
    image: "/assets/images/Frame 2147243604-4.png",
    label: "Fitness • Coaching Program",
    title: "FITFORM PRO FITNESS TRANSFORMATION PROGRAM",
  },
  {
    id: 2,
    image: "/assets/images/Frame 2147243604-3.png",
    label: "Technology • Online Course",
    title: "DEVSTACK HUB FULL STACK DEVELOPMENT COURSE",
  },
  {
    id: 3,
    image: "/assets/images/Frame 2147243604-2.png",
    label: "Content • Strategy",
    title: "CREATORFLOW CONTENT GROWTH SYSTEM",
  },
  {
    id: 4,
    image: "/assets/images/Frame 2147243604.png",
    label: "Education • Digital Products",
    title: "KNOWLEDGE PACK DIGITAL RESOURCE BUNDLE",
  },
  {
    id: 5,
    image: "/assets/images/Frame 2147243604-1.png",
    label: "Design • Assets",
    title: "CREATIVE DESIGN BUNDLE",
  },
];

export default function FeaturedCreatorsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full max-w-[1440px] mx-auto px-5 md:px-[63px] pb-16 md:pb-[80px]">
      <div className="relative">
        <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-[16px] md:gap-[24px]" style={{ touchAction: "pan-y" }}>
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex-[0_0_85%] md:flex-[0_0_644px] flex flex-col gap-[16px] relative shrink-0 mr-[16px] md:mr-[24px]"
              >
                <div className="h-[250px] md:h-[385px] relative rounded-[24px] w-full overflow-hidden">
                  <div className="absolute bg-white inset-0" />
                  <img
                    alt={card.title}
                    className="absolute inset-0 object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                    src={card.image}
                  />
                </div>
                <div className="flex flex-col gap-[4px] mt-2">
                  <p
                    className="text-[#9a9a9a] text-[13px] font-medium tracking-[0.26px] leading-[18.3px]"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    {card.label}
                  </p>
                  <p
                    className="text-[#3a3a3a] text-[16px] tracking-[0.32px] leading-[25.8px] sm:max-w-full truncate overflow-hidden whitespace-nowrap"
                    style={{ fontFamily: "'Fjalla One', sans-serif" }}
                  >
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shadcn UI Style Navigation Arrows (hidden on very small screens) */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white border border-[#e5e5e5] shadow-lg items-center justify-center text-black hover:bg-gray-50 transition-colors z-10"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white border border-[#e5e5e5] shadow-lg items-center justify-center text-black hover:bg-gray-50 transition-colors z-10"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
