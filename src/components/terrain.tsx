"use client";
import { useEffect, useRef } from "react";
export function Terrain() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const el = host.current;
    if (!el) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const observer = new IntersectionObserver(async (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      try {
        const T = await import("three");
        if (disposed) return;
        const renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        el.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(40, 1, 0.1, 100);
        camera.position.set(0, 3.5, 7);
        camera.lookAt(0, 0, 0);
        const group = new T.Group();
        scene.add(group);
        const points: number[] = [];
        const lines: number[] = [];
        const n = 44;
        const point = (x: number, z: number) => {
          const xx = (x / n - 0.5) * 9,
            zz = (z / n - 0.5) * 7;
          return [
            xx,
            Math.sin(xx * 1.1 + zz * 0.5) * 0.25 +
              Math.exp(-(xx * xx + zz * zz) * 0.23) * 2.1,
            zz,
          ];
        };
        for (let x = 0; x <= n; x++)
          for (let z = 0; z <= n; z++) {
            const p = point(x, z);
            points.push(...p);
            if (x < n) lines.push(...p, ...point(x + 1, z));
            if (z < n) lines.push(...p, ...point(x, z + 1));
          }
        const geo = new T.BufferGeometry();
        geo.setAttribute("position", new T.Float32BufferAttribute(lines, 3));
        const mat = new T.LineBasicMaterial({
          color: 0xf05b43,
          transparent: true,
          opacity: 0.34,
        });
        group.add(new T.LineSegments(geo, mat));
        const pg = new T.BufferGeometry();
        pg.setAttribute("position", new T.Float32BufferAttribute(points, 3));
        const pm = new T.PointsMaterial({
          color: 0xff967a,
          size: 0.025,
          transparent: true,
          opacity: 0.75,
        });
        group.add(new T.Points(pg, pm));
        group.rotation.y = -0.38;
        const resize = () => {
          renderer.setSize(el.clientWidth, el.clientHeight);
          camera.aspect = el.clientWidth / el.clientHeight;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(el);
        let visible = true,
          frame = 0;
        const draw = () => {
          if (!visible || document.hidden || media.matches) return;
          group.rotation.y += 0.00065;
          renderer.render(scene, camera);
          frame = requestAnimationFrame(draw);
        };
        const visibility = () => {
          cancelAnimationFrame(frame);
          draw();
        };
        const io = new IntersectionObserver((e) => {
          visible = e[0].isIntersecting;
          visibility();
        });
        io.observe(el);
        document.addEventListener("visibilitychange", visibility);
        media.addEventListener("change", visibility);
        resize();
        el.classList.add("loaded");
        cleanup = () => {
          cancelAnimationFrame(frame);
          io.disconnect();
          ro.disconnect();
          document.removeEventListener("visibilitychange", visibility);
          media.removeEventListener("change", visibility);
          geo.dispose();
          pg.dispose();
          mat.dispose();
          pm.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        /* The static illustration remains visible if WebGL is unavailable. */
      }
    });
    observer.observe(el);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
    };
  }, []);
  return (
    <div className="terrain" ref={host} aria-hidden="true">
      <svg className="terrain-fallback" viewBox="0 0 600 440">
        <defs>
          <pattern
            id="grid"
            width="23"
            height="23"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 23 0 L 0 0 0 23"
              fill="none"
              stroke="#f05b43"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <ellipse
          cx="320"
          cy="240"
          rx="250"
          ry="125"
          fill="url(#grid)"
          transform="rotate(-20 320 240)"
        />
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse
            key={i}
            cx="320"
            cy={260 - i * 6}
            rx={220 - i * 12}
            ry={75 - i * 3}
            fill="none"
            stroke="#f05b43"
            opacity=".5"
          />
        ))}
      </svg>
    </div>
  );
}
