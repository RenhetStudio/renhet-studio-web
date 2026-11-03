# ARCHITECTURE: Arquitectura Técnica de la Home Page (Renhet Studio)

## 1. Stack Tecnológico Base

* **Framework Web:** SvelteKit 2.x
* **Librería de Componentes:** Svelte 5 (Runes reactivos: `$state`, `$derived`, `$props`, `$effect`)
* **Sistema de Estilos:** Tailwind CSS v4 con `@tailwindcss/vite`
* **Audio y Micro-Interacciones:**
  * **Web Audio API sintetizada:** Micro-síntesis procedural mediante osciladores senoidales de caída ultrarrápida (~15ms, gain 0.08) sin necesidad de cargar ficheros `.mp3` ni añadir peso de red.
* **Cursor Dinámico:** Seguidor elástico renderizado mediante transformaciones por hardware (`translate3d`), activo solo en entornos de puntero fino (`(hover: hover) and (pointer: fine)`).
* **Gestión de Imágenes:** Almacenamiento local optimizado en `static/beelze-pub/` y procesamiento con `sharp` para formatos `.avif` y `.webp`.

---

## 2. Jerarquía de Componentes

```
src/
├── routes/
│   ├── +layout.svelte               # Shell global (Fuentes Paperlogy, SoundProvider, CustomCursor, meta)
│   └── +page.svelte                 # Orquestador de la Home Page rediseñada
│
├── lib/
│   ├── components/
│   │   ├── SoundProvider.svelte     # Proveedor global de audio (captura clics interactivos con modulación aleatoria)
│   │   ├── SiteHeader.svelte        # Barra flotante con mute toggle, transición de discreta a sólida y morphing de logo
│   │   ├── SiteFooter.svelte        # Footer responsive con ola invertida, logo ampliado y redes
│   │   ├── CustomCursor.svelte      # Seguidor elástico sutil con centrado estático geométrico
│   │   ├── icons/                   # Iconografía SVG vectorial reutilizable (cero Unicode/emojis)
│   │   │   ├── IconArrow.svelte     # Flechas direccionales vectoriales configurables
│   │   │   ├── IconExternal.svelte  # Icono de enlace externo minimalista
│   │   │   ├── IconSound.svelte     # Icono de audio activo / silenciado
│   │   │   └── IconItch.svelte      # Logotipo vectorial de Itch.io
│   │   └── home/
│   │       ├── HeroSplit.svelte     # Split hero interactivo con costura de onda orgánica y logo grande
│   │       ├── WaveDivider.svelte   # Transición SVG de ondas seamless y modo invertido
│   │       ├── GameSpotlight.svelte # Carrusel con scroll automático y barra de progreso temporal
│   │       └── TheCrew.svelte       # Sección del equipo (Tablón de sellos artesanales sin sobrecarga de iconos)
│   │
│   ├── audio/
│   │   └── soundEffects.ts          # Módulo Web Audio API (micro-click procedural aleatorizado, mute state)
│   │
│   └── utils/
│       ├── motion.ts                # Utilidades matemáticas (lerp, spring damping)
│       └── cursor.ts                # Detección de puntero y soporte táctil
│
└── static/
    ├── fonts/                       # Fuentes Paperlogy en formato .woff2
    ├── beelze-pub/                  # Activos locales de Beelze Pub (incluyendo Skelly animado)
    └── renhet-symbol-white.png      # Isotipo blanco para la cabecera reactiva
```

---

## 3. Arquitectura del Sistema de Audio Centralizado (`SoundProvider.svelte` + `soundEffects.ts`)

En concordancia con el principio de código limpio y sin repetición:
* **Cero manejadores locales:** Ningún botón o enlace declara `onclick={() => sound.playPop()}` ni `onmouseenter={() => sound.playHover()}`.
* **Captura Global en `<SoundProvider />`:** Un único event listener `click` en fase de captura identifica si el clic proviene de un elemento interactivo (`a, button, [role='button'], [role='tab'], input, select, textarea, .badge-stamp`).
* **Micro-Variación Aleatoria Orgánica:** Cada clic sintetiza una onda senoidal con una frecuencia base modulada al azar (`480Hz ± 60Hz`), duración entre 18ms y 26ms y ganancia sutil, de modo que cada interacción suena ligeramente distinta, física y natural.
```typescript
class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false; // Activo por defecto desde la primera interacción

  init() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('renhet_audio_muted');
    this.isMuted = stored === 'true';

    // Inicialización al primer gesto del usuario (click / keydown)
    const unlock = () => {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };

    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('renhet_audio_muted', String(this.isMuted));
    return this.isMuted;
  }

  playPop(freq = 520) {
    if (this.isMuted || !this.ctx) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + 0.02);
    
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime); // Volumen sutil
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.02);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }
}
```

---

## 4. Arquitectura del Hero Split Interactivo (`HeroSplit.svelte`)

