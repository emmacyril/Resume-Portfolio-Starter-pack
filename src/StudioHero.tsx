import { lazy, Suspense, useState } from "react";
import { projects } from "./data";
const StudioScene = lazy(() => import("./StudioScene"));
const featured = ["rewapay", "addressdox", "emiwarp", "qubsurf"].map(
  (id) => projects.find((p) => p.id === id)!,
);
export default function StudioHero({
  motion,
  onOpen,
}: {
  motion: boolean;
  onOpen: (p: (typeof projects)[number]) => void;
}) {
  const [index, setIndex] = useState(0),
    [angle, setAngle] = useState(-0.25);
  const project = featured[index];
  return (
    <section className="studio-hero" id="home" aria-labelledby="hero-title">
      <div className="studio-topline">
        <span>
          <i /> ENGINEER. FOUNDER. TECHNICAL LEAD.
        </span>
        <span>LAGOS, NIGERIA · OPEN TO THE WORLD</span>
      </div>
      <div className="studio-title">
        <p>A little context. A lot of curiosity.</p>
        <h1 id="hero-title" aria-label="Cyril Emmanuel">
          Cyril
          <br />
          Emmanuel<span aria-hidden="true">↗</span>
        </h1>
        <div className="studio-intro">
          <i />
          <p>
            I build the software.
            <br />
            Connect the systems.
            <br />
            And stay for what comes next.
          </p>
        </div>
        <a href="#work" className="studio-cta">
          Explore the work <span>↘</span>
        </a>
      </div>
      <div className="studio-object">
        <div className="studio-annotation">
          <span>01 / THE ENGINEERING ROOM</span>
          <span>DRAG TO LOOK AROUND ↔</span>
        </div>
        <Suspense
          fallback={
            <div className="studio-loading">Preparing the workspace…</div>
          }
        >
          <StudioScene project={project} motion={motion} angle={angle} />
        </Suspense>
        <div
          className="studio-view-controls"
          aria-label="Workspace viewing angle"
        >
          <button
            aria-label="Rotate workspace left"
            onClick={() => setAngle((a) => Math.max(-1.1, a - 0.3))}
          >
            ↶
          </button>
          <button
            aria-label="Reset workspace view"
            onClick={() => setAngle(-0.25)}
          >
            Reset view
          </button>
          <button
            aria-label="Rotate workspace right"
            onClick={() => setAngle((a) => Math.min(0.65, a + 0.3))}
          >
            ↷
          </button>
        </div>
        <span className="scene-axis" aria-hidden="true">
          Y<br />
          └── X <span>↗ Z</span>
        </span>
        <span className="scene-stamp">
          DESIGNED TO CONNECT.
          <br />
          ENGINEERED TO WORK.
        </span>
      </div>
      <div className="studio-project-controls">
        <span className="micro">ON THE DESK</span>
        <div
          className="studio-project-tabs"
          aria-label="Choose a project on the 3D monitor"
        >
          {featured.map((p, i) => (
            <button
              key={p.id}
              aria-pressed={index === i}
              onClick={() => setIndex(i)}
            >
              <span>0{i + 1}</span>
              {p.id === "addressdox" ? "AddressDox" : p.name}
              <i />
            </button>
          ))}
        </div>
        <button className="studio-project-open" onClick={() => onOpen(project)}>
          Inside {project.id === "addressdox" ? "AddressDox" : project.name}{" "}
          <span>↗</span>
        </button>
      </div>
      <div className="studio-bottom">
        <span>HANDS-ON ENGINEERING / END-TO-END THINKING</span>
        <a href="#work">SCROLL TO EXPLORE ↓</a>
      </div>
    </section>
  );
}
