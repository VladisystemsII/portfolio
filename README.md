# VLADISYSTEMS — Portfolio

Documentación técnica del repositorio. Este archivo describe la arquitectura,
las convenciones de estructura y las reglas de decisión del proyecto, para que
cualquier persona (incluyendo el propio autor en el futuro) pueda entender
la lógica del sitio sin necesidad de inferirla del código.

---

## 1. Visión general

Portfolio profesional de Vladimir Alba (VLADISYSTEMS), construido como sitio
estático en HTML/CSS/JS, sin framework ni build step. Usa Tailwind CSS vía
CDN para utilidades de layout, y un sistema de diseño propio ("brutalista
editorial": bordes negros gruesos, tipografía Oswald + IBM Plex Mono, grid
de fondo decorativo, acento en rojo óxido) definido en `css/styles.css`.

El sitio combina tres tipos de contenido:

- **Proyectos** — sistemas/productos desarrollados (CRM, bots, dashboards).
- **Perfiles** — enlaces externos de presencia profesional (LinkedIn, GitHub,
  CV, Workana).
- **Documentación** — páginas narrativas extendidas que explican el proceso,
  análisis y arquitectura de un proyecto específico.

---

## 2. Estructura de carpetas

```
/
├── index.html                  Página principal del portfolio
├── connects/                   Perfiles externos y credenciales
│   ├── credenciales/
│   │   └── certificados/       PDFs y certificados (servidos por credenciales.html)
│   ├── credenciales.html       Vista que centraliza todos los certificados
│   ├── cv.html
│   ├── github.html
│   ├── linkedin.html
│   └── workana.html
├── css/
│   ├── styles.css              Sistema de diseño base (única fuente de verdad)
│   └── project-tab.css         Badge de header (Proyecto / Perfil / Documentación)
├── js/
│   ├── header-loader.js        Inyecta modules/header.html dinámicamente
│   ├── header.js                Marca el link activo del menú (solo en index)
│   ├── menu-mobile.js           Lógica del menú hamburguesa
│   ├── footer-loader.js         Inyecta modules/footer.html dinámicamente
│   ├── project-tab.js           Genera el badge en páginas de Proyecto/Documentación
│   └── profile-tab.js           Genera el badge en páginas de Perfil
├── modules/
│   ├── header.html              Header reutilizable, cargado por header-loader.js
│   └── footer.html              Footer reutilizable, cargado por footer-loader.js
└── projects/
    └── p-<nombre>/
        ├── p-<nombre>.html       Página del proyecto (si tiene demo/producto en vivo)
        └── documentacion/
            └── index.html        Página narrativa (solo si aplica, ver sección 4)
```

> **Nota de mantenimiento:** este árbol debe actualizarse cada vez que se
> agregue o elimine una carpeta de proyecto. Un mapa del sitio desactualizado
> es la causa más común de confusión al retomar el proyecto después de tiempo.

---

## 3. Sistema de header y badges

El header es un único componente (`modules/header.html`), cargado por
`header-loader.js` en todas las páginas vía `fetch`. Esto evita duplicar el
HTML del header en cada archivo.

Sobre ese header, cada página puede mostrar un **badge** contextual,
controlado por un atributo en el `<body>`:

| Tipo de página | Atributo en `<body>`          | Script requerido     | Texto resultante              |
|-----------------|-------------------------------|-----------------------|--------------------------------|
| Proyecto        | `data-project-id="BC1166"`    | `project-tab.js`      | `PROYECTO · BC1166`           |
| Documentación   | `data-project-id="DOCUMENTACIÓN · VLADCRM"` | `project-tab.js` | `DOCUMENTACIÓN · VLADCRM` |
| Perfil          | `data-profile="LINKEDIN"`     | `profile-tab.js`      | `Perfil · LINKEDIN`           |

Ambos scripts usan exactamente las mismas reglas CSS (definidas en
`project-tab.css`), por diseño — esto evita que un mismo componente visual
se comporte distinto según el tipo de página. Si se modifica el
comportamiento responsive de uno, debe verificarse el otro.

---

## 4. Regla de decisión: ¿cuándo un proyecto lleva `documentacion/`?

**Un proyecto incluye la subcarpeta `documentacion/` únicamente si no cuenta
con una página de producto en vivo (demo funcional) que ya cumpla ese rol
explicativo.**

- Si el proyecto **tiene** una página web/demo en producción
  (`p-bc1166.html`, `p-mastermenu.html`, `p-portal33.html`,
  `p-teamrealty.html`) — esa misma página funciona como la referencia
  comprensible para quien evalúa el producto. No se duplica con una
  carpeta de documentación adicional.

- Si el proyecto **no tiene** una demo en vivo accesible (`p-datastudio`,
  `p-vladcrm`, `p-vladibot`) — se construye `documentacion/index.html` como
  página narrativa extendida: resumen, problema, proceso de análisis,
  solución, arquitectura, código relevante, stack y resultados.

Esta regla evita contenido redundante y mantiene cada proyecto con
exactamente un punto de entrada explicativo.

---

## 5. Estructura interna de una página de Documentación

Cada `documentacion/index.html` sigue el mismo orden de secciones:

1. **Hero** — nombre del proyecto, descripción corta, ficha técnica.
2. **Resumen del proyecto**
3. **Problema (de negocio / a resolver)**
4. **Proceso de análisis** — razonamiento real detrás de las decisiones
   técnicas tomadas (por qué esta herramienta y no otra, qué alternativas
   se consideraron, qué aprendizaje previo se aplicó). Esta sección es la
   que diferencia el perfil de *analista de sistemas* del de solo
   *programador* — debe reflejar decisiones reales, nunca alternativas
   evaluadas que no ocurrieron.
5. **Solución implementada**
6. *(Secciones específicas del proyecto: arquitectura, módulos, código,
   capturas, según aplique)*
7. **Stack tecnológico**
8. **Resultados**
9. **Próximas mejoras / Roadmap**
10. **Recursos / Resultado destacado** — enlaces a repositorio, demo, y
    enlace de regreso al portfolio.

---

## 6. Convenciones de código

- **No se mezclan sistemas de CSS por página.** Cada página de Proyecto,
  Perfil o Documentación usa exclusivamente `css/styles.css` +
  `css/project-tab.css`. No se crean archivos CSS independientes por
  página — esa práctica generó duplicación e inconsistencias visuales
  en versiones anteriores del sitio.
- **Las rutas relativas dependen de la profundidad real de la carpeta.**
  Una página en `projects/p-nombre/documentacion/index.html` referencia
  los assets compartidos con `../../../` (tres niveles hasta la raíz).
- **Los bloques de código fuente** (COBOL, Python) dentro de una página de
  documentación pueden incluir un `<style>` propio acotado solo a la
  presentación de ese código (resaltado de sintaxis) — esto no infringe
  la regla anterior, porque no es un componente de layout del sistema,
  es contenido.

---

## 7. Próximos pasos pendientes (mantenimiento)

- [x] Confirmado: `footer.html` y `footer-loader.js` existen y están
      registrados en el mapa del sitio actualizado.
- [ ] Verificar que ningún PDF en `connects/credenciales/certificados/`
      quedó sin enlazar desde `credenciales.html`.
- [ ] Mantener este README actualizado cada vez que se agregue un nuevo
      proyecto, tipo de badge, o regla de decisión estructural.