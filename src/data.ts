export const categories = [
  "All work",
  "Payments",
  "Platforms",
  "AI & automation",
  "Web & mobile",
] as const;
export type Category = (typeof categories)[number];
export type Project = {
  id: string;
  name: string;
  eyebrow: string;
  category: Exclude<Category, "All work">;
  summary: string;
  stack: string[];
  status: string;
  year: string;
  color: string;
  challenge: string;
  contribution: string;
  decisions: string[];
  boundary: string;
  flow: [string, string, string, string];
  image?: string;
  imageCaption?: string;
  imageKind?: "interface" | "documentation";
  featured?: boolean;
  repo?: string;
  site?: string;
};

export const projects: Project[] = [
  {
    id: "addressdox",
    name: "AddressDox / PlotDox",
    eyebrow: "Identity, documents & land workflows",
    category: "Platforms",
    summary:
      "Connecting identity, authority-based access, document issuance and land administration across a shared platform.",
    stack: ["TypeScript", "React", "PostgreSQL", "Azure"],
    status: "Active platform work",
    year: "2026",
    color: "lime",
    featured: true,
    challenge:
      "Multiple products need a consistent identity model, clearly separated authority access and a dependable path from onboarding to issued documents.",
    contribution:
      "Platform engineering across the web rebuild, shared product access, document workflows, integrations and deployment operations.",
    decisions: [
      "Derive access from verified roles and authority boundaries.",
      "Validate redirect destinations during cross-product handoffs.",
      "Use versioned releases with explicit activation and rollback.",
      "Build document fingerprint verification separately from external ledger publication.",
    ],
    boundary:
      "Document integrity and cross-product access work are in progress. External blockchain anchoring remains a separate integration milestone.",
    flow: ["Onboard", "Verify role", "Issue document", "Verify integrity"],
    image: "/projects/addressdox.jpg",
    imageCaption:
      "Public AddressDox developer page with an illustrative API example. Captured 15 September 2026.",
    site: "https://addressdox.com/developers",
  },
  {
    id: "rewapay",
    name: "RewaPay",
    eyebrow: "Money movement & financial controls",
    category: "Payments",
    summary:
      "Payment APIs and operational tooling where retries, approvals and reversals are part of the design.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Flutter"],
    status: "In development",
    year: "2026",
    color: "blue",
    featured: true,
    challenge:
      "Money movement must remain consistent when requests repeat, processes overlap or a response is lost after the transaction commits.",
    contribution:
      "Hands-on technical leadership and implementation across payment services, financial administration and mobile/backend integration.",
    decisions: [
      "Represent monetary values in integer minor units.",
      "Require balanced debit and credit entries.",
      "Separate creation and approval of sensitive operations.",
      "Design for replay, immutable reversals and audit persistence.",
    ],
    boundary:
      "In development across ledger controls, payment services and integrations. Commercial launch remains a separate milestone.",
    flow: ["Request", "Validate & dedupe", "Post ledger", "Audit & reconcile"],
    image: "/projects/rewapay.jpg",
    imageCaption:
      "Public RewaPay marketing preview. Illustrated balances are demonstration content. Captured 15 September 2026.",
    site: "https://www.rewapay.co",
  },
  {
    id: "emiwarp",
    name: "EMIWARP",
    eyebrow: "AI infrastructure & developer tooling",
    category: "AI & automation",
    summary:
      "A Warp-derived terminal engineering project adding configurable agent providers, local-model discovery and runtime integration.",
    stack: ["Rust", "Python", "Shell", "Agent providers"],
    status: "Active development",
    year: "2026",
    color: "violet",
    featured: true,
    challenge:
      "Extending a substantial upstream terminal requires clear module boundaries and a repeatable way to integrate future upstream changes.",
    contribution:
      "EMIWARP configuration, provider, identity, egress and runtime modules, plus a Python overlay and upstream synchronization/build scripts.",
    decisions: [
      "Keep EMIWARP modules distinct from the Warp foundation.",
      "Make provider configuration and local-model discovery explicit.",
      "Automate repeatable upstream integration.",
      "Document runtime and network boundaries alongside setup.",
    ],
    boundary:
      "A Warp-derived project in active development, with warpdotdev/warp credited as the foundation. Release validation and network behaviour depend on the build and provider configuration.",
    flow: [
      "Configuration",
      "Provider discovery",
      "Agent runtime",
      "Terminal workflow",
    ],
    repo: "https://github.com/emmacyril/EMIWARP",
    image: "/projects/emiwarp.jpg",
    imageKind: "documentation",
    imageCaption:
      "Structural map from the public EMIWARP README. Source documentation, not a running terminal screenshot; Warp is the credited foundation. Captured 15 September 2026.",
  },
  {
    id: "koletmoni",
    name: "KoletMoni",
    eyebrow: "Mobile payments & backend evolution",
    category: "Payments",
    summary:
      "Phrase-based payments, QR Cash and provider integrations, with careful attention to money movement during backend migration.",
    stack: ["Flutter", "Node.js", "Laravel", "Payment APIs"],
    status: "Product implementation",
    year: "2026",
    color: "mint",
    featured: true,
    challenge:
      "A changing backend must preserve the behaviour customers rely on, including payment expiry, refunds and provider responses.",
    contribution:
      "Implementation across mobile experiences, payment-provider interfaces and the Node.js-to-Laravel migration work.",
    decisions: [
      "Treat migration parity as a testable requirement.",
      "Make expiry refunds safe to repeat.",
      "Separate provider state from customer-facing transaction state.",
      "Reconcile escrow and transaction balances explicitly.",
    ],
    boundary:
      "Laravel migration is in progress alongside the existing Node.js API. Behavioural parity and cutover validation remain part of delivery.",
    flow: [
      "Payment phrase",
      "Resolve request",
      "Provider adapter",
      "Reconcile",
    ],
    image: "/projects/koletmoni.jpg",
    imageCaption:
      "Public KoletMoni payment-phrase guide. Captured 15 September 2026.",
    site: "https://www.koletmoni.com/how-to-create-phrases",
  },
  {
    id: "ratelline",
    name: "RatelLine",
    eyebrow: "Case management & assisted reporting",
    category: "AI & automation",
    summary:
      "A reporting platform joining citizen journeys, structured case handling and AI-assisted intake.",
    stack: ["Next.js", "NestJS", "Flutter", "Gemini"],
    status: "Product implementation",
    year: "2026",
    color: "orange",
    featured: true,
    challenge:
      "Reports arriving through different channels need a common lifecycle, appropriate permissions and traceable progress.",
    contribution:
      "Full-stack implementation across web, API and mobile clients, case workflows and assisted reporting integrations.",
    decisions: [
      "Represent case transitions as an explicit state machine.",
      "Separate citizen, staff and administrative permissions.",
      "Account for background-job replay.",
      "Keep human case handling visible alongside AI assistance.",
    ],
    boundary:
      "The public site presents web reporting; WhatsApp and voice are marked coming soon. The engineering case spans the wider web, API and mobile implementation.",
    flow: ["Report", "Structure intake", "Case workflow", "Human resolution"],
    image: "/projects/ratelline.jpg",
    imageCaption: "Public RatelLine landing page. Captured 15 September 2026.",
    site: "https://ratel-line-frontend.vercel.app/",
  },
  {
    id: "emizeer",
    name: "Emizeer",
    eyebrow: "Mobile recognition & provider resilience",
    category: "Web & mobile",
    summary:
      "Music recognition with provider fallback, temporary-audio cleanup and server-verified subscription controls.",
    stack: ["Flutter", "Python", "FastAPI", "Redis"],
    status: "Release preparation",
    year: "2026",
    color: "pink",
    featured: true,
    challenge:
      "A short audio request crosses third-party providers, usage limits and mobile entitlements. Each step needs a predictable failure mode.",
    contribution:
      "Mobile and backend engineering for recognition, provider integration, usage controls and administrative workflows.",
    decisions: [
      "Delete temporary audio after each request.",
      "Use a configured secondary provider when the primary provider errors.",
      "Verify store purchases before granting paid entitlements.",
      "Separate liveness from production-readiness checks.",
    ],
    boundary:
      "Application and service implementation are in release preparation. App-store launch remains a separate milestone.",
    flow: [
      "Record clip",
      "Recognize",
      "Fallback if needed",
      "Return & clean up",
    ],
    image: "/projects/emizeer.jpg",
    imageCaption: "Public Emizeer product page. Captured 15 September 2026.",
    site: "https://emizeer.vercel.app/",
  },
  {
    id: "rinfa",
    name: "RINFA",
    eyebrow: "Learning, identity & payments",
    category: "Platforms",
    summary:
      "Ongoing engineering across academy access, support workflows and payment integration.",
    stack: ["TypeScript", "PostgreSQL", "Payment APIs"],
    status: "Client platform work",
    year: "2026",
    color: "lime",
    challenge:
      "Learning access, support and payment status need to agree across the customer journey.",
    contribution:
      "Platform maintenance, authentication improvements, support-inbox work and payment adapter changes.",
    decisions: [
      "Normalize ambiguous provider statuses conservatively.",
      "Restrict hosted checkout redirects to allowed domains.",
      "Keep support communication in an accountable workflow.",
    ],
    boundary:
      "The current scope is implementation and maintenance across learning access, support and payment workflows.",
    flow: ["Sign in", "Enroll", "Payment state", "Learning access"],
  },
  {
    id: "world-evangelism",
    name: "World Evangelism",
    eyebrow: "Donation workflow reliability",
    category: "Payments",
    summary:
      "Payment integration maintenance for a donation experience, including failed gateway and network paths.",
    stack: ["TypeScript", "Payment APIs", "Integration tests"],
    status: "Client platform work",
    year: "2026",
    color: "blue",
    challenge:
      "A donation flow depends on third-party gateways whose endpoints and failure responses can change.",
    contribution:
      "Payment-service maintenance, gateway handling and regression coverage for success and failure paths.",
    decisions: [
      "Test network failure as well as successful initiation.",
      "Keep provider integration changes traceable.",
      "Distinguish initiation from final settlement.",
    ],
    boundary:
      "This contribution concerns payment-service maintenance and regression coverage.",
    flow: ["Donation", "Initiate", "Gateway response", "Confirm status"],
  },
  {
    id: "qubsurf",
    name: "Qub-Surf",
    eyebrow: "Desktop browsing experience",
    category: "Web & mobile",
    summary:
      "A browser interface exploring vertical tabs, workspaces and community-oriented navigation.",
    stack: ["Electron", "Chromium", "Desktop UI"],
    status: "Desktop application work",
    year: "2025–26",
    color: "orange",
    challenge:
      "A familiar browser foundation needs a focused interface and navigation model for its intended community.",
    contribution:
      "Desktop browser product and interface development within a wider client ecosystem.",
    decisions: [
      "Adapt an existing browser foundation instead of claiming a new engine.",
      "Make workspace and navigation choices visible.",
      "Separate interface work from upstream browser capabilities.",
    ],
    boundary:
      "This case concerns the Electron/Chromium desktop implementation. Separate Swift and mobile repositories are not evidence of its desktop stack. Browser-engine foundations retain their upstream attribution.",
    flow: ["Workspace", "Tab navigation", "Browser engine", "Web content"],
    image: "/projects/qubsurf.jpg",
    imageCaption:
      "Embedded browser demonstration on the public Qub-Surf website. Captured 15 September 2026.",
    site: "https://qubsurf.vercel.app/",
  },
  {
    id: "cepay",
    name: "CEPAY",
    eyebrow: "Payment product engineering",
    category: "Payments",
    summary:
      "Web and mobile payment experiences developed within the Refuge / Qubators product context.",
    stack: ["React Native", "Node.js", "Provider integrations"],
    status: "Historical client work",
    year: "2023–24",
    color: "blue",
    challenge:
      "Payment journeys need coherent interfaces across customer actions, provider integration and operational handling.",
    contribution:
      "Technical development of payment interfaces and integrations within a client-owned product.",
    decisions: [
      "Separate customer-facing flows from provider operations.",
      "Document product and organization attribution.",
      "Treat sandbox integration as distinct from production acceptance.",
    ],
    boundary:
      "Historical engineering work within the Refuge / Qubators product context; the product belongs to its respective organization.",
    flow: ["Customer action", "API", "Provider", "Status response"],
    image: "/projects/cepay-project.png",
    imageCaption: "Archived public CEPAY landing page.",
  },
  {
    id: "hushpalms",
    name: "Hushpalms",
    eyebrow: "AI-enabled consultancy experience",
    category: "AI & automation",
    summary:
      "A consultancy web experience with voice-assistant integration and client-facing journeys.",
    stack: ["React", "Voice integration", "Web workflows"],
    status: "Client implementation",
    year: "2026",
    color: "violet",
    challenge:
      "A consultancy website needs to connect discovery, conversation and the next useful action.",
    contribution: "Website and AI-assisted client experience implementation.",
    decisions: [
      "Make the assistant a part of the customer journey.",
      "Keep human follow-up available.",
      "Structure navigation around actual services.",
    ],
    boundary:
      "Client implementation spanning the website and its assisted interaction flow.",
    flow: ["Discover", "Ask", "Assistant context", "Human follow-up"],
    image: "/projects/hushpalms.jpg",
    imageCaption:
      "Public Hushpalms services interface. Captured 15 September 2026.",
    site: "https://hushpalms.vercel.app/services",
  },
  {
    id: "oakyard",
    name: "Oakyard Properties",
    eyebrow: "Property discovery & enquiries",
    category: "Web & mobile",
    summary:
      "Property presentation and enquiry workflows with WhatsApp integration.",
    stack: ["Web application", "WhatsApp", "Content workflows"],
    status: "Client implementation",
    year: "2026",
    color: "mint",
    challenge:
      "Property discovery needs a clear handoff from browsing to a useful enquiry.",
    contribution: "Website and customer-contact workflow implementation.",
    decisions: [
      "Connect property context to enquiry handling.",
      "Design for mobile browsing.",
      "Keep the next action easy to identify.",
    ],
    boundary:
      "The case covers the property website and enquiry integrations; listings are managed by the property business.",
    flow: ["Browse", "Property detail", "Enquire", "Follow-up"],
  },
  {
    id: "celvz",
    name: "CELVZ",
    eyebrow: "Community, media & events",
    category: "Platforms",
    summary:
      "A community platform connecting events, media and administrative workflows.",
    stack: ["Web application", "Media", "Integrations"],
    status: "Platform implementation",
    year: "2026",
    color: "pink",
    challenge:
      "A community needs coherent access to changing media, events and organizational information.",
    contribution:
      "Web platform and integration work for community-facing services.",
    decisions: [
      "Organize journeys around content and events.",
      "Keep administrative workflows distinct.",
      "Support responsive access.",
    ],
    boundary:
      "The contribution covers the community platform and its integration workflows.",
    flow: ["Discover", "Media & events", "Participate", "Admin workflow"],
    image: "/projects/celvz.jpg",
    imageCaption: "Public CELVZ video catalogue. Captured 15 September 2026.",
    site: "https://celvz-web-app.vercel.app/videos",
  },
  {
    id: "bonamatrix",
    name: "BonaMatrix",
    eyebrow: "Mining operations reporting",
    category: "Platforms",
    summary:
      "Domain-specific reporting for mining breakdowns and operational follow-up.",
    stack: ["Web application", "Reporting", "Operations"],
    status: "Client implementation",
    year: "2026",
    color: "orange",
    challenge:
      "Operational breakdowns need structured reporting rather than information scattered across informal channels.",
    contribution:
      "Implementation of a domain-specific reporting interface and workflow.",
    decisions: [
      "Capture the context needed to act on a report.",
      "Keep operational status explicit.",
      "Present reports for practical follow-up.",
    ],
    boundary:
      "The current scope is the implementation of reporting and operational follow-up workflows.",
    flow: ["Report issue", "Classify", "Operational review", "Follow-up"],
  },
  {
    id: "myeduchat",
    name: "MyEduChat",
    eyebrow: "Education dashboard & AI assistance",
    category: "AI & automation",
    summary:
      "An education dashboard with an accompanying AI-assistant implementation.",
    stack: ["Web application", "AI integration", "Dashboard"],
    status: "Product implementation",
    year: "2025",
    color: "violet",
    challenge:
      "Educational workflows need a clear interface for information and assisted interaction.",
    contribution:
      "Dashboard implementation and integration work using existing foundations.",
    decisions: [
      "Credit starter and assistant foundations.",
      "Keep the dashboard task-focused.",
      "Separate assistance from verified educational outcomes.",
    ],
    boundary:
      "The dashboard and assistant use existing project foundations. The case concerns their implementation and integration.",
    flow: ["Dashboard", "Learning context", "Assistant", "Review"],
  },
  {
    id: "tapflow",
    name: "TapFlow",
    eyebrow: "Mobile service workflow",
    category: "Web & mobile",
    summary:
      "An early-stage mobile and backend implementation with a documented product direction.",
    stack: ["Flutter", "TypeScript", "Backend services"],
    status: "Early development",
    year: "2025",
    color: "mint",
    challenge:
      "An early product needs a coherent mobile/backend contract before expanding its feature scope.",
    contribution:
      "Application and service implementation on an existing stack foundation.",
    decisions: [
      "Keep early flows narrow and testable.",
      "Separate business plans from implemented capabilities.",
      "Document starter provenance.",
    ],
    boundary:
      "Early application development; commercial launch remains a separate milestone.",
    flow: ["Mobile request", "API contract", "Business rules", "Response"],
  },
  {
    id: "flowforge",
    name: "FlowForge",
    eyebrow: "Workflow building experiment",
    category: "AI & automation",
    summary:
      "An early AI-assisted workflow builder exploring the n8n integration surface.",
    stack: ["AI integration", "n8n", "Web interface"],
    status: "Prototype",
    year: "2025",
    color: "lime",
    challenge:
      "Natural-language intent needs to become a workflow that a person can inspect and edit.",
    contribution:
      "Prototype implementation of an AI-assisted workflow-building interface.",
    decisions: [
      "Expose the resulting workflow for human review.",
      "Build around existing automation tooling.",
      "Keep prototype scope explicit.",
    ],
    boundary: "An early prototype exploring workflow generation and review.",
    flow: ["Describe task", "Generate draft", "Review workflow", "Refine"],
  },
  {
    id: "sellobees",
    name: "Sellobees",
    eyebrow: "Business services & customer communication",
    category: "Web & mobile",
    summary:
      "A business-services website connecting service discovery, enquiries and customer communication.",
    stack: ["Web experience", "Newsletter", "Integrations"],
    status: "Web implementation",
    year: "2026",
    color: "pink",
    challenge:
      "A services business needs a clear path from understanding its offer to starting a useful conversation.",
    contribution: "Website and integration implementation.",
    decisions: [
      "Make service discovery clear.",
      "Connect newsletter capture to the customer journey.",
      "Support responsive use.",
    ],
    boundary:
      "The case covers the business website and communication-workflow implementation.",
    flow: ["Discover", "Explore services", "Enquire", "Communication"],
    image: "/projects/sellobees.jpg",
    imageCaption: "Public Sellobees services page. Captured 15 September 2026.",
    site: "https://sellobees.vercel.app/services",
  },
  {
    id: "instantlearn",
    name: "InstantLearn",
    eyebrow: "AI-assisted learning products",
    category: "AI & automation",
    summary:
      "A learning product exploring AI-generated knowledge bursts, courses and team quizzes.",
    stack: ["AI workflows", "Web", "Mobile"],
    status: "Product demonstration",
    year: "2025–26",
    color: "orange",
    challenge:
      "A person’s learning goal needs to become a useful, structured learning experience rather than an unorganized answer.",
    contribution:
      "Product development across an AI-learning project with separate web, mobile and backend repositories.",
    decisions: [
      "Structure the experience around a specific learning intention.",
      "Make generated material available for review.",
      "Keep product capabilities separate from unverified learning outcomes.",
    ],
    boundary:
      "The public interface demonstrates the product direction. Course counts, completion rates, generation speed and adoption are not independently asserted here.",
    flow: [
      "Learning goal",
      "Generate structure",
      "Review content",
      "Learn & practise",
    ],
    site: "https://instant-learn-web-app.vercel.app/",
    image: "/projects/instantlearn.jpg",
    imageCaption:
      "Public InstantLearn sign-in interface with empty fields. Captured 15 September 2026.",
  },
  {
    id: "jobhunteer",
    name: "JobHunteer",
    eyebrow: "Career workflow assistance",
    category: "AI & automation",
    summary:
      "A career copilot concept connecting job discovery, résumé tailoring and application workflow assistance.",
    stack: ["AI workflows", "Career tools", "Web"],
    status: "Product demonstration",
    year: "2025–26",
    color: "violet",
    challenge:
      "Job searching involves repeated work across discovery, fit assessment and application preparation.",
    contribution:
      "Product and interface development for an AI-assisted career workflow, presented through its public demonstration.",
    decisions: [
      "Make the stages of the search visible.",
      "Keep résumé and application content reviewable.",
      "Distinguish workflow assistance from promised hiring outcomes.",
    ],
    boundary:
      "The public demonstration does not establish automated application reliability, placement rates or commercial adoption.",
    flow: [
      "Discover role",
      "Assess fit",
      "Prepare material",
      "Review application",
    ],
    site: "https://jobhunteer.vercel.app/",
    image: "/projects/jobhunteer.jpg",
    imageCaption:
      "Public JobHunteer landing-page preview. Captured 15 September 2026.",
  },
  {
    id: "qubmeets",
    name: "QubMeets",
    eyebrow: "Meetings & assisted insights",
    category: "Platforms",
    summary:
      "A meeting experience with an AI-insight interface and ongoing workflow development.",
    stack: ["React", "TypeScript", "Vite"],
    status: "Application implementation",
    year: "2026",
    color: "blue",
    challenge:
      "A meeting product needs to join the live session experience with useful information afterward.",
    contribution:
      "Meeting interface and AI-insight integration work in a client product, using existing application foundations.",
    decisions: [
      "Keep meeting and insight workflows connected.",
      "Build on existing UI and application foundations.",
      "Make assistance part of a concrete user task.",
    ],
    boundary:
      "Application development using existing starter foundations; meeting-service operations are a separate scope.",
    flow: ["Join meeting", "Session context", "Assisted insights", "Review"],
  },
  {
    id: "kalorion",
    name: "Kalorion",
    eyebrow: "Nutrition & daily tracking",
    category: "Web & mobile",
    summary:
      "A calorie-tracking application built around Nigerian food and locally relevant nutrition workflows.",
    stack: ["React", "TypeScript", "Supabase", "Capacitor"],
    status: "Application implementation",
    year: "2026",
    color: "orange",
    challenge:
      "Food tracking needs relevant categories and an accessible day-to-day workflow for its intended audience.",
    contribution:
      "Web/mobile application work, including food descriptions, categories and administrative interfaces.",
    decisions: [
      "Use a shared web foundation with mobile packaging.",
      "Keep food categories meaningful to local use.",
      "Separate application behaviour from claims about health outcomes.",
    ],
    boundary:
      "This case covers food-category, tracking and interface engineering. Nutritional content is a separate product responsibility.",
    flow: ["Log food", "Classify", "Daily tracking", "Review pattern"],
    site: "https://kalorion.vercel.app/",
  },
  {
    id: "puredents",
    name: "PureDents",
    eyebrow: "Dental brand & service experience",
    category: "Web & mobile",
    summary:
      "A dental product and service web experience connecting educational content, discovery and customer enquiries.",
    stack: ["React", "TypeScript", "Web experience"],
    status: "Client implementation",
    year: "2026",
    color: "mint",
    challenge:
      "A dental brand needs an understandable path between product information and a customer’s next action.",
    contribution:
      "Website implementation and interface refinement using existing project foundations.",
    decisions: [
      "Organize content around customer needs.",
      "Keep product and service navigation clear.",
      "Support a coherent mobile experience.",
    ],
    boundary:
      "This case concerns the brand website, educational-content presentation and customer journey.",
    flow: ["Discover", "Learn", "Product or service", "Enquire"],
    site: "https://puredents.vercel.app/",
    image: "/projects/puredents.jpg",
    imageCaption:
      "Public PureDents sign-in interface with empty fields. Captured 15 September 2026.",
  },
  {
    id: "hms",
    name: "HMS / Hospitality",
    eyebrow: "Hotel-management product planning",
    category: "Platforms",
    summary:
      "A hotel-management product concept and proposed commercial collaboration, included as planning work.",
    stack: ["Product planning", "Hospitality", "Workflow design"],
    status: "Concept / proposal",
    year: "2026",
    color: "blue",
    challenge:
      "A hospitality product needs a clear operational scope and an agreed delivery model before commercial commitments become implementation claims.",
    contribution:
      "Product and commercial planning for a proposed hotel-management collaboration.",
    decisions: [
      "Define the operational scope with the intended partner.",
      "Separate proposed commercial terms from realized results.",
      "Validate implementation and acceptance before describing a deployed platform.",
    ],
    boundary:
      "This entry is supported by proposal material. A completed implementation, public demonstration and client acceptance have not been established.",
    flow: ["Define scope", "Plan product", "Validate needs", "Agree delivery"],
  },
];

export function filterProjects(
  items: Project[],
  category: Category,
  search: string,
) {
  const term = search.trim().toLowerCase();
  return items.filter(
    (project) =>
      (category === "All work" || project.category === category) &&
      [project.name, project.summary, project.eyebrow, ...project.stack]
        .join(" ")
        .toLowerCase()
        .includes(term),
  );
}
