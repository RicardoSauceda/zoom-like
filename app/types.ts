export interface Participant {
  name: string;
  role: string;
  img: string;
  muted: boolean;
  video: boolean;
  speaking: boolean;
  raise: boolean;
  color: string;
}

export interface ChatMessage {
  name: string;
  text: string;
  self?: boolean;
  ai?: boolean;
  time: string;
}

export interface Speaker {
  name: string;
  img: string;
  role?: string;
}

export interface AppState {
  title: string;
  speaker: Speaker;
  participants: Participant[];
  chat: ChatMessage[];
}

// ─────── Tipos de API ───────
export interface CursoRow {
  folio_grupo: string;
  status_curso: string;
  curso: string;
  unidad: string;
  inicio: string;
  termino: string;
  horas: string | null;
  instructor_nombre: string | null;
  curp_instructor: string | null;
  total_inscritos: string;
  hombres: number;
  mujeres: number;
  tcapacitacion?: string | null;
}

export interface InscritoRow {
  id: number;
  alumno: string;
  matricula: string | null;
  curp: string | null;
  sexo: string | null;
  status: string | null;
  tinscripcion: string | null;
  calificacion: string | null;
  porcentaje_asis: number | null;
}

export interface CursoDetalle {
  folio_grupo: string;
  curso: string;
  unidad: string;
  inicio: string;
  termino: string;
  horas: string | null;
  instructor_nombre: string | null;
  curp_instructor: string | null;
  hombre: number;
  mujer: number;
  tcapacitacion?: string | null;
}
