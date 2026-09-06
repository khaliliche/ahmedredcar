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

      <div className="relative mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div
          aria-hidden
          className="absolute left-0 right-0 top-5 hidden border-t-2 border-dashed border-black/15 lg:block"
        />

        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="relative flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center bg-[var(--color-ink)] font-display text-sm font-bold text-white">
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