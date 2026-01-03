# Gemini Context: Cymbal Coffee Extension Registry

This file documents the project context, architectural decisions, and conventions for the `cymbal-coffee-extension-registry`.

## 1. Project Identity
*   **Name:** Cymbal Coffee Extension Registry
*   **Purpose:** Internal portal for sharing Gemini CLI extensions (Personas & Tools).
*   **Target Audience:** Cymbal Coffee developers and staff.
*   **Branding:** "Artisanal, Welcoming, and Passionate".

## 2. Technical Architecture
*   **Frontend:** Next.js (App Router), Tailwind CSS v4.
*   **Backend:** Firebase (Firestore, Cloud Functions v2).
*   **Auth:** Firebase Authentication (Google Provider).
    *   **Admins:** Managed via Custom Claims (`{ admin: true }`).
    *   **State:** Managed via `AuthContext` and `useAuth` hook.
*   **Admin Logic:** Implemented as Next.js Server Actions (`actions.ts`) using `firebase-admin` to avoid CORS and public access restrictions.

## 3. Data Model

### `Extension` / `Submission` Interface
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
  installCommand: string; // "gemini extensions install <url>"
  readme: string;
  repoUrl: string;        // GitHub URL
  associatedTools?: string[]; // IDs of tools linked to a Persona
  submittedBy: string;    // User UID
  submittedByEmail: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

### Firestore Collections
*   `registry`: Approved extensions (Public Read).
*   `submissions`: Pending/Rejected extensions (Auth Create, Owner Read, Admin Read).

## 4. Key Files
*   `registry-app/`: Root.
    *   `app/actions.ts`: Server Actions for Admin logic.
    *   `app/page.tsx`: Gallery.
    *   `app/profile/page.tsx`: User Dashboard.
    *   `app/admin/page.tsx`: Admin Dashboard.
    *   `app/submit/page.tsx`: Submission Form.
    *   `components/Header.tsx`: Shared navigation.
    *   `lib/firebase-admin.ts`: Server-side SDK init.
*   `functions/src/index.ts`: `onSubmissionCreated` (Validation).
*   `firestore.rules`: Security logic.
*   `documents/ARCHITECTURE.md`: Diagrams.

## 5. Deployment
*   **Frontend:** Firebase App Hosting (Auto-builds from GitHub `main`).
*   **Backend:** `firebase deploy --only functions,firestore`.
*   **Environment:** managed in `apphosting.yaml`.