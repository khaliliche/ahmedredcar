"use client";

import { useRef } from "react";
import { Printer, Download } from "lucide-react";

export default function ContractPdfViewer({ src }: { src: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  function handlePrint() {
    try {
      const w = frameRef.current?.contentWindow;
      if (!w) throw new Error("no frame");
      w.focus();
      w.print();
    } catch {
      window.open(src, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 rounded-lg bg-[var(--color-red-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
        >
          <Printer className="h-4 w-4" />
          Imprimer
        </button>
        <a
          href={`${src}?download=1`}
          className="flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-black/5"
        >
          <Download className="h-4 w-4" />
          Enregistrer en PDF
        </a>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-black/50 underline hover:text-black/80"
        >
          Ouvrir dans un onglet
        </a>
      </div>

      <iframe
        ref={frameRef}
        src={`${src}#toolbar=0&navpanes=0`}
        title="Contrat"
        className="h-[80vh] w-full rounded-xl border border-black/10 bg-white"
      />
    </div>
  );
}