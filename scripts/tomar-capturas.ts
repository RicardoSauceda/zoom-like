import { chromium, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:3000';

/** Consulta la API y devuelve la lista ordenada de nombres de archivo (sin ruta) */
async function fetchFotosList(
  page: Page,
  curp: string,
  folio: string,
  curso: string,
  tcapacitacion: string,
): Promise<string[]> {
  const params = new URLSearchParams({ curp, folio, curso, tcapacitacion });
  const resp = await page.request.get(`${BASE_URL}/api/fotos-instructor?${params}`);
  if (!resp.ok()) return [];
  const data: { fotos: string[] } = await resp.json();
  return data.fotos; // ya vienen ordenadas por la API
}

async function capturarReunion(
  page: Page,
  curp: string,
  folioGrupo: string,
  curso: string,
  tcapacitacion: string,
): Promise<boolean> {
  // Esperar a que la sala cargue
  try {
    await page.waitForSelector('[data-testid="meeting-stage"]', { timeout: 15000 });
  } catch {
    console.log(`Sacando screenshot del error: error_timeout_${folioGrupo}.jpg`);
    fs.mkdirSync(path.join(process.cwd(), 'capturas'), { recursive: true });
    await page.screenshot({ path: path.join(process.cwd(), 'capturas', `error_timeout_${folioGrupo}.jpg`) });
    return false;
  }

  // Obtener lista dinámica de fotos
  const fotos = await fetchFotosList(page, curp, folioGrupo, curso, tcapacitacion);
  const total = fotos.length;

  if (total === 0) {
    console.log(`⚠️  Sin fotos encontradas para ${folioGrupo}. Se tomará 1 captura sin cambios de foto.`);
  } else {
    console.log(`[+] ${total} foto(s) disponibles: ${fotos.join(', ')}`);
  }

  // El número de capturas = max(total, 1) para no perder la sala si no hay fotos
  const capturaCount = total > 0 ? total : 1;

  const dirPath = path.join(process.cwd(), 'capturas', curp, folioGrupo);
  fs.mkdirSync(dirPath, { recursive: true });

  const meetingStage = page.getByTestId('meeting-stage');
  const stageBoundingBox = await meetingStage.boundingBox();

  // Panel a mostrar en cada captura: alterna chat → participantes → chat → ...
  const panels = ['btn-chat', 'btn-participants'];

  for (let i = 0; i < capturaCount; i++) {
    const fotoNombre = total > 0 ? path.parse(fotos[i]).name : `captura_${i + 1}`;
    const savePath = path.join(dirPath, `${fotoNombre}.jpg`);

    // Esperar que la imagen haya cargado (pequeña pausa)
    await page.waitForTimeout(i === 0 ? 1000 : 500);

    // Abrir el panel que corresponde a esta vuelta
    const panelBtn = panels[i % panels.length];
    await page.getByTestId(panelBtn).click();
    await page.waitForTimeout(300);

    console.log(`[+] Captura ${i + 1}/${capturaCount} → ${fotoNombre}.jpg`);
    await page.screenshot({ path: savePath });

    // Avanzar al siguiente foto con doble-clic (excepto en la última)
    if (i < capturaCount - 1 && stageBoundingBox) {
      console.log(`    ↪ Doble-clic para siguiente foto...`);
      await meetingStage.dblclick({
        position: { x: 10, y: stageBoundingBox.height / 2 },
      });
    }
  }

  console.log(`✅ Finalizado ${folioGrupo}.`);
  return true;
}

async function tomarCapturas(param1: string, param2?: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    // ── Detectar modo ───────────────────────────────────────────
    // Modo CURP:       1 argumento   → buscar TODOS los folios de ese instructor
    // Modo Individual: 2 args string → CURP + FOLIO directamente
    // Modo Lotes:      2 args número → ini + fin del grid

    const isBatch  = param2 !== undefined && !isNaN(Number(param1)) && !isNaN(Number(param2));
    const isByCurp = param2 === undefined; // Solo se pasó el CURP

    if (isByCurp) {
      // ── Modo CURP ─────────────────────────────────────────────
      const curp = param1.toUpperCase();
      console.log(`[+] [Modo CURP] Consultando todos los folios del instructor: ${curp}`);

      const resp = await page.request.get(`${BASE_URL}/api/cursos`);
      const data = await resp.json();
      const registros = (data.cursos as { curp_instructor: string; folio_grupo: string; curso: string; tcapacitacion: string | null }[])
        .filter(c => c.curp_instructor?.toUpperCase() === curp);

      if (registros.length === 0) {
        console.log(`⚠️  No se encontraron folios para el CURP ${curp}.`);
      } else {
        console.log(`[+] ${registros.length} folio(s) encontrado(s): ${registros.map(r => r.folio_grupo).join(', ')}`);
        for (let i = 0; i < registros.length; i++) {
          const { folio_grupo: folioGrupo, curso: cursoNombre, tcapacitacion } = registros[i];
          console.log(`\n--- Procesando folio ${i + 1} de ${registros.length}: ${folioGrupo} ---`);
          await page.goto(`${BASE_URL}/reunion?folio=${folioGrupo}`);
          await capturarReunion(page, curp, folioGrupo, cursoNombre, tcapacitacion ?? '');
        }
      }

    } else if (isBatch) {
      const ini = param1;
      const fin = param2;
      const urlCursos = `http://localhost:3000/cursos?ini=${ini}&fin=${fin}`;
      console.log(`[+] Abriendo grid de cursos [Modo Lotes]: ${urlCursos}`);
      await page.goto(urlCursos);
      await page.waitForSelector('article', { timeout: 15000 }).catch(() => {});
      
      const count = await page.locator('article').count();
      console.log(`[+] Se encontraron ${count} cursos a procesar en este rango.`);

      for (let i = 0; i < count; i++) {
        console.log(`\n--- Procesando curso ${i + 1} de ${count} ---`);

        const card = page.locator('article').nth(i);
        const btnEntrar = card.locator('button[aria-label^="Unirse a"]');

        const ariaLabel = await btnEntrar.getAttribute('aria-label') || '';
        const folioGrupo = ariaLabel.replace('Unirse a ', '').trim();

        // Extraer CURP de los elementos monospace de la tarjeta
        let curp = 'CURP_NO_ENCONTRADA';
        let cursoNombre = '';
        let tcapacitacion = '';
        const monospaceEls = await card.locator('[style*="monospace"]').allInnerTexts();
        for (const t of monospaceEls) {
          if (t.trim() !== folioGrupo && t.trim().length > 10) {
            curp = t.trim();
          }
        }

        // Para obtener curso y tcapacitacion, consultamos la API de ese folio
        try {
          const folioResp = await page.request.get(`${BASE_URL}/api/cursos/${encodeURIComponent(folioGrupo)}`);
          if (folioResp.ok()) {
            const folioData = await folioResp.json();
            cursoNombre   = folioData.curso?.curso ?? '';
            tcapacitacion = folioData.curso?.tcapacitacion ?? '';
            if (folioData.curso?.curp_instructor) curp = folioData.curso.curp_instructor;
          }
        } catch { /* usa los valores ya obtenidos del DOM */ }

        await btnEntrar.click();

        // Ejecutar rutina de la sala
        await capturarReunion(page, curp, folioGrupo, cursoNombre, tcapacitacion);

        console.log(`Regresando al grid...`);
        await page.goto(urlCursos);
        await page.waitForSelector('article', { timeout: 15000 }).catch(() => {});
      }
    } else {
      // Modo individual: necesitamos obtener curso y tcapacitacion de la API
      const curp = param1;
      const folioGrupo = param2!;
      console.log(`[+] Abriendo [Modo Individual]: CURP ${curp} / Folio ${folioGrupo}`);

      let cursoNombre = '';
      let tcapacitacion = '';
      try {
        const folioResp = await page.request.get(`${BASE_URL}/api/cursos/${encodeURIComponent(folioGrupo)}`);
        if (folioResp.ok()) {
          const folioData = await folioResp.json();
          cursoNombre   = folioData.curso?.curso ?? '';
          tcapacitacion = folioData.curso?.tcapacitacion ?? '';
        }
      } catch { /* ignorar, la API puede no estar arriba aún */ }

      await page.goto(`${BASE_URL}/reunion?folio=${folioGrupo}`);
      await capturarReunion(page, curp, folioGrupo, cursoNombre, tcapacitacion);
    }
  } catch (error) {
    console.error('❌ Error general durante la automatización:', error);
  } finally {
    await browser.close();
  }
}

const args = process.argv.slice(2);
const p1 = args[0] || '1';
const p2 = args[1]; // puede ser undefined en modo CURP

tomarCapturas(p1, p2);
