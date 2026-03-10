"use client";

import { useState } from "react";
import { Speaker, Participant } from "../types";
import Stage from "./Stage";
import Filmstrip from "./Filmstrip";
import { ShieldIcon, EditIcon } from "./Icons";

interface MeetingSectionProps {
  title: string;
  speaker: Speaker;
  participants: Participant[];
  onToggleEditor: () => void;
  onParticipantClick: (index: number) => void;
}

export default function MeetingSection({
  title,
  speaker,
  participants,
  onToggleEditor,
  onParticipantClick,
}: MeetingSectionProps) {
  const [filmstripVisible, setFilmstripVisible] = useState(true);

  return (
    <section
      className="min-w-0 min-h-0 grid"
      style={{
        background: "#07090d",
        gridTemplateRows: "58px 1fr",
      }}
    >
      {/* Meeting Header */}
      <div
        className="flex items-center justify-between px-4 text-xs text-[#f5f7fa] border-b border-white/4"
        style={{ background: "linear-gradient(180deg,#0d0f12 0%,#0b0d10 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleEditor}
            title="Editar mock"
            className="w-[30px] h-[30px] rounded-lg border border-white/8 bg-white/5 text-[#eef2f8] inline-flex items-center justify-center cursor-pointer hover:bg-white/12 transition-colors"
          >
            <EditIcon className="w-4 h-4" />
          </button>

          <div className="h-[30px] px-3 rounded-lg inline-flex items-center gap-1.5 bg-white/5 border border-white/8 text-[#eef2f8] whitespace-nowrap">
            <ShieldIcon className="w-4 h-4" />
            <span>Vista del ponente</span>
          </div>
        </div>

        <div className="h-[30px] px-3 rounded-lg inline-flex items-center bg-white/5 border border-white/8 text-[#eef2f8] whitespace-nowrap">
          {title}
        </div>
      </div>

      {/* Meeting Body */}
      <div
        className="min-h-0 relative grid gap-3"
        style={{
          gridTemplateColumns: filmstripVisible ? "minmax(0,1fr) 258px" : "minmax(0,1fr)",
          transition: "grid-template-columns 0.25s ease",
        }}
      >
        {/* Stage — double-click to toggle filmstrip (hidden interaction) */}
        <div
          className="min-w-0 min-h-0 flex justify-center items-stretch pt-2.5 cursor-pointer select-none"
          style={{ background: "#030405" }}
          onDoubleClick={() => setFilmstripVisible((v) => !v)}
          title=""
        >
          <Stage speaker={speaker} />
        </div>

        {/* Filmstrip */}
        {filmstripVisible && (
          <Filmstrip participants={participants} onParticipantClick={onParticipantClick} />
        )}
      </div>
    </section>
  );
}
