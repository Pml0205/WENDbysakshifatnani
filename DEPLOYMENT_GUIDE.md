# Deployment Configuration Guide

## Overview
This project has two separate deployments:
- **Frontend (Vite React)**: https://www.wendbysakshifatnani.in
- **Backend/Admin Panel (Next.js)**: https://api.wendbysakshifatnani.in

## Environment Variables Configuration

### Frontend (Vite) - Netlify/Vercel:

Set these environment variables in your deployment platform:

```
VITE_API_BASE_URL=https://api.wendbysakshifatnani.in
VITE_ADMIN_PANEL_URL=https://api.wendbysakshifatnani.in
```

#### Build Command:
```
npm install && npm run build
```

#### Publish Directory:
```
dist
```

### Backend/Admin Panel (Next.js) - Render:

Set these environment variables in Render dashboard under Environment:

#### CRITICAL - API Configuration:
```
NEXT_PUBLIC_API_URL=https://api.wendbysakshifatnani.in
```
**IMPORTANT**: This must be set to your actual backend/admin panel URL. Ensure no trailing slash.

#### Authentication:
```
AUTH_SECRET=<generate with: openssl rand -base64 32>
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-secure-password
```

#### Database (if applicable):
```
MONGODB_URI=your-mongodb-connection-string
```

#### Email/SMTP:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
```

#### CORS:
```
CORS_ORIGIN=https://www.wendbysakshifatnani.in,https://wendbysakshifatnani.in
```

#### Environment Mode:
```
NODE_ENV=production
```

#### Build Command (on Render):
```
npm install
```

#### Start Command (on Render):
```
npm run start
```

## Troubleshooting

### Issue: "Redirect to onrender.com instead of correct domain"
**Solution**: Ensure `NEXT_PUBLIC_API_URL` environment variable is set correctly on Render.

### Issue: "Failed to load projects/portfolios/contacts"
**Solution**: 
1. Verify `NEXT_PUBLIC_API_URL` is set to https://api.wendbysakshifatnani.in
2. Check CORS_ORIGIN on backend includes frontend domain
3. Check browser console for exact error messages

### Issue: "Admin login page not loading"
**Solution**: 
1. Check that backend environment variables are all set
2. Verify AUTH_SECRET is configured
3. Check that ADMIN_EMAIL and ADMIN_PASSWORD match your credentials

## API URL Resolution

The application uses the following logic to determine API URLs:

1. **Production**: Uses `NEXT_PUBLIC_API_URL` or `VITE_API_BASE_URL` environment variable
2. **Local Development**: Falls back to `localhost:3000` or `localhost:5173`
3. **Fallback**: Uses hardcoded production URL

## Important Notes

- ⚠️ The `VITE_API_BASE_URL` in `.env.example` has been changed from `onrender.com` to `api.wendbysakshifatnani.in`
- ⚠️ All hardcoded URLs have been replaced with environment variable references
- ⚠️ Ensure environment variables have no trailing slashes
- ⚠️ Frontend and backend must have matching domain origins for CORS to work

## Verifying the Fix

After deployment:

1. Open browser DevTools Console
2. Check that API calls go to `https://api.wendbysakshifatnani.in/api/*`
3. Verify login redirects to correct domain
4. Check that projects/portfolios/contacts load without errors
