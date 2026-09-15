import { useEffect, useRef } from "react";

export type SpatialCanvasProps = {
  motion: boolean;
  pointer: { x: number; y: number }; // normalized -1 to 1
};

export default function SpatialCanvas({ motion, pointer }: SpatialCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef(pointer);

  useEffect(() => {
    pointerRef.current = pointer;
  }, [pointer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let disposed = false;
    let animationFrameId: number;

    async function initThree() {
      const THREE = await import("three");
      if (disposed || !container) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.pointerEvents = "none";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        100
      );
      camera.position.set(0, 0, 14);

      // Ambient illumination
      const ambientLight = new THREE.AmbientLight(0x0a0f1d, 2.5);
      scene.add(ambientLight);

      // Dynamic pointer-following focal lights
      const primaryLight = new THREE.PointLight(0xf59e0b, 4, 25); // Amber focal light
      primaryLight.position.set(2, 2, 4);
      scene.add(primaryLight);

      const rimLight = new THREE.PointLight(0x06b6d4, 3.5, 25); // Cyan rim light
      rimLight.position.set(-3, -2, 3);
      scene.add(rimLight);

      // Subtle atmospheric particle field
      const particleCount = 200;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const opacities = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 26;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
        opacities[i] = Math.random() * 0.7 + 0.2;
      }

      particleGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      // Custom canvas-drawn soft circle texture
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.6)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
      }
      const particleTexture = new THREE.CanvasTexture(canvas);

      const particleMat = new THREE.PointsMaterial({
        size: 0.22,
        map: particleTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0x94a3b8,
        opacity: 0.6,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Subtle architectural lines in deep space
      const gridHelper = new THREE.GridHelper(24, 16, 0x1e293b, 0x0f172a);
      gridHelper.position.y = -6;
      gridHelper.rotation.x = 0.15;
      scene.add(gridHelper);

      // Smooth damping target coordinates
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isVisible = true;

      // Visibility observer to pause rendering when offscreen
      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? false;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);

      // Visibility API for document tab switches
      const handleVisibilityChange = () => {
        if (document.hidden) {
          isVisible = false;
        } else if (container) {
          const rect = container.getBoundingClientRect();
          isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        }
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Responsive resize handling
      const handleResize = () => {
        if (!container || !renderer) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      let lastTime = performance.now();

      function render(time: number) {
        if (disposed) return;
        animationFrameId = requestAnimationFrame(render);

        if (!isVisible) return;

        const delta = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        if (motion) {
          targetX = pointerRef.current.x * 2.5;
          targetY = pointerRef.current.y * 1.8;

          currentX += (targetX - currentX) * (delta * 4);
          currentY += (targetY - currentY) * (delta * 4);

          // Gently shift lights based on smoothed pointer
          primaryLight.position.x = currentX * 1.5 + 2;
          primaryLight.position.y = currentY * 1.5 + 2;

          rimLight.position.x = -currentX * 1.2 - 2;
          rimLight.position.y = -currentY * 1.2 - 1.5;

          // Gentle rotation of the particle field
          particleSystem.rotation.y = time * 0.00008 + currentX * 0.05;
          particleSystem.rotation.x = currentY * 0.03;
          gridHelper.rotation.z = currentX * 0.015;
        }

        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(render);

      // Disposal cleanup
      return () => {
        disposed = true;
        cancelAnimationFrame(animationFrameId);
        observer.disconnect();
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("resize", handleResize);
        particleGeo.dispose();
        particleMat.dispose();
        particleTexture.dispose();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    }

    let cleanupFn: (() => void) | undefined;
    initThree().then((fn) => {
      cleanupFn = fn;
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(animationFrameId);
      if (cleanupFn) cleanupFn();
    };
  }, [motion]);

  return <div ref={containerRef} className="spatial-canvas-host" aria-hidden="true" />;
}
