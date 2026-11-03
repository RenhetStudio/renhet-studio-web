# SPECS: Rediseño de la Página Principal de Renhet Studio

## 1. Visión General del Proyecto
Transformar la página de inicio de **Renhet Studio** en una experiencia web interactiva, moderna, acogedora y con profunda identidad de estudio independiente, tomando inspiración técnica y estética de **Half Sunk Games**, **Wildflower Games** y **Little Bandit**, respetando estrictamente la paleta de colores de Renhet Studio, la tipografía **Paperlogy**, y evitando deliberadamente los clichés estéticos y narrativos de diseño web genérico / IA.

---

## 2. Manifiesto Anti-Cliché (Diseño Humano y de Autor vs. "AI Slop")

Para garantizar que la web respire autenticidad, artesanía y alma indie real, se establecen directrices explícitas para neutralizar los 45 patrones de diseño e IA comunes:

1. **Identidad Visual Real (Cero estética SaaS genérica):**
   * **Prohibido:** Degradados morados/azules tecnológicos, brillos fluorescentes ("neon glow") y fondos negros con halos cyberpunk.
   * **Prohibido:** El cliché beige/terracota con titulares en serif cursiva forzada.
   * **Adoptado:** La paleta auténtica de Renhet: Papel cálido (`#f6f1e8`), azul estanque (`#8fb8d8`), azul cielo sutil (`#b8d4f0`), pizarra suave (`#4f5f70`) y crema (`#fffdf3`).
   * **Prohibido:** Esquinas redondeadas idénticas en absolutamente todo. Habrá variedad intencional en las formas (bordes limpios, píldoras orgánicas, asimetría sutil).
   * **Prohibido:** Sombras difusas exageradas y glassmorphism decorativo innecesario.
   * **Prohibido:** Emojis como sistema de iconos (❌ 🚀, ⚡, ✨, 🎯). Iconografía SVG artesanal coherente.
2. **Estructura y Composición Intencional (Cero Tarjetas / No Cards Rule):**
   * **Regla Estricta de "Cero Tarjetas":** No se utilizarán tarjetas para delimitar secciones ni para agrupar contenidos generales. Las secciones se delimitan únicamente por su titular tipográfico y el espacio negativo, no visualmente por cajas o contenedores con fondo/borde. Se evitarán tarjetas en el resto de elementos (la única excepción justificada son los sellos/badges artesanales de *The Crew*).
   * **Prohibido:** El hero centrado genérico con dos botones ("Empezar gratis" / "Saber más") o botones flotantes tipo SaaS.
   * **Prohibido:** Píldoras decorativas encima de titulares (como "✨ NUEVA GENERACIÓN", "Debut Release" o "The Team"). Titulares limpios y directos.
   * **Prohibido:** La "fórmula de las tres tarjetas" idénticas.
   * **Prohibido:** La secuencia predecible de plantilla SaaS (Logos -> 3 features -> Cómo funciona -> Testimonios -> Pricing -> FAQ).
   * **Prohibido:** Encerrar todo el contenido en tarjetas y cajas innecesarias.
   * **Prohibido:** Marquesinas de texto en scroll infinito.
   * **Prohibido:** El uso de caracteres Unicode o emojis como flechas o iconos (ejemplo: `←`, `→`, `↗`, `✨`, `🚀`). Toda la iconografía se implementará exclusivamente mediante componentes SVG vectoriales dedicados, accesibles y optimizados.
3. **Copywriting y Tono Editorial (Cero Relleno / Minimalismo Estricto):**
   * **Prohibición Total de Texto de Relleno:** Queda estrictamente prohibido cualquier texto de adorno, párrafos de relleno ("fluff"), subtítulos genéricos ("Fourteen makers collaborating remotely...") o frases vacías. Todo texto presente en la web debe ser 100% útil, informativo y utilizar el mínimo número de palabras posible para explicar cada elemento o sección.
   * **Prohibido:** Fórmulas trilladas como *"No es un juego, es una experiencia"* o *"Tu negocio llevado al siguiente nivel"*.
   * **Prohibido:** Preguntas retóricas seguidas de respuestas ("¿El secreto? La pasión").
   * **Prohibido:** Tríadas forzadas ("Rápido. Fácil. Seguro").
   * **Prohibido:** Rayas largas innecesarias (—) o párrafos de una sola frase con ritmo artificial.
   * **Adoptado:** Tono honesto, cercano, artesanal, directo y conciso: comunicar qué es el estudio, qué ofrece *Beelze Pub* y quién forma el equipo, sin rodeos.

