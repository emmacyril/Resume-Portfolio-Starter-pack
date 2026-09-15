import { useState } from "react";
import {
  categories,
  filterProjects,
  type Category,
  type Project,
} from "./data";

export type ProjectArchiveProps = {
  projects: Project[];
  onOpenProject: (project: Project) => void;
};

export default function ProjectArchive({
  projects,
  onOpenProject,
}: ProjectArchiveProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("All work");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = filterProjects(projects, selectedCategory, searchQuery);

  return (
    <section id="archive" className="section-container archive-section">
      <div className="section-header" data-reveal>
        <div className="section-eyebrow">
          <span className="eyebrow-num">03</span>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">COMPLETE PORTFOLIO INDEX</span>
        </div>
        <h2 className="section-title kinetic-heading">
          Curated Engineering <span className="text-gradient">Archive</span>
        </h2>
        <p className="section-subtitle">
          All {projects.length} curated systems, tools, and technical engagements with authentic stack
          composition, verifiable boundaries, and engineering decisions.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="archive-toolbar" data-reveal>
        {/* Category Filter Tabs */}
        <div className="archive-category-tabs" role="tablist" aria-label="Filter projects by domain">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`archive-cat-btn ${selectedCategory === cat ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <span>{cat}</span>
              <span className="cat-count">
                {cat === "All work"
                  ? projects.length
                  : projects.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        {/* Live Search Input */}
        <div className="archive-search-box">
          <svg
            className="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by system name, stack (e.g. Flutter, NestJS), or keyword…"
            className="archive-search-input"
            aria-label="Search projects by name, technology stack, or keyword"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="search-clear-btn"
              aria-label="Clear search query"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Results Header Status */}
      <div className="archive-status-bar" data-reveal>
        <span className="results-count">
          Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? "project" : "projects"}
        </span>
        {searchQuery && (
          <span className="active-filter-indicator">
            matching “{searchQuery}” in {selectedCategory}
          </span>
        )}
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="archive-grid" data-reveal>
          {filtered.map((project) => (
            <article
              key={project.id}
              className="archive-card"
              onClick={() => onOpenProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpenProject(project);
                }
              }}
              aria-label={`Inspect ${project.name}`}
            >
              <div className="card-top">
                <span className="card-category">{project.category}</span>
                <span className="card-year">{project.year}</span>
              </div>

              <h3 className="card-title">
                <span>{project.name}</span>
                <span className="card-arrow" aria-hidden="true">↗</span>
              </h3>

              <p className="card-eyebrow">{project.eyebrow}</p>
              <p className="card-summary">{project.summary}</p>

              <div className="card-stack">
                {project.stack.map((tech) => (
                  <span key={tech} className="mini-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="card-footer">
                <span className="card-status-pill">
                  <span className="status-dot" />
                  {project.status}
                </span>
                <span className="card-open-link">Inspect Architecture</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="archive-empty-state" data-reveal>
          <p className="empty-title">No projects match your search criteria.</p>
          <p className="empty-sub">
            Try resetting your search query or selecting “All work” to view all 24 projects.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All work");
              setSearchQuery("");
            }}
            className="btn-secondary empty-reset-btn"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
}
