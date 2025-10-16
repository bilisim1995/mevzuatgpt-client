"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Send, Circle, MoreVertical, X, Mic, MicIcon } from 'lucide-react'
import { AdvancedFiltersModal, FilterSettings } from './advanced-filters-modal'

import { buildApiUrl, API_CONFIG } from '@/lib/config'

const EXAMPLE_QUESTIONS = [
  "SGK prim borcu sorgulama nasıl yapılır?",
  "İş Kanunu'na göre fazla mesai ücreti nasıl hesaplanır?",
  "Vergi Usul Kanunu'nda fatura düzenleme süreleri nelerdir?",
  "Borçlar Kanunu'nda zamanaşımı süreleri kaç yıldır?",
  "Ticaret Kanunu'na göre şirket kuruluş prosedürü nedir?"
]

const INSTITUTIONS = [
  { value: "", label: "Tüm Kurumlar" },
  { value: "anayasa_mahkemesi", label: "Anayasa Mahkemesi" },
  { value: "danistay", label: "Danıştay" },
  { value: "yargitay", label: "Yargıtay" },
  { value: "sayistay", label: "Sayıştay" },
  { value: "Sosyal Güvenlik Kurumu", label: "Sosyal Güvenlik Kurumu" },
  { value: "tbmm", label: "TBMM" },
  { value: "cumhurbaskanligi", label: "Cumhurbaşkanlığı" },
  { value: "bakanliklar", label: "Bakanlıklar" },
]

interface HealthStatus {
  isHealthy: boolean
  lastChecked: Date | null
}

interface MessageInputFooterProps {
  onSendMessage?: (message: string, filters?: FilterSettings) => void
  disabled?: boolean
  placeholder?: string
  hideFooter?: boolean
  onVoiceStart?: () => void
  isVoiceActive?: boolean
  onVoiceStop?: () => void
}

