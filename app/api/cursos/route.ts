import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { formatMexicanName } from "@/app/data";

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query<{
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
      tcapacitacion: string | null;
    }>(`
      SELECT
        tc.folio_grupo,
        tc.status_curso,
        tc.curso,
        tc.unidad,
        tc.inicio::text,
        tc.termino::text,
        tc.horas,
        -- Usar tabla instructor si existe el CURP
        COALESCE(NULLIF(TRIM(CONCAT(ins.nombre, ' ', ins."apellidoPaterno", ' ', ins."apellidoMaterno")), ''), tc.nombre) AS instructor_nombre,
        tc.curp            AS curp_instructor,
        tc.hombre          AS hombres,
        tc.mujer           AS mujeres,
        tc.tcapacitacion,
        COUNT(ti.id)::text AS total_inscritos
      FROM tbl_cursos tc
      LEFT JOIN tbl_inscripcion ti ON tc.folio_grupo = ti.folio_grupo
      LEFT JOIN instructor ins ON tc.curp = ins.curp
      WHERE tc.status_curso ILIKE 'PRUEBA%'
        AND tc.created_at >= '2025-12-01'
      GROUP BY
        tc.folio_grupo, tc.status_curso, tc.curso,
        tc.unidad, tc.inicio, tc.termino, tc.horas,
        tc.nombre, tc.curp, tc.hombre, tc.mujer, tc.tcapacitacion,
        ins.nombre, ins."apellidoPaterno", ins."apellidoMaterno"
      ORDER BY MIN(tc.created_at) DESC
    `);

    // El instructor ya viene formateado de la DB; 
    // pero si no se encontró en la tabla instructor (COALESCE fallback),
    // aplicamos la lógica de formateo para estar seguros de que tc.nombre también se vea bien.
    const formattedRows = rows.map(r => ({
      ...r,
      instructor_nombre: formatMexicanName(r.instructor_nombre)
    }));

    return NextResponse.json({ cursos: formattedRows });
  } catch (err) {
    console.error("[api/cursos]", err);
    return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 });
  } finally {
    client.release();
  }
}
