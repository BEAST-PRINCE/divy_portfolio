import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

(function () {
  function createFaceTexture(label, fillColor, glowColor) {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Solid bright background
    ctx.fillStyle = fillColor;
    ctx.fillRect(0, 0, size, size);

    // Bright inner center glow
    const glow = ctx.createRadialGradient(size * 0.5, size * 0.5, 0, size * 0.5, size * 0.5, size * 0.6);
    glow.addColorStop(0, glowColor);
    glow.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Ultra legible text with dark stroke and shadow
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 76px Inter, Segoe UI, Arial, sans-serif";

    const maxWidth = size - 40;
    let lines = [];
    if (label.includes('/')) {
        const parts = label.split('/');
        lines = [parts[0], '/' + parts[1]];
    } else {
        const words = label.split(' ');
        let currentLine = words[0] || "";
        for (let i = 1; i < words.length; i++) {
            const width = ctx.measureText(currentLine + " " + words[i]).width;
            if (width < maxWidth) {
                currentLine += " " + words[i];
            } else {
                lines.push(currentLine);
                currentLine = words[i];
            }
        }
        if (currentLine) lines.push(currentLine);
    }

    // Deep black shadow and stroke
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 10;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000000";
    
    const lineHeight = 80;
    const startY = (size / 2) - ((lines.length - 1) * lineHeight) / 2 + 8;

    lines.forEach((line, i) => {
        ctx.strokeText(line, size / 2, startY + i * lineHeight);
    });

    // Bright yellow/orangish text fill
    ctx.fillStyle = "#ffbb00";
    lines.forEach((line, i) => {
        ctx.fillText(line, size / 2, startY + i * lineHeight);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  function initSkillsCube() {
    const container = document.getElementById("skills-cube-container");
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const labels = [
      ["Agentic AI", "#4f46e5", "rgba(255,255,255,0.4)"],
      ["Backend", "#2563eb", "rgba(255,255,255,0.4)"],
      ["Databases", "#0d9488", "rgba(255,255,255,0.4)"],
      ["Big Data", "#7c3aed", "rgba(255,255,255,0.4)"],
      ["Data Engineering", "#c026d3", "rgba(255,255,255,0.4)"],
      ["Springboot/Django", "#0284c7", "rgba(255,255,255,0.4)"],
    ];

    const materials = labels.map(([label, faceColor, glowColor]) => {
      const map = createFaceTexture(label, faceColor, glowColor);
      return new THREE.MeshPhongMaterial({
        map: map || undefined,
        specular: 0x444444,
        shininess: 70,
        emissive: new THREE.Color(faceColor).multiplyScalar(0.25)
      });
    });

    const cube = new THREE.Mesh(new RoundedBoxGeometry(2, 2, 2, 6, 0.25), materials);
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

