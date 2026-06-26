// header-doc-loader.js — Carga modules/header-doc.html en páginas
// de DOCUMENTACIÓN. Variante de header-loader.js: mismo mecanismo
// de fetch + emisión de "headerListo", pero apuntando al header
// reducido (solo logo + botón "Volver al proyecto").
//
// Uso: en documentacion/index.html, reemplazar
//   <script src="../../../js/header-loader.js"></script>
// por:
//   <script src="../../../js/header-doc-loader.js"></script>
//
// El resto de scripts (header.js, project-tab.js) sigue funcionando
// igual, ya que ambos escuchan el mismo evento "headerListo" y
// buscan la misma estructura ("header > div").

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('header-container');
  if (!container) return;

  const repoBase = '/portfolio';
  const pathSinRepo = window.location.pathname.replace(repoBase, '') || '/';
  const partes = pathSinRepo.split('/').filter(Boolean);
  const esArchivo = partes.length > 0 && partes[partes.length - 1].includes('.');
  const depth = esArchivo ? partes.length - 1 : partes.length;

  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const headerPath = prefix + 'modules/header-doc.html';

  fetch(headerPath)
    .then(function (res) {
      if (!res.ok) throw new Error('No se pudo cargar ' + headerPath);
      return res.text();
    })
    .then(function (html) {
      container.innerHTML = html;

      // Calcular automáticamente el link "Volver al proyecto".
      // Estructura esperada: .../projects/p-NOMBRE/documentacion/index.html
      // El proyecto padre vive un nivel arriba: .../p-NOMBRE/p-NOMBRE.html
      const btn = document.getElementById('volverProyectoBtn');
      if (btn) {
        const segmentos = pathSinRepo.split('/').filter(Boolean);
        const idxDocumentacion = segmentos.indexOf('documentacion');
        if (idxDocumentacion > 0) {
          const nombreProyecto = segmentos[idxDocumentacion - 1]; // ej: "p-datastudio"
          btn.setAttribute('href', '../' + nombreProyecto + '.html');
        }
      }

      document.dispatchEvent(new CustomEvent('headerListo'));
    })
    .catch(function (err) {
      console.error('❌ Error al cargar el header de documentación:', err);
    });
});
