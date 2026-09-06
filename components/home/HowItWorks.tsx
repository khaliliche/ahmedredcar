import { Search, CalendarCheck, KeyRound, MapPinned } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choisissez votre vehicule",
    text: "Parcourez notre flotte et trouvez le vehicule adapte a votre voyage.",
  },
  {
    icon: CalendarCheck,
    title: "Reservez en quelques clics",
    text: "Selectionnez vos dates et confirmez votre reservation via WhatsApp.",
  },
  {
    icon: KeyRound,
    title: "Recuperez votre vehicule",
    text: "Recuperez les cles a l'agence ou a l'aeroport, selon votre choix.",
  },
  {
    icon: MapPinned,
    title: "Profitez du voyage",
    text: "Prenez la route en toute confiance, ou que vous alliez au Maroc.",
  },
];

export default function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
      <div className="max-w-lg">
        <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
          Comment ca marche
        </h2>
        <p className="mt-3 font-body text-black/60">
          Louer une voiture avec Ahmed Red Car en quatre etapes simples.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-[var(--color-ink)] font-display text-sm font-bold text-white">
                {i + 1}
              </span>
              <Icon className="text-[var(--color-red-primary)]" size={22} />
            </div>
            <h3 className="font-display text-lg font-bold text-[var(--color-ink)]">
              {title}
            </h3>
            <p className="font-body text-sm text-black/60">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
