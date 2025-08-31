# Deployment Guide - Jeremiah Miller Site

This guide covers deploying the Jeremiah Miller site to Vercel.

## Prerequisites

- Git repository connected to GitHub
- Vercel account connected to your GitHub
- Node.js 18+ for local development

## Quick Deploy to Vercel

1. **Import Project in Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables:**
   ```
   # Required for Spotify functionality (optional)
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret  
   SPOTIFY_REFRESH_TOKEN=your_refresh_token
   ```

3. **Deploy:**
   - Vercel will automatically detect Next.js
   - Click "Deploy" - no additional configuration needed

## Environment Variables Setup

### Spotify Configuration (Optional)
If you want the Spotify music widget to work:

1. Create a Spotify app at [developer.spotify.com](https://developer.spotify.com/dashboard)
2. Add your production domain to redirect URIs (e.g., `https://yoursite.vercel.app`)
3. Get refresh token following the guide in `SPOTIFY_SETUP.md`
4. Add these to Vercel environment variables:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET` 
   - `SPOTIFY_REFRESH_TOKEN`

### Production URLs
Update your Spotify app settings:
- Redirect URIs: Add your Vercel domain (e.g., `https://jeremiah-miller.vercel.app`)

## Build Configuration

The app is configured with:
- ✅ Next.js 15 with App Router
- ✅ TypeScript compilation
- ✅ Tailwind CSS processing
- ✅ ESLint disabled during builds (legacy config)
- ✅ Styled Components support
- ✅ Security headers
- ✅ API route optimization

## Features That Work Without Configuration

- Static pages (home, about, music, contact)
- Globe visualization with heat overlay
- Contact form (stores submissions in memory)
- Basic Spotify widget display

## Features That Require Environment Variables

- Live Spotify track information
- Functional music controls (play/pause/next/previous)
- Real-time album artwork updates

## Performance Notes

- Globe page: ~188KB initial load (includes Three.js)
- Other pages: ~100-143KB initial load
- API routes optimized for 10s max duration
- Static generation where possible

## Troubleshooting

1. **Build Fails:**
   - Check TypeScript errors with `npm run typecheck`
   - Verify all dependencies are in `package.json`

2. **Spotify Widget Issues:**
   - Check environment variables are set
   - Verify redirect URIs match your domain
   - Check browser console for API errors

3. **Globe Not Loading:**
   - Ensure WebGL is supported
   - Check for JavaScript errors
   - Verify texture files are present in `/public/textures/`

## Domain Configuration

After deployment:
1. Add custom domain in Vercel dashboard if desired
2. Update Spotify app redirect URIs to match new domain
3. Update `VERCEL_URL` reference in `next.config.ts` if using custom domain

## Monitoring

- Vercel provides built-in analytics
- Function logs available in Vercel dashboard
- Check Spotify API limits if using music features heavily




