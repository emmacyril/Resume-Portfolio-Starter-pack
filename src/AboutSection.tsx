export default function AboutSection() {
  const cvPath = "/downloads/Cyril_Emmanuel_Resume.pdf";
  const linkedinUrl = "https://www.linkedin.com/in/emmacyril/";

  const milestones = [
    {
      period: "2026 — PRESENT",
      role: "Senior Software Developer",
      organization: "AddressDox / PlotDox",
      detail:
        "Leading platform engineering across identity models, role-based authority boundaries, document issuance, and land administration services.",
    },
    {
      period: "2025 — PRESENT",
      role: "Chief Technology Officer (Contract)",
      organization: "RewaPay",
      detail:
        "Architecting double-entry payment ledger infrastructure, administrative approval workflows, and multi-currency transaction services.",
    },
    {
      period: "2019 — PRESENT",
      role: "Founder & Principal Engineer",
      organization: "Eminify",
      detail:
        "Founding and directing technical strategy, systems architecture, and engineering execution across client engagements and proprietary platforms.",
    },
    {
      period: "2021 — 2024",
      role: "Head of Technical",
      organization: "Qubators",
      detail:
        "Directing technical architecture, multi-platform mobile implementations, payment gateways, and engineering delivery teams.",
    },
  ];

  const coreSkills = [
    { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Rust (foundation)", "Dart", "PHP", "SQL"] },
    { category: "Frameworks & Runtimes", items: ["React", "Next.js", "Node.js", "NestJS", "Flutter", "Laravel", "FastAPI"] },
    { category: "Data & Systems", items: ["PostgreSQL", "Redis", "Docker", "Azure", "GCP", "Three.js / WebGL", "CI/CD"] },
    { category: "Architecture", items: ["Double-Entry Ledgers", "Idempotent APIs", "Distributed State", "Auth & RBAC", "System Auditing"] },
  ];

  return (
    <section id="about" className="section-container about-section">
      <div className="section-header" data-reveal>
        <div className="section-eyebrow">
          <span className="eyebrow-num">04</span>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">LEADERSHIP & BACKGROUND</span>
        </div>
        <h2 className="section-title kinetic-heading">
          Engineering Grounded in <span className="text-gradient">Responsibility</span>
        </h2>
        <p className="section-subtitle">
          A career shaped by hands-on systems programming, founding Eminify, and delivering
          mission-critical software across platforms, payments, and operational tooling.
        </p>
      </div>

      {/* Main About Layout */}
      <div className="about-content-grid" data-reveal>
        {/* Left Column: Authentic Portrait & Badges */}
        <div className="about-portrait-card">
          <div className="portrait-image-wrapper">
            <img
              src="/identity/cyril-emmanuel.png"
              width="460"
              height="460"
              alt="Cyril Emmanuel"
              className="about-portrait-img"
              loading="lazy"
            />
            <div className="portrait-overlay-glow" aria-hidden="true" />
          </div>
          <div className="portrait-info-box">
            <div className="info-row">
              <span className="info-title">CYRIL EMMANUEL</span>
              <span className="info-badge">LAGOS, NIGERIA</span>
            </div>
            <p className="info-tagline">
              Software Engineer · Founder, Eminify · Technical Leader
            </p>
            <div className="about-actions-row">
              <a href={cvPath} download className="btn-primary resume-btn">
                <span>Download Résumé (PDF)</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href={linkedinUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                <span>LinkedIn</span>
                <span className="icon-external">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Personal Narrative */}
        <div className="about-narrative-card">
          <h3 className="narrative-heading">
            “I stay close to the code, and responsible for the whole system.”
          </h3>
          <div className="narrative-paragraphs">
            <p>
              My path in technology spans from foundational IT operations and business workflows into
              full-stack systems engineering, technical team leadership, and founding Eminify.
            </p>
            <p>
              That trajectory fundamentally shapes how I approach architecture. I don&apos;t look at software
              in isolation; I care deeply about the customer interacting with the interface, the engineering
              team operating and maintaining the code, and the commercial business depending on its uptime.
            </p>
            <p>
              Whether structuring double-entry ledger invariants for RewaPay, architecting verifiable document
              integrity for AddressDox, or extending local-model agent runtimes in EMIWARP, my focus remains
              unwavering: predictable behavior, clear module boundaries, and verified production delivery.
            </p>
          </div>

          {/* Technical Skills Breakdown */}
          <div className="skills-breakdown">
            <h4 className="skills-heading">TECHNICAL CAPABILITIES:</h4>
            <div className="skills-grid">
              {coreSkills.map((grp) => (
                <div key={grp.category} className="skill-group">
                  <span className="skill-group-title">{grp.category}</span>
                  <div className="skill-group-tags">
                    {grp.items.map((skill) => (
                      <span key={skill} className="skill-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Timeline */}
      <div className="experience-section" data-reveal>
        <h3 className="experience-heading">LEADERSHIP & PROFESSIONAL MILESTONES</h3>
        <div className="timeline-grid">
          {milestones.map((m) => (
            <div key={m.organization} className="timeline-item">
              <div className="timeline-period-badge">
                <span>{m.period}</span>
              </div>
              <div className="timeline-content">
                <h4 className="timeline-org">{m.organization}</h4>
                <p className="timeline-role">{m.role}</p>
                <p className="timeline-detail">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
