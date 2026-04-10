const $ = (sel) => document.querySelector(sel);

export function setTheme(theme) {
  if (theme === "light") document.documentElement.classList.remove("dark");
  else document.documentElement.classList.add("dark");

  try {
    localStorage.setItem("theme", theme);
  } catch (e) { }

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

export function initThemeToggle() {
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
