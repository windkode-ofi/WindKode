# WindKode — Guía de Marca para Marketing y Redes Sociales

## 🎨 Paleta de Colores (Light / Dark)

Usa estos valores exactos en Canva, Figma, o cualquier herramienta de diseño.

### Tema Claro (Light)
| Uso | Hex | RGB | Variable CSS |
|-----|-----|-----|--------------|
| **Fondo principal** | `#f4f5f8` | 244, 245, 248 | `--color-abyss` |
| **Superficies (tarjetas, modales)** | `#ffffff` | 255, 255, 255 | `--color-graphite` |
| **Superficies elevadas** | `#e9ebf0` | 233, 235, 240 | `--color-carbon` |
| **Acento suave / bordes** | `#647084` | 100, 112, 132 | `--color-steel` |
| **Texto principal (cuerpo)** | `#454b55` | 69, 75, 85 | `--color-silver` |
| **CTA / Fondos oscuros / Highlights** | `#16181d` | 22, 24, 29 | `--color-platinum` |
| **Texto máximo contraste** | `#0e1013` | 14, 16, 19 | `--color-ink` |
| **Hover CTA** | `#2b3038` | 43, 48, 56 | `--color-halo` |
| **Sombras** | `#8b93a1` | 139, 147, 161 | `--color-veil` |
| **Acento de marca** | — | — | *no se usa verde en claro* |

### Tema Oscuro (Dark)
| Uso | Hex | RGB | Variable CSS |
|-----|-----|-----|--------------|
| **Fondo principal** | `#0e0f12` | 14, 15, 18 | `--color-abyss` |
| **Superficies (tarjetas, modales)** | `#16181d` | 22, 24, 29 | `--color-graphite` |
| **Superficies elevadas** | `#1e2127` | 30, 33, 39 | `--color-carbon` |
| **Acento suave / bordes** | `#8b93a1` | 139, 147, 161 | `--color-steel` |
| **Texto principal (cuerpo)** | `#c5c8cf` | 197, 200, 207 | `--color-silver` |
| **CTA / Fondos claros / Highlights** | `#e9eaed` | 233, 234, 237 | `--color-platinum` |
| **Texto máximo contraste** | `#ffffff` | 255, 255, 255 | `--color-ink` |
| **Hover CTA** | `#ffffff` | 255, 255, 255 | `--color-halo` |
| **Sombras** | `#000000` | 0, 0, 0 | `--color-veil` |
| **Acento de marca (verde)** | `#06d6a0` | 6, 214, 160 | `--color-jade` / `--color-jade-soft` |

### Gradiente "Metal" (para títulos grandes / display)
Úsalo como relleno de texto (text-gradient) en herramientas que lo permitan:
```
160deg, 
  #16181d 10% (--metal-1 light) / #ffffff 10% (--metal-1 dark),
  #2b3038 35% (--metal-2 light) / #e9eaed 35% (--metal-2 dark),
  #454b55 55% (--metal-3 light) / #c5c8cf 55% (--metal-3 dark),
  #647084 100% (--metal-4 light) / #8b93a1 100% (--metal-4 dark)
```

---

## 💚 Acento de Marca — el verde `#06d6a0`

Es el **único color** de toda la identidad. Todo lo demás es la escala grafito/plata.

### Regla de oro: **el verde SOLO existe sobre fondo oscuro**

Sobre blanco el `#06d6a0` da **1.9:1** de contraste (el mínimo legible es 4.5:1): se lava y se pierde. Por eso en la web el tema claro **no lleva verde** — cada uso cae en su neutro (`--color-ink` para texto e iconos, `--color-steel` para bordes y marcas).

