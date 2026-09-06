import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VehicleNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 pt-32 text-center">
      <h1 className="font-display text-3xl font-extrabold text-[var(--color-ink)]">
        Vehicule introuvable
      </h1>
      <p className="max-w-sm font-body text-black/60">
        Ce vehicule n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <Link
        href="/vehicules"
        className="inline-flex items-center gap-2 border border-[var(--color-ink)] px-5 py-2.5 text-sm font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-white"
      >
        <ArrowLeft size={16} />
        Voir tous les vehicules
      </Link>
    </main>
  );
}