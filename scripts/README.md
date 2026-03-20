# Automatización de Capturas Zoom-like con Playwright

Este directorio contiene los scripts para la automatización End-to-End (E2E) de la aplicación, enfocados en la toma de capturas de pantalla para auditoría y verificación de las sesiones (cursos/reuniones).

Actualmente el principal script operativo es `tomar-capturas.ts`.

## Prerrequisitos

Para que los scripts funcionen adecuadamente, necesitas:
1. Tener las dependencias instaladas (`npm i` o `pnpm install`, incluyendo Playwright).
2. Tener Chromium de Playwright instalado (`npx playwright install chromium`).
3. El frontend de Next.js debe estar corriendo localmente en el puerto 3000 (`pnpm dev` o `npm run dev`).

## `tomar-capturas.ts`

Este script simula estar dentro de una reunión y toma un set de 3 capturas donde se manipulan paneles y cambia la foto del instructor (simulando rotación de avatares).

### ¿Qué hace el script?
Genera 3 capturas (`img1.jpg`, `img2.jpg`, `img3.jpg`) por cada folió de grupo procesado y las almacena siguiendo esta estructura de carpetas: 
`/capturas/{CURP}/{FOLIO}/`

1. **Captura 1:** Toma una imagen de la sala recién instanciada.
2. **Interacción:** Realiza un doble clic asistido del lado izquierdo del área de escenario para alternar el carrusel de instructores (`onNextSpeakerPhoto`). Abre la pestaña de Chat y revisa que haya un texto que coincida con la palabra `presente`.
3. **Captura 2:** Toma la segunda imagen.
4. **Interacción:** Hace un segundo doble clic en el lado izquierdo del área principal de presentación. Abre la pestaña de lista de Participantes.
5. **Captura 3:** Toma la tercera y última fotografía del proceso.

### Modos de Ejecución

El script detecta automáticamente el modo según los argumentos recibidos:

| Argumentos | Modo |
|---|---|
| Solo un CURP | **Modo CURP** — todos los folios de ese instructor |
| CURP + Folio (strings) | **Modo Individual** — una sola sala |
| Número + Número | **Modo Lotes (Batch)** — rango del grid |

---

#### 🆕 Modo CURP — Todos los folios de un instructor

Pasa únicamente el CURP del instructor. El script consultará la API (`/api/cursos`), filtrará todos los grupos donde `curp_instructor` coincida y procesará cada sala de forma secuencial.

```bash
npx ts-node scripts/tomar-capturas.ts "VECC910508MCSLHN02"
```

---

#### Modo Individual

Navega directamente a una sala específica. Provee el CURP del instructor y el Folio del grupo:

```bash
npx ts-node scripts/tomar-capturas.ts "VECC910508MCSLHN02" "7X-251453"
```

---

#### Modo por Lotes (Batch)

Para procesar miles de cursos en paralelo, abre múltiples terminales y asigna rangos de índice:

```bash
# Terminal 1
npx ts-node scripts/tomar-capturas.ts 1 100

# Terminal 2
npx ts-node scripts/tomar-capturas.ts 101 200

# Terminal 3
npx ts-node scripts/tomar-capturas.ts 201 300
```

> **Nota:** En modo lotes, el CURP se extrae automáticamente desde el DOM de la tarjeta en el grid de `/cursos?ini=X&fin=Y`.