| Pieza | ¿Lleva verde? |
|-------|---------------|
| Post, story o banner de **fondo oscuro** | ✅ Sí, `#06d6a0` |
| Pieza de **fondo claro/blanco** | ❌ No. Usa `--color-ink` (#0e1013) o `--color-steel` (#647084) |
| Impresión, merchandising claro | ❌ No, mismo criterio |

### Dónde va el verde (y dónde no)

El acento es **exclusivo y escaso**: en reposo casi no se ve. En la web aparece sobre todo al interactuar.

✅ **Sí:**
- El **`KODE`** del logotipo (`WIND` en blanco + `KODE` en verde)
- Detalles pequeños: un punto, una línea, un icono suelto, un glifo `< / >`
- Estados: hover de tarjetas e iconos, foco de formularios, elemento activo
- Halos y resplandores suaves (`rgba(6, 214, 160, 0.22)`)

❌ **No:**
- Fondos de sección ni superficies grandes
- Títulos, texto corrido ni párrafos
- El CTA principal (ese va en `--color-platinum`)
- Más de un elemento verde por bloque visual

### Variantes en el código

| Token | Papel | En oscuro | En claro |
|-------|-------|-----------|----------|
| `--color-jade` | Primer plano: texto, iconos, hover, foco, activo | `#06d6a0` | `#0e1013` (= ink) |
| `--color-jade-soft` | Bordes y marcas: `KODE`, glifos, separadores | `#06d6a0` | `#647084` (= steel) |
| `--jade-glow` | Resplandor / halo de foco | `rgba(6,214,160,0.45)` | `rgba(100,112,132,0.35)` |

**En Canva/Figma:** guarda `#06d6a0` como color de marca y aplícalo solo en plantillas de fondo oscuro. Si necesitas una variante verde legible sobre blanco (evítalo salvo que sea imprescindible), oscurécela a `#007a5c` — mismo tono, 4.9:1 de contraste.

---

## 🔤 Tipografías

| Uso | Fuente | Fallback | Variable CSS |
|-----|--------|----------|--------------|
| **Títulos gigantes (Display)** | Bebas Neue | Impact, sans-serif | `--font-display` |
| **Títulos / Headlines** | Fraunces | Georgia, serif | `--font-headline` |
| **Texto de cuerpo / párrafos** | Inter | system-ui, sans-serif | `--font-body` |
| **Fallback general** | Roboto | Arial, sans-serif | `--font-roboto` |

**En Canva:** Busca "Bebas Neue", "Fraunces", "Inter". Si no están, usa:
- Display: **Anton** o **Oswald** (similares a Bebas Neue)
- Headlines: **Playfair Display** o **Merriweather** (similares a Fraunces)
- Body: **Inter** está en Canva nativamente

---

## 📝 Textos Clave (Copy Listo para Usar)

### Eslogan Principal
> **Software a medida con la agilidad del viento.**

### Value Props (3 pilares)
1. **Rápido** — Aplicaciones optimizadas que cargan en un abrir y cerrar de ojos.
2. **Seguro** — Código robusto y buenas prácticas desde el primer commit.
3. **Colaborativo** — Trabajo en equipo excepcional, contigo como parte del proceso.

### Hero / Landing
- **Kicker:** Software que impulsa tu negocio
- **Título:** Software a medida
- **Subtítulo:** Desarrollamos software a medida y automatizamos procesos con la agilidad del viento. Aplicaciones ligeras, veloces y accesibles, respaldadas por un código sólido y un trabajo en equipo excepcional.
- **CTA Principal:** Agenda ya
- **CTA Secundario:** Ver servicios *(el módulo de proyectos está desactivado; no lo uses en campañas)*

### Servicios (para posts de cada servicio)
| Servicio | Título Corto | Descripción Corta (1-2 líneas) |
|----------|--------------|--------------------------------|
| Web & Móvil | Desarrollo Web y Móvil | Apps y plataformas ligeras, rápidas y accesibles en cualquier dispositivo. |
| IA & Automatización | Automatización e IA | Eliminamos tareas manuales con procesos automáticos y agentes IA 24/7. |
| APIs | APIs e Integraciones | Conectamos tus herramientas para que la información fluya sin barreras. |
| Cloud | Migraciones y Modernización | Llevamos sistemas legacy a la nube: más seguros, eficientes y escalables. |
| Consultoría | Consultoría Tecnológica | Te guiamos en la ruta tecnológica más rápida para tu transformación digital. |

### Proceso (6 fases — ideal para carousel)
1. **Descubrimiento** (1–2 sem) → Documento de alcance y propuesta
2. **Diseño** (1–2 sem) → Prototipo navegable
3. **Desarrollo** (3–8 sem) → Versión funcional cada sprint
4. **Pruebas QA** (Continuo) → Reporte de calidad
5. **Despliegue** (1 sem) → Producto en producción
6. **Evolución** (Continuo) → Mejora continua y soporte

### Contacto / CTA
- **Email:** windkode@gmail.com
- **WhatsApp:** +591 75904262 (wa.me/59175904262)
- **Mensaje WhatsApp predeterminado:** "Hola WindKode 👋 Me gustaría hacer una consulta sobre un proyecto de software."
- **Asunto email:** "Solicitud de proyecto — WindKode"

### Redes Sociales
- **Instagram:** @windkode → https://www.instagram.com/windkode/
- **Facebook:** WindKode → https://www.facebook.com/share/1B9j2nfj35/
- **LinkedIn:** WindKode → https://www.linkedin.com/company/windkode/

### Hashtags Sugeridos
`#WindKode #SoftwareAMedida #DesarrolloWeb #Automatizacion #IA #TransformacionDigital #StartupBolivia #TechBolivia #CustomSoftware #AgileDevelopment`

---

## 🖼️ Assets de Marca

### Logo
- **Archivo:** `src/assets/svg/W-logo.svg` (vectorial, monocromático)
- **Uso:** Hereda `currentColor` → funciona sobre cualquier fondo (claro u oscuro)
- **Versiones necesarias para redes:**
  - Logo completo (icono + wordmark si existe)
  - Solo isotipo (la "W" estilizada) para avatar/favicon
  - Versión blanca (sobre fondos oscuros)
  - Versión oscura `--color-ink` (sobre fondos claros)
- **Wordmark:** `WIND` + `KODE` en Bebas Neue, `tracking` 0.18em, todo en mayúsculas
  - Sobre oscuro: `WIND` en `--color-ink` + **`KODE` en `#06d6a0`**
  - Sobre claro: `WIND` en `--color-ink` + `KODE` en `--color-steel` (sin verde)

### Iconos Sociales (estilo outline, stroke 1.5)
- **Instagram:** Rectángulo redondeado + círculo + punto
- **Facebook:** "f" en contenedor cuadrado redondeado
- **LinkedIn:** "in" en contenedor cuadrado redondeado
- **WhatsApp:** Burbuja de chat con teléfono (archivo: `src/components/ui/WhatsAppIcon.vue`)

Están en `src/components/ui/SocialIcon.vue` y `WhatsAppIcon.vue` — son SVG inline, heredan color.

### Pieza gráfica de marca (lista para publicar)
- **Vector:** `src/assets/svg/poster-marca.svg` — 1080×1350 (formato 4:5, el de feed de Instagram)
- **Export:** `src/assets/poster-marca.png` — mismo tamaño, listo para subir
- Es autocontenido: lleva Bebas Neue e Inter incrustadas, así que se ve igual en cualquier equipo aunque no tenga las fuentes instaladas
- Sirve de **plantilla de referencia**: fondo `--color-abyss`, titular con gradiente metal, onda y esfera en `#06d6a0`, CTA tipo pill con borde, y el `KODE` en verde
- Para variar el mensaje, edita el SVG (es XML legible y comentado) y re-exporta a PNG

---

## 📐 Plantillas Canva Sugeridas

### 1. Post Tipo "Servicio" (1080x1080)
- **Fondo:** `--color-abyss` (light) / `--color-abyss` (dark)
- **Tarjeta central:** `--color-graphite` con sombra `--color-veil`
- **Título servicio:** Bebas Neue / `--color-ink` / 48-60pt
- **Descripción:** Inter / `--color-silver` / 18-20pt
- **CTA botón:** `--color-platinum` fondo + `--color-ink` texto (light) / `--color-platinum` fondo + `--color-ink` texto (dark)
- **Logo esquina:** WLogo en `--color-ink` o blanco según contraste
- **Acento:** solo si el fondo es oscuro — un detalle en `#06d6a0` (el icono del servicio o una línea), nunca el título entero

### 2. Carousel Proceso (1080x1080 x 6 slides)
- Slide 1: Título "Nuestro proceso" + subtítulo
- Slides 2-7: Cada fase (número grande en `--metal-1` gradient, título, descripción, duración)
- **Acento:** sobre fondo oscuro, marca en `#06d6a0` solo la fase actual (un punto o el número) — el resto en gris
- Último slide: CTA "¿Empezamos?" + contact info

### 3. Story/Reel Cover (1080x1920)
- Fondo con gradiente sutil `--color-abyss` → `--color-carbon`
- Título gigante en Bebas Neue con gradiente `--metal-*`
- Subtítulo en Fraunces/Inter
- Una línea o curva en `#06d6a0` cruzando el fondo (ver `poster-marca.svg`)
- Logo centrado abajo

### 4. LinkedIn Article Banner (1200x627)
- Fondo `--color-graphite` (light) / `--color-graphite` (dark)
- Título en gradiente metal
- Tagline en `--color-silver`
- Logo esquina inferior derecha

---

## ✅ Checklist Rápido para Cada Post

- [ ] Usar paleta correcta (light/dark según contexto)
- [ ] Tipografías: Bebas Neue (display), Fraunces (headline), Inter (body)
- [ ] Logo en versión correcta (monocromático, hereda color)
- [ ] Verde `#06d6a0` **solo si el fondo es oscuro**, y solo en detalles (nunca en fondos ni en párrafos)
- [ ] CTA claro: "Agenda ya" + link WhatsApp/email
- [ ] Hashtags relevantes (3-5 máx)
- [ ] Alt text en imágenes para accesibilidad
- [ ] Revisar ortografía (ES/EN según audiencia)

---

## 📁 Archivos Fuente en el Repo

| Archivo | Qué contiene |
|---------|--------------|
| `src/assets/main.css` | Tokens de color, tipografía, animaciones (fuente única) |
| `src/config/contact.ts` | Email, WhatsApp, links sociales |
| `src/i18n/locales/es.json` | Todos los textos en español |
| `src/i18n/locales/en.json` | Todos los textos en inglés |
| `src/assets/svg/W-logo.svg` | Logo vectorial |
| `src/assets/svg/poster-marca.svg` | Pieza 1080×1350 con fuentes incrustadas (editable) |
| `src/assets/poster-marca.png` | Export de la pieza, listo para redes |
| `src/components/ui/WLogo.vue` | Componente logo (hereda currentColor) |
| `src/components/ui/SocialIcon.vue` | Iconos redes (outline, stroke) |
| `src/components/ui/WhatsAppIcon.vue` | Icono WhatsApp |

---

**Última actualización:** 17 de septiembre de 2026  
**Versión:** 1.1 — Basada en `src/assets/main.css` y `src/i18n/locales/es.json`

**Cambios en la 1.1:** se incorpora el acento de marca `#06d6a0` (verde del `KODE`) con su regla de uso —solo sobre fondo oscuro—, la pieza `poster-marca`, y se corrige el CTA secundario del hero.
