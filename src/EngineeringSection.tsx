import { lazy, Suspense, useState } from "react";

const PaymentDemo = lazy(() => import("./PaymentDemo"));

export default function EngineeringSection() {
  const [showDemo, setShowDemo] = useState(false);

  const pillars = [
    {
      num: "01",
      title: "Deterministic State & Idempotency",
      tag: "FINTECH & TRANSACTIONS",
      body: "Money movement must remain consistent across network drops, repeated webhook payloads, and retried customer requests. Every mutation relies on idempotent keys, replay checks, and persistent state transitions.",
      flow: ["Idempotency Key", "State Machine Check", "Atomic Commit", "Replay Protection"],
    },
    {
      num: "02",
      title: "Double-Entry Ledger Integrity",
      tag: "ACCOUNTING & RECONCILIATION",
      body: "Financial figures are strictly represented in integer minor units to eliminate floating-point drift. Balanced dual-entry postings ensure debit and credit equality with an immutable append-only audit trail.",
      flow: ["Minor Unit Parse", "Balanced Postings", "Ledger Append", "Audit Reconcile"],
    },
    {
      num: "03",
      title: "Authority Boundaries & Lifecycle Control",
      tag: "PLATFORMS & GOVERNANCE",
      body: "Critical operations separate initiation from approval. Cross-service redirects undergo origin and destination verification, while deployment releases follow automated activation and safe rollback procedures.",
      flow: ["Role Verification", "Boundary Check", "Separated Approval", "Audit Trace"],
    },
  ];

  return (
    <section id="engineering" className="section-container engineering-section">
      <div className="section-header" data-reveal>
        <div className="section-eyebrow">
          <span className="eyebrow-num">02</span>
          <span className="eyebrow-line" />
          <span className="eyebrow-text">ENGINEERING JUDGEMENT</span>
        </div>
        <h2 className="section-title kinetic-heading">
          Architecture Behind <span className="text-gradient">The Experience</span>
        </h2>
        <p className="section-subtitle">
          Great engineering is revealed when systems fail gracefully. Here are the core disciplines
          governing production software across payments, identity, and developer tooling.
        </p>
      </div>

      {/* Engineering Pillars Grid */}
      <div className="pillars-grid" data-reveal>
        {pillars.map((pillar) => (
          <article key={pillar.num} className="pillar-card">
            <div className="pillar-header">
              <span className="pillar-num">{pillar.num}</span>
              <span className="pillar-tag">{pillar.tag}</span>
            </div>
            <h3 className="pillar-title">{pillar.title}</h3>
            <p className="pillar-body">{pillar.body}</p>
            <div className="pillar-pipeline">
              <span className="pipeline-label">VERIFIED PIPELINE:</span>
              <div className="pipeline-steps">
                {pillar.flow.map((step, idx) => (
                  <span key={step} className="pipeline-step">
                    {step}
                    {idx < pillar.flow.length - 1 && <i className="step-arrow">→</i>}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Sandbox Invitation Banner */}
      <div className="sandbox-banner" data-reveal>
        <div className="sandbox-banner-info">
          <div className="sandbox-badge">
            <span className="sandbox-badge-dot" />
            <span>INTERACTIVE VERIFICATION LAB</span>
          </div>
          <h3 className="sandbox-title">
            Test Idempotent Payment Handling in Real Time
          </h3>
          <p className="sandbox-desc">
            Explore how an append-only ledger handles network packet loss, duplicated requests,
            and payload tampering without corrupting customer balances.
          </p>
        </div>

        <button
          onClick={() => setShowDemo(!showDemo)}
          className="btn-primary sandbox-toggle"
          aria-expanded={showDemo}
          aria-controls="payment-sandbox-container"
        >
          <span>{showDemo ? "Close Sandbox" : "Launch Interactive Sandbox"}</span>
          <span className="toggle-symbol">{showDemo ? "×" : "▶"}</span>
        </button>
      </div>

      {/* Embedded Payment Demo Container */}
      {showDemo && (
        <div
          id="payment-sandbox-container"
          className="sandbox-embedded-wrapper"
          data-reveal
        >
          <div className="sandbox-disclaimer">
            <span>
              ℹ Note: This demonstration runs Cyril's tested ledger state engine in-memory. Illustrated balances are synthetic educational content for architecture verification.
            </span>
          </div>
          <Suspense
            fallback={
              <div className="sandbox-loading">
                <span className="loading-spinner" />
                <span>Initializing deterministic ledger runtime…</span>
              </div>
            }
          >
            <PaymentDemo />
          </Suspense>
        </div>
      )}
    </section>
  );
}
