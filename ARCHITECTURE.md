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
│   ├── +layout.svelte               # Shell global (Fuentes Paperlogy, configuración de audio, meta)
│   └── +page.svelte                 # Orquestador de la Home Page rediseñada
│
├── lib/
│   ├── components/
│   │   ├── SiteHeader.svelte        # Barra flotante con mute toggle y navegación
│   │   ├── SiteFooter.svelte        # Footer responsive con enlaces y redes
│   │   ├── CustomCursor.svelte      # Seguidor elástico sutil con respuesta magnética
│   │   ├── icons/                   # Iconografía SVG vectorial reutilizable (cero Unicode/emojis)
│   │   │   ├── IconArrow.svelte     # Flechas direccionales vectoriales configurables
│   │   │   ├── IconExternal.svelte  # Icono de enlace externo minimalista
│   │   │   ├── IconSound.svelte     # Icono de audio activo / silenciado
│   │   │   └── IconItch.svelte      # Logotipo vectorial de Itch.io
│   │   └── home/
│   │       ├── HeroSplit.svelte     # Split hero interactivo (Estudio vs Beelze Pub)
│   │       ├── WaveDivider.svelte   # Transición SVG de ondas fluidas multicapa
│   │       ├── GameSpotlight.svelte # Escaparate de Beelze Pub con Skelly animado
│   │       └── TheCrew.svelte       # Sección del equipo (Tablón de sellos artesanales con rotación)
│   │
│   ├── audio/
│   │   └── soundEffects.ts          # Módulo Web Audio API (micro-click, hover pop suave, mute state)
│   │
│   └── utils/
│       ├── motion.ts                # Utilidades matemáticas (lerp, spring damping)
│       └── cursor.ts                # Detección de puntero y soporte táctil
│
└── static/
    ├── fonts/                       # Fuentes Paperlogy en formato .woff2
    └── beelze-pub/                  # Activos locales de Beelze Pub (incluyendo Skelly animado)
```

---

## 3. Arquitectura del Sistema de Audio (`soundEffects.ts`)

Para evitar peticiones HTTP pesadas de archivos de sonido y garantizar inmediatez:
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
