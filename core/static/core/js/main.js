import { initThemeToggle } from './theme_manager.js';
import { initPageLoader, initFadeInAnimations, typeRotator, initScrollSpy } from './animations.js';
import { logVisit } from './analytics.js';
import { loadFeaturedProjects } from './repo_loader.js';

// Boot
initPageLoader();
initThemeToggle();
initFadeInAnimations();
typeRotator();

document.addEventListener("DOMContentLoaded", () => {
  logVisit();
  loadFeaturedProjects();
  initScrollSpy();
});
