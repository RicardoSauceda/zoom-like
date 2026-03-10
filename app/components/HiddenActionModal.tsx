"use client";

import { useState, useRef, useEffect } from "react";

interface HiddenActionModalProps {
  open: boolean;
  participantName: string;
  hasRaise: boolean;
  onClose: () => void;
  onToggleRaise: () => void;
  onSendMessage: (text: string) => void;
  onRemove: () => void;
}

export default function HiddenActionModal({
  open,
  participantName,
  hasRaise,
  onClose,
  onToggleRaise,
  onSendMessage,
  onRemove,
}: HiddenActionModalProps) {
  const [tab, setTab] = useState<"raise" | "chat" | "remove">("raise");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when changing to chat tab
  useEffect(() => {
    if (tab === "chat") {
      inputRef.current?.focus();
    }
  }, [tab]);

  if (!open) return null;

  function handleSend() {
    const text = inputRef.current?.value.trim();
    if (text) {
      onSendMessage(text);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSend();
  }

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-[340px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col scale-100 animate-in zoom-in-95 duration-200"
        style={{ fontFamily: 'var(--font-lato), "Lato", sans-serif' }}
      >
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 bg-[#fbfbfc] border-b border-[#eceff3]">
          <span className="text-[#1f2937] text-[13px] font-semibold">
            Acción oculta
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[#6b7280] hover:bg-[#e5e7eb] hover:text-[#111827] text-lg font-bold transition-colors"
          >
            &times;
          </button>
        </div>

        {/* User context info */}
        <div className="bg-[#f0f4f8] px-4 py-2 border-b border-[#eceff3]">
          <div className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider mb-1">
            Participante Target
          </div>
          <div className="text-[13px] font-semibold text-[#0e71eb] truncate">
            {participantName}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-3 gap-3 border-b border-[#eceff3] bg-white relative overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setTab("raise")}
            className={`px-1 py-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${
              tab === "raise" ? "text-[#0e71eb]" : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            Reacción (Mano)
            {tab === "raise" && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#0e71eb] rounded-t-sm" />
            )}
          </button>
          <button
            onClick={() => setTab("chat")}
            className={`px-1 py-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${
              tab === "chat" ? "text-[#0e71eb]" : "text-[#6b7280] hover:text-[#374151]"
            }`}
          >
            Mensaje Falso
            {tab === "chat" && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#0e71eb] rounded-t-sm" />
            )}
          </button>
          <button
            onClick={() => setTab("remove")}
            className={`px-1 py-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${
              tab === "remove" ? "text-[#ef4444]" : "text-[#6b7280] hover:text-[#ef4444]"
            }`}
          >
            Expulsar
            {tab === "remove" && (
              <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#ef4444] rounded-t-sm" />
            )}
          </button>
        </div>

        {/* Body */}
        <div className="p-4 bg-white min-h-[140px] flex flex-col justify-center">
          {tab === "raise" ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <p className="text-xs text-[#6b7280] text-center leading-relaxed">
                Controla el estado de participación para que aparezca el icono ✋ en su avatar y al inicio de la lista.
              </p>
              <button
                onClick={onToggleRaise}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 ${
                  hasRaise 
                    ? "bg-[#fef3c7] text-[#b45309] border border-[#fde68a] hover:bg-[#fde68a]" 
                    : "bg-[#0e71eb] text-white hover:bg-[#0059cc]"
                }`}
              >
                <span className="text-base">✋</span>
                {hasRaise ? "Bajar la mano" : "Levantar la mano"}
              </button>
            </div>
          ) : tab === "chat" ? (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] text-[#6b7280] leading-snug">
                El mensaje aparecerá en el chat grupal con el nombre de <strong>{participantName}</strong> de forma silenciosa.
              </p>
              <input
                ref={inputRef}
                onKeyDown={handleKeyDown}
                placeholder="Escribe el mensaje falso..."
                className="w-full h-9 border border-[#d7dbe2] rounded-lg px-3 outline-none text-[13px] text-[#1f2937] placeholder-[#9ca3af] focus:border-[#9ec5ff] focus:shadow-[0_0_0_2px_rgba(14,113,235,0.1)] transition-all"
              />
              <button
                onClick={handleSend}
                className="self-end px-4 py-2 bg-[#0e71eb] text-white text-[13px] font-semibold rounded-lg hover:bg-[#0059cc] shadow-sm transition-colors mt-1"
              >
                Inyectar en Chat
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <p className="text-xs text-[#6b7280] text-center leading-relaxed">
                Remueve a este usuario de la lista de participantes de inmediato.
              </p>
              <button
                onClick={onRemove}
                className="w-full py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2 bg-[#fee2e2] border border-[#fca5a5] text-[#b91c1c] hover:bg-[#fca5a5]"
              >
                Expulsar Participante
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
