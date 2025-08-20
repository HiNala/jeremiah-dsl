# Spotify API Setup Guide

To enable full functionality of the Spotify widget (play/pause, track info, album art), you need to configure Spotify API credentials.

## Quick Setup

1. **Create a Spotify App:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create an App"
   - Fill in app name (e.g., "Jeremiah Miller Site") and description
   - Add redirect URI: `http://localhost:3000` (for development)

2. **Get Your Credentials:**
   - Copy the **Client ID** and **Client Secret** from your app dashboard

3. **Get a Refresh Token:**
   - Use this URL (replace YOUR_CLIENT_ID):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000&scope=user-read-currently-playing user-modify-playback-state user-read-playback-state
   ```
   - Visit the URL, authorize the app
   - Copy the `code` from the redirect URL
   - Use a tool like Postman or curl to exchange the code for a refresh token:
   
   ```bash
   curl -X POST "https://accounts.spotify.com/api/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
   ```

4. **Set Environment Variables:**
   Create `.env.local` in your project root:
   ```
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
   ```

5. **Restart Development Server:**
   ```bash
   pnpm run dev
   ```

## What Works Without Setup

- Static display of "Jeremiah Miller - Top tracks"
- Spotify logo link to artist page
- Visual controls (but they won't control actual playback)

## What Works With Setup

- Real-time track information (song name, artist, album)
- Live album artwork
- Functional play/pause/next/previous controls
- Automatic updates as songs change

## Troubleshooting

- Check browser console for error messages
- Verify environment variables are set correctly
- Make sure Spotify is playing on an active device
- The widget will show "API: Not configured" if credentials are missing

## Production Deployment

For production (Vercel, Netlify, etc.):
1. Set the same environment variables in your deployment platform
2. Update redirect URI in Spotify app to match your domain
3. The refresh token should work indefinitely once obtained

