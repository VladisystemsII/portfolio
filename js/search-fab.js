/* ============================================================
   VLADISYSTEMS · SEARCH FAB JS
   Lupa flotante global — funciona en cualquier página.

   REQUISITOS:
   1. glosario-data.js cargado antes que este archivo
   2. search-fab.css incluido en el <head>

   USO EN PÁGINAS RAÍZ (index.html):
     <link rel="stylesheet" href="css/search-fab.css">
     <script src="js/glosario-data.js"></script>
     <script src="js/search-fab.js"></script>

   USO EN projects/p-xxx/:
     <link rel="stylesheet" href="../../css/search-fab.css">
     <script src="../../js/glosario-data.js"></script>
     <script src="../../js/search-fab.js"></script>

   USO EN glosario/:
     <link rel="stylesheet" href="../css/search-fab.css">
     <script src="../js/glosario-data.js"></script>
     <script src="../js/search-fab.js"></script>

   CONFIGURACIÓN:
   Antes de cargar este script puedes definir:
     window.GLOSARIO_URL = '../glosario/glosario.html'; // ruta al glosario
============================================================ */

(function () {
  'use strict';

  /* --- Ruta al glosario.html (configurable por página) --- */
  function getGlosarioURL() {
    if (window.GLOSARIO_URL) return window.GLOSARIO_URL;
    // Detectar automáticamente según pathname
    const path = window.location.pathname;
    if (path.includes('/projects/')) return '../../glosario/glosario.html';
    if (path.includes('/connects/')) return '../glosario/glosario.html';
    if (path.includes('/glosario/')) return ''; // ya estamos aquí
    return 'glosario/glosario.html'; // raíz
  }

  /* --- Helpers --- */
  function normalize(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /* --- Inyectar HTML de la lupa y el panel --- */
  function injectHTML() {
    const fab = document.createElement('div');
    fab.id = 'searchFab';
    fab.title = 'Buscar en el glosario';
    fab.innerHTML = `
      <svg id="fabSearchIcon" width="30" height="30" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="22" y2="22"/>
      </svg>
      <svg id="fabCloseIcon" width="30" height="30" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <line x1="4" y1="4" x2="20" y2="20"/>
        <line x1="20" y1="4" x2="4" y2="20"/>
      </svg>
    `;

    const panel = document.createElement('div');
    panel.id = 'searchFabPanel';
    panel.innerHTML = `
      <input
        id="searchFabInput"
        type="text"
        placeholder="BUSCAR TÉRMINO..."
        autocomplete="off"
      />
      <div id="searchFabSuggestions"></div>
      <div class="fab-panel-footer">GLOSARIO VLADISYSTEMS · ${GLOSARIO.length} TÉRMINOS</div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
  }

  /* --- Lógica principal --- */
  function init() {
    if (typeof GLOSARIO === 'undefined') {
      console.warn('search-fab.js: GLOSARIO no está definido. ¿Cargaste glosario-data.js?');
      return;
    }

    injectHTML();

    const fab         = document.getElementById('searchFab');
    const panel       = document.getElementById('searchFabPanel');
    const input       = document.getElementById('searchFabInput');
    const suggestions = document.getElementById('searchFabSuggestions');
    const iconSearch  = document.getElementById('fabSearchIcon');
    const iconClose   = document.getElementById('fabCloseIcon');
    const glosarioURL = getGlosarioURL();
    const enGlosario  = glosarioURL === '';

    /* Abrir / cerrar panel */
    fab.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = panel.classList.contains('open');
      if (isOpen) {
        closeFab();
      } else {
        panel.classList.add('open');
        fab.classList.add('open');
        iconSearch.style.display = 'none';
        iconClose.style.display  = 'block';
        setTimeout(() => input.focus(), 50);
      }
    });

    function closeFab() {
      panel.classList.remove('open');
      fab.classList.remove('open');
      iconSearch.style.display = 'block';
      iconClose.style.display  = 'none';
      input.value = '';
      suggestions.innerHTML = '';
    }

    /* Cerrar al tocar fuera */
    document.addEventListener('click', e => {
      if (!fab.contains(e.target) && !panel.contains(e.target)) closeFab();
    });

    /* ESC para cerrar */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeFab();
    });

    /* Búsqueda predictiva */
    input.addEventListener('input', () => {
      const raw = input.value.trim();
      if (!raw) { suggestions.innerHTML = ''; return; }
      const q = normalize(raw);

      const matches = GLOSARIO.filter(t =>
        normalize(t['TÉRMINO']).includes(q) ||
        normalize(t['DEFINICIÓN']).includes(q) ||
        normalize(t['TRADUCCIÓN / EQUIVALENCIA']).includes(q)
      ).slice(0, 8);

      if (!matches.length) {
        suggestions.innerHTML = `<div class="fab-sug-empty">Sin resultados para "${raw}"</div>`;
        return;
      }

      suggestions.innerHTML = matches.map(t => `
        <div class="fab-suggestion" data-term="${encodeURIComponent(t['TÉRMINO'])}">
          <div class="fab-sug-term">${t['TÉRMINO']}</div>
          <div class="fab-sug-cat">${t['CATEGORÍA']} · ${t['NIVEL TÉCNICO']}</div>
        </div>
      `).join('');

      suggestions.querySelectorAll('.fab-suggestion').forEach(item => {
        item.addEventListener('click', () => {
          const termEncoded = item.dataset.term;
          closeFab();

          if (enGlosario) {
            /* Ya estamos en glosario.html — abrir modal directo */
            const termName = decodeURIComponent(termEncoded);
            if (typeof openModal === 'function' && typeof GLOSARIO !== 'undefined') {
              const data = GLOSARIO.find(t => t['TÉRMINO'] === termName);
              if (data) openModal(data);
            }
          } else {
            /* Navegar al glosario con el término en la URL */
            window.location.href = `${glosarioURL}?term=${termEncoded}`;
          }
        });
      });
    });
  }

  /* --- Esperar DOM --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
