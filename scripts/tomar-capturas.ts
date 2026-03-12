import { chromium, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function capturarReunion(page: Page, curp: string, folioGrupo: string): Promise<boolean> {
  // Esperar a que la sala de reuniones cargue bien
  try {
    await page.waitForSelector('[data-testid="meeting-stage"]', { timeout: 15000 });
  } catch (e) {
    console.log(`Sacando screenshot del error: error_timeout_${folioGrupo}.jpg`);
    await page.screenshot({ path: path.join(process.cwd(), 'capturas', `error_timeout_${folioGrupo}.jpg`) });
    return false;
  }

  const dirPath = path.join(process.cwd(), 'capturas', curp, folioGrupo);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  console.log(`[+] Captura 1 para ${folioGrupo}`);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(dirPath, 'img1.jpg') });

  const meetingStage = page.getByTestId('meeting-stage');
  const stageBoundingBox = await meetingStage.boundingBox();
  
  console.log(`[+] Cambiando foto de ponente...`);
  if (stageBoundingBox) {
    await meetingStage.dblclick({
      position: { x: 10, y: stageBoundingBox.height / 2 },
    });
  }
  await page.waitForTimeout(500);

  console.log(`[+] Mostrando el chat...`);
  await page.getByTestId('btn-chat').click();
  await expect(page.getByText('presente', { exact: false }).first()).toBeVisible({ timeout: 5000 }).catch(() => {});

  console.log(`[+] Captura 2 para ${folioGrupo}`);
  await page.screenshot({ path: path.join(dirPath, 'img2.jpg') });

  console.log(`[+] Cambiando a la foto 3...`);
  if (stageBoundingBox) {
    await meetingStage.dblclick({
      position: { x: 10, y: stageBoundingBox.height / 2 },
    });
  }
  await page.waitForTimeout(500);

  console.log(`[+] Mostrando participantes...`);
  await page.getByTestId('btn-participants').click();
  await expect(page.getByPlaceholder('Buscar un participante')).toBeVisible({ timeout: 5000 }).catch(() => {});

  console.log(`[+] Captura 3 para ${folioGrupo}`);
  await page.screenshot({ path: path.join(dirPath, 'img3.jpg') });
  
  console.log(`✅ Finalizado ${folioGrupo}.`);
  return true;
}

async function tomarCapturas(param1: string, param2: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  try {
    const isBatch = !isNaN(Number(param1)) && !isNaN(Number(param2));

    if (isBatch) {
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
        
        let curp = "CURP_NO_ENCONTRADA";
        const monospaceEls = await card.locator('[style*="monospace"]').allInnerTexts();
        for (const t of monospaceEls) {
          if (t.trim() !== folioGrupo && t.trim().length > 10) {
             curp = t.trim();
          }
        }

        await btnEntrar.click();
        
        // Ejecutar rutina de la sala
        await capturarReunion(page, curp, folioGrupo);

        console.log(`Regresando al grid...`);
        await page.goto(urlCursos);
        await page.waitForSelector('article', { timeout: 15000 }).catch(() => {});
      }
    } else {
      // Modo individual
      const curp = param1;
      const folioGrupo = param2;
      console.log(`[+] Abriendo [Modo Individual]: CURP ${curp} / Folio ${folioGrupo}`);
      await page.goto(`http://localhost:3000/reunion?folio=${folioGrupo}`);
      
      // Ejecutar rutina de la sala
      await capturarReunion(page, curp, folioGrupo);
    }
  } catch (error) {
    console.error('❌ Error general durante la automatización:', error);
  } finally {
    await browser.close();
  }
}

const args = process.argv.slice(2);
const p1 = args[0] || '1';
const p2 = args[1] || '10';

tomarCapturas(p1, p2);
