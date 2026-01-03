# Deployment & Backend Integration Plan: Cymbal Coffee Extension Registry

## 1. Overview
This plan details the completed steps for deploying the "Registry App" using **Firebase App Hosting**, integrating **Firebase Authentication**, and the **Firestore** backend.

## 2. Architecture Summary
*   **Frontend:** Next.js (App Router) deployed via Firebase App Hosting.
*   **Auth:** Firebase Auth (Google Provider).
    *   **Admins:** Managed via Custom Claims (`{ admin: true }`).
*   **Database:** Cloud Firestore (Collections: `submissions`, `registry`).
*   **Backend Logic:**
    *   **Validation:** Firebase Cloud Function (`onSubmissionCreated`).
    *   **Admin Actions:** Next.js Server Actions (`approveSubmission`, `grantAdminRole`).

---

## 3. Implementation Status

### ✅ Phase 1: Firebase Project Setup
*   Project Created: `gemini-cli-extensions-catalog`.
*   Auth, Firestore, App Hosting enabled.

### ✅ Phase 2: Frontend Integration
*   Firebase SDK initialized.
*   `AuthContext` implemented with Custom Claims support.
*   `AuthGuard` protects routes.

### ✅ Phase 3: Backend Implementation
*   **Validation:** `onSubmissionCreated` Cloud Function validates `gemini-extension.json` from GitHub.
*   **Admin Logic:** Refactored to Server Actions (`registry-app/app/actions.ts`) to avoid CORS/Org Policy issues.
    *   `approveSubmission`: Moves data to `registry`.
    *   `grantAdminRole`: Sets Custom User Claims.

### ✅ Phase 4: Firestore Security Rules
*   **Registry:** Public Read.
*   **Submissions:** Authenticated Create, Owner Read, Admin Read/Write.

### ✅ Phase 5: Deployment
*   **Frontend:** Auto-deployed via GitHub -> App Hosting.
*   **Backend:** Functions deployed via CLI.
*   **Infrastructure:** Firestore Rules and Auth Config managed via Terraform (`infrastructure/terraform/`).