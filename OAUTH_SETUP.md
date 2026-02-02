# OAuth Setup Guide for Ayush

## Overview
This guide helps you set up Google and Facebook OAuth authentication for the Ayush Link-in-Bio platform.

## Google OAuth Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Go to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth 2.0 Client ID"
5. Select "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (local development)
   - `https://your-domain.com/api/auth/google/callback` (production)
7. Copy the Client ID and Client Secret

### Step 2: Add Environment Variables
Add to your `.env.local` or Vercel environment variables:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Facebook OAuth Setup

### Step 1: Create a Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com)
2. Click "My Apps" > "Create App"
3. Choose "Consumer" app type
4. Fill in app details and create the app

### Step 2: Configure OAuth Redirect URIs
1. Go to App Settings > Basic
2. Copy your App ID and App Secret
3. Add Product "Facebook Login"
4. Go to Facebook Login > Settings
5. Add Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/facebook/callback` (local)
   - `https://your-domain.com/api/auth/facebook/callback` (production)

### Step 3: Add Environment Variables
Add to your `.env.local` or Vercel environment variables:

```
NEXT_PUBLIC_FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing OAuth Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Go to http://localhost:3000/login or /signup

4. Click "Continue with Google" or "Continue with Facebook"

5. You'll be redirected to the OAuth provider's login page

6. After authentication, you'll be automatically logged in and redirected to the dashboard

## Production Deployment

### Vercel Deployment

1. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_FACEBOOK_APP_ID`
   - `FACEBOOK_APP_SECRET`
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`

2. Update OAuth redirect URIs with your production domain

3. Deploy to Vercel

## Troubleshooting

### Issue: "Invalid client ID" error
- Check that you copied the correct Client ID
- Verify the environment variable name is exactly `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Clear browser cache and try again

### Issue: "Redirect URI mismatch"
- Ensure the redirect URI in OAuth provider settings exactly matches the URL in code
- Include the protocol (http:// or https://)
- For local development, use `http://localhost:3000`
- For production, use your actual domain

### Issue: User not logging in
- Check browser console for error messages
- Verify that cookies are enabled
- Check that localStorage is available (not in private/incognito mode)

## Demo Mode

In demo mode (when no MongoDB is connected), OAuth will:
- Accept login without validating credentials
- Create a demo user with the OAuth provider info
- Store user in localStorage
- Redirect to dashboard

For production, you'll need to:
1. Set up MongoDB or your database
2. Exchange OAuth authorization codes for access tokens
3. Fetch user information from the OAuth provider
4. Store/update user in your database
5. Create proper sessions with JWT or cookies
