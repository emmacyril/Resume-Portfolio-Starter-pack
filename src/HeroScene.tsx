import { useEffect, useRef, useState } from "react";
import type { Mesh, MeshPhysicalMaterial } from "three";

export default function HeroScene({
  motion,
  layer,
}: {
  motion: boolean;
  layer: number;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef({ motion, layer });
  const [ready, setReady] = useState(false);
  controls.current = { motion, layer };

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};
    async function build() {
      const [T, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/addons/environments/RoomEnvironment.js"),
      ]);
      if (disposed || !element) return;
      let renderer;
      try {
        renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(0, 0, 9.8);
      const pmrem = new T.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.025);
      scene.environment = environment.texture;
      room.dispose();
      const sculpture = new T.Group();
      scene.add(sculpture);
      const rings: Mesh[] = [];
      const geometries: InstanceType<typeof T.BufferGeometry>[] = [];
      const materials: MeshPhysicalMaterial[] = [];
      function roundedPath(radius: number, corner: number) {
        const p = new T.Shape();
        p.moveTo(-radius + corner, -radius);
        p.lineTo(radius - corner, -radius);
        p.quadraticCurveTo(radius, -radius, radius, -radius + corner);
        p.lineTo(radius, radius - corner);
        p.quadraticCurveTo(radius, radius, radius - corner, radius);
        p.lineTo(-radius + corner, radius);
        p.quadraticCurveTo(-radius, radius, -radius, radius - corner);
        p.lineTo(-radius, -radius + corner);
        p.quadraticCurveTo(-radius, -radius, -radius + corner, -radius);
        return p;
      }
      [1.82, 1.34, 0.87].forEach((radius, i) => {
        const shape = roundedPath(radius, 0.56);
        const inner = roundedPath(radius - 0.24, 0.4);
        shape.holes.push(new T.Path(inner.getPoints(48).reverse()));
        const geometry = new T.ExtrudeGeometry(shape, {
          depth: 0.26,
          bevelEnabled: true,
          bevelSegments: 5,
          steps: 1,
          bevelSize: 0.072,
          bevelThickness: 0.072,
          curveSegments: 32,
        });
        geometry.center();
        const material = new T.MeshPhysicalMaterial({
          color: i === 1 ? 0xd95a28 : 0xaeb7c2,
          metalness: 1,
          roughness: i === 1 ? 0.24 : 0.19,
          clearcoat: 0.6,
          clearcoatRoughness: 0.2,
          envMapIntensity: 2.0,
        });
        const mesh = new T.Mesh(geometry, material);
        mesh.rotation.set(0.32 + i * 0.19, -0.3 + i * 0.3, -0.38 + i * 0.3);
        mesh.position.z = i * 0.25;
        sculpture.add(mesh);
        rings.push(mesh);
        geometries.push(geometry);
        materials.push(material);
      });
      const coreGeo = new T.IcosahedronGeometry(0.33, 1);
      const coreMat = new T.MeshPhysicalMaterial({
        color: 0xf66f39,
        metalness: 0.85,
        roughness: 0.24,
        emissive: 0x431509,
        emissiveIntensity: 0.45,
      });
      const core = new T.Mesh(coreGeo, coreMat);
      sculpture.add(core);
      geometries.push(coreGeo);
      materials.push(coreMat);
      const warm = new T.DirectionalLight(0xff8051, 4);
      warm.position.set(4, -2, 3);
      scene.add(warm);
      const white = new T.DirectionalLight(0xddefff, 5);
      white.position.set(-4, 4, 3);
      scene.add(white);
      const orbit = new T.Group();
      sculpture.add(orbit);
      const sphereGeo = new T.SphereGeometry(0.038, 12, 12);
      geometries.push(sphereGeo);
      for (let i = 0; i < 9; i++) {
        const dot = new T.Mesh(sphereGeo, coreMat);
        const a = (i / 9) * Math.PI * 2;
        dot.position.set(
          Math.cos(a) * 2.4,
          Math.sin(a) * 2.4,
          Math.sin(a * 2) * 0.3,
        );
        orbit.add(dot);
      }
      let px = 0,
        py = 0,
        dragX = 0,
        dragY = 0,
        dragging = false,
        lastX = 0,
        lastY = 0;
      let visible = true,
        elapsed = 0,
        last = 0,
        lastRender = 0,
        frame = 0;
      let previousMotion = controls.current.motion,
        previousLayer = controls.current.layer;
      let dirty = true;
      const render = (now: number) => {
        frame = requestAnimationFrame(render);
        if (document.hidden || !visible) {
          last = now;
          return;
        }
        const c = controls.current;
        if (previousMotion !== c.motion || previousLayer !== c.layer) {
          dirty = true;
          previousMotion = c.motion;
          previousLayer = c.layer;
        }
        if (!c.motion && !dirty) return;
        if (now - lastRender < 1000 / 40 && !dirty) return;
        const dt = Math.min((now - last) / 1000 || 0, 0.05);
        last = now;
        lastRender = now;
        if (c.motion) elapsed += dt;
        const scroll = Math.min(
          1,
          Math.max(
            0,
            -element.getBoundingClientRect().top / window.innerHeight,
          ),
        );
        sculpture.rotation.y =
          -0.28 +
          (c.motion ? Math.sin(elapsed * 0.15) * 0.13 + px * 0.13 + dragX : 0);
        sculpture.rotation.x = 0.1 + (c.motion ? py * 0.1 + dragY : 0);
        sculpture.rotation.z = -0.08 + scroll * 0.3;
        sculpture.position.y =
          (c.motion ? Math.sin(elapsed * 0.6) * 0.085 : 0) - scroll * 0.25;
        rings.forEach((ring, i) => {
          const focus = c.layer < 0 ? 0 : c.layer === i ? 1 : -0.25;
          const targetZ = i * 0.25 + focus * 0.6;
          ring.position.z += (targetZ - ring.position.z) * 0.07;
          ring.rotation.y =
            -0.3 +
            i * 0.3 +
            (c.motion ? Math.sin(elapsed * 0.28 + i) * 0.1 : 0);
          (ring.material as MeshPhysicalMaterial).envMapIntensity =
            c.layer === i ? 3 : 2;
        });
        core.rotation.y = elapsed * 0.3;
        core.rotation.z = elapsed * 0.2;
        orbit.rotation.z = -elapsed * 0.06;
        renderer.render(scene, camera);
        dirty =
          !c.motion &&
          rings.some(
            (ring, i) =>
              Math.abs(
                ring.position.z -
                  (i * 0.25 +
                    (c.layer < 0 ? 0 : c.layer === i ? 1 : -0.25) * 0.6),
              ) > 0.005,
          );
      };
      const resize = () => {
        const { width, height } = element.getBoundingClientRect();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        dirty = true;
      };
      const observer = new ResizeObserver(resize);
      observer.observe(element);
      resize();
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        dirty = true;
      });
      intersection.observe(element);
      const move = (event: PointerEvent) => {
        const rect = element.getBoundingClientRect();
        px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        if (dragging && controls.current.motion) {
          dragX += (event.clientX - lastX) * 0.005;
          dragY += (event.clientY - lastY) * 0.003;
        }
        lastX = event.clientX;
        lastY = event.clientY;
      };
      const down = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        dragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        element.setPointerCapture(event.pointerId);
      };
      const up = () => {
        dragging = false;
      };
      const leave = () => {
        px = 0;
        py = 0;
      };
      const lost = (event: Event) => {
        event.preventDefault();
        setReady(false);
        visible = false;
      };
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerdown", down);
      element.addEventListener("pointerup", up);
      element.addEventListener("pointercancel", up);
      element.addEventListener("pointerleave", leave);
      renderer.domElement.addEventListener("webglcontextlost", lost);
      frame = requestAnimationFrame(render);
      setReady(true);
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        intersection.disconnect();
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerdown", down);
        element.removeEventListener("pointerup", up);
        element.removeEventListener("pointercancel", up);
        element.removeEventListener("pointerleave", leave);
        renderer.domElement.removeEventListener("webglcontextlost", lost);
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    void build().catch(() => setReady(false));
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      className={`hero-scene ${ready ? "scene-ready" : ""}`}
      ref={host}
      data-testid="hero-scene"
      aria-hidden="true"
    >
      <div className="scene-fallback">
        <i />
        <i />
        <i />
        <b />
      </div>
    </div>
  );
}
