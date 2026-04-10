export async function logVisit() {
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
