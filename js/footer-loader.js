// footer-loader.js
// Carga modules/footer.html de forma dinámica.
// Detecta profundidad igual que header-loader.js

document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('footer-container');
  if (!container) return;

  const repoBase = '/portfolio';

  const pathSinRepo = window.location.pathname.replace(repoBase, '') || '/';

  const partes = pathSinRepo.split('/').filter(Boolean);

  const esArchivo =
    partes.length > 0 &&
    partes[partes.length - 1].includes('.');

  const depth = esArchivo
    ? partes.length - 1
    : partes.length;

  const prefix = depth > 0
    ? '../'.repeat(depth)
    : '';

  const footerPath = prefix + 'modules/footer.html';

  fetch(footerPath)
    .then(function (res) {
      if (!res.ok)
        throw new Error('No se pudo cargar ' + footerPath);

      return res.text();
    })
    .then(function (html) {
      container.innerHTML = html;
    })
    .catch(function (err) {
      console.error('❌ Error al cargar el footer:', err);
    });
});