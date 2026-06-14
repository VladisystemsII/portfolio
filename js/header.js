// header.js — Marca el enlace activo del menú.
// En index.html: observa las secciones y marca el link correspondiente.
// En páginas internas (connects/, projects/): no marca nada,
// todos los links llevan de vuelta al index.

document.addEventListener('headerListo', function () {
  const esIndex =
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/');

  if (!esIndex) return;

  const menuLinks = document.querySelectorAll(
    '#header-container nav a[data-section], #header-container .mobile-menu a[data-section]'
  );

  const secciones = ['inicio', 'links', 'proyectos', 'contacto'];

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        menuLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('data-section') === id);
        });
      });
    },
    { threshold: 0.4 }
  );

  secciones.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
});
