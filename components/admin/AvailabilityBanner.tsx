"use client";

import { useEffect, useRef, useState } from "react";
import {
  checkAvailabilityAction,
  type AvailabilityResult,
} from "@/app/admin/real/actions";

export default function AvailabilityBanner({
  vehicleId,
  startDate,
  endDate,
  excludeReservationId,
  onResult,
}: {
  vehicleId: number | null;
  startDate: string;
  endDate: string;
  excludeReservationId?: number;
  onResult?: (result: AvailabilityResult) => void;
}) {
  const [result, setResult] = useState<AvailabilityResult>({ state: "unknown" });
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  });

  useEffect(() => {
    let cancelled = false;
    const ready =
      Boolean(vehicleId) && Boolean(startDate) && Boolean(endDate) && endDate >= startDate;

    const timer = setTimeout(
      async () => {
        let next: AvailabilityResult = { state: "unknown" };
        if (ready && vehicleId) {
          try {
            next = await checkAvailabilityAction(
              vehicleId,
              startDate,
              endDate,
              excludeReservationId
            );
          } catch {
            next = { state: "unknown" };
          }
        }
        if (cancelled) return;
        setResult(next);
        onResultRef.current?.(next);
      },
      ready ? 300 : 0
    );

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [vehicleId, startDate, endDate, excludeReservationId]);

  if (result.state === "free") {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
      >
        {"Voiture libre pour ces dates"}
      </div>
    );
  }

  if (result.state === "reserved") {
    return (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600"
      >
        {"Voiture r\u00e9serv\u00e9e jusqu'au " + result.until}
      </div>
    );
  }

  return null;
}