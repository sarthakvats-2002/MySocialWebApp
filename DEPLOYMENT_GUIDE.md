# 🚀 EchoConnect Deployment Guide

## Deploy to Production (Render + Netlify)

---

## 📋 Prerequisites

- [x] GitHub account
- [x] Render account (free tier: https://render.com)
- [x] Netlify account (free tier: https://netlify.com)
- [x] MongoDB Atlas account (free tier: https://mongodb.com/atlas)
- [x] Code pushed to GitHub

---

## Part 1: Setup MongoDB Atlas (5 minutes)

### 1. Create MongoDB Cluster

1. Go to https://cloud.mongodb.com
2. Sign in or create account
3. Click **"Build a Database"**
4. Select **FREE tier** (M0 Sandbox)
5. Choose cloud provider (AWS recommended)
6. Select region closest to your users
7. Click **"Create"**

### 2. Create Database User

1. Go to **Database Access** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `echoconnect_admin`
5. Auto-generate a secure password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### 3. Whitelist IP Addresses

1. Go to **Network Access** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

### 4. Get Connection String

1. Go to **Database** → **Connect**
2. Choose **"Connect your application"**
3. Copy the connection string (looks like):
   ```
   mongodb+srv://echoconnect_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name after `.net/`: `/echoconnect`

**Final connection string:**
```
mongodb+srv://echoconnect_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/echoconnect?retryWrites=true&w=majority
```

---

## Part 2: Deploy Backend to Render (10 minutes)

### 1. Prepare Backend for Deployment

**Update `api/package.json`** (add start script if not present):
```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

### 2. Push Code to GitHub

```bash
# If not already initialized
cd /Users/sarthak.vats/MySocialWebApp
git init
git add .
git commit -m "Upgraded EchoConnect with real-time features"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/MySocialWebApp.git
git branch -M main
git push -u origin main
```

### 3. Create Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select **"MySocialWebApp"** repository

### 4. Configure Service Settings

**Basic Settings:**
- **Name:** `echoconnect-backend`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `api`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Instance Type:**
- Select **"Free"** tier

### 5. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```bash
MONGO_URL=mongodb+srv://echoconnect_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/echoconnect?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long_random_string

PORT=8800

NODE_ENV=production
```

**⚠️ IMPORTANT:** 
- Use a **STRONG** JWT_SECRET (at least 32 random characters)
- Generate one here: https://www.grc.com/passwords.htm

### 6. Create and Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, you'll get a URL like:
   ```
   https://echoconnect-backend.onrender.com
   ```
4. **Save this URL!** You'll need it for frontend

### 7. Test Backend

Visit in browser:
```
https://echoconnect-backend.onrender.com/api/users/search?q=test
```

You should see: `{"message": "Access denied. No token provided."}`

✅ This means the backend is working!

---

## Part 3: Deploy Frontend to Netlify (10 minutes)

### 1. Prepare Frontend for Deployment

**Update `client/package.json`** (verify build script):
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### 2. Create `.env.production` File

Create `client/.env.production` with your Render backend URL:

```env
REACT_APP_API_URL=https://echoconnect-backend.onrender.com/api
REACT_APP_SOCKET_URL=https://echoconnect-backend.onrender.com
REACT_APP_PUBLIC_FOLDER=https://echoconnect-backend.onrender.com/images/
```

**Replace `echoconnect-backend.onrender.com` with YOUR actual Render URL!**

### 3. Update CORS in Backend

**IMPORTANT:** Update `api/index.js` CORS settings:

```javascript
const corsOptions = {
  origin: [
    'https://echoconnect.netlify.app',  // Your Netlify URL
    'https://YOUR_CUSTOM_DOMAIN.netlify.app',  // Add your actual Netlify domain
    'http://localhost:3000'  // For local testing
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 204,
};
```

Commit and push this change:
```bash
git add api/index.js
git commit -m "Update CORS for Netlify"
git push
```

Render will auto-redeploy (or click "Manual Deploy" on Render dashboard).

### 4. Build Frontend Locally (Test)

```bash
cd client
npm run build
```

✅ Should create a `build` folder without errors.

### 5. Deploy to Netlify

**Option A: Drag & Drop (Easiest)**

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag the `client/build` folder to the upload area
4. Wait for deployment
5. Get your URL: `https://random-name-12345.netlify.app`

**Option B: GitHub Integration (Recommended)**

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your **MySocialWebApp** repository
5. Configure build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
6. Click **"Show advanced"** → **"New variable"**
7. Add environment variables:
   ```
   REACT_APP_API_URL=https://YOUR-RENDER-URL.onrender.com/api
   REACT_APP_SOCKET_URL=https://YOUR-RENDER-URL.onrender.com
   REACT_APP_PUBLIC_FOLDER=https://YOUR-RENDER-URL.onrender.com/images/
   ```
8. Click **"Deploy site"**

### 6. Custom Domain (Optional)

1. In Netlify → **"Domain settings"**
2. Click **"Add custom domain"**
3. Follow instructions to point your domain

**Default URL:**
```
https://YOUR-SITE-NAME.netlify.app
```

### 7. Update Backend CORS Again

Once you have your Netlify URL, update backend CORS:

```javascript
const corsOptions = {
  origin: [
    'https://YOUR-SITE-NAME.netlify.app',  // Your actual Netlify URL
    'http://localhost:3000'
  ],
  // ... rest of config
};
```

Push changes:
```bash
git add api/index.js
git commit -m "Update CORS with Netlify URL"
git push
```

---

## Part 4: Final Configuration & Testing

### 1. Update Redirect Rules (Netlify)

Create `client/public/_redirects` file:
```
/* /index.html 200
```

This ensures React Router works properly.

Commit and push:
```bash
git add client/public/_redirects
git commit -m "Add Netlify redirects"
git push
```

Netlify will auto-redeploy.

### 2. Test the Application

1. **Visit your Netlify URL:**
   ```
   https://YOUR-SITE-NAME.netlify.app
   ```

2. **Register a new account:**
   - Click "Sign Up"
   - Enter details
   - Should redirect to home

3. **Test features:**
   - ✅ Create a post
   - ✅ Like a post
   - ✅ Add a comment
   - ✅ Toggle dark mode
   - ✅ Search for users
   - ✅ Send a message (chat)
   - ✅ Add a story

### 3. Check Real-time Features

Open the app in **two different browsers** (or incognito):
- ✅ Send a message - should appear instantly
- ✅ Create a post - should update feed
- ✅ Check online status - should show green badge

---

## 📊 Deployment Checklist

### Backend (Render)
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Environment variables set (MONGO_URL, JWT_SECRET, PORT, NODE_ENV)
- [ ] Backend deployed successfully
- [ ] Backend URL saved
- [ ] CORS updated with Netlify URL

### Frontend (Netlify)
- [ ] `.env.production` created with backend URLs
- [ ] Build tested locally (`npm run build`)
- [ ] `_redirects` file created
- [ ] Site deployed to Netlify
- [ ] Environment variables set in Netlify
- [ ] Frontend URL obtained
- [ ] App tested in browser

---

## 🔧 Common Issues & Solutions

### Issue 1: "Failed to fetch" in browser

**Solution:**
- Check CORS settings in backend `api/index.js`
- Ensure Netlify URL is in the `origin` array
- Redeploy backend after changes

### Issue 2: API requests not working

**Solution:**
- Verify `REACT_APP_API_URL` in Netlify environment variables
- Check it ends with `/api` (no trailing slash)
- Rebuild and redeploy frontend

### Issue 3: Socket.io not connecting

**Solution:**
- Check `REACT_APP_SOCKET_URL` in Netlify
- Ensure it points to your Render URL (no `/api` suffix)
- Verify backend logs in Render dashboard

### Issue 4: Images not loading

**Solution:**
- Check `REACT_APP_PUBLIC_FOLDER` points to Render URL
- Verify images are being uploaded to backend
- Check backend `public/images` folder exists

### Issue 5: "Cannot GET /profile/username"

**Solution:**
- Ensure `_redirects` file exists in `client/public`
- Content should be: `/* /index.html 200`
- Redeploy frontend

### Issue 6: Backend sleeping (Render free tier)

**Solution:**
- Render free tier sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid tier for 24/7 uptime
- Or use cron job to keep alive: https://uptimerobot.com

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)
- **MongoDB Atlas:** FREE (512MB storage)
- **Render:** FREE (750 hours/month, sleeps after 15min)
- **Netlify:** FREE (100GB bandwidth, unlimited sites)

**Total: $0/month** ✅

### Paid Tier (For Production)
- **MongoDB Atlas:** $0-9/month (Shared cluster)
- **Render:** $7/month (Always on, no sleep)
- **Netlify:** $19/month (Pro features)

**Total: ~$16-35/month**

---

## 🔄 Future Deployments

### Update Backend:
```bash
# Make changes to backend code
git add .
git commit -m "Update backend feature"
git push

# Render auto-deploys or click "Manual Deploy"
```

### Update Frontend:
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend feature"
git push

# Netlify auto-deploys
```

---

## 📱 Quick Deploy Commands

**Full deployment from scratch:**
```bash
# 1. Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Deploy backend
# - Visit Render dashboard
# - Click "Manual Deploy" → "Deploy latest commit"

# 3. Deploy frontend
# - Visit Netlify dashboard
# - Click "Trigger deploy" → "Deploy site"

# Done! ✅
```

---

## 🎉 Your URLs

After deployment, save these:

```
Backend API: https://echoconnect-backend.onrender.com/api
Frontend App: https://your-site-name.netlify.app
```

Share your app with the world! 🚀

---

## 📞 Need Help?

- **Render Docs:** https://render.com/docs
- **Netlify Docs:** https://docs.netlify.com
- **MongoDB Atlas:** https://docs.atlas.mongodb.com

---

**Happy Deploying!** 🎊

