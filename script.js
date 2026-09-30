// Single orchestrated reveal: the hero code panel types in on load, once.
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const codeEl = document.querySelector('.code-body code');
  if (!codeEl || prefersReduced) return;

  const full = codeEl.innerHTML;
  const cursorMatch = full.match(/<span class="cursor">[^<]*<\/span>/);
  const cursorHtml = cursorMatch ? cursorMatch[0] : '';
  const withoutCursor = cursorHtml ? full.replace(cursorHtml, '') : full;

  // Split into tag-safe chunks so we never cut inside an HTML tag.
  const chunks = withoutCursor.match(/<[^>]+>|[^<]/g) || [];
  codeEl.innerHTML = '';
  let i = 0;

  function step() {
    if (i >= chunks.length) {
      codeEl.insertAdjacentHTML('beforeend', cursorHtml);
      return;
    }
    codeEl.insertAdjacentHTML('beforeend', chunks[i]);
    i += 1;
    requestAnimationFrame(() => setTimeout(step, 6));
  }

  requestAnimationFrame(() => setTimeout(step, 250));
})();

// Reveal sections as they enter the viewport.
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (prefersReduced || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
})();
