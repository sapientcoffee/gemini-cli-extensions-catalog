# System Architecture

## Overview

The Cymbal Coffee Extension Registry is a Next.js application hosted on Firebase App Hosting. It leverages Firebase services for authentication, data storage, and backend logic.

## Architecture Diagram

```mermaid
graph TD
    subgraph "Client (Browser)"
        UI[Next.js Frontend]
        AuthSDK[Firebase Auth SDK]
    end

    subgraph "Firebase Infrastructure"
        AppHosting[Firebase App Hosting\n(Cloud Run)]
        Firestore[(Cloud Firestore)]
        Auth[Firebase Authentication]
        CloudFunc[Cloud Functions v2]
    end

    UI -->|Next.js Server Actions| AppHosting
    UI -->|Reads| Firestore
    UI -->|Sign In| Auth
    
    AppHosting -->|Verify Token & Admin Logic| Auth
    AppHosting -->|Read/Write| Firestore
    
    Firestore -->|Trigger onCreate| CloudFunc
    CloudFunc -->|Validation| Firestore
```

## Data Flow Diagrams

### 1. Submission Workflow

```mermaid
sequenceDiagram
    actor User
    participant UI as Submission Page
    participant DB as Firestore (submissions)
    participant CF as Cloud Function (onSubmissionCreated)
    participant GH as GitHub

    User->>UI: Fills Form (Repo URL)
    UI->>DB: Writes Document (status: pending)
    DB->>CF: Triggers onCreate
    CF->>GH: Fetches gemini-extension.json
    alt Manifest Found
        CF->>DB: Updates Document (status: pending, metadata populated)
    else Manifest Missing
        CF->>DB: Updates Document (status: rejected)
    end
```

### 2. Approval Workflow

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Admin Dashboard
    participant SA as Server Action (approveSubmission)
    participant DB as Firestore

    Admin->>UI: Clicks "Approve"
    UI->>SA: Calls Action (with ID Token)
    SA->>SA: Verifies Admin Claim
    SA->>DB: Reads Submission
    SA->>DB: Copies to 'registry' Collection (status: approved)
    SA->>DB: Updates 'submissions' status to approved
    UI->>UI: Refreshes List
```

### 3. User Role Management

```mermaid
sequenceDiagram
    actor Admin
    participant UI as Admin Dashboard
    participant SA as Server Action (grantAdminRole)
    participant Auth as Firebase Auth

    Admin->>UI: Enters Email & Clicks Grant
    UI->>SA: Calls Action
    SA->>SA: Verifies Requester is Admin
    SA->>Auth: setCustomUserClaims(uid, {admin: true})
    Auth-->>SA: Success
    SA-->>UI: Success Message
```
