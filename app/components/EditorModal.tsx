"use client";

import { useRef } from "react";

interface EditorModalProps {
  open: boolean;
  title: string;
  speakerName: string;
  speakerImg: string;
  onClose: () => void;
  onApply: (title: string, speakerName: string, speakerImg: string) => void;
  onAddParticipant: () => void;
}

export default function EditorModal({
  open,
  title,
  speakerName,
  speakerImg,
  onClose,
  onApply,
  onAddParticipant,
}: EditorModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function handleApply() {
    onApply(
      titleRef.current?.value.trim() || title,
      nameRef.current?.value.trim() || speakerName,
      imgRef.current?.value.trim() || speakerImg
    );
  }

  return (
    <div className="fixed z-20" style={{ right: 348, bottom: 82 }}>
      <div className="w-80 bg-white border border-[#e5e7eb] rounded-[14px] shadow-[0_24px_60px_rgba(0,0,0,0.28)] overflow-hidden">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-3.5 bg-[#fbfbfc] border-b border-[#eceff3] text-[#1f2937] text-[13px] font-semibold">
          <span>Editar mock</span>
          <button
            onClick={onClose}
            className="h-[38px] px-3 rounded-lg border border-[#dbe0e6] bg-[#f3f4f6] text-[#1f2937] text-[13px] font-semibold cursor-pointer hover:bg-[#e5e7ea] transition-colors"
          >
            Cerrar
          </button>
        </div>

        {/* Body */}
        <div className="p-3.5 grid gap-2.5">
          <input
            ref={titleRef}
            defaultValue={title}
            placeholder="Título de la reunión"
            className="h-[38px] border border-[#d7dbe2] rounded-lg px-3 outline-none text-sm w-full focus:border-[#9ec5ff] transition-colors"
          />
          <input
            ref={nameRef}
            defaultValue={speakerName}
            placeholder="Nombre del ponente"
            className="h-[38px] border border-[#d7dbe2] rounded-lg px-3 outline-none text-sm w-full focus:border-[#9ec5ff] transition-colors"
          />
          <input
            ref={imgRef}
            defaultValue={speakerImg}
            placeholder="URL de imagen del ponente"
            className="h-[38px] border border-[#d7dbe2] rounded-lg px-3 outline-none text-sm w-full focus:border-[#9ec5ff] transition-colors"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleApply}
              className="h-[38px] rounded-lg border-0 bg-[#0e71eb] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#0059cc] transition-colors"
            >
              Aplicar
            </button>
            <button
              onClick={onAddParticipant}
              className="h-[38px] rounded-lg bg-[#f3f4f6] border border-[#dbe0e6] text-[#1f2937] text-[13px] font-semibold cursor-pointer hover:bg-[#e5e7ea] transition-colors"
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
