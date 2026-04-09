/* global THREE */

(function () {
  function createFaceTexture(label, fillColor, glowColor) {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Base gradient for each face.
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, fillColor);
    grad.addColorStop(1, "#0f172a");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Subtle inner glow.
    const glow = ctx.createRadialGradient(size * 0.3, size * 0.25, 20, size * 0.35, size * 0.3, size * 260);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Crisp readable label.
    ctx.shadowColor = "rgba(255,255,255,0.6)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 54px Inter, Segoe UI, Arial, sans-serif";
    ctx.fillText(label, size / 2, size / 2 + 8);

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  function initSkillsCube() {
    const container = document.getElementById("skills-cube-container");
    if (!container || !window.THREE) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const labels = [
      ["Frontend", "#4338ca", "rgba(167,139,250,0.40)"],
      ["Backend", "#1d4ed8", "rgba(96,165,250,0.40)"],
      ["Databases", "#0f766e", "rgba(45,212,191,0.35)"],
      ["DevOps", "#7c3aed", "rgba(196,181,253,0.38)"],
      ["AI/ML", "#a21caf", "rgba(232,121,249,0.36)"],
      ["Tools", "#0284c7", "rgba(125,211,252,0.34)"],
    ];

    const materials = labels.map(([label, faceColor, glowColor]) => {
      const map = createFaceTexture(label, faceColor, glowColor);
      return new THREE.MeshStandardMaterial({ map: map || undefined, roughness: 0.2, metalness: 0.5 });
    });

    const cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2, 16, 16, 16), materials);
    scene.add(cube);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 1.2);
    scene.add(hemiLight);
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x88bbff, 2.5, 18);
    rimLight.position.set(-4, -2, 4);
    scene.add(rimLight);

    let isDragging = false;
    let pointerId = null;
    let prevX = 0;
    let prevY = 0;
    let lastInteraction = performance.now();

    function onPointerDown(e) {
      isDragging = true;
      pointerId = e.pointerId;
      prevX = e.clientX;
      prevY = e.clientY;
      lastInteraction = performance.now();
      if (renderer.domElement.setPointerCapture) renderer.domElement.setPointerCapture(pointerId);
    }

    function onPointerMove(e) {
      if (!isDragging || (pointerId !== null && e.pointerId !== pointerId)) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      cube.rotation.y += dx * 0.008;
      cube.rotation.x += dy * 0.008;
      cube.rotation.x = Math.max(-1.1, Math.min(1.1, cube.rotation.x));
      lastInteraction = performance.now();
    }

    function onPointerUp(e) {
      if (pointerId !== null && e.pointerId !== pointerId) return;
      isDragging = false;
      lastInteraction = performance.now();
      if (pointerId !== null && renderer.domElement.releasePointerCapture) {
        renderer.domElement.releasePointerCapture(pointerId);
      }
      pointerId = null;
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    let rafId = null;
    function animate() {
      const now = performance.now();
      const idleMs = now - lastInteraction;

      // Auto-rotate when idle for a polished effect.
      if (!isDragging && idleMs > 650) {
        cube.rotation.y += 0.004;
        cube.rotation.x += 0.0012;
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    function onResize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);
    window.addEventListener("resize", onResize);
    onResize();
    animate();

    // Cleanup if the section is removed dynamically.
    container._destroySkillsCube = function () {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.dispose();
      materials.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
      cube.geometry.dispose();
    };
  }

  function lazyInit() {
    const section = document.getElementById("interactive-skills");
    if (!section) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          initSkillsCube();
          obs.disconnect();
        });
      },
      { rootMargin: "120px 0px" }
    );
    obs.observe(section);
  }

  document.addEventListener("DOMContentLoaded", lazyInit);
})();

