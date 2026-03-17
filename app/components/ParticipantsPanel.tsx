"use client";

import { useState } from "react";
import { Participant } from "../types";
import { getInitials } from "../data";
import { MoreVerticalIcon, CloseIcon, StopIcon, HandRaiseIcon, MicIcon, MicOffIcon, MicActiveIcon, VideoIcon, VideoOffIcon, ChevronDownIcon } from "./Icons";

interface ParticipantsPanelProps {
  participants: Participant[];
  onEditParticipant: (index: number) => void;
  onHiddenAction?: (index: number) => void;
}

function ParticipantAvatar({ participant }: { participant: Participant }) {
  if (participant.img) {
    return (
      <div className="w-[30px] h-[30px] rounded-[6px] border-2 border-white overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={participant.img} alt={participant.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-[30px] h-[30px] rounded-[6px] border-2 border-white flex items-center justify-center text-[12px] font-medium text-white shrink-0 select-none"
      style={{ background: participant.color }}
    >
      {getInitials(participant.name)}
    </div>
  );
}

export default function ParticipantsPanel({
  participants,
  onEditParticipant,
  onHiddenAction,
}: ParticipantsPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section
      className="overflow-hidden grid min-h-0"
      style={{
        gridTemplateRows: "44px 44px 1fr 54px",
        background: "white",
      }}
    >
      <div className="flex items-center justify-center relative px-2.5 border-b border-[#e5e7eb] text-[13px] font-semibold text-[#1a1a1a] bg-white">
        <span>Participantes ({filtered.length})</span>
        <div className="absolute right-2.5 flex gap-2 text-[#6e6e6e] items-center">
          <button className="hover:bg-[#f0f0f0] p-1 rounded transition-colors">
             <StopIcon className="w-3.5 h-3.5 rotate-45" /> {/* Placeholder for pop-out if needed, but Zoom has it */}
          </button>
          <button className="hover:bg-[#f0f0f0] p-1 rounded transition-colors">
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
              onContextMenu={(e) => {
                e.preventDefault();
                onHiddenAction?.(originalIndex);
              }}
              className="grid gap-[12px] items-center px-[12px] py-1.5 cursor-pointer hover:bg-[#edf2fa] transition-colors"
              style={{ gridTemplateColumns: "30px 1fr auto" }}
            >
              <ParticipantAvatar participant={p} />

              <div className="min-w-0 flex flex-col">
                <div className="text-[14px] text-[#1a1a1a] whitespace-nowrap overflow-hidden text-ellipsis leading-tight font-medium">
                  {p.name}
                  {p.role && <span className="ml-1 text-[#6b7280] font-normal">{p.role}</span>}
                </div>
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
                ) : originalIndex === 0 ? (
                  <MicActiveIcon
                    className="w-4 h-4 text-[#6b7280]"
                    aria-label="Microphone on"
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

      <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 border-t border-[#e5e7eb] bg-white">
        <button className="h-[28px] px-3 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[13px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors">
          Invitar
        </button>
        <button className="h-[28px] px-3 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[13px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors">
          Silenciar a todos
        </button>
        <button className="h-[28px] px-3 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[13px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors flex items-center justify-center gap-1">
          Más <ChevronDownIcon className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
