"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CursoRow } from "../types";

// ── Paleta de colores por status ──────────────────────────────────────────────
const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> =
  {
    PRUEBA: {
      bg: "rgba(59,130,246,0.12)",
      text: "#3b82f6",
      dot: "#3b82f6",
    },
    PRUEBA2: {
      bg: "rgba(245,158,11,0.12)",
      text: "#f59e0b",
      dot: "#f59e0b",
    },
    PRUEBA3: {
      bg: "rgba(16,185,129,0.12)",
      text: "#10b981",
      dot: "#10b981",
    },
  };

function fmtDate(iso: string) {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const months = [
    "ene","feb","mar","abr","may","jun",
    "jul","ago","sep","oct","nov","dic",
  ];
  return `${d} ${months[Number(m) - 1]} ${y}`;
}

function calcDuration(inicio: string, termino: string) {
  const a = new Date(inicio);
  const b = new Date(termino);
  const days = Math.round((b.getTime() - a.getTime()) / 86_400_000);
  return days > 0 ? `${days} días` : "—";
}

const PAGE_SIZE = 60;

function CursosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const iniParam = searchParams.get("ini");
  const finParam = searchParams.get("fin");

  const [cursos, setCursos] = useState<CursoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterUnidad, setFilterUnidad] = useState("TODAS");
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [entering, setEntering] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/cursos")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCursos(data.cursos);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Resetear página cuando cambian los filtros
  useEffect(() => { setPage(1); }, [search, filterUnidad, filterStatus]);

  const unidades = useMemo(
    () => ["TODAS", ...Array.from(new Set(cursos.map((c) => c.unidad))).sort()],
    [cursos]
  );
  const statuses = useMemo(
    () => ["TODOS", ...Array.from(new Set(cursos.map((c) => c.status_curso))).sort()],
    [cursos]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const res = cursos.filter((c) => {
      const matchSearch =
        !q ||
        c.curso.toLowerCase().includes(q) ||
        c.folio_grupo.toLowerCase().includes(q) ||
        (c.instructor_nombre?.toLowerCase().includes(q) ?? false);
      const matchUnidad =
        filterUnidad === "TODAS" || c.unidad === filterUnidad;
      const matchStatus =
        filterStatus === "TODOS" || c.status_curso === filterStatus;
      return matchSearch && matchUnidad && matchStatus;
    });

    if (iniParam && finParam) {
      const ini = parseInt(iniParam, 10);
      const fin = parseInt(finParam, 10);
      if (!isNaN(ini) && !isNaN(fin)) {
        return res.slice(Math.max(0, ini - 1), fin);
      }
    }
    return res;
  }, [cursos, search, filterUnidad, filterStatus, iniParam, finParam]);

  // Slice para el render: solo `page * PAGE_SIZE` elementos, a menos que se usen ini/fin
  const visible = useMemo(() => {
    if (iniParam && finParam) return filtered;
    return filtered.slice(0, page * PAGE_SIZE);
  }, [filtered, page, iniParam, finParam]);
  const hasMore = visible.length < filtered.length;

  const handleJoin = (folio: string) => {
    setEntering(folio);
    setTimeout(() => {
      router.push(`/reunion?folio=${encodeURIComponent(folio)}`);
    }, 600);
  };

  const handleDownloadStructure = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      
      cursos.forEach((c) => {
        const curp = (c.curp_instructor || "SIN_CURP").toUpperCase().trim();
        const modalidad = (c.tcapacitacion || "").toUpperCase().includes("DISTANCIA") 
          ? "A_DISTANCIA" 
          : "PRESENCIAL";
          
        const folio = (c.folio_grupo || "SIN_FOLIO").trim();
        const cleanCurso = (c.curso || "SIN_NOMBRE").trim()
          .replace(/[\/\\?%*:|"<>]/g, "_")
          .substring(0, 80);
        
        // Structure: FOTOS_{CURP}/{MODALIDAD}_{FOLIO}_{CURSO}
        zip.folder(`FOTOS_${curp}/${modalidad}_${folio}_${cleanCurso}`);
      });

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estructura_instructores.zip";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("No se pudo generar el archivo ZIP.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f14 0%, #1a1a2e 50%, #16213e 100%)",
        fontFamily: 'var(--font-lato), "Lato", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#e2e8f0",
        overflow: "auto",
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #2d8cff, #0e71eb)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(45,140,255,0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>
            ICATECH — Sala de Capacitación
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>
            Selecciona un grupo para iniciar la reunión
          </p>
        </div>

        {/* Actions */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => router.push("/instructores")}
            title="Ir al directorio de instructores"
            style={{
              padding: "10px 18px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              color: "#a5b4fc",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#6366f1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.2)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Directorio
          </button>

          <button
            onClick={handleDownloadStructure}
            title="Descargar estructura de carpetas"
            style={{
              padding: "10px 18px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Estructura ZIP
          </button>

          <StatBadge label="Grupos" value={cursos.length} color="#3b82f6" />
          <StatBadge
            label="Inscritos"
            value={cursos.reduce((a, c) => a + Number(c.total_inscritos), 0)}
            color="#10b981"
          />
        </div>
      </header>

      {/* ── Filtros ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          padding: "20px 32px 0",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b",
            }}
          >
            <circle cx="11" cy="11" r="8" stroke="#64748b" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar curso, folio, instructor…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* Unidad filter */}
        <FilterSelect
          value={filterUnidad}
          options={unidades}
          onChange={setFilterUnidad}
          label="Unidad"
        />

        {/* Status filter */}
        <FilterSelect
          value={filterStatus}
          options={statuses}
          onChange={setFilterStatus}
          label="Status"
        />
      </div>

      {/* Result count */}
      <div style={{ padding: "12px 32px 0", fontSize: 13, color: "#64748b" }}>
        {!loading && !error && (
          <span>
            Mostrando{" "}
            <strong style={{ color: "#94a3b8" }}>{visible.length}</strong>
            {" "}de{" "}
            <strong style={{ color: "#94a3b8" }}>{filtered.length}</strong> grupos
            {filtered.length !== cursos.length && (
              <span style={{ color: "#475569" }}> (total: {cursos.length})</span>
            )}
          </span>
        )}
      </div>

      {/* ── Contenido principal ─────────────────────────────────────── */}
      <main style={{ padding: "16px 32px 40px" }}>
        {loading && <LoadingGrid />}
        {error && <ErrorState message={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState />
        )}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 16,
              }}
            >
              {visible.map((c) => (
                <CursoCard
                  key={c.folio_grupo}
                  curso={c}
                  entering={entering === c.folio_grupo}
                  onJoin={() => handleJoin(c.folio_grupo)}
                />
              ))}
            </div>

            {/* Botón Ver más */}
            {hasMore && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}>
                <button
                  id="btn-ver-mas"
                  onClick={() => setPage((p) => p + 1)}
                  style={{
                    padding: "12px 36px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10,
                    color: "#e2e8f0",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(45,140,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ver {Math.min(PAGE_SIZE, filtered.length - visible.length)} más
                  <span style={{ fontSize: 12, color: "#64748b", fontWeight: 400 }}>
                    ({filtered.length - visible.length} restantes)
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default function CursosPage() {
  return (
    <Suspense>
      <CursosContent />
    </Suspense>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────────────────────────────────────────

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div
      style={{
        padding: "6px 14px",
        background: `${color}18`,
        border: `1px solid ${color}40`,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 700, color }}>{value.toLocaleString("es-MX")}</div>
      <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  options,
  onChange,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "10px 32px 10px 12px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          color: "#e2e8f0",
          fontSize: 14,
          cursor: "pointer",
          outline: "none",
          minWidth: 140,
          appearance: "none",
        }}
        aria-label={label}
      >
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#1e293b" }}>
            {o}
          </option>
        ))}
      </select>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      >
        <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CursoCard({
  curso,
  entering,
  onJoin,
}: {
  curso: CursoRow;
  entering: boolean;
  onJoin: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const sc = STATUS_COLOR[curso.status_curso] ?? STATUS_COLOR["PRUEBA"];
  const totalInscritos = Number(curso.total_inscritos);
  const totalDeclarado = (curso.hombres ?? 0) + (curso.mujeres ?? 0);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: entering
          ? "rgba(45,140,255,0.15)"
          : hovered
          ? "rgba(255,255,255,0.07)"
          : "rgba(255,255,255,0.04)",
        border: entering
          ? "1px solid rgba(45,140,255,0.6)"
          : hovered
          ? "1px solid rgba(255,255,255,0.15)"
          : "1px solid rgba(255,255,255,0.07)",
        borderRadius: 14,
        padding: "18px 20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: entering ? "scale(0.98)" : hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered
          ? "0 8px 32px rgba(0,0,0,0.3)"
          : "0 2px 8px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      onClick={onJoin}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onJoin()}
      aria-label={`Abrir reunión: ${curso.curso}`}
    >
      {/* Top row: folio + status badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", letterSpacing: "0.05em" }}>
          {curso.folio_grupo}
        </span>
        <span
          style={{
            padding: "3px 9px",
            background: sc.bg,
            color: sc.text,
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.06em",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: sc.dot,
              display: "inline-block",
              animation: "pulse-dot 1.8s infinite",
            }}
          />
          {curso.status_curso}
        </span>
      </div>

      {/* Nombre del curso */}
      <h2
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          lineHeight: 1.4,
          color: "#f1f5f9",
        }}
      >
        {curso.curso}
      </h2>

      {/* Datos del curso */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <InfoChip
          icon={
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M7 3v4M17 3v4M4 21h16a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1v13a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          }
          label={`${fmtDate(curso.inicio)} → ${fmtDate(curso.termino)}`}
        />
        <InfoChip
          icon={
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          }
          label={`${calcDuration(curso.inicio, curso.termino)} • ${curso.horas ?? "—"} hrs`}
        />
        <InfoChip
          icon={
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8"/></svg>
          }
          label={curso.unidad}
        />
      </div>

      {/* Instructor */}
      {curso.instructor_nombre && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
            }}
          >
            {getInitials(curso.instructor_nombre)}
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>Instructor (Anfitrión)</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
              {curso.instructor_nombre}
            </div>
            {curso.curp_instructor && (
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontFamily: "monospace", letterSpacing: "0.02em" }}>
                {curso.curp_instructor}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer: inscritos + botón */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#64748b" strokeWidth="1.8"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 13, color: "#64748b" }}>
            <strong style={{ color: "#94a3b8" }}>{totalInscritos}</strong>{" "}
            {totalDeclarado > 0 && totalDeclarado !== totalInscritos
              ? `/ ${totalDeclarado} declarados`
              : "inscritos"}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onJoin(); }}
          style={{
            padding: "7px 18px",
            background: entering
              ? "rgba(45,140,255,0.3)"
              : "linear-gradient(135deg,#2d8cff,#0e71eb)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
            boxShadow: entering ? "none" : "0 2px 10px rgba(45,140,255,0.35)",
          }}
          aria-label={`Unirse a ${curso.folio_grupo}`}
        >
          {entering ? (
            <>
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              Conectando
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Iniciar reunión
            </>
          )}
        </button>
      </div>
    </article>
  );
}

function InfoChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 9px",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 6,
        fontSize: 11,
        color: "#94a3b8",
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function LoadingGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
        gap: 16,
        marginTop: 4,
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            height: 190,
            borderRadius: 14,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
            animation: "shimmer 1.5s infinite",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 0.8; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 60,
        gap: 12,
        color: "#ef4444",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
        <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Error al cargar cursos</p>
      <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{message}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 60,
        gap: 12,
        color: "#475569",
      }}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path d="M10 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l4 4v3" stroke="#475569" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="17" cy="17" r="4" stroke="#475569" strokeWidth="1.8"/>
        <path d="M20 20l2 2" stroke="#475569" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
      <p style={{ margin: 0, fontSize: 15 }}>Sin resultados para esa búsqueda</p>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
