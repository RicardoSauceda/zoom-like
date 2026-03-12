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

El script tiene dos modalidades de ejecución detectando intuitivamente los parámetros que le pasas por consola:

#### Modo Individual
Si deseas capturar exclusivamente y de forma directa un solo curso saltándote por completo la pantalla del grid y pasando directamente a `/reunion?folio=XX`. 

Provee un CURP y un Folio en String:
```bash
npx ts-node scripts/tomar-capturas.ts "TU_CURP_AQUI" "FOLIO_DE_TU_GRUPO"
```
**Ejemplo:**
```bash
npx ts-node scripts/tomar-capturas.ts "VECC910508MCSLHN02" "7X-251453"
```

#### Modo por Lotes (Batch Mode / Paralelismo)
Si posees miles de cursos, puedes abrir múltiples consolas/terminales en paralelo. El script leerá la página `/cursos` limitándose lógicamente a índices puntuales permitiéndole hacer *scrapping* y avanzar automáticamente regresando al inicio luego de cada sala.

Provee un índice inicial numérico y un límite final numérico:
```bash
# Terminal 1 - Procesará grupos mostrados desde la posición 1 a la 100
npx ts-node scripts/tomar-capturas.ts 1 100

# Terminal 2 - Procesará grupos mostrados del 101 al 200...
npx ts-node scripts/tomar-capturas.ts 101 200
```
> **Nota de uso Lotes:** El script extraerá el CURP y el Folio directamente buscando en el DOM de la tarjeta renderizada en la URL (`/cursos?ini=X&fin=Y`).
