"use client";

import { useState } from "react";
import { Participant } from "../types";
import { getInitials } from "../data";
import { MoreVerticalIcon, CloseIcon, StopIcon, HandRaiseIcon, MicIcon, MicOffIcon, VideoIcon, VideoOffIcon } from "./Icons";

interface ParticipantsPanelProps {
  participants: Participant[];
  onEditParticipant: (index: number) => void;
}

function ParticipantAvatar({ participant }: { participant: Participant }) {
  if (participant.img) {
    return (
      <div className="w-7 h-7 rounded-md overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={participant.img} alt={participant.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold text-white shrink-0 select-none"
      style={{ background: participant.color }}
    >
      {getInitials(participant.name)}
    </div>
  );
}

export default function ParticipantsPanel({
  participants,
  onEditParticipant,
}: ParticipantsPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section
      className="overflow-hidden rounded-[14px] border border-[#dcdfe4] grid min-h-0"
      style={{
        gridTemplateRows: "44px 44px 1fr 54px",
        background: "white",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-center relative px-3.5 border-b border-[#e5e7eb] text-xs font-bold text-[#374151] bg-[#fbfbfc]">
        <span>Participantes ({filtered.length})</span>
        <div className="absolute right-3.5 flex gap-2 text-[#7a818e] items-center">
          <StopIcon className="w-3.5 h-3.5 opacity-50" />
          <button className="hover:text-[#374151] transition-colors">
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-3.5 py-2 border-b border-[#e5e7eb] bg-white">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar participante"
          className="w-full h-8 border border-[#cfd5dd] rounded-lg px-2.5 outline-none text-xs"
        />
      </div>

      {/* List */}
      <div className="overflow-auto bg-white py-2">
        <div className="flex items-center justify-between px-3.5 py-2 pb-1.5 text-xs font-bold text-[#374151]">
          <span>Conectados ({filtered.length})</span>
        </div>

        {filtered.map((p, index) => {
          const originalIndex = participants.findIndex((x) => x === p);
          const status = p.speaking ? "Hablando" : p.muted ? "Silenciado" : "Disponible";

          return (
            <div
              key={p.name + index}
              onClick={() => onEditParticipant(originalIndex)}
              className="grid gap-2.5 items-center px-3.5 py-2.5 cursor-pointer hover:bg-[#f8fafc] transition-colors"
              style={{ gridTemplateColumns: "32px 1fr auto" }}
            >
              <ParticipantAvatar participant={p} />

              <div className="min-w-0 flex flex-col gap-0.5">
                <div className="text-xs text-[#1f2937] whitespace-nowrap overflow-hidden text-ellipsis">
                  {p.name}
                  {p.role && <span className="ml-1 text-[#6b7280]">{p.role}</span>}
                </div>
                <div className="text-[11px] text-[#6b7280]">{status}</div>
              </div>

              <div className="flex gap-2 items-center text-[#6b7280]">
                {p.raise && (
                  <HandRaiseIcon className="w-4 h-4 text-[#f59e0b]" aria-label="Raise hand" />
                )}
                {p.muted ? (
                  <MicOffIcon
                    className="w-4 h-4 text-[#ef4444]"
                    aria-label="Microphone off"
                  />
                ) : (
                  <MicIcon
                    className="w-4 h-4 text-[#6b7280]"
                    aria-label="Microphone on"
                  />
                )}
                {!p.video ? (
                  <VideoOffIcon
                    className="w-4 h-4 text-[#ef4444]"
                    aria-label="Camera off"
                  />
                ) : (
                  <VideoIcon
                    className="w-4 h-4 text-[#6b7280]"
                    aria-label="Camera on"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 border-t border-[#e5e7eb] bg-[#fbfbfc]">
        <button className="h-7 px-3 rounded-lg border border-[#d1d5db] bg-white text-[#374151] text-xs cursor-pointer hover:bg-[#f9fafb] transition-colors">
          Invitar
        </button>
        <button className="h-7 px-3 rounded-lg border border-[#d1d5db] bg-white text-[#374151] text-xs cursor-pointer hover:bg-[#f9fafb] transition-colors">
          Silenciar todos
        </button>
        <button className="h-7 w-7 rounded-lg border border-[#d1d5db] bg-white text-[#374151] text-xs cursor-pointer hover:bg-[#f9fafb] transition-colors flex items-center justify-center">
          <MoreVerticalIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
