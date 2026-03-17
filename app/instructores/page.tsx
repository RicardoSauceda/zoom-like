"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

interface InstructorData {
  curp: string;
  nombre: string;
  cursos_json: {
    folio_grupo: string;
    curso: string;
    tcapacitacion?: string;
  }[];
}

function InstructoresContent() {
  const router = useRouter();
  const [instructores, setInstructores] = useState<InstructorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/instructores")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setInstructores(data.instructores);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDownloadInstructorStructure = async (ins: InstructorData) => {
    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const curpTag = ins.curp.toUpperCase().trim();
      const rootName = `FOTOS_${curpTag}`;
      const root = zip.folder(rootName);
      
      if (root) {
        ins.cursos_json.forEach((c) => {
          const modalidad = (c.tcapacitacion || "").toUpperCase().includes("DISTANCIA") 
            ? "A_DISTANCIA" 
            : "PRESENCIAL";
            
          const folio = (c.folio_grupo || "SIN_FOLIO").trim();
          const cleanCurso = (c.curso || "SIN_NOMBRE").trim()
            .replace(/[\/\\?%*:|"<>]/g, "_")
            .substring(0, 80);
          
          root.folder(`${modalidad}_${folio}_${cleanCurso}`);
        });
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      const cleanName = ins.nombre.trim().replace(/[\/\\?%*:|"<>]/g, "_").substring(0, 50).replace(/\s+/g, "_");
      a.download = `${cleanName}_${ins.curp}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating ZIP:", err);
      alert("No se pudo generar el archivo ZIP.");
    }
  };

  const filtered = instructores.filter((ins) => 
    ins.nombre.toLowerCase().includes(search.toLowerCase()) || 
    ins.curp.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f0f14 0%, #1a1a2e 50%, #16213e 100%)",
        fontFamily: 'var(--font-lato), "Lato", sans-serif',
        color: "#e2e8f0",
        paddingBottom: 60,
      }}
    >
      {/* Header */}
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
        <button 
          onClick={() => router.push("/cursos")}
          style={{
            background: "none",
            border: "none",
            color: "#64748b",
            cursor: "pointer",
            padding: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 14,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Directorio de Instructores</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>Descarga la estructura de carpetas para cada instructor</p>
        </div>
      </header>

      {/* Search */}
      <div style={{ padding: "20px 32px" }}>
        <div style={{ position: "relative", maxWidth: 400 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#64748b" }}>
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" /><path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre o CURP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px 12px 38px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12,
              color: "#e2e8f0",
              fontSize: 14,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <main style={{ padding: "0 32px" }}>
        {loading && <p style={{ color: "#64748b" }}>Cargando instructores...</p>}
        {error && <p style={{ color: "#ef4444" }}>{error}</p>}
        {!loading && !error && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {filtered.map((ins) => (
              <InstructorCard 
                key={ins.curp} 
                instructor={ins} 
                onDownload={() => handleDownloadInstructorStructure(ins)} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function InstructorCard({ instructor, onDownload }: { instructor: InstructorData, onDownload: () => void }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        transition: "transform 0.2s, background 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ 
          width: 52, 
          height: 52, 
          borderRadius: "50%", 
          background: "linear-gradient(135deg, #3b82f6, #2d8cff)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
          color: "white",
          flexShrink: 0
        }}>
          {instructor.nombre.substring(0, 1)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: 15, 
            fontWeight: 700, 
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}>
            {instructor.nombre}
          </h3>
          <p style={{ margin: "4px 0 0 0", fontSize: 12, color: "#64748b", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis" }}>
            {instructor.curp}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
        {instructor.cursos_json.length} cursos asignados
      </div>

      <button
        onClick={onDownload}
        style={{
          marginTop: "auto",
          padding: "10px",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          color: "#e2e8f0",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#2d8cff";
          e.currentTarget.style.borderColor = "#2d8cff";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#e2e8f0";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Estructura ZIP
      </button>
    </div>
  );
}

export default function InstructoresPage() {
  return (
    <Suspense fallback={null}>
      <InstructoresContent />
    </Suspense>
  );
}
