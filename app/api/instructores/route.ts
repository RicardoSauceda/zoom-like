import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const { rows } = await client.query<{
      curp: string;
      nombre: string;
      cursos_json: any;
    }>(`
      SELECT
        tc.curp,
        tc.nombre,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'folio_grupo', tc.folio_grupo,
            'curso', tc.curso,
            'tcapacitacion', tc.tcapacitacion
          )
        ) AS cursos_json
      FROM tbl_cursos tc
      WHERE tc.curp IS NOT NULL 
        AND tc.nombre IS NOT NULL
        AND tc.status_curso ILIKE 'PRUEBA%'
        AND tc.created_at >= '2025-12-01'
      GROUP BY tc.curp, tc.nombre
      ORDER BY tc.nombre ASC
    `);

    return NextResponse.json({ instructores: rows });
  } catch (err) {
    console.error("[api/instructores]", err);
    return NextResponse.json({ error: "Error al consultar instructores" }, { status: 500 });
  } finally {
    client.release();
  }
}