export function MessageInputFooter({
  onSendMessage,
  disabled = false,
  placeholder = "Mesajınızı yazın...",
  hideFooter = false,
  onVoiceStart,
  isVoiceActive = false,
  onVoiceStop
}: MessageInputFooterProps) {
  const [message, setMessage] = useState('')
  const [showExamples, setShowExamples] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [animationPosition, setAnimationPosition] = useState(0)
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    isHealthy: false,
    lastChecked: null
  })
  const [filtersModalOpen, setFiltersModalOpen] = useState(false)
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    limit: 5,
    similarity_threshold: 0.5,
    use_cache: false
  })
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<HTMLDivElement>(null)
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Health check fonksiyonu
  const checkHealth = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.HEALTH))
      const data = await response.json()
      
      setHealthStatus({
        isHealthy: response.ok && data.success === true,
        lastChecked: new Date()
      })
    } catch (error) {
     
      setHealthStatus({
        isHealthy: false,
        lastChecked: new Date()
      })
    }
  }

  // İlk yükleme ve 15 dakikada bir kontrol
  useEffect(() => {
    checkHealth() // İlk kontrol
    
    const interval = setInterval(() => {
      checkHealth()
    }, 15 * 60 * 1000) // 15 dakika = 15 * 60 * 1000 ms
    
    return () => clearInterval(interval)
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && onSendMessage) {
      // Tüm ayarları gönder, API'de filtreleme yapılacak
      onSendMessage(message.trim(), filterSettings)
      setMessage('')
      setShowExamples(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleInputFocus = () => {
    setShowExamples(true)
    setIsPaused(false)
    setAnimationPosition(0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
    if (e.target.value.length > 0) {
      setShowExamples(false)
      setIsPaused(false)
    }
  }

  const handleExampleClick = (question: string) => {
    setMessage(question)
    setShowExamples(false)
    setIsPaused(false)
    setAnimationPosition(0)
    inputRef.current?.focus()
  }

  // Mikrofon izin isteği
  const handleVoiceClick = () => {
    if (isVoiceActive) {
      if (onVoiceStop) onVoiceStop()
      return
    }
    setPermissionModalOpen(true)
  }

  const handlePermissionGrant = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // İzin verildi, stream'i kapat
      stream.getTracks().forEach(track => track.stop())
      setPermissionModalOpen(false)
      // Sesli asistan başlat
      if (onVoiceStart) {
        onVoiceStart()
      }
      console.log('Mikrofon izni verildi, sesli asistan başlatıldı')
    } catch (error) {
      console.error('Mikrofon izni reddedildi:', error)
      setPermissionModalOpen(false)
    }
  }

  // Animasyon kontrolü
  useEffect(() => {
    if (showExamples && !isPaused) {
      // Animasyonu başlat
      animationIntervalRef.current = setInterval(() => {
        setAnimationPosition(prev => {
          const containerWidth = animationRef.current?.parentElement?.offsetWidth || 0
          const contentWidth = animationRef.current?.scrollWidth || 0
          const maxPosition = contentWidth - containerWidth
          
          if (prev >= maxPosition) {
            return 0 // Başa dön
          }
          return prev + 1 // 1px ilerle
        })
      }, 20) // 20ms = 50fps
    } else {
      // Animasyonu durdur
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
      }
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current)
        animationIntervalRef.current = null
      }
    }
  }, [showExamples, isPaused])

  // Dışarı tıklama kontrolü
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowExamples(false)
        setIsPaused(false)
        setAnimationPosition(0)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Aktif filtreleri göster
  const getActiveFiltersText = () => {
    const filters = []
    
    if (filterSettings.institution_filter) {
      const institution = INSTITUTIONS.find(i => i.value === filterSettings.institution_filter)
      filters.push(`Kurum: ${institution?.label || filterSettings.institution_filter}`)
    }
    
    if (filterSettings.limit !== 5) {
      filters.push(`Kaynak: ${filterSettings.limit}`)
    }
    
    if (filterSettings.similarity_threshold !== 0.5) {
      filters.push(`Benzerlik: %${Math.round(filterSettings.similarity_threshold * 100)}`)
    }
    
    if (filterSettings.use_cache) {
      filters.push('Hafıza: Açık')
    }
    
    return filters.length > 0 ? filters.join(' • ') : null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-40" ref={containerRef}>
      <div className="max-w-4xl mx-auto">
        {/* Kayan Örnek Sorular */}
        {showExamples && (
          <div 
            className="mb-4 relative overflow-hidden rounded-xl shadow-xl"
          >
            {/* Ana kart arka planı */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-800/10 to-transparent backdrop-blur-sm border border-gray-200/30 dark:border-slate-700/10 rounded-xl"></div>
            
            {/* Başlangıç gradient fade */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/90 dark:from-slate-900/80 via-white/60 dark:via-slate-900/40 to-transparent z-10 rounded-l-xl"></div>
            
            {/* Bitiş gradient fade */}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/90 dark:from-slate-900/80 via-white/60 dark:via-slate-900/40 to-transparent z-10 rounded-r-xl"></div>
            
            <div className="py-3">
              <div 
                ref={animationRef}
                className="flex space-x-6"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                style={{
                  transform: `translateX(-${animationPosition}px)`,
                  transition: isPaused ? 'none' : 'transform 0.02s linear'
                }}
              >
                {/* İlk set */}
                <div className="flex space-x-6 whitespace-nowrap">
                  {EXAMPLE_QUESTIONS.map((question, index) => (
                    <button
                      key={`first-${index}`}
                      onClick={() => handleExampleClick(question)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700/30 hover:bg-blue-50 dark:hover:bg-slate-600/50 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white text-xs rounded-md transition-all duration-200 border border-gray-300 dark:border-slate-600/30 hover:border-blue-300 dark:hover:border-slate-500/50 whitespace-nowrap flex-shrink-0 cursor-pointer relative z-20 shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
                {/* İkinci set (sürekli akış için) */}
                <div className="flex space-x-6 whitespace-nowrap">
                  {EXAMPLE_QUESTIONS.map((question, index) => (
                    <button
                      key={`second-${index}`}
                      onClick={() => handleExampleClick(question)}
                      className="px-3 py-1.5 bg-white dark:bg-slate-700/30 hover:bg-blue-50 dark:hover:bg-slate-600/50 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-white text-xs rounded-md transition-all duration-200 border border-gray-300 dark:border-slate-600/30 hover:border-blue-300 dark:hover:border-slate-500/50 whitespace-nowrap flex-shrink-0 cursor-pointer relative z-20 shadow-sm"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="relative">
          <div className="bg-white dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700/40 p-3 shadow-xl">
            <div className="flex items-center">
              {/* Filtreler Butonu */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFiltersModalOpen(true)}
                disabled={isVoiceActive}
                className={`h-12 w-10 p-0 mr-1 rounded-xl transition-all duration-200 ${
                  isVoiceActive 
                    ? 'bg-gray-100/40 dark:bg-gray-700/30 cursor-not-allowed opacity-50' 
                    : 'bg-gray-100/80 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/50'
                }`}
              >
                <MoreVertical className={`h-5 w-5 ${
                  isVoiceActive 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : 'text-gray-600 dark:text-gray-400'
                }`} />
              </Button>
              {/* Sesli Sohbet Butonu */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleVoiceClick}
                className={`h-12 mr-1 rounded-xl transition-all duration-200 flex items-center justify-center ${
                  isVoiceActive
                    ? 'bg-red-100/80 dark:bg-red-900/40 hover:bg-red-200/80 dark:hover:bg-red-800/50 px-3 w-auto'
                    : 'bg-gray-100/80 dark:bg-gray-700/50 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 w-10 p-0'
                }`}
                aria-label={isVoiceActive ? "Sesli modu durdur" : "Sesli sohbeti başlat"}
                title={isVoiceActive ? "Durdur" : "Sesli sohbet"}
              >
                <Mic className={`h-5 w-5 ${isVoiceActive ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                {isVoiceActive && (
                  <span className="ml-2 text-sm font-medium text-red-700 dark:text-red-300">Durdur</span>
                )}
              </Button>
              
              <Input
                ref={inputRef}
                value={message}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
                placeholder={isVoiceActive ? "Sesli mod aktif..." : placeholder}
                disabled={disabled || isVoiceActive}
                className={`flex-1 h-12 px-4 text-base border rounded-xl focus:outline-none focus:ring-0 transition-colors focus-visible:ring-0 focus-visible:ring-offset-0 ${
                  isVoiceActive
                    ? 'bg-gray-100/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/30 text-gray-500 dark:text-gray-500 placeholder-gray-400 dark:placeholder-gray-500 cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-600/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400'
                }`}
              />
              <Button
                type="submit"
                disabled={disabled || !message.trim() || isVoiceActive}
                className={`h-12 px-6 ml-2 rounded-xl transition-all duration-200 flex items-center justify-center text-base font-medium shadow-md ${
                  isVoiceActive
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-blue-600 dark:bg-gray-700 hover:bg-blue-700 dark:hover:bg-gray-600 hover:shadow-lg'
                }`}
              >
                <Send className="h-5 w-5 mr-2 text-white" />
                <span className="text-white hidden sm:inline">Gönder</span>
              </Button>
            </div>
            
            {/* Aktif Filtreler */}
            {getActiveFiltersText() && (
              <div className="mt-2 px-4">
                <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/30 rounded-lg px-2 py-1 border border-gray-200/50 dark:border-gray-700/30">
                  <button
                    onClick={() => {
                      setFilterSettings({
                        limit: 5,
                        similarity_threshold: 0.5,
                        use_cache: false
                      })
                    }}
                    className="mr-2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded transition-colors"
                  >
                    <X className="h-3 w-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                  </button>
                  <span className="text-xs">{getActiveFiltersText()}</span>
                </div>
              </div>
            )}
          </div>
        </form>
        
        {/* Orbit İnovasyon Footer - Test ekranı açıkken gizle */}
        {!hideFooter && (
          <div className="text-center mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex-1 text-left">
                <a
                  href="https://orbitinovasyon.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                >
                  Orbit İnovasyon Ltd.
                </a>
                {' '}tarafından geliştirildi - v0.1
              </div>
              <div className="flex items-center space-x-2">
                <span>Durum:</span>
                <div className="flex items-center space-x-1">
                  <Circle 
                    className={`w-2 h-2 ${
                      healthStatus.isHealthy 
                        ? 'text-green-400 fill-green-400' 
                        : 'text-red-400 fill-red-400'
                    }`} 
                  />
                  <span className={
                    healthStatus.isHealthy 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }>
                    {healthStatus.isHealthy ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Advanced Filters Modal */}
      <AdvancedFiltersModal
        open={filtersModalOpen}
        onOpenChange={setFiltersModalOpen}
        settings={filterSettings}
        onSettingsChange={setFilterSettings}
      />

      {/* Mikrofon İzin Modalı */}
      <Dialog open={permissionModalOpen} onOpenChange={setPermissionModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MicIcon className="h-5 w-5 text-blue-600" />
              Mikrofon İzni Gerekli
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Sesli sohbet özelliğini kullanabilmek için mikrofon erişimine izin vermeniz gerekiyor. 
              Bu izin sadece bu oturum için geçerlidir ve güvenliğiniz için gereklidir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPermissionModalOpen(false)}
              className="flex-1"
            >
              İptal
            </Button>
            <Button
              onClick={handlePermissionGrant}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              İzin Ver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}