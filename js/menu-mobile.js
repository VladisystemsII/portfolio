// menu-mobile.js — Menú hamburguesa | Portfolio Vladisystems
// Usa las clases .hamburger-btn, .mobile-menu y .open
// ya definidas en styles.css — NO agrega CSS propio.
// Escucha "headerListo" emitido por header-loader.js.

document.addEventListener('headerListo', function () {
  const btn  = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('mobileMenu');

  if (!btn || !menu) {
    console.error('❌ No se encontró hamburgerBtn o mobileMenu');
    return;
  }

  // Toggle al hacer clic en el botón
  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Cerrar al hacer clic en cualquier link del menú
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });

  // Cerrar al hacer clic fuera del menú
  document.addEventListener('click', function (e) {
    if (
      menu.classList.contains('open') &&
      !menu.contains(e.target) &&
      !btn.contains(e.target)
    ) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });

  // Cerrar al pasar a desktop (1024px, igual que styles.css)
  window.addEventListener('resize', function () {
    if (window.innerWidth > 1024) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
});
