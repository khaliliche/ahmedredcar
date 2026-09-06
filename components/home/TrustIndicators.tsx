import { Users, Wrench, Headset, Tag } from "lucide-react";

const items = [
  { icon: Users, label: "+500 clients satisfaits" },
  { icon: Wrench, label: "Véhicules régulièrement entretenus" },
  { icon: Headset, label: "Assistance disponible" },
  { icon: Tag, label: "Prix transparents" },
];

export default function TrustIndicators() {
  return (
    <section className="border-y border-black/5 bg-[var(--color-mist)]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4 lg:px-10">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left"
          >
            <Icon className="shrink-0 text-[var(--color-red-primary)]" size={22} />
            <span className="font-body text-sm text-black/70">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
