# Deployment Guide - Render.com

This guide walks you through deploying the Resume AI Backend to Render.com.

## Prerequisites

1. GitHub account with your code pushed
2. Render account (free at render.com)
3. Google Gemini API key
4. A backend API key (any random string)

## Step-by-Step Deployment

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: Resume AI Backend"

# Create a new repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/resume-ai-backend.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account

- Go to [render.com](https://render.com)
- Sign up with GitHub (easiest option)
- Authorize GitHub access

### Step 3: Create Web Service

1. Click **"New +"** in top-left
2. Select **"Web Service"**
3. Connect your GitHub account if prompted
4. Find and select your `resume-ai-backend` repository
5. Click **"Connect"**

### Step 4: Configure Service

Fill in the deployment settings:

| Field | Value |
|-------|-------|
| **Name** | `resume-ai-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

### Step 5: Add Environment Variables

Scroll down to **"Environment"** section:

Click **"Add Environment Variable"** for each:

1. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`

2. **GEMINI_API_KEY**
   - Key: `GEMINI_API_KEY`
   - Value: `[Your Google Gemini API Key]`
   - Get from: https://ai.google.dev/aistudio

3. **BACKEND_API_KEY**
   - Key: `BACKEND_API_KEY`
   - Value: `[Random string like: rb_9f3c2a1d9a7b8c9d0e1f2a3b4c5d6e7f]`
   - Save this for later in Lovable!

4. **ALLOWED_ORIGIN** (optional)
   - Key: `ALLOWED_ORIGIN`
   - Value: `[Your Lovable app URL, e.g., https://your-app.lovable.app]`

### Step 6: Deploy

1. Scroll to bottom
2. Click **"Create Web Service"**
3. Render will:
   - Clone your repo
   - Install dependencies
   - Compile TypeScript
   - Start the server
4. Wait 2-5 minutes for deployment to complete
5. You'll see a green checkmark when done

### Step 7: Get Your Backend URL

After deployment succeeds:
- Look for the **URL** at the top of the service page
- Example: `https://resume-ai-backend-xxxx.onrender.com`
- **Copy this URL** - you'll need it for Lovable!

## Testing Your Deployment

### Test Health Endpoint

```bash
curl https://resume-ai-backend-xxxx.onrender.com/health
```

Should return:
```json
{ "ok": true }
```

### Test Analyze JD Endpoint

```bash
curl -X POST https://resume-ai-backend-xxxx.onrender.com/v1/analyze-jd \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_backend_api_key" \
  -d '{"jd_text": "Senior Java Developer with Spring Boot experience..."}'
```

## Using with Lovable Frontend

Once deployed:

1. Go to your Lovable app settings
2. Add **Backend URL**: `https://resume-ai-backend-xxxx.onrender.com`
3. Add **API Key (Secret)**: `[Your BACKEND_API_KEY]`
4. Lovable will send requests with header: `X-API-Key: [Your BACKEND_API_KEY]`

## Troubleshooting

### Deployment Failed

Check the **Logs** tab in Render:

```
npm ERR! Missing dependency
# → Run `npm install` locally to verify
```

### API Returns 401 Unauthorized

- Check `X-API-Key` header matches `BACKEND_API_KEY` env var
- Verify API key is set in Render environment

### CORS Errors

- Update `ALLOWED_ORIGIN` to match your Lovable URL exactly
- Examples:
  - `https://my-app.lovable.app`
  - `https://my-app-abc123.lovable.app`

### Gemini API Errors

- Verify `GEMINI_API_KEY` is correct
- Check quota at [ai.google.dev/aistudio](https://ai.google.dev/aistudio)
- Free tier has daily limits

## Monitoring

### View Live Logs

In Render dashboard, click **Logs** to see real-time output:

```
✓ Resume AI Backend server running on port 8080
Analyzing JD...
Generating resume...
```

### Check Uptime

Render automatically monitors health via the `/health` endpoint.

## Cost

**Free tier includes:**
- 750 hours/month (enough for always-on service)
- Shared resources
- Auto-sleep after 15 min inactivity (free tier)

To prevent sleep, upgrade to Starter plan ($7/month).

## Updating Your Code

When you push changes to GitHub:

1. Render automatically detects changes
2. Rebuilds and redeploys
3. Zero downtime (usually)

Just commit and push:

```bash
git add .
git commit -m "Fix: improve JD analysis"
git push origin main
```

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get backend URL and API key
3. → Connect to Lovable frontend
4. → Test end-to-end resume generation
5. → Share with users!

## Support

- **Render Docs**: https://render.com/docs
- **Gemini API**: https://ai.google.dev/docs
- Check backend logs in Render for detailed error messages
