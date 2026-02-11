# Setup Checklist

Complete this checklist to get your Resume AI Backend running.

## Pre-Requisites ✓

- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org/))
- [ ] npm installed (comes with Node.js)
- [ ] Google Gemini API key ([ai.google.dev](https://ai.google.dev/aistudio))
- [ ] Git installed (for version control and Render deployment)

## Local Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```
- [ ] Command completes without errors
- [ ] `node_modules/` folder created
- [ ] Check: Run `npm --version` to verify npm is working

### Step 2: Configure Environment
```bash
cp .env.example .env
```
- [ ] `.env` file created in project root
- [ ] Open `.env` in editor
- [ ] Fill in `GEMINI_API_KEY` from https://ai.google.dev/aistudio
- [ ] Create random string for `BACKEND_API_KEY` (e.g., `rb_9f3c2a1d9a...`)
- [ ] Keep `.env` secure, never commit to Git

### Step 3: Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] See message: "✓ Resume AI Backend server running on port 8080"
- [ ] Ctrl+C to stop (when ready)

### Step 4: Test Health Endpoint
```bash
curl http://localhost:8080/health
```
- [ ] Returns: `{"ok":true}`
- [ ] No errors

### Step 5: Test Full Request (in new terminal)
```bash
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: [your_backend_api_key]" \
  -d '{"jd_text": "Senior Java Developer with 5+ years Spring Boot experience"}'
```
- [ ] Returns JSON with `jd_analysis` object
- [ ] No 401 Unauthorized error
- [ ] No 400 validation error

## Using REST Client Extension (Optional)

- [ ] Install [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
- [ ] Open `requests.http` file
- [ ] Click "Send Request" links to test endpoints
- [ ] Update `your_backend_api_key` with actual key

## Build for Production

```bash
npm run build
```
- [ ] No errors
- [ ] `dist/` folder created with `.js` files
- [ ] Can run with: `npm start`

## Docker Setup (Optional)

### Test Locally with Docker
```bash
docker build -t resume-ai-backend .
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_key \
  -e BACKEND_API_KEY=your_key \
  resume-ai-backend
```
- [ ] Image builds successfully
- [ ] Container starts
- [ ] Test: `curl http://localhost:8080/health`

### Or with Docker Compose
```bash
docker-compose up
```
- [ ] Services start
- [ ] Can access http://localhost:8080/health

## Deployment to Render

### Step 1: GitHub Setup
```bash
git init
git add .
git commit -m "Initial commit: Resume AI Backend"
git remote add origin https://github.com/YOUR_USERNAME/resume-ai-backend.git
git branch -M main
git push -u origin main
```
- [ ] Repository created on GitHub
- [ ] Code pushed successfully
- [ ] GitHub Actions (if enabled) pass

### Step 2: Create Render Service
- [ ] Go to [render.com](https://render.com)
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Select your `resume-ai-backend` repository
- [ ] Click "Connect"

### Step 3: Configure Service
- [ ] **Name**: `resume-ai-backend`
- [ ] **Environment**: `Node`
- [ ] **Region**: Pick closest to you
- [ ] **Branch**: `main`
- [ ] **Build Command**: `npm install && npm run build`
- [ ] **Start Command**: `npm start`

### Step 4: Add Environment Variables
Add these to Render dashboard:
- [ ] `NODE_ENV` = `production`
- [ ] `GEMINI_API_KEY` = [Your Gemini key]
- [ ] `BACKEND_API_KEY` = [Your secret key]
- [ ] `ALLOWED_ORIGIN` = [Your Lovable app URL, e.g., https://my-app.lovable.app]

### Step 5: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 2-5 minutes for build
- [ ] See green checkmark (deployment successful)
- [ ] Copy backend URL: https://resume-ai-backend-xxx.onrender.com

### Step 6: Test Deployed Service
```bash
curl https://resume-ai-backend-xxx.onrender.com/health
```
- [ ] Returns `{"ok":true}`
- [ ] Test full endpoint with API key

## Integration with Lovable

In your Lovable app:
- [ ] Add **Backend URL**: `https://resume-ai-backend-xxx.onrender.com`
- [ ] Add **API Key (Secret)**: `your_backend_api_key`
- [ ] Update **CORS origin** in backend to match Lovable URL
- [ ] Test: Make request from Lovable, should work

## Testing Endpoints

### Analyze JD
```
POST /v1/analyze-jd
Headers: x-api-key: your_key
Body: {"jd_text": "..."}
Expected: JDAnalysisJSON
```
- [ ] Works locally
- [ ] Works on Render

### Generate Resume
```
POST /v1/generate-resume
Headers: x-api-key: your_key
Body: {full resume generation payload}
Expected: ResumeOutputJSON with 10 summary bullets
```
- [ ] Works locally
- [ ] Works on Render

### Repair Resume
```
POST /v1/repair-resume
Headers: x-api-key: your_key
Body: {bad output + validation errors}
Expected: Fixed ResumeOutputJSON
```
- [ ] Works locally
- [ ] Works on Render

## Documentation Review

- [ ] Read `README.md` for full API docs
- [ ] Read `QUICKSTART.md` for quick reference
- [ ] Read `DEPLOYMENT_RENDER.md` for deployment
- [ ] Read `DELIVERABLES.md` for what's included
- [ ] Review `requests.http` for API examples

## Troubleshooting

### Issue: "GEMINI_API_KEY not set"
- [ ] Check `.env` file exists
- [ ] Verify `GEMINI_API_KEY=` has a value (not empty)
- [ ] Restart dev server after editing `.env`

### Issue: "Missing or invalid API key" (401)
- [ ] Check `X-API-Key` header is included in request
- [ ] Verify header value matches `BACKEND_API_KEY` in `.env`
- [ ] Header should be: `x-api-key` (lowercase)

### Issue: CORS blocked
- [ ] Update `ALLOWED_ORIGIN` in `.env` to match frontend URL
- [ ] If testing from `http://localhost:3000`, set: `ALLOWED_ORIGIN=http://localhost:3000`
- [ ] Restart server

### Issue: Deployment fails on Render
- [ ] Check build logs in Render dashboard
- [ ] Verify all env vars are set
- [ ] Ensure `npm run build` works locally first
- [ ] Check `package.json` build command: `npm install && npm run build`

## Final Verification

- [ ] `npm run dev` starts successfully
- [ ] Health endpoint returns `{ok: true}`
- [ ] All 3 API endpoints accept requests
- [ ] API key validation works (401 without key)
- [ ] Error responses use correct format
- [ ] Can build: `npm run build`
- [ ] Docker image builds (if using Docker)
- [ ] Deployed to Render successfully
- [ ] Frontend can call backend API

## After Deployment

- [ ] Monitor Render logs for errors
- [ ] Test all endpoints regularly
- [ ] Keep `GEMINI_API_KEY` and `BACKEND_API_KEY` secret
- [ ] Update `.env.example` (remove sensitive data)
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Set up monitoring/alerts (optional)

## Quick Commands Reference

```bash
# Development
npm install              # Install dependencies
npm run dev            # Run with hot reload
npm run build          # Compile TypeScript
npm start              # Run compiled version

# Testing
curl http://localhost:8080/health
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_key" \
  -d '{"jd_text": "..."}'

# Docker (optional)
docker build -t resume-ai-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=... resume-ai-backend
docker-compose up

# Git
git init
git add .
git commit -m "message"
git push origin main
```

## Support Resources

- **TypeScript**: https://www.typescriptlang.org/docs/
- **Express.js**: https://expressjs.com/
- **Gemini API**: https://ai.google.dev/docs
- **Render Docs**: https://render.com/docs
- **Zod**: https://zod.dev/
- **Node.js**: https://nodejs.org/docs/

---

✅ **Checklist Complete** - Your Resume AI Backend is ready!

Next: Connect to Lovable frontend and start generating resumes.
