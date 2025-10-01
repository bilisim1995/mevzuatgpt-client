"use client";

import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';

export function AIChatInterface() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  // Mobil cihaz algılama
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Video URL'ini cihaz tipine göre belirle
  const getVideoUrl = () => {
    if (isMobile) {
      // Mobil için dikey format (YouTube Shorts)
      return "https://www.youtube.com/embed/g_LVDCsP_XY?autoplay=1&rel=0&modestbranding=1";
    } else {
      // Tablet ve bilgisayar için normal video
      return "https://www.youtube.com/embed/4rXdRNVtMFQ?autoplay=1&rel=0&modestbranding=1";
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8 h-full overflow-hidden">
      {/* O3 Logo ve Play Butonu */}
      <div className="relative flex items-center justify-center h-full">
        <img 
          src="/o3.svg" 
          alt="O3 Logo" 
          className="h-80 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Play Butonu */}
        <button
          onClick={openVideoModal}
          className="absolute inset-0 flex items-center justify-center group cursor-pointer"
          aria-label="Video oynat"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white dark:group-hover:bg-gray-700 border-2 border-blue-500 dark:border-blue-400 shadow-2xl">
            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400 ml-1" />
          </div>
        </button>
      </div>

      {/* YouTube Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="relative w-full max-w-4xl h-[80vh] bg-black rounded-2xl overflow-hidden">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <iframe
              src={getVideoUrl()}
              title="Mevzuat GPT Tanıtım Videosu"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}