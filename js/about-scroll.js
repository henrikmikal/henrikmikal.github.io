(() => {
  const scene = document.querySelector('.about-scroll-hero');
  const stage = document.querySelector('.about-scroll-stage');

  if (!scene || !stage) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  let rafId = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateSceneProgress = () => {
    rafId = 0;

    if (mobileQuery.matches) {
      stage.style.setProperty('--scene-progress', '1');
      return;
    }

    const rect = scene.getBoundingClientRect();
    const stageHeight = stage.clientHeight || window.innerHeight;
    const scrollSpan = Math.max(1, scene.offsetHeight - stageHeight);
    const raw = -rect.top / scrollSpan;
    const progress = clamp(raw, 0, 1);

    stage.style.setProperty('--scene-progress', progress.toFixed(4));
  };

  const requestUpdate = () => {
    if (!rafId) {
      rafId = window.requestAnimationFrame(updateSceneProgress);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', requestUpdate);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(requestUpdate);
  }

  updateSceneProgress();
})();
