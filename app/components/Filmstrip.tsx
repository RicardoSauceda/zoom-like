"use client";

import { Participant } from "../types";
import { getInitials } from "../data";
import { MicIcon, MicOffIcon } from "./Icons";

interface FilmstripProps {
  participants: Participant[];
  onParticipantClick: (index: number) => void;
}

export default function Filmstrip({ participants, onParticipantClick }: FilmstripProps) {
  // Exclude "ICATECH" (host/me) from filmstrip
  const strip = participants.filter((p) => p.name !== "ICATECH");

  return (
    <div
      className="overflow-auto grid gap-[9px] px-0 pr-2 py-2.5"
      style={{
        background: "#0f1012",
        gridAutoRows: 135,
      }}
    >
      {strip.map((p, i) => {
        const originalIndex = participants.findIndex((x) => x === p);
        return (
          <div
            key={p.name + i}
            onClick={() => onParticipantClick(originalIndex)}
            className={`relative overflow-hidden rounded-lg cursor-pointer border border-white/6 bg-[#090909] ${
              p.speaking ? "shadow-[inset_0_0_0_2px_#00c853]" : ""
            }`}
          >
            {/* Background avatar or solid color */}
            <div
              className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold"
              style={{ background: p.img ? "transparent" : p.color }}
            >
              {!p.img && getInitials(p.name)}
            </div>

            {p.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover block"
              />
            )}

            {/* Name pill */}
            <div className="absolute left-2 bottom-2 max-w-[calc(100%-16px)] bg-black/62 text-white rounded-full px-2 py-1 text-[11px] inline-flex items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis">
              {p.muted ? (
                <MicOffIcon className="w-3 h-3 text-[#ff6a6a] shrink-0" aria-label="Muted" />
              ) : (
                <MicIcon className="w-3 h-3 text-[#4ade80] shrink-0" aria-label="Unmuted" />
              )}
              <span>{p.name}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
