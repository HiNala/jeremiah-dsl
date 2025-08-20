"use client";

import { useEffect, useRef, useState } from "react";

// Jeremiah Miller's Spotify artist URI
const JEREMIAH_MILLER_ARTIST_URI = "spotify:artist:05xIKia0SX2CEsN0gtshfw";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (IFrameAPI: any) => void;
  }
}

export default function SpotifySlideout() {
  const [controller, setController] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Spotify iFrame API
    const script = document.createElement('script');
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (IFrameAPI: any) => {
      if (!embedRef.current) return;

      const options = {
        width: '100%',
        height: '160',
        uri: JEREMIAH_MILLER_ARTIST_URI, // Play Jeremiah Miller's artist page
        theme: 'dark',
      };

      const callback = (EmbedController: any) => {
        setController(EmbedController);
        
        // Listen for playback events
        EmbedController.addListener('playback_update', (e: any) => {
          setIsPlaying(!e.data.isPaused);
        });
      };

      IFrameAPI.createController(embedRef.current, options, callback);
    };

    return () => {
      const existingScript = document.querySelector('script[src="https://open.spotify.com/embed/iframe-api/v1"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const playPause = () => {
    if (controller) {
      controller.togglePlay();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none">
      {/* Single Spotify card */}
      <div 
        ref={embedRef} 
        id="spotify-embed" 
        className="w-80 h-40 rounded-2xl overflow-hidden shadow-2xl"
      />
    </div>
  );
}