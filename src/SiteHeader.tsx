import { useState } from "react";

export type SiteHeaderProps = {
  motion: boolean;
  onToggleMotion: () => void;
};

export default function SiteHeader({ motion, onToggleMotion }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cvPath = "/downloads/Cyril_Emmanuel_Resume.pdf";

  const navItems = [
    { num: "01", label: "Work", href: "#work" },
    { num: "02", label: "Engineering", href: "#engineering" },
    { num: "03", label: "Archive", href: "#archive" },
    { num: "04", label: "About", href: "#about" },
    { num: "05", label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <a className="skip-navigation" href="#work">
        Skip to selected work
      </a>

      <header className="site-header">
        {/* Logo / Brandmark */}
        <a href="#home" className="header-brandmark" aria-label="Cyril Emmanuel — Home">
          <span className="brand-primary">CYRIL</span>
          <span className="brand-secondary">EMMANUEL</span>
          <span className="brand-role">SYS/ENG</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="header-nav" aria-label="Main Navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              <span className="nav-num">{item.num}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions">
          {/* Motion Toggle */}
          <button
            onClick={onToggleMotion}
            className={`motion-toggle-btn ${motion ? "is-active" : "is-reduced"}`}
            aria-label={motion ? "Disable 3D motion and animations" : "Enable 3D motion and animations"}
            title={motion ? "Disable 3D motion and animations" : "Enable 3D motion and animations"}
          >
            <span className="motion-dot" />
            <span className="motion-text">{motion ? "MOTION ON" : "MOTION OFF"}</span>
          </button>

          {/* Résumé Quick Link */}
          <a href={cvPath} download className="header-resume-link">
            <span>Résumé</span>
            <span className="resume-arrow">↓</span>
          </a>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-menu-trigger"
            aria-label="Open mobile navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="mobile-drawer-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="drawer-header">
              <a
                href="#home"
                className="header-brandmark"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="brand-primary">CYRIL</span>
                <span className="brand-secondary">EMMANUEL</span>
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="drawer-close-btn"
                aria-label="Close mobile navigation"
              >
                ×
              </button>
            </div>

            <nav className="drawer-nav">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="drawer-num">{item.num}</span>
                  <span className="drawer-label">{item.label}</span>
                  <span className="drawer-arrow">↗</span>
                </a>
              ))}
            </nav>

            <div className="drawer-footer">
              <button
                onClick={() => {
                  onToggleMotion();
                  setMobileMenuOpen(false);
                }}
                className="drawer-motion-btn"
              >
                <span>Motion: {motion ? "ON" : "REDUCED"}</span>
              </button>
              <a href={cvPath} download className="drawer-resume-btn">
                <span>Download Résumé (PDF)</span>
              </a>
              <div className="drawer-socials">
                <a href="https://github.com/emmacyril" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/emmacyril/" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a href="https://www.eminify.com/" target="_blank" rel="noreferrer">
                  Eminify
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
