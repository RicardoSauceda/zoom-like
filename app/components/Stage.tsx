"use client";

import Image from "next/image";
import { Speaker } from "../types";

interface StageProps {
  speaker: Speaker;
}

export default function Stage({ speaker }: StageProps) {
  return (
    <div className="w-full h-full relative min-w-0 min-h-0 overflow-hidden bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.025)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={speaker.img}
        alt="Ponente"
        className="w-full h-full object-cover block"
      />
      <div className="absolute left-2 bottom-2 h-6 px-2.5 bg-black/62 rounded-full inline-flex items-center gap-1.5 text-xs text-white z-10">
        {/* Microphone icon */}
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
