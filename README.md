# Cymbal Coffee Extension Registry

**Status:** Live (Prod)

A secure, centralized internal hub for discovering, submitting, and managing proprietary Gemini CLI extensions at Cymbal Coffee. This application allows teams to share **Personas** (system context) and **Functional Tools** (API connectors).

## 📚 Documentation
*   [**System Architecture & Diagrams**](documents/ARCHITECTURE.md)
*   [**Engineering Plan**](PLAN.md)
*   [**Deployment Guide**](DEPLOYMENT_AND_BACKEND_PLAN.md)

## 🚀 Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Authentication:** Firebase Auth (Google Sign-In with Custom Claims for Admins)
*   **Database:** Cloud Firestore
*   **Backend:** Next.js Server Actions & Firebase Cloud Functions (v2)
*   **Deployment:** Firebase App Hosting

## 📂 Project Structure

```
registry-app/
├── app/                  # Next.js App Router pages
│   ├── actions.ts        # Server Actions (Admin logic)
│   ├── extensions/[id]/  # Extension Details Page
│   ├── submit/           # Submission Form
│   ├── admin/            # Admin Dashboard (Protected)
│   ├── profile/          # User Dashboard
│   └── page.tsx          # Registry Gallery (Home)
├── components/           # Reusable UI components (Header, ExtensionCard, AuthGuard)
├── context/              # React Context (AuthContext)
├── lib/                  # Utilities (Firebase init)
└── public/               # Static assets
```

## 🛠️ Setup & Development

1.  **Navigate to the app directory:**
    ```bash
    cd registry-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000).

## 🔑 Configuration

To connect to a live Firebase project locally, create a `.env.local` file in `registry-app/` (see `firebase_get_sdk_config` for values).

For deployment, environment variables are managed in `apphosting.yaml`.

## 🎨 Design System

*   **Primary Color:** Rich Espresso (`#4B3832`)
*   **Background:** Warm Crema (`#F5F5DC`)
*   **Accent:** Cymbal Gold (`#FFD700`)
*   **Fonts:** `Playfair Display` (Headings), `Lato` (Body)

## 📝 Features Implemented

*   ✅ **Registry Gallery:** View and search extensions by name or tag.
*   ✅ **Extension Details:** View READMEs, copy install commands, see associated tools.
*   ✅ **Submission Workflow:** Form with auto-validation of `gemini-extension.json`.
*   ✅ **Admin Dashboard:** Approve/Reject submissions, History view, Manage Admin roles.
*   ✅ **User Profile:** View my submissions, status, and Resubmit rejected items.
*   ✅ **Authentication:** Google Sign-In (Open registration, Admin role via Custom Claims).