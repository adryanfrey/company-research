# Developer Documentation

## Overview

This project is a **Company Research Assistant** — a web application that allows users to research qualifying questions about a specific company using AI-powered web search. The application consists of two main parts:

1. **Frontend (Web)**: A React App built with React Router and Mantine UI
2. **Backend (API)**: A FastAPI server that leverages OpenAI's agents with web search capabilities

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User's Browser                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    React Frontend (Mantine UI)                       │    │
│  │  • Company website input                                             │    │
│  │  • Up to 3 qualifying questions                                      │    │
│  │  • Research results with sources                                     │    │
│  └──────────────────────────────────┬──────────────────────────────────┘    │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │ HTTP POST /api/research
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FastAPI Backend                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Research Service                                │    │
│  │  • Input guardrail (security validation)                            │    │
│  │  • AI Agent with WebSearchTool                                       │    │
│  │  • Output guardrail (response validation)                            │    │
│  └──────────────────────────────────┬──────────────────────────────────┘    │
└─────────────────────────────────────┼───────────────────────────────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │   OpenAI API  │
                              │  (Web Search) │
                              └───────────────┘
```

---

## Tech Stack

### Frontend (`/web`)

| Technology | Purpose |
|------------|---------|
| React 19 | UI library |
| React Router 7 | Routing and server-side rendering |
| Mantine 8 | Component library |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| Tabler Icons | Icon library |

### Backend (`/api`)

| Technology | Purpose |
|------------|---------|
| Python 3.12+ | Runtime |
| FastAPI | Web framework |
| OpenAI Agents SDK | AI agent orchestration |
| Pydantic | Data validation and settings |
| Validators | URL validation |

---

## Project Structure

```
assignment/
├── README.md
├── docs/                        # Documentation files
│   └── DEVELOPER.md
│
├── api/                         # Backend application (FastAPI + Python)
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── apis/                # API route handlers (HTTP endpoints)
│   │   │   └── research.py
│   │   ├── services/            # Business logic and AI agent orchestration
│   │   │   └── research.py
│   │   ├── schemas/             # Pydantic models for request/response validation
│   │   │   ├── research.py
│   │   │   └── api_response_models.py
│   │   ├── prompts/             # AI agent instruction templates
│   │   │   └── research.py
│   │   └── utils/               # Shared helper functions
│   │       └── is_valid_https_url.py
│   └── pyproject.toml
│
└── web/                         # Frontend application (React + TypeScript)
    ├── app/
    │   ├── root.tsx
    │   ├── routes.ts
    │   ├── theme.ts
    │   ├── routes/              # Page components with server-side actions
    │   │   └── index.tsx
    │   ├── components/          # UI components
    │   │   ├── app-layout.tsx
    │   │   ├── header.tsx
    │   │   ├── research-form.tsx
    │   │   └── research-results.tsx
    │   ├── services/            # API client functions (server-side only)
    │   │   └── research-questions.server.ts
    │   └── utils/               # Shared helper functions
    │       ├── fetch-api.server.ts
    │       ├── parse-api-response.server.ts
    │       └── is-valid-https-url.ts
    ├── public/                  # Static assets (images, icons, fonts)
    │   ├── venta_background.jpeg
    │   ├── venta_favicon.ico
    │   └── venta-logo.svg
    └── package.json
```

### Backend (`/api`)

| Folder | Responsibility |
|--------|----------------|
| `apis/` | Defines HTTP endpoints and handles request/response flow. Each file corresponds to a resource or feature area. |
| `services/` | Contains business logic, including AI agent configuration, guardrails, and external API interactions. |
| `schemas/` | Pydantic models for validating incoming requests and structuring outgoing responses. |
| `prompts/` | Stores AI agent instruction templates and prompt configurations used by the research service. |
| `utils/` | Generic helper functions shared across the application (e.g., URL validation). |

### Frontend (`/web`)

| Folder | Responsibility |
|--------|----------------|
| `routes/` | Page-level components that define views and server-side actions. Each file maps to a URL route. |
| `components/` | UI components (forms, layouts, result displays) that are composed within routes. |
| `services/` | Server-side functions that communicate with the backend API. 
| `utils/` | Shared utility functions for validation, parsing, and common operations. |
| `public/` | Static assets served directly to the browser (images, favicon, logos). |

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Python** (3.12+)
- **OpenAI API Key**

### Backend Setup

```bash
cd api

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Upgrade pip and install dependencies
python -m pip install --upgrade pip
python -m pip install -e .

# Configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run the development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and set API_BASE_URL=http://localhost:8000/api

# Run the development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## Environment Variables

### Backend (`/api/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key for AI services | `sk-...` |
| `global_llm_model` | LLM model to use | `gpt-4.1-mini` |

### Frontend (`/web/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |


## Known Limitations

1. **Rate Limiting**: No rate limiting implemented
2. **CORS**: No CORS implemented
3. **Logging**: Very limited logging and observability
4. **Caching**: No caching of research results
5. **Database**: No database to store results
6. **Authentication**: No user authentication
7. **Testing**: No tests implemented (unit tests and E2E)
8. **CI/CD**: No GitHub Actions workflow for automated testing/linting/deployments
10. **Containerization**: No Docker configuration

