import {
  StrictMode,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
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

const HeroScene = lazy(() => import("./HeroScene"));
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
const layers = [
  { name: "Interface", description: "Make the next action clear." },
  { name: "API", description: "Give the rules a reliable boundary." },
  { name: "Data", description: "Preserve the truth of every transaction." },
];

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
function Asterisk() {
  return (
    <svg
      viewBox="0 0 40 40"
      width="36"
      height="36"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 0v40M0 20h40M6 6l28 28M6 34 34 6"
        stroke="currentColor"
        strokeWidth="4"
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
function WorkCard({
  project,
  index,
  onOpen,
  motion,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
  motion: boolean;
}) {
  const tilt = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!motion || event.pointerType !== "mouse") return;
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--rx",
      `${-((event.clientY - r.top) / r.height - 0.5) * 5}deg`,
    );
    event.currentTarget.style.setProperty(
      "--ry",
      `${((event.clientX - r.left) / r.width - 0.5) * 5}deg`,
    );
  };
  const reset = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <article className={`work-card work-${project.id}`} data-reveal>
      <button
        className="work-visual"
        onClick={onOpen}
        onPointerMove={tilt}
        onPointerLeave={reset}
        aria-label={`Explore ${project.name}`}
      >
        <span className="work-number">
          0{index + 1} / {project.year}
        </span>
        <div className={`image-stage image-${project.id}`}>
          <ProjectImage project={project} />
        </div>
        <span className="work-open">
          <Arrow diagonal />
        </span>
        <span className="work-visual-label">
          {project.imageKind === "documentation"
            ? "Repository documentation"
            : "Public product preview"}
        </span>
      </button>
      <div className="work-card-meta">
        <button onClick={onOpen}>
          {project.name} <Arrow diagonal />
        </button>
        <span>{project.category}</span>
      </div>
      <p>{project.summary}</p>
    </article>
  );
}
function App() {
  const [motion, setMotion] = useMotion();
  const [layer, setLayer] = useState(-1);
  const [menu, setMenu] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [archive, setArchive] = useState(false);
  const [category, setCategory] = useState<Category>("All work");
  const [query, setQuery] = useState("");
  const [lab, setLab] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      if (copyTimer.current) clearTimeout(copyTimer.current);
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
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText("emmacyril@gmail.com");
      setCopied(true);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      window.location.href = links.email;
    }
  }
  const filtered = filterProjects(projects, category, query);
  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Cyril Emmanuel home">
          cyril<span>emmanuel</span>
          <i />
        </a>
        <span className="header-location">
          LAGOS, NG <span>—</span> GLOBAL OUTLOOK
        </span>
        <nav aria-label="Main navigation">
          <a href="#work">
            Work <sup>06</sup>
          </a>
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
        <section id="home" className="hero" aria-labelledby="hero-title">
          <div className="hero-background" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-orbit">
            <Suspense
              fallback={
                <div className="scene-fallback">
                  <i />
                  <i />
                  <i />
                </div>
              }
            >
              <HeroScene motion={motion} layer={layer} />
            </Suspense>
          </div>
          <div className="hero-content">
            <p className="hero-kicker">
              <span className="status-dot" /> SOFTWARE ENGINEER & TECHNICAL LEAD
            </p>
            <h1 id="hero-title">
              <span>Cyril</span>
              <span>
                Emmanuel<span className="name-period">.</span>
              </span>
            </h1>
            <div className="hero-intro">
              <p>
                I engineer the systems
                <br />
                behind the experience.
              </p>
              <a
                className="hero-cta"
                href="#work"
                aria-label="Explore selected work"
              >
                <span>Explore the work</span>
                <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-aside">
            <span className="eyebrow">FOUNDER, EMINIFY</span>
            <p>
              Payments. Identity.
              <br />
              Products that connect it all.
            </p>
          </div>
          <div className="scene-caption">
            <span className="scene-caption-line" />
            <span>
              {layer < 0
                ? "A SYSTEM, IN THREE LAYERS"
                : layers[layer].description}
            </span>
          </div>
          <div className="hero-bottom">
            <a href="#intro" className="scroll-link">
              SCROLL TO EXPLORE <span>↓</span>
            </a>
            <div
              className="layer-controls"
              aria-label="Explore the 3D system layers"
            >
              {layers.map((item, i) => (
                <button
                  key={item.name}
                  aria-pressed={layer === i}
                  onClick={() => setLayer(layer === i ? -1 : i)}
                >
                  <small>0{i + 1}</small>
                  {item.name}
                </button>
              ))}
            </div>
            <button
              className="motion-control"
              onClick={() => setMotion(!motion)}
              aria-pressed={!motion}
            >
              {motion ? "Ⅱ Pause motion" : "▶ Resume motion"}
            </button>
          </div>
        </section>
        <section id="intro" className="intro-section section-pad">
          <div className="section-label">
            <span>01 / THE PRACTICE</span>
            <Asterisk />
          </div>
          <div className="intro-copy" data-reveal>
            <h2>
              From the first interaction
              <br />
              to the <em>last mile.</em>
            </h2>
            <div className="intro-detail">
              <p>
                I work across the interface, the service and the operational
                reality behind them. Payment flows, identity, AI integrations
                and the tools people use to run a business.
              </p>
              <p>
                My work combines hands-on engineering with technical leadership
                and a founder’s understanding of what needs to happen next.
              </p>
            </div>
          </div>
          <div className="practice-strip">
            <span>PAYMENTS & INTEGRATIONS</span>
            <i>↗</i>
            <span>IDENTITY & PLATFORMS</span>
            <i>↗</i>
            <span>AI & DEVELOPER TOOLS</span>
          </div>
        </section>
        <section id="work" className="work-section section-pad">
          <div className="work-heading">
            <div>
              <p className="eyebrow">02 / SELECTED ENGINEERING</p>
              <h2>
                Built with
                <br />
                <em>intention.</em>
              </h2>
            </div>
            <p>
              A closer look at the products,
              <br />
              the decisions and the work behind them.
              <br />
              <span>Selected work / 2023—2026</span>
            </p>
          </div>
          <div className="work-grid">
            {selected.map((p, i) => (
              <WorkCard
                key={p.id}
                project={p}
                index={i}
                onOpen={() => openProject(p)}
                motion={motion}
              />
            ))}
          </div>
          <div className="archive-toggle">
            <div>
              <span className="eyebrow">THE WIDER BODY OF WORK</span>
              <p>More products. More contexts.</p>
            </div>
            <button
              className="pill"
              onClick={() => setArchive(!archive)}
              aria-expanded={archive}
              aria-controls="project-archive"
            >
              {archive
                ? "Close project index"
                : `Explore all ${projects.length} projects`}{" "}
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
              {filtered.length === 0 ? (
                <p className="empty-state">
                  No matching projects. Try a different name or domain.
                </p>
              ) : null}
            </div>
          ) : null}
        </section>
        <section id="approach" className="approach-section section-pad">
          <div className="section-label">
            <span>03 / ENGINEERING, UP CLOSE</span>
            <Asterisk />
          </div>
          <div className="approach-heading" data-reveal>
            <h2>
              The interesting part
              <br />
              is what happens <em>next.</em>
            </h2>
            <p>
              A beautiful interface starts the conversation.
              <br />
              The system has to finish it.
            </p>
          </div>
          <div className="principles">
            {[
              [
                "01",
                "A click becomes a contract.",
                "A clear interface hands intent to an API. Permissions, validation and predictable responses make that handoff dependable.",
                "INTERFACE → API",
              ],
              [
                "02",
                "Failures are part of the flow.",
                "Requests repeat. Providers time out. The design needs a way to recover without duplicating actions or losing their history.",
                "API → DATA",
              ],
              [
                "03",
                "Someone has to operate it.",
                "Approvals, observability, reversals and handover belong in the product. They are how a team stays in control after release.",
                "DATA → OPERATIONS",
              ],
            ].map(([n, title, body, flow]) => (
              <article key={n} data-reveal>
                <span className="principle-number">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
                <code>{flow}</code>
              </article>
            ))}
          </div>
          <div className="lab-invitation">
            <div>
              <span className="eyebrow">TRY AN ENGINEERING DECISION</span>
              <h3>
                One payment.
                <br />
                Even when the request repeats.
              </h3>
              <p>
                An interactive, synthetic model of idempotency: a request key
                that keeps a retry from becoming a second payment.
              </p>
            </div>
            <button
              className="round-link"
              onClick={() => setLab(!lab)}
              aria-expanded={lab}
              aria-controls="engineering-demo"
            >
              <span>{lab ? "Close demo" : "Try the demo"}</span>
              {lab ? <span>−</span> : <Arrow diagonal />}
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
        <section id="about" className="about-section section-pad">
          <div className="section-label">
            <span>04 / THE PERSON BEHIND THE WORK</span>
            <Asterisk />
          </div>
          <div className="about-grid">
            <div className="about-portrait" data-reveal>
              <img
                src="/identity/cyril-emmanuel.png"
                width="460"
                height="460"
                alt="Cyril Emmanuel"
                loading="lazy"
              />
              <span>
                CYRIL EMMANUEL
                <br />
                LAGOS, NIGERIA
              </span>
            </div>
            <div className="about-copy" data-reveal>
              <p className="eyebrow">ENGINEER. FOUNDER. TECHNICAL LEADER.</p>
              <h2>
                Curious about the detail.
                <br />
                <em>Responsible for the whole.</em>
              </h2>
              <p>
                My career has taken me from institutional ICT and business
                operations into full-stack engineering, technical leadership and
                founding Eminify.
              </p>
              <p>
                That path shapes how I build. I care about the person using the
                product, the team maintaining it and the business depending on
                it. I stay close to the code while helping teams make
                architecture and delivery decisions.
              </p>
              <p>
                Today, that includes AddressDox and PlotDox, early-stage
                technical leadership at RewaPay, and product and client work
                through Eminify.
              </p>
              <div className="about-links">
                <a className="text-link" href={cv} download>
                  Download résumé <Arrow />
                </a>
                <a
                  className="text-link"
                  href={links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  Professional history <Arrow diagonal />
                </a>
              </div>
            </div>
          </div>
          <div className="experience-line">
            <div>
              <span>2026—PRESENT</span>
              <strong>AddressDox</strong>
              <p>Senior Software Developer</p>
            </div>
            <div>
              <span>2025—PRESENT</span>
              <strong>RewaPay</strong>
              <p>Chief Technology Officer · Contract</p>
            </div>
            <div>
              <span>2019—PRESENT</span>
              <strong>Eminify</strong>
              <p>Founder & Lead Engineer</p>
            </div>
            <div>
              <span>2021—2024</span>
              <strong>Qubators</strong>
              <p>Head of Technical</p>
            </div>
          </div>
          <div className="stack-row">
            <span>THE WORKING STACK</span>
            <p>
              TypeScript / React / Next.js / Node.js / NestJS / Laravel / Python
              / Flutter / PostgreSQL / Docker
            </p>
          </div>
        </section>
        <section id="contact" className="contact-section section-pad">
          <div className="contact-top">
            <span className="eyebrow">05 / WHAT’S NEXT</span>
            <p>
              Engineering opportunities. Product partnerships.
              <br />A useful conversation about something worth building.
            </p>
          </div>
          <a className="contact-title" href={links.email}>
            Let’s build
            <br />
            <em>what’s next.</em>
            <Arrow diagonal />
          </a>
          <div className="contact-bottom">
            <a href={links.email}>emmacyril@gmail.com</a>
            <button
              onClick={copyEmail}
              className="copy-email"
              aria-label="Copy email address"
            >
              {copied ? "Copied ✓" : "Copy email ↗"}
            </button>
            <div>
              <a href={links.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>
              <a href={links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn ↗
              </a>
              <a href={links.studio} target="_blank" rel="noreferrer">
                Eminify ↗
              </a>
            </div>
          </div>
          <span className="sr-only" role="status">
            {copied ? "Email address copied" : ""}
          </span>
        </section>
      </main>
      <footer>
        <span>© {new Date().getFullYear()} Cyril Emmanuel</span>
        <span>Engineering the complete experience.</span>
        <a href="#home">Back to top ↑</a>
      </footer>
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
