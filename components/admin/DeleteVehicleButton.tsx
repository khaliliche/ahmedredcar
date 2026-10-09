"use client";

import { Trash2 } from "lucide-react";

type DeleteVehicleButtonProps = {
  action: () => void;
};

export default function DeleteVehicleButton({
  action,
}: DeleteVehicleButtonProps) {
  return (
    <button
      type="submit"
      formAction={action}
      onClick={(event) => {
        const confirmed = window.confirm(
          "Êtes-vous sûr de vouloir supprimer ce véhicule ?\n\n" +
            "Cette action est irréversible."
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50"
      aria-label="Supprimer"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}