"use client";

import {
  MicOffIcon,
  VideoIcon,
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
} from "./Icons";

interface FooterControlProps {
  icon: React.ReactNode;
  label: string;
  iconColor?: string;
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
      <div className="flex items-center gap-1 h-5">
        {icon}
        {badge !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] text-[#f1f4f8]">
            <span className="text-[10px] min-w-[14px] h-[14px] px-1 inline-flex items-center justify-center bg-[#111827] border border-white/8 rounded-full">
              {badge}
            </span>
          </span>
        )}
        {caret && (
          <ChevronDownIcon className="w-2.5 h-2.5 text-[#d5dae3]" />
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
        <FooterControl
          caret
          label="Audio"
          icon={<MicOffIcon className="w-5 h-5 text-[#ff6a6a]" />}
        />
        <FooterControl
          caret
          label="Video"
          icon={<VideoIcon className="w-5 h-5" />}
        />
      </div>

      {/* Center */}
      <div className="flex items-center gap-0.5 justify-center">
        <FooterControl
          label="Seguridad"
          icon={<ShieldIcon className="w-5 h-5" />}
        />
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
          icon={<ShareScreenIcon className="w-5 h-5 text-[#18d26e]" />}
        />
        <FooterControl
          label="Herramientas"
          icon={<HostToolsIcon className="w-5 h-5" />}
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
      <div className="flex items-center justify-end">
        <button className="bg-transparent text-[#ff4d4f] border border-white/8 rounded-lg px-4 py-[9px] text-[13px] font-semibold cursor-pointer hover:bg-white/5 transition-colors">
          Terminar
        </button>
      </div>
    </div>
  );
}
