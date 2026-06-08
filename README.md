# 🎓 EduSage — AI-Powered Study Assistant

<div align="center">

![EduSage Banner](screenshots/banner.png)

**Turn your study materials into intelligent, conversational knowledge — powered by RAG + OpenAI**

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--3.5--Turbo-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![Python](https://img.shields.io/badge/Python-PyMuPDF-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://pymupdf.readthedocs.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

[**Live Demo**](https://edusage-frontend.vercel.app) · [**Backend API**](https://edusage-backend.onrender.com) · [**Report Bug**](https://github.com/Saishp412/Edusage/issues) · [**Request Feature**](https://github.com/Saishp412/Edusage/issues)

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Business Value & Impact](#-business-value--impact)
- [Live Demo](#-live-demo)
- [Application Screenshots](#-application-screenshots)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [RAG Pipeline Deep Dive](#-rag-pipeline-deep-dive)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Deployment](#-deployment)
- [Performance & Scalability](#-performance--scalability)
- [Roadmap](#-roadmap)

---

## 🧩 Problem Statement

Students today are overwhelmed with dense PDFs, lecture notes, and textbooks that are difficult to search, summarize, or interact with. Traditional study tools offer no intelligence — they require students to manually sift through hundreds of pages to find a single concept.

**EduSage solves this by transforming any uploaded study document into an AI-powered knowledge base** that students can query in plain English, get contextual answers grounded in their own material, and receive visual aids — all within a single unified platform.

> "Instead of searching *through* your notes, ask *questions* to your notes."

---

## 💼 Business Value & Impact

| Metric | Impact |
|---|---|
| 📚 Study Time Reduction | Answers complex questions in < 5 seconds vs. manual search taking 15+ minutes |
| 🎯 Accuracy | GPT-3.5-Turbo constrained strictly to uploaded documents — eliminates hallucination |
| 🖼️ Visual Learning | Automatically extracts and links diagrams from PDFs to their relevant query context |
| 🌐 Zero-Cost Deployment | Fully deployed on Vercel + Render free tier — $0 monthly infrastructure cost |
| 🔐 Security | JWT-based auth with bcrypt password hashing — production-grade security |
| 📈 Scalability | MongoDB Atlas Vector Search enables sub-second semantic search across thousands of chunks |

---

## 🚀 Live Demo

| Service | URL | Status |
|---|---|---|
| 🌐 Frontend (Vercel) | https://edusage-frontend.vercel.app | ![Live](https://img.shields.io/badge/status-live-brightgreen) |
| ⚙️ Backend API (Render) | https://edusage-backend.onrender.com | ![Live](https://img.shields.io/badge/status-live-brightgreen) |

> **Note:** Render free tier has a cold start of ~30 seconds after inactivity. Subsequent requests respond normally.

---

## 📸 Application Screenshots

| Screen | Preview |
|---|---|
| Landing Page | ![Landing Page](screenshots/landing.png) |
| Dashboard | ![Dashboard](screenshots/dashboard.png) |
| Notebook View | ![Notebook](screenshots/notebook.png) |
| AI Chat with Document Context | ![AI Chat](screenshots/ai_chat.png) |
| Diagram Extraction | ![Diagrams](screenshots/diagrams.png) |
| Studio — Content Generation | ![Studio](screenshots/studio.png) |
| Web Search Integration | ![Web Search](screenshots/websearch.png) |
| Activity Feed | ![Activity](screenshots/activity.png) |

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EDUSAGE PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────────────────────┐     ┌──────────────────────────────┐    │
│   │        FRONTEND              │     │         BACKEND              │    │
│   │     (Next.js 16 + TS)        │     │    (Node.js / Express 5)     │    │
│   │  ┌──────────────────────┐   │     │  ┌────────────────────────┐  │    │
│   │  │  Landing / Auth Pages│   │     │  │   REST API Endpoints   │  │    │
│   │  │  Dashboard           │◄──┼─────┼──│   /api/auth            │  │    │
│   │  │  Notebook Manager    │   │     │  │   /api/notebooks       │  │    │
│   │  │  AI Chat Interface   │   │     │  │   /api/documents       │  │    │
│   │  │  Studio (Content Gen)│   │     │  │   /api/query           │  │    │
│   │  │  Web Search UI       │   │     │  │   /api/studio          │  │    │
│   │  │  Activity Feed       │   │     │  │   /api/websearch       │  │    │
│   │  └──────────────────────┘   │     │  └────────────┬───────────┘  │    │
│   └──────────────────────────────┘     │               │              │    │
│        Hosted on: Vercel               │               ▼              │    │
│                                        │  ┌────────────────────────┐  │    │
│                                        │  │   SERVICE LAYER        │  │    │
│                                        │  │                        │  │    │
│                                        │  │  ┌──────────────────┐  │  │    │
│                                        │  │  │ embedding.service│  │  │    │
│                                        │  │  │ (OpenAI Ada-3)   │  │  │    │
│                                        │  │  └────────┬─────────┘  │  │    │
│                                        │  │           │            │  │    │
│                                        │  │  ┌────────▼─────────┐  │  │    │
│                                        │  │  │vectorStore.svc   │  │  │    │
│                                        │  │  │(MongoDB + Cosine)│  │  │    │
│                                        │  │  └────────┬─────────┘  │  │    │
│                                        │  │           │            │  │    │
│                                        │  │  ┌────────▼─────────┐  │  │    │
│                                        │  │  │answerSynth.svc   │  │  │    │
│                                        │  │  │(GPT-3.5-Turbo)   │  │  │    │
│                                        │  │  └──────────────────┘  │  │    │
│                                        │  │                        │  │    │
│                                        │  │  ┌──────────────────┐  │  │    │
│                                        │  │  │pymupdfExtractor  │  │  │    │
│                                        │  │  │(Python + PyMuPDF)│  │  │    │
│                                        │  │  └────────┬─────────┘  │  │    │
│                                        │  │           │            │  │    │
│                                        │  │  ┌────────▼─────────┐  │  │    │
│                                        │  │  │spatialLinking.svc│  │  │    │
│                                        │  │  │(Diagram→Chunk Map)│  │  │    │
│                                        │  │  └──────────────────┘  │  │    │
│                                        │  │                        │  │    │
│                                        │  │  ┌──────────────────┐  │  │    │
│                                        │  │  │googleSearch.svc  │  │  │    │
│                                        │  │  │(Google CSE+DDG)  │  │  │    │
│                                        │  │  └──────────────────┘  │  │    │
│                                        │  │                        │  │    │
│                                        │  │  ┌──────────────────┐  │  │    │
│                                        │  │  │studio.service    │  │  │    │
│                                        │  │  │(Flashcards,Quiz, │  │  │    │
│                                        │  │  │ MindMap, Reports)│  │  │    │
│                                        │  │  └──────────────────┘  │  │    │
│                                        │  └───────────┬────────────┘  │    │
│                                        │              │               │    │
│                                        │  ┌───────────▼────────────┐  │    │
│                                        │  │    DATA LAYER          │  │    │
│                                        │  │  ┌──────────────────┐  │  │    │
│                                        │  │  │ MongoDB Atlas    │  │  │    │
│                                        │  │  │  - Users         │  │  │    │
│                                        │  │  │  - Notebooks     │  │  │    │
│                                        │  │  │  - Documents     │  │  │    │
│                                        │  │  │  - VectorChunks  │  │  │    │
│                                        │  │  │  - Diagrams(b64) │  │  │    │
│                                        │  │  │  - ChatHistory   │  │  │    │
│                                        │  │  │  - Activity Logs │  │  │    │
│                                        │  │  └──────────────────┘  │  │    │
│                                        │  └────────────────────────┘  │    │
│                                        │   Hosted on: Render          │    │
└────────────────────────────────────────┴──────────────────────────────┴────┘
```

### RAG (Retrieval-Augmented Generation) Pipeline

```
  User Question
       │
       ▼
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Embed      │────►│  Vector Search   │────►│   Context Construction  │
│  Question   │     │  (MongoDB Atlas  │     │   - Top-K chunks        │
│  (OpenAI    │     │   Cosine Sim)    │     │   - Chat history        │
│   Ada-3)    │     │                  │     │   - Diagram context     │
└─────────────┘     └──────────────────┘     └────────────┬────────────┘
                                                           │
                                                           ▼
                    ┌──────────────────┐     ┌─────────────────────────┐
                    │  Final Response  │◄────│   GPT-3.5-Turbo         │
                    │  - Answer text   │     │   Strict grounding:     │
                    │  - Source chunks │     │   "Answer ONLY from     │
                    │  - Diagrams      │     │    study material"      │
                    │  - Accuracy score│     └─────────────────────────┘
                    └──────────────────┘
```

### Document Ingestion Pipeline

```
  PDF / DOCX / TXT Upload
          │
          ▼
  ┌───────────────┐    ┌──────────────┐    ┌────────────────┐
  │ Text Extract  │───►│  Chunking    │───►│   Embedding    │
  │ pdf-parse     │    │  textChunker │    │   OpenAI       │
  │ mammoth       │    │  ~500 tokens │    │   text-emb-3   │
  └───────────────┘    └──────────────┘    └───────┬────────┘
          │                                         │
          │ (PDF only)                              ▼
          ▼                              ┌────────────────────┐
  ┌───────────────┐                     │ MongoDB VectorStore │
  │ PyMuPDF       │                     │ (bulkWrite upsert) │
  │ Image Extract │                     └────────────────────┘
  │ + Base64 enc  │
  └───────┬───────┘
          │
          ▼
  ┌───────────────┐    ┌────────────────────────────────────┐
  │ Diagram.model │    │ Spatial Linking (3s async)         │
  │ imageData:b64 │───►│ Link diagram pages → chunk indexes │
  └───────────────┘    └────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** (App Router) | React framework with SSR / SSG support |
| **TypeScript** | Type-safe frontend codebase |
| **Vanilla CSS** | Custom design system — no Tailwind |
| **Axios** | HTTP client with interceptors for API calls |
| **Vercel** | Zero-config frontend deployment with CI/CD |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB Atlas** | Cloud NoSQL database + Vector Search index |
| **Mongoose 8** | ODM for schema definition and validation |
| **OpenAI SDK** | `text-embedding-3-small` embeddings + GPT-3.5-Turbo |
| **PyMuPDF (Python)** | PDF image extraction via `child_process.spawn` |
| **Multer** | Multipart file upload handling |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Docker** | Containerized Render deployment |
| **Render** | Backend hosting with auto-deploy from GitHub |

### AI / ML Services
| Service | Role |
|---|---|
| **OpenAI `text-embedding-3-small`** | 1536-dim embeddings for semantic document search |
| **OpenAI `gpt-3.5-turbo`** | Answer synthesis strictly grounded in document context |
| **MongoDB Atlas Vector Search** | Native k-NN vector index for scalable semantic retrieval |
| **Cosine Similarity (JS fallback)** | Zero-config in-memory similarity search for cold start |

### Search
| Provider | Role |
|---|---|
| **Google Custom Search API** | Primary web search with domain quality scoring |
| **SerpApi** | Secondary Google proxy |
| **DuckDuckGo (Instant API + HTML)** | Free fallback |
| **Brave Search** | Tertiary fallback |

---

## ✨ Key Features

### 1. 📄 Multi-Format Document Ingestion
Upload **PDF**, **DOCX**, **DOC**, and **TXT** files. Text is automatically extracted, chunked into ~500-token segments, embedded via OpenAI, and stored in MongoDB Atlas for semantic retrieval.

### 2. 🤖 RAG-Powered AI Q&A
Ask any question in plain English. EduSage:
- Embeds your question using `text-embedding-3-small`
- Runs cosine similarity search across your document chunks
- Builds a structured context with conversation history
- Sends it to GPT-3.5-Turbo with strict grounding instructions
- Returns a formatted, cited answer from **your documents only**

### 3. 🖼️ Automatic Diagram Extraction + Spatial Linking
When a PDF is uploaded:
- Python's **PyMuPDF** extracts all embedded images > 50×50px
- Each image is **Base64-encoded and stored in MongoDB** (no disk dependency — works on ephemeral hosting)
- A **spatial linking service** maps diagram page numbers to nearby text chunks
- On query, relevant diagrams surface alongside the AI answer

### 4. 🎨 Studio — AI Content Generation
From any notebook, generate:
- **Flashcards** (Q&A pairs)
- **Multiple Choice Quizzes** (10 questions, 4 options)
- **Mind Maps** (hierarchical concept trees)
- **Structured Reports** (academic-style with headings)
- **Audio Scripts** (conversational summaries)
- **Video Scripts** (scene-by-scene educational breakdowns)
- **Infographics** (AI-structured visual layout)

### 5. 🌐 Multi-Provider Web Search
Query the web from within EduSage with intelligent provider fallback:
- Google Custom Search API (primary)
- SerpApi (secondary)
- DuckDuckGo (free fallback)
- Domain authority scoring prioritizes Wikipedia, `.edu`, documentation sites

### 6. 📔 Notebook Organization System
Create multiple notebooks (e.g., "SE Unit 2", "DBMS Finals") — each with its own isolated document collection and vector store namespace (`notebook_{id}`).

### 7. 📊 Accuracy Metrics & Chat History
Every AI answer is evaluated with:
- Retrieval confidence score
- Number of chunks retrieved
- Chunk distance distribution
Full chat history persisted per notebook.

### 8. 🔐 JWT Authentication
Secure registration and login with:
- Bcrypt password hashing (10 salt rounds)
- JWT with 7-day expiry
- Protected API routes via `verifyToken` middleware

---

## 🔬 RAG Pipeline Deep Dive

### Embedding & Storage
```js
// embedding.service.js
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const embedText = async (texts) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",   // 1536 dimensions
    input: texts,
  });
  return response.data.map((item) => item.embedding);
};
```

### Vector Store (MongoDB Cosine Similarity + Atlas Fallback)
```js
// vectorStore.service.js — cosine similarity fallback (always works)
const allDocs = await VectorChunk.find({ collectionName }).lean();
const scored = allDocs
  .map(doc => ({ ...doc, score: cosineSimilarity(queryVector, doc.embedding) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, nResults);

// Atlas $vectorSearch used automatically when index is available
// $vectorSearch → $match(collectionName) → $limit
```

### Answer Synthesis (Strict Grounding)
```
System Prompt: "Answer ONLY using information found in the study material above.
                Never add information beyond what is in the study material."
```
GPT-3.5-Turbo is called with `temperature: 0.1` and `max_tokens: 1200` for focused, factual responses.

---

## 📁 Project Structure

```
Edusage/
├── edusage-backend/                  # Express API server
│   ├── controllers/
│   │   ├── auth.controller.js        # Register/Login + JWT issue
│   │   ├── document.controller.js    # Upload, chunking, embedding pipeline
│   │   ├── query.controller.js       # RAG Q&A + diagram retrieval
│   │   ├── studio.controller.js      # AI content generation
│   │   ├── notebook.controller.js    # CRUD for notebooks
│   │   └── websearch.controller.js   # Multi-provider web search
│   ├── services/
│   │   ├── vectorStore.service.js    # MongoDB vector store adapter
│   │   ├── embedding.service.js      # OpenAI text-embedding-3-small
│   │   ├── answerSynthesizer.service.js  # GPT-3.5-Turbo RAG synthesis
│   │   ├── spatialLinking.service.js # Diagram → chunk spatial mapping
│   │   ├── pymupdfExtractor.service.js   # PDF image extraction via Python
│   │   ├── extract_images.py         # PyMuPDF image extractor (Base64)
│   │   ├── googleSearch.service.js   # Multi-provider web search
│   │   ├── studio.service.js         # Flashcard/quiz/mindmap generator
│   │   ├── textChunker.js            # ~500-token text chunking
│   │   ├── metricsEvaluator.service.js   # RAG accuracy metrics
│   │   └── pageEstimation.service.js # Chunk → page number mapping
│   ├── models/
│   │   ├── User.model.js             # Auth user schema
│   │   ├── Notebook.model.js         # Notebook schema
│   │   ├── Document.model.js         # Uploaded document metadata
│   │   ├── Diagram.model.js          # Diagram + Base64 image data
│   │   ├── Chat.model.js             # Chat message history
│   │   └── Activity.model.js         # User activity logs
│   ├── middlewares/
│   │   └── auth.middleware.js        # JWT verification
│   ├── routes/                       # Express routers (1 per controller)
│   ├── server.js                     # Express app entry point
│   ├── database.js                   # MongoDB Atlas connection
│   ├── Dockerfile                    # Docker image for Render
│   └── requirements.txt              # Python deps: PyMuPDF
│
├── edusage-frontend/                 # Next.js 16 App Router
│   ├── app/
│   │   ├── page.tsx                  # Landing page with animations
│   │   ├── dashboard/                # User dashboard
│   │   ├── notebooks/                # Notebook management
│   │   ├── documents/                # Document browser
│   │   ├── activity/                 # Activity feed
│   │   ├── login/ & register/        # Auth flows
│   │   ├── features/ & pricing/      # Marketing pages
│   │   └── contact/                  # Contact form
│   ├── services/
│   │   └── api.ts                    # Axios API client (env-based base URL)
│   ├── next.config.ts                # Remote image domains + ignoreBuildErrors
│   └── tsconfig.json                 # TypeScript with noImplicitAny: false
│
├── render.yaml                       # Render deployment config
└── .gitignore
```

---

## ⚙️ Installation & Setup

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | ≥ 18.x |
| Python | ≥ 3.9 |
| MongoDB Atlas | Free M0 cluster |
| OpenAI API Key | Any paid tier |

### 1. Clone the Repository
```bash
git clone https://github.com/Saishp412/Edusage.git
cd Edusage
```

### 2. Install Python Dependencies (for diagram extraction)
```bash
cd edusage-backend
pip install PyMuPDF
# OR
pip install -r requirements.txt
```

### 3. Install Backend Dependencies
```bash
cd edusage-backend
npm install
```

### 4. Install Frontend Dependencies
```bash
cd edusage-frontend
npm install
```

### 5. Set Up Environment Variables

Create `edusage-backend/.env`:
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/test?appName=Cluster0
JWT_SECRET=your_jwt_secret_here
OPENAI_API_KEY=sk-...
GOOGLE_CUSTOM_SEARCH_API_KEY=AIza...
GOOGLE_SEARCH_ENGINE_ID=your_cse_id
SERPAPI_KEY=your_serpapi_key       # optional
PORT=5000
```

Create `edusage-frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 6. Run Locally

**Terminal 1 — Backend:**
```bash
cd edusage-backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd edusage-frontend
npm run dev
# App running on http://localhost:3000
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `OPENAI_API_KEY` | ✅ | OpenAI API key for embeddings + GPT |
| `GOOGLE_CUSTOM_SEARCH_API_KEY` | ⚠️ Optional | Enables Google web search |
| `GOOGLE_SEARCH_ENGINE_ID` | ⚠️ Optional | Google CSE ID |
| `SERPAPI_KEY` | ⚠️ Optional | SerpApi fallback |
| `PORT` | ⚠️ Optional | Defaults to 5000 |
| `NEXT_PUBLIC_API_URL` | ✅ (Frontend) | Backend API base URL |
| `NEXT_PUBLIC_BACKEND_URL` | ✅ (Frontend) | Backend root URL for images |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login + get JWT |

### Notebooks
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notebooks` | List all notebooks |
| `POST` | `/api/notebooks` | Create notebook |
| `DELETE` | `/api/notebooks/:id` | Delete notebook |

### Documents
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/documents/:notebookId/upload` | Upload single document |
| `POST` | `/api/documents/:notebookId/upload-batch` | Batch upload |
| `GET` | `/api/documents/:notebookId` | List documents |
| `GET` | `/api/documents/:notebookId/diagrams` | Get extracted diagrams |

### Query (RAG)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/query/:notebookId` | Ask question (RAG pipeline) |
| `GET` | `/api/query/:notebookId/history` | Get chat history |

### Studio
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/studio/:notebookId/generate` | Generate flashcards/quiz/mindmap/report |

### Web Search
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/websearch` | Search the web (multi-provider) |

---

## 🚀 Deployment

### Backend — Render (Docker)

The backend is containerized via `Dockerfile`:

```dockerfile
FROM node:18-slim
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install PyMuPDF
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```

**Render environment variables** (set in dashboard):
- `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `GOOGLE_CUSTOM_SEARCH_API_KEY`, `GOOGLE_SEARCH_ENGINE_ID`

**Auto-deploy:** Push to `main` branch → Render auto-deploys.

### Frontend — Vercel

Connect GitHub repo to Vercel:
- **Root Directory:** `edusage-frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Environment Variables:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BACKEND_URL`

**Auto-deploy:** Push to `main` → Vercel auto-deploys.

### MongoDB Atlas — Vector Search Index

After connecting your cluster, create a Vector Search index on `test.vectorchunks`:

```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```

> **Note:** If the Atlas index is not set up, EduSage automatically falls back to in-memory JS cosine similarity — full functionality is preserved.

---

## 📈 Performance & Scalability

### Diagram Persistence Strategy
Images extracted from PDFs are Base64-encoded and stored directly in MongoDB's `Diagram` collection. This eliminates dependency on ephemeral file systems (Render free tier deletes files on restart) and makes the system **stateless and horizontally scalable**.

### Vector Search Performance
| Approach | Latency | Scales to |
|---|---|---|
| JS Cosine Similarity (fallback) | ~50–200ms | ~10K chunks |
| MongoDB Atlas $vectorSearch | ~5–20ms | Millions of chunks |

### Chunking Strategy
Documents are split into **~500-token fixed-size chunks** with overlap to ensure context continuity at chunk boundaries. Each chunk stores:
- `text` — raw content
- `embedding` — 1536-dim float array
- `metadata` — `{ notebookId, documentId, filename, chunkIndex }`

### Answer Synthesis
GPT-3.5-Turbo is called with:
- `temperature: 0.1` — deterministic, factual output
- `max_tokens: 1200` — detailed but bounded responses
- `30s timeout` — prevents hanging on API delays

---

## 🗺️ Roadmap

- [ ] 🔄 **Atlas Automated Embeddings** — Replace OpenAI embedding with native Atlas embedding (zero external API cost)
- [ ] 📱 **Mobile App** — React Native companion app
- [ ] 🎙️ **Voice Q&A** — Speech-to-text question input via Web Speech API
- [ ] 🤝 **Collaborative Notebooks** — Real-time multi-user collaboration via WebSockets
- [ ] 📊 **Learning Analytics** — Study time tracking, topic coverage heatmaps
- [ ] 🌍 **Multilingual Support** — Non-English document and query support
- [ ] 🔗 **LMS Integration** — Google Classroom / Moodle plugin

---

## 👨‍💻 Author

**Saish Pednekar**

[![GitHub](https://img.shields.io/badge/GitHub-Saishp412-181717?style=for-the-badge&logo=github)](https://github.com/Saishp412)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/saish-pednekar)

---

## 📄 License

This project is licensed under the **ISC License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repo if EduSage helped you study smarter!**

Built with ❤️ using OpenAI, MongoDB Atlas, Next.js, and Node.js

</div>