---

## 3. Paleta de Colores de Renhet Studio (Inmutable)

| Token | Hex | Rol Semántico |
| :--- | :--- | :--- |
| **Paper** | `#f6f1e8` | Fondo principal cálido, textura de lienzo orgánico. |
| **Cream** | `#fffdf3` | Superficies iluminadas, fondo de botones secundarios y contenedores. |
| **Pond Blue** | `#8fb8d8` | Fondo del hero pond, atmósfera acogedora e interactiva. |
| **Sky Blue** | `#b8d4f0` | Acento interactivo, selecciones, hover suave. |
| **Slate Ink** | `#4f5f70` | Texto de lectura principal, botones de acción primarios. |
| **Deep Dark** | `#344253` | Titulares de máximo contraste y estados activos. |
| **Warm Border** | `#d6d5ca` | Líneas divisorias estructurales y contornos limpios. |
| **Muted Slate** | `#627383` / `#718191` | Metadatos, roles del equipo y textos de apoyo. |

---

## 4. Tipografía: Paperlogy Font

* **Licencia:** **SIL Open Font License (OFL) 1.1** (100% gratuita para uso comercial y personal).
* **Auto-alojamiento:** Archivos `.woff2` locales en `static/fonts/` con `font-display: swap`.
* **Pesos en uso:**
  * `Paperlogy-4Regular` (400) — Lectura y párrafos informativos.
  * `Paperlogy-6SemiBold` (600) & `Paperlogy-7Bold` (700) — Navegación, botones y etiquetas.
  * `Paperlogy-8ExtraBold` (800) & `Paperlogy-9Black` (900) — Titulares expresivos y titulares de sección.

---

## 5. Arquitectura de Secciones de la Home Page

### 5.1. Barra de Navegación Flotante (`SiteHeader`)
* **Diseño:** Píldora de navegación compacta, fija y con desenfoque de fondo sutil.
* **Estructura de Navegación (Inglés, sin relleno):**
  * Logotipo de Renhet Studio (usando los recursos PNG optimizados del proyecto).
  * Enlaces mixtos:
    * Scroll suave a secciones internas de la Home: `Beelze Pub`, `The Crew`.
    * Enlaces a páginas externas: `Blog`, `Careers`.
* **Control de Audio:**
  * El audio se inicializa automáticamente en la primera interacción o clic del usuario (cumpliendo con la política de AudioContext de los navegadores).
  * Dispone de un botón con icono SVG accesible en la cabecera para silenciar/activar el sonido en cualquier momento, persistiendo la preferencia en `localStorage`.

### 5.2. Hero Split Interactivo ("The Pond & The Pub")
* **Inspiración:** Half Sunk Games, adaptado con física sutil y relajada (*cozy pond*).
* **Panel Izquierdo (El Estudio):**
  * Toda el área del panel funciona como enlace interactivo hacia `#crew`. Sin botones de estilo SaaS ni píldoras.
  * Titular: *"Friendly detailed worlds filled with passion."*
  * Manifiesto breve y cercano: *"A tiny indie game studio making warm, handmade things."*
  * Atmósfera serena de estanque con tonos `#8fb8d8` y detalles visuales sutiles.
* **Panel Derecho (El Juego — Beelze Pub):**
  * Toda el área del panel funciona como enlace interactivo hacia `#game`. Sin botones invasivos ni píldoras.
  * Titular: *"Beelze Pub"* y subtítulo mínimo: *"Mix drinks. Serve the underworld. Survive the weekend."*
  * Marca de agua sutil del logotipo de *Beelze Pub* en el fondo.
  * **Elemento estrella interactivo:** GIF animado de Skelly (`skelly-anim.gif`) con gran protagonismo visual, amplio y desbordado orgánicamente sobre la sección, sin cajas ni bordes que lo encierren.
* **Interacción de Expansión (Hover Expansion):**
  * Reposo: 50% / 50%.
  * Al pasar el ratón suavemente sobre un lado: Se expande a un 62% / 38% mediante transición elástica y calmada (física *spring* suave, sin brusquedad).
  * Versión móvil: Distribución vertical fluida y natural adaptada a toques táctiles.
