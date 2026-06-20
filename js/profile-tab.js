// profile-tab.js — Badge de Perfil en header | Portfolio Vladisystems
// Reemplaza los <script> inline con estilos hardcodeados que tenía
// cada página de perfil (linkedin.html, workana.html, cv.html...).
// Usa el mismo CSS responsivo de profile-badge (en project-tab.css),
// así el comportamiento en mobile queda igual de resuelto que
// el badge de Proyecto.
//
// Uso: en el <body> de cada página de perfil, agregar:
//   <body data-profile="LINKEDIN">
//   <body data-profile="WORKANA">
//   <body data-profile="CV">

(function () {
  document.addEventListener('headerListo', function () {
    const profileId = document.body.getAttribute('data-profile');
    if (!profileId) return;

    const badge = document.createElement('div');
    badge.classList.add('profile-badge');
    badge.innerHTML =
      '<span class="profile-badge__label">Perfil</span>' +
      '<span class="profile-badge__sep">·</span>' +
      '<span class="profile-badge__code">' + profileId + '</span>';

    const headerInner = document.querySelector('header > div');
    if (headerInner) {
      headerInner.appendChild(badge);
    }
  });
})();
