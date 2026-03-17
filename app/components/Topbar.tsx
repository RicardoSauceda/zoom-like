"use client";

import { MinimizeIcon, MaximizeIcon, CloseIcon } from "./Icons";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between px-3.5 text-xs border-b border-black md:border-transparent"
         style={{ background: "#000000", color: "#f5f7fa", height: 39 }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col leading-none font-semibold tracking-tight">
          <small className="text-[10px] font-semibold opacity-95">zoom</small>
          <span className="text-[13px] font-semibold">Workplace</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 bg-[#151515] border border-white/[0.07] px-2.5 py-1 rounded-full text-[#f0f3f8]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1fd06b] shadow-[0_0_0_2px_rgba(31,208,107,0.16)]" />
          <span>Ver</span>
        </div>
        <div className="flex gap-1 items-center text-[#d5d8de] cursor-pointer select-none">
          <button
            title="Minimizar"
            className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          >
            <MinimizeIcon className="w-3.5 h-3.5" />
          </button>
          <button
            title="Maximizar"
            className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-white/10 transition-colors"
          >
            <MaximizeIcon className="w-3.5 h-3.5" />
          </button>
          <button
            title="Cerrar"
            className="w-6 h-6 inline-flex items-center justify-center rounded hover:bg-[#ff4d4f]/20 hover:text-[#ff4d4f] transition-colors"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
