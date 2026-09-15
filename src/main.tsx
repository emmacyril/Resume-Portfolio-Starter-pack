import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { projects, type Project } from "./data";
import "@fontsource-variable/dm-sans/wght.css";
import "./styles.css";

import SiteHeader from "./SiteHeader";
import SpatialHero from "./SpatialHero";
import SelectedWork from "./SelectedWork";
import EngineeringSection from "./EngineeringSection";
import ProjectArchive from "./ProjectArchive";
import AboutSection from "./AboutSection";
import ContactSection from "./ContactSection";
import SiteFooter from "./SiteFooter";
import CaseStudyModal from "./CaseStudyModal";

// The 6 flagship architectures requested in the brief
const flagshipIds = [
  "rewapay",
  "addressdox",
  "emiwarp",
  "koletmoni",
  "ratelline",
  "qubsurf",
];

const flagshipProjects = flagshipIds
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is Project => p !== undefined);

function useMotionPreference() {
  const [motion, setMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setMotion(!mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return [motion, setMotion] as const;
}

function useScrollReveals(motion: boolean) {
  useEffect(() => {
    if (!motion) {
      // If motion is off, reveal all elements immediately
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-visible");
        el.classList.remove("will-reveal");
      });
      return;
    }

    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach((item) => {
      item.classList.add("will-reveal");
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
      items.forEach((item) => item.classList.remove("will-reveal"));
    };
  }, [motion]);
}

function App() {
  const [motion, setMotion] = useMotionPreference();
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useScrollReveals(motion);

  // Sync data-motion attribute on html element
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);

  // URL Hash synchronization for project deep linking (#project=rewapay)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash);
      const projectId = params.get("project");
      if (projectId) {
        const found = projects.find((p) => p.id === projectId);
        setActiveProject(found || null);
      } else {
        setActiveProject(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handleHashChange);
    };
  }, []);

  const handleOpenProject = (project: Project) => {
    window.history.pushState(
      { projectModal: true },
      "",
      `#project=${project.id}`
    );
    setActiveProject(project);
  };

  const handleCloseProject = () => {
    setActiveProject(null);
    if (window.history.state?.projectModal) {
      window.history.back();
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  return (
    <div className="portfolio-app-root">
      <SiteHeader
        motion={motion}
        onToggleMotion={() => setMotion((prev) => !prev)}
      />

      <main id="main-content">
        <SpatialHero
          motion={motion}
          onOpenProject={handleOpenProject}
          featuredProjects={flagshipProjects}
        />

        <SelectedWork
          projects={flagshipProjects}
          onOpenProject={handleOpenProject}
        />

        <EngineeringSection />

        <ProjectArchive
          projects={projects}
          onOpenProject={handleOpenProject}
        />

        <AboutSection />

        <ContactSection />
      </main>

      <SiteFooter />

      {activeProject && (
        <CaseStudyModal
          project={activeProject}
          onClose={handleCloseProject}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
