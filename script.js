(function () {
  const order = ['home', 'about', 'resume', 'work', 'contact'];
  const sections = order.map((id) => document.querySelector(`.app-section[data-id="${id}"]`));
  const navIcons = document.querySelectorAll('.nav-icon');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let animating = false;

  function goTo(index, { push = true } = {}) {
    if (index === current || animating) return;
    const direction = index > current ? 'next' : 'prev';
    const outSection = sections[current];
    const inSection = sections[index];

    animating = true;

    outSection.classList.remove('active');
    outSection.classList.add(direction === 'next' ? 'leaving-next' : 'leaving-prev');

    inSection.classList.remove('leaving-next', 'leaving-prev');
    inSection.style.transform = direction === 'next' ? 'translateX(40px)' : 'translateX(-40px)';
    inSection.style.visibility = 'visible';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        inSection.classList.add('active');
        inSection.style.transform = '';
      });
    });

    navIcons.forEach((icon) => icon.classList.toggle('active', icon.dataset.id === order[index]));

    const settle = () => {
      outSection.classList.remove('leaving-next', 'leaving-prev');
      outSection.style.visibility = 'hidden';
      animating = false;
    };

    if (prefersReduced) {
      settle();
    } else {
      setTimeout(settle, 460);
    }

    current = index;
    if (push) history.replaceState(null, '', `#${order[index]}`);
  }

  navIcons.forEach((icon) => {
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      const idx = order.indexOf(icon.dataset.id);
      if (idx !== -1) goTo(idx);
    });
  });

  document.querySelector('.arrow-next').addEventListener('click', () => {
    goTo((current + 1) % order.length);
  });
  document.querySelector('.arrow-prev').addEventListener('click', () => {
    goTo((current - 1 + order.length) % order.length);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo((current + 1) % order.length);
    if (e.key === 'ArrowLeft') goTo((current - 1 + order.length) % order.length);
  });

  const initialHash = location.hash.replace('#', '');
  const initialIndex = order.indexOf(initialHash);
  if (initialIndex > 0) {
    sections[0].classList.remove('active');
    sections[0].style.visibility = 'hidden';
    sections[initialIndex].classList.add('active');
    current = initialIndex;
    navIcons.forEach((icon) => icon.classList.toggle('active', icon.dataset.id === initialHash));
  }
})();
