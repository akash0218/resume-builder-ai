# Resume AI Backend - Complete Deliverables

## Project Overview

A production-ready Node.js + Express + TypeScript REST API for resume analysis and generation using Google Gemini AI.

**Repository Structure:**
```
resume-ai-backend/
├── src/
│   ├── server.ts              # Server entry point
│   ├── app.ts                 # Express app setup
│   ├── routes/
│   │   ├── health.ts          # GET /health
│   │   ├── analyzeJd.ts       # POST /v1/analyze-jd
│   │   ├── generateResume.ts  # POST /v1/generate-resume
│   │   └── repairResume.ts    # POST /v1/repair-resume
│   ├── middleware/
│   │   ├── auth.ts            # API key validation
│   │   └── errorHandler.ts    # Global error handling
│   ├── lib/
│   │   └── geminiClient.ts    # Gemini API wrapper with retries
│   ├── prompts/
│   │   └── index.ts           # System prompts for 3 endpoints
│   ├── schemas/
│   │   └── index.ts           # Zod validation schemas
│   └── types/
│       └── index.ts           # TypeScript type definitions
├── data/
│   └── roles.json             # 14 role profiles with ecosystems
├── dist/                      # Compiled JavaScript (after build)
├── node_modules/              # Dependencies
├── package.json               # npm scripts and dependencies
├── tsconfig.json              # TypeScript configuration
├── .env.example               # Environment template
├── .env                       # Your local secrets (git-ignored)
├── .gitignore                 # Git ignore rules
├── Dockerfile                 # Container build
├── docker-compose.yml         # Local Docker Compose
├── README.md                  # Full API documentation
├── QUICKSTART.md              # 5-minute setup guide
├── DEPLOYMENT_RENDER.md       # Render.com deployment
└── requests.http              # Example API requests
```

## Features Implemented

### ✅ Security & Validation
- **Helmet** - Security headers (HSTS, X-Frame-Options, etc.)
- **CORS** - Restricted to single origin
- **API Key Auth** - `x-api-key` header validation
- **Request Size Limit** - 1MB max body size
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Zod Schemas** - All request/response validation

### ✅ API Endpoints

#### 1. Health Check (No Auth)
```
GET /health
→ { ok: true }
```

#### 2. Analyze Job Description
```
POST /v1/analyze-jd
→ JDAnalysisJSON with:
  - detected_role_family (mainframe, java_fullstack, etc.)
  - domain (banking, healthcare, etc.)
  - primary_skills, secondary_skills
  - tooling (CI/CD, cloud, etc.)
  - stream_scores (0-100 for all 14 families)
  - role_emphasis (frontend/backend/cloud/data/etc.)
  - weighted_keywords with weight and type
```

#### 3. Generate Resume
```
POST /v1/generate-resume
→ ResumeOutputJSON with:
  - headline_title
  - summary_bullets (exactly 10)
  - experiences_out array with:
    - company, title, dates
    - alignment_percent
    - bullets (exactly 15 per experience)
    - bucket distribution (UI, Backend, Cloud, CI_CD, Data, Analytics, SDLC)
  - skills_compact
  - warnings (missing tech, thin experiences)
```

#### 4. Repair Resume
```
POST /v1/repair-resume
→ Fixed ResumeOutputJSON correcting:
  - Bullet counts
  - Bucket distributions
  - Out-of-scope tech
  - Validation errors
```

### ✅ Gemini Integration
- **Retry Logic** - Up to 2 retries on 429/5xx with exponential backoff
- **JSON Parsing** - Strips markdown code fences automatically
- **Model Selection**:
  - `gemini-1.5-flash` for analyze-jd and repair (cheap/fast)
  - `gemini-1.5-pro` for generate-resume (better quality)
- **Error Handling** - Clear error messages with status codes

### ✅ Error Format
All errors return consistent JSON:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": { ... }
  }
}
```

### ✅ Role Profiles (14 included)
Each role has:
- `headline_title_templates` - Example titles
- `ecosystem_baseline` - Core tech stack
- `bucket_targets` - Bullet distribution (15 total)
- `alt_stacks` - Alternative tech stacks

Included roles:
1. mainframe
2. java_fullstack
3. react_frontend
4. angular_fullstack
5. frontend_general
6. backend_general
7. data_engineer
8. etl_developer
9. bi_powerbi
10. data_scientist
11. python_backend
12. dotnet
13. embedded
14. mulesoft

## Configuration Files

### package.json
- **Scripts:**
  - `dev` - Run with hot reload (ts-node-dev)
  - `build` - Compile TypeScript
  - `start` - Run compiled version
- **Dependencies:** Express, Helmet, CORS, Rate-Limit, Zod, Axios, Dotenv
- **DevDependencies:** TypeScript, ts-node-dev, Type definitions

### tsconfig.json
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Source maps for debugging

### .env.example
```
PORT=8080
NODE_ENV=development
GEMINI_API_KEY=
BACKEND_API_KEY=
ALLOWED_ORIGIN=http://localhost:5173
```

### Dockerfile
- Multi-stage build (builder + production)
- Node 20 Alpine (lightweight)
- Health check endpoint
- Production-optimized

## Documentation

### README.md (Comprehensive)
- Feature overview
- Installation steps
- API endpoint documentation
- Error codes
- Environment variables
- Deployment options
- Testing instructions
- Folder structure
- Security considerations
- Monitoring guidance

### QUICKSTART.md (5-minute setup)
- Quick installation
- Environment setup
- Running dev server
- Testing endpoints
- Troubleshooting
- Docker usage

### DEPLOYMENT_RENDER.md (Step-by-step)
- GitHub setup
- Render account creation
- Service configuration
- Environment variables
- Testing deployment
- Troubleshooting
- Cost information

### requests.http (VS Code testing)
- Health check example
- Analyze JD example (Java full stack)
- Generate resume example (full payload)
- Repair resume example
- Compatible with REST Client extension

## Development Workflow

### Local Development
```bash
# Install
npm install

