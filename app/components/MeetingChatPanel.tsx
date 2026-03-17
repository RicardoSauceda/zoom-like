"use client";

import { useEffect, useRef } from "react";
import { ChatMessage, Participant } from "../types";
import { getInitials } from "../data";
import { CloseIcon, SendIcon, MessageIcon } from "./Icons";

interface MeetingChatPanelProps {
  messages: ChatMessage[];
  participants: Participant[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

function MessageAvatar({ name, participants }: { name: string; participants: Participant[] }) {
  const p = participants.find((x) => x.name === name);
  if (p?.img) {
    return (
      <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.img} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  const color = p?.color ?? "#6b7280";
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 select-none"
      style={{ background: color }}
    >
      {getInitials(name)}
    </div>
  );
}

export default function MeetingChatPanel({
  messages,
  participants,
  onSendMessage,
  onClose,
}: MeetingChatPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

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
      className="overflow-hidden grid min-h-0"
      style={{
        gridTemplateRows: "46px 1fr 68px",
        background: "white",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 bg-[#fbfbfc] border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2">
          <MessageIcon className="w-4 h-4 text-[#707786]" />
          <span className="text-xs font-bold text-[#374151]">Chat en la reunión</span>
        </div>
        <div className="flex items-center gap-2 text-[#707786]">
          <button
            onClick={onClose}
            className="hover:text-[#374151] transition-colors"
            title="Cerrar chat"
          >
            <CloseIcon className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="overflow-auto px-3 py-3 flex flex-col gap-3 bg-white">
        {/* Recipient label */}
        <div className="text-center text-[11px] text-[#9ca3af] py-1">
          Para: <span className="font-semibold text-[#6b7280]">Todos</span>
        </div>

        {messages.map((msg, i) => {
          /* Self messages → right */
          if (msg.self) {
            return (
              <div key={i} className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] text-[#9ca3af]">Tú</span>
                <div className="bg-[#eef5ff] text-[#111827] text-[13px] px-3 py-2 rounded-2xl rounded-tr-sm max-w-[82%] wrap-break-word leading-snug">
                  {msg.text}
                </div>
              </div>
            );
          }

          /* Others → left */
          return (
            <div key={i} className="flex gap-2 items-start">
              <MessageAvatar name={msg.name} participants={participants} />
              <div className="flex flex-col gap-0.5 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[11px] font-semibold text-[#374151]">{msg.name}</span>
                </div>
                <div className="bg-[#f3f4f6] text-[#111827] text-[13px] px-3 py-2 rounded-2xl rounded-tl-sm max-w-[82%] wrap-break-word leading-snug">
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-[#e5e7eb] bg-white flex items-center gap-2 px-3 py-2">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje…"
            className="w-full h-9 border border-[#d7dbe2] rounded-xl pl-3 pr-9 text-[13px] text-[#1f2937] outline-none focus:border-[#9ec5ff] focus:shadow-[0_0_0_2px_rgba(14,113,235,0.1)] transition-shadow"
          />
          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0e71eb] hover:text-[#0059cc] transition-colors"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
