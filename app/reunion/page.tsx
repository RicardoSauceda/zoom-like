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

// ─────────────────────────────────────────────────────────────────────────────

const INSTRUCTOR_IMG =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

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
    role: "(Anfitrión)",
    img: "",
    muted: false,
    video: true,
    speaking: false,
    raise: false,
    color: "#6366f1",
  });

  // 2. Yo (usuario actual de ICATECH)
  participants.push({
    name: "ICATECH",
    role: "(yo)",
    img: "",
    muted: false,
    video: false,
    speaking: false,
    raise: false,
    color: "#111827",
  });

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
    speaker: { name: "Instructor", img: INSTRUCTOR_IMG },
    participants: [],
    chat: [],
  });

  const [editorOpen, setEditorOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"participants" | "chat">("participants");
  const [meetingChat, setMeetingChat] = useState<ChatMessage[]>(MEETING_CHAT_MOCK);

  // ── Cargar datos del curso desde la API ──────────────────────────
  useEffect(() => {
    if (!folio) {
      router.replace("/cursos");
      return;
    }
    fetch(`/api/cursos/${encodeURIComponent(folio)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        const c: CursoDetalle = data.curso;
        const i: InscritoRow[] = data.inscritos;
        setCurso(c);
        setInscritos(i);

        const hostName = c.instructor_nombre?.trim() || "Instructor";
        const participants = buildParticipants(c, i);

        setState({
          title: c.curso,
          speaker: { name: hostName, img: INSTRUCTOR_IMG },
          participants,
          chat: [],
        });

        // Intercalar (mezclar aleatoriamente) a los inscritos para el chat
        const shuffledInscritos = [...i].sort(() => Math.random() - 0.5);

        // Tomar hasta 10 miembros aleatorios y crear los mensajes simulando minutos de diferencia
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
      })
      .catch((e) => setFetchError(e.message))
      .finally(() => setLoadingData(false));
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
      const p = state.participants[index];
      const option = window.prompt(
        `Acción oculta para ${p.name}:\n1. Levantar/Bajar mano\n2. Enviar mensaje de chat`,
        "1"
      );
      if (option === "1") {
        setState((prev) => {
          const updated = [...prev.participants];
          updated[index] = { ...p, raise: !p.raise };
          return { ...prev, participants: updated };
        });
      } else if (option === "2") {
        const text = window.prompt(`Mensaje falso de ${p.name}:`);
        if (text) {
          setMeetingChat((prev) => [
            ...prev,
            { name: p.name, text, time: getTimeNow(), self: false },
          ]);
        }
      }
    },
    [state.participants]
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
        />

        <aside
          className="min-h-0 grid gap-2 p-2 overflow-auto border-l border-[#e5e7eb]"
          style={{ background: "#f4f5f7", gridTemplateRows: sidebarRows }}
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
