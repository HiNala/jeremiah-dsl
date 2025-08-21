"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreVertical, Play, Volume2, VolumeX, X } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  views: string;
  thumbnailUrl: string;
}

const YOUTUBE_VIDEOS: VideoData[] = [
  {
    id: "V4MUr7PUW9M",
    title: "Jeremiah Miller - Performance",
    views: "12K views",
    thumbnailUrl: `https://img.youtube.com/vi/V4MUr7PUW9M/maxresdefault.jpg`
  },
  {
    id: "LCs5wZV8KKg", 
    title: "Jeremiah Miller - Live Session",
    views: "8.5K views",
    thumbnailUrl: `https://img.youtube.com/vi/LCs5wZV8KKg/maxresdefault.jpg`
  },
  {
    id: "XLSHO7R1BaU",
    title: "Jeremiah Miller - Street Performance", 
    views: "15K views",
    thumbnailUrl: `https://img.youtube.com/vi/XLSHO7R1BaU/maxresdefault.jpg`
  },
  {
    id: "1AwXYYOZ3aE",
    title: "Jeremiah Miller - Acoustic Set",
    views: "6.2K views", 
    thumbnailUrl: `https://img.youtube.com/vi/1AwXYYOZ3aE/maxresdefault.jpg`
  },
  {
    id: "bx9h6d9rmhU",
    title: "Jeremiah Miller - Original Song",
    views: "9.8K views",
    thumbnailUrl: `https://img.youtube.com/vi/bx9h6d9rmhU/maxresdefault.jpg`
  },
  {
    id: "JkVFVAaESO0",
    title: "Jeremiah Miller - Behind the Scenes",
    views: "4.1K views",
    thumbnailUrl: `https://img.youtube.com/vi/JkVFVAaESO0/maxresdefault.jpg`
  }
];

export default function YouTubeShortsGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const [unmutedVideo, setUnmutedVideo] = useState<string | null>(null);
  const [videosPerPage, setVideosPerPage] = useState(5);

  // Update videos per page based on screen size
  useEffect(() => {
    const updateVideosPerPage = () => {
      if (window.innerWidth < 640) {
        setVideosPerPage(2); // Mobile
      } else if (window.innerWidth < 1024) {
        setVideosPerPage(3); // Tablet
      } else {
        setVideosPerPage(5); // Desktop
      }
    };

    updateVideosPerPage();
    window.addEventListener('resize', updateVideosPerPage);
    return () => window.removeEventListener('resize', updateVideosPerPage);
  }, []);

  const scrollLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
    setCurrentIndex(newIndex);
  };

  const scrollRight = () => {
    const maxIndex = Math.max(0, YOUTUBE_VIDEOS.length - videosPerPage);
    const newIndex = currentIndex < maxIndex ? currentIndex + 1 : maxIndex;
    setCurrentIndex(newIndex);
  };

  const getEmbedUrl = (videoId: string, autoplay: boolean = false) => {
    return `https://www.youtube.com/embed/${videoId}?${new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      mute: unmutedVideo === videoId ? '0' : '1',
      controls: '0',
      showinfo: '0',
      rel: '0',
      modestbranding: '1',
      playsinline: '1'
    })}`;
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden">
      <div className="h-full pt-16 sm:pt-20 px-2 sm:px-4 md:px-8 flex items-center justify-center relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-7xl mx-auto w-full">
          {/* Left chevron (responsive sizing) */}
          <div className="flex-shrink-0 w-8 sm:w-10 flex justify-center">
            {currentIndex > 0 ? (
              <button
                onClick={scrollLeft}
                className="text-white hover:text-gray-300 transition-colors duration-200"
                aria-label="Previous videos"
              >
                <ChevronLeft size={32} className="sm:w-10 sm:h-10" />
              </button>
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
          </div>

          {/* Video cards - responsive layout */}
          <div className="flex justify-center gap-2 sm:gap-4 overflow-hidden w-full">
            {/* Responsive video display */}
            {YOUTUBE_VIDEOS.slice(currentIndex, currentIndex + videosPerPage).map((video, index) => (
            <motion.div
              key={video.id}
              className="w-40 sm:w-48 md:w-56 bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group relative shadow-2xl border border-gray-800 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onHoverStart={() => setHoveredVideo(video.id)}
              onHoverEnd={() => setHoveredVideo(null)}
              onClick={() => setUnmutedVideo((v) => (v === video.id ? null : video.id))}
            >
              {/* Video/Thumbnail Container - shorts aspect fill */}
              <div className="relative w-full aspect-[9/16] overflow-hidden">
                {hoveredVideo === video.id ? (
                  <iframe
                    src={getEmbedUrl(video.id, true)}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                  </div>
                )}

                {/* Text overlay - hides on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white transition-opacity duration-300 group-hover:opacity-0">
                  <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
                  <p className="text-white/80 text-xs mt-1">{video.views}</p>
                </div>

                {/* Hover Controls */}
                {hoveredVideo === video.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-3 right-3 flex gap-2"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setUnmutedVideo((v) => (v === video.id ? null : video.id));
                      }}
                      className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
                    >
                      {unmutedVideo === video.id ? (
                        <Volume2 size={16} className="text-white" />
                      ) : (
                        <VolumeX size={16} className="text-white" />
                      )}
                    </button>
                    <button className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200">
                      <MoreVertical size={16} className="text-white" />
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          </div>

          {/* Right chevron (always present for consistent spacing) */}
          <div className="flex-shrink-0 w-8 sm:w-10 flex justify-center">
            {currentIndex < YOUTUBE_VIDEOS.length - videosPerPage ? (
              <button
                onClick={scrollRight}
                className="text-white hover:text-gray-300 transition-colors duration-200"
                aria-label="Next videos"
              >
                <ChevronRight size={32} className="sm:w-10 sm:h-10" />
              </button>
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10" />
            )}
          </div>
        </div>
        
        {/* Made With Love text */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <p className="text-white text-sm">Made With Love ❤️</p>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setModalVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getEmbedUrl(modalVideo, true)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors duration-200"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
