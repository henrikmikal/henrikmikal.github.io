(() => {
  const scene = document.querySelector('.job-scroll-hero');
  const stage = document.querySelector('.job-scroll-stage');

  if (!scene || !stage) {
    return;
  }

  let rafId = 0;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const updateSceneProgress = () => {
    rafId = 0;

    const sceneTop = scene.getBoundingClientRect().top + window.scrollY;
    const stageHeight = stage.clientHeight || window.innerHeight;
    const scrollSpan = Math.max(1, scene.offsetHeight - stageHeight);
    const raw = (window.scrollY - sceneTop) / scrollSpan;
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

  updateSceneProgress();
})();
