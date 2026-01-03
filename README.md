# Cymbal Coffee Extension Registry

**Status:** In Development (Frontend Integration Phase)

A secure, centralized internal hub for discovering, submitting, and managing proprietary Gemini CLI extensions at Cymbal Coffee. This application allows teams to share **Personas** (system context) and **Functional Tools** (API connectors).

## 🚀 Tech Stack

*   **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
*   **Authentication:** Firebase Auth (Google Sign-In restricted to `@cymbal.coffee`)
*   **Backend:** Firebase Cloud Functions & Firestore (Planned)
*   **Deployment:** Firebase App Hosting

## 📂 Project Structure

The main application source code resides in `registry-app/`.

```
registry-app/
├── app/                  # Next.js App Router pages
│   ├── extensions/[id]/  # Extension Details Page
│   ├── submit/           # Submission Form (Protected)
│   ├── admin/            # Admin Dashboard (Protected)
│   └── page.tsx          # Registry Gallery (Home)
├── components/           # Reusable UI components (ExtensionCard, AuthGuard)
├── context/              # React Context (AuthContext)
├── lib/                  # Utilities (Firebase init, Mock Data)
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

The application currently runs with **Mock Data** (`lib/mockData.ts`) for the registry and **Mock Firebase Keys** for the build process.

To connect to a live Firebase project, create a `.env.local` file in `registry-app/` with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎨 Design System

*   **Primary Color:** Rich Espresso (`#4B3832`)
*   **Background:** Warm Crema (`#F5F5DC`)
*   **Accent:** Cymbal Gold (`#FFD700`)
*   **Fonts:** `Playfair Display` (Headings), `Lato` (Body)

## 📝 Features Implemented

*   ✅ **Registry Gallery:** View and search extensions by name or tag.
*   ✅ **Extension Details:** View READMEs and copy install commands.
*   ✅ **Submission Workflow:** Form for developers to submit new tools.
*   ✅ **Admin Dashboard:** Interface for approving/rejecting submissions.
*   ✅ **Authentication:** Google Sign-In integration with domain restriction.

## 🔜 Next Steps

See `DEPLOYMENT_AND_BACKEND_PLAN.md` for the detailed roadmap.
1.  Scaffold Cloud Functions.
2.  Implement Firestore Security Rules.
3.  Connect live data.
