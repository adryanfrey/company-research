# Web Frontend (Vite + React + TypeScript)

A minimal guide to run the web frontend. The app is built with Vite, React, TypeScript, and React Router (Data APIs) and
uses Mantine for UI.

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm (bundled with Node). You can also use pnpm or yarn if you prefer, but commands below use npm.

## Getting started

1. Install dependencies
   - From the repo root:
     - cd web
     - npm install
2. Start the dev server
   - npm run dev
   - Open the URL shown by Vite (by default http://localhost:5173)

That’s it. The app will hot-reload on file changes.

## Build and preview (optional)

- Build for production: npm run build
- Preview the production build locally: npm run preview

## Notes

- Routing: The app uses React Router in Data Mode via createBrowserRouter and RouterProvider (see src/router.tsx).
  Client-side routes are handled under "/".
- Entry HTML: index.html mounts the app into #root and loads src/main.tsx.

## Troubleshooting

- Port already in use: Either close the other process or run Vite on another port, e.g. npm run dev -- --port 5174
- Node version errors: Verify node -v is 18+ (preferably 20+). Use nvm to switch versions if needed.
- Clean install: If you run into dependency issues, try removing web/node_modules and web/package-lock.json, then run
  npm install again.
