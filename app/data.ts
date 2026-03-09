import { AppState } from "./types";

export const PALETTE = [
  "#f59e0b",
  "#14b8a6",
  "#8b5cf6",
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#ec4899",
  "#6366f1",
];

export const INITIAL_STATE: AppState = {
  title: "Sesión Estratégica",
  speaker: {
    name: "Alejandro Brindis",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1500&q=80",
  },
  participants: [
    {
      name: "ICATECH",
      role: "(Anfitrión, yo)",
      img: "",
      muted: false,
      video: false,
      speaking: false,
      raise: false,
      color: "#111827",
    },
    {
      name: "Victoria Reyes",
      role: "(Anfitrión)",
      img: "",
      muted: false,
      video: true,
      speaking: false,
      raise: true,
      color: "#f59e0b",
    },
    {
      name: "Henry Park",
      role: "",
      img: "",
      muted: false,
      video: true,
      speaking: true,
      raise: false,
      color: "#14b8a6",
    },
    {
      name: "Marketing Huddle",
      role: "",
      img: "",
      muted: true,
      video: true,
      speaking: false,
      raise: true,
      color: "#8b5cf6",
    },
    {
      name: "Casey Cast",
      role: "",
      img: "",
      muted: true,
      video: false,
      speaking: false,
      raise: false,
      color: "#ef4444",
    },
    {
      name: "Mike Nolan",
      role: "",
      img: "",
      muted: false,
      video: true,
      speaking: false,
      raise: false,
      color: "#3b82f6",
    },
  ],
  chat: [
    { name: "Tú", text: "Hola", self: true, time: "11:09 AM" },
    {
      name: "AI Companion",
      text: "¡Hola! ¿En qué puedo ayudarte hoy?",
      time: "",
      ai: true,
    },
    {
      name: "Victoria Reyes",
      text: "Ya revisé la vista principal y el panel lateral.",
      time: "11:10 AM",
    },
    {
      name: "Henry Park",
      text: "La sesión se ve bastante cercana al flujo real.",
      time: "11:11 AM",
    },
    {
      name: "Mike Nolan",
      text: "Podemos validar la experiencia con participants panel.",
      time: "11:12 AM",
    },
  ],
};

/** Mock messages for the meeting chat tab */
export const MEETING_CHAT_MOCK: import("./types").ChatMessage[] = [
  { name: "Victoria Reyes", text: "Presente", time: "11:09 AM" },
  { name: "Henry Park",     text: "presente", time: "11:09 AM" },
  { name: "Marketing Huddle", text: "Presente", time: "11:10 AM" },
  { name: "Casey Cast",     text: "presente",  time: "11:10 AM" },
  { name: "Mike Nolan",     text: "Presente",  time: "11:11 AM" },
];

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getTimeNow(): string {
  return new Date().toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  });
}
