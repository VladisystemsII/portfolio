(function () {
  document.addEventListener('headerListo', function () {
    const projectId = document.body.getAttribute('data-project-id');
    if (!projectId) return;

    const badge = document.createElement('div');
    badge.classList.add('project-badge');
    badge.innerHTML =
      '<span class="project-badge__label">Proyecto</span>' +
      '<span class="project-badge__sep">·</span>' +
      '<span class="project-badge__code">' + projectId + '</span>';

    const headerInner = document.querySelector('header > div');
    if (headerInner) {
      headerInner.appendChild(badge);
    }
  });
})();
