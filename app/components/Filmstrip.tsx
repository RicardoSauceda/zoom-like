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
            className={`relative overflow-hidden rounded-lg cursor-pointer border border-white/6 bg-[rgb(26,26,26)] ${
              p.speaking ? "shadow-[inset_0_0_0_2px_#00c853]" : ""
            }`}
          >
            {/* Background initials avatar */}
            <div
              className="absolute inset-0 flex items-center justify-center text-white"
            >
              {!p.img && !p.video && (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg"
                  style={{ background: p.color }}
                >
                  {getInitials(p.name)}
                </div>
              )}
            </div>

            {p.img && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.img}
                alt={p.name}
                className={`w-full h-full object-cover block ${(p.name === "ICATECH" || p.role.includes("yo")) ? "-scale-x-100" : ""}`}
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
