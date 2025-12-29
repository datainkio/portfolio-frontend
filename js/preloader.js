const preloader = document.querySelector('[data-preloader]');
if (preloader) {
  const stack = preloader.querySelector('[data-preloader-stack]');
  const main = document.querySelector('main');
  const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const restoreState = (() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      scrollY: window.scrollY,
    };
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      window.scrollTo({
        top: prev.scrollY,
        left: 0,
        behavior: 'instant' in window ? 'instant' : 'auto',
      });
    };
  })();

  const animateIntro = () => {
    if (!stack) return;
    if (typeof window.gsap !== 'undefined') {
      const tl = window.gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.out' } });
      tl.fromTo(stack, { autoAlpha: 0, y: 12, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1 });
      return tl;
    }
    if (prefersReduce) {
      stack.style.opacity = '1';
      stack.style.transform = 'translateY(0)';
      return;
    }
    stack.animate(
      [
        { opacity: 0, transform: 'translateY(12px) scale(0.985)' },
        { opacity: 1, transform: 'translateY(0px) scale(1)' },
      ],
      { duration: 320, easing: 'cubic-bezier(0.22,0.61,0.36,1)', fill: 'forwards' }
    );
  };

  const animateExit = () =>
    new Promise(resolve => {
      const finish = () => resolve();
      if (typeof window.gsap !== 'undefined') {
        window.gsap
          .timeline({ defaults: { duration: 0.3, ease: 'power2.inOut' } })
          .to(stack, { autoAlpha: 0.9, y: -6 }, 0)
          .to(preloader, { autoAlpha: 0 }, 0)
          .add(finish);
        return;
      }
      if (prefersReduce) {
        preloader.style.transition = 'opacity 180ms ease';
        preloader.style.opacity = '0';
        preloader.addEventListener('transitionend', finish, { once: true });
        setTimeout(finish, 220);
        return;
      }
      preloader
        .animate(
          [
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(-8px)' },
          ],
          { duration: 260, easing: 'cubic-bezier(0.4,0.0,0.2,1)', fill: 'forwards' }
        )
        .addEventListener('finish', finish);
    });

  const fontsReady = 'fonts' in document ? document.fonts.ready : Promise.resolve();
  const windowLoaded =
    document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise(res => window.addEventListener('load', res, { once: true }));
  const timeout = new Promise(res => setTimeout(res, 1800));

  const ready = async () => {
    animateIntro();
    await fontsReady;
    await Promise.race([windowLoaded, timeout]);
    await animateExit();
    preloader.remove();
    restoreState();
    if (main) main.setAttribute('aria-busy', 'false');
    initializeScrollSmoother(preloader.dataset.gsapSrc);
  };

  const initializeScrollSmoother = async src => {
    const hasGSAP = typeof window.gsap !== 'undefined';
    const hasSmoother = typeof window.ScrollSmoother !== 'undefined';
    if (hasGSAP && hasSmoother) {
      window.gsap.registerPlugin(window.ScrollSmoother);
      window.ScrollSmoother.create({ smooth: 1, effects: true });
      return;
    }
    if (!src) return; // optional deferred load
    await loadGSAPScript(src);
    if (typeof window.gsap !== 'undefined' && typeof window.ScrollSmoother !== 'undefined') {
      window.gsap.registerPlugin(window.ScrollSmoother);
      window.ScrollSmoother.create({ smooth: 1, effects: true });
    }
  };

  const loadGSAPScript = src =>
    new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });

  ready();
}
