"use client";

import { useState, useEffect } from "react";
import { Speaker } from "../types";

interface StageProps {
  speaker: Speaker;
}

/** Derives initials from a full name (up to 2 chars) */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function Stage({ speaker }: StageProps) {
  // speaker.img is either a CURP/folio-based path or a legacy URL.
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (speaker.img) setImgError(false);
  }, [speaker.img]);

  const showPhoto = speaker.img && !imgError;

  return (
    <div className="w-full h-full relative min-w-0 min-h-0 overflow-hidden bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]">
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={speaker.img}
          src={speaker.img}
          alt="Ponente"
          className="w-full h-full object-cover block"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback: large initials avatar */
        <div className="w-full h-full flex items-center justify-center bg-[#1a1d23]">
          <div
            className="w-36 h-36 rounded-full flex items-center justify-center text-5xl font-bold text-white select-none shadow-lg"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)" }}
          >
            {getInitials(speaker.name)}
          </div>
        </div>
      )}

      {/* Name label */}
      <div className="absolute left-2 bottom-2 h-6 px-2.5 bg-black/62 rounded-full inline-flex items-center gap-1.5 text-xs text-white z-10">
        <svg className="w-4 h-4" viewBox="0 0 20 20">
          <path
            fill="currentColor"
            d="M10 13.5A3.5 3.5 0 0 0 13.5 10V6.5a3.5 3.5 0 1 0-7 0V10A3.5 3.5 0 0 0 10 13.5Zm5-3a.5.5 0 0 1 1 0A6 6 0 0 1 10.5 16v1.5h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2V16A6 6 0 0 1 4 10.5a.5.5 0 0 1 1 0 5 5 0 0 0 10 0Z"
          />
        </svg>
        <span>{speaker.name}</span>
      </div>
    </div>
  );
}
