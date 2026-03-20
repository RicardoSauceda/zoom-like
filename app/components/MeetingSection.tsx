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
  onNextSpeakerPhoto?: () => void;
}

export default function MeetingSection({
  title,
  speaker,
  participants,
  onToggleEditor,
  onParticipantClick,
  onNextSpeakerPhoto,
}: MeetingSectionProps) {
  const [filmstripVisible, setFilmstripVisible] = useState(false);

  return (
    <section
      className="flex-1 w-full h-full min-w-0 min-h-0 grid"
      style={{
        background: "#07090d",
        gridTemplateRows: "39px 1fr",
      }}
    >
      {/* Meeting Header */}
      <div
        className="flex items-center justify-end px-4 text-xs text-[#f5f7fa] border-b border-black md:border-transparent"
        style={{ background: "#000000", height: 39 }}
      >
        <div className="h-[30px] px-3 rounded-lg inline-flex items-center text-[#eef2f8] whitespace-nowrap font-medium text-[13px]">
          {title}
        </div>
      </div>

      {/* Meeting Body */}
      <div
        className="w-full h-full relative grid gap-3"
        style={{
          gridTemplateColumns: filmstripVisible ? "minmax(0,1fr) 258px" : "minmax(0,1fr)",
          transition: "grid-template-columns 0.25s ease",
        }}
      >
        {/* Stage — double-click to toggle filmstrip or change photo */}
        <div
          data-testid="meeting-stage"
          className="min-w-0 min-h-0 flex justify-center items-stretch cursor-pointer select-none overflow-hidden"
          style={{ background: "#030405" }}
          onDoubleClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const isLeft = e.clientX - rect.left < rect.width / 2;
            if (isLeft && onNextSpeakerPhoto) {
              onNextSpeakerPhoto();
            } else {
              setFilmstripVisible((v) => !v);
            }
          }}
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
