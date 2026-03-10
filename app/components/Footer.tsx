"use client";

import { useState } from "react";
import {
  MicActiveIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  ShieldIcon,
  PeopleIcon,
  ChatIcon,
  EmojiIcon,
  ShareScreenIcon,
  HostToolsIcon,
  SparkleIcon,
  AppsIcon,
  RecordIcon,
  InfoIcon,
  MoreHorizontalIcon,
  ChevronDownIcon,
  EndMeetingIcon,
} from "./Icons";

interface FooterControlProps {
  icon: React.ReactNode;
  label: string;
  caret?: boolean;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}

function FooterControl({ icon, label, caret = false, badge, active = false, onClick }: FooterControlProps) {
  return (
    <div
      onClick={onClick}
      className={`min-w-[74px] h-16 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer px-1.5 transition-colors ${
        active
          ? "bg-white/12 text-white"
          : "text-[#f6f7fb] hover:bg-white/8"
      }`}
    >
      {/* Icon row: centered icon + caret floated right without shifting center */}
      <div className="relative flex items-center justify-center h-5 w-full">
        <div className="flex items-center justify-center h-5">
          {icon}
          {badge !== undefined && (
            <span className="ml-0.5 text-[10px] min-w-[14px] h-[14px] px-1 inline-flex items-center justify-center bg-[#111827] border border-white/8 rounded-full text-[#f1f4f8]">
              {badge}
            </span>
          )}
        </div>
        {caret && (
          <ChevronDownIcon className="absolute right-0 w-2.5 h-2.5 text-[#d5dae3]" />
        )}
      </div>
      <div className="text-[11px] leading-none whitespace-nowrap text-center">{label}</div>
    </div>
  );
}

interface FooterProps {
  participantCount: number;
  sidebarTab: "participants" | "chat";
  onTabChange: (tab: "participants" | "chat") => void;
}

export default function Footer({ participantCount, sidebarTab, onTabChange }: FooterProps) {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(true);

  return (
    <div
      className="grid items-center px-2.5 border-t border-white/6"
      style={{
        background: "#050505",
        gridTemplateColumns: "1fr auto 1fr",
        height: 66,
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-0.5 justify-start">
        {/* Mic toggle */}
        <div
          onClick={() => setMicMuted((v) => !v)}
          className="min-w-[74px] h-16 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer px-1.5 transition-colors text-[#f6f7fb] hover:bg-white/8"
        >
          {/* Icon centered, caret floated right absolutely */}
          <div className="relative flex items-center justify-center h-5 w-full">
            <div className="flex items-center justify-center h-5">
              {micMuted ? (
                <MicOffIcon className="w-5 h-5 text-white" />
              ) : (
                <MicActiveIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <ChevronDownIcon className="absolute right-0 w-2.5 h-2.5 text-[#d5dae3]" />
          </div>
          <div className="text-[11px] leading-none whitespace-nowrap text-center text-[#f6f7fb] mt-0.5">
            {micMuted ? "Activar audio" : "Silenciar"}
          </div>
        </div>

        {/* Video toggle */}
        <div
          onClick={() => setVideoOff((v) => !v)}
          className="min-w-[74px] h-16 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer px-1.5 transition-colors text-[#f6f7fb] hover:bg-white/8"
        >
          <div className="relative flex items-center justify-center h-5 w-full">
            <div className="flex items-center justify-center h-5">
              {videoOff ? (
                <VideoOffIcon className="w-5 h-5 text-white" />
              ) : (
                <VideoIcon className="w-5 h-5 text-white" />
              )}
            </div>
            <ChevronDownIcon className="absolute right-0 w-2.5 h-2.5 text-[#d5dae3]" />
          </div>
          <div className="text-[11px] leading-none whitespace-nowrap text-center text-[#f6f7fb] mt-0.5 truncate max-w-[65px]">
            {videoOff ? "Iniciar vídeo" : "Detener vídeo"}
          </div>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-0.5 justify-center">


        {/* Participantes — badge numérico superpuesto sobre el icono */}
        <div
          onClick={() => onTabChange("participants")}
          className={`min-w-[74px] h-16 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer px-1.5 transition-colors ${
            sidebarTab === "participants" ? "bg-white/12 text-white" : "text-[#f6f7fb] hover:bg-white/8"
          }`}
        >
          <div className="relative h-5 flex items-center justify-center">
            <PeopleIcon className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 inline-flex items-center justify-center bg-[#0e71eb] text-white text-[10px] font-bold rounded-full leading-none">
              {participantCount}
            </span>
          </div>
          <div className="text-[11px] leading-none whitespace-nowrap text-center">
            Participantes
          </div>
        </div>

        <FooterControl
          label="Chat"
          active={sidebarTab === "chat"}
          onClick={() => onTabChange("chat")}
          icon={<ChatIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="Reaccionar"
          icon={<EmojiIcon className="w-5 h-5" />}
        />
        <FooterControl
          caret
          label="Compartir"
          icon={<ShareScreenIcon className="w-5 h-5 text-white" />}
        />
        <FooterControl
          label="Seguridad"
          icon={<ShieldIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="AI Companion"
          icon={<SparkleIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="Apps"
          icon={<AppsIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="Grabar"
          icon={<RecordIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="Info. reunión"
          icon={<InfoIcon className="w-5 h-5" />}
        />
        <FooterControl
          label="Más"
          icon={<MoreHorizontalIcon className="w-5 h-5" />}
        />
      </div>

      {/* Right */}
      <div className="flex items-center justify-end pr-2">
        <div className="min-w-[74px] h-16 flex flex-col items-center justify-center gap-1 rounded-md cursor-pointer px-1.5 transition-colors text-[#ff4d4f] hover:bg-[#ff4d4f]/10">
          <div className="relative flex items-center justify-center h-6 w-full">
            <div className="flex items-center justify-center h-6">
              <EndMeetingIcon className="w-[22px] h-[22px] text-[#ff4d4f]" />
            </div>
          </div>
          <div className="text-[11px] font-medium leading-none whitespace-nowrap text-center text-[#ff4d4f]">
            Terminar
          </div>
        </div>
      </div>
    </div>
  );
}
