import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  bio: string;
  category: string;
  membersCount?: number;
  postsCount?: number;
  averageRating?: number | null;
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(n);
}

export default function ProfileHeader({ name, bio, category, membersCount, postsCount, averageRating }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col gap-[12px] items-start w-full">
      <div className="flex flex-col gap-[7px] items-start text-[#1a1a1a] w-full">
        <h1 className="font-['Fjalla_One',sans-serif] font-normal leading-[42.1px] text-[28px] tracking-[0.56px]">
          {name}
        </h1>
        <p className="font-['Figtree',sans-serif] font-medium leading-[25.8px] text-[16px] tracking-[0.32px]">
          {bio || 'Digital Artist and Photographer'}
        </p>
      </div>

      <div className="flex gap-[24px] items-center text-[#5a5a5a] w-full mt-[5px]">
        <div className="flex flex-col gap-[4px] items-center justify-center w-[86px]">
          <p className="font-[family-name:var(--font-volkhov)] leading-[42.1px] text-[24px] tracking-[0.48px]">
            {membersCount !== undefined ? formatCount(membersCount) : '—'}
          </p>
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px]">
            Members
          </p>
        </div>
        <div className="flex flex-col gap-[4px] items-center justify-center w-[58px]">
          <p className="font-[family-name:var(--font-volkhov)] leading-[42.1px] text-[24px] tracking-[0.48px]">
            {postsCount !== undefined ? postsCount : '—'}
          </p>
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px]">
            Posts
          </p>
        </div>
        <div className="flex flex-col gap-[4px] items-center justify-center w-[90px]">
          <p className="font-[family-name:var(--font-volkhov)] leading-[42.1px] text-[24px] tracking-[0.48px]">
            {averageRating !== undefined && averageRating !== null ? `${averageRating}/5` : '—'}
          </p>
          <p className="font-['Figtree',sans-serif] font-medium leading-[18.3px] text-[13px] tracking-[0.26px]">
            Average rating
          </p>
        </div>
      </div>
    </div>
  );
}

