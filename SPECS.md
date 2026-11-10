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

### 5.1. Barra de Navegación Flotante Reactiva (`SiteHeader`)
* **Diseño Dinámico según Posición de Scroll:**
  * **Con el Hero a la vista:** La navbar adopta un acabado refinado de cristal esmerilado translúcido con desenfoque de fondo ligero y eficiente (`bg-[#627383]/45`, `backdrop-blur-md` a 12px, borde tenue, sombra sutil) y muestra la versión compacta del isotipo (`renhet-symbol-white.png`), cediendo todo el protagonismo al gran logotipo central del Hero y desenfocando suavemente el fondo.
  * **Al scrollear pasando el Hero:** La navbar se solidifica (`bg-[#627383]/92`, sombra elevada, desenfoque de fondo constante a 12px) y el isotipo se transforma de manera fluida (mediante una transición de escala y desplazamiento) en el logotipo completo con texto (`renhet-logo-white.png`), creando un contraste visual nítido y evidente durante el resto de la navegación.
* **Control de Audio:**
  * Dispone de un botón con icono SVG accesible en la cabecera con micro-animación de escala para silenciar/activar el sonido en cualquier momento, persistiendo la preferencia en `localStorage`.

### 5.2. Hero Split Interactivo ("The Pond & The Pub")
* **Inspiración:** Half Sunk Games, adaptado con física sutil y relajada (*cozy pond*).
* **Costura Orgánica entre Paneles (Seam Divider):** En lugar de un corte digital recto, la separación entre el panel del estudio (`#8fb8d8`) y el pub (`#344253`) se articula mediante un divisor de onda vertical orgánico animado, que ondea suavemente y acompaña la expansión de las columnas al pasar el ratón. En móvil, se adapta a un divisor horizontal suave.
* **Panel Izquierdo (El Estudio):**
  * Toda el área del panel funciona como enlace interactivo hacia `#crew`. Sin botones de estilo SaaS ni píldoras.
  * **Logotipo Principal a Gran Escala:** Se exhibe el logotipo de *Renhet Studio* en gran formato (`renhet-logo-white.png`) presidiendo la sección.
  * Titular: *"Friendly detailed worlds filled with passion."*
  * Manifiesto breve y cercano: *"A tiny indie game studio making warm, handmade things."*
* **Panel Derecho (El Juego — Beelze Pub):**
  * Toda el área del panel funciona como enlace interactivo hacia `#game`. Sin botones invasivos ni píldoras.
  * Titular: *"Beelze Pub"* y subtítulo mínimo: *"Mix drinks. Serve the underworld. Survive the weekend."*
  * Marca de agua del logotipo de *Beelze Pub* en el fondo con opacidad del 25% y sombra atmosférica.
  * **Elemento estrella interactivo:** GIF animado de Skelly (`skelly-anim.gif`) a gran escala (hasta 420px de altura), fijado a ras del fondo (`bottom-0`) para evitar cualquier corte o salto visual.
* **Interacción de Expansión (Hover Expansion):**
  * Reposo: 50% / 50%.
  * Al pasar el ratón suavemente sobre un lado: Se expande a un 62% / 38% mediante transición elástica y calmada (física *spring* suave, sin brusquedad).

### 5.3. Divisor de Ondas Animadas Seamless (`WaveDivider`)
* Transición vectorizada de 3 capas SVG entre el hero y el fondo `#f6f1e8` del cuerpo, y efecto de ola invertida en la cabecera del footer (`#4f5f70`).
* **Bucle 100% Seamless:** Cada capa SVG contiene dos períodos matemáticamente continuos (`viewBox="0 0 200 100"`) animados exactamente en un `-50%`, garantizando un ciclo infinito sin saltos, costuras ni enganches.
* **Contenedor Transparente:** Cero fondos o capas superpuestas arbitrarias que corten la visibilidad de los paneles traseros.

### 5.4. Escaparate de Beelze Pub (`GameSpotlight`) — Carrusel con Barra de Progreso
* **Inspiración:** Little Bandit (ultra minimalista, directo al juego, delimitado por el título y no por una tarjeta contenedora).
* **Carrusel con Avance Automático y Barra de Progreso:**
  * Rotación automática fluida entre 3 capturas del juego (coctelería, clientes del inframundo y arte principal).
  * Cada pestaña cuenta con una barra de progreso que indica visualmente el tiempo restante (5 segundos) antes de pasar a la siguiente diapositiva.
  * Al colocar el cursor sobre el carrusel, el avance se pausa automáticamente para permitir apreciar la imagen con calma.
  * Botones de navegación anterior/siguiente integrados y accesibles.
  * En modo de movimiento reducido, el avance automático se congela.

### 5.5. Sección "The Crew" (Tablón Artesanal de Sellos / Badges con Micro-Rotaciones)
* **Concepto:** Presentación de los 14 miembros del equipo mediante un tablón orgánico de placas tipográficas ("sellos" de artesano), única excepción justificada a la regla de cero tarjetas.
* **Sin Sobrecarga de Iconos:** Se han eliminado los iconos repetitivos de enlace externo en cada tarjeta; la interacción es limpia, orgánica e identificada mediante el texto interactivo del portfolio y la elevación suave.

### 5.6. Sistema Centralizado de Micro-Interacciones Sonoras (`SoundProvider.svelte`)
* **Lógica Centralizada:** Ningún componente individual inyecta manejadores `onclick` o `onmouseenter` para sonido. La gestión del audio reside exclusivamente en el componente `<SoundProvider />` montado en el layout raíz.
* **Solo al Hacer Clic:** Se han eliminado absolutamente todos los sonidos al pasar el ratón (hover) o campanas decorativas.
* **Variación Aleatoria Orgánica:** En cada clic, la frecuencia (~480Hz ± 60Hz), la duración y la ganancia se modulan ligeramente de forma aleatoria, emulando la acústica física de un golpe táctil natural que nunca se repite idéntico.

### 5.7. Pie de Página (`SiteFooter`)
* **Color de Fondo Restaurado:** `#4f5f70` (azul pizarra original de Renhet).
* **Logotipo Ampliado:** El logotipo del estudio en el footer cuenta con dimensiones ampliadas (`max-w-[400px]`) otorgando peso y autoridad visual al cierre.
* **Divisor de Ola Invertida:** Integrado en la parte superior del footer, generando una orilla fluida desde el papel `#f6f1e8` hacia el `#4f5f70`.
* **Copyright Centrado:** El texto de derechos reservados se encuentra centrado horizontalmente al pie de página.
* **Sin Enlaces Redundantes:** Eliminada la lista de texto redundante ("Careers • Blog • Beelze Pub").
