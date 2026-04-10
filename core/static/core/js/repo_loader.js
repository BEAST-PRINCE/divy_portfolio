import { initFadeInAnimations } from './animations.js';

const $ = (sel) => document.querySelector(sel);

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

export async function loadFeaturedProjects() {
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
