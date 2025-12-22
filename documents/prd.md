# Product Requirements Document (PRD): Internal Gemini Extension Registry

## 1. Executive Summary
**Vision:** To establish a secure, centralized internal hub for discovering, submitting, and managing proprietary Gemini CLI extensions. This platform allows teams to share **Personas** (system context) and **Functional Tools** (API connectors) specifically designed for our internal infrastructure.

---

## 2. Goals & Objectives
* **Centralization:** A single portal to replace fragmented sharing of extension scripts.
* **Governance:** An approval workflow to ensure all internal extensions meet security and quality standards.
* **Discovery:** A user-friendly gallery to help developers find relevant AI personas and tools.
* **Performance Tracking:** Integration with Google Cloud Trace to monitor registry and installation latency.

---

## 3. Target Personas
* **Internal Developers:** Who need to build tools that interact with company-specific APIs.
* **Team Leads/Admins:** Who curate and approve high-quality personas for their departments.
* **DevOps/SRE:** Who manage the observability and reliability of the registry platform.

---

## 4. Key Features

### 4.1. "Persona" Gallery
Dedicated section for extensions that define a specific AI behavior.
* **Focus:** Bundling a `GEMINI.md` file with expert system instructions (e.g., "Senior Cloud Architect").
* **One-Line Setup:** Command snippets provided for instant local installation.

### 4.2. "Discreet Tools" (MCP) Registry
Dedicated section for functional extensions.
* **Focus:** Extensions utilizing Model Context Protocol (MCP) to connect to internal services (Jira, GitHub Enterprise, Internal Databases).
* **Discovery:** Searchable tags (e.g., #deployment, #security, #logging).

### 4.3. Submission & Approval Portal
The workflow for adding new extensions to the private collection.
* **Submit Form:** Developer provides Git URL, category (Persona/Tool), and metadata.
* **Automated Linter:** A Cloud Function that validates the `gemini-extension.json` structure upon submission.
* **Admin Dashboard:** A UI for designated reviewers to change status from `pending` to `approved`.

---

## 5. Technical Architecture (Firebase + Google Cloud)

### 5.1. Tech Stack
* **Authentication:** Firebase Auth (Google Provider limited to internal domain).
* **Database:** Cloud Firestore (Stores extension metadata and status).
* **API Logic:** Firebase Cloud Functions (v2) for repo parsing and state management.
* **Observability:** Google Cloud Trace and Cloud Logging via OpenTelemetry.

### 5.2. Firestore Data Model
* **`submissions/` (Collection):**
    * `repoUrl`: string
    * `submittedBy`: uid
    * `status`: "pending" | "approved" | "rejected"
    * `metadata`: Map (parsed from `gemini-extension.json`)
* **`registry/` (Collection):**
    * `name`: string
    * `type`: "persona" | "tool"
    * `gitUrl`: string
    * `version`: string

---

## 6. The "Add for Approval" Workflow

1.  **Submission:** User logs in via Firebase Auth and submits a Git URL.
2.  **Ingestion:** A Cloud Function triggers, clones the repo temporarily, and verifies the manifest.
3.  **Trace Initialization:** A Cloud Trace span starts to monitor the validation performance.
4.  **Review:** Admin is notified via internal channel. They review the code and metadata in the Admin UI.
5.  **Promotion:** Upon approval, the Cloud Function moves the record from `submissions` to the live `registry` collection.

---

## 7. Observability & Monitoring
To maintain the platform, we will use **Google Cloud Trace** to visualize:
* Latency of the repository parsing function.
* Firestore read/write performance during peak discovery hours.
* Success/Failure rates of the "Approval" lifecycle.

---

## 8. Prioritized Roadmap

| Priority | Task | Description |
| :--- | :--- | :--- |
| **P0** | **Firebase Core Setup** | Enable Auth, Firestore, and basic Security Rules. |
| **P1** | **Registry UI** | Build the gallery for Personas and Tools using the Firestore Client SDK. |
| **P1** | **Approval Pipeline** | Cloud Function to handle "Submission -> Approval -> Registry" transition. |
| **P2** | **Observability Integration** | Add OpenTelemetry instrumentation to Cloud Functions for Cloud Trace. |
| **P2** | **CLI Integration Wrapper** | Create a simple internal script to pull URLs from the registry for `gemini extensions install`. |
| **P3** | **Automated Validation** | Expand the Cloud Function to run automated security scans on submitted extension code. |

---

## 9. Success Metrics
* **Onboarding Time:** Time taken for a new user to find and install their first Persona (< 2 minutes).
* **Contribution Rate:** Number of internal extensions submitted monthly.
* **Registry Latency:** Ensure the Gallery UI loads metadata in < 500ms (monitored via Cloud Trace).