"use client"

import { useTheme } from 'next-themes'

export function AIAnalysisAnimation() {
  const { resolvedTheme } = useTheme()

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {/* GIF Animasyonu */}
        <div className="w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center flex-shrink-0">
          <img 
            src="/arama-animasyonu.gif" 
            alt="Arama animasyonu" 
            className="w-full h-full object-contain"
            style={{
              filter: resolvedTheme === 'dark' ? 'brightness(1.1) contrast(1.1)' : 'brightness(1) contrast(1)'
            }}
          />
        </div>
        
        {/* Yazı */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2 sm:mb-4 tracking-wide">
            Kaptan, mevzuat ufukta göründü!
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Yasal düzenlemeleri tarayıp en uygun cevapları hazırlıyoruz... <span className="animate-pulse font-semibold text-blue-600 dark:text-blue-400">lütfen bekleyiniz</span>
          </p>
        </div>
      </div>
    </div>
  )
}