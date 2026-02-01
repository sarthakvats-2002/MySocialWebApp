# 🔐 Google OAuth Setup Guide

## ✅ Complete Setup for "Sign in with Google"

---

## 📋 Prerequisites

- Google account
- Your app deployed (or use localhost for testing)

---

## 🚀 Step 1: Google Cloud Console Setup

### 1. Create a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: **"EchoConnect"**
4. Click **"Create"**

### 2. Enable Google+ API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
3. Click **"Enable"**

### 3. Configure OAuth Consent Screen

1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** → Click **"Create"**
3. Fill in:
   - **App name:** EchoConnect
   - **User support email:** your@email.com
   - **Developer contact:** your@email.com
4. Click **"Save and Continue"**
5. **Scopes:** Click "Save and Continue" (default scopes are fine)
6. **Test users:** Add your email (for testing)
7. Click **"Save and Continue"**

### 4. Create OAuth Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. Choose **"Web application"**
4. Fill in:
   - **Name:** EchoConnect Web Client
   - **Authorized JavaScript origins:**
     ```
     http://localhost:3000
     https://echoconnect-social.netlify.app
     ```
   - **Authorized redirect URIs:**
     ```
     http://localhost:8800/api/auth/google/callback
     https://echoconnect-backend.onrender.com/api/auth/google/callback
     ```
5. Click **"Create"**
6. **COPY** your **Client ID** and **Client Secret** - you'll need these!

---

## 🔧 Step 2: Backend Setup (Already Done!)

The backend code is already implemented. You just need to add environment variables.

### Add to Render Environment Variables:

Go to your Render dashboard → Backend service → Environment:

```
GOOGLE_CLIENT_ID=your_actual_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
GOOGLE_CALLBACK_URL=https://echoconnect-backend.onrender.com/api/auth/google/callback
SESSION_SECRET=your_random_secret_string_here_min_32_chars
```

### Example Session Secret:

```
SESSION_SECRET=ec897f5a8b2c4d6e1f3a7b9c0d2e4f6g8h1i3j5k7l9m
```

(Generate your own random string!)

---

## 💻 Step 3: Install Dependencies

When deploying, Render will automatically run:

```bash
cd api
npm install
```

This installs:
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy
- `express-session` - Session management

---

## 🎨 Step 4: Frontend Setup (Already Done!)

The "Sign in with Google" button is already added to Login/Register pages!

### Button will appear as:

```
╔══════════════════════════════════╗
║  🔵  Sign in with Google         ║
╚══════════════════════════════════╝
```

---

## 🧪 Step 5: Testing

### Local Testing:

1. Start backend: `cd api && npm start`
2. Start frontend: `cd client && npm start`
3. Go to `http://localhost:3000/login`
4. Click **"Sign in with Google"**
5. Choose your Google account
6. You'll be redirected back logged in!

### Production Testing:

1. Deploy backend to Render (with env vars)
2. Deploy frontend to Netlify
3. Visit your Netlify URL
4. Click "Sign in with Google"
5. Works! ✅

---

## ⚙️ What Happens Behind the Scenes?

1. User clicks "Sign in with Google"
2. Redirected to Google's login page
3. User logs in with Google
4. Google sends user data back to your backend
5. Backend creates/finds user in MongoDB
6. Backend generates JWT token
7. User is redirected to frontend with token
8. User is logged in!

---

## 🔑 Important Notes

### Security:

- ✅ Never commit Client ID/Secret to GitHub
- ✅ Use environment variables only
- ✅ Keep SESSION_SECRET truly random and long
- ✅ Use HTTPS in production (http is fine for localhost)

### Callback URL:

Must match EXACTLY what you set in Google Console:
```
http://localhost:8800/api/auth/google/callback    (local)
https://echoconnect-backend.onrender.com/api/auth/google/callback    (production)
```

### Frontend URL:

After successful auth, user is redirected to:
```
http://localhost:3000    (local)
https://echoconnect-social.netlify.app    (production)
```

---

## 🐛 Troubleshooting

### "redirect_uri_mismatch" Error

**Problem:** Callback URL doesn't match Google Console settings

**Solution:** 
1. Check Google Console → Credentials → Your OAuth Client
2. Make sure redirect URI is EXACTLY: `https://echoconnect-backend.onrender.com/api/auth/google/callback`
3. No trailing slashes, no typos!

### "Error: Missing required parameter: redirect_uri"

**Problem:** Environment variables not set

**Solution:** Add all 4 env vars in Render dashboard

### Button doesn't work / No redirect

**Problem:** Frontend not pointing to correct backend

**Solution:** Check `REACT_APP_API_URL` is set in Netlify

---

## ✅ Verification Checklist

Before going live, check:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Client ID & Secret copied
- [ ] Callback URLs added to Google Console
- [ ] Environment variables added to Render
- [ ] Session secret generated (32+ chars)
- [ ] Backend deployed and running
- [ ] Frontend deployed
- [ ] Tested login flow works
- [ ] User data saved to MongoDB
- [ ] JWT token generated correctly

---

## 🎉 You're Done!

Users can now:
- Sign in with Google in one click
- No password needed
- Profile info auto-filled from Google
- Secure JWT authentication
- Seamless experience!

---

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Express Session Documentation](https://github.com/expressjs/session)

---

**Need help?** The backend code handles everything automatically. Just add the environment variables and it works!

