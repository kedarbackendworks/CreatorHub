export default function CreatorAbout({ creatorId }: { creatorId?: string }) {
  return (
    <div className="flex flex-col gap-[8px] items-start w-full max-w-[1116px]">
      
      {/* Bio Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Bio
        </h3>
        <p className="font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[#5a5a5a] text-[16px] tracking-[0.32px] w-full">
          Riya specializes in helping people who struggle with consistency and don’t have access to gyms. Over the past 5 years, I have guided thousands of clients through structured home workout programs and realistic diet plans. My approach focuses on building long-term habits rather than quick fixes, making fitness easier to follow and maintain. I believe that anyone can transform their lifestyle with the right guidance, support, and mindset.
        </p>
      </div>

      {/* Expertise Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Expertise
        </h3>
        <ul className="list-disc font-['Figtree',sans-serif] font-medium leading-[0] text-[#5a5a5a] text-[16px] tracking-[0.32px]">
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Fat Loss & Body Transformation</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Home Workouts (No Equipment)</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Beginner Fitness Programs</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Nutrition & Meal Planning</span>
          </li>
          <li className="ml-[24px]">
            <span className="leading-[25.8px]">Habit Building & Consistency</span>
          </li>
        </ul>
      </div>

      {/* Achievements Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Achievements
        </h3>
        <ul className="list-disc font-['Figtree',sans-serif] font-medium leading-[0] text-[#5a5a5a] text-[16px] tracking-[0.32px]">
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Helped 10,000+ clients complete fitness programs</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Average client transformation in 8–12 weeks</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">Featured in online fitness communities</span>
          </li>
          <li className="ml-[24px]">
            <span className="leading-[25.8px]">4.8 average rating across programs</span>
          </li>
        </ul>
      </div>

      {/* Platform Credibility Section */}
      <div className="bg-[#fcfaf7] border-[0.5px] border-[#e4ded2] flex flex-col gap-[12px] items-start justify-center p-[24px] rounded-[12px] w-full">
        <h3 className="font-['Figtree',sans-serif] font-semibold leading-[29.2px] text-[#1a1a1a] text-[19px] tracking-[0.38px]">
          Platform Credibility
        </h3>
        <ul className="list-disc font-['Figtree',sans-serif] font-medium leading-[0] text-[#5a5a5a] text-[16px] tracking-[0.32px]">
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">50+ courses created</span>
          </li>
          <li className="mb-0 ml-[24px]">
            <span className="leading-[25.8px]">100+ workout videos</span>
          </li>
          <li className="ml-[24px]">
            <span className="leading-[25.8px]">1,800+ active members</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
