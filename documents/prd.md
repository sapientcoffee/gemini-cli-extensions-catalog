# Product Requirements Document (PRD): Cymbal Coffee - Internal Gemini Extension Registry

## 1. Executive Summary
**Vision:** To establish a secure, centralized internal hub for discovering, submitting, and managing proprietary Gemini CLI extensions at Cymbal Coffee. This platform allows teams to share **Personas** (system context) and **Functional Tools** (API connectors) specifically designed for our internal infrastructure.

---

## 2. Goals & Objectives
* **Centralization:** A single portal to replace fragmented sharing of extension scripts.
* **Governance:** An approval workflow to ensure all internal extensions meet security and quality standards.
* **Discovery:** A user-friendly gallery to help developers find relevant AI personas and tools.
* **Performance Tracking:** Integration with Google Cloud Trace to monitor registry and installation latency.

### 2.1. Out of Scope (Non-Goals)
To ensure focus and a timely V1 delivery, the following are explicitly out of scope:
*   Public-facing or open-source extension support.
*   A web-based IDE or editor for creating or modifying extensions.
*   User ratings, comments, or detailed usage analytics on extensions.
*   Real-time collaboration features on submissions or reviews.
*   Automated migration of existing, informally shared extensions.

---

## 3. Target Personas
* **Cymbal Coffee Developers:** Who need to build tools that interact with company-specific APIs.
* **Team Leads/Admins:** Who curate and approve high-quality personas for their departments.
* **DevOps/SRE:** Who manage the observability and reliability of the registry platform.

---

## 4. User Stories
*   **As a Cymbal Coffee developer,** I want to search the registry by tags (e.g., #jira, #security) so that I can quickly find a tool for interacting with a specific internal service.
*   **As a new team member,** I want to find my team's official "Persona" and install it with a single command so I can align with team best practices immediately.
*   **As a team lead,** I want to receive an email or chat notification when a new extension is submitted for approval so that I can review it promptly.
*   **As a DevOps engineer,** I want to view a dashboard in Cloud Trace showing the P95 latency of the extension validation function so that I can monitor and ensure platform performance.

---

## 5. Key Features

### 5.1. "Persona" Gallery
Dedicated section for extensions that define a specific AI behavior.
* **Focus:** Bundling a `GEMINI.md` file with expert system instructions (e.g., "Senior Cloud Architect").
* **One-Line Setup:** Command snippets provided for instant local installation.

### 5.2. "Discreet Tools" (MCP) Registry
Dedicated section for functional extensions.
* **Focus:** Extensions utilizing Model Context Protocol (MCP) to connect to internal services (Jira, GitHub Enterprise, Internal Databases).
* **Discovery:** Searchable tags (e.g., #deployment, #security, #logging).

### 5.3. Submission & Approval Portal
The workflow for adding new extensions to the private collection.
* **Submit Form:** Developer provides Git URL, category (Persona/Tool), and metadata.
* **Automated Linter:** A Cloud Function that validates the `gemini-extension.json` structure upon submission.
* **Admin Dashboard:** A UI for designated reviewers to change status from `pending` to `approved`.

---

## 6. Security & Compliance

*   **Authentication & Authorization:**
    *   All users must authenticate via Firebase Auth using their Cymbal Coffee Google account (`@cymbal.coffee`).
    *   Submission rights are granted to all authenticated users.
    *   Approval/rejection rights are restricted to members of a designated "Gemini-Admins" Google Group, enforced via Firebase Security Rules and backend checks.
*   **Automated Scanning:**
    *   Upon submission, a Cloud Function will perform a static scan on the extension's source code to detect hardcoded secrets (e.g., API keys, passwords).
    *   The function will also check for known vulnerabilities in dependencies listed in common files like `package.json` or `requirements.txt`. A submission with critical vulnerabilities will be automatically flagged for rejection.
*   **Data Storage & Firestore Rules:**
    *   Users may only read from the `registry` collection and the `submissions` collection.
    *   Users can only create new documents in `submissions`.
    *   Users can only edit documents in `submissions` where the `submittedBy` field matches their authenticated `uid`.
    *   Only Admins can write to the `registry` collection or change the `status` field in `submissions`.

---

## 7. Technical Architecture (Firebase + Google Cloud)

### 7.1. Tech Stack
* **Authentication:** Firebase Auth (Google Provider limited to the `cymbal.coffee` domain).
* **Database:** Cloud Firestore (Stores extension metadata and status).
* **API Logic:** Firebase Cloud Functions (v2) for repo parsing and state management.
* **Observability:** Google Cloud Trace and Cloud Logging via OpenTelemetry.

### 7.2. Firestore Data Model
* **`submissions/` (Collection):**
    * `repoUrl`: string
    * `submittedBy`: uid
    * `status`: "pending" | "approved" | "rejected"
    * `metadata`: Map (parsed from `gemini-extension.json`)
    * `rejectionReason`: string (optional)
* **`registry/` (Collection):**
    * `name`: string
    * `type`: "persona" | "tool"
    * `gitUrl`: string
    * `version`: string

---

## 8. The "Add for Approval" Workflow

1.  **Submission:** User logs in via Firebase Auth and submits a Git URL.
2.  **Ingestion:** A Cloud Function triggers, clones the repo temporarily, and verifies the manifest and runs security scans.
3.  **Trace Initialization:** A Cloud Trace span starts to monitor the validation performance.
4.  **Review:** Admin is notified via internal channel. They review the code and metadata in the Admin UI.
5.  **Promotion:** Upon approval, the Cloud Function moves the record from `submissions` to the live `registry` collection.

### 8.1. Error Handling & Rejection Workflow
*   **Invalid Git URL:** If a submitted Git repository is inaccessible or invalid, the submission is rejected with a status reason of "Invalid or Private Repository". The user is notified in the UI.
*   **Validation Failure:** If the `gemini-extension.json` linter fails, the submission is rejected with the specific validation error (e.g., "Missing 'name' field").
*   **Function Timeout:** The repository cloning function will have a timeout of 2 minutes. If exceeded, the submission is rejected with a status reason of "Repository too large or clone timed out".
*   **Rejection:** When an admin rejects a submission, they must provide a reason. The `status` is changed to "rejected", and the `rejectionReason` is stored. The submitter can view this feedback to make corrections and resubmit.

---

## 9. Observability & Monitoring
To maintain the platform, we will use **Google Cloud Trace** to visualize:
* Latency of the repository parsing and scanning function.
* Firestore read/write performance during peak discovery hours.
* Success/Failure rates of the "Approval" lifecycle.

---

## 10. Prioritized Roadmap

| Priority | Task | Description |
| :--- | :--- | :--- |
| **P0** | **Firebase Core Setup** | Enable Auth, Firestore, and detailed Security Rules. |
| **P1** | **Registry UI** | Build the gallery for Personas and Tools using the Firestore Client SDK. |
| **P1** | **Approval Pipeline** | Cloud Function to handle "Submission -> Approval -> Registry" transition. |
| **P2** | **Observability Integration** | Add OpenTelemetry instrumentation to Cloud Functions for Cloud Trace. |
| **P2** | **CLI Integration Wrapper** | Create a simple internal script to pull URLs from the registry for `gemini extensions install`. |
| **P3** | **Automated Validation** | Expand the Cloud Function to run automated security scans on submitted extension code. |

---

## 11. Success Metrics
* **Onboarding Time:** Time taken for a new user to find and install their first Persona (< 2 minutes).
* **Contribution Rate:** Number of internal extensions submitted monthly.
* **Registry Latency:** Ensure the Gallery UI loads metadata in < 500ms (monitored via Cloud Trace).