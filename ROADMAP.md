# ROADMAP: Plan de Implementación del Rediseño de Renhet Studio

De acuerdo con las instrucciones recibidas, **ningún cambio en el código fuente de `src/` se realizará sin la previa aprobación explícita del usuario**.

---

## Fase 0: Alineación y Elección de la Propuesta de "The Crew" (Fase Actual)
* [x] Confirmación de la estructura del Split Hero (Estudio a la izquierda, Beelze Pub a la derecha).
* [x] Integración de los recursos de Beelze Pub proporcionados (incluyendo el GIF animado de Skelly).
* [x] Incorporación del Manifiesto Anti-Cliché (45 reglas anti-IA) en las especificaciones.
* [x] Definición técnica de micro-interacciones de sonido (activo al primer gesto, con botón de mute) y cursor elástico.
* [x] Selección del diseño para "The Crew": **Propuesta B** (Tablón artesanal de sellos con micro-rotaciones).
* [x] Confirmación de idioma (inglés internacional, sin textos de relleno) y navegación mixta (secciones + páginas).
* [x] Regla estricta de cero Unicode/emojis: todos los iconos serán componentes SVG vectoriales.
* [ ] **HITO DE APROBACIÓN 0:** Luz verde explícita del usuario para iniciar la implementación de la Fase 1.

---

## Fase 1: Cimientos de Marca, Fuentes, Iconos SVG y Activos Locales
* **Tareas:**
  1. Descarga e integración local de las fuentes **Paperlogy** (`.woff2`) en `static/fonts/` y configuración de Tailwind CSS v4.
  2. Descarga y organización de los activos de **Beelze Pub** en `static/beelze-pub/` (GIF animado de Skelly, key art y capturas).
  3. Creación del sistema de componentes de iconos SVG reutilizables en `src/lib/components/icons/` (flechas, enlace externo, audio/mute, etc.), erradicando caracteres Unicode.
  4. Creación del módulo ligero de audio procedural `soundEffects.ts` y utilidad del cursor dinámico.
* [ ] **HITO DE APROBACIÓN 1:** Comprobación de fuentes, carga de activos y paleta sin errores.

---

## Fase 2: Hero Split Interactivo ("The Pond & The Pub")
* **Tareas:**
  1. Construcción del componente `HeroSplit.svelte`:
     * Lado izquierdo: Identidad artesanal de Renhet Studio en `#8fb8d8`.
     * Lado derecho: Espacio inmersivo de *Beelze Pub* con Skelly animado (`QNo3+A.gif`), destellos de la taberna y llamada a la acción hacia Itch.io.
  2. Implementación de la expansión suave al pasar el ratón (50/50 -> 62/38) con curvas elásticas relajadas.
  3. Movimiento parallax calmado (*cozy pond*) al hacer scroll.
  4. Adaptación táctil natural para dispositivos móviles.
* [ ] **HITO DE APROBACIÓN 2:** Demostración y feedback del Hero interactivo.

---

## Fase 3: Divisor de Ondas Animadas (`WaveDivider`)
* **Tareas:**
  1. Construcción del componente `WaveDivider.svelte` con 3 capas vectoriales SVG.
  2. Animación fluida continua y relajada que une el Hero con el fondo cálido `#f6f1e8`.
  3. Optimización de rendimiento a 60fps en GPU y respeto a `prefers-reduced-motion`.
* [ ] **HITO DE APROBACIÓN 3:** Revisión de la suavidad del divisor de ondas.

---

## Fase 4: Escaparate de Beelze Pub (`GameSpotlight`)
* **Tareas:**
  1. Construcción de `GameSpotlight.svelte` inspirado en la compacidad de *Little Bandit*.
  2. Integración de la galería de capturas de la taberna, detalles de gameplay y botón hacia Itch.io con feedback de sonido suave.
  3. Tarjeta/sello de la filosofía artesanal de Renhet (sin caer en la fórmula de 3 tarjetas de SaaS).
* [ ] **HITO DE APROBACIÓN 4:** Revisión del escaparate del juego.

---

## Fase 5: Sección "The Crew" (Tablón Artesanal de Sellos)
* **Tareas:**
  1. Construcción de `TheCrew.svelte` según la **Propuesta B** (tablón orgánico de placas tipográficas artesanales con micro-rotaciones sutiles entre -0.8° y +0.8°).
  2. Integración de los 14 miembros del equipo con roles, procedencia y enlaces a portfolio con iconos SVG vectoriales.
  3. Micro-interacción elástica al pasar el cursor (la placa se endereza a 0°, se resalta en `#b8d4f0` y emite un micro-pop suave si el sonido está habilitado).
* [ ] **HITO DE APROBACIÓN 5:** Validación de la sección del equipo.

---

## Fase 6: Navegación, Pie de Página, Accesibilidad y Pulido
* **Tareas:**
  1. Actualización de `SiteHeader.svelte` con el control de sonido accesible y navegación compacta.
  2. Pulido de `SiteFooter.svelte` ("Follow the adventures") y enlaces a redes.
  3. Activación del cursor dinámico elástico (solo en escritorio con ratón).
  4. Auditoría de accesibilidad WCAG AA, responsive y rendimiento en Lighthouse (>95).
* [ ] **HITO DE APROBACIÓN 6:** Aprobación final completa de la Home Page.

---

## Fase 7: Siguientes Pasos (Fuera del alcance actual)
*Una vez aprobada la Home Page por el usuario:*
1. Rediseño de **Careers / Empleo** (`/careers`).
2. Rediseño del **Blog** (`/blog` y artículos).
