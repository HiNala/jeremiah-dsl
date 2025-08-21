"use client";

import { useState } from "react";

// Jeremiah Miller's Spotify embeds
const SPOTIFY_ARTIST_EMBED = "https://open.spotify.com/embed/artist/05xIKia0SX2CEsN0gtshfw?utm_source=generator&theme=0";

export default function SpotifySlideout() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 select-none">
      <div className="relative">
        {/* Expanded Spotify card */}
        <div 
          className={`transition-all duration-500 ease-in-out origin-bottom-left ${
            isExpanded 
              ? 'scale-100 opacity-100 pointer-events-auto' 
              : 'scale-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="relative group">
            <iframe
              src={SPOTIFY_ARTIST_EMBED}
              className="w-80 h-40"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Player - Jeremiah Miller"
            />
            
            {/* Collapse button - appears on hover */}
            <button
              onClick={toggleExpanded}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
              aria-label="Collapse player"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsed circular button */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            !isExpanded 
              ? 'scale-100 opacity-100 pointer-events-auto' 
              : 'scale-0 opacity-0 pointer-events-none absolute bottom-0 left-0'
          }`}
        >
          <button
            onClick={toggleExpanded}
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group"
            aria-label="Expand Spotify player"
          >
            <div className="relative">
              {/* Spotify logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110">
                <path d="M12 0C5.374 0 0 5.372 0 12c0 6.627 5.374 12 12 12s12-5.373 12-12C24 5.372 18.626 0 12 0zm5.485 17.273a.748.748 0 01-1.028.247c-2.811-1.718-6.354-2.107-10.528-1.152a.75.75 0 01-.322-1.463c4.532-.998 8.45-.56 11.5 1.293.357.218.47.682.278 1.075zm1.469-3.265a.936.936 0 01-1.284.308c-3.219-1.98-8.121-2.555-11.92-1.393a.936.936 0 11-.544-1.792c4.301-1.306 9.67-.653 13.356 1.593.443.272.584.86.392 1.284zm.128-3.408c-3.867-2.297-10.283-2.507-13.985-1.372a1.122 1.122 0 11-.646-2.155c4.286-1.285 11.353-1.03 15.774 1.565a1.122 1.122 0 01-1.143 1.962z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}