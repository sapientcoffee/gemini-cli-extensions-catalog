# Deployment & Backend Integration Plan: Cymbal Coffee Extension Registry

## 1. Overview
This plan details the steps to deploy the "Registry App" using **Firebase App Hosting**, integrate **Firebase Authentication** (Google Sign-In), and implement the **Firestore** and **Cloud Functions** backend as defined in the PRD.

## 2. Prerequisites
*   A Google Cloud Project with Firebase enabled.
*   `firebase-tools` CLI installed globally (`npm install -g firebase-tools`).
*   A GitHub repository connected to Cloud Build (for App Hosting).

## 3. Architecture Summary
*   **Frontend:** Next.js (App Router) deployed via Firebase App Hosting.
*   **Auth:** Firebase Auth (Google Provider, restricted to `@cymbal.coffee`).
*   **Database:** Cloud Firestore (Collections: `submissions`, `registry`).
*   **Backend Logic:** Firebase Cloud Functions (v2) for security scans and state transitions.

---

## 4. Phase 1: Firebase Project Setup
**Manual Steps (Console):**
1.  Go to [console.firebase.google.com](https://console.firebase.google.com).
2.  Create a new project (e.g., `cymbal-extension-registry`).
3.  **Enable Authentication:**
    *   Sign-in method: **Google**.
    *   (Optional) Add `cymbal.coffee` to authorized domains.
4.  **Enable Firestore:**
    *   Start in **Production Mode**.
    *   Select a region (e.g., `us-central1`).
5.  **Enable App Hosting:**
    *   Go to "App Hosting" in the left menu.
    *   Follow the "Get Started" flow to link your GitHub repository.

---

## 5. Phase 2: Frontend Integration (Firebase SDK)

### 5.1. Install Dependencies
Run in `registry-app/`:
```bash
npm install firebase
```

### 5.2. Initialize Firebase
Create `registry-app/lib/firebase.ts`:
*   Import `initializeApp` and `getAuth`.
*   Use environment variables for config (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.).
*   Export `auth` and `firestore` instances.

### 5.3. Authentication Context
Create `registry-app/context/AuthContext.tsx`:
*   Use `onAuthStateChanged` to track user session.
*   Provide `user`, `loading`, and `signInWithGoogle` functions to the app.
*   **Restriction:** In `signInWithGoogle`, verify `user.email.endsWith('@cymbal.coffee')`. If not, sign out immediately and show an error.

### 5.4. Route Protection
*   Wrap `/submit` and `/admin` content with a check for `user`.
*   For `/admin`, check against a hardcoded list of admin emails or a custom claim (e.g., `admin: true`) set by a Cloud Function.

---

## 6. Phase 3: Backend Implementation (Cloud Functions)

### 6.1. Initialize Functions
Run in root directory:
```bash
firebase init functions
```
*   Select **TypeScript**.
*   Select **ESLint**.

### 6.2. Implement Triggers

#### Function A: `onSubmissionCreated` (Firestore Trigger)
*   **Trigger:** `onCreate` document in `submissions/{docId}`.
*   **Logic:**
    1.  Read `repoUrl`.
    2.  Clone the repository to a temporary directory.
    3.  **Validation:** Check for `gemini-extension.json`.
    4.  **Security Scan:** Scan for simple patterns (AWS keys, etc.).
    5.  **Update:** Set `status` to `pending` (if valid) or `rejected` (if invalid).

#### Function B: `approveSubmission` (Callable)
*   **Trigger:** `onCall` (Callable Function).
*   **Logic:**
    1.  Verify caller is an Admin.
    2.  Move document data from `submissions/{docId}` to `registry/{newDocId}`.
    3.  Update submission status to `approved`.

---

## 7. Phase 4: Firestore Security Rules

Create `firestore.rules`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isCymbalUser() {
      return isSignedIn() && request.auth.token.email.matches('.*@cymbal.coffee');
    }
    
    function isAdmin() {
       // Ideally use custom claims, but for V1, hardcode check or specific doc
       return isCymbalUser() && request.auth.token.email in ['admin@cymbal.coffee']; 
    }

    // Registry: Public Read, Admin Write
    match /registry/{docId} {
      allow read: if isCymbalUser();
      allow write: if isAdmin();
    }

    // Submissions: Authenticated Create, Owner Edit
    match /submissions/{docId} {
      allow create: if isCymbalUser();
      allow read: if isCymbalUser();
      allow update: if isCymbalUser() && (resource.data.submittedBy == request.auth.uid || isAdmin());
    }
  }
}
```

---

## 8. Phase 5: Deployment

### 8.1. Deploy Functions & Rules
```bash
firebase deploy --only functions,firestore:rules
```

### 8.2. Deploy Frontend (App Hosting)
*   Commit changes to `main` branch.
*   Firebase App Hosting will automatically detect the Next.js app, build it, and deploy it.
*   **Env Vars:** Add Firebase Config keys in the Firebase Console under "App Hosting" > "Settings".

---

## 9. Next Steps for Engineer
1.  Execute **Phase 2 (Frontend Integration)**.
2.  Execute **Phase 3 (Functions)** scaffold.
3.  Write `firestore.rules`.
