(() => {
  const divider = document.querySelector('.education-divider');
  const vgsSection = document.querySelector('.education-vgs-section');

  if (!divider || !vgsSection) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    divider.classList.add('is-active');
    vgsSection.classList.add('is-active');
    return;
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-active');
      }
    });
  }, {
    threshold: 0.35,
    rootMargin: '0px 0px -12% 0px'
  });

  revealObserver.observe(divider);
  revealObserver.observe(vgsSection);
})();