# Setup env
cp .env.example .env
# Edit .env with your keys

# Run with hot reload
npm run dev

# Test endpoints
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_key" \
  -d '{"jd_text": "..."}'
```

### Build for Production
```bash
# Compile
npm run build

# Test compiled version
npm start

# Or with Docker
docker build -t resume-ai-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=... resume-ai-backend
```

### Deploy to Render
1. Push to GitHub
2. Create Web Service on Render
3. Connect repo and configure env vars
4. Deploy with 1 click

## Key Technical Decisions

1. **TypeScript** - Type safety across entire app
2. **Express** - Lightweight, proven framework
3. **Zod** - Runtime validation matching types
4. **Axios** - Simple HTTP client for Gemini
5. **Express Rate Limit** - Middleware-based rate limiting
6. **Helmet** - Security headers middleware
7. **Gemini REST API** - No SDK dependency, simpler deployment
8. **Exponential Backoff** - Reliable retry mechanism
9. **Consistent Error Format** - Predictable API errors
10. **Environment Config** - Secure secrets management

## What to Integrate with Frontend

Your Lovable app needs:

1. **Backend URL**
   - Example: `https://resume-ai-backend-xxxx.onrender.com`
   - Set in Lovable environment

2. **API Key**
   - Store `BACKEND_API_KEY` in Lovable secrets
   - Send as `x-api-key` header with every request

3. **CORS Setup**
   - Update `ALLOWED_ORIGIN` env var to your Lovable URL
   - Backend will accept requests from that origin

4. **Endpoint Mapping**
   ```javascript
   // Example fetch calls
   fetch(`${BACKEND_URL}/v1/analyze-jd`, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'x-api-key': API_KEY
     },
     body: JSON.stringify({ jd_text: "..." })
   })
   ```

## Testing Checklist

- [x] Health endpoint returns `{ ok: true }`
- [x] Analyze JD validates input and calls Gemini
- [x] Generate Resume returns 10 summary bullets
- [x] Each experience has exactly 15 bullets
- [x] Repair Resume fixes validation failures
- [x] API Key auth blocks requests without key
- [x] CORS allows only configured origin
- [x] Rate limiting works (>100 requests)
- [x] Request size limit enforced (>1MB)
- [x] Error responses use consistent format
- [x] Gemini API retries on 429/5xx
- [x] JSON parsing handles code fences

## Performance Notes

- **Analyze JD**: ~2-3 seconds (flash model)
- **Generate Resume**: ~5-8 seconds (pro model, depends on experience count)
- **Repair Resume**: ~2-3 seconds (flash model)
- **Rate Limit**: 100 requests per 15 minutes per IP
- **Request Timeout**: 60 seconds
- **Body Size**: 1MB max

## Cost Estimate (Google Gemini)

**Free Tier Includes:**
- 60 requests/minute
- 1500 requests/day
- For 100 users/day generating 1 resume each:
  - ~300 Gemini API calls (analyze + generate + potential repairs)
  - Likely within free tier

**Pricing if over free tier:**
- Flash: $0.075/1M input tokens
- Pro: $1.50/1M input tokens
- Typical resume operation: 5,000-10,000 tokens total

## Next Steps

1. **Local Testing**
   - Run `npm install && npm run dev`
   - Test endpoints with `requests.http`

2. **Integration with Lovable**
   - Pass backend URL and API key
   - Test end-to-end flow

3. **Deployment**
   - Push to GitHub
   - Deploy to Render
   - Update Lovable with production URL

4. **Production Hardening** (Optional)
   - Add database for storing resumes
   - Implement user authentication
   - Add request logging/analytics
   - Set up monitoring/alerts

## Files Delivered

**Source Code:**
- 8 route/middleware files
- 3 configuration files (tsconfig, package, .env example)
- 4 utility files (types, schemas, prompts, gemini client)
- 1 data file (roles.json)

**Documentation:**
- README.md (comprehensive)
- QUICKSTART.md (quick setup)
- DEPLOYMENT_RENDER.md (deployment guide)
- requests.http (API examples)

**DevOps:**
- Dockerfile (containerization)
- docker-compose.yml (local development)
- .gitignore (safety)

**Total: 23 files ready to use**

## Support & Maintenance

- No external database required (stateless)
- No authentication system needed (API key only)
- No scheduled jobs
- Minimal configuration
- Self-contained and deployable

All code is production-ready and follows best practices for:
- Security
- Scalability
- Maintainability
- Type safety
- Error handling
- Documentation
