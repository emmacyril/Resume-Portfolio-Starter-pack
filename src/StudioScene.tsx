import { useEffect, useRef, useState } from "react";
export type StudioProject = { name: string; image?: string; category: string };
export default function StudioScene({
  project,
  motion,
  angle,
}: {
  project: StudioProject;
  motion: boolean;
  angle: number;
}) {
  const host = useRef<HTMLDivElement>(null),
    state = useRef({ project, motion, angle }),
    [ready, setReady] = useState(false);
  useEffect(() => {
    state.current = { project, motion, angle };
  }, [project, motion, angle]);
  useEffect(() => {
    const el = host.current!;
    let disposed = false,
      release = () => {};
    async function init() {
      const [T, { RoundedBoxGeometry }] = await Promise.all([
        import("three"),
        import("three/addons/geometries/RoundedBoxGeometry.js"),
      ]);
      if (disposed) return;
      let renderer: InstanceType<typeof T.WebGLRenderer>;
      try {
        renderer = new T.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.VSMShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.domElement.setAttribute(
        "aria-label",
        "Interactive 3D engineering workspace. Drag to look around.",
      );
      renderer.domElement.setAttribute("role", "img");
      el.appendChild(renderer.domElement);
      const scene = new T.Scene(),
        camera = new T.PerspectiveCamera(27, 1, 0.1, 80);
      camera.position.set(8, 6.4, 10);
      camera.lookAt(0, 1.1, 0);
      const ambient = new T.HemisphereLight(0xffffff, 0xa7a7aa, 3);
      scene.add(ambient);
      const key = new T.DirectionalLight(0xfff4e7, 4);
      key.position.set(-4, 9, 6);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.left = -9;
      key.shadow.camera.right = 9;
      key.shadow.camera.top = 9;
      key.shadow.camera.bottom = -9;
      key.shadow.normalBias = 0.035;
      key.shadow.bias = -0.0001;
      key.shadow.radius = 5;
      key.shadow.blurSamples = 8;
      scene.add(key);
      const fill = new T.DirectionalLight(0xc0d4ff, 2.4);
      fill.position.set(7, 3, -4);
      scene.add(fill);
      const room = new T.Group();
      scene.add(room);
      room.rotation.y = -0.25;
      const mats: { [k: string]: InstanceType<typeof T.MeshStandardMaterial> } =
        {
          shell: new T.MeshStandardMaterial({
            color: 0xe8e7e2,
            roughness: 0.36,
            metalness: 0.2,
          }),
          silver: new T.MeshStandardMaterial({
            color: 0xaeb3b7,
            roughness: 0.28,
            metalness: 0.65,
          }),
          dark: new T.MeshStandardMaterial({
            color: 0x151a22,
            roughness: 0.5,
            metalness: 0.1,
          }),
          black: new T.MeshStandardMaterial({
            color: 0x242831,
            roughness: 0.55,
          }),
          blue: new T.MeshStandardMaterial({
            color: 0x2144f6,
            roughness: 0.26,
            metalness: 0.15,
          }),
          orange: new T.MeshStandardMaterial({
            color: 0xff6d3a,
            roughness: 0.4,
          }),
          white: new T.MeshStandardMaterial({
            color: 0xfaf9f3,
            roughness: 0.7,
          }),
        };
      const geos: InstanceType<typeof T.BufferGeometry>[] = [],
        textures: InstanceType<typeof T.Texture>[] = [],
        extraMats: InstanceType<typeof T.Material>[] = [];
      function box(
        w: number,
        h: number,
        d: number,
        x: number,
        y: number,
        z: number,
        mat = mats.shell,
        r = 0.05,
        parent = room,
      ) {
        const geo = new RoundedBoxGeometry(w, h, d, 3, r);
        geos.push(geo);
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      }
      function cylinder(
        rt: number,
        rb: number,
        h: number,
        x: number,
        y: number,
        z: number,
        mat = mats.shell,
        parent = room,
      ) {
        const geo = new T.CylinderGeometry(rt, rb, h, 48);
        geos.push(geo);
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      }
      function labelTexture(
        title: string,
        sub: string,
        bg: string,
        fg: string,
      ) {
        const c = document.createElement("canvas");
        c.width = 1024;
        c.height = 640;
        const ctx = c.getContext("2d")!;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, 1024, 640);
        ctx.fillStyle = fg;
        ctx.font = "500 22px monospace";
        ctx.fillText("CYRIL / ENGINEERING ROOM", 54, 65);
        ctx.fillStyle = fg;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(54, 92, 916, 1);
        ctx.globalAlpha = 1;
        ctx.font = "bold 82px sans-serif";
        ctx.fillText(title, 54, 230);
        ctx.font = "25px monospace";
        ctx.fillText(sub, 54, 293);
        ctx.fillStyle = "#6388ff";
        ctx.font = "23px monospace";
        [
          "const idea = understand(context);",
          "const product = build(idea);",
          "await ship(product);",
        ].forEach((t, i) => ctx.fillText(t, 54, 402 + i * 45));
        ctx.fillStyle = "#a6c3a2";
        ctx.font = "18px monospace";
        ctx.fillText("● systems online       ~/cyril/work", 54, 590);
        const tex = new T.CanvasTexture(c);
        tex.colorSpace = T.SRGBColorSpace;
        textures.push(tex);
        return tex;
      }
      function panel(
        w: number,
        h: number,
        x: number,
        y: number,
        z: number,
        texture: InstanceType<typeof T.Texture>,
        parent = room,
      ) {
        const geo = new T.PlaneGeometry(w, h);
        geos.push(geo);
        const mat = new T.MeshBasicMaterial({
          map: texture,
          toneMapped: false,
        });
        extraMats.push(mat);
        const mesh = new T.Mesh(geo, mat);
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      }
      // A substantial, machined worktable anchors the scene.
      box(6.2, 0.22, 3.45, 0, 0.97, 0, mats.shell, 0.11);
      box(5.7, 0.12, 3.02, 0, 0.8, 0, mats.dark, 0.05);
      box(0.22, 0.92, 2.65, -2.4, 0.4, 0, mats.shell, 0.05);
      box(0.22, 0.92, 2.65, 2.4, 0.4, 0, mats.shell, 0.05);
      box(0.9, 0.12, 3.12, -2.4, -0.04, 0, mats.silver, 0.06);
      box(0.9, 0.12, 3.12, 2.4, -0.04, 0, mats.silver, 0.06);
      const display = new T.Group();
      display.position.set(0.4, 2.45, -0.77);
      display.rotation.x = -0.07;
      room.add(display);
      box(3.95, 2.42, 0.16, 0, 0, 0, mats.silver, 0.13, display);
      box(3.84, 2.3, 0.06, 0, 0.015, 0.093, mats.dark, 0.1, display);
      const defaultTex = labelTexture(
        "Build. Connect.",
        "Software / Systems / Products",
        "#0d111c",
        "#f4f2ec",
      );
      const screen = panel(3.65, 2.09, 0, 0.02, 0.129, defaultTex, display);
      box(0.35, 0.83, 0.23, 0.4, 1.4, -0.82, mats.silver, 0.05);
      box(1.45, 0.09, 0.78, 0.4, 1.12, -0.6, mats.silver, 0.04);
      // Individual keycaps and a blue return key make the workspace tactile.
      const keyboard = new T.Group();
      keyboard.position.set(0.52, 1.135, 0.9);
      room.add(keyboard);
      box(2.18, 0.09, 0.72, 0, 0, 0, mats.silver, 0.05, keyboard);
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 13; col++) {
          if (row === 3 && col > 2 && col < 9) continue;
          box(
            0.12,
            0.048,
            0.117,
            -0.98 + col * 0.158,
            0.065,
            -0.25 + row * 0.155,
            col === 12 && row === 1 ? mats.blue : mats.white,
            0.014,
            keyboard,
          );
        }
      box(0.91, 0.048, 0.117, -0.18, 0.065, 0.215, mats.white, 0.014, keyboard);
      box(0.58, 0.07, 0.76, 2.25, 1.12, 0.9, mats.silver, 0.06);
      box(0.5, 0.025, 0.67, 2.25, 1.17, 0.9, mats.white, 0.05);
      const laptop = new T.Group();
      laptop.position.set(-1.98, 1.13, 0.23);
      laptop.rotation.y = 0.36;
      room.add(laptop);
      box(1.53, 0.075, 1.13, 0, 0, 0.17, mats.blue, 0.05, laptop);
      box(0.65, 0.012, 0.3, 0, 0.047, 0.46, mats.shell, 0.035, laptop);
      for (let row = 0; row < 3; row++)
        for (let col = 0; col < 9; col++)
          box(
            0.115,
            0.014,
            0.09,
            -0.61 + col * 0.15,
            0.05,
            -0.15 + row * 0.13,
            mats.dark,
            0.012,
            laptop,
          );
      const lid = new T.Group();
      lid.position.set(0, 0.51, -0.34);
      lid.rotation.x = -0.15;
      laptop.add(lid);
      box(1.53, 1.02, 0.08, 0, 0, 0, mats.blue, 0.055, lid);
      panel(
        1.39,
        0.85,
        0,
        0,
        0.046,
        labelTexture("Hello, world.", "Always building.", "#101728", "#f4f2ec"),
        lid,
      );
      // Desk objects, purposeful detail and physically lit materials.
      cylinder(0.2, 0.17, 0.46, -2.48, 1.3, -1.04, mats.orange);
      cylinder(0.165, 0.165, 0.015, -2.48, 1.54, -1.04, mats.dark);
      const handleGeo = new T.TorusGeometry(0.135, 0.04, 12, 32);
      geos.push(handleGeo);
      const handle = new T.Mesh(handleGeo, mats.orange);
      handle.position.set(-2.25, 1.34, -1.04);
      room.add(handle);
      box(0.62, 0.1, 0.95, 2.25, 1.12, -0.2, mats.dark, 0.035).rotation.y =
        -0.2;
      box(0.57, 0.06, 0.9, 2.25, 1.2, -0.2, mats.shell, 0.015).rotation.y =
        -0.2;
      box(0.033, 0.033, 0.6, 2.22, 1.26, -0.18, mats.blue, 0.013).rotation.y =
        -0.2;
      const floorGeo = new T.PlaneGeometry(40, 40);
      geos.push(floorGeo);
      const floorMat = new T.ShadowMaterial({ opacity: 0.18 });
      extraMats.push(floorMat);
      const floor = new T.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.12;
      floor.receiveShadow = true;
      scene.add(floor);
      let frame = 0,
        last = 0,
        active = true,
        tx = 0,
        ty = 0,
        x = 0,
        y = 0,
        dragging = false,
        start = 0,
        base = -0.25,
        dragRotation = base,
        currentImage = "",
        loadGeneration = 0,
        lastMotion = true,
        lastAngle = state.current.angle,
        dirty = true;
      const imageTextures = new Map<string, InstanceType<typeof T.Texture>>();
      const loader = new T.TextureLoader();
      function updateScreen() {
        const requested = state.current.project.image ?? "";
        if (requested === currentImage) return;
        currentImage = requested;
        const generation = ++loadGeneration;
        if (!requested) {
          screen.material.map = defaultTex;
          dirty = true;
          return;
        }
        const cached = imageTextures.get(requested);
        if (cached) {
          screen.material.map = cached;
          dirty = true;
          return;
        }
        loader.load(
          requested,
          (tex) => {
            if (disposed) {
              tex.dispose();
              return;
            }
            tex.colorSpace = T.SRGBColorSpace;
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            const a = tex.image.width / tex.image.height,
              b = 3.65 / 2.09;
            if (a > b) {
              tex.repeat.x = b / a;
              tex.offset.x = (1 - b / a) / 2;
            } else {
              tex.repeat.y = a / b;
              tex.offset.y = 1 - a / b;
            }
            textures.push(tex);
            imageTextures.set(requested, tex);
            if (generation === loadGeneration) {
              screen.material.map = tex;
              screen.material.needsUpdate = true;
              dirty = true;
            }
          },
          undefined,
          () => {
            if (!disposed && generation === loadGeneration) {
              screen.material.map = defaultTex;
              dirty = true;
            }
          },
        );
      }
      const resize = () => {
        const r = el.getBoundingClientRect();
        renderer.setSize(r.width, r.height);
        camera.aspect = r.width / r.height;
        camera.position.set(
          r.width < 600 ? 9 : 8,
          r.width < 600 ? 7 : 6.4,
          r.width < 600 ? 13 : 10,
        );
        camera.lookAt(0, 1.1, 0);
        camera.updateProjectionMatrix();
        dirty = true;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();
      const io = new IntersectionObserver(([entry]) => {
        active = entry.isIntersecting;
        dirty = true;
      });
      io.observe(el);
      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = el.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (dragging) {
          dragRotation = Math.max(
            -1.1,
            Math.min(0.65, base + (e.clientX - start) * 0.006),
          );
        }
        dirty = true;
      };
      const down = (e: PointerEvent) => {
        if (!state.current.motion || e.pointerType !== "mouse") return;
        dragging = true;
        start = e.clientX;
        base = dragRotation;
        el.setPointerCapture(e.pointerId);
        el.dataset.dragging = "true";
      };
      const up = () => {
        dragging = false;
        el.dataset.dragging = "false";
      };
      const leave = () => {
        tx = 0;
        ty = 0;
        dirty = true;
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("pointerleave", leave);
      const loss = (e: Event) => {
        e.preventDefault();
        active = false;
        setReady(false);
      };
      renderer.domElement.addEventListener("webglcontextlost", loss);
      const draw = (now: number) => {
        frame = requestAnimationFrame(draw);
        if (!active || document.hidden || now - last < 1000 / 40) return;
        updateScreen();
        if (lastAngle !== state.current.angle) {
          lastAngle = state.current.angle;
          dragRotation = lastAngle;
          base = lastAngle;
          dirty = true;
        }
        const m = state.current.motion;
        const targetX = m ? tx : 0,
          targetY = m ? ty : 0;
        x += (targetX - x) * 0.07;
        y += (targetY - y) * 0.07;
        if (
          Math.abs(targetX - x) > 0.001 ||
          Math.abs(targetY - y) > 0.001 ||
          Math.abs(room.rotation.y - (dragRotation + x * 0.1)) > 0.001 ||
          m !== lastMotion
        )
          dirty = true;
        if (!dirty) return;
        room.rotation.y = m
          ? room.rotation.y + (dragRotation + x * 0.1 - room.rotation.y) * 0.12
          : dragRotation;
        room.rotation.x = m ? y * 0.03 : 0;
        last = now;
        lastMotion = m;
        renderer.render(scene, camera);
        dirty = false;
      };
      frame = requestAnimationFrame(draw);
      setReady(true);
      release = () => {
        renderer.domElement.removeEventListener("webglcontextlost", loss);
        cancelAnimationFrame(frame);
        ro.disconnect();
        io.disconnect();
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("pointerleave", leave);
        geos.forEach((g) => g.dispose());
        textures.forEach((t) => t.dispose());
        Object.values(mats).forEach((m) => m.dispose());
        extraMats.forEach((m) => m.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    void init().catch(() => setReady(false));
    return () => {
      disposed = true;
      release();
    };
  }, []);
  return (
    <div className={`studio-canvas ${ready ? "is-ready" : ""}`} ref={host}>
      {!ready ? (
        <div className="studio-fallback">
          <div className="fallback-monitor">
            <img
              src={project.image ?? "/projects/rewapay.jpg"}
              alt={`${project.name} product preview`}
            />
          </div>
          <span>THE ENGINEERING ROOM</span>
        </div>
      ) : null}
    </div>
  );
}
