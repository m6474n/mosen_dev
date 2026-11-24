import { CaseStudy, Service, Resource, BlogPost, SkillCategory, Milestone, EstimatorFeature, FaqItem, ProcessStep, Testimonial, MetricPoint, BarPoint, ActivityGridDay } from './types';

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "appex-global-trading",
    title: "Appex Global Trading — Dual App Suite",
    industry: "B2B Trading",
    tech: ["Flutter", "Ruby on Rails", "PostgreSQL", "SQLite", "Docker"],
    summary: "Offline-first dual-role mobile app with server-driven forms and background sync. Built for field agents and back-office operations running simultaneously.",
    challenge: "Field trading agents in remote regions of Pakistan and neighboring territories struggled with extremely spotty mobile connection (3G/Edge). Legacy forms would crash, losing critical pricing bids and inventory updates. No central system could synchronize current commodity rates and field bids in real-time.",
    solution: "Developed an architectural setup using Flutter with embedded SQLite storage and transparent double-buffer synchronizations. In the background, a queue tracks all pending mutations, and attempts auto-retries using an exponential-backoff scheduler. The backend is a robust Ruby on Rails application configured on AWS ECS, with an absolute database replication schedule.",
    results: [
      { value: "100%", label: "Uptime on offline ops" },
      { value: "0", label: "Lost inventory bids" },
      { value: "14x", label: "Synchronization speedup" }
    ],
    contentMarkdown: `### THE CHALLENGE
Appex Global Trading coordinates thousands of bulk commodity exchanges across locations with highly unstable internet connection. Field agents must record weights, cargo status, and negotiated prices on-site. If internet signal gets lost, manual records had to be taken, resulting in double-entry errors and delayed order fulfillment.

The primary system goals were:
1. Guarantee zero data loss when mobile connection drops completely.
2. Provide immediate client pricing calculations on-demand, running local business rules.
3. Automatically sync queued offline modifications when connection is restored, without user intervention.

### THE ENGINEERING APPROACH
Instead of a simple client-first or server-only strategy, we designed an **offline-first state manager with automatic conflict-resolution**:

- **Database Layer**: Implemented an SQLite cache locally on the Flutter app, mirroring schema projections from the main PostgreSQL database on the rails server.
- **Queue Engine**: Custom Dart code tracks modifications using a sequence-id based mutation logs collection. When online, mutations trigger an idempotent transaction pipeline.
- **Rate-Limiter & Compression**: Synchronizations compress large JSON frames into Gzip arrays and perform batch uploads to optimize network overhead on slow channels.
- **Server-Driven Forms**: Schema forms are defined in JSON on the Rails server. The Flutter client renders inputs dynamically, and local validators can update instantly without re-deploying the app.

### OUTCOMES & IMPACT
The trade operational volume grew by **35% within four months** because agents could secure immediate bids without waiting at physical gates. The background workers solved 100% of network disconnect issues, saving several operational hours each day.`,
    screenshots: [
      {
        id: "field-bidding-screen",
        title: "Field Bidding Terminal",
        description: "Enables agents to input bid weights, select commodities, and view live local price matrices offline with a direct local storage sync engine.",
        type: "mobile"
      },
      {
        id: "offline-sync-queue",
        title: "Adaptive Queue Dashboard",
        description: "Background processing monitor that displays active backoff status, retry counts, pending transaction queues, and network bandwidth diagnostic feeds.",
        type: "mobile"
      }
    ]
  },
  {
    id: "weighbridge-erp",
    title: "Weighbridge Management System",
    industry: "Industrial ERP",
    tech: ["Flutter Desktop", "Dart", "C++ bindings", "RTSP Streams", "n8n"],
    summary: "Full ERP system on Flutter Desktop with serial port auto-detection for hardware integration and live RTSP camera feeds. Replaced a fragmented legacy process with one unified platform.",
    challenge: "Industrial sites running heavy scales relied on legacy Windows software running under .NET 4.0 that lacked modern database sync, couldn't identify hardware scales automatically, and frequently lost scale data when trucks shifted weight.",
    solution: "Designed a native desktop application in Flutter Desktop with low-level serial port listeners written with Dart Native C++ bindings. Combined the scale metrics directly with a live RTSP security camera stream capturing truck license plates on incoming lanes.",
    results: [
      { value: "1 app", label: "Replaced 4 legacy tools" },
      { value: "4.8s", label: "Truck check-in speed" },
      { value: "99.8%", label: "Scale capture accuracy" }
    ],
    contentMarkdown: `### THE CHALLENGE
Industrial scale weight measurements require absolute accuracy and speed. At high-volume scales, trucks must be quickly cataloged, photographed for audit-compliance, and have their weights extracted from digital scales. The legacy software was fragile, ran on separate machines, and failed to bind security cameras with scale databases.

### THE SOLUTION
We designed a high-performance native desktop program built on Flutter for Windows/macOS:
- **Direct Serial Port Parser**: A custom asynchronous loop listens directly on COM/TTY ports to query physical indicators (e.g., Yaohua XK3190 indicator). 
- **Camera Capture Engine**: Used standard FFmpeg pipelines inside Dart isolates to track high-definition RTSP feeds. When the scale weight stabilizes, a frame is instantly snap-shotted and attached to the digital scale ticket.
- **Local Persistence with Cloud Sync**: Local weights are stored instantly in an embedded database. The application safely communicates transactions with the main cloud infrastructure via local-to-cloud microservicing pipelines.

### OUTCOMES
- Operators now check in commercial cargo trucks in under 5 seconds (was 35s average).
- Eliminates manual manipulation of weight records, boosting audit compliance to absolute perfection.
- Built-in automatic printer drivers interface with standard serial-thermal hardware.`,
    screenshots: [
      {
        id: "scale-ops-control",
        title: "Operations Command Center",
        description: "Custom desktop interface featuring an integrated scale indicator parser, high-framerate embedded RTSP camera security streams, and automatic weight-stabilization triggers.",
        type: "desktop"
      }
    ]
  },
  {
    id: "lead-qualification-agent",
    title: "Lead Qualification Agent",
    industry: "B2B SaaS",
    tech: ["Python", "FastAPI", "Gemini Pro", "Google Sheets API", "Playwright"],
    summary: "Python automation agent that scrapes company websites, scores leads against ICP criteria, and syncs qualified prospects to Google Sheets — removing 8+ hours of weekly manual qualification work.",
    challenge: "B2B Sales teams spent endless hours visiting target lead web domains, digging for pricing models, reading about pages, searching for business contact emails, and guessing if companies fit the Ideal Customer Profile (ICP).",
    solution: "An automated Python agent built on FastAPI and Playwright. The agent loads the target domain, extracts text, utilizes the Gemini API to analyze products, rates compliance against structured guidelines, and logs them instantly to CRM sheets.",
    results: [
      { value: "8 hrs", label: "Saved per week" },
      { value: "92%", label: "ICP scoring accuracy" },
      { value: "10x", label: "Qualified rate increase" }
    ],
    contentMarkdown: `### THE CHALLENGE
Pre-sales qualification is manual, exhausting, and prone to subjective errors. Sales Development Reps spend hours reviewing hundreds of companies, yet only 5-10% meet the strict B2B profile requirements.

### THE AUTOMATION PIPELINE
We engineered a headless scraper and intelligence agent:
1. **Scraper Pipeline**: Using Playwright, the script reads target homepages, landing pages, and contact pages securely with proxy-rotations to avoid crawler bans.
2. **Text Normalizer**: Clean extracts remove DOM noise and cookie notices, converting raw content into compact, structured tokens.
3. **Structured Scoring Engine**: Feeds data into the Gemini model with a rigid, multi-variable template (funding, employee estimation, product scope).
4. **Data Sync**: High-confidence prospects are automatically pushed to collaborative Google Sheets, complete with automated Slack notifications for instant rep awareness.

### SYSTEM DIAGRAM & LOGIC
The system runs serverless, and integrates easily with external webhook triggers (e.g., from form entries, Typeform, or landing pages).`,
    screenshots: [
      {
        id: "mobile-leads-alert",
        title: "Slack Lead Alerts Companion",
        description: "Real-time mobile companion feed showing automated ICP quality ratings, company enrichment profiles, contact directories, and instant Slack outbound buttons.",
        type: "mobile"
      }
    ]
  },
  {
    id: "crm-leads-module",
    title: "CRM with Leads Module",
    industry: "Internal Tool",
    tech: ["Flutter Web", "Firebase Auth", "Firestore", "Cloud Functions", "FastAPI"],
    summary: "Custom CRM with the Lead Qualification Agent embedded as a FastAPI microservice. Flutter Web frontend, Firestore backend, and Firebase Auth — built lean, designed to productize.",
    challenge: "B2B operators needed more than a spreadsheet; they needed a secure, multi-tenant workspace where team members can verify AI leads, run direct outreach, and update lead states visually.",
    solution: "Built a visually arresting CRM in Flutter Web connected securely with Firebase. Integrates the background qualification system directly inside lead boards, letting operators trigger the Playwright AI agent manually with a single click.",
    results: [
      { value: "V1", label: "Live & shipping" },
      { value: "140k+", label: "Leads qualified" },
      { value: "<2s", label: "UI response time" }
    ],
    contentMarkdown: `### THE CHALLENGE
While spreadsheets are simple, they fail to offer robust state management, collaborative auditing, activity logs, or secure roles. The business wanted an easy-to-use, gorgeous workspace without paying $150/user/month for heavy corporate platforms.

### THE BLUEPRINT
- **State-of-the-Art Interface**: Hand-tailored Kanban and lists that run at 60 FPS on desktop browsers.
- **Real-time Firestore Streams**: Lead assignments, updates, and chat notifications stream automatically to all logged-in members.
- **Embedded Tools**: Call hooks, quick templates, and an in-app browser panel to review company websites directly in the dashboard.

### THE STACK
We combined the blazing-fast client rendering of Flutter Web with Firebase for dynamic scale and reliable persistence. An API proxy abstracts credentials safely so that third-party scrapes never leak into the browser.`,
    screenshots: [
      {
        id: "crm-web-kanban",
        title: "Web Kanban Workstream",
        description: "Responsive desktop layout delivering drag-and-drop workflow lanes, live multiplayer Firestore updates, web page scrapers, and smart lead filters.",
        type: "website"
      }
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: "automation-systems",
    num: "01",
    title: "Automation Systems",
    description: "Eliminate manual work. Build once, run forever. End-to-end workflow automation that connects your existing business tools without overhead.",
    outcomes: [
      "Trigger-based pipelines for repetitive processes",
      "API integrations connecting your legacy CRM & tools",
      "Proactive notifications, alerts, and priority escalation",
      "Audit-ready logs with automatic error tracing and recovery"
    ],
    pricing: "Starts at $1,500 / system",
    iconName: "Cpu"
  },
  {
    id: "revenue-engines",
    num: "02",
    title: "Revenue Engines",
    description: "The full system from zero to paying customer. Converstion-focused landing pages, lead qualification algorithms, CRM data pipelines, and cold email setups connected seamlessly.",
    outcomes: [
      "Speed-optimized custom marketing structures",
      "AI-driven lead scrapers configured to your precise ICP",
      "Pipeline triggers syncing with Google Sheets, n8n, and CRM",
      "Cold email sequence automation with smart outbox rotating"
    ],
    pricing: "Starts at $2,500 / rollout",
    iconName: "TrendingUp"
  },
  {
    id: "product-design-dev",
    num: "03",
    title: "Product Design & Dev",
    description: "Figma wireframe to live production code. Brand design, modern user interfaces, and pixel-perfect native frontend application development without the agency overhead.",
    outcomes: [
      "Modern brand identities & component styling guides",
      "High-fidelity UI/UX design with interactive wireframes",
      "Speedy responsive frontends built with React / Tailwind",
      "Elegant cross-platform mobile apps using Flutter"
    ],
    pricing: "Inquire for weekly sprints",
    iconName: "Code"
  }
];

