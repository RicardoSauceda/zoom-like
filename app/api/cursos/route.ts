import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

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
        tc.nombre          AS instructor_nombre,
        tc.curp            AS curp_instructor,
        tc.hombre          AS hombres,
        tc.mujer           AS mujeres,
        tc.tcapacitacion,
        COUNT(ti.id)::text AS total_inscritos
      FROM tbl_cursos tc
      LEFT JOIN tbl_inscripcion ti ON tc.folio_grupo = ti.folio_grupo
      WHERE tc.status_curso ILIKE 'PRUEBA%'
        AND tc.created_at >= '2025-12-01'
      GROUP BY
        tc.folio_grupo, tc.status_curso, tc.curso,
        tc.unidad, tc.inicio, tc.termino, tc.horas,
        tc.nombre, tc.curp, tc.hombre, tc.mujer, tc.tcapacitacion
      ORDER BY MIN(tc.created_at) DESC
    `);

    return NextResponse.json({ cursos: rows });
  } catch (err) {
    console.error("[api/cursos]", err);
    return NextResponse.json({ error: "Error al consultar la base de datos" }, { status: 500 });
  } finally {
    client.release();
  }
}
