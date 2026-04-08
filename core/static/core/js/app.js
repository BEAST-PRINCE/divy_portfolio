/* global tailwind */

(function () {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function setTheme(theme) {
    if (theme === "light") document.documentElement.classList.remove("dark");
    else document.documentElement.classList.add("dark");

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}

    const label = $("#theme-toggle-label");
    const sun = $("#theme-icon-sun");
    const moon = $("#theme-icon-moon");

    if (label) label.textContent = theme === "light" ? "Light" : "Dark";
    if (sun && moon) {
      if (theme === "light") {
        sun.classList.remove("hidden");
        moon.classList.add("hidden");
      } else {
        moon.classList.remove("hidden");
        sun.classList.add("hidden");
      }
    }
  }

  function initThemeToggle() {
    const saved = (() => {
      try {
        return localStorage.getItem("theme");
      } catch (e) {
        return null;
      }
    })();

    // Dark is the default (per requirements).
    if (saved === "light" || saved === "dark") setTheme(saved);
    else setTheme("dark");

    const btn = $("#theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  }

  function initPageLoader() {
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

  function initFadeInAnimations() {
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

  function typeRotator() {
    const el = $("#typed-roles");
    if (!el) return;

    const words = ["Agentic AI", "Microservices", "GCP Data Pipelines"];
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
      return direction === 1 ? 130 : 95; // slower typing/deleting cadence
    };

    const loop = () => {
      const delay = tick();
      window.setTimeout(loop, delay);
    };
    loop();
  }

  async function logVisit() {
    try {
      const path = window.location.pathname || "/";
      const pageName = path.trim() || "/";
      await fetch(`/api/log-visit/?page_name=${encodeURIComponent(pageName)}`, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    } catch (e) {
      // Analytics must not block the UI.
    }
  }

  function renderProjects(projects) {
    const grid = $("#projects-grid");
    const skeleton = $("#projects-skeleton");
    const empty = $("#projects-empty");
    if (!grid || !skeleton || !empty) return;

    grid.innerHTML = "";

    if (!projects || !projects.length) {
      skeleton.classList.add("hidden");
      empty.classList.remove("hidden");
      return;
    }

    projects.forEach((p) => {
      const tech = Array.isArray(p.tech_stack) ? p.tech_stack.filter(Boolean) : [];
      const techChips =
        tech.length > 0
          ? tech
              .slice(0, 3)
              .map(
                (t) =>
                  `<span class="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-200">${escapeHtml(
                    t
                  )}</span>`
              )
              .join("")
          : `<span class="rounded-full bg-slate-500/10 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Tech</span>`;

      grid.insertAdjacentHTML(
        "beforeend",
        `
        <article class="card-3d glass-panel group rounded-2xl border border-slate-200 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800" data-animate="fade-up">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ${escapeHtml(p.title || "Project")}
              </h3>
              <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                ${escapeHtml(p.description || "-")}
              </p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2">
            ${techChips}
          </div>

          <div class="mt-5">
            <a href="${escapeAttr(p.github_url || "#")}" target="_blank" rel="noreferrer"
               class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-xs font-semibold text-white hover:brightness-110">
              View on GitHub
            </a>
          </div>
        </article>
      `
      );
    });

    skeleton.classList.add("hidden");
    empty.classList.add("hidden");
    grid.classList.remove("hidden");

    // Re-run animation visibility for newly inserted cards.
    initFadeInAnimations();
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeAttr(str) {
    // URLs only; still do minimal escaping for safety.
    return String(str).replaceAll('"', "%22");
  }

  async function loadFeaturedProjects() {
    const skeleton = $("#projects-skeleton");
    const empty = $("#projects-empty");
    const grid = $("#projects-grid");
    if (!skeleton || !empty || !grid) return;

    try {
      const res = await fetch("/api/projects/?count=6", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      renderProjects(data.projects || []);
    } catch (e) {
      // If GitHub is rate-limited/offline, show the empty state.
      skeleton.classList.add("hidden");
      empty.classList.remove("hidden");
    }
  }

  // Boot
  initPageLoader();
  initThemeToggle();
  initFadeInAnimations();
  typeRotator();
  document.addEventListener("DOMContentLoaded", () => {
    logVisit();
    loadFeaturedProjects();
  });
})();