* **Scroll Parallax:**
  * Desfase suave de capas de fondo y elementos en primer plano con desacople de movimiento (velocidades relativas de 0.15x a 0.35x para evitar mareos).

### 5.3. Divisor de Ondas Animadas Seamless (`WaveDivider`)
* Transición vectorizada de 3 capas SVG entre el hero y el fondo `#f6f1e8` del cuerpo, y efecto de ola invertida en la cabecera del footer (`#4f5f70`).
* **Bucle 100% Seamless:** Cada capa SVG contiene dos períodos matemáticamente continuos (`viewBox="0 0 200 100"`) animados exactamente en un `-50%`, garantizando un ciclo infinito sin saltos, costuras ni enganches.
* **Contenedor Transparente:** Cero fondos o capas superpuestas arbitrarias que corten la visibilidad de los paneles traseros.
* Totalmente deshabilitado si `prefers-reduced-motion: reduce` está activo.

### 5.4. Escaparate de Beelze Pub (`GameSpotlight`)
* **Inspiración:** Little Bandit (ultra minimalista, directo al juego, delimitado por el título y no por una tarjeta contenedora).
* **Composición Libre de Tarjetas:** La sección no se encierra en una caja; se presenta con titular limpio a la izquierda y enlace a Itch.io a la derecha, captura a pantalla completa con pestañas mínimas de subrayado, y un texto ultra reducido y conciso.
* **Activos integrados:**
  * Capturas reales del juego en formatos `.avif` y `.webp` optimizados.
  * Enlace y ficha técnica limpia hacia Itch.io con componente SVG.

### 5.5. Sección "The Crew" (Tablón Artesanal de Sellos / Badges con Micro-Rotaciones)
* **Concepto:** Presentación de los 14 miembros del equipo mediante un tablón orgánico de placas tipográficas ("sellos" de artesano), única excepción justificada a la regla de cero tarjetas.
* **Estructura y Composición:**
  * Titular limpio: *"The crew."* sin píldoras decorativas ni subtítulos genéricos de relleno.
  * Distribución asimétrica con micro-rotaciones sutiles (aleatoriedad orgánica entre `-0.8°` y `+0.8°`) simulando fichas colocadas a mano en un taller.
* **Interacciones y Micro-Física:**
  * Al pasar el ratón (hover), la placa se endereza elásticamente a `0°`, se eleva de forma suave y adquiere un resalte sutil en azul cielo `#b8d4f0`.
  * Si el miembro tiene enlace a su portfolio/perfil, se muestra un icono SVG limpio de enlace exterior y se emite un micro-pop de sonido sintetizado suave (si el audio está activo).

### 5.6. Micro-Interacciones Sonoras y Puntero Dinámico
* **Sonido (Web Audio API):**
  * Micro-pulsos sintetizados ultra suaves (frecuencia cálida ~400-600Hz con decaimiento rápido de 15ms), simulando un sutil "tap" o "gota de agua" al interactuar con botones clave.
  * Transición animada (escala elástica) en el botón de mute/desmute de la barra de navegación.
  * Estado de mute guardado en `localStorage`.
* **Puntero Dinámico (Custom Cursor):**
  * Puntero sutil centrado geométricamente mediante CSS estático `transform: translate(-50%, -50%)`, eliminando cualquier desalineación o desfase al enfocar enlaces y botones interactivos.
  * Desactivado en pantallas táctiles (`pointer: coarse`) o con movimiento reducido.

### 5.7. Pie de Página (`SiteFooter`)
* **Color de Fondo Restaurado:** `#4f5f70` (azul pizarra original de Renhet).
* **Divisor de Ola Invertida:** Integrado en la parte superior del footer, generando una orilla fluida desde el papel `#f6f1e8` hacia el `#4f5f70`.
* **Botones Sólidos de Identidad:** Píldoras en crema sólido (`#fffdf3`) con texto `#4f5f70` e icono SVG direccional, eliminando cualquier glassmorphism translúcido.
* **Sin Párrafos de Relleno:** Titular expresivo en Paperlogy Black *"Follow the adventures."* y accesos directos claros.
