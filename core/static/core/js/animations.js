const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export function initPageLoader() {
  const loader = $("#page-loader");
  if (!loader) return;

  const hide = () => {
    loader.classList.add("opacity-0");
    loader.classList.add("transition-opacity");
    loader.classList.add("duration-500");
    window.setTimeout(() => {
      loader.style.display = "none";
    }, 550);
  };

  // Wait for everything (images/fonts) to avoid layout jumps.
  window.addEventListener("load", () => window.setTimeout(hide, 350));
}

export function initFadeInAnimations() {
  const animatables = $$('[data-animate="fade-up"]');
  if (!animatables.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatables.forEach((el) => observer.observe(el));
}

export function typeRotator() {
  const el = $("#typed-roles");
  if (!el) return;

  const words = ["Agentic AI", "Microservices", "Data Pipelines"];
  let idx = 0;
  let sub = 0;
  let direction = 1; // 1 typing, -1 deleting

  const tick = () => {
    const current = words[idx];
    if (direction === 1) {
      sub += 1;
      el.textContent = current.slice(0, sub);
      if (sub >= current.length) {
        direction = -1;
        return 1000; // pause 1s before moving to the next word
      }
    } else {
      sub -= 1;
      el.textContent = current.slice(0, Math.max(0, sub));
      if (sub <= 0) {
        direction = 1;
        idx = (idx + 1) % words.length;
        return 100; // brief pause before next cycle starts
      }
    }
    return direction === 1 ? 85 : 60; // slightly faster typing/deleting cadence
  };

  const loop = () => {
    const delay = tick();
    window.setTimeout(loop, delay);
  };
  loop();
}
