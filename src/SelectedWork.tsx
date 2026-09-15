import { useState } from "react";
import type { Project } from "./data";
import { projectImage } from "./image-assets";

export type SelectedWorkProps = {
  projects: Project[];
  onOpenProject: (project: Project) => void;
};

export default function SelectedWork({
  projects,
  onOpenProject,
}: SelectedWorkProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const activeProject = projects[selectedIndex] ?? projects[0];

  return (
    <section id="work" className="section-container work-section">
      <div className="section-header" data-reveal>
        <div className="section-eyebrow">
          <span className="eyebrow-num">01</span>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">FLAGSHIP ARCHITECTURES</span>
        </div>
        <h2 className="section-title kinetic-heading">
          Selected Systems <span className="text-gradient">& Platforms</span>
        </h2>
        <p className="section-subtitle">
          Six focused implementations spanning high-integrity payments, distributed document platforms,
          terminal agent runtimes, and citizen-intake state machines.
        </p>
      </div>

      {/* Flagship Work Stage */}
      <div className="work-stage" data-reveal>
        {/* Navigation Selector Bar */}
        <div className="work-nav-bar" role="tablist" aria-label="Flagship projects selector">
          {projects.map((project, idx) => {
            const isCurrent = idx === selectedIndex;
            return (
              <button
                key={project.id}
                role="tab"
                aria-selected={isCurrent}
                aria-controls={`panel-${project.id}`}
                id={`tab-${project.id}`}
                className={`work-nav-tab ${isCurrent ? "is-active" : ""}`}
                onClick={() => setSelectedIndex(idx)}
              >
                <span className="tab-index">0{idx + 1}</span>
                <span className="tab-name">
                  {project.id === "addressdox" ? "AddressDox" : project.name}
                </span>
                <span
                  className="tab-badge"
                  data-status={project.status.toLowerCase().replace(/\s+/g, "-")}
                >
                  {project.status}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Project Staging Panel */}
        <div
          id={`panel-${activeProject.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeProject.id}`}
          className="work-display-panel"
        >
          {/* Visual Showcase Card */}
          <div className="work-visual-card">
            <div className="work-visual-header">
              <div className="window-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="window-category">{activeProject.category}</span>
              <span className="window-year">{activeProject.year}</span>
            </div>

            <div className="work-visual-frame">
              {activeProject.image ? (
                <img
                  src={projectImage(activeProject.image)}
                  alt={`${activeProject.name} — ${
                    activeProject.imageKind === "documentation"
                      ? "Architecture & structural diagram"
                      : "User interface preview"
                  }`}
                  width="1440"
                  height="900"
                  className="work-preview-image"
                  loading="lazy"
                  onError={(e) => {
                    if (
                      activeProject.image &&
                      e.currentTarget.getAttribute("src") !== activeProject.image
                    ) {
                      e.currentTarget.src = activeProject.image;
                    }
                  }}
                />
              ) : (
                <div className="work-placeholder-frame">
                  <span>Architecture Documentation</span>
                </div>
              )}

              {/* Attribution / Kind Badge */}
              <div className="work-kind-badge">
                <span className="kind-icon">
                  {activeProject.imageKind === "documentation" ? "▤" : "▣"}
                </span>
                <span>
                  {activeProject.imageKind === "documentation"
                    ? "SOURCE DOCUMENTATION"
                    : "INTERFACE PREVIEW"}
                </span>
              </div>
            </div>

            {/* Visual Caption */}
            {activeProject.imageCaption && (
              <p className="work-visual-caption">
                {activeProject.imageCaption}
              </p>
            )}
          </div>

          {/* Details & Architecture Card */}
          <div className="work-info-card">
            <div className="work-info-eyebrow">
              <span>{activeProject.eyebrow}</span>
              <span className="work-status-tag">{activeProject.status}</span>
            </div>

            <h3 className="work-info-title">{activeProject.name}</h3>
            <p className="work-info-summary">{activeProject.summary}</p>

            {/* Architecture Flow Stepper */}
            <div className="work-flow-container">
              <span className="flow-label">EXECUTION PIPELINE:</span>
              <div className="work-flow-steps">
                {activeProject.flow.map((step, sIdx) => (
                  <div key={step} className="flow-step">
                    <span className="flow-step-num">0{sIdx + 1}</span>
                    <span className="flow-step-name">{step}</span>
                    {sIdx < activeProject.flow.length - 1 && (
                      <span className="flow-step-arrow" aria-hidden="true">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Contribution */}
            <div className="work-contribution-box">
              <span className="box-title">ENGINEERING ROLE & CONTRIBUTION:</span>
              <p>{activeProject.contribution}</p>
            </div>

            {/* Key Decisions */}
            <div className="work-decisions-box">
              <span className="box-title">CORE ARCHITECTURAL DECISIONS:</span>
              <ul>
                {activeProject.decisions.slice(0, 3).map((decision, dIdx) => (
                  <li key={dIdx}>
                    <span className="bullet">›</span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Honest Boundary */}
            <div className="work-boundary-box">
              <span className="box-title">SYSTEM SCOPE & BOUNDARIES:</span>
              <p>{activeProject.boundary}</p>
            </div>

            {/* Stack Badges */}
            <div className="work-stack-list">
              {activeProject.stack.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="work-card-actions">
              <button
                onClick={() => onOpenProject(activeProject)}
                className="btn-primary"
              >
                <span>Inspect Full Case Study</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>

              {activeProject.repo && (
                <a
                  href={activeProject.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <span>Repository</span>
                  <span className="icon-external">↗</span>
                </a>
              )}

              {activeProject.site && (
                <a
                  href={activeProject.site}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <span>Live Site</span>
                  <span className="icon-external">↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
