import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { formatMexicanName } from "@/app/data";

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
        -- Priorizar el nombre compuesto de la tabla instructor
        COALESCE(NULLIF(TRIM(CONCAT(ins.nombre, ' ', ins."apellidoPaterno", ' ', ins."apellidoMaterno")), ''), tc.nombre) AS nombre,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'folio_grupo', tc.folio_grupo,
            'curso', tc.curso,
            'tcapacitacion', tc.tcapacitacion
          )
        ) AS cursos_json
      FROM tbl_cursos tc
      LEFT JOIN instructor ins ON tc.curp = ins.curp
      WHERE tc.curp IS NOT NULL 
        AND tc.nombre IS NOT NULL
        AND tc.status_curso ILIKE 'PRUEBA%'
        AND tc.created_at >= '2025-12-01'
      GROUP BY 
        tc.curp, 
        tc.nombre, 
        ins.nombre, 
        ins."apellidoPaterno", 
        ins."apellidoMaterno"
      ORDER BY nombre ASC
    `);

    // Usamos formatMexicanName como fallback solo si no hay match en la tabla instructor
    const formattedRows = rows.map(r => ({
      ...r,
      nombre: formatMexicanName(r.nombre)
    }));

    return NextResponse.json({ instructores: formattedRows });
  } catch (err) {
    console.error("[api/instructores]", err);
    return NextResponse.json({ error: "Error al consultar instructores" }, { status: 500 });
  } finally {
    client.release();
  }
}
