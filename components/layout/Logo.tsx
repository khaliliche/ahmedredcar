import Image from "next/image";

interface LogoProps {
  iconSize?: number;
  textClassName?: string;
  className?: string;
  stacked?: boolean;
}

export default function Logo({
  iconSize = 40,
  textClassName = "text-lg",
  className = "",
  stacked = false,
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/ahmed-redcar-logo.png"
        alt="Ahmed Red Car"
        width={512}
        height={512}
        className="shrink-0 rounded-lg object-contain"
        style={{ height: iconSize, width: "auto" }}
        priority
      />

      <span
        className={`font-display font-extrabold leading-none text-white ${textClassName} ${
          stacked ? "flex flex-col gap-1" : "whitespace-nowrap"
        }`}
      >
        <span>AHMED</span>
        {stacked ? null : " "}
        <span className="text-[var(--color-red-primary)]">RED CAR</span>
      </span>
    </div>
  );
}