export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const cvPath = "/downloads/Cyril_Emmanuel_Resume.pdf";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a href="#home" className="footer-brandmark">
            <span className="brand-primary">CYRIL</span>
            <span className="brand-secondary">EMMANUEL</span>
          </a>
          <p className="footer-desc">
            Principal Software Engineer, Founder of Eminify, and Technical Leader.
            Building deterministic, verifiable systems across platforms, payments, and AI.
          </p>
        </div>

        <div className="footer-nav-columns">
          <div className="footer-col">
            <span className="footer-col-title">NAVIGATION</span>
            <a href="#home">Home / Hero</a>
            <a href="#work">Flagship Systems</a>
            <a href="#engineering">Engineering Sandbox</a>
            <a href="#archive">Project Archive</a>
            <a href="#about">Leadership & Milestones</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">CONNECTED CHANNELS</span>
            <a href="https://github.com/emmacyril" target="_blank" rel="noreferrer">
              GitHub <span>↗</span>
            </a>
            <a href="https://www.linkedin.com/in/emmacyril/" target="_blank" rel="noreferrer">
              LinkedIn <span>↗</span>
            </a>
            <a href="https://www.eminify.com/" target="_blank" rel="noreferrer">
              Eminify Studio <span>↗</span>
            </a>
            <a href={cvPath} download>
              Résumé (PDF) <span>↓</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          <span>© {currentYear} CYRIL EMMANUEL. ALL RIGHTS RESERVED.</span>
          <span className="footer-built">BUILT WITH REACT, TYPESCRIPT, THREE.JS & VITE</span>
        </div>

        <button onClick={scrollToTop} className="back-to-top-btn" aria-label="Back to top of page">
          <span>BACK TO TOP</span>
          <span className="arrow-up">↑</span>
        </button>
      </div>
    </footer>
  );
}
