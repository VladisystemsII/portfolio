/* ============================================================
   VLADISYSTEMS · TOOLTIP ENGINE v2
   Lee directamente desde glosario-data.js (variable GLOSARIO)
   
   USO EN CUALQUIER PÁGINA:
   <script src="../../js/glosario-data.js"></script>
   <script src="../../js/tooltips.js"></script>
   
   EXCLUIR UN BLOQUE:
   <div class="no-tooltip">Sin tooltips aquí</div>
   
   EXCLUIR TÉRMINOS GLOBALMENTE:
   const TOOLTIP_EXCLUDE = ["Portfolio", "GitHub"];
============================================================ */

(function () {
  'use strict';

  /* --- Estilos del tooltip --- */
  const STYLES = `
    .vlad-tooltip-term {
      border-bottom: 1.5px dotted #9d3d22;
      cursor: help;
      position: relative;
      text-decoration: none;
      transition: border-color .2s;
    }
    .vlad-tooltip-term:hover {
      border-bottom-color: #111;
    }
    #vlad-tooltip {
      position: fixed;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transform: translateY(6px);
      transition: opacity .18s ease, transform .18s ease;
      max-width: 420px;
      min-width: 280px;
    }
    #vlad-tooltip.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .vlad-tip-inner {
      background: #111;
      color: #fff;
      border: 1.5px solid #2a2a2a;
      padding: 14px 16px 12px;
      box-shadow: 0 12px 36px rgba(0,0,0,0.5);
    }
    .vlad-tip-term {
      font-family: 'Oswald', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: #fff;
      line-height: 1;
      margin-bottom: 5px;
    }
    .vlad-tip-cat {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.58rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #9d3d22;
      margin-bottom: 9px;
    }
    .vlad-tip-def {
      font-family: 'Oswald', sans-serif;
      font-size: 0.88rem;
      font-weight: 300;
      line-height: 1.55;
      color: #ccc;
      margin-bottom: 8px;
    }
    .vlad-tip-equiv {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 0.6rem;
      color: #555;
      line-height: 1.5;
      border-top: 1px solid #222;
      padding-top: 7px;
    }
    .vlad-tip-arrow {
      width: 0; height: 0;
      border-left: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid #111;
      position: absolute;
      bottom: -7px;
      left: 20px;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  /* --- Elemento tooltip --- */
  const tooltip = document.createElement('div');
  tooltip.id = 'vlad-tooltip';
  tooltip.innerHTML = `
    <div class="vlad-tip-inner">
      <div class="vlad-tip-term"  id="vtt-term"></div>
      <div class="vlad-tip-cat"   id="vtt-cat"></div>
      <div class="vlad-tip-def"   id="vtt-def"></div>
      <div class="vlad-tip-equiv" id="vtt-equiv"></div>
    </div>
    <div class="vlad-tip-arrow" id="vtt-arrow"></div>
  `;
  document.body.appendChild(tooltip);

  function init() {
    /* Espera que GLOSARIO esté disponible */
    if (typeof GLOSARIO === 'undefined') return;

    /* Términos excluidos */
    const excluded = (typeof TOOLTIP_EXCLUDE !== 'undefined')
      ? TOOLTIP_EXCLUDE.map(t => t.toLowerCase()) : [];

    const terms = GLOSARIO.filter(
      t => !excluded.includes(t['TÉRMINO'].toLowerCase())
    );

    /* Ordenar por longitud DESC → "SEO local" antes que "SEO" */
    terms.sort((a, b) => b['TÉRMINO'].length - a['TÉRMINO'].length);

    /* Mapa de búsqueda */
    const termMap = {};
    terms.forEach(t => { termMap[t['TÉRMINO'].toLowerCase()] = t; });

    /* Tags a ignorar */
    const SKIP_TAGS = new Set([
      'SCRIPT','STYLE','A','BUTTON','INPUT','TEXTAREA',
      'SELECT','CODE','PRE','H1','H2','H3','H4','H5','H6',
      'LABEL','NOSCRIPT','IFRAME'
    ]);

    function walkTextNodes(root) {
      const walker = document.createTreeWalker(
        root, NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const p = node.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
            if (p.closest('.no-tooltip')) return NodeFilter.FILTER_REJECT;
            if (p.classList.contains('vlad-tooltip-term')) return NodeFilter.FILTER_REJECT;
            if (node.textContent.trim() === '') return NodeFilter.FILTER_SKIP;
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );
      const nodes = [];
      let n;
      while ((n = walker.nextNode())) nodes.push(n);
      return nodes;
    }

    /* Regex con todos los términos */
    const escapedTerms = terms.map(t =>
      t['TÉRMINO'].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const regex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

    /* Solo primera ocurrencia por término por página */
    const markedTerms = new Set();

    function processNode(textNode) {
      const text = textNode.textContent;
      regex.lastIndex = 0;
      if (!regex.test(text)) return;
      regex.lastIndex = 0;

      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const key = match[0].toLowerCase();
        if (!termMap[key] || markedTerms.has(key)) continue;
        markedTerms.add(key);

        if (match.index > lastIndex) {
          frag.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
        }

        const span = document.createElement('span');
        span.className = 'vlad-tooltip-term';
        span.textContent = match[0];
        span.dataset.term = key;
        frag.appendChild(span);

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex === 0) return;
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      textNode.parentNode.replaceChild(frag, textNode);
    }

    walkTextNodes(document.body).forEach(processNode);

    /* --- Mostrar tooltip --- */
    let hideTimer = null;

    function showTooltip(span, data) {
      clearTimeout(hideTimer);

      /* Definición corta: primeras 120 chars de DEFINICIÓN */
      
        
        

      document.getElementById('vtt-term').textContent  = data['TÉRMINO'];
      document.getElementById('vtt-cat').textContent   = `${data['CATEGORÍA']} · ${data['NIVEL TÉCNICO']}`;
      document.getElementById('vtt-def').textContent   = data['DEFINICIÓN'];
      document.getElementById('vtt-equiv').textContent = data['TRADUCCIÓN / EQUIVALENCIA'];

      tooltip.classList.add('visible');
      positionTooltip(span);
    }

    function positionTooltip(span) {
      const rect   = span.getBoundingClientRect();
      const tipW   = tooltip.offsetWidth  || 320;
      const tipH   = tooltip.offsetHeight || 140;
      const margin = 12;
      const arrow  = document.getElementById('vtt-arrow');

      let left  = rect.left + rect.width / 2 - tipW / 2;
      let top   = rect.top - tipH - margin;
      let below = false;

      if (top < 8) { top = rect.bottom + margin; below = true; }
      if (left < 8) left = 8;
      if (left + tipW > window.innerWidth - 8) left = window.innerWidth - tipW - 8;

      tooltip.style.left = `${left}px`;
      tooltip.style.top  = `${top}px`;

      const arrowLeft = rect.left + rect.width / 2 - left - 7;
      arrow.style.left = `${Math.max(10, Math.min(arrowLeft, tipW - 24))}px`;

      if (below) {
        arrow.style.top = '-7px'; arrow.style.bottom = 'auto';
        arrow.style.borderTop = 'none'; arrow.style.borderBottom = '7px solid #111';
      } else {
        arrow.style.bottom = '-7px'; arrow.style.top = 'auto';
        arrow.style.borderBottom = 'none'; arrow.style.borderTop = '7px solid #111';
      }
    }

    function hideTooltip() {
      hideTimer = setTimeout(() => tooltip.classList.remove('visible'), 150);
    }

    /* Delegación de eventos */
    document.addEventListener('mouseover', e => {
      const span = e.target.closest('.vlad-tooltip-term');
      if (!span) return;
      const data = termMap[span.dataset.term];
      if (data) showTooltip(span, data);
    });

    document.addEventListener('mouseout', e => {
      if (e.target.closest('.vlad-tooltip-term')) hideTooltip();
    });

    /* Móvil */
    document.addEventListener('touchstart', e => {
      const span = e.target.closest('.vlad-tooltip-term');
      if (span) {
        e.preventDefault();
        const data = termMap[span.dataset.term];
        if (data) {
          tooltip.classList.contains('visible')
            ? tooltip.classList.remove('visible')
            : showTooltip(span, data);
        }
      } else {
        tooltip.classList.remove('visible');
      }
    }, { passive: false });

    window.addEventListener('scroll', () => tooltip.classList.remove('visible'), { passive: true });
    window.addEventListener('resize', () => tooltip.classList.remove('visible'), { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
