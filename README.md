# TrendNews

TrendNews is an AI-powered news platform that turns live trending topics into readable news stories. It combines trend scraping, article generation, image creation, authentication, caching, and a modern frontend experience so users can explore fresh stories generated from what is currently popular.

The project is designed as a multi-service system where a Spring Boot backend coordinates the workflow, a FastAPI service generates content with AI, and a React frontend presents the results in a clean interface. Together, these parts create an end-to-end pipeline for discovering trends, generating articles, and serving them to users.

## Tech Stack Logos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0F172A?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8) ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-111827?style=for-the-badge&logo=springboot&logoColor=6DB33F) ![Spring Security](https://img.shields.io/badge/Spring_Security-0B1220?style=for-the-badge&logo=springsecurity&logoColor=6DB33F) ![Python](https://img.shields.io/badge/Python-1E293B?style=for-the-badge&logo=python&logoColor=FFD43B) ![FastAPI](https://img.shields.io/badge/FastAPI-0B1120?style=for-the-badge&logo=fastapi&logoColor=00C7B7) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-172554?style=for-the-badge&logo=postgresql&logoColor=white) ![Redis](https://img.shields.io/badge/Valkey%20%2F%20Redis-1F2937?style=for-the-badge&logo=redis&logoColor=DC382D) ![Docker](https://img.shields.io/badge/Docker-0F172A?style=for-the-badge&logo=docker&logoColor=2496ED) ![Cloudinary](https://img.shields.io/badge/Cloudinary-0B1220?style=for-the-badge&logo=cloudinary&logoColor=3448C5) ![Hugging Face](https://img.shields.io/badge/Hugging_Face-1F2937?style=for-the-badge&logo=huggingface&logoColor=FFD21E) ![OpenAI SDK](https://img.shields.io/badge/OpenAI_SDK-111827?style=for-the-badge&logo=openai&logoColor=white)

TrendNews is a full-stack news generation project built from three parts:

- `TrendzzNews/demo`: Spring Boot API for auth, trend scraping, article storage, and orchestration
- `Trendzzpy`: FastAPI service that turns trends into AI-generated articles and images
- `TrendNewsFront/frontend`: React + Vite frontend for browsing and generating trending news

The current flow is:

1. The Spring Boot app scrapes trending topics.
2. It sends those trends to the Python service.
3. The Python service fetches news context, generates article content with an LLM, creates an image, and returns structured article data.
4. Spring Boot saves the generated articles in PostgreSQL and serves them to the frontend.

## Project Structure

```text
TrendNews/
├── TrendNewsFront/frontend   # React frontend
├── TrendzzNews/demo          # Spring Boot backend
└── Trendzzpy                 # FastAPI AI/content service
```

## Tech Stack

- Frontend: React 19, Vite, React Router, React Query, Tailwind CSS, Axios
- Java backend: Spring Boot, Spring Security, Spring Data JPA, WebClient, PostgreSQL, Valkey/Redis
- Python backend: FastAPI, httpx, feedparser, OpenAI SDK with Groq-compatible base URL, Cloudinary

## Features

- Scrapes trending topics
- Generates AI-written news articles from trends
- Creates AI-generated article images and uploads them to Cloudinary
- Stores generated articles in PostgreSQL
- Uses Valkey/Redis-style caching for trends and generated content
- Cookie-based JWT authentication for protected backend routes
- Frontend dashboard for generating and reading articles by trend

## Architecture

```text
React frontend (Vite)
   |
   | HTTP
   v
Spring Boot API (port 8080)
   |
   | WebClient
   v
FastAPI AI service (port 8000)
   |
   | External APIs
   v
Google News RSS + Groq-compatible LLM + Hugging Face image model + Cloudinary
```

## Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.9+ or the included Maven wrapper
- Python 3.11+
- PostgreSQL
- Docker or a local Valkey/Redis-compatible server

## Environment Variables

### 1. Python service: `Trendzzpy/.env`

Create `Trendzzpy/.env` with values for:

