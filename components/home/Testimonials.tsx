import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Youssef B.",
    text: "Service impeccable, voiture propre et recuperee a l'heure. Je recommande.",
  },
  {
    name: "Sara M.",
    text: "Reservation ultra simple via WhatsApp, reponse rapide et prix clair des le depart.",
  },
  {
    name: "Karim T.",
    text: "Deuxieme location avec Ahmed Red Car, toujours au top pour les road trips.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[var(--color-mist)] py-20">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="max-w-lg">
          <h2 className="font-display text-3xl font-extrabold text-[var(--color-ink)] sm:text-4xl">
            Ce que disent nos clients
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 bg-white p-6">
              <div className="flex gap-1 text-[var(--color-red-primary)]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="font-body text-sm text-black/70">{t.text}</p>
              <span className="font-display text-sm font-bold text-[var(--color-ink)]">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}