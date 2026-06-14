// header-loader.js — Carga modules/header.html de forma dinámica.
// Detecta la profundidad de la página para calcular la ruta correcta.
// Al terminar emite "headerListo" para que header.js y menu-mobile.js
// se inicialicen con el DOM del header ya disponible.
// Orden de carga: header-loader.js → header.js → menu-mobile.js

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('header-container');
  if (!container) return;

  // Calcula el prefijo de ruta según profundidad de la página:
  // index.html                              → depth 0 → ""
  // connects/cv.html                        → depth 1 → "../"
  // connects/credenciales/certificados.html → depth 2 → "../../"
  // projects/p-xxx/p-xxx.html              → depth 2 → "../../"
  const depth = window.location.pathname
    .split('/')
    .filter(Boolean).length - 1;

  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const headerPath = prefix + 'modules/header.html';

  fetch(headerPath)
    .then(function (res) {
      if (!res.ok) throw new Error('No se pudo cargar ' + headerPath);
      return res.text();
    })
    .then(function (html) {
      container.innerHTML = html;

      // Ajustar href de todos los links según profundidad
      if (depth > 0) {
        container.querySelectorAll('[data-section]').forEach(function (link) {
          const section = link.getAttribute('data-section');
          link.setAttribute('href', prefix + 'index.html#' + section);
        });
      }

      document.dispatchEvent(new CustomEvent('headerListo'));
    })
    .catch(function (err) {
      console.error('❌ Error al cargar el header:', err);
    });
});
