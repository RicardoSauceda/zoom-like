import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { formatMexicanName } from "@/app/data";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ folio: string }> }
) {
  const { folio } = await params;
  const client = await pool.connect();

  try {
    // Datos del curso + instructor (anfitrión)
    const cursoRes = await client.query<{
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
      tcapacitacion: string | null;
    }>(
      `SELECT
        tc.folio_grupo,
        tc.curso,
        tc.unidad,
        tc.inicio::text,
        tc.termino::text,
        tc.horas,
        -- Priorizar el nombre de la tabla instructor
        COALESCE(NULLIF(TRIM(CONCAT(ins.nombre, ' ', ins."apellidoPaterno", ' ', ins."apellidoMaterno")), ''), tc.nombre) AS instructor_nombre,
        tc.curp     AS curp_instructor,
        tc.hombre,
        tc.mujer,
        tc.tcapacitacion
       FROM tbl_cursos tc
       LEFT JOIN instructor ins ON tc.curp = ins.curp
       WHERE tc.folio_grupo = $1
       LIMIT 1`,
      [folio]
    );

    if (cursoRes.rows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const rawCurso = cursoRes.rows[0];
    const curso = {
      ...rawCurso,
      // Aplicamos formatMexicanName al instructor como precaución de fallback
      instructor_nombre: formatMexicanName(rawCurso.instructor_nombre)
    };

    // Inscritos del grupo
    const inscritosRes = await client.query<{
      id: number;
      alumno: string;
      matricula: string | null;
      curp: string | null;
      sexo: string | null;
      status: string | null;
      tinscripcion: string | null;
      calificacion: string | null;
      porcentaje_asis: number | null;
    }>(
      `SELECT
        ti.id,
        ti.alumno,
        ti.matricula,
        ti.curp,
        ti.sexo,
        ti.status,
        ti.tinscripcion,
        ti.calificacion,
        ti.porcentaje_asis
       FROM tbl_inscripcion ti
       WHERE ti.folio_grupo = $1
         AND ti.activo = true
       ORDER BY ti.alumno ASC`,
      [folio]
    );

    // Los alumnos siguen necesitando la lógica JS porque tbl_alumnos no tiene nombres separados o no se especificó su uso
    const inscritos = inscritosRes.rows.map(ins => ({
      ...ins,
      alumno: formatMexicanName(ins.alumno)
    }));

    return NextResponse.json({
      curso,
      inscritos,
    });
  } catch (err) {
    console.error("[api/cursos/[folio]]", err);
    return NextResponse.json({ error: "Error al consultar" }, { status: 500 });
  } finally {
    client.release();
  }
}
