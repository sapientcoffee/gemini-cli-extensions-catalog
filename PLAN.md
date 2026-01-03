# Engineering Plan: Cymbal Coffee Internal Gemini Extension Registry

## 1. Project Overview
We are building a secure, centralized internal hub for discovering, submitting, and managing proprietary Gemini CLI extensions at Cymbal Coffee. This web application will serve as a registry for "Personas" and "Functional Tools".

## 2. Technical Stack
*   **Frontend:** Next.js (React)
    *   **Reasoning:** Modern, robust, SEO-friendly (internal), and aligns with "New Applications" workflow.
*   **Styling:** Tailwind CSS
    *   **Reasoning:** Rapid UI development, easily customizable to match Cymbal Coffee's branding.
*   **Icons:** Material Symbols / Google Fonts
    *   **Reasoning:** Consistent with the provided mockups.
*   **State Management:** React Hooks & Context API
    *   **Reasoning:** Sufficient for this scale; no need for Redux/Zustand yet.
*   **Mock Backend:** In-memory Service
    *   **Reasoning:** To allow full UI prototyping without a live Firebase connection initially. We will simulate Firestore latency and data structure.

## 3. Visual Design System
Based on `branding_style_guide.md` & `mockups`:
*   **Colors:**
    *   Primary: `Rich Espresso (#4B3832)`
    *   Background: `Warm Crema (#F5F5DC)`
    *   Accent: `Cymbal Gold (#FFD700)`
    *   Secondary Text: `Charcoal (#36454F)`
*   **Typography:**
    *   Headings: `Playfair Display` (Serif)
    *   Body: `Lato` (Sans-serif) - *Note: Mockup used 'Work Sans', but Style Guide says 'Lato'. We will follow the Style Guide.*

## 4. Implementation Steps

### Phase 1: Setup & Configuration
1.  Initialize Next.js project.
2.  Install and configure Tailwind CSS.
3.  Configure `tailwind.config.js` with Cymbal Coffee colors and fonts.
4.  Set up project structure (`components`, `pages`, `lib`, `styles`).

### Phase 2: Core Components (UI)
1.  **Layout:** Create `Layout` component with Header (Logo + Nav) and Footer.
2.  **Typography:** create base text styles in global CSS.
3.  **Extension Card:** Create `ExtensionCard` component (Image, Title, Desc, Tags).
4.  **Buttons & Inputs:** Create styled `Button` and `Input` components.

### Phase 3: Feature Implementation
1.  **Mock Data:** Create `lib/mockData.ts` with sample personas and tools as seen in PRD/Mockups.
2.  **Home / Registry Page:**
    *   Implement Hero section (if any) or straight to Gallery.
    *   Implement Search and Filter logic (Personas vs Tools).
    *   Grid display of `ExtensionCard`s.
3.  **Extension Details Page:**
    *   Dynamic routing `/extensions/[id]`.
    *   Show full metadata, install command snippet (`gemini install ...`), and README content.
4.  **Submission Page:**
    *   Form with: Git URL, Name, Type (Persona/Tool), Description.
    *   Validation logic (mock).
    *   Success/Error states.

### Phase 4: Admin & Approval Workflow
1.  **Admin Dashboard:**
    *   Table view of "Pending" submissions.
    *   Actions: Approve / Reject.
    *   Mock "Approval" logic moving item from `submissions` to `registry`.

### Phase 5: Polish & Verify
1.  Review against `branding_style_guide.md`.
2.  Verify all user stories in `prd.md` are met (simulated).
3.  Ensure "Artisanal, Welcoming" tone in copy.

## 5. Next Steps
*   [x] Initialize Project
*   [x] Configure Branding (Tailwind)
*   [x] Build Registry Page (Home)
*   [x] Build Extension Details Page
*   [x] Build Submission Page
*   [x] Build Admin Dashboard
