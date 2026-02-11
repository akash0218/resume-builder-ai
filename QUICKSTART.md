# Quick Start Guide

Get the Resume AI Backend running in 5 minutes.

## 1. Install Dependencies

```bash
npm install
```

## 2. Setup Environment

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=8080
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
BACKEND_API_KEY=your_random_secret_here
ALLOWED_ORIGIN=http://localhost:5173
```

**Get GEMINI_API_KEY:**
- Visit https://ai.google.dev/aistudio
- Click "Create API key"
- Copy it to `.env`

**Create BACKEND_API_KEY:**
- Any random string like: `rb_9f3c2a1d9a7b8c9d0e1f2a3b4c5d6e7f`
- Keep it secret!

## 3. Run Development Server

```bash
npm run dev
```

You should see:
```
✓ Resume AI Backend server running on port 8080
✓ Environment: development
✓ CORS allowed origin: http://localhost:5173
```

## 4. Test Health Endpoint

```bash
curl http://localhost:8080/health
```

Response:
```json
{ "ok": true }
```

## 5. Test with Real Request

```bash
curl -X POST http://localhost:8080/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_backend_api_key" \
  -d '{
    "jd_text": "Senior Java Developer with Spring Boot experience seeking new opportunities..."
  }'
```

Should return structured JD analysis in JSON.

## 6. Use VS Code REST Client (Optional)

Install extension: [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)

Open `requests.http` file and click "Send Request" links above each endpoint.

## Common Issues

### "GEMINI_API_KEY not set"
- Check `.env` file exists
- Verify `GEMINI_API_KEY=` has a value (not empty)

### "Missing or invalid API key"
- Check `X-API-Key` header matches `BACKEND_API_KEY` in `.env`

### CORS Blocked
- Verify `ALLOWED_ORIGIN` in `.env` matches your frontend URL
- If testing from different port, update `.env`

## Build for Production

```bash
npm run build
npm start
```

Compiled code goes to `/dist` folder.

## Deploy to Render

See [DEPLOYMENT_RENDER.md](./DEPLOYMENT_RENDER.md) for step-by-step guide.

## Docker (Optional)

```bash
# Build image
docker build -t resume-ai-backend .

# Run container
docker run -p 8080:8080 \
  -e GEMINI_API_KEY=your_key \
  -e BACKEND_API_KEY=your_secret \
  resume-ai-backend

# Or use docker-compose
docker-compose up
```

## Next Steps

1. ✅ Run backend locally
2. ✅ Test endpoints
3. → Integrate with Lovable frontend
4. → Deploy to Render
5. → Connect frontend to backend

## Need Help?

- Check `.env` configuration
- Review `/dist/server.js` compilation (after `npm run build`)
- Look at console logs for error messages
- See `README.md` for detailed API documentation
