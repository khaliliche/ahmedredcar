import { Shield, MapPin, Clock } from "lucide-react";

const points = [
  { icon: Shield, text: "Vehicules verifies et assures" },
  { icon: MapPin, text: "Presence dans les principales villes du Maroc" },
  { icon: Clock, text: "Reponse rapide, 7j/7" },
];

export default function AboutSection() {
  return (
    <section id="a-propos" className="bg-[var(--color-mist)] py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-2 lg:px-10">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            A propos d&apos;Ahmed Red Car
          </h2>
          <p className="mt-4 font-body text-black/70">
            Ahmed Red Car est une agence de location de voitures marocaine,
            pensee pour offrir une experience simple, transparente et sans
            mauvaise surprise. Que ce soit pour un trajet en ville, un
            week-end a la plage ou un road trip a travers le pays, nous
            mettons a votre disposition une flotte entretenue et un service
            reactif.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {points.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-4 border-b border-black/10 pb-6 last:border-0 last:pb-0"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--color-red-primary)]/30 bg-white text-[var(--color-red-primary)]">
                <Icon size={20} />
              </span>
              <span className="font-body text-black/80">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}