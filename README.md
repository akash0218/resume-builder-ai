# Resume AI Backend

A production-ready REST API for resume analysis and generation using Google Gemini AI.

## Overview

This backend provides 3 endpoints for:
1. **JD Analysis** - Extract structured data from job descriptions
2. **Resume Generation** - Create optimized resume bullets aligned to target roles
3. **Resume Repair** - Fix validation failures in generated resumes

## Features

- **Express.js + TypeScript** for type safety and scalability
- **Security**: Helmet, CORS, API key authentication, request size limits
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Validation**: Zod schemas for all request/response types
- **Gemini Integration**: Automatic retry logic with exponential backoff
- **Structured JSON**: All outputs validated against strict schemas
- **Error Handling**: Consistent error format with detailed messages
- **Health Check**: `/health` endpoint for monitoring

## Setup

### Prerequisites

- **Node.js** 18+ (download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Google Gemini API Key** (free tier available at [ai.google.dev](https://ai.google.dev))

### Installation

1. **Clone or download the project**

```bash
cd resume-ai-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=8080
NODE_ENV=development
GEMINI_API_KEY=your_gemini_key_here
BACKEND_API_KEY=your_random_api_key_here
ALLOWED_ORIGIN=http://localhost:5173
```

**How to get GEMINI_API_KEY:**
- Go to [ai.google.dev/aistudio](https://ai.google.dev/aistudio)
- Create a new API key
- Copy it to `.env`

**How to create BACKEND_API_KEY:**
- Generate a random string (e.g., `rb_9f3c2a1d9a7b8c9d0e1f2a3b4c5d6e7f`)
- Store it in both `.env` (backend) and in Lovable secrets (frontend)

### Development

Run the server with hot reload:

```bash
npm run dev
```

Output:
```
✓ Resume AI Backend server running on port 8080
✓ Environment: development
✓ CORS allowed origin: http://localhost:5173
```

Server is now available at `http://localhost:8080`

### Build for Production

Compile TypeScript to JavaScript:

```bash
npm run build
```

This creates `/dist` folder with compiled code.

### Production

Start the compiled server:

```bash
npm start
```

## API Endpoints

### 1. Health Check (No Auth Required)

```
GET /health
```

**Response:**
```json
{ "ok": true }
```

### 2. Analyze Job Description

```
POST /v1/analyze-jd
X-API-Key: your_backend_api_key
Content-Type: application/json

{
  "jd_text": "Senior Java Developer with Spring Boot experience..."
}
```

**Response:**
```json
{
  "jd_analysis": {
    "detected_role_family": "java_fullstack",
    "domain": "technology",
    "domain_keywords": ["microservices", "cloud-native"],
    "stream_scores": { ... },
    "primary_skills": ["Java", "Spring Boot", ...],
    "secondary_skills": [...],
    "tooling": ["Git", "Docker", ...],
    "role_emphasis": { "type": "backend", "ratio": "70/30" },
    "weighted_keywords": [...]
  }
}
```

### 3. Generate Resume

```
POST /v1/generate-resume
X-API-Key: your_backend_api_key
Content-Type: application/json

{
  "jd_analysis": { ... },
  "role_profile": { ... },
  "experiences": [
    {
      "company": "Acme Corp",
      "title": "Senior Developer",
      "start": "2020-01",
      "end": "2023-12",
      "domain": "fintech",
      "notes": "Built microservices in Java with Spring Boot..."
    }
  ],
  "allowed_tech": ["Java", "Spring Boot", ...],
  "ecosystem_baseline": ["Java", "Spring Boot", ...],
  "bucket_targets": { "UI": 4, "Backend": 6, ... },
  "alignment_percents": [95, 85, 75, 60],
  "alt_stacks": [...]
}
```

**Response:**
```json
{
  "resume_output": {
    "headline_title": "Senior Java Full Stack Developer",
    "summary_bullets": [
      "Designed and shipped microservices platform using Spring Boot...",
      ...
    ],
    "experiences_out": [
      {
        "index": 1,
        "company": "Acme Corp",
        "title": "Senior Developer",
        "alignment_percent": 95,
        "bullets": [
          { "bucket": "Backend", "text": "..." },
          ...
        ]
      }
    ],
    "skills_compact": { ... },
    "warnings": []
  }
}
```

### 4. Repair Resume

```
POST /v1/repair-resume
X-API-Key: your_backend_api_key
Content-Type: application/json

{
  "bad_output": { ... },
  "validation_errors": [
    "summary_bullets must have exactly 10 items",
    ...
  ],
  "allowed_tech": [...],
  "ecosystem_baseline": [...],
  "bucket_targets": { ... }
}
```

**Response:** Fixed ResumeOutputJSON with corrections applied.

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` - Missing or invalid API key (401)
- `VALIDATION_ERROR` - Request validation failed (400)
- `INTERNAL_SERVER_ERROR` - Server error (500)

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | No | Server port | `8080` |
| `NODE_ENV` | No | Environment mode | `development`, `production` |
| `GEMINI_API_KEY` | Yes | Google Gemini API key | `AIzaSyD...` |
| `BACKEND_API_KEY` | Yes | Simple auth key for requests | `rb_9f3c...` |
| `ALLOWED_ORIGIN` | No | CORS origin | `http://localhost:5173` |

## Deployment

### Render.com (Recommended for Getting Started)

1. **Push your code to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/resume-ai-backend.git
git push -u origin main
```

2. **Create new Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Choose a name: `resume-ai-backend`

3. **Configure Environment**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `NODE_ENV` = `production`
     - `GEMINI_API_KEY` = (paste your key)
     - `BACKEND_API_KEY` = (your secret key)
     - `ALLOWED_ORIGIN` = `https://your-lovable-url.com`

4. **Deploy**
   - Click "Create Web Service"
   - Render builds and deploys automatically
   - Copy your URL: `https://resume-ai-backend-xxx.onrender.com`

### Railway.app

Similar process: connect GitHub, set environment variables, deploy.

### AWS / ECS (Advanced)

Use Docker for containerization on AWS ECS/Fargate.

## Testing Locally

### Test Health Endpoint

```bash
curl http://localhost:8080/health
```

### Test Analyze JD Endpoint

```bash
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_backend_api_key" \
  -d '{
    "jd_text": "We are looking for a Senior Java Developer with 5+ years experience in Spring Boot microservices..."
  }'
```

### Using VS Code REST Client

Install the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension and create `requests.http`:

```http
### Health Check
GET http://localhost:8080/health

### Analyze JD
POST http://localhost:8080/v1/analyze-jd
X-API-Key: your_backend_api_key
Content-Type: application/json

{
  "jd_text": "Senior Java Developer with Spring Boot and microservices experience..."
}
```

## Folder Structure

```
src/
├── server.ts           # Server startup
├── app.ts              # Express app configuration
├── routes/             # API endpoints
│   ├── health.ts
│   ├── analyzeJd.ts
│   ├── generateResume.ts
│   └── repairResume.ts
├── middleware/         # Express middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── lib/
│   └── geminiClient.ts # Gemini API wrapper
├── prompts/            # System prompts
│   └── index.ts
├── schemas/            # Zod validation schemas
│   └── index.ts
└── types/              # TypeScript types
    └── index.ts
```

## Security Considerations

- **API Key**: Keep `BACKEND_API_KEY` secret (use .env, never commit)
- **CORS**: Restrict to your frontend origin only
- **Rate Limiting**: Prevents abuse (100 requests per 15 minutes)
- **Helmet**: Adds security headers (HSTS, X-Frame-Options, etc.)
- **Request Size**: Limited to 1MB to prevent memory abuse

## Models Used

- **Analyze JD**: `gemini-1.5-flash` (cheap, fast)
- **Generate Resume**: `gemini-1.5-pro` (better writing quality)
- **Repair Resume**: `gemini-1.5-flash` (quick fixes)

To use Flash for all endpoints (cheaper), update `callGemini()` calls in route files.

## Monitoring & Logs

In production, check logs:

```bash
# Render
tail -f logs/web.log

# Local
npm run dev  # see console output
```

Common logs:
```
✓ Resume AI Backend server running on port 8080
Analyzing JD...
Generating resume...
Repairing resume...
```

## Support

For issues or questions:
1. Check `GEMINI_API_KEY` is set and valid
2. Verify `BACKEND_API_KEY` matches between backend and frontend
3. Check CORS origin matches your frontend URL
4. Review error responses for validation details

## License

MIT
