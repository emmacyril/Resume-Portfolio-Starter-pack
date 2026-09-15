import { StrictMode, Suspense, lazy, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  categories,
  filterProjects,
  projects,
  type Category,
  type Project,
} from "./data";
import { projectImage } from "./image-assets";
import "@fontsource-variable/dm-sans/wght.css";
import "./styles.css";

import StudioHero from "./StudioHero";
const PaymentBoundary = lazy(() => import("./PaymentDemo"));
const selectedIds = [
  "rewapay",
  "addressdox",
  "emiwarp",
  "qubsurf",
  "koletmoni",
  "ratelline",
];
const selected = selectedIds.map((id) => projects.find((p) => p.id === id)!);
const cv = "/downloads/Cyril_Emmanuel_Resume.pdf";
const links = {
  github: "https://github.com/emmacyril",
  linkedin: "https://www.linkedin.com/in/emmacyril/",
  studio: "https://www.eminify.com/",
  email: "mailto:emmacyril@gmail.com",
};
function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function SystemMark() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 3 35 11v18L20 37 5 29V11L20 3Zm0 16L5 11m15 8 15-8M20 19v18M12 7l15 8v9"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
function ProjectImage({
  project,
  eager = false,
}: {
  project: Project;
  eager?: boolean;
}) {
  return (
    <img
      src={projectImage(project.image)}
      width="1440"
      height="900"
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      alt={`${project.name} — ${project.imageKind === "documentation" ? "public source documentation" : "public interface preview"}`}
      onError={(e) => {
        if (
          project.image &&
          e.currentTarget.getAttribute("src") !== project.image
        )
          e.currentTarget.src = project.image;
      }}
    />
  );
}
function useMotion() {
  const [motion, setMotion] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setMotion(!q.matches);
    q.addEventListener("change", onChange);
    return () => q.removeEventListener("change", onChange);
  }, []);
  return [motion, setMotion] as const;
}
function useReveals(motion: boolean) {
  useEffect(() => {
    if (!motion) return;
    const items = [...document.querySelectorAll<HTMLElement>("[data-reveal]")];
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.07 },
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
function Menu({ close }: { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current!;
    d.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);
  return (
    <dialog
      className="menu-dialog"
      ref={dialog}
      onCancel={close}
      aria-label="Site navigation"
    >
      <div className="menu-top">
        <a href="#home" onClick={close}>
          cyril<span>emmanuel</span>
        </a>
        <button onClick={close} autoFocus>
          Close <span>×</span>
        </button>
      </div>
      <nav>
        {[
          ["01", "Selected work", "#work"],
          ["02", "Engineering", "#approach"],
          ["03", "About Cyril", "#about"],
          ["04", "Get in touch", "#contact"],
        ].map(([n, label, href]) => (
          <a href={href} key={n} onClick={close}>
            <sup>{n}</sup>
            <span>{label}</span>
            <Arrow diagonal />
          </a>
        ))}
      </nav>
      <div className="menu-bottom">
        <p>
          Software engineer.
          <br />
          Founder. Technical leader.
        </p>
        <div>
          <a href={links.github}>GitHub ↗</a>
          <a href={links.linkedin}>LinkedIn ↗</a>
          <a href={cv} download>
            Résumé ↓
          </a>
        </div>
        <span>Lagos, Nigeria / Working globally</span>
      </div>
    </dialog>
  );
}
function CaseStudy({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = dialog.current!;
    d.showModal();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="case-dialog"
      onCancel={onClose}
      aria-labelledby="case-title"
    >
      <div className="case-toolbar">
        <span>Selected engineering / {project.year}</span>
        <button onClick={onClose} aria-label="Close project" autoFocus>
          Close <span>×</span>
        </button>
      </div>
      <div className="case-body">
        <p className="eyebrow">{project.eyebrow}</p>
        <h2 id="case-title">{project.name}</h2>
        <p className="case-summary">{project.summary}</p>
        <div className="case-meta">
          <span>{project.status}</span>
          <span>{project.stack.join(" · ")}</span>
        </div>
        {project.image ? (
          <figure className={`case-image image-${project.id}`}>
            <ProjectImage project={project} eager />
            <figcaption>{project.imageCaption}</figcaption>
          </figure>
        ) : null}
        <div className="case-columns">
          <section>
            <p className="eyebrow">01 / The problem</p>
            <h3>{project.challenge}</h3>
          </section>
          <section>
            <p className="eyebrow">02 / My contribution</p>
            <p>{project.contribution}</p>
          </section>
        </div>
        <section className="case-decisions">
          <p className="eyebrow">03 / Engineering decisions</p>
          {project.decisions.map((decision, i) => (
            <div key={decision}>
              <span>0{i + 1}</span>
              <p>{decision}</p>
            </div>
          ))}
        </section>
        <div className="case-flow" aria-label="Conceptual workflow">
          {project.flow.map((step, i) => (
            <div key={step}>
              <small>0{i + 1}</small>
              <span>{step}</span>
              {i < 3 ? <Arrow /> : null}
            </div>
          ))}
        </div>
        <div className="case-status">
          <p className="eyebrow">Current scope</p>
          <p>{project.boundary}</p>
        </div>
        <div className="case-links">
          {project.repo ? (
            <a
              className="pill"
              href={project.repo}
              target="_blank"
              rel="noreferrer"
            >
              Explore repository <Arrow diagonal />
            </a>
          ) : null}
          {project.site ? (
            <a
              className="pill"
              href={project.site}
              target="_blank"
              rel="noreferrer"
            >
              Visit public site <Arrow diagonal />
            </a>
          ) : null}
          <button className="text-link" onClick={onClose}>
            Back to the work
          </button>
        </div>
      </div>
    </dialog>
  );
}
function WorkShowcase({ onOpen }: { onOpen: (project: Project) => void }) {
  const [index, setIndex] = useState(0);
  const project = selected[index];
  return (
    <div className="work-showcase">
      <div className="work-selector" aria-label="Choose a featured project">
        {selected.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            aria-pressed={index === i}
          >
            <small>0{i + 1}</small>
            <span>{p.id === "addressdox" ? "AddressDox" : p.name}</span>
            <Arrow diagonal />
          </button>
        ))}
        <p>
          Different products.
          <br />
          One commitment to the whole system.
        </p>
      </div>
      <article className="work-feature" key={project.id}>
        <button
          className={`feature-image image-${project.id}`}
          onClick={() => onOpen(project)}
          aria-label={`Explore ${project.name}`}
        >
          <div className="feature-browser">
            <i />
            <i />
            <i />
            <span>{project.category}</span>
          </div>
          <ProjectImage project={project} eager />
          <span className="feature-open">
            Explore
            <br />
            project <Arrow diagonal />
          </span>
        </button>
        <div className="feature-caption">
          <div>
            <p className="micro">{project.eyebrow}</p>
            <button onClick={() => onOpen(project)}>
              {project.name} <Arrow diagonal />
            </button>
            <p>{project.summary}</p>
          </div>
          <span className="feature-year">
            {project.year}
            <small>{project.status}</small>
          </span>
        </div>
        <div className="feature-pagination">
          <span>
            0{index + 1} <i>/ 0{selected.length}</i>
          </span>
          <div>
            <button
              aria-label="Previous featured project"
              onClick={() =>
                setIndex((index + selected.length - 1) % selected.length)
              }
            >
              ←
            </button>
            <button
              aria-label="Next featured project"
              onClick={() => setIndex((index + 1) % selected.length)}
            >
              →
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
const principles = [
  {
    title: "Make the experience clear.",
    label: "01 / INTERFACE",
    body: "The interface is where someone decides what to do next. I connect that experience to permissions, validation and predictable responses.",
    flow: ["Intent", "Interface", "API contract"],
  },
  {
    title: "Expect the unexpected.",
    label: "02 / SYSTEMS",
    body: "Requests repeat. Providers time out. A dependable system recovers without duplicating actions or losing their history.",
    flow: ["Request", "Retry safely", "Preserve state"],
  },
  {
    title: "Build for the people after you.",
    label: "03 / OPERATIONS",
    body: "Observability, approvals, reversals and handover belong in the product. They give the team control long after the first release.",
    flow: ["Release", "Observe", "Operate"],
  },
];
function Engineering() {
  const [active, setActive] = useState(0),
    [lab, setLab] = useState(false);
  return (
    <section id="approach" className="approach-section section-pad">
      <div className="section-label">
        <span>03 / UNDER THE SURFACE</span>
        <SystemMark />
      </div>
      <h2 className="display-heading" data-reveal>
        The interface is
        <br />
        <span>only the beginning.</span>
      </h2>
      <div className="engineering-grid">
        <div className="engineering-intro">
          <p>
            What happens after the click
            <br />
            is part of the experience.
          </p>
          <div className="system-orbit" aria-hidden="true">
            <div />
            <div />
            <div />
            <span>UI</span>
            <span>API</span>
            <span>DATA</span>
            <b>↗</b>
          </div>
          <span className="micro">
            INTERFACE / SERVICE / OPERATIONAL REALITY
          </span>
        </div>
        <div className="principle-list">
          {principles.map((p, i) => (
            <article
              key={p.title}
              className={i === active ? "principle-active" : ""}
            >
              <button
                onClick={() => setActive(active === i ? -1 : i)}
                aria-expanded={active === i}
                aria-controls={`principle-${i}`}
              >
                <small>{p.label}</small>
                <span>{p.title}</span>
                <b>{i === active ? "−" : "+"}</b>
              </button>
              <div id={`principle-${i}`} hidden={active !== i}>
                <p>{p.body}</p>
                <div className="principle-flow">
                  {p.flow.map((x, j) => (
                    <span key={x}>
                      {x}
                      {j < 2 ? <i>→</i> : null}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="lab-invitation">
        <div>
          <span className="micro">A SMALL INTERACTIVE EXAMPLE</span>
          <h3>
            One payment.
            <br />
            Even when the request repeats.
          </h3>
          <p>
            Explore what happens when a response is lost—and the same request
            arrives again.
          </p>
        </div>
        <button
          className="circle-link"
          onClick={() => setLab(!lab)}
          aria-expanded={lab}
          aria-controls="engineering-demo"
        >
          <span>{lab ? "Close demo" : "Try the demo"}</span>
          {lab ? <b>−</b> : <Arrow diagonal />}
        </button>
      </div>
      {lab ? (
        <div id="engineering-demo" className="engineering-demo">
          <Suspense fallback={<p>Loading the demonstration…</p>}>
            <PaymentBoundary />
          </Suspense>
        </div>
      ) : null}
    </section>
  );
}
function App() {
  const [motion, setMotion] = useMotion();
  const [menu, setMenu] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [archive, setArchive] = useState(false);
  const [category, setCategory] = useState<Category>("All work");
  const [query, setQuery] = useState("");
  useReveals(motion);
  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
  }, [motion]);
  useEffect(() => {
    const resolve = () => {
      const id = new URLSearchParams(location.hash.slice(1)).get("project");
      setActiveProject(id ? (projects.find((p) => p.id === id) ?? null) : null);
    };
    resolve();
    window.addEventListener("hashchange", resolve);
    window.addEventListener("popstate", resolve);
    return () => {
      window.removeEventListener("hashchange", resolve);
      window.removeEventListener("popstate", resolve);
    };
  }, []);
  function openProject(p: Project) {
    history.pushState({ portfolioCase: true }, "", `#project=${p.id}`);
    setActiveProject(p);
  }
  function closeProject() {
    setActiveProject(null);
    if (history.state?.portfolioCase) history.back();
    else history.replaceState(null, "", "#work");
  }
  const filtered = filterProjects(projects, category, query);
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Cyril Emmanuel home">
          Cyril<span>Emmanuel</span>
          <i />
        </a>
        <div className="header-socials">
          <span>Elsewhere /</span>
          <a href={links.github}>gh</a>
          <i>/</i>
          <a href={links.linkedin}>in</a>
        </div>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">
            Let’s talk <Arrow diagonal />
          </a>
        </nav>
        <button
          className="menu-button"
          onClick={() => setMenu(true)}
          aria-label="Open navigation menu"
        >
          <span />
          <span />
        </button>
      </header>
      <main>
        <StudioHero motion={motion} onOpen={openProject} />
        <section id="work" className="work-section section-pad">
          <div className="section-label">
            <span>02 / SELECTED WORK</span>
            <span>2023 — 2026</span>
          </div>
          <div className="section-heading" data-reveal>
            <h2 className="display-heading">
              A few things
              <br />
              <span>I’ve put into the world.</span>
            </h2>
            <p>
              Products, platforms and the decisions that connect them. A closer
              look at the work.
            </p>
          </div>
          <WorkShowcase onOpen={openProject} />
          <div className="archive-toggle">
            <div>
              <span className="micro">THE WIDER BODY OF WORK</span>
              <h3>There’s more to the story.</h3>
            </div>
            <button
              className="pill"
              onClick={() => setArchive(!archive)}
              aria-expanded={archive}
              aria-controls="project-archive"
            >
              {archive
                ? "Close project index"
                : `Explore all ${projects.length} projects`}
              <span>{archive ? "−" : "+"}</span>
            </button>
          </div>
          {archive ? (
            <div id="project-archive" className="project-archive">
              <div className="archive-tools">
                <label>
                  Find a project
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, stack or domain…"
                  />
                </label>
                <label>
                  Filter by domain
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                  >
                    {categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="archive-count" role="status">
                {filtered.length}{" "}
                {filtered.length === 1 ? "project" : "projects"}
              </p>
              {filtered.map((p) => (
                <button
                  key={p.id}
                  className="archive-row"
                  onClick={() => openProject(p)}
                >
                  <span>{p.name}</span>
                  <span>{p.eyebrow}</span>
                  <small>{p.status}</small>
                  <Arrow diagonal />
                </button>
              ))}
              {!filtered.length ? (
                <p className="empty-state">
                  No matching projects. Try a different name or domain.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <Engineering />
        <section id="about" className="about-section section-pad">
          <div className="section-label">
            <span>04 / MORE THAN THE CODE</span>
            <SystemMark />
          </div>
          <h2 className="display-heading" data-reveal>
            A builder’s curiosity.
            <br />
            <span>A founder’s perspective.</span>
          </h2>
          <div className="about-grid">
            <figure className="about-portrait" data-reveal>
              <img
                src="/identity/cyril-emmanuel.png"
                width="460"
                height="460"
                alt="Cyril Emmanuel, wearing glasses and looking to the left"
                loading="lazy"
              />
              <figcaption>
                CYRIL EMMANUEL <span>LAGOS, NIGERIA</span>
              </figcaption>
              <i aria-hidden="true">✳</i>
            </figure>
            <div className="about-copy" data-reveal>
              <p className="about-lead">
                I stay close to the code.
                <br />
                And responsible for the whole.
              </p>
              <p>
                My career has taken me from institutional ICT and business
                operations into full-stack engineering, technical leadership and
                founding Eminify.
              </p>
              <p>
                That path shapes how I build. I care about the person using the
                product, the team maintaining it and the business depending on
                it. Good engineering connects all three.
              </p>
              <div className="about-links">
                <a className="text-link" href={cv} download>
                  Download résumé <span>↓</span>
                </a>
                <a className="text-link" href={links.linkedin}>
                  The full story <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
          <div className="experience-line">
            {[
              ["2026—PRESENT", "AddressDox", "Senior Software Developer"],
              [
                "2025—PRESENT",
                "RewaPay",
                "Chief Technology Officer · Contract",
              ],
              ["2019—PRESENT", "Eminify", "Founder & Lead Engineer"],
              ["2021—2024", "Qubators", "Head of Technical"],
            ].map(([date, name, role]) => (
              <div key={name}>
                <span>{date}</span>
                <strong>{name}</strong>
                <p>{role}</p>
                <Arrow diagonal />
              </div>
            ))}
          </div>
          <div className="stack-row">
            <span className="micro">TOOLS OF THE TRADE</span>
            <p>
              TypeScript / React / Next.js / Node.js / NestJS / Laravel / Python
              / Flutter / PostgreSQL / Docker
            </p>
          </div>
        </section>
        <section id="contact" className="contact-section section-pad">
          <div className="section-label">
            <span>05 / THE NEXT CHAPTER</span>
            <span>LAGOS ↗ EVERYWHERE</span>
          </div>
          <div className="contact-intro">
            <p>
              Engineering opportunities. Product partnerships.
              <br />A conversation about something worth building.
            </p>
            <SystemMark />
          </div>
          <a className="contact-title" href={links.email}>
            What are you
            <br />
            <span>working on?</span>
            <Arrow diagonal />
          </a>
          <div className="contact-bottom">
            <a href={links.email}>
              emmacyril@gmail.com <Arrow diagonal />
            </a>
            <a className="text-link" href={cv} download>
              Résumé ↓
            </a>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <a className="wordmark" href="#home">
          Cyril<span>Emmanuel</span>
          <i />
        </a>
        <div>
          <a href={links.github}>GitHub ↗</a>
          <a href={links.linkedin}>LinkedIn ↗</a>
          <a href={links.studio}>Eminify ↗</a>
        </div>
        <span>© {new Date().getFullYear()} CYRIL EMMANUEL</span>
      </footer>
      <button
        className="motion-control"
        onClick={() => setMotion(!motion)}
        aria-pressed={!motion}
      >
        {motion ? "Ⅱ Pause motion" : "▶ Resume motion"}
      </button>
      {menu ? <Menu close={() => setMenu(false)} /> : null}
      {activeProject ? (
        <CaseStudy project={activeProject} onClose={closeProject} />
      ) : null}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
