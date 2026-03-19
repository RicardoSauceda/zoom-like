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
    <div className="w-full h-full relative min-w-0 min-h-0 overflow-hidden bg-black flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-full max-h-full aspect-video overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[rgb(20,20,20)] flex items-center justify-center border border-white/5">
        {showPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={speaker.img}
            src={speaker.img}
            alt="Ponente"
            className={`w-full h-full object-contain block ${speaker.role?.includes("yo") ? "-scale-x-100" : ""}`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[rgb(26,26,26)]">
            <div
              className="w-[100px] h-[100px] rounded-lg flex items-center justify-center text-[40px] font-medium text-white select-none"
              style={{ background: "#719E37" }} // Use a solid green color closer to original Zoom for testing, or use actual speaker color
            >
              {getInitials(speaker.name)}
            </div>
          </div>
        )}

        {/* Name label - now inside the video box for better alignment */}
        <div className="absolute left-3 bottom-3 h-6 px-2.5 bg-black/60 backdrop-blur-md rounded-full inline-flex items-center gap-1.5 text-[11px] text-white z-10 border border-white/10">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20">
            <path
              fill="currentColor"
              d="M10 13.5A3.5 3.5 0 0 0 13.5 10V6.5a3.5 3.5 0 1 0-7 0V10A3.5 3.5 0 0 0 10 13.5Zm5-3a.5.5 0 0 1 1 0A6 6 0 0 1 10.5 16v1.5h2a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h2V16A6 6 0 0 1 4 10.5a.5.5 0 0 1 1 0 5 5 0 0 0 10 0Z"
            />
          </svg>
          <span>{speaker.name}</span>
        </div>
      </div>
    </div>
  );
}
