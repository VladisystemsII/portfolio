/* ============================================================
  VLADISYSTEMS — BADGE DE PROYECTO EN HEADER
  Archivo: project-tab.js
  Versión: 2.0

  Lee data-project-id del <body> y lo inyecta
  al centro del header existente.

  USO EN CADA PÁGINA DE PROYECTO:
    <body data-project-id="BC1166">
    <body data-project-id="BC1167">
    ... etc.

  No modifica la estructura del HTML —
  solo agrega el badge al div interno del header.
============================================================ */

(function () {
  const projectId = document.body.getAttribute('data-project-id');
  if (!projectId) return;

  // Crear el badge
  const badge = document.createElement('div');
  badge.classList.add('project-badge');
  badge.innerHTML =
    '<span class="project-badge__label">Proyecto</span>' +
    '<span class="project-badge__sep">·</span>' +
    '<span class="project-badge__code">' + projectId + '</span>';

  // Inyectar dentro del div interior del header (el que tiene flex justify-between)
  const headerInner = document.querySelector('header > div');
  if (headerInner) {
    headerInner.appendChild(badge);
  }
})();
