# NEXORA CRM — Premium 3D SaaS Dashboard

![NEXORA CRM](public/logo.svg)

**NEXORA CRM** is a production-quality, visually stunning Customer Relationship Management (CRM) SaaS dashboard engineered with a dark luxury aesthetic, interactive 3D spatial experiences, glassmorphic depth, and responsive frontend architecture.

Designed for high-growth enterprise SaaS businesses, venture-backed companies, and high-performance revenue teams.

---

## 🌟 Key Highlights & Design Direction

- **Dark Luxury Aesthetic**: Deep dark foundation (`#080B14`, `#101626`, `#0D1320`, `#151E30`) with electric purple (`#7967FF`) and cyan (`#38BDF8`) lighting.
- **Interactive 3D Spatial Experiences**:
  - Interactive **Three.js WebGL Spatial Core** rotating in real-time with dynamic rim lighting, metallic reflection shaders, and floating particle clouds.
  - Ambient 3D floating constellation background.
  - Card 3D perspective mouse-tracking tilt with dynamic gradient highlights.
- **Complete End-to-End Functionality (Non-Static)**:
  - Full CRUD operations on Contacts, Leads, Deals, Tasks, Calendar Events, and Workspace.
  - Persistent storage across sessions via **Zustand + LocalStorage**.
  - Dynamic KPI calculations derived directly from live application state.
  - Drag-and-drop Kanban pipeline with instant stage updates and celebratory confetti on closed-won deals.
  - 1-Click Lead conversion to both Active Contact & Sales Opportunity.
  - Interactive Recharts analytics (Area, Bar, Composed, and Pie).
  - Global `⌘K` / `Ctrl+K` Command Palette for quick search & navigation.
  - Real-time audit activity log with relative timestamps.
  - One-click CSV export on Contacts, Leads, Deals, and Revenue reports.
  - Factory demo data reset in Settings.
  - Dark / Light executive mode toggle.
  - 100% Vercel deployable with zero backend or paid API prerequisites.

---

## 📁 Project Architecture

