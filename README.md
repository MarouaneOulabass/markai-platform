# MarkAI - Marketing Automation App Market

A SaaS platform that provides a marketplace of AI-powered marketing services for agencies and freelancers.

## Quick Start

### Prerequisites

- **Node.js** >= 20.19
- **PostgreSQL** running locally (or use Docker)
- **AI Provider**: Ollama (local), OpenAI, or Anthropic

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your database URL and AI provider settings
```

### 3. Setup database

```bash
npm run db:push
npm run db:seed    # optional: creates demo user + data
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:3000

**Demo account** (after seeding): `demo@markai.io` / `demo1234`

## Architecture

```
User (Agency)
  - Clients
  - Campaigns
  - Runs (service executions)
      - Input (user config)
      - Output (AI-generated result)
      - Token cost
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 |
| AI | Pluggable (Ollama / OpenAI / Anthropic) |

## Available Services

| Service | Category | Tokens |
|---------|----------|--------|
| Hook Generator | Content | 15 |
| Ad Copy Generator | Ads | 25 |
| Product Page Generator | Content | 20 |
| Content Repurposer | Content | 20 |
| SEO Meta Generator | SEO | 10 |

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed demo data
npm run db:studio    # Prisma Studio (GUI)
npm run db:migrate   # Run migrations
```

## AI Provider Setup

### Ollama (Local, Free)
```bash
ollama pull llama3
# AI_PROVIDER=ollama in .env
```

### OpenAI
```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

### Anthropic
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

## Adding New Services

Create a new file in `src/lib/ai/services/` and register it in `index.ts`.

Each service defines: slug, name, description, category, tokenCost, inputSchema, buildPrompt, and parseOutput.

## Production Deployment

1. Set up PostgreSQL (Supabase, Railway, Neon)
2. Configure environment variables
3. Deploy:

```bash
npm run build && npm run start
```

Compatible with Vercel, Railway, or any Node.js host.
