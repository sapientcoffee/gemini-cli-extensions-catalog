# Gemini Context: Cymbal Coffee Extension Registry

This file documents the project context, architectural decisions, and conventions for the `cymbal-coffee-extension-registry`.

## 1. Project Identity
*   **Name:** Cymbal Coffee Extension Registry
*   **Purpose:** Internal portal for sharing Gemini CLI extensions (Personas & Tools).
*   **Target Audience:** Cymbal Coffee developers and staff.
*   **Branding:** "Artisanal, Welcoming, and Passionate".
    *   Colors: Rich Espresso (`#4B3832`), Warm Crema (`#F5F5DC`), Cymbal Gold (`#FFD700`).
    *   Typography: `Playfair Display` (Serif), `Lato` (Sans-serif).

## 2. Technical Architecture
*   **Frontend:** Next.js (App Router), Tailwind CSS.
*   **Backend:** Firebase (Firestore, Cloud Functions).
*   **Auth:** Firebase Authentication (Google Provider).
    *   **Constraint:** Login restricted to `@cymbal.coffee` (and `@example.com` for dev).
    *   **State:** Managed via `AuthContext` and `useAuth` hook.
    *   **Protection:** `AuthGuard` component wraps protected routes (`/submit`, `/admin`).

## 3. Data Model (Current & Planned)
Currently, the app uses **Mock Data** (`registry-app/lib/mockData.ts`) to simulate the Firestore structure.

### `Extension` Interface
```typescript
interface Extension {
  id: string;
  name: string;
  description: string;
  type: 'persona' | 'tool';
  tags: string[];
  imageUrl: string;
  author: string;
  version: string;
  installCommand: string;
  readme: string; // Markdown content
}
```

### Planned Firestore Collections
*   `registry`: Approved extensions (Public Read).
*   `submissions`: Pending extensions (Auth Create, Owner Read/Update).

## 4. Key Files & Directories
*   `registry-app/`: Root of the Next.js application.
    *   `app/page.tsx`: Home page (Gallery).
    *   `app/extensions/[id]/page.tsx`: Details view.
    *   `app/submit/page.tsx`: Submission form (Protected).
    *   `app/admin/page.tsx`: Admin dashboard (Protected).
    *   `lib/firebase.ts`: Firebase initialization.
    *   `context/AuthContext.tsx`: User session management.
    *   `components/AuthGuard.tsx`: Route protection wrapper.
*   `DEPLOYMENT_AND_BACKEND_PLAN.md`: Comprehensive engineering roadmap.
*   `PLAN.md`: Initial UI implementation plan.

## 5. Deployment Strategy
*   **Platform:** Firebase App Hosting.
*   **CI/CD:** Automatic builds via GitHub integration (Next.js detection).
*   **Environment:** Requires `NEXT_PUBLIC_FIREBASE_*` variables in the App Hosting configuration.

## 6. Future Work (Pending)
*   **Cloud Functions:**
    *   `onSubmissionCreated`: Validate manifest, scan code, set status.
    *   `approveSubmission`: Admin action to move data to `registry`.
*   **Firestore Rules:** Enforce RBAC (Role-Based Access Control).
*   **Live Data Connection:** Replace `mockData.ts` with `firebase/firestore` calls.