### 4.1. Lógica de Expansión Eased
* En reposo: La cuadrícula divide el ancho en `50% / 50%`.
* Al desplazar el ratón sobre un panel:
  * Variable CSS `--split-left: 62%` o `--split-left: 38%`.
  * La transición se aplica mediante CSS `grid-template-columns` con curva cúbica suave (`cubic-bezier(0.2, 0.8, 0.2, 1)`), garantizando fluidez sin saltos.
* En el panel derecho de Beelze Pub:
  * Se aloja el GIF optimizado de Skelly sirviendo copas, con micro-animación flotante y sombra de contacto que reacciona a la posición del cursor.

---

## 5. Arquitectura del Divisor de Ondas (`WaveDivider.svelte`)

* 3 capas SVG continuas con paths senoidales desfasados.
* Traslación horizontal en bucle mediante CSS `transform: translate3d(...)` acelerado por hardware:
  * Capa 1: Duración 24s (fondo más tenue).
  * Capa 2: Duración 16s (intermedia).
  * Capa 3: Duración 11s (frente que corta con el color `#f6f1e8`).
* Condicional de accesibilidad: Si `prefers-reduced-motion: reduce` está presente, la animación se congela en una curva fija serena.

---

## 6. Pipeline de Activos de Beelze Pub

Los 4 recursos proporcionados por el usuario se descargarán y alojarán localmente en `static/beelze-pub/`:
1. `skelly-anim.gif` (GIF animado de Skelly en movimiento).
2. `beelze-pub-keyart.png` (Arte principal del juego).
3. `beelze-pub-screen-1.jpg` (Captura de pantalla de la taberna y mezcla de bebidas).
4. `beelze-pub-screen-2.jpg` (Captura de pantalla de personajes y diálogos).

Las imágenes estáticas se procesarán con el script `scripts/optimize-images.mjs` para servir variantes ligeras `.avif` y `.webp` mediante etiquetas `<picture>`.

---

## 7. Patrón de Diseño "No Cards" y Composición Editorial

En concordancia con las directrices visuales del estudio:
* **Delimitación por Jerarquía Tipográfica y Espacio:** Las secciones no están encapsuladas en contenedores de tarjeta con bordes ni fondos diferenciados (como suele verse en sitios SaaS convencionales). La estructura se sostiene a través del contraste de tipografías (Paperlogy Black para H2s), espaciado vertical rítmico (`py-20 sm:py-28`) y fluidez de lienzo.
* **Excepción Única (*The Crew*):** Los 14 sellos o placas artesanales del equipo son el único elemento con micro-caja justificada, simulando fichas tangibles de un taller de artesano, enriquecidas con micro-rotaciones asimétricas orgánicas.

---

## 8. Geometría y Matemáticas de las Ondas Seamless (`WaveDivider.svelte`)

Para erradicar cualquier corte visible, desfase o "overlay azul" que corte las secciones de fondo:
1. **Contenedor 100% Transparente:** La raíz de `WaveDivider` no posee color de fondo. Permite que el fondo de la sección sobre la que se asienta (Hero Split o Footer) permanezca visible en las zonas no cubiertas por las crestas.
2. **Curvatura de 2 Períodos Idénticos:** En un `viewBox="0 0 200 100"`, el SVG contiene dos ondas periódicas exactamente iguales (Periodo 1: x=0..100, Periodo 2: x=100..200) con continuidad $C^1$ en puntos de inflexión y extremos.
3. **Desplazamiento del 50%:** La animación CSS traslada el SVG exactamente un `-50%` (`translate3d(-50%, 0, 0)`). Al llegar al final del ciclo, el inicio del segundo período coincide al milímetro con el primer período, generando un bucle infinito imperceptible y libre de saltos a 60fps.
4. **Soporte Invertido (`inverted={true}`):** Mediante `transform: scaleY(-1)` se invierte verticalmente la onda para crear la orilla superior del footer (`#4f5f70`), haciendo que el lienzo de papel (`#f6f1e8`) curve suavemente hacia el fondo oscuro del pie de página.

---

## 9. Arquitectura del Puntero Dinámico (`CustomCursor.svelte`)

Para resolver problemas comunes de desalineación o desfase al enfocar botones:
* **Separación de Coordenadas y Centrado Geométrico:**
  * Las posiciones dinámicas calculadas por JS/LERP se aplican exclusivamente mediante `style.left` y `style.top`.
  * El centrado se encomienda de manera estricta y permanente al CSS estático `.cursor-dot, .cursor-ring { top: 0; left: 0; transform: translate(-50%, -50%); }`.
  * De esta forma, las mutaciones de tamaño (`h-7 w-7` a `h-11 w-11`) se expanden de forma simétrica desde el punto exacto del puntero nativo, sin provocar tirones ni desalineaciones en el eje.
