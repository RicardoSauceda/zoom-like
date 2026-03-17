"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppState, Participant, ChatMessage, CursoDetalle, InscritoRow } from "../types";
import { PALETTE, MEETING_CHAT_MOCK, getTimeNow, getInitials } from "../data";
import Topbar from "../components/Topbar";
import MeetingSection from "../components/MeetingSection";
import AICompanionPanel from "../components/AICompanionPanel";
import ParticipantsPanel from "../components/ParticipantsPanel";
import MeetingChatPanel from "../components/MeetingChatPanel";
import Footer from "../components/Footer";
import EditorModal from "../components/EditorModal";
import HiddenActionModal from "../components/HiddenActionModal";

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolves the instructor photo URL from /FOTOS_{CURP}/{MODALIDAD}_{folio_grupo}_{curso}/img{index}.{ext}.
 * Tries jpg → jpeg → png → webp. Returns the first one that responds 200, or "" if none.
 */
async function resolveInstructorImg(curp: string | null, folio: string | null, cursoNombre: string | null, tcapacitacion: string | null, index: number): Promise<string> {
  if (!curp || !folio || !cursoNombre) return "";
  const c = curp.toUpperCase().trim();
  const f = folio.trim();
  const modalidad = (tcapacitacion || "").toUpperCase().includes("DISTANCIA") ? "A_DISTANCIA" : "PRESENCIAL";
  
  // Sanitización simple para evitar caracteres inválidos en rutas
  const cleanCurso = cursoNombre.trim().replace(/[\/\\?%*:|"<>]/g, "_").substring(0, 80);
  
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const url = `/instructores/FOTOS_${c}/${modalidad}_${f}_${cleanCurso}/img${index}.${ext}`;
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok) return url;
    } catch {
      // network error → skip
    }
  }
  return "";
}

function buildParticipants(
  curso: CursoDetalle,
  inscritos: InscritoRow[]
): Participant[] {
  const participants: Participant[] = [];

  // 1. Anfitrión: el instructor del curso
  const hostName =
    curso.instructor_nombre?.trim() || "Instructor";
  participants.push({
    name: hostName,
    role: "(Anfitrión, yo)",
    img: "",
    muted: false,
    video: true,
    speaking: false,
    raise: false,
    color: "#6366f1",
  });

  // // 2. Yo (usuario actual de ICATECH)
  // participants.push({
  //   name: "ICATECH",
  //   role: "(yo)",
  //   img: "",
  //   muted: false,
  //   video: false,
  //   speaking: false,
  //   raise: false,
  //   color: "#111827",
  // });

  // 3. Inscritos
  inscritos.slice(0, 30).forEach((insc, idx) => {
    participants.push({
      name: insc.alumno,
      role: insc.tinscripcion ?? "",
      img: "",
      muted: true,
      video: false,
      speaking: false,
      raise: false,
      color: PALETTE[idx % PALETTE.length],
    });
  });

  return participants;
}

// ─────────────────────────────────────────────────────────────────────────────

function ReunionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const folio = searchParams.get("folio") ?? "";

  const [curso, setCurso] = useState<CursoDetalle | null>(null);
  const [inscritos, setInscritos] = useState<InscritoRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [state, setState] = useState<AppState>({
    title: "Cargando…",
    speaker: { name: "Instructor", img: "" },
    participants: [],
    chat: [],
  });

  const [editorOpen, setEditorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<"participants" | "chat">("participants");
  const [meetingChat, setMeetingChat] = useState<ChatMessage[]>(MEETING_CHAT_MOCK);
  const [hiddenActionIdx, setHiddenActionIdx] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState<number>(1);

  // ── Cargar datos del curso desde la API ──────────────────────────
  useEffect(() => {
    if (!folio) {
      router.replace("/cursos");
      return;
    }
    (async () => {
      try {
        const r = await fetch(`/api/cursos/${encodeURIComponent(folio)}`);
        const data = await r.json();
        if (data.error) throw new Error(data.error);
        const c: CursoDetalle = data.curso;
        const i: InscritoRow[] = data.inscritos;
        setCurso(c);
        setInscritos(i);

        const hostName = c.instructor_nombre?.trim() || "Instructor";
        const participants = buildParticipants(c, i);

        // Resolve instructor photo from /FOTOS_{CURP}/{MODALIDAD}_{folio}_{curso}/img1
        const instructorImg = await resolveInstructorImg(c.curp_instructor ?? null, c.folio_grupo, c.curso, c.tcapacitacion ?? null, 1);

        setState({
          title: c.curso,
          speaker: { name: hostName, img: instructorImg },
          participants,
          chat: [],
        });

        // Intercalar aleatoriamente a los inscritos para el chat
        const shuffledInscritos = [...i].sort(() => Math.random() - 0.5);
        setMeetingChat(
          shuffledInscritos.slice(0, 10).map((insc, idx) => {
            const minute = 5 + Math.floor(idx * 1.5);
            const minStr = minute < 10 ? `0${minute}` : minute;
            return {
              name: insc.alumno,
              text: "Presente",
              time: `11:${minStr} AM`,
            };
          })
        );
      } catch (e: unknown) {
        setFetchError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoadingData(false);
      }
    })();
  }, [folio, router]);

  // ── AI Companion ─────────────────────────────────────────────────
  const handleSendMessage = useCallback((text: string) => {
    const newMsg: ChatMessage = { name: "Tú", text, self: true, time: getTimeNow() };
    setState((prev) => ({ ...prev, chat: [...prev.chat, newMsg] }));
  }, []);

  const handleCatchUp = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chat: [
        ...prev.chat,
        {
          name: "AI Companion",
          ai: true,
          text: "Aquí tienes un resumen rápido de la sesión y el contexto compartido.",
          time: "",
        },
      ],
    }));
  }, []);

  const handleMentionCheck = useCallback(() => {
    setState((prev) => ({
      ...prev,
      chat: [
        ...prev.chat,
        {
          name: "AI Companion",
          ai: true,
          text: "Tu nombre fue mencionado en el panel de participantes y en mensajes recientes.",
          time: "",
        },
      ],
    }));
  }, []);

  // ── Chat de reunión ──────────────────────────────────────────────
  const handleSendMeetingMessage = useCallback((text: string) => {
    setMeetingChat((prev) => [
      ...prev,
      { name: "Tú", text, self: true, time: getTimeNow() },
    ]);
  }, []);

  // ── Fotos de instructor ──────────────────────────────────────────
  const handleNextSpeakerPhoto = useCallback(async () => {
    if (!curso) return;
    const nextIdx = photoIndex >= 3 ? 1 : photoIndex + 1;
    setPhotoIndex(nextIdx);
    const newImg = await resolveInstructorImg(curso.curp_instructor ?? null, curso.folio_grupo, curso.curso, curso.tcapacitacion ?? null, nextIdx);
    setState((prev) => ({
      ...prev,
      speaker: { ...prev.speaker, img: newImg },
    }));
  }, [curso, photoIndex]);

  // ── Editor ───────────────────────────────────────────────────────
  const handleApplyEditor = useCallback(
    (title: string, speakerName: string, speakerImg: string) => {
      setState((prev) => ({ ...prev, title, speaker: { name: speakerName, img: speakerImg } }));
      setEditorOpen(false);
    },
    []
  );

  const handleAddParticipant = useCallback(() => {
    setState((prev) => {
      const idx = prev.participants.length;
      const newP: Participant = {
        name: `Invitado ${idx}`,
        role: "",
        img: "",
        muted: true,
        video: false,
        speaking: false,
        raise: false,
        color: PALETTE[idx % PALETTE.length],
      };
      return { ...prev, participants: [...prev.participants, newP] };
    });
  }, []);

  const handleEditParticipant = useCallback(
    (index: number) => {
      const p = state.participants[index];
      const name = window.prompt("Nombre del participante:", p.name);
      if (name === null) return;
      const img = window.prompt("URL de imagen (vacío para avatar):", p.img || "");
      if (img === null) return;
      const muted = window.confirm("¿Micrófono apagado?");
      const video = window.confirm("¿Video encendido?");
      const speaking = window.confirm("¿Está hablando?");
      const makeSpeaker = window.confirm("¿Convertir en ponente principal?");
      setState((prev) => {
        const updated = [...prev.participants];
        updated[index] = { ...p, name: name || p.name, img: img || "", muted, video, speaking };
        return {
          ...prev,
          participants: updated,
          speaker: makeSpeaker
            ? { name: updated[index].name, img: updated[index].img || prev.speaker.img }
            : prev.speaker,
        };
      });
    },
    [state.participants]
  );

  const handleHiddenAction = useCallback(
    (index: number) => {
      setHiddenActionIdx(index);
    },
    []
  );

  const sidebarRows =
    sidebarTab === "chat" ? "1fr" : aiOpen ? "316px 1fr" : "1fr";

  // ── Loading screen ───────────────────────────────────────────────
  if (loadingData) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#0f0f14,#1a1a2e)",
          gap: 20,
          color: "#e2e8f0",
          fontFamily: 'var(--font-lato),"Lato",sans-serif',
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(45,140,255,0.3)",
            borderTopColor: "#2d8cff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ margin: 0, fontSize: 15, color: "#94a3b8" }}>
          Conectando a la sala…
        </p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f14",
          gap: 14,
          color: "#ef4444",
          fontFamily: 'var(--font-lato),"Lato",sans-serif',
        }}
      >
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{fetchError}</p>
        <button
          onClick={() => router.push("/cursos")}
          style={{
            padding: "10px 22px",
            background: "#2d8cff",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Volver a cursos
        </button>
      </div>
    );
  }

  // ── Sala de reunión ──────────────────────────────────────────────
  return (
    <div
      className="w-screen h-screen overflow-hidden grid"
      style={{
        background: "#2b2b2b",
        gridTemplateRows: "39px 1fr 66px",
        fontFamily: 'var(--font-lato),"Lato","Helvetica Neue",Helvetica,Arial,sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <Topbar />

      <div className="min-h-0 grid" style={{ gridTemplateColumns: "minmax(0,1fr) 334px" }}>
        <MeetingSection
          title={state.title}
          speaker={state.speaker}
          participants={state.participants}
          onToggleEditor={() => setEditorOpen(true)}
          onParticipantClick={handleEditParticipant}
          onNextSpeakerPhoto={handleNextSpeakerPhoto}
        />

        <aside
          className="min-h-0 grid overflow-auto border-l border-[#e5e7eb]"
          style={{ background: "white", gridTemplateRows: sidebarRows }}
        >
          {sidebarTab === "chat" ? (
            <MeetingChatPanel
              messages={meetingChat}
              participants={state.participants}
              onSendMessage={handleSendMeetingMessage}
              onClose={() => setSidebarTab("participants")}
            />
          ) : (
            <>
              {aiOpen && (
                <AICompanionPanel
                  chat={state.chat}
                  participants={state.participants}
                  onSendMessage={handleSendMessage}
                  onCatchUp={handleCatchUp}
                  onMentionCheck={handleMentionCheck}
                  onClose={() => setAiOpen(false)}
                />
              )}
              <ParticipantsPanel
                participants={state.participants}
                onEditParticipant={handleEditParticipant}
                onHiddenAction={handleHiddenAction}
              />
            </>
          )}
        </aside>
      </div>

      <Footer
        participantCount={state.participants.length}
        sidebarTab={sidebarTab}
        onTabChange={setSidebarTab}
        micMuted={state.participants[0]?.muted ?? false}
        onMicToggle={() => {
          setState((prev) => {
            const updated = [...prev.participants];
            if (updated[0]) {
              updated[0] = { ...updated[0], muted: !updated[0].muted };
            }
            return { ...prev, participants: updated };
          });
        }}
        videoOff={!(state.participants[0]?.video ?? false)}
        onVideoToggle={() => {
          setState((prev) => {
            const updated = [...prev.participants];
            if (updated[0]) {
              updated[0] = { ...updated[0], video: !updated[0].video };
            }
            return { ...prev, participants: updated };
          });
        }}
      />

      <EditorModal
        open={editorOpen}
        title={state.title}
        speakerName={state.speaker.name}
        speakerImg={state.speaker.img}
        onClose={() => setEditorOpen(false)}
        onApply={handleApplyEditor}
        onAddParticipant={handleAddParticipant}
      />

      {hiddenActionIdx !== null && state.participants[hiddenActionIdx] && (
        <HiddenActionModal
          open={true}
          participantName={state.participants[hiddenActionIdx].name}
          hasRaise={state.participants[hiddenActionIdx].raise}
          onClose={() => setHiddenActionIdx(null)}
          onToggleRaise={() => {
            setState((prev) => {
              const updated = [...prev.participants];
              if (updated[hiddenActionIdx]) {
                updated[hiddenActionIdx] = { 
                  ...updated[hiddenActionIdx], 
                  raise: !updated[hiddenActionIdx].raise 
                };
              }
              return { ...prev, participants: updated };
            });
            setHiddenActionIdx(null);
          }}
          onSendMessage={(text) => {
            const name = state.participants[hiddenActionIdx]?.name || "Desconocido";
            setMeetingChat((prev) => [
              ...prev,
              { name, text, time: getTimeNow(), self: false },
            ]);
            setHiddenActionIdx(null);
          }}
          onRemove={() => {
            setState((prev) => {
              const updated = prev.participants.filter((_, idx) => idx !== hiddenActionIdx);
              // Si el ponente principal es el que se expulsa, volvemos a poner al instructor, u otro
              const isSpeaker = prev.speaker.name === state.participants[hiddenActionIdx!].name;
              return { 
                ...prev, 
                participants: updated,
                speaker: isSpeaker && updated.length > 0 
                  ? { name: updated[0].name, img: updated[0].img } 
                  : prev.speaker
              };
            });
            setHiddenActionIdx(null);
          }}
        />
      )}
    </div>
  );
}

export default function ReunionPage() {
  return (
    <Suspense>
      <ReunionContent />
    </Suspense>
  );
}
