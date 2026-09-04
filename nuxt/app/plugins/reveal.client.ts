/**
 * Scroll reveal, replacing framer-motion's `whileInView`.
 *
 * One observer for the whole page rather than a component instance each, and it
 * unobserves after revealing so nothing accumulates. Re-scanned after every
 * navigation, because client-side routing swaps the DOM without a fresh page
 * load.
 *
 * A directive per element would be the obvious Vue answer, but it would mean an
 * observer per element and a component that has to be hydrated purely to fade
 * in. This stays out of the component tree entirely.
 */
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null;

  const scan = () => {
    const targets = document.querySelectorAll(
      '[data-reveal]:not([data-revealed])'
    );
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.setAttribute('data-revealed', ''));
      return;
    }

    observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer?.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    targets.forEach((el) => observer?.observe(el));
  };

  // `page:finish` fires after the new page's DOM is in place.
  nuxtApp.hook('page:finish', () => nextTick(scan));
  nuxtApp.hook('app:mounted', () => nextTick(scan));
});