```
NEXORA CRM/
├── public/
│   └── logo.svg                     # High-definition SVG 3D geometric isometric logo
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Card3D.jsx           # Mouse-tracking 3D tilt card with specular highlights
│   │   │   ├── ThreeHeroVisual.jsx  # Interactive 3D WebGL polyhedral spatial core
│   │   │   └── ThreeAmbientBackground.jsx # Subtle 3D particle dust constellation
│   │   ├── common/
│   │   │   ├── Badge.jsx            # Status & priority badges with glow borders
│   │   │   ├── Button.jsx           # Gradient & glassmorphic buttons with scale feedback
│   │   │   ├── CommandPalette.jsx   # ⌘K / Ctrl+K keyboard searchable command modal
│   │   │   ├── ConfirmDialog.jsx    # Destructive action verification modal
│   │   │   ├── EmptyState.jsx       # Polished zero-state empty container
│   │   │   ├── Modal.jsx            # Animated accessible dialog with ESC handling
│   │   │   ├── StatsSparkline.jsx   # Mini SVG gradient sparkline for KPI trends
│   │   │   └── Toast.jsx            # Spring-animated floating toast system
│   │   └── layout/
│   │       ├── AppLayout.jsx        # Root layout with 3D ambient backdrop & drawer
│   │       ├── Header.jsx           # Global search, notification center, profile, theme
│   │       ├── PageHeader.jsx       # Dynamic title, breadcrumbs, and action toolbar
│   │       └── Sidebar.jsx          # Collapsible desktop sidebar with badge counters
│   ├── data/
│   │   └── initialData.js           # Production-grade enterprise demo records
│   ├── hooks/
│   │   └── useTilt3D.js             # Reusable 3D mouse tilt perspective calculation hook
│   ├── pages/
│   │   ├── calendar/
│   │   │   ├── CalendarPage.jsx     # Monthly grid & Agenda schedule view
│   │   │   └── EventModal.jsx       # Event scheduling modal dialog
│   │   ├── contacts/
│   │   │   ├── ContactDetailDrawer.jsx # Slide-out profile drawer with notes & tags
│   │   │   ├── ContactModal.jsx     # Create & edit contact modal
│   │   │   └── ContactsPage.jsx     # Table / Grid view, search, filter, CSV export
│   │   ├── dashboard/
│   │   │   ├── DashboardHero.jsx    # Welcome banner with embedded 3D spatial core
│   │   │   ├── DashboardPage.jsx    # Master overview dashboard assembly
│   │   │   ├── LeadsPipelineChart.jsx # Weekly lead inflow bar chart
│   │   │   ├── RecentActivitiesWidget.jsx # Chronological team audit log
│   │   │   ├── RecentDealsWidget.jsx # High-value deal highlight cards
│   │   │   ├── RevenueAnalyticsChart.jsx # Area chart with 7D/30D/6M/1Y filters
│   │   │   ├── SourceDistributionChart.jsx # Donut chart for origination channels
│   │   │   ├── StatsOverview.jsx    # 4 Dynamic KPI cards with sparklines
│   │   │   └── UpcomingTasksWidget.jsx # Quick-action checkbox tasks list
│   │   ├── deals/
│   │   │   ├── DealCard.jsx         # Draggable opportunity card with progress bar
│   │   │   ├── DealModal.jsx        # Deal creation & editing modal
│   │   │   └── DealsKanbanPage.jsx  # Drag-and-drop Kanban pipeline with confetti
│   │   ├── leads/
│   │   │   ├── LeadConvertModal.jsx # 1-click lead to opportunity conversion modal
│   │   │   ├── LeadModal.jsx        # Inbound lead entry modal
│   │   │   └── LeadsPage.jsx        # Lead scoring (Hot/Warm/Cold), filter, CSV
│   │   ├── reports/
│   │   │   └── ReportsPage.jsx      # Composed analytics, quota vs actual, CSV export
│   │   └── settings/
│   │       └── SettingsPage.jsx     # Profile, workspace, theme, notifications, reset
│   ├── store/
│   │   ├── crmStore.js              # Persistent Zustand store with full CRUD & metrics
│   │   └── toastStore.js            # Transient toast state manager
│   ├── utils/
│   │   ├── exportCsv.js             # Client-side dynamic CSV generator and downloader
│   │   └── formatters.js            # Currency, relative time, and date utilities
│   ├── App.jsx                      # React Router DOM configuration
│   ├── index.css                    # Tailwind CSS directives & glassmorphic utilities
│   └── main.jsx                     # Application bootstrap
├── index.html                       # HTML5 entry with Plus Jakarta Sans typography
├── package.json                     # Optimized dependency manifests
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Nexora design system tokens & animations
├── vercel.json                      # Vercel SPA routing rewrite rules
└── vite.config.js                   # Rollup chunking & Vite config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm** or **pnpm** or **yarn**

### 1. Installation

Clone or open the project folder in your terminal:

```bash
npm install
```

### 2. Development Server

Start the local Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

Compile and optimize all assets into minified production bundles:

```bash
npm run build
```

The optimized artifacts will be generated in the `dist/` directory.

### 4. Preview Production Build

Preview the generated production build locally:

```bash
npm run preview
```

---

## ☁️ Deploying to Vercel

NEXORA CRM is pre-configured for seamless 1-click deployment on **Vercel**:

### Option A: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts, accept default settings (Framework: Vite), and deploy.

### Option B: Via GitHub / Vercel Dashboard

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. The `vercel.json` file included in this project handles client-side SPA route rewrites automatically.

---

## 🛠️ Technology Stack Breakdown

| Technology | Purpose |
| :--- | :--- |
| **React 18** | High-performance component-driven UI architecture |
| **Vite 5** | Lightning-fast build tooling and HMR |
| **Tailwind CSS 3** | Atomic luxury dark styling, glassmorphism, and responsive utilities |
| **Three.js** | 60 FPS WebGL 3D spatial core and ambient particle constellation |
| **Framer Motion** | Physics-based spring animations, modals, drawers, and route transitions |
| **Recharts** | Interactive SVG charts (Area, Bar, Composed, Donut) |
| **Zustand** | Global store with `persist` middleware for persistent LocalStorage |
| **Lucide React** | Clean, modern feather icon library |
| **Canvas Confetti** | Celebratory milestone feedback when closing deals |

---

## 💼 Core Features Breakdown

### 1. Overview Dashboard
- Welcome banner: *"Good morning, Huzaifa"*
- Live 3D Spatial Core centerpiece with mouse-tracking perspective.
- 4 dynamic KPI cards: Total Revenue, Total Contacts, Active Leads, Total Deals with sparklines.
- Interactive Revenue & Pipeline performance area chart with timeframe filters (7D, 30D, 6M, 1Y).
- Weekly lead acquisition bar chart & revenue by source donut chart.
- Real-time audit activity feed, recent deals, and interactive task checklist.

### 2. Contacts Directory
- View in Table or Grid layout.
- Search by name, company, email.
- Filter by status (Customer, Active, Lead, Inactive).
- Sort by name, company, or last touch date.
- Modal for adding and editing contacts with field validation.
- Slide-out contact detail profile drawer with direct email links, notes, and tags.
- 1-Click CSV export.

### 3. Lead Management
- AI lead score badges (Hot 80+, Warm 60-79, Cold <60).
- Categorization by source (Website, Referral, LinkedIn, Organic Search, Cold Outreach, Partner).
- Stages: New, Contacted, Qualified, Proposal, Converted, Lost.
- **1-Click Convert Lead Action**: Converts a qualified lead into an active sales opportunity and an executive contact record simultaneously.
- CSV export for marketing attribution reports.

### 4. Sales Pipeline (Deals Kanban)
- 6-Stage Kanban columns: New, Qualified, Proposal, Negotiation, Won, Lost.
- Intuitive drag-and-drop cards between stages.
- Live calculation of total pipeline value and column-specific values.
- Automatic **confetti celebration** when an opportunity is won!
- Create, edit, and delete deals with probability scoring and forecasted closing dates.
- CSV export.

### 5. Task & Deliverable Management
- Quick completion check toggle with instant state persistence.
- Filter by All, Pending, Completed, or priority (Urgent, High, Medium, Low).
- Due date tracking and team assignee management.

### 6. Executive Calendar
- Interactive Monthly grid view & List/Agenda view.
- Scheduling for executive syncs, client demonstrations, and legal reviews.
- Attendees list, time intervals, and platform links (Google Meet, Zoom).

### 7. Reports & Analytics Center
- Composed revenue attainment chart (Closed ARR vs Quota Targets).
- Pipeline funnel health valuation across all lifecycle stages.
- Metric cards for Win Rate, Quota Coverage, and Average Deal Size.
- Executive CSV report download.

### 8. Settings & Customization
- Executive profile editing (Name, Role, Email, Timezone).
- Workspace infrastructure management (Seats, Cloud region, Tier).
- Theme toggle: Dark Luxury (`#080B14`) vs Light Minimalist.
- Notification trigger preferences.
- **Demo Data Reset Button**: Safely restore initial sample data at any time.

---

© 2026 NEXORA CRM. All rights reserved. Portfolio-Grade Enterprise Software Architecture.

