import { Users, Wrench, Headset, Tag } from "lucide-react";

const items = [
  { icon: Users, value: "500+", label: "clients satisfaits" },
  { icon: Wrench, value: "100%", label: "vehicules entretenus" },
  { icon: Headset, value: "7j/7", label: "assistance disponible" },
  { icon: Tag, value: "0", label: "frais caches" },
];

export default function TrustIndicators() {
  return (
    <section className="border-y border-black/10 bg-[var(--color-mist)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-black/10 px-6 sm:grid-cols-4 sm:divide-y-0 lg:px-10">
        {items.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 px-4 py-8 text-center"
          >
            <Icon className="text-[var(--color-red-primary)]" size={20} />
            <span className="font-display text-2xl font-extrabold text-[var(--color-ink)]">
              {value}
            </span>
            <span className="font-body text-xs text-black/60">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}