export const RESOURCES: Resource[] = [
  {
    id: "clipforge",
    title: "ClipForge — Local AI Video Clipper",
    description: "Turn any video URL into short, reframed, captioned clips entirely on your own machine. Runs whisper transcription, local heuristic viral scoring, and ffmpeg burning with zero cloud AI bills.",
    type: "Product",
    tags: ["Python", "FastAPI", "ffmpeg", "Whisper", "yt-dlp", "Ollama"],
    downloadCount: 84,
    content: `# ClipForge — Local AI Video Clipper

Turn any video URL into short, reframed, captioned clips — **entirely on your own machine**. No OpenAI/Anthropic/cloud AI calls.

### Architecture Pipeline
\`\`\`
URL → download (yt-dlp) → transcribe w/ word timestamps (faster-whisper)
    → select N clips (LOCAL heuristic; optional local Ollama)
    → per clip: cut + reframe (crop-fill | rounded 1:1 square on 9:16) + burn styled captions (ASS) via ffmpeg
    → .mp4 + preview/download URLs
\`\`\`

### Key Features
- **Zero API bills**: Whisper medium model loads on CUDA (or CPU fallback).
- **Automated Reframing**: Crops 16:9 widescreen to 9:16 Reels/TikTok formats with centered auto-masks.
- **Dynamic Word-by-Word Captions**: Burns styled kinetic subtitle animations via custom ASS ffmpeg filters.
- **FastAPI Core**: Async background jobs with Server-Sent Events (SSE) progress streaming.`,
    codeBlock: `git clone https://github.com/m6474n/clipforge.git
cd clipforge
python -m venv .venv
source .venv/bin/activate # or .venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload`,
    fileUrl: "https://github.com/m6474n/clipforge/archive/refs/heads/main.zip",
    githubUrl: "https://github.com/m6474n/clipforge",
    liveUrl: "https://github.com/m6474n/clipforge",
    imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "kroma",
    title: "Kroma — Concurrent Browser Profile Engine",
    description: "Multi-account Chrome profile manager and concurrent browser automation engine with independent timers, OAuth linking, and live streaming dashboard.",
    type: "Script",
    tags: ["TypeScript", "Playwright", "Chrome", "Automation", "OAuth"],
    downloadCount: 112,
    content: `# Kroma — Browser Profile Automation Engine

Multi-account Chrome profile orchestrator built for high-scale browser tasks, independent session cookies, and concurrent profile executions.

### Capabilities
- **Isolated Sandbox Environments**: Complete separation of localStorage, IndexedDB, cookies, and fingerprint headers.
- **Concurrent Execution Controller**: Pool scheduler managing RAM footprints across heavy Chromium processes.
- **OAuth Session Vault**: Secure credential storage and session persistence across automation workflows.`,
    codeBlock: `git clone https://github.com/m6474n/kroma.git
cd kroma
npm install
npm run build
npm start`,
    fileUrl: "https://github.com/m6474n/kroma/archive/refs/heads/main.zip",
    githubUrl: "https://github.com/m6474n/kroma",
    liveUrl: "https://github.com/m6474n/kroma",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    isPremium: false,
  },
  {
    id: "youtube-video-downloader",
    title: "Fast YouTube Video & Audio Downloader",
    description: "Fast & reliable video/audio downloading engine powered by yt-dlp with 4K/1080p stream merging, high-bitrate MP3 extraction, and JS challenge bypass.",
    type: "Utility",
    tags: ["Python", "yt-dlp", "ffmpeg", "Audio", "Video"],
    downloadCount: 156,
    content: `# YouTube Stream Downloader & Merger

High-speed extraction pipeline for YouTube media, integrating audio/video muxing and automated ffmpeg remuxing.

### Highlights
- **4K/1080p Stream Merging**: Bypasses separate DASH audio/video streams and remuxes into clean MP4.
- **Lossless Audio Conversion**: Extracts audio tracks into 320kbps MP3s with full metadata tags.
- **Challenge Solver**: Handles cipher signatures and age-gated media streams cleanly.`,
    codeBlock: `git clone https://github.com/m6474n/youtube_video_downloader.git
cd youtube_video_downloader
pip install -r requirements.txt
python main.py`,
    fileUrl: "https://github.com/m6474n/youtube_video_downloader/archive/refs/heads/main.zip",
    githubUrl: "https://github.com/m6474n/youtube_video_downloader",
    liveUrl: "https://github.com/m6474n/youtube_video_downloader",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    isPremium: false,
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "automated-lead-gen-machine",
    title: "How I Built an Automated Lead Gen Machine Saving 8 Hours/Week",
    excerpt: "A deep technical dive into orchestrating Playwright, Python agents, and Google Sheets into an autonomous ICP scout.",
    publishedAt: "June 04, 2026",
    readTime: "7 min read",
    tags: ["Automation", "Python", "Gemini API", "Growth"],
    contentHtml: `<p>Sales teams waste countless hours digging through lead profiles. Standard databases (ZoomInfo, Apollo) are generic and rarely reflect active product updates or accurate business offerings. To solve this for our outbound agency partners, I engineered an autonomous agent designed to qualify commercial prospects directly from live URL traces.</p>
<h4>The Architecture Checklist</h4>
<ul>
  <li><strong>Ingestion Handler</strong>: Triggered via a web webhook, accepting lists of domains to explore.</li>
  <li><strong>Scraping Isolates</strong>: Handled via Python Playwright to fetch homepage metrics, skipping heavy images and media libraries to prioritize millisecond delivery speeds.</li>
  <li><strong>Token Simplifier</strong>: Converts markup content into standardized key-value outputs, saving token volume.</li>
  <li><strong>Gemini Scoring</strong>: Evaluates prospects against rigid structured models.</li>
</ul>
<p>By delegating the initial web page crawls to scheduled serverless jobs, SDR teams only see pre-vetted leads showing active indicators. This saves over 8 hours of work week-over-week.</p>`
  },
  {
    slug: "case-against-handoffs",
    title: "The Case Against Handoffs: Why Code-First Design is the Future",
    excerpt: "Figma is not the destination; code is. Why working across design and development creates better user experiences, faster.",
    publishedAt: "May 20, 2026",
    readTime: "5 min read",
    tags: ["Product Design", "React", "UX Philosophy"],
    contentHtml: `<p>In typical agencies, a product flows through a disjointed assembly line. A designer drafts a beautiful visual board in Figma. It gets shared with feedback widgets, is signed off, and is eventually exported to zip folders. Then, a frontend developer tries to rebuild it, finding that components don't match viewport limits, hover states are missing, and typography scales look robotic.</p>
<h4>The Cost of Disconnection</h4>
<p>This process is highly inefficient. When the worker designing the app does not understand code boundaries, the final build suffers. Conversely, when developers ignore the subtle rules of visual typography and structural pacing, the application feels unpolished and generic.</p>
<h4>The Developer-Designer (Product Engineer) Resolution</h4>
<p>By uniting design and engineering, we eliminate this friction. What you approve is what ships. Code is the primary canvas, and layouts are built with native components from day one. Interaction feedback, layout animations, and dark configurations become natural elements, not costly compromises.</p>`
  },
  {
    slug: "offline-first-background-sync",
    title: "Setting Up Offline-First Background Sync in Flutter Apps",
    excerpt: "Solving sync conflicts, tracking state databases locally, and managing server writes over cellular networks.",
    publishedAt: "May 11, 2026",
    readTime: "10 min read",
    tags: ["Flutter", "Offline-First", "Architecture"],
    contentHtml: `<p>Building an app that expects continuous web access is a vulnerability. In warehouse loading gates, agricultural fields, or logistics shipping trucks, connectivity drops are expected. If your apps fail to work offline, they disrupt active company operations.</p>
<h4>Data Synchronization Strategies</h4>
<p>To implement zero data loss, we follow a strict offline-first blueprint:</p>
<ol>
  <li><strong>Mirror Local Keys</strong>: Keep records in an embedded cache database so screens load immediately in any state.</li>
  <li><strong>Write to Queue First</strong>: Store user updates in an internal logs structure instead of calling immediate API post requests.</li>
  <li><strong>Idempotency Tokens</strong>: Attach solid metadata tags to every transaction queue item to guarantee server processes run safely without duplicate record risks.</li>
  <li><strong>Automatic Sync Jobs</strong>: Start background workers that verify internet health and upload transactions cleanly.</li>
</ol>
<p>By configuring client databases as the primary source of truth, apps stay absolutely reliable under any network constraints.</p>`
  }
];

