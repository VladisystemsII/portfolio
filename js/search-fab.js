/* ============================================================
   VLADISYSTEMS · SEARCH FAB — MÓDULO AUTÓNOMO
   IDs alineados con search-fab.css existente.
============================================================ */

(function () {
  'use strict';

  function norm(str) {
    return (str || '').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function epsClass(txt) {
    const t = txt.toLowerCase();
    if (t.includes('entrada')) return 'sf-eps-e';
    if (t.includes('proceso')) return 'sf-eps-p';
    if (t.includes('salida'))  return 'sf-eps-s';
    return 'sf-eps-o';
  }

  function renderEPS(str) {
    return (str || '').split(/[→·\/]/)
      .map(s => s.trim()).filter(Boolean)
      .map(s => `<span class="sf-eps ${epsClass(s)}">${s}</span>`)
      .join('');
  }

  /* ── ESTILOS DEL MODAL (solo el modal, el resto está en search-fab.css) ── */
  function injectModalStyles() {
    if (document.getElementById('sf-modal-styles')) return;
    const s = document.createElement('style');
    s.id = 'sf-modal-styles';
    s.textContent = `
      .sf-eps{display:inline-block;font-family:'IBM Plex Mono',monospace;
        font-size:.65rem;letter-spacing:.1em;padding:4px 10px;
        border:1px solid;margin:0 4px 4px 0;}
      .sf-eps-e{border-color:#2fa890;color:#2fa890;}
      .sf-eps-p{border-color:#3a8fd0;color:#3a8fd0;}
      .sf-eps-s{border-color:#f0a830;color:#f0a830;}
      .sf-eps-o{border-color:#888;color:#888;}
      #sf-modal{position:fixed;inset:0;z-index:999999;
        background:rgba(0,0,0,.92);display:none;
        align-items:center;justify-content:center;
        padding:1.5rem;cursor:pointer;overflow-y:auto;}
      #sf-modal.open{display:flex;}
      #sf-modal-inner{background:#111;color:#fff;width:100%;
        max-width:1100px;cursor:default;position:relative;
        animation:sfIn .25s ease;}
      @keyframes sfIn{
        from{opacity:0;transform:translateY(20px) scale(.98)}
        to{opacity:1;transform:translateY(0) scale(1)}
      }
      #sf-modal-head{padding:2.5rem 3rem 2rem;
        border-bottom:1px solid rgba(255,255,255,.12);
        display:flex;align-items:flex-start;
        justify-content:space-between;gap:2rem;}
      #sf-modal-name{font-family:'Oswald',sans-serif;
        font-size:clamp(2rem,5vw,3.5rem);font-weight:700;
        letter-spacing:-.03em;text-transform:uppercase;
        line-height:1;color:#fff;}
      #sf-modal-badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:.8rem;}
      .sf-badge{font-family:'IBM Plex Mono',monospace;font-size:.6rem;
        letter-spacing:.15em;text-transform:uppercase;
        padding:3px 8px;border:1px solid currentColor;}
      #sf-modal-close{font-family:'IBM Plex Mono',monospace;font-size:1.4rem;
        color:#666;background:none;border:none;cursor:pointer;
        flex-shrink:0;padding:4px;transition:color .2s;}
      #sf-modal-close:hover{color:#9d3d22;}
      #sf-modal-body{padding:2.5rem 3rem;display:grid;
        grid-template-columns:1.4fr 1fr 1fr;gap:2rem 3rem;}
      .sf-col{display:flex;flex-direction:column;gap:10px;}
      .sf-col.s3{grid-column:span 3;padding-top:1.5rem;
        border-top:1px solid rgba(255,255,255,.08);}
      .sf-col.s2{grid-column:span 2;}
      .sf-label{font-family:'IBM Plex Mono',monospace;font-size:.72rem;
        letter-spacing:.35em;text-transform:uppercase;color:#9d3d22;}
      .sf-val{font-family:'Oswald',sans-serif;font-size:1.25rem;
        font-weight:300;line-height:1.65;color:#ccc;}
      .sf-val.def{font-size:1.5rem;font-weight:400;color:#eee;}
      .sf-val.equiv{font-family:'IBM Plex Mono',monospace;
        font-size:1rem;color:#888;line-height:1.7;}
      @media(max-width:900px){
        #sf-modal-body{grid-template-columns:1fr 1fr;}
        .sf-col.s3,.sf-col.s2{grid-column:span 2;}
      }
      @media(max-width:600px){
        #sf-modal{align-items:flex-start;}
        #sf-modal-head{padding:1.5rem;}
        #sf-modal-body{grid-template-columns:1fr;padding:1.5rem;gap:1.5rem;}
        .sf-col.s3,.sf-col.s2{grid-column:span 1;}
        #sf-modal-name{font-size:1.7rem;}
      }
      @media (max-width: 480px) {
        #searchFabPanel { right: 1rem; bottom: 6rem; width: calc(100vw - 2rem); }
        #searchFab      { right: 1rem; bottom: 1.5rem; }
        #sf-modal       { align-items: flex-start; }
      }
    `;
    document.head.appendChild(s);
  }

  /* ── INYECTAR HTML ── */
  function injectHTML() {
    /* FAB — mismo ID que search-fab.css */
    const fab = document.createElement('div');
    fab.id = 'searchFab';
    fab.title = 'Buscar en el glosario';
    fab.innerHTML = `
      <svg id="sf-ico-search" width="30" height="30" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16.5" y1="16.5" x2="22" y2="22"/>
      </svg>
      <svg id="sf-ico-close" width="30" height="30" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round" style="display:none">
        <line x1="4" y1="4" x2="20" y2="20"/>
        <line x1="20" y1="4" x2="4" y2="20"/>
      </svg>`;

    /* PANEL — mismo ID que search-fab.css */
    const panel = document.createElement('div');
    panel.id = 'searchFabPanel';
    panel.innerHTML = `
      <input id="searchFabInput" type="text"
        placeholder="BUSCAR TÉRMINO, DEFINICIÓN..." autocomplete="off"/>
      <div id="searchFabSuggestions"></div>
      <div class="fab-panel-footer">GLOSARIO VLADISYSTEMS · ${GLOSARIO.length} TÉRMINOS</div>`;

    /* MODAL */
    const modal = document.createElement('div');
    modal.id = 'sf-modal';
    modal.innerHTML = `
      <div id="sf-modal-inner">
        <div id="sf-modal-head">
          <div>
            <div id="sf-modal-name"></div>
            <div id="sf-modal-badges"></div>
          </div>
          <button id="sf-modal-close">✕</button>
        </div>
        <div id="sf-modal-body"></div>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);
    document.body.appendChild(modal);
  }

  /* ── MODAL ── */
  function openModal(t) {
    document.getElementById('sf-modal-name').textContent = t['TÉRMINO'];
    document.getElementById('sf-modal-badges').innerHTML =
      `<span class="sf-badge" style="color:#c4613d;border-color:#c4613d">${t['CATEGORÍA']}</span>
       <span class="sf-badge" style="color:#888;border-color:#888">${t['NIVEL TÉCNICO']}</span>`;
    document.getElementById('sf-modal-body').innerHTML = `
      <div class="sf-col s3">
        <div class="sf-label">Definición</div>
        <div class="sf-val def">${t['DEFINICIÓN']}</div>
      </div>
      <div class="sf-col">
        <div class="sf-label">Características</div>
        <div class="sf-val">${t['CARACTERÍSTICAS']}</div>
      </div>
      <div class="sf-col">
        <div class="sf-label">Entorno</div>
        <div class="sf-val">${t['ENTORNO']}</div>
      </div>
      <div class="sf-col">
        <div class="sf-label">Ejemplos</div>
        <div class="sf-val">${t['EJEMPLOS']}</div>
      </div>
      <div class="sf-col s2">
        <div class="sf-label">Flujo · Entrada / Proceso / Salida</div>
        <div class="sf-val">${renderEPS(t['ENTRADA / PROCESO / SALIDA'])}</div>
      </div>
      <div class="sf-col">
        <div class="sf-label">Traducción / Equivalencia</div>
        <div class="sf-val equiv">${t['TRADUCCIÓN / EQUIVALENCIA']}</div>
      </div>`;
    document.getElementById('sf-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('sf-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── INIT ── */
  function init() {
    if (typeof GLOSARIO === 'undefined') {
      console.warn('search-fab.js: GLOSARIO no definido.');
      return;
    }

    injectModalStyles();
    injectHTML();

    const fab   = document.getElementById('searchFab');
    const panel = document.getElementById('searchFabPanel');
    const input = document.getElementById('searchFabInput');
    const sugg  = document.getElementById('searchFabSuggestions');
    const icoS  = document.getElementById('sf-ico-search');
    const icoC  = document.getElementById('sf-ico-close');

    function closePanel() {
      panel.classList.remove('open');
      fab.classList.remove('open');
      icoS.style.display = 'block';
      icoC.style.display = 'none';
      input.value = '';
      sugg.innerHTML = '';
    }

    fab.addEventListener('click', function(e) {
      e.stopPropagation();
      if (panel.classList.contains('open')) {
        closePanel();
      } else {
        panel.classList.add('open');
        fab.classList.add('open');
        icoS.style.display = 'none';
        icoC.style.display = 'block';
        setTimeout(function(){ input.focus(); }, 50);
      }
    });

    document.addEventListener('click', function(e) {
      if (!fab.contains(e.target) && !panel.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { closePanel(); closeModal(); }
    });

    document.getElementById('sf-modal').addEventListener('click', closeModal);
    document.getElementById('sf-modal-inner').addEventListener('click', function(e){
      e.stopPropagation();
    });
    document.getElementById('sf-modal-close').addEventListener('click', closeModal);

    input.addEventListener('input', function() {
      var raw = input.value.trim();
      if (!raw) { sugg.innerHTML = ''; return; }
      var q = norm(raw);

      var matches = GLOSARIO.filter(function(t) {
        return norm(t['TÉRMINO']).includes(q) ||
               norm(t['DEFINICIÓN']).includes(q) ||
               norm(t['TRADUCCIÓN / EQUIVALENCIA']).includes(q);
      }).slice(0, 8);

      if (!matches.length) {
        sugg.innerHTML = '<div class="fab-sug-empty">Sin resultados para "' + raw + '"</div>';
        return;
      }

      sugg.innerHTML = matches.map(function(t) {
        return '<div class="fab-suggestion" data-term="' + t['TÉRMINO'].replace(/"/g,'&quot;') + '">' +
               '<div class="fab-sug-term">' + t['TÉRMINO'] + '</div>' +
               '<div class="fab-sug-cat">' + t['CATEGORÍA'] + ' · ' + t['NIVEL TÉCNICO'] + '</div>' +
               '</div>';
      }).join('');

      sugg.querySelectorAll('.fab-suggestion').forEach(function(item) {
        item.addEventListener('click', function() {
          var nombre = item.getAttribute('data-term');
          var data = null;
          for (var i = 0; i < GLOSARIO.length; i++) {
            if (GLOSARIO[i]['TÉRMINO'] === nombre) { data = GLOSARIO[i]; break; }
          }
          closePanel();
          if (data) openModal(data);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
