"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteReservationAction } from "@/app/admin/real/actions";

export default function DeleteContractButton({
  id,
  label,
}: {
  id: number;
  /** Shown in the confirmation prompt, e.g. "ARC-2026-00012 - Ali Benali". */
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    const ok = window.confirm(
      `Supprimer définitivement le contrat ${label} ?\n\nCette action est irréversible : le contrat, les signatures et la réservation seront effacés.`
    );
    if (!ok) return;
    startTransition(async () => {
      await deleteReservationAction(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title="Supprimer"
      className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" />
      {pending ? "..." : "Supprimer"}
    </button>
  );
}
