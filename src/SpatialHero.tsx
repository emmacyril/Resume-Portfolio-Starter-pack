import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { Project } from "./data";

const SpatialCanvas = lazy(() => import("./SpatialCanvas"));

export type SpatialHeroProps = {
  motion: boolean;
  onOpenProject: (project: Project) => void;
  featuredProjects: Project[];
};

export default function SpatialHero({
  motion,
  onOpenProject,
  featuredProjects,
}: SpatialHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lagosTime, setLagosTime] = useState("");
  const cvPath = "/downloads/Cyril_Emmanuel_Resume.pdf";

  // Real-time Lagos time (UTC+1)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setLagosTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Pointer position tracking with boundary safety
  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!motion) return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Normalized from -1 to 1 across hero viewport
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointer({
      x: Math.max(-1, Math.min(1, x)),
      y: Math.max(-1, Math.min(1, y)),
    });
  };

  const handlePointerLeave = () => {
    if (!motion) return;
    setPointer({ x: 0, y: 0 });
  };

  // Kinetic perspective styles derived from pointer
  const tiltX = motion ? pointer.y * 14 : 0; // degrees
  const tiltY = motion ? pointer.x * -16 : 0; // degrees
  const panX = motion ? pointer.x * 24 : 0; // px
  const panY = motion ? pointer.y * -16 : 0; // px

  return (
    <section
      ref={heroRef}
      className="spatial-hero"
      id="home"
      aria-label="Cyril Emmanuel Hero Section"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* 3D WebGL Background Layer */}
      <Suspense fallback={<div className="spatial-canvas-placeholder" />}>
        <SpatialCanvas motion={motion} pointer={pointer} />
      </Suspense>

      {/* Top Engineering Telemetry Bar */}
      <div className="hero-telemetry">
        <div className="telemetry-item">
          <span className="telemetry-beacon" aria-hidden="true" />
          <span className="telemetry-label">SYSTEM STATUS:</span>
          <span className="telemetry-value">ACTIVE · OPEN TO LEADERSHIP</span>
        </div>
        <div className="telemetry-item">
          <span className="telemetry-label">BASE:</span>
          <span className="telemetry-value">LAGOS (WAT {lagosTime || "15:47"})</span>
        </div>
        <div className="telemetry-item telemetry-coords" aria-hidden="true">
          <span className="telemetry-label">VECTOR:</span>
          <span className="telemetry-value">
            [{pointer.x.toFixed(2)}, {pointer.y.toFixed(2)}]
          </span>
        </div>
      </div>

      {/* Main Spatial Stage Container */}
      <div className="hero-stage">
        {/* Left Column: Monolithic Identity & Stance */}
        <div
          className="hero-identity"
          style={
            motion
              ? {
                  transform: `translate3d(${panX * 0.4}px, ${panY * 0.4}px, 0)`,
                  transition: "transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)",
                }
              : undefined
          }
        >
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>SOFTWARE ENGINEER · FOUNDER · TECHNICAL LEADER</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-first">CYRIL</span>
            <span className="hero-title-last">EMMANUEL</span>
          </h1>

          <p className="hero-thesis">
            Architecting high-concurrency payment services, resilient platform systems,
            and developer tooling. Turning technical complexity into verifiable,
            production-grade reality.
          </p>

          <div className="hero-actions">
            <a href="#work" className="btn-primary">
              <span>Explore Selected Work</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href={cvPath} download className="btn-secondary">
              <span>Résumé (PDF)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </a>
          </div>

          {/* Quick-switch Project Pills */}
          <div className="hero-fast-access" aria-label="Flagship projects direct jump">
            <span className="fast-access-label">KEY ARCHITECTURES:</span>
            <div className="fast-access-pills">
              {featuredProjects.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => onOpenProject(p)}
                  className="fast-access-pill"
                  title={`Inspect ${p.name} architecture`}
                >
                  <span className="pill-dot" style={{ backgroundColor: getProjectColor(p.color) }} />
                  <span>{p.name.split("/")[0].trim()}</span>
                  <span className="pill-arrow">↗</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Spatial Photographic Monolith */}
        <div className="hero-monolith-wrapper">
          <div
            className="hero-monolith-card"
            style={
              motion
                ? {
                    transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${panX * 0.6}px, ${panY * 0.6}px, 20px)`,
                    transition: "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  }
                : undefined
            }
          >
            {/* Ambient Edge Glow */}
            <div
              className="monolith-glow"
              style={
                motion
                  ? {
                      background: `radial-gradient(circle at ${50 + pointer.x * 35}% ${
                        50 - pointer.y * 35
                      }%, rgba(245, 158, 11, 0.28) 0%, rgba(6, 182, 212, 0.18) 45%, transparent 70%)`,
                    }
                  : undefined
              }
              aria-hidden="true"
            />

            {/* Subject Image Plane */}
            <div className="monolith-image-frame">
              <img
                src="/identity/cyril-emmanuel.png"
                width="460"
                height="460"
                alt="Cyril Emmanuel — Software Engineer and Technical Leader"
                className="monolith-portrait"
                loading="eager"
              />
              <div className="monolith-scanline" aria-hidden="true" />
            </div>

            {/* Monolith Footer Overlay / Honest Crediting */}
            <div className="monolith-meta">
              <div className="monolith-meta-header">
                <span className="monolith-tag">FOUNDER, EMINIFY</span>
                <span className="monolith-status">ONLINE</span>
              </div>
              <p className="monolith-caption">
                Interactive photographic depth stage · Responsive WebGL spatial illumination
              </p>
              <div className="monolith-stats">
                <div>
                  <small>DOMAINS</small>
                  <strong>Fintech · Platforms · AI</strong>
                </div>
                <div>
                  <small>FOUNDATION</small>
                  <strong>Full-Stack & Systems</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="hero-bottom-bar">
        <div className="hero-scroll-cue">
          <a href="#work" className="scroll-indicator" aria-label="Scroll to selected work">
            <span className="scroll-mouse">
              <span className="scroll-wheel" />
            </span>
            <span className="scroll-text">SCROLL TO INSPECT ARCHITECTURE</span>
          </a>
        </div>
        <div className="hero-footnote">
          <span>NO VENDOR CLONES · RIGOROUS SYSTEMS · FACTUAL EVIDENCE</span>
        </div>
      </div>
    </section>
  );
}

function getProjectColor(colorName: string): string {
  switch (colorName) {
    case "lime":
      return "#84cc16";
    case "blue":
      return "#38bdf8";
    case "violet":
      return "#a855f7";
    case "mint":
      return "#10b981";
    case "orange":
      return "#f97316";
    default:
      return "#f59e0b";
  }
}
