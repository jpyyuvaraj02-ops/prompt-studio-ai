// SUGGESTIONS list for prompt creation
export const SUGGESTIONS = [
  { id: '1', title: 'Coffee Shop Website', description: 'Order manager, menu customization, and local delivery routing', icon: 'coffee' },
  { id: '2', title: 'Hospital Website', description: 'Doctor appointments, medical records portal, and patient queue', icon: 'activity' },
  { id: '3', title: 'Portfolio Website', description: 'Interactive dark-themed resume with motion showcases and blog', icon: 'user' },
  { id: '4', title: 'Restaurant Website', description: 'Table reservations, dynamic menu builder, and cart system', icon: 'utensils' },
  { id: '5', title: 'Create Landing Page', description: 'High-converting layout with pricing tiers and email capture', icon: 'sparkles' },
  { id: '6', title: 'Resume Analyzer', description: 'ATS score checker, keyword scanner, and tailored suggestions', icon: 'file-text' },
  { id: '7', title: 'AI Chatbot', description: 'Real-time assistant with local storage memory and prompt tuning', icon: 'message-square' },
  { id: '8', title: 'Ecommerce Website', description: 'Product grid, checkout basket, and integrated payment mockup', icon: 'shopping-bag' },
];

// BUILT_IN_SKILLS list for the Skill Center view
export const BUILT_IN_SKILLS = [
  {
    id: 's1',
    title: 'Frontend Website Creator',
    description: 'Generates clean, single-page client side applications using HTML/CSS/JS and modern frameworks.',
    category: 'built-in',
    icon: 'layout',
    features: ['Modular HTML structure', 'Responsive viewport rules', 'Mobile-first fluid sizing'],
    outputs: ['index.html', 'style.css', 'app.js']
  },
  {
    id: 's2',
    title: 'Landing Page Optimizer',
    description: 'Engineers landing page copy, visual flow, call to actions, and subscription capturing metrics.',
    category: 'built-in',
    icon: 'sparkles',
    features: ['High-converting hero headers', 'Structured features grid', 'FAQ accordion layout'],
    outputs: ['HeroSection.html', 'CTA_Optimizations.md']
  },
  {
    id: 's3',
    title: 'Portfolio Architect',
    description: 'Designs interactive, highly professional developer or creator resumes with micro-interactions.',
    category: 'built-in',
    icon: 'user',
    features: ['Responsive timelines', 'Tag-based projects filter', 'Interactive contact form'],
    outputs: ['portfolio.html', 'transitions.css']
  },
  {
    id: 's4',
    title: 'Bootstrap Integrator',
    description: 'Creates layouts with Bootstrap 5 components, interactive modals, responsive offcanvas menus, and grids.',
    category: 'built-in',
    icon: 'grid',
    features: ['Container-Row-Col alignment', 'Pre-styled alerts and badge icons', 'Bootstrap Theme Variables'],
    outputs: ['bootstrap-index.html', 'custom-bootstrap.css']
  },
  {
    id: 's5',
    title: 'HTML & CSS Standardizer',
    description: 'Structures semantic layouts with complete SEO tag configurations and modern layout schemes.',
    category: 'built-in',
    icon: 'file-code',
    features: ['Semantic HTML5 tags', 'CSS grid & flexbox systems', 'Consistent typographic margins'],
    outputs: ['layout.css', 'tags-index.html']
  },
  {
    id: 's6',
    title: 'JavaScript Vanilla Engine',
    description: 'Writes highly performant native JS for dom manipulation, async requests, and LocalStorage hooks.',
    category: 'built-in',
    icon: 'cpu',
    features: ['Optimized event listeners', 'Custom LocalStorage manager', 'Vanilla fetch proxies'],
    outputs: ['app.js', 'storage.js']
  },
  {
    id: 's7',
    title: 'React Blueprint Generator',
    description: 'Creates stateful components, React hooks, modular layouts, and memoized dependency logic.',
    category: 'built-in',
    icon: 'layers',
    features: ['Functional components with state', 'Optimized useEffect arrays', 'Props interface definitions'],
    outputs: ['App.tsx', 'components/Dashboard.tsx', 'types.ts']
  },
  {
    id: 's8',
    title: 'Prompt Generator',
    description: 'Turns a raw, simple idea into a fully customized, role-assigned, highly engineered AI prompt.',
    category: 'built-in',
    icon: 'message-square',
    features: ['Persona assignment', 'Few-shot example injection', 'Context boundary setting'],
    outputs: ['Prompt.md']
  },
  {
    id: 's9',
    title: 'Prompt Optimizer',
    description: 'Audits existing prompts for ambiguity, redundancy, or lack of constraints and optimizes output quality.',
    category: 'built-in',
    icon: 'wand',
    features: ['Ambiguity detection', 'Negative constraint checklist', 'Token consumption planning'],
    outputs: ['OptimizedPrompt.md']
  },
  {
    id: 's10',
    title: 'Skill.md Generator',
    description: 'Creates structured instruction manuals (Skill.md) for custom agents and workflows.',
    category: 'built-in',
    icon: 'book-open',
    features: ['Frontmatter metadata syntax', 'Step-by-step role definitions', 'Pre-baked system templates'],
    outputs: ['SKILL.md']
  },
  {
    id: 's11',
    title: 'README Markdown Master',
    description: 'Creates extensive, beautiful repository README.md documents with clear architecture flow charts.',
    category: 'built-in',
    icon: 'file-text',
    features: ['Technical stack badges', 'Prerequisites and setup guides', 'Folder hierarchy logs'],
    outputs: ['README.md']
  },
  {
    id: 's12',
    title: 'Database Schema Designer',
    description: 'Designs SQL schema layouts, entity-relationship structures, and custom indexes.',
    category: 'built-in',
    icon: 'database',
    features: ['Relational DB diagrams', 'PostgreSQL data types', 'Unique indexes & foreign key cascading'],
    outputs: ['schema.sql', 'migrations.sql']
  },
  {
    id: 's13',
    title: 'API Documenter',
    description: 'Generates detailed REST API specifications with endpoint descriptions and JSON schemas.',
    category: 'built-in',
    icon: 'code',
    features: ['Standard endpoint paths', 'HTTP response status maps', 'Payload schemas'],
    outputs: ['api_docs.json', 'endpoints.md']
  },
  {
    id: 's14',
    title: 'Software Architecture Planner',
    description: 'Structures multi-module solutions, separating service layers, data access layers, and UI controllers.',
    category: 'built-in',
    icon: 'git-branch',
    features: ['Layered application design', 'Clean architecture bounds', 'Data Flow maps'],
    outputs: ['architecture.md', 'module-tree.txt']
  },
  {
    id: 's15',
    title: 'Testing Suite Assistant',
    description: 'Structures comprehensive test plans covering Unit testing, Integration testing, and E2E logic.',
    category: 'built-in',
    icon: 'shield-check',
    features: ['Assertion checklists', 'Mock API responses', 'Error path tests'],
    outputs: ['test_cases.md', 'app.test.js']
  },
  {
    id: 's16',
    title: 'Bug Fix Assistant',
    description: 'Inspects error stack traces and logs to propose targeted corrections with safety fallback checks.',
    category: 'built-in',
    icon: 'bug',
    features: ['Log trace parser', 'Common NPM issue checks', 'Fallback safety guards'],
    outputs: ['fix_report.md']
  },
  {
    id: 's17',
    title: 'Deployment Architect',
    description: 'Outlines optimized guides for deploying applications to Google Cloud Run, Vercel, Netlify or Docker.',
    category: 'built-in',
    icon: 'server',
    features: ['Dockerfile multi-stage configs', 'Static folder server directives', 'Continuous Integration files'],
    outputs: ['Dockerfile', 'deploy.sh']
  },
  {
    id: 's18',
    title: 'UI Component Designer',
    description: 'Translates functional specifications into polished CSS grids, flexboxes, margins, and typography tokens.',
    category: 'built-in',
    icon: 'palette',
    features: ['Bootstrap typography tokens', 'Color harmony scales', 'Custom component shadows'],
    outputs: ['components.css', 'theme.config']
  }
];

