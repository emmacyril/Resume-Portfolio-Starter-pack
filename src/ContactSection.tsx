import { useState } from "react";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "emmacyril@gmail.com";
  const cvPath = "/downloads/Cyril_Emmanuel_Resume.pdf";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API unavailable
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <section id="contact" className="section-container contact-section">
      <div className="section-header" data-reveal>
        <div className="section-eyebrow">
          <span className="eyebrow-num">05</span>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">INITIATE COLLABORATION</span>
        </div>
        <h2 className="section-title kinetic-heading">
          Let’s Build Something <span className="text-gradient">Verifiable</span>
        </h2>
        <p className="section-subtitle">
          Open to principal engineering positions, fractional/advisory CTO engagements,
          and high-impact product architecture collaborations globally.
        </p>
      </div>

      {/* Main Contact Card */}
      <div className="contact-card" data-reveal>
        <div className="contact-main">
          <span className="contact-kicker">DIRECT CHANNEL:</span>
          <a
            href={`mailto:${email}`}
            className="contact-email-link"
            aria-label={`Send email to ${email}`}
          >
            {email}
            <span className="email-arrow">↗</span>
          </a>

          <div className="contact-action-row">
            <button
              onClick={copyEmail}
              className={`btn-primary copy-btn ${copied ? "is-copied" : ""}`}
            >
              <span>{copied ? "Email Address Copied!" : "Copy Email Address"}</span>
              <span className="copy-icon">{copied ? "✓" : "📋"}</span>
            </button>

            <a href={cvPath} download className="btn-secondary">
              <span>Download Verified Résumé (PDF)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 4v16m0 0l-6-6m6 6l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Channel Details Grid */}
        <div className="contact-details-grid">
          <div className="contact-detail-box">
            <span className="detail-label">LOCATION & TIMEZONE</span>
            <strong className="detail-value">Lagos, Nigeria (WAT / UTC+1)</strong>
            <p className="detail-hint">Available for remote leadership & asynchronous workflows</p>
          </div>

          <div className="contact-detail-box">
            <span className="detail-label">VERIFIED PROFILES</span>
            <div className="detail-links">
              <a href="https://github.com/emmacyril" target="_blank" rel="noreferrer">
                GitHub <span>↗</span>
              </a>
              <a href="https://www.linkedin.com/in/emmacyril/" target="_blank" rel="noreferrer">
                LinkedIn <span>↗</span>
              </a>
              <a href="https://www.eminify.com/" target="_blank" rel="noreferrer">
                Eminify Studio <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
