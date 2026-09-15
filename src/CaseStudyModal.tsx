import { useEffect, useRef } from "react";
import type { Project } from "./data";
import { projectImage } from "./image-assets";

export type CaseStudyModalProps = {
  project: Project;
  onClose: () => void;
};

export default function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) {
      dialog.showModal();
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="case-study-modal"
      onCancel={onClose}
      onClick={(e) => {
        // Close if backdrop clicked
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
      aria-labelledby="modal-project-title"
    >
      <div className="modal-container">
        {/* Modal Top Bar */}
        <div className="modal-top-bar">
          <div className="modal-top-meta">
            <span className="meta-badge">{project.category}</span>
            <span className="meta-year">{project.year}</span>
            <span className="meta-status">{project.status}</span>
          </div>

          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close project modal"
            autoFocus
          >
            <span>Close</span>
            <span className="close-x">×</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="modal-scroll-content">
          <p className="modal-eyebrow">{project.eyebrow}</p>
          <h2 id="modal-project-title" className="modal-title">
            {project.name}
          </h2>
          <p className="modal-summary">{project.summary}</p>

          {/* Visual Showcase (if available) */}
          {project.image && (
            <figure className="modal-figure">
              <div className="modal-image-wrapper">
                <img
                  src={projectImage(project.image)}
                  alt={`${project.name} preview`}
                  width="1440"
                  height="900"
                  className="modal-image"
                  onError={(e) => {
                    if (
                      project.image &&
                      e.currentTarget.getAttribute("src") !== project.image
                    ) {
                      e.currentTarget.src = project.image;
                    }
                  }}
                />
                <div className="modal-kind-tag">
                  {project.imageKind === "documentation"
                    ? "SOURCE DOCUMENTATION"
                    : "INTERFACE PREVIEW"}
                </div>
              </div>
              {project.imageCaption && (
                <figcaption className="modal-caption">
                  {project.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Core Problem and Contribution Breakdown */}
          <div className="modal-two-column">
            <section className="modal-section-card">
              <h3 className="card-heading">01 / The Challenge</h3>
              <p>{project.challenge}</p>
            </section>

            <section className="modal-section-card">
              <h3 className="card-heading">02 / Engineering Contribution</h3>
              <p>{project.contribution}</p>
            </section>
          </div>

          {/* Architectural Decisions */}
          <section className="modal-decisions-section">
            <h3 className="card-heading">03 / Architectural Decisions</h3>
            <div className="decisions-list">
              {project.decisions.map((decision, idx) => (
                <div key={idx} className="decision-item">
                  <span className="decision-index">0{idx + 1}</span>
                  <p className="decision-text">{decision}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Operational Pipeline / Flow */}
          <section className="modal-flow-section">
            <h3 className="card-heading">04 / Lifecycle Pipeline</h3>
            <div className="flow-step-row">
              {project.flow.map((step, idx) => (
                <div key={step} className="flow-step-item">
                  <span className="step-num">STAGE 0{idx + 1}</span>
                  <strong className="step-title">{step}</strong>
                  {idx < project.flow.length - 1 && (
                    <span className="step-connector" aria-hidden="true">→</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* System Boundaries & Scope */}
          <section className="modal-boundary-section">
            <h3 className="card-heading">05 / Scope & Verification Boundary</h3>
            <p className="boundary-text">{project.boundary}</p>
          </section>

          {/* Technology Stack Tags */}
          <div className="modal-tech-stack">
            <span className="stack-title">TECHNOLOGY STACK:</span>
            <div className="stack-tags">
              {project.stack.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* External Action Links */}
          <div className="modal-actions-bar">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <span>Inspect Repository</span>
                <span className="icon-arrow">↗</span>
              </a>
            )}

            {project.site && (
              <a
                href={project.site}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                <span>Visit Live Platform</span>
                <span className="icon-arrow">↗</span>
              </a>
            )}

            <button onClick={onClose} className="btn-secondary">
              <span>Return to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
