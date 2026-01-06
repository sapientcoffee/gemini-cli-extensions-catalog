# Observability Implementation Plan (OpenTelemetry + Google Cloud)

## Objective
Implement end-to-end distributed tracing and correlated logging for the Cymbal Coffee Extension Registry. This includes the Next.js frontend (hosted on Firebase App Hosting) and the Firebase Cloud Functions backend.

## Architecture & Instrumentation Strategy

We will use the **OpenTelemetry (OTEL) Node.js SDK** with **Google Cloud Exporters**.

### 1. Registry App (Next.js)
*   **Environment:** Cloud Run (via App Hosting).
*   **Strategy:** Use Next.js 13+ `instrumentation.ts` hook to initialize the Node SDK.
*   **Libraries:**
    *   `@opentelemetry/sdk-node`
    *   `@opentelemetry/auto-instrumentations-node`
    *   `@google-cloud/opentelemetry-cloud-trace-exporter`
    *   `@google-cloud/opentelemetry-cloud-monitoring-exporter` (optional for metrics, focusing on trace first)
*   **Goal:** Capture HTTP requests, Server Actions, and outgoing Firestore calls.

### 2. Cloud Functions (Backend)
*   **Environment:** Cloud Functions v2.
*   **Strategy:** Initialize OTEL SDK at the entry point (`index.ts`) before app initialization.
*   **Libraries:** (Already partially present, need wiring)
    *   `@opentelemetry/sdk-node`
    *   `@google-cloud/opentelemetry-cloud-trace-exporter`
*   **Goal:** Capture function executions and outgoing HTTP/Firestore calls.

---

## Implementation Steps

### Phase 1: Registry App (Next.js)

1.  **Install Dependencies:**
    ```bash
    npm install @opentelemetry/sdk-node \
    @opentelemetry/auto-instrumentations-node \
    @google-cloud/opentelemetry-cloud-trace-exporter \
    @opentelemetry/resources \
    @opentelemetry/semantic-conventions
    ```

2.  **Enable Instrumentation Hook:**
    Update `next.config.ts`:
    ```typescript
    const nextConfig = {
      experimental: {
        instrumentationHook: true,
      },
      // ... existing config
    };
    ```

3.  **Create Instrumentation File:**
    Create `registry-app/instrumentation.ts` (root level, alongside `app/`):
    ```typescript
    export async function register() {
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        await import('./lib/instrumentation.node');
      }
    }
    ```

4.  **Configure Node SDK:**
    Create `registry-app/lib/instrumentation.node.ts`:
    *   Configure `NodeSDK` with `TraceExporter` pointing to Google Cloud.
    *   Enable auto-instrumentations.

### Phase 2: Cloud Functions

1.  **Install/Verify Dependencies:**
    Ensure `functions/package.json` has:
    ```bash
    npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node
    ```
    (It already has exporter and api).

2.  **Initialize SDK in `index.ts`:**
    *   Import and start the SDK *before* firebase-admin initialization.
    *   Use `ConsoleSpanExporter` for local emulation and `TraceExporter` for production.

### Phase 3: Verification

1.  **Deploy:** `firebase deploy`.
2.  **Generate Traffic:** Submit an extension, view it, verify flows.
3.  **Check Console:**
    *   **Cloud Trace:** Look for traces spanning `registry-app` -> `firestore` -> `cloud-functions`.
    *   **Cloud Logging:** Verify logs are correctly correlated with Trace IDs.

## Google Cloud Recommendations Compliance
*   **Exporters:** Using official `@google-cloud/opentelemetry-cloud-trace-exporter`.
*   **Propagation:** Using standard W3C Trace Context (default in OTEL).
*   **Resource Detection:** Cloud Run and Functions environments are automatically detected by `@opentelemetry/auto-instrumentations-node` / GCP detectors.