```env
GEMINI_API_KEY=unused_or_placeholder
MAX_TRENDS_TO_PROCESS=10
MODEL=llama-3.1-8b-instant
HF_TOKEN=your_huggingface_token
HF_API_URL=your_huggingface_inference_url
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

Notes:

- `GEMINI_API_KEY` is currently required by settings, even though the active article writer uses Groq/OpenAI-compatible calls.
- The Python service reads this file automatically through Pydantic settings.

### 2. Spring Boot service: `TrendzzNews/demo/.env` or system environment

The Java app expects these values:

```env
APP_NAME=trendnews
SERVER_PORT=8080

DB_URL=jdbc:postgresql://localhost:5432/trendnews
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DRIVER=org.postgresql.Driver

JPA_DDL_AUTO=update
JPA_SHOW_SQL=true
JPA_DIALECT=org.hibernate.dialect.PostgreSQLDialect

HIKARI_CONNECTION_TIMEOUT=20000
HIKARI_MAX_POOL_SIZE=10
HIKARI_MIN_IDLE=2
HIKARI_IDLE_TIMEOUT=300000
HIKARI_KEEPALIVE_TIME=0

PYTHON_API_BASE_URL=http://localhost:8000

SPRING_DATA_REDIS_HOST=localhost
SPRING_DATA_REDIS_PORT=6379
SPRING_DATA_REDIS_PASSWORD=himdev
```

## Local Development Setup

### 1. Start Valkey

From `TrendzzNews/demo`:

```bash
docker compose up -d
```

This starts Valkey on `localhost:6379` with password `himdev`.

### 2. Start PostgreSQL

Create a local database named `trendnews` and update the Java environment variables if your credentials differ.

### 3. Start the Python service

```bash
cd Trendzzpy
python -m venv .venv
source .venv/bin/activate
pip install -r requirement.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```bash
curl http://localhost:8000/api/health
```

### 4. Start the Spring Boot service

```bash
cd TrendzzNews/demo
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080`.

### 5. Start the frontend

Create `TrendNewsFront/frontend/.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_PYTHON_API_URL=http://localhost:8000
```

Then run:

```bash
cd TrendNewsFront/frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## Main API Endpoints

### Spring Boot backend

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Trends and articles:

- `GET /api/trends`
- `POST /api/trends/generate-and-save`
- `GET /api/trends/articles`
- `GET /api/trends/articles/{tag}`
- `POST /api/trends/refresh-cache`

Important:

- All routes except signup and login are protected by Spring Security.
- Authentication uses an HTTP-only JWT cookie.

### Python FastAPI service

- `POST /api/process-trends`
- `GET /api/health`

Example request:

```bash
curl -X POST http://localhost:8000/api/process-trends \
  -H "Content-Type: application/json" \
  -d '{"trends":["IPL 2026","Meta","Liverpool"]}'
```

## Frontend Notes

- The frontend is configured to call the Spring API at `VITE_API_BASE_URL`.
- It also contains a client for `POST /api/search` on the Python service, but that endpoint is not currently implemented in `Trendzzpy/app/api/routes.py`.
- Local CORS in the Java backend currently allows `http://localhost:5173`.

## How the Content Pipeline Works

1. `Trendservice` scrapes trending terms.
2. `ArticleService` requests generated articles from the Python service.
3. `fetch_news_context()` pulls context from Google News RSS.
4. `write_article()` generates structured news content with the configured LLM.
5. `generate_ai_image()` creates an image through the configured Hugging Face endpoint and uploads it to Cloudinary.
6. Spring Boot saves unique articles to PostgreSQL and exposes them to the frontend.

## Useful Commands

Frontend:

```bash
cd TrendNewsFront/frontend
npm run dev
npm run build
npm run lint
```

Python:

```bash
cd Trendzzpy
uvicorn app.main:app --reload
```

Java:

```bash
cd TrendzzNews/demo
./mvnw spring-boot:run
./mvnw test
```

## Current Gaps / Things To Know

- There is no root-level automated startup script yet; each service is started separately.
- The Python settings still require `GEMINI_API_KEY`, although article generation currently uses Groq-compatible OpenAI calls.
- The frontend references `/api/search`, but the FastAPI app currently does not expose that route.
- CORS and cookie security are set up for local development and should be reviewed before production deployment.

## License

No license file is included in this repository yet.