export const MOHSIN_BIO = {
  name: "Muhammad Mohsin",
  displayName: "mosen.",
  title: "Product Engineer · Designer · Automation Builder",
  location: "Gujrat, Pakistan",
  email: "hello@mosen.dev",
  github: "https://github.com/m6474n",
  linkedin: "https://linkedin.com/in/muhammad--mohsin",
  experienceYears: "4+",
  projectsDelivered: "30+",
  coreDisciplinesCount: "3",
  bioHeadline: "One person. Three disciplines. Zero handoffs.",
  detailedBio: "Muhammad Mohsin is a seasoned product builder based in Gujrat, Pakistan. With a unique combination of visual design precision, native client coding, and advanced automation engineering, he crafts clean, functional, high-converting digital applications. He works with founders, SaaS pioneers, and operational managers who value fast, dependable, complete products over heavy agency overhead."
};

export const SKILLSET: SkillCategory[] = [
  {
    category: 'FRONTEND & MOBILE',
    items: ['React / Next.js', 'Flutter & Dart (iOS, Android, Desktop)', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand', 'HTML5 / CSS3 / ES6']
  },
  {
    category: 'BACKEND & SYSTEMS',
    items: ['Ruby on Rails', 'Python (FastAPI, Flask)', 'PostgreSQL', 'SQLite', 'Node.js', 'RESTful & GraphQL APIs']
  },
  {
    category: 'AUTOMATION & DEV WORKFLOWS',
    items: ['n8n Nodes Integration', 'Playwright & Selenium headless scraping', 'Cron automation schedulers', 'Docker Containerization', 'Git & CI/CD Pipelines']
  },
  {
    category: 'HARDWARE & IOT BINDINGS',
    items: ['COM / TTY Serial Port Protocols', 'C++ dynamic bindings for Dart', 'RTSP Video Feed Parsing', 'FFmpeg pipelines', 'Thermal Printing Standards']
  }
];

export const MILESTONES: Milestone[] = [
  { year: '2022 - PRESENT', title: 'INDEPENDENT PRODUCT ENGINEER', desc: 'Partnering directly with founders, B2B SaaS builders, and industrial operators to design and ship customer interfaces, offline-first scale drivers, and custom workflow automations globally.' },
  { year: '2020 - 2022', title: 'FULL-STACK ENGINEER', desc: 'Developed modular solutions combining Ruby on Rails backends with highly responsive Flutter client applications. Led integrations connecting serial ports and computer visual streams.' },
  { year: '2019 - 2020', title: 'AUTOMATION DEVELOPER', desc: 'Crafted custom scrapers and lead qualification systems utilizing Python scripting, structured JSON outputs, and automated notification channels.' },
];

export const ESTIMATOR_FEATURES: EstimatorFeature[] = [
  { id: 'custom-page', label: 'Custom Front-end Website (React / Tailwind)', cost: 1200, time: 7 },
  { id: 'flutter-app', label: 'Cross-platform Mobile App (Flutter)', cost: 2500, time: 14 },
  { id: 'api-integration', label: 'API Integrations / CRM Setup (Node/Rails/Sheets)', cost: 800, time: 4 },
  { id: 'scraper', label: 'AI Lead Scraper & Enrichment System (FastAPI + Gemini)', cost: 1500, time: 7 },
  { id: 'n8n-pipelines', label: 'n8n Custom Workflow Automation Schedulers', cost: 1000, time: 5 },
  { id: 'hardware-serial', label: 'Serial Ports / Local Scales Hardware Linker', cost: 1800, time: 10 },
];

export const SERVICES_FAQ: FaqItem[] = [
  {
    question: "DO YOU WORK ALONE OR WITH AN AGENCY?",
    answer: "I operate entirely as an independent engineer. That means there is zero handover time, and you communicate directly with the constructor who writes every line of database code or UI styling."
  },
  {
    question: "HOW ARE INVOICING AND PAYMENTS HANDLED?",
    answer: "We agree on a flat project price before initializing. Setup requires a 50% deposit, with the remainder due upon complete testing, deployment, and handoff."
  },
  {
    question: "DO YOU COMPLY WITH CODE AUDITING AND MAINTENANCE?",
    answer: "Absolutely. All custom scripts, widgets, and database collections are bundled with detailed documentation records so any internal engineering team can easily inherit the project."
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  { num: '1', title: 'DISCOVERY', desc: 'One focused call to understand your business, bottlenecks, and success parameters.' },
  { num: '2', title: 'STRATEGY', desc: 'A custom scoped proposal with clear milestones, deliverables, and flat rates.' },
  { num: '3', title: 'DESIGN', desc: 'High-fidelity wireframes approved before coding. You inspect the product early.' },
  { num: '4', title: 'BUILD', desc: 'Robust development cycles with async-first status logs and clear check-ins.' },
  { num: '5', title: 'LAUNCH', desc: 'Deployment with clear training metrics and complete guides handed over.' },
  { num: '6', title: 'OPTIMIZE', desc: 'Post-launch feedback audits and integrations based on real runtime metrics.' },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: '"Mohsin delivered what three previous freelancers couldn\'t — a system that actually works in the field, offline, without excuses. The attention to detail on both design and functionality is unlike anything I\'ve seen from a single developer."',
    author: 'TRADING OPERATIONS DIRECTOR',
    meta: 'B2B Trading Platform, UAE'
  },
  {
    quote: '"I told him the problem on Monday. By Friday I had a working automation running in production. No back-and-forth, no handoff gaps, no scope creep. He thinks in systems — which is exactly what we needed."',
    author: 'FOUNDER',
    meta: 'B2B SaaS, Remote'
  },
  {
    quote: '"The lead qualification agent he built saved my team 8 hours a week from day one. What impressed me most is how clean the code is — it\'s not a hack, it\'s a system we can actually build on top of."',
    author: 'GROWTH LEAD',
    meta: 'Early-stage Startup'
  }
];

export const PIPELINE_LATENCY_DATA: MetricPoint[] = [
  { label: 'Sprint 1', value: 920, secondary: 1200 },
  { label: 'Sprint 2', value: 740, secondary: 1100 },
  { label: 'Sprint 3', value: 580, secondary: 950 },
  { label: 'Sprint 4', value: 390, secondary: 850 },
  { label: 'Sprint 5', value: 240, secondary: 600 },
  { label: 'Sprint 6', value: 160, secondary: 400 },
  { label: 'Sprint 7', value: 110, secondary: 300 },
  { label: 'Sprint 8', value: 78, secondary: 220 }
];

export const LEAD_THROUGHPUT_DATA: BarPoint[] = [
  { label: 'Jan', value: 12.5, highlight: false },
  { label: 'Feb', value: 24.8, highlight: false },
  { label: 'Mar', value: 45.2, highlight: false },
  { label: 'Apr', value: 72.1, highlight: false },
  { label: 'May', value: 98.4, highlight: false },
  { label: 'Jun', value: 142.9, highlight: true }
];

export const SYSTEM_SAVINGS_DATA: MetricPoint[] = [
  { label: 'Week 1', value: 8, secondary: 4 },
  { label: 'Week 2', value: 16, secondary: 8 },
  { label: 'Week 3', value: 24, secondary: 12 },
  { label: 'Week 4', value: 35, secondary: 18 },
  { label: 'Week 5', value: 48, secondary: 24 },
  { label: 'Week 6', value: 64, secondary: 32 },
  { label: 'Week 7', value: 82, secondary: 40 },
  { label: 'Week 8', value: 104, secondary: 52 }
];

// 56 days of pipeline ticks/contributions activity map (8 weeks x 7 days)
export const ACTIVITY_GRID_DATA: ActivityGridDay[] = [
  // Week 1
  { date: 'Apr 20', count: 12, level: 2, category: 'n8n pipelines' },
  { date: 'Apr 21', count: 8, level: 1, category: 'scraper crons' },
  { date: 'Apr 22', count: 24, level: 3, category: 'postgres sync' },
  { date: 'Apr 23', count: 0, level: 0 },
  { date: 'Apr 24', count: 6, level: 1, category: 'lead enrichment' },
  { date: 'Apr 25', count: 42, level: 4, category: 'burst scrape' },
  { date: 'Apr 26', count: 15, level: 2, category: 'api routes' },
  // Week 2
  { date: 'Apr 27', count: 14, level: 2, category: 'n8n pipelines' },
  { date: 'Apr 28', count: 32, level: 3, category: 'lead enrichment' },
  { date: 'Apr 29', count: 18, level: 2, category: 'image fetcher' },
  { date: 'Apr 30', count: 0, level: 0 },
  { date: 'May 01', count: 5, level: 1, category: 'hardware bound tty' },
  { date: 'May 02', count: 28, level: 3, category: 'fastapi scrapers' },
  { date: 'May 03', count: 0, level: 0 },
  // Week 3
  { date: 'May 04', count: 9, level: 1, category: 'n8n sync' },
  { date: 'May 05', count: 16, level: 2, category: 'rails callbacks' },
  { date: 'May 06', count: 54, level: 4, category: 'bulk lead sweep' },
  { date: 'May 07', count: 38, level: 3, category: 'gemini embeddings' },
  { date: 'May 08', count: 12, level: 2, category: 'sqlite local backup' },
  { date: 'May 09', count: 0, level: 0 },
  { date: 'May 10', count: 2, level: 1, category: 'ping heartbeats' },
  // Week 4
  { date: 'May 11', count: 21, level: 3, category: 'n8n pipelines' },
  { date: 'May 12', count: 17, level: 2, category: 'automation cron' },
  { date: 'May 13', count: 4, level: 1, category: 'error monitoring' },
  { date: 'May 14', count: 0, level: 0 },
  { date: 'May 15', count: 29, level: 3, category: 'serial scale data' },
  { date: 'May 16', count: 49, level: 4, category: 'saas outbound automation' },
  { date: 'May 17', count: 11, level: 2, category: 'database migrations' },
  // Week 5
  { date: 'May 18', count: 8, level: 1, category: 'node callback' },
  { date: 'May 19', count: 33, level: 3, category: 'structured scraping' },
  { date: 'May 20', count: 12, level: 2, category: 'n8n sync' },
  { date: 'May 21', count: 6, level: 1, category: 'webhook relays' },
  { date: 'May 22', count: 0, level: 0 },
  { date: 'May 23', count: 15, level: 2, category: 'lead enrichment' },
  { date: 'May 24', count: 52, level: 4, category: 'scrapers burst volume' },
  // Week 6
  { date: 'May 25', count: 19, level: 2, category: 'image metadata' },
  { date: 'May 26', count: 27, level: 3, category: 'leads outbound relay' },
  { date: 'May 27', count: 41, level: 4, category: 'gemini classification' },
  { date: 'May 28', count: 8, level: 1, category: 'sqlite optimizations' },
  { date: 'May 29', count: 0, level: 0 },
  { date: 'May 30', count: 32, level: 3, category: 'fastapi routers' },
  { date: 'May 31', count: 14, level: 2, category: 'n8n automated cron' },
  // Week 7
  { date: 'Jun 01', count: 7, level: 1, category: 'tty thermal binder' },
  { date: 'Jun 02', count: 22, level: 3, category: 'postgres scaling indexes' },
  { date: 'Jun 03', count: 47, level: 4, category: 'system sweep automation' },
  { date: 'Jun 04', count: 19, level: 2, category: 'lead qualifiers' },
  { date: 'Jun 05', count: 0, level: 0 },
  { date: 'Jun 06', count: 11, level: 2, category: 'playwright headless' },
  { date: 'Jun 07', count: 3, level: 1, category: 'uptime relay' },
  // Week 8
  { date: 'Jun 08', count: 25, level: 3, category: 'n8n lead stream' },
  { date: 'Jun 09', count: 39, level: 3, category: 'gemini validation pipeline' },
  { date: 'Jun 10', count: 62, level: 4, category: 'concurrent scraper arrays' },
  { date: 'Jun 11', count: 18, level: 2, category: 'webhook processing' },
  { date: 'Jun 12', count: 8, level: 1, category: 'backup sync scheduler' },
  { date: 'Jun 13', count: 51, level: 4, category: 'bulk lead enrichments' },
  { date: 'Jun 14', count: 14, level: 2, category: 'live status triggers' }
];

