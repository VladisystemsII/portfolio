// header-loader.js — Carga modules/header.html de forma dinámica.
// Detecta la profundidad REAL de la página ignorando el prefijo del repo
// de GitHub Pages (/portfolio/).
// Al terminar emite "headerListo" para que header.js y menu-mobile.js
// se inicialicen con el DOM del header ya disponible.

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('header-container');
  if (!container) return;

  // Base del repo en GitHub Pages
  const repoBase = '/portfolio';

  // Ruta relativa al repo (sin el prefijo /portfolio)
  const pathSinRepo = window.location.pathname.replace(repoBase, '') || '/';

  // Calcula profundidad real (segmentos de carpeta, sin contar el archivo)
  const partes = pathSinRepo.split('/').filter(Boolean);
  // Si el último segmento tiene punto (es un archivo .html), no cuenta como carpeta
  const esArchivo = partes.length > 0 && partes[partes.length - 1].includes('.');
  const depth = esArchivo ? partes.length - 1 : partes.length;

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
      container.querySelectorAll('[data-section]').forEach(function (link) {
        const section = link.getAttribute('data-section');
        if (depth > 0) {
          link.setAttribute('href', prefix + 'index.html#' + section);
        } else {
          link.setAttribute('href', '#' + section);
        }
      });

      document.dispatchEvent(new CustomEvent('headerListo'));
    })
    .catch(function (err) {
      console.error('❌ Error al cargar el header:', err);
    });
});
