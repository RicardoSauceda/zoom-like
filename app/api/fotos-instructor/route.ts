import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

const EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

/**
 * GET /api/fotos-instructor?curp=XXXX&folio=YYYY&curso=ZZZZ&tcapacitacion=AAAA
 *
 * Returns the ordered list of photo filenames (without path) found in the
 * public/instructores/FOTOS_{CURP}/{MODALIDAD}_{folio}_{curso}/ directory.
 *
 * Response: { fotos: string[], base: string }
 *   - fotos: sorted filenames, eg. ["foto_A.jpg", "img2.jpeg", "retrato.png"]
 *   - base:  the public URL prefix so the client can build srcs
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const curp  = (searchParams.get("curp")  || "").toUpperCase().trim();
  const folio = (searchParams.get("folio") || "").trim();
  const curso = (searchParams.get("curso") || "").trim();
  const tcap  = (searchParams.get("tcapacitacion") || "").toUpperCase();

  if (!curp || !folio || !curso) {
    return NextResponse.json({ error: "curp, folio y curso son obligatorios" }, { status: 400 });
  }

  const modalidad = tcap.includes("DISTANCIA") ? "A_DISTANCIA" : "PRESENCIAL";
  const cleanCurso = curso.replace(/[\/\\?%*:|"<>]/g, "_").substring(0, 80);
  const dirName = `${modalidad}_${folio}_${cleanCurso}`;
  const base = `/instructores/FOTOS_${curp}/${dirName}`;

  const absDir = path.join(process.cwd(), "public", "instructores", `FOTOS_${curp}`, dirName);

  let fotos: string[] = [];
  try {
    const entries = fs.readdirSync(absDir);
    fotos = entries
      .filter((f) => {
        const ext = f.split(".").pop()?.toLowerCase() ?? "";
        return EXTS.has(ext);
      })
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch {
    // directory doesn't exist → empty array, not an error
  }

  return NextResponse.json({ fotos, base });
}
