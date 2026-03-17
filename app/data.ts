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

/**
 * Transforms "SURNAME1 SURNAME2 GIVEN NAMES" into "GIVEN NAMES SURNAME1 SURNAME2"
 * Handles some common composite surnames (DE LA, DE, LA, DEL, LOS).
 */
export function formatMexicanName(fullName: string | null | undefined): string {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName.trim();

  const compositePrefixes = ["DE", "LA", "DEL", "LOS", "SAN", "SANTA"];
  let surname1End = 0;
  
  // Try to identify first surname
  if (compositePrefixes.includes(parts[0].toUpperCase()) && parts.length > 2) {
    if (parts[0].toUpperCase() === "DE" && parts[1].toUpperCase() === "LA" && parts.length > 3) {
      surname1End = 2; // DE LA X
    } else {
      surname1End = 1; // DE X, LA X, etc.
    }
  } else {
    surname1End = 0; // X
  }

  // Second surname usually follows the first surname's last part
  let surname2End = surname1End + 1;
  if (parts.length > surname2End + 1 && compositePrefixes.includes(parts[surname2End + 1].toUpperCase())) {
     // Second surname is also composite? (very rare but possible, e.g., "Perez De La Fuente")
     // For simplicity, we usually take the first two "Surname blocks"
  }

  // A simpler approach for the user: if it's "APELLIDOS NOMBRES", usually it's exactly 2 apellidos.
  // Unless composite. Let's try a heuristic:
  // If we find 4+ words, and the user wants "Nombre Apellidos", we assume the first 2 are Surnames.
  
  // However, names like "DE PAZ RAMOS" should be "RAMOS" as 2nd? No.
  // In Mexican databases, if they are "DE LA CRUZ RAMOS JUAN", s1="DE LA CRUZ", s2="RAMOS", n="JUAN".
  
  // Let's use a simpler heuristic as requested: swap the first two word-blocks with the rest.
  // We'll define a word-block as a single word OR a composite (DE LA ..., DE ...)
  
  const blocks: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].toUpperCase();
    if (compositePrefixes.includes(p) && i + 1 < parts.length) {
      if (p === "DE" && parts[i+1].toUpperCase() === "LA" && i + 2 < parts.length) {
        blocks.push(parts.slice(i, i + 3).join(" "));
        i += 2;
      } else {
        blocks.push(parts.slice(i, i + 2).join(" "));
        i += 1;
      }
    } else {
      blocks.push(parts[i]);
    }
  }

  if (blocks.length <= 2) return fullName.trim();
  
  // Surnames are the first two blocks
  const surnames = blocks.slice(0, 2).join(" ");
  const names = blocks.slice(2).join(" ");
  
  return `${names} ${surnames}`;
}
