import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 bg-[var(--color-ink)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span className="font-display text-lg font-extrabold text-white">
          AHMED <span className="text-[var(--color-red-primary)]">RED</span> CAR
        </span>

        <nav className="flex flex-wrap gap-6">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-body text-sm text-white/60 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <span className="font-body text-xs text-white/40">
          &copy; {new Date().getFullYear()} Ahmed Red Car. Tous droits reserves.
        </span>
      </div>
    </footer>
  );
}
