"use client";

import { useState, useEffect } from "react";

// Jeremiah Miller's Spotify embeds
const SPOTIFY_ARTIST_EMBED = "https://open.spotify.com/embed/artist/05xIKia0SX2CEsN0gtshfw?utm_source=generator&theme=0";

export default function SpotifySlideout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Note: In a real implementation, you'd connect this to the Spotify Web Playback SDK
    // For now, this just toggles the visual state
  };

  // Removed auto-collapse to keep control static within the hero

  return (
    <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 select-none">
      <div className="relative">
        {/* Expanded Spotify card */}
        <div 
          className={`transition-all duration-500 ease-in-out origin-bottom-left ${
            isExpanded 
              ? 'scale-100 opacity-100 pointer-events-auto' 
              : 'scale-0 opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center">
            <div className="relative group">
              {/* Enhanced container with better styling */}
              <div className="relative bg-black/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={SPOTIFY_ARTIST_EMBED}
                className="w-72 h-36 sm:w-80 sm:h-40"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify Player - Jeremiah Miller"
              />
              
              {/* Collapse button - enhanced */}
              <button
                onClick={toggleExpanded}
                className="absolute top-3 right-3 w-8 h-8 bg-black/80 hover:bg-brand-flame text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm hover:scale-110"
                aria-label="Collapse player"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z"/>
                </svg>
              </button>

              {/* Mini controls overlay */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-xs font-medium">Jeremiah Miller</span>
                </div>
              </div>
              </div>
            </div>
            {/* Chevron next to expanded card (points left) */}
            <button
              onClick={toggleExpanded}
              className="ml-2 text-white/90 hover:text-white transition-transform duration-300 ease-out rotate-180"
              aria-label="Collapse player"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 7.41 10 6l6 6-6 6-1.41-1.41L13.17 12z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Collapsed square button with dynamic play/pause */}
        <div 
          className={`transition-all duration-500 ease-in-out ${
            !isExpanded 
              ? 'scale-100 opacity-100 pointer-events-auto' 
              : 'scale-0 opacity-0 pointer-events-none absolute bottom-0 left-0'
          }`}
        >
          <div className="flex items-center">
            {/* Main square container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-110 hover:border-brand-flame/50 overflow-hidden group">
              
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-flame/20 to-brand-glow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center text-white transition-all duration-200 hover:text-brand-glow z-10"
                aria-label={isPlaying ? "Pause music" : "Play music"}
              >
                {isPlaying ? (
                  // Pause icon (larger)
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="sm:w-7 sm:h-7">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  // Play icon (larger)
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="sm:w-7 sm:h-7 ml-0.5">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* Removed top-right expand glyph to keep UI minimal */}

              {/* Spotify logo (bottom-left corner) with rotation when playing) */}
              <div className="absolute bottom-1 left-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="#1DB954"
                  className={`sm:w-3 sm:h-3 ${isPlaying ? 'motion-safe:animate-[spin_3s_linear_infinite]' : ''}`}
                >
                  <path d="M12 0C5.374 0 0 5.372 0 12c0 6.627 5.374 12 12 12s12-5.373 12-12C24 5.372 18.626 0 12 0zm5.485 17.273a.748.748 0 01-1.028.247c-2.811-1.718-6.354-2.107-10.528-1.152a.75.75 0 01-.322-1.463c4.532-.998 8.45-.56 11.5 1.293.357.218.47.682.278 1.075zm1.469-3.265a.936.936 0 01-1.284.308c-3.219-1.98-8.121-2.555-11.92-1.393a.936.936 0 11-.544-1.792c4.301-1.306 9.67-.653 13.356 1.593.443.272.584.86.392 1.284zm.128-3.408c-3.867-2.297-10.283-2.507-13.985-1.372a1.122 1.122 0 11-.646-2.155c4.286-1.285 11.353-1.03 15.774 1.565a1.122 1.122 0 01-1.143 1.962z" />
                </svg>
              </div>
            </div>

            {/* Hover tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
              <div className="bg-black/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap">
                {isPlaying ? 'Now Playing' : 'Play Music'}
              </div>
              <div className="w-2 h-2 bg-black/90 transform rotate-45 mx-auto -mt-1" />
            </div>
            {/* Chevron next to collapsed button (points right) */}
            <button
              onClick={toggleExpanded}
              className="ml-2 text-white/90 hover:text-white transition-transform duration-300 ease-out"
              aria-label="Expand Spotify player"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 7.41 10 6l6 6-6 6-1.41-1.41L13.17 12z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}