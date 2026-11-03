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
2. **Estructura y Composición Intencional:**
   * **Prohibido:** El hero centrado genérico con dos botones ("Empezar gratis" / "Saber más").
   * **Prohibido:** La "fórmula de las tres tarjetas" idénticas.
   * **Prohibido:** La secuencia predecible de plantilla SaaS (Logos -> 3 features -> Cómo funciona -> Testimonios -> Pricing -> FAQ).
   * **Prohibido:** Enchular titulares con píldoras decorativas como "✨ NUEVA GENERACIÓN" o números "01, 02, 03" sin función.
   * **Prohibido:** Encerrar todo el texto en tarjetas y cajas innecesarias.
   * **Prohibido:** Marquesinas de texto en scroll infinito.
   * **Prohibido:** El uso de caracteres Unicode o emojis como flechas o iconos (ejemplo: `←`, `→`, `↗`, `✨`, `🚀`). Toda la iconografía se implementará exclusivamente mediante componentes SVG vectoriales dedicados, accesibles y optimizados.
3. **Copywriting y Tono Editorial:**
   * **Prohibición Total de Texto de Relleno:** Queda estrictamente prohibido cualquier texto de adorno, párrafos de relleno ("fluff") o frases vacías. Todo texto presente en la web debe ser 100% útil, informativo y utilizar el mínimo número de palabras posible para explicar cada elemento o sección.
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
  * Titular: *"Friendly detailed worlds filled with passion."*
  * Manifiesto breve y cercano: *"A tiny indie game studio making warm, handmade things."*
  * Atmósfera serena de estanque con tonos `#8fb8d8` y detalles visuales sutiles.
* **Panel Derecho (El Juego — Beelze Pub):**
  * Presentación de *Beelze Pub*.
  * **Elemento estrella interactivo:** GIF animado de Skelly (`QNo3+A.gif`) sirviendo copas con micro-animación de entrada y flotación suave.
  * Botón de acción único y directo: *"Play free on Itch.io"*.
* **Interacción de Expansión (Hover Expansion):**
  * Reposo: 50% / 50%.
  * Al pasar el ratón suavemente sobre un lado: Se expande a un 62% / 38% mediante transición elástica y calmada (física *spring* suave, sin brusquedad).
  * Versión móvil: Distribución vertical fluida y natural adaptada a toques táctiles.
* **Scroll Parallax:**
  * Desfase suave de capas de fondo y elementos en primer plano con desacople de movimiento (velocidades relativas de 0.15x a 0.35x para evitar mareos).

### 5.3. Divisor de Ondas Animadas (`WaveDivider`)
* Transición vectorizada de 3 capas SVG entre el azul `#8fb8d8` del hero y el fondo `#f6f1e8` del cuerpo.
* Movimiento ondulante suave y continuo (períodos de 12s a 20s), generando una sensación acogedora de orilla o estanque.
* Totalmente deshabilitado si `prefers-reduced-motion: reduce` está activo.

### 5.4. Escaparate de Beelze Pub (`GameSpotlight`)
* **Inspiración:** Little Bandit (compacto, sin florituras, directo al juego).
* **Activos integrados:**
  * Key art y capturas reales del juego (`DAWj/c.png`, `4KDMJD.jpg`, `29GpAD.jpg`).
  * Skelly animado interactuando con los ingredientes y la barra del pub.
  * Explicación breve y auténtica de la experiencia: atender a la clientela del inframundo, preparar combinados curiosos y disfrutar de un fin de semana peculiar de camarero esqueleto.
  * Enlace y ficha técnica limpia (género, plataforma Itch.io, duración aproximada).

### 5.5. Sección "The Crew" (Diseño Aprobado: Tablón Artesanal de Sellos / Badges con Micro-Rotaciones)
* **Concepto:** Presentación de los 14 miembros del equipo mediante un tablón orgánico de placas tipográficas ("sellos" de artesano) en lugar de una tabla fría o tarjetas rígidas.
* **Estructura y Composición:**
  * Cada sello tiene proporciones orgánicas acordes a su contenido (nombre en Paperlogy Bold/ExtraBold, rol y país con tipografía cuidada).
  * Distribución asimétrica con micro-rotaciones sutiles (aleatoriedad orgánica entre `-0.8°` y `+0.8°`) simulando fichas colocadas a mano en un taller.
* **Interacciones y Micro-Física:**
  * Al pasar el ratón (hover), la placa se endereza elásticamente a `0°`, se eleva de forma suave y adquiere un resalte sutil en azul cielo `#b8d4f0`.
  * Si el miembro tiene enlace a su portfolio/perfil, se muestra un icono SVG limpio de enlace exterior y se emite un micro-pop de sonido sintetizado suave (si el audio está activo).
  * Cero caracteres Unicode o emojis; los iconos de enlace y país se renderizan mediante componentes SVG optimizados.

### 5.6. Micro-Interacciones Sonoras y Puntero Dinámico
* **Sonido (Web Audio API):**
  * Sin archivos pesados: micro-pulsos sintetizados ultra suaves (frecuencia cálida ~400-600Hz con decaimiento rápido de 15ms), simulando un sutil "tap" o "gota de agua" al interactuar con botones clave.
  * Volumen limitadísimo (gain ~0.08) para no molestar jamás.
  * Estado de mute guardado en `localStorage`.
* **Puntero Dinámico (Custom Cursor):**
  * Puntero sutil que complementa al cursor nativo (círculo suave de seguimiento elástico que cambia de escala y magnetismo al aproximarse a enlaces y botones).
  * En el panel de Beelze Pub, puede adoptar un matiz temático sutil (como una chispa o burbuja).
  * Desactivado en pantallas táctiles (`pointer: coarse`).

### 5.7. Pie de Página (`SiteFooter`)
* Tipografía potente en Paperlogy Black *"Follow the adventures."*
* Píldoras de contacto con enlaces a redes (X, Instagram, Reddit, TikTok, Itch.io), Blog y Careers.
