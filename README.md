# WindKode Portfolio

> **Desarrollamos software a medida y automatizamos procesos con la agilidad del viento.**
> En WindKode entregamos aplicaciones ligeras, veloces y accesibles que resuelven las necesidades específicas de cada usuario, respaldadas por un código sólido y un trabajo en equipo excepcional.

## Stack

| Tecnología                                     | Uso                          |
| ---------------------------------------------- | ---------------------------- |
| **Vue 3** (Composition API + `<script setup>`) | Framework UI                 |
| **TypeScript**                                 | Tipado estático              |
| **Vite 8**                                     | Bundler y dev server         |
| **TailwindCSS v4**                             | Estilos utilitarios          |
| **Vue Router 4**                               | Enrutamiento SPA             |
| **Pinia**                                      | Estado global                |
| **vue-i18n v11**                               | Internacionalización (ES/EN) |

## Arquitectura

```
front/
├── public/                  # Archivos estáticos
├── src/
│   ├── assets/              # Estilos e imágenes
│   ├── components/
│   │   ├── ui/              # Componentes base atómicos (Button, Card, Badge)
│   │   ├── layout/          # Layout global (Navbar, Footer, Section)
│   │   └── shared/          # Componentes de negocio (ProjectCard, ContactForm)
│   ├── composables/         # Lógica reactiva reutilizable
│   ├── i18n/                # Internacionalización
│   │   ├── index.ts         # Configuración de vue-i18n
│   │   └── locales/         # Traducciones ES/EN
│   ├── router/              # Definición de rutas
│   ├── services/            # Capa de datos (API / mock)
│   ├── stores/              # Estado global (Pinia)
│   ├── types/               # Interfaces y tipos TS
│   └── views/               # Páginas (Home, Projects, Contact)
├── .env.example
├── index.html
├── vite.config.ts
└── tsconfig*.json
```

**Flujo de datos:** `View → Composable → Service → Store`  
**Componentes:** solo reciben `props` y emiten eventos. Sin lógica de negocio.

## Internacionalización (i18n)

Soporte para **español** e **inglés** usando `vue-i18n v11` con Composition API.

### Estructura

```
src/i18n/
├── index.ts           # createI18n con locale desde localStorage
└── locales/
    ├── es.json        # Traducciones en español
    └── en.json        # Traducciones en inglés
```

### Funcionamiento

- El idioma se guarda en `localStorage` y persiste entre sesiones.
- Al cambiar de idioma se actualiza automáticamente el atributo `<html lang>`.
- El botón **ES/EN** en la Navbar permite alternar entre idiomas al instante.
- Por defecto se carga español (`es`).

### Uso en componentes

```ts
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <p>{{ t('hero.badge') }}</p>
</template>
```

### Claves de traducción

Agrupadas por ámbito: `nav`, `hero`, `section`, `filosofia`, `proyectos`, `proyecto`, `contacto`, `formulario`, `footer`, `meta`, `projects_data`.

Ejemplo:

```json
{
  "nav": {
    "inicio": "Inicio",
    "proyectos": "Proyectos",
    "contacto": "Contacto"
  }
}
```

Los datos mock de proyectos también usan i18n para mostrarse en el idioma activo.

## Scripts

```sh
npm run dev       # Desarrollo con hot-reload
npm run build     # Type-check + build producción
npm run preview   # Vista previa del build
npm run type-check # Solo type-check
```

## Misión

> Desarrollar software a medida y automatizar procesos con la agilidad del viento. En WindKode, entregamos aplicaciones ligeras, veloces y accesibles que resuelven las necesidades específicas de cada usuario, respaldadas por un código sólido y un trabajo en equipo excepcional.

## Contacto (WhatsApp + formulario por correo)

- **Datos**: `src/config/contact.ts` (correo `windkode@gmail.com`, WhatsApp `+591 7590262`). Se pueden sobreescribir con `VITE_CONTACT_EMAIL` y `VITE_WHATSAPP_NUMBER` (ver `.env.example`).
- **WhatsApp**: enlace `wa.me` con mensaje predeterminado (clave i18n `contacto.whatsapp_mensaje`), visible en `/agenda`, el footer y el banner de CTA.
- **Formulario**: al pulsar "Enviar" se abre el cliente de correo del visitante con un `mailto:` a `windkode@gmail.com`, asunto y cuerpo ya redactados. No hay backend ni credenciales que configurar.
