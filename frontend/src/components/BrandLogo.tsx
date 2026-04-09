type BrandLogoProps = {
  className?: string;
  textClassName?: string;
  iconSize?: number;
  showTrademark?: boolean;
  trademarkClassName?: string;
};

export default function BrandLogo({
  className,
  textClassName,
  iconSize = 24,
  showTrademark = false,
  trademarkClassName,
}: BrandLogoProps) {
  return (
    <div className={className ?? "inline-flex items-center gap-3"}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#ff5a36"/>
        <path d="M8 12L12 8L16 12L12 16L8 12Z" fill="white"/>
      </svg>

      <span className={textClassName ?? "text-xl font-bold tracking-tight text-slate-800"}>
        CreatorHub
        {showTrademark ? <span className={trademarkClassName ?? "text-xs align-top"}>®</span> : null}
      </span>
    </div>
  );
}