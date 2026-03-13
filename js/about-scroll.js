(() => {
  const scene = document.querySelector('.about-scroll-hero');
  const stage = document.querySelector('.about-scroll-stage');

  if (!scene || !stage) {
    return;
  }

  const mobileQuery = window.matchMedia('(max-width: 900px)');
  const shots = stage.querySelectorAll('.about-wall-shot');
  const dots = stage.querySelectorAll('.about-mobile-dot');
  const SWIPE_UNLOCK_PROGRESS = 0.9;
  let rafId = 0;
  let currentProgress = 0;
  let currentIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchActive = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const syncDots = () => {
    if (!dots.length) {
      return;
    }

    dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === currentIndex);
    });
  };

  const setMobileIndex = (nextIndex) => {
    if (!shots.length) {
      syncDots();
      return;
    }

    const total = shots.length;
    currentIndex = ((nextIndex % total) + total) % total;
    stage.style.setProperty('--mobile-index', String(currentIndex));
    syncDots();
  };

  const updateSceneProgress = () => {
    rafId = 0;

    const rect = scene.getBoundingClientRect();
    const stageHeight = stage.clientHeight || window.innerHeight;
    const scrollSpan = Math.max(1, scene.offsetHeight - stageHeight);
    const raw = -rect.top / scrollSpan;
    const progress = clamp(raw, 0, 1);
    currentProgress = progress;

    stage.style.setProperty('--scene-progress', progress.toFixed(4));

    if (!mobileQuery.matches && currentIndex !== 0) {
      setMobileIndex(0);
    }
  };

  const requestUpdate = () => {
    if (!rafId) {
      rafId = window.requestAnimationFrame(updateSceneProgress);
    }
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  stage.addEventListener('touchstart', (event) => {
    if (!mobileQuery.matches || currentProgress < SWIPE_UNLOCK_PROGRESS) {
      touchActive = false;
      return;
    }

    const touch = event.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchActive = true;
  }, { passive: true });

  stage.addEventListener('touchend', (event) => {
    if (!touchActive || !mobileQuery.matches || currentProgress < SWIPE_UNLOCK_PROGRESS) {
      touchActive = false;
      return;
    }

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;

    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY)) {
      setMobileIndex(deltaX < 0 ? currentIndex + 1 : currentIndex - 1);
    }

    touchActive = false;
  }, { passive: true });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', () => {
      setMobileIndex(0);
      requestUpdate();
    });
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(() => {
      setMobileIndex(0);
      requestUpdate();
    });
  }

  updateSceneProgress();
  setMobileIndex(0);
})();