// INITIAL_COMMUNITY_PROMPTS
export const INITIAL_COMMUNITY_PROMPTS = [
  {
    id: 'c1',
    title: 'Ultimate Coffee Shop Application Prompt',
    description: 'A highly engineered prompt pack designed to create a premium, dark-mode coffee shop landing and ordering system. Fully detailed with schema mapping.',
    creator: { name: 'Sarah Brewster', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    likes: 245,
    downloads: 1205,
    price: 0,
    tags: ['Coffee', 'E-Commerce', 'Frontend'],
    category: 'Frontend',
    timestamp: '2 hours ago'
  },
  {
    id: 'c2',
    title: 'Enterprise Hospital Portal & Booking system',
    description: 'Complete prompt specification for patient portals, doctor shift calendars, and appointment scheduler with Firestore structural models included.',
    creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    likes: 189,
    downloads: 874,
    price: 19.99,
    tags: ['Hospital', 'SaaS', 'Database'],
    category: 'Fullstack',
    timestamp: '1 day ago'
  },
  {
    id: 'c3',
    title: 'Interactive Developer Portfolio Generator',
    description: 'Perfect prompt for generating custom personal portfolios with elegant timeline paths, dark/light toggle rules, and copyable project cards.',
    creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
    likes: 312,
    downloads: 2450,
    price: 0,
    tags: ['Portfolio', 'Resume', 'Minimalist'],
    category: 'Frontend',
    timestamp: '3 days ago'
  },
  {
    id: 'c4',
    title: 'Gourmet Restaurant Booking System Prompt',
    description: 'Interactive table layout and booking validator prompt. Includes detailed guidelines for generating cart totals, local delivery rules, and menus.',
    creator: { name: 'Marcus Sterling', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces' },
    likes: 154,
    downloads: 612,
    price: 9.99,
    tags: ['Restaurant', 'Menus', 'UI Design'],
    category: 'Frontend',
    timestamp: '4 days ago'
  }
];

// INITIAL_MARKETPLACE_ITEMS
export const INITIAL_MARKETPLACE_ITEMS = [
  {
    id: 'm1',
    title: 'AI Code Refactoring Master Suite',
    description: 'An elite, comprehensive set of engineered system prompts for auditing performance bottlenecks, scanning security loopholes, and automated TypeScript refactoring.',
    creator: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces' },
    rating: 4.9,
    price: 2499,
    verified: true,
    tags: ['AI', 'Performance', 'TypeScript'],
    category: 'AI',
    downloads: 412,
    reviewsCount: 48,
    longDescription: 'This Master Suite has been tested with Claude 3.5 Sonnet and GPT-4o to refactor complex legacy enterprise applications. It identifies redundant state updates, memory leaks in subscription hooks, and type violations, producing optimal clean code.'
  },
  {
    id: 'm2',
    title: 'NoSQL Database Schema & Migration Agent',
    description: 'Optimized prompts for generating complex structural document designs, partition key selections, and secure data access rule files.',
    creator: { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces' },
    rating: 4.8,
    price: 1499,
    verified: true,
    tags: ['Database', 'Firestore', 'NoSQL'],
    category: 'Backend',
    downloads: 320,
    reviewsCount: 35,
    longDescription: 'Excellent prompt schema generator for Firestore or MongoDB databases. Avoids hot-spotting, designs robust collection sub-paths, and generates complete, copy-paste ready firestore.rules sets customized for your collection layouts.'
  },
  {
    id: 'm3',
    title: 'Machine Learning Model Trainer Prompt Set',
    description: 'Prompts designed for data preprocessing pipelines, hyperparameter tuning templates, and model validation report generation.',
    creator: { name: 'Sarah Brewster', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces' },
    rating: 4.7,
    price: 2999,
    verified: true,
    tags: ['Machine Learning', 'Python', 'Pandas'],
    category: 'Machine Learning',
    downloads: 185,
    reviewsCount: 19,
    longDescription: 'Accelerate your data science workflows. Instantly generate Pandas data scrubbing scripts, Scikit-Learn pipelines, grid search models, and beautifully formatted validation reports outlining precision, recall, and F1 scores.'
  },
  {
    id: 'm4',
    title: 'Clean Architecture API Boilerplate Planner',
    description: 'A structural system prompt mapping clean directory trees, controller layouts, dependency injectors, and unit testing mocks.',
    creator: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' },
    rating: 4.9,
    price: 0,
    tags: ['Backend', 'Clean Architecture', 'API'],
    category: 'Backend',
    downloads: 1890,
    reviewsCount: 122,
    longDescription: 'Create rock-solid backends. Proposes standard domain-driven structures separating routing, request schemas, business logic use-cases, and persistence layers. Free for the community!'
  }
];

// COFFEE TEMPLATES
const COFFEE_TEMPLATES = {
  promptMd: `# ESPRESSO HUB ENGINE PROMPT
You are an expert Frontend Architect specializing in Apple-inspired minimalist layouts.
Create a Premium Single Page Coffee Shop Web App named "Espresso Hub".

## Core Requirements:
1. **Header**: Glassmorphism navbar with local delivery status indicator ("● Open for Delivery"), dynamic basket count badge, and "Order Now" primary call to action.
2. **Hero Section**: Huge title: "Crafted Beans. Perfect Mornings." Subtitle: "Organic single-origin coffee roasted fresh and delivered directly to your desk." Dynamic order-input field and illustrative grid.
3. **Menu Grid**: 6 items with filter tags ("Hot Brew", "Iced Cold", "Artisanal Pastries"). Each item needs an elegant card displaying name, roast profile description, custom price, and an "+" quick add to basket button.
4. **Basket Controller**: A sliding side canvas that calculates order items, live discount codes ("COFFEE10" for 10% off), delivery fees, and saves basket content securely inside local storage.
5. **Interactive Feedback**: Soft scale-up on card hover, satisfying click micro-interactions, toast notification popup upon successfully adding item to cart.

Style strictly with deep rich espresso browns (#2C1B18), soft cream (#FAF7F2), warm coffee highlights, and beautiful rounded corner cards (20px).`,

  skillMd: `# Skill Definition: Coffee Shop Specialist
## Metadata
Name: Coffee App Standardizer
Version: 1.0.0
Description: Standardizes prompt styles, design variables, and interaction metrics for coffee houses and boutique menus.

## Context Boundaries
- Focus exclusively on luxury café layouts.
- Primary visual theme: Warm tones, high contrast light backgrounds, generous padding, large display headlines.

## Output Standards
- **CSS Palette**: Use \`--color-espresso: #2C1B18\` and \`--color-creme: #FDFBF7\`.
- **Card Borders**: Ensure all items are framed in high contrast cards utilizing \`rounded-[20px]\` and \`shadow-sm\`.
- **Cart Handler**: Provide full standard state callbacks for adding, subtractive updates, and LocalStorage caching.`,

  prd: `# PRODUCT REQUIREMENTS DOCUMENT (PRD) - Espresso Hub
## 1. Executive Summary
Espresso Hub is a boutique, client-only web platform designed to facilitate rapid coffee and pastry online ordering. The system emphasizes high visual luxury, instant checkout, and persistent local cart states.

## 2. Core User Personas
* **The Busy Executive**: Needs to browse options in under 20 seconds, add an espresso blend, input delivery address, and proceed immediately.
* **The Specialty Aficionado**: Wants to see roast details, bean origins, and artisanal notes before ordering.

## 3. Scope & Feature List
* **Catalog Browsing**: Tag-based filter system ("Brewed", "Pastry", "Cold Press").
* **Local Shopping Cart**: Supports persistent storage of quantities, item prices, subtotal calculations, and order dispatch alerts.
* **Local Delivery Estimator**: Uses a timer to simulate barista prep state changes ("Grinding", "Brewing", "Out for Delivery").

## 4. Key Performance Indicators (KPIs)
* Zero page reload catalog navigation.
* Instant visual feedback (Toast) within 100ms of adding items.`,

  folderStructure: `EspressoHub/
├── index.html
├── src/
│   ├── main.js
│   ├── style.css
│   └── data.js
├── package.json
└── vite.config.ts`,

  database: `-- ESPRESSO HUB POSTGRESQL SCHEMAS
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    roast_level INT CHECK (roast_level BETWEEN 1 AND 5),
    is_available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(150) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INT REFERENCES menu_items(id),
    quantity INT NOT NULL,
    price_at_sale DECIMAL(10,2) NOT NULL
);

-- Seed Data
INSERT INTO categories (name, slug) VALUES 
('Hot Brews', 'hot-brews'),
('Iced Cold', 'iced-cold'),
('Pastries', 'pastries');`,

  api: `# ESPRESSO HUB REST API DOCUMENTATION
Base URL: \`https://api.espressohub.store/v1\`

### 1. Retrieve Menu Catalog
- **Endpoint**: \`GET /menu\`
- **Query Params**: \`category=iced-cold\` (Optional)
- **Response**: \`200 OK\`
\`\`\`json
[
  {
    "id": 101,
    "name": "Nitro Cold Brew",
    "description": "Slow-steeped 20 hours infused with nitrogen for velvety foam.",
    "price": 5.50,
    "category": "iced-cold"
  }
]
\`\`\`

### 2. Submit Delivery Order
- **Endpoint**: \`POST /orders\`
- **Body Payload**:
\`\`\`json
{
  "email": "customer@gmail.com",
  "address": "120 Broadway, New York, NY",
  "items": [
    { "itemId": 101, "quantity": 2 }
  ]
}
\`\`\`
- **Response**: \`201 Created\`
\`\`\`json
{
  "orderId": 4509,
  "status": "processing",
  "eta_minutes": 15
}
\`\`\``,

  uiPrompt: `Create a gorgeous web page utilizing custom CSS. The header must feature an ultra-clean layout with a dark wooden-toned text color.
The main body should utilize an asymmetrical grid structure.
Left Column: Focus on high contrast product typography, detailed origin descriptions, and an elegant selection toggle.
Right Column: A large, soft-creamy card containing an checkout calculator with smooth transitions and item counters.
Use extensive backdrop-filter: blur for modal popups, and elegant custom borders with curved radius of exactly 20px.`,

  readme: `# Espresso Hub - Premium Ordering Portal
A high-performance specialty coffee catalog and checkout solution engineered with Bootstrap 5, HTML5, CSS3, and Vanilla JavaScript (ES6).

## Features
- **Apple-inspired layout**: Minimal, focused on typography and spacious margins.
- **LocalStorage persistence**: Keeps shopping baskets active even after closing the browser tab.
- **Responsive design**: Engineered entirely with clean Bootstrap 5 grid variables.

## Development Guide
1. **Launch Dev Server**:
   \`\`\`bash
   npm run dev
   \`\`\`
2. **Build Static Bundle**:
   \`\`\`bash
   npm run build
   \`\`\``,

  deployment: `# CLOUD RUN DEPLOYMENT PROCESS
We bundle the Espresso Hub Vanilla application into a static site and deploy it to Google Cloud Run for rapid global delivery.

## Step 1: Create Dockerfile
\`\`\`dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

## Step 2: Build Container
\`\`\`bash
gcloud builds submit --tag gcr.io/my-project/espresso-hub .
\`\`\`

## Step 3: Deploy to Cloud Run
\`\`\`bash
gcloud run deploy espresso-hub \\
  --image gcr.io/my-project/espresso-hub \\
  --platform managed \\
  --port 3000 \\
  --allow-unauthenticated
\`\`\``
};

// HOSPITAL TEMPLATES
const HOSPITAL_TEMPLATES = {
  promptMd: `# CAREPULSE HOSPITAL ENGINE PROMPT
Act as an elite full-stack system designer. Propose a medical dashboard called "CarePulse".

## App Objectives:
1. **Welcome Area**: Greeting the doctor/patient with an elegant dashboard showing live appointment counters, average triage wait times, and emergency flags.
2. **Doctor Matcher**: Match symptoms entered by users to the best available hospital specialist and trigger booking calendar slots.
3. **Interactive Booking**: Seamless date/time scheduler. Prevents double-booking using client-side validation logic. Saves appointments in local storage.
4. **Electronic Health Records (EHR)**: View and filter secure clinical summaries, lab reports, and medication histories using highly readable, high-contrast, beautiful charts.

Maintain professional medical colors: calm medical teal (#0EA5E9), clean white backgrounds (#FFFFFF), soft steel text, and secure badge layouts.`,

  skillMd: `# Skill Definition: Secure EHR Layouts
## Metadata
Name: CarePulse UX Auditor
Version: 1.1.0
Description: Ensures high legibility, color contrast, and fast emergency navigation for hospital portal layouts.

## Guidelines
- **Color Contrast**: Always maintain a high 4.5:1 text-to-bg contrast. Use deep steel text (#0F172A) on soft off-white cards.
- **Emergency Tags**: Always anchor urgent triage notifications to the absolute top-right of the dashboard using vivid alarm colors (#EF4444).
- **Interactive Tables**: Medical record grids must have responsive search fields and status pills indicating 'Completed', 'Processing', or 'Cancelled'.`,

  prd: `# PRODUCT REQUIREMENTS DOCUMENT - CarePulse Medical Portal
## 1. Scope & Goals
CarePulse bridges communication gaps between registered patients and clinical doctors. It provides real-time appointment self-scheduling, queue visualizers, and structured symptom matching tools.

## 2. Technical Stack Boundaries
- **Frontend**: HTML5, CSS3, Bootstrap 5, Vanilla JS (ES6)
- **Data Cache**: Synchronized LocalStorage representing doctor rosters, clinical appointments, and EHR database logs.

## 3. High Priority User Flows
1. **Patient Login**: Input name and health insurance card number.
2. **Symptom Query**: User types "persistent cough". System suggests Pulmonologist.
3. **Booking**: Patient selects date and clicks "Book Appointment".
4. **Confirmation**: Real-time confirmation shows specialist info and ticket ID.`,

  folderStructure: `CarePulse/
├── index.html
├── src/
│   ├── main.js
│   ├── style.css
│   └── data.js
└── package.json`,

  database: `-- CAREPULSE RELATIONAL SCHEMAS
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    is_on_duty BOOLEAN DEFAULT TRUE,
    max_daily_patients INT DEFAULT 12
);

CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    insurance_number VARCHAR(50) UNIQUE NOT NULL,
    blood_group VARCHAR(10)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_time TIMESTAMP NOT NULL,
    symptoms TEXT,
    status VARCHAR(20) DEFAULT 'confirmed'
);`,

  api: `# CAREPULSE EHR AND BOOKING API
Base URL: \`https://api.carepulse-clinical.org/v2\`

### 1. Fetch Active Doctors
- **Endpoint**: \`GET /doctors/active\`
- **Response**: \`200 OK\`
\`\`\`json
[
  { "id": 1, "name": "Dr. Angela Rogers", "specialty": "Cardiology" }
]
\`\`\`

### 2. Create Clinical Appointment
- **Endpoint**: \`POST /appointments/book\`
- **Payload**:
\`\`\`json
{
  "patientId": 409,
  "doctorId": 1,
  "timeSlot": "2026-07-09T10:00:00Z",
  "symptoms": "Irregular heartbeat"
}
\`\`\`
- **Response**: \`201 Created\`
\`\`\`json
{ "ticketId": "APT-9920", "status": "approved" }
\`\`\``,

  uiPrompt: `Build a dual-pane medical dashboard.
Left Panel: Compact profile navigation and diagnostic quick actions.
Right Panel: EHR patient records grid, interactive line chart visualizing patient vitals, and a list of upcoming appointments.
Color scheme: High-contrast professional clinical shades (#0EA5E9, #0F172A), crisp neutral borders, clear badge statuses.`,

  readme: `# CarePulse - Clinical Patient Portal
Responsive, highly secure medical scheduling catalog and EHR mock panel utilizing Bootstrap 5, semantic HTML5, and persistent client-side state logic.

## Setup
1. Launch Dev Server: \`npm run dev\`
2. Compile Production Bundle: \`npm run build\``,

  deployment: `# CAREPULSE PROD DEPLOYMENT
Deployed as a static secure portal on Cloud Run.

## Build Step
\`\`\`bash
npm run build
\`\`\``
};

// PORTFOLIO TEMPLATES
const PORTFOLIO_TEMPLATES = {
  promptMd: `# DEVSYNC MINIMALIST PORTFOLIO PROMPT
Create a premium interactive personal resume and showcase web app called "DevSync".

## UI Requirements:
1. **Interactive Resume**: A timeline detailing historical tech roles, certifications, and academic degrees.
2. **Interactive Showcase Grid**: 4 portfolio items with high-contrast hover slides and github link previews.
3. **Live Tech Tags**: Clickable skill pills ("Javascript", "Node", "PostgreSQL", "Cloud Run") that filter projects.
4. **Contact Form Gateway**: Client-side validated form that records inbox messages inside LocalStorage and displays success toasts.

Design: Dark obsidian theme (#090D16), neon glowing highlights, thin silver borders, strict focus on crisp white monospace typography.`,

  skillMd: `# Skill Definition: DevSync Aesthetics
## Metadata
Name: Portfolio Art Director
Version: 1.0.0

## Standards
- **Typography**: JetBrains Mono for display headings and body statistics.
- **Accents**: Neon indigo glow borders (\`box-shadow: 0 0 15px rgba(99, 102, 241, 0.15)\`).
- **Lists**: Clean staggered entry rules for contact logs.`,

  prd: `# PRODUCT REQUIREMENTS DOCUMENT - DevSync
## 1. Summary
DevSync compiles developer credentials, showcases production-grade code repositories, and provides a local contact inbox without server storage overhead.

## 2. Core Functional Requirements
- **Responsive Navigation**: Smooth section scrolling (About, Experience, Work, Contact).
- **Project Filter Engine**: Filtering projects based on active technical tags.
- **Message Box**: A settings-like terminal widget for reviewing submitted visitor letters.`,

  folderStructure: `DevSync/
├── index.html
├── src/
│   ├── main.js
│   ├── style.css
│   └── data.js
└── package.json`,

  database: `-- PORTFOLIO CONTACT LOG SCHEMAS
CREATE TABLE visitor_messages (
    id SERIAL PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(150) NOT NULL,
    subject VARCHAR(200),
    message_text TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,

  api: `# DEVSYNC CONTACT ROUTER
### Submit Contact Form
- **Endpoint**: \`POST /api/contact\`
- **Body**:
\`\`\`json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Collab",
  "message": "Let's build a software product!"
}
\`\`\`
- **Response**: \`200 OK\`
\`\`\`json
{ "status": "success", "message": "Logged locally in database" }
\`\`\``,

  uiPrompt: `Create an executive monochrome dark portfolio resume. Use Space Grotesk or JetBrains Mono fonts.
Left column: Sticky developer snapshot, tech stack tags, and quick-copy links.
Right column: Work experience timeline, projects bento grid, and a dark-theme contact form.`,

  readme: `# DevSync Portfolio
High-contrast terminal-like personal portfolio built with Bootstrap 5 and vanilla ES6 modules.`,

  deployment: `# DEVSYNC DEPLOYMENT SPEC
Build and deploy to Vercel or Cloud Run.`
};

// RESTAURANT TEMPLATES
const RESTAURANT_TEMPLATES = {
  promptMd: `# LA SAFFRON RESERVATION ENGINE PROMPT
Design a Gourmet Dining Table Scheduler and Reservation portal called "La Saffron".

## Core Layout Goals:
1. **Table Selector**: Interactive floor plan visualizer showing tables (2-Seater, 4-Seater, Booth, Private Suite) with status indicators ("Available", "Reserved").
2. **Date & Seat Booking**: Form validating booking times, seat limits, and capturing credit card mock values.
3. **Digital Dining Menu**: High-contrast, elegant accordion listing starters, chef specialties, wines, and sweet selections. Supports a dynamic subtotal calculator.

Aesthetic: Elite luxury restaurant styling, saffron highlights (#F59E0B), deep velvet black backgrounds (#111827), gold margins.`,

  skillMd: `# Skill Definition: Hospitality UX
Name: La Saffron Butler
Version: 1.0.0
Description: Hospitality catalog rules, dining timelines, and seat planning constraints.`,

  prd: `# PRODUCT REQUIREMENTS DOCUMENT - La Saffron
## 1. Description
La Saffron offers luxury dining reservations and menu pre-ordering. Ensures dining rooms minimize unused tables through automated client-side scheduler guards.`,

  folderStructure: `LaSaffron/
├── index.html
├── src/
│   ├── main.js
│   └── style.css
└── package.json`,

  database: `-- LA SAFFRON TABLES AND BOOKINGS
CREATE TABLE dining_tables (
    id SERIAL PRIMARY KEY,
    capacity INT NOT NULL,
    table_type VARCHAR(50) DEFAULT 'booth',
    is_available BOOLEAN DEFAULT TRUE
);`,

  api: `# LA SAFFRON API ENDPOINTS
### Fetch Available Tables
- **Endpoint**: \`GET /tables/available\`
- **Response**: \`200 OK\``,

  uiPrompt: `Build a gourmet landing page and scheduler with deep velvet backgrounds, gold typography accents, and interactive responsive tables.`,

  readme: `# La Saffron Dining Portal
Engineered with HTML5, CSS3, Bootstrap 5, and JavaScript.`,

  deployment: `# LA SAFFRON CLOUD PLAN
Static Nginx proxy deployed on Cloud Run.`
};

// GENERIC / CUSTOM TEMPLATES GENERATOR
export function getGenericTemplates(prompt) {
  const cleanPrompt = prompt.replace(/'/g, "\\'").replace(/"/g, '\\"');
  return {
    promptMd: `# CUSTOM SPECIFICATION PROMPT
You are an advanced AI Software Architect.
You have been tasked to design an application based on this developer instruction:
"${prompt}"

## Key Requirements:
1. Create a responsive and modern HTML/CSS/Bootstrap 5 frontend layout.
2. Build an interactive client-side logic handler using Vanilla JS (ES6).
3. Persist core operational data inside LocalStorage.
4. Deliver highly readable, polished components styled with elegant neutral palettes.`,

    skillMd: `# Skill Spec: Custom Architect Instructions
Name: Custom Prompt Spec
Prompt Context: Custom specification builder for "${prompt.slice(0, 40)}..."`,

    prd: `# PRODUCT REQUIREMENTS DOCUMENT (PRD) - Custom App
## 1. Objectives
Implement a robust client-only prototype satisfying the instruction: "${prompt}"

## 2. Key Features
- High fidelity Bootstrap 5 layout.
- Responsive bento grid views.
- Fully offline client operations and state synchronization.`,

    folderStructure: `CustomApp/
├── index.html
├── src/
│   ├── main.js
│   └── style.css
└── package.json`,

    database: `-- CUSTOM SQL DATABASE SCHEMA
CREATE TABLE custom_app_records (
    id SERIAL PRIMARY KEY,
    raw_payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,

    api: `# CUSTOM API SCHEMA
### Submit Custom Transaction
- **Endpoint**: \`POST /api/custom\`
- **Response**: \`200 OK\``,

    uiPrompt: `Build a highly polished custom app with responsive cards, list filters, search, and detailed previews.`,

    readme: `# Custom Engineered Plan
Custom development blueprints compiled for: ${prompt}`,

    deployment: `# DEPLOYMENT STEPS
Deploy statically on Google Cloud Run.`
  };
}

// Main compiler entrypoint
export function generateOutputs(promptText) {
  const normalized = promptText.toLowerCase();
  
  if (normalized.includes('coffee')) {
    return {
      projectType: 'coffee',
      title: 'Espresso Hub - Premium Coffee Shop Platform',
      outputs: COFFEE_TEMPLATES
    };
  } else if (normalized.includes('hospital')) {
    return {
      projectType: 'hospital',
      title: 'CarePulse - Modern Hospital & Patient Portal',
      outputs: HOSPITAL_TEMPLATES
    };
  } else if (normalized.includes('portfolio')) {
    return {
      projectType: 'portfolio',
      title: 'DevSync - High-End Minimalist Developer Portfolio',
      outputs: PORTFOLIO_TEMPLATES
    };
  } else if (normalized.includes('restaurant')) {
    return {
      projectType: 'restaurant',
      title: 'La Saffron - Gourmet Dining Booking & Menu System',
      outputs: RESTAURANT_TEMPLATES
    };
  } else {
    // Generate some interesting title from prompt
    let title = 'Prompt Studio - Custom Software Development Plan';
    if (promptText.trim().length > 5) {
      const words = promptText.trim().split(/\s+/).slice(0, 4).join(' ');
      title = `${words.charAt(0).toUpperCase() + words.slice(1)} Blueprints`;
    }
    return {
      projectType: 'generic',
      title,
      outputs: getGenericTemplates(promptText)
    };
  }
}
