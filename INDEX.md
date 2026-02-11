# Resume AI Backend - Complete Index

## 📋 Quick Navigation

- **New to this project?** → Start with [`QUICKSTART.md`](QUICKSTART.md)
- **Need setup help?** → Follow [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
- **Want full API docs?** → Read [`README.md`](README.md)
- **Ready to deploy?** → See [`DEPLOYMENT_RENDER.md`](DEPLOYMENT_RENDER.md)
- **What's included?** → Check [`DELIVERABLES.md`](DELIVERABLES.md)
- **Testing APIs?** → Use [`requests.http`](requests.http)

---

## 📁 Project Structure

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | npm dependencies and scripts |
| `tsconfig.json` | TypeScript compiler config |
| `.env.example` | Environment template (copy to .env) |
| `.env` | Your secrets (git-ignored) |
| `.gitignore` | Git ignore rules |
| `Dockerfile` | Container build (optional) |
| `docker-compose.yml` | Docker Compose setup (optional) |

### Source Code (`src/`)
| File | Purpose |
|------|---------|
| `server.ts` | Server entry point, starts Express |
| `app.ts` | Express app setup (middleware, routes) |
| `routes/health.ts` | GET /health endpoint |
| `routes/analyzeJd.ts` | POST /v1/analyze-jd endpoint |
| `routes/generateResume.ts` | POST /v1/generate-resume endpoint |
| `routes/repairResume.ts` | POST /v1/repair-resume endpoint |
| `middleware/auth.ts` | API key validation middleware |
| `middleware/errorHandler.ts` | Global error handling |
| `lib/geminiClient.ts` | Gemini API client with retry logic |
| `prompts/index.ts` | System prompts for Gemini |
| `schemas/index.ts` | Zod validation schemas |
| `types/index.ts` | TypeScript type definitions |

### Data Files
| File | Purpose |
|------|---------|
| `data/roles.json` | 14 role profiles with ecosystems |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Full API documentation |
| `QUICKSTART.md` | 5-minute setup guide |
| `SETUP_CHECKLIST.md` | Complete setup checklist |
| `DEPLOYMENT_RENDER.md` | Render deployment guide |
| `DELIVERABLES.md` | What's included in project |
| `INDEX.md` | This file |

### Testing
| File | Purpose |
|------|---------|
| `requests.http` | Example API requests (VS Code REST Client) |

---

## 🚀 Getting Started (Quick)

```bash
# 1. Install
npm install

# 2. Setup env
cp .env.example .env
# Edit .env and add GEMINI_API_KEY and BACKEND_API_KEY

# 3. Run
npm run dev

# 4. Test
curl http://localhost:8080/health
```

See [`QUICKSTART.md`](QUICKSTART.md) for details.

---

## 📚 API Endpoints

### 1. Health Check (No Auth)
```
GET /health
Response: { ok: true }
```

### 2. Analyze Job Description
```
POST /v1/analyze-jd
Headers: x-api-key: your_backend_api_key
Body: { jd_text: string }
Response: { jd_analysis: JDAnalysisJSON }
```
Extracts: domain, skills, tooling, role family, stream scores

### 3. Generate Resume
```
POST /v1/generate-resume
Headers: x-api-key: your_backend_api_key
Body: { jd_analysis, role_profile, experiences, ... }
Response: { resume_output: ResumeOutputJSON }
```
Output: 10 summary bullets + 15 bullets per experience

### 4. Repair Resume
```
POST /v1/repair-resume
Headers: x-api-key: your_backend_api_key
Body: { bad_output, validation_errors, ... }
Response: { resume_output: ResumeOutputJSON }
```
Fixes: bullet counts, buckets, out-of-scope tech

See [`README.md`](README.md) for full API documentation.

---

## 🔐 Security Features

- ✅ **Helmet** - Security headers
- ✅ **CORS** - Single origin only
- ✅ **API Key Auth** - x-api-key header validation
- ✅ **Rate Limiting** - 100 req/15 min per IP
- ✅ **Request Size** - 1MB max body
- ✅ **Validation** - Zod schemas on all inputs

---

## 🛠️ Available Scripts

```bash
npm run dev        # Run with hot reload (ts-node-dev)
npm run build      # Compile TypeScript → dist/
npm start          # Run compiled version

# Docker (optional)
docker build -t resume-ai-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=... resume-ai-backend
docker-compose up
```

---

## 📦 What's Included

- **3 AI-powered endpoints** using Google Gemini
- **14 role profiles** with ecosystem configs
- **Type-safe** with TypeScript
- **Validated** with Zod schemas
- **Production-ready** with error handling and rate limiting
- **Documented** with multiple guides
- **Containerized** with Docker
- **Deployable** to Render in 5 minutes

See [`DELIVERABLES.md`](DELIVERABLES.md) for complete list.

---

## 🌐 Deployment

### Local Development
```bash
npm install && npm run dev
```

### Build for Production
```bash
npm run build && npm start
```

### Deploy to Render.com
See [`DEPLOYMENT_RENDER.md`](DEPLOYMENT_RENDER.md)

Steps:
1. Push to GitHub
2. Create Web Service on Render
3. Set environment variables
4. Deploy

---

## 🧪 Testing

### Health Check
```bash
curl http://localhost:8080/health
```

### With REST Client Extension
1. Install [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
2. Open `requests.http`
3. Click "Send Request"

### Manual cURL
```bash
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_backend_api_key" \
  -d '{"jd_text": "Senior Java Developer..."}'
```

---

## 📋 Roles Supported

The backend includes ecosystem configs for:

1. **mainframe** - COBOL, JCL, DB2, CICS
2. **java_fullstack** - Java, Spring Boot, React/Angular
3. **react_frontend** - React, TypeScript, Redux
4. **angular_fullstack** - Angular, Java, Spring Boot
5. **frontend_general** - JavaScript, React, Angular
6. **backend_general** - REST APIs, Microservices, Cloud
7. **data_engineer** - Python, Spark, Airflow, dbt, Snowflake
8. **etl_developer** - ETL tools, DataStage, Informatica
9. **bi_powerbi** - Power BI, DAX, SQL
10. **data_scientist** - Python, ML, Scikit-learn
11. **python_backend** - FastAPI, Flask, Python
12. **dotnet** - C#, .NET, ASP.NET Core
13. **embedded** - C, C++, RTOS, Firmware
14. **mulesoft** - MuleSoft, API-led Connectivity

Each role has:
- Ecosystem baseline (core tech stack)
- Bucket targets (bullet distribution)
- Alternative stacks (flexibility)

---

## 🔧 Environment Variables

Required:
- `GEMINI_API_KEY` - From https://ai.google.dev/aistudio
- `BACKEND_API_KEY` - Your secret API key

Optional:
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (development/production)
- `ALLOWED_ORIGIN` - CORS origin (default: http://localhost:5173)

---

## 📞 Support

### Common Issues

**"GEMINI_API_KEY not set"**
- Check `.env` file exists
- Verify key has a value
- Restart dev server

**"Missing or invalid API key" (401)**
- Check `X-API-Key` header
- Verify value matches `.env`

**CORS blocked**
- Update `ALLOWED_ORIGIN` to your frontend URL
- Restart server

See [`README.md`](README.md#troubleshooting) for more.

---

## 📖 Documentation Map

1. **First time?** → [`QUICKSTART.md`](QUICKSTART.md)
2. **Setup help?** → [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md)
3. **API details?** → [`README.md`](README.md)
4. **Deployment?** → [`DEPLOYMENT_RENDER.md`](DEPLOYMENT_RENDER.md)
5. **What's here?** → [`DELIVERABLES.md`](DELIVERABLES.md)
6. **Testing?** → [`requests.http`](requests.http)

---

## 🎯 Next Steps

- [ ] Run `npm install`
- [ ] Set up `.env` with your keys
- [ ] Run `npm run dev`
- [ ] Test endpoints with `requests.http`
- [ ] Deploy to Render
- [ ] Connect to Lovable frontend

---

## 📄 License

MIT - Use freely in your projects

---

**Version:** 1.0.0  
**Last Updated:** February 2026

---

## 🤔 Questions?

1. Check [`README.md`](README.md) for API docs
2. Review [`SETUP_CHECKLIST.md`](SETUP_CHECKLIST.md) for setup help
3. See [`DEPLOYMENT_RENDER.md`](DEPLOYMENT_RENDER.md) for deployment
4. Look at [`requests.http`](requests.http) for examples

Everything you need is documented. Happy building! 🚀
