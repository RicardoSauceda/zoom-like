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
      <div className="w-[32px] h-[32px] rounded-[6px] border-2 border-white overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={participant.img} alt={participant.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-[32px] h-[32px] rounded-[6px] border-2 border-white flex items-center justify-center text-[13px] font-medium text-white shrink-0 select-none"
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
      className="flex flex-col min-h-0 bg-white"
    >
      <div className="flex items-center justify-center relative h-[48px] px-3.5 border-b border-[#e5e7eb] text-[14px] font-semibold text-[#1a1a1a] bg-white shrink-0">
        <span>Participantes ({filtered.length})</span>
        <div className="absolute right-2.5 flex gap-2 text-[#6e6e6e] items-center">
          <button className="hover:bg-[#f0f0f0] p-1 rounded transition-colors">
             <StopIcon className="w-3.5 h-3.5 rotate-180" />
          </button>
          <button className="hover:bg-[#f0f0f0] p-1 rounded transition-colors">
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto bg-white py-2">

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
              className="grid gap-[14px] items-center px-[16px] py-2 cursor-pointer hover:bg-[#edf2fa] transition-colors"
              style={{ gridTemplateColumns: "32px 1fr auto" }}
            >
              <ParticipantAvatar participant={p} />

              <div className="min-w-0 flex flex-col">
                <div className="text-[12px] text-[#131619] font-normal leading-[18px] whitespace-nowrap overflow-hidden text-ellipsis">
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

      <div className="flex items-center justify-between px-[16px] py-[16px] border-t border-[#e5e7eb] bg-white shrink-0">
        <button className="h-[30px] px-4 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[14px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors">
          Invitar
        </button>
        <button className="h-[30px] px-4 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[14px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors">
          Silenciar a todos
        </button>
        <button className="h-[30px] px-3 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] text-[14px] font-medium cursor-pointer hover:bg-[#f4f4f4] transition-colors flex items-center justify-center gap-1">
          Más <ChevronDownIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
