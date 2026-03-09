"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, Participant } from "../types";
import { getInitials, getTimeNow } from "../data";
import {
  SparkleIcon,
  ChatIcon,
  StopIcon,
  ShieldIcon,
  CloseIcon,
  MessageIcon,
  SendIcon,
} from "./Icons";

interface AICompanionPanelProps {
  chat: ChatMessage[];
  participants: Participant[];
  onSendMessage: (text: string) => void;
  onCatchUp: () => void;
  onMentionCheck: () => void;
  onClose: () => void;
}

function ChatAvatar({ name, participants }: { name: string; participants: Participant[] }) {
  const participant = participants.find((p) => p.name === name);

  if (!participant) {
    return (
      <div className="w-7 h-7 rounded-full bg-[#e5e7eb] flex items-center justify-center text-[#5a6573] text-[11px] font-bold shrink-0">
        {getInitials(name)}
      </div>
    );
  }
  if (participant.img) {
    return (
      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={participant.img} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
      style={{ background: participant.color }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function AICompanionPanel({
  chat,
  participants,
  onSendMessage,
  onCatchUp,
  onMentionCheck,
  onClose,
}: AICompanionPanelProps) {
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  function handleSend() {
    const text = inputRef.current?.value.trim() ?? "";
    if (!text) return;
    onSendMessage(text);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <section
      className="panel ai overflow-hidden rounded-[14px] border border-[#dcdfe4] grid min-h-0"
      style={{
        gridTemplateRows: "46px 58px 1fr 50px 88px",
        background: "white",
      }}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3.5 bg-[#fbfbfc] border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2 text-[#707786]">
          <ChatIcon className="w-4 h-4" />
          <StopIcon className="w-3.5 h-3.5 opacity-60" />
        </div>
        <div className="text-xs font-bold text-[#374151]">AI Companion</div>
        <div className="flex items-center gap-2 text-[#707786]">
          <ShieldIcon className="w-4 h-4" />
          <button onClick={onClose} className="hover:text-[#374151] transition-colors">
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Companion Sub-header */}
      <div className="flex flex-col items-center gap-2 px-3.5 pt-2 pb-2.5 bg-[#fbfbfc] border-b border-[#e5e7eb]">
        <div className="text-xs font-semibold text-[#4b5563]">AI Companion</div>
        <button className="border border-[#ff9999] text-[#ff5a5a] bg-white text-xs px-2.5 py-1 rounded-md cursor-pointer hover:bg-red-50 transition-colors">
          Detener AI Companion
        </button>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="overflow-auto px-3 py-3.5 flex flex-col gap-4 bg-white"
      >
        {chat.map((msg, i) => {
          if (msg.self) {
            return (
              <div key={i} className="grid grid-cols-1 justify-items-end">
                <div className="flex flex-col gap-0.5 items-end">
                  <div className="flex items-baseline gap-1.5 justify-end">
                    <span className="text-[11px] text-[#98a2b3]">{msg.time}</span>
                  </div>
                  <div className="text-[13px] text-[#111827] leading-snug bg-[#eef5ff] px-2.5 py-2 rounded-2xl max-w-[78%] wrap-break-word">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          }

          if (msg.ai) {
            return (
              <div key={i} className="grid gap-2.5 items-start" style={{ gridTemplateColumns: "28px 1fr" }}>
                <div className="w-7 h-7 rounded-full bg-[#eef2ff] text-[#4f46e5] flex items-center justify-center shrink-0">
                  <SparkleIcon className="w-4 h-4" aria-label="AI" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-semibold text-[#334155]">{msg.name}</span>
                  </div>
                  <div className="text-[13px] text-[#111827] leading-snug wrap-break-word">{msg.text}</div>
                </div>
              </div>
            );
          }

          return (
            <div key={i} className="grid gap-2.5 items-start" style={{ gridTemplateColumns: "28px 1fr" }}>
              <ChatAvatar name={msg.name} participants={participants} />
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-semibold text-[#334155]">{msg.name}</span>
                  <span className="text-[11px] text-[#98a2b3]">{msg.time}</span>
                </div>
                <div className="text-[13px] text-[#111827] leading-snug wrap-break-word">{msg.text}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Prompts */}
      <div className="px-3.5 pb-2.5 pt-0 flex gap-2.5 flex-wrap bg-white border-t border-[#f0f1f3]">
        <button
          onClick={onCatchUp}
          className="border border-[#d7dbe2] bg-[#f8fafc] text-[#4b5563] text-xs px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#e8edf3] transition-colors"
        >
          Ponme al día
        </button>
        <button
          onClick={onMentionCheck}
          className="border border-[#d7dbe2] bg-[#f8fafc] text-[#4b5563] text-xs px-3 py-1.5 rounded-xl cursor-pointer hover:bg-[#e8edf3] transition-colors"
        >
          ¿Mencionaron mi nombre?
        </button>
      </div>

      {/* Composer */}
      <div className="border-t border-[#e5e7eb] bg-white grid gap-2.5 p-3.5 pb-3" style={{ gridTemplateRows: "auto auto auto" }}>
        <div className="relative">
          <MessageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#9aa3af]" />
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje o / para más opciones"
            className="w-full h-11 border border-[#d7dbe2] rounded-xl pl-9 pr-10 text-[13px] text-[#1f2937] outline-none focus:border-[#9ec5ff] focus:shadow-[0_0_0_2px_rgba(14,113,235,0.1)]"
          />
          <SendIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-[#9aa3af]" />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            className="border-0 bg-transparent text-[#0e71eb] text-[13px] font-semibold cursor-pointer hover:text-[#0059cc] transition-colors"
          >
            Enviar
          </button>
        </div>
        <div className="text-center text-xs text-[#95a0ae]">
          La IA puede cometer errores. Verifica la información.
        </div>
      </div>
    </section>
  );
}
