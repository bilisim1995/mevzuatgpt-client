"use client"

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { authService } from '@/services/auth'
import { apiService, SearchStats } from '@/services/api'
import { maintenanceService } from '@/services/maintenance'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Coins, User, Mail, LogOut, ChevronDown, MessageSquare, Headphones, History, Settings, Bell } from 'lucide-react'
import { Megaphone } from 'lucide-react'
import { QuestionAnswerCard } from '@/components/dashboard/question-answer-card'
import { MessageInputFooter } from '@/components/dashboard/message-input-footer'
import { CreditWarningModal } from '@/components/dashboard/credit-warning-modal'
import { SupportTicketsModal } from '@/components/dashboard/support/support-tickets-modal'
import { SearchHistoryModal } from '@/components/dashboard/search-history-modal'
import { ProfileModal } from '@/components/dashboard/profile-modal'
import { CreditPurchaseModal } from '@/components/dashboard/modals/credit-purchase-modal'
import { AIChatInterface } from '@/components/dashboard/ai-chat-interface'
import { LoadingIndicator } from '@/components/dashboard/loading-indicator'
import { AIAnalysisAnimation } from '@/components/dashboard/ai-analysis-animation'
import { AnnouncementsModal } from '@/components/dashboard/announcements-modal'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface User {
  id: string
  email: string
  full_name: string
  ad?: string
  soyad?: string
  meslek?: string
  calistigi_yer?: string
  role: string
  created_at: string
}

interface UserCredits {
  current_balance: number
  is_admin: boolean
  unlimited: boolean
}

interface QuestionAnswer {
  id: string
  searchLogId?: string
  question: string
  answer: string
  reliability: number
  sources: number
  creditsUsed: number
  timestamp: string
  reliabilityData?: any
  performanceData?: { search_stats: SearchStats }
  sourcesData?: Array<{
    document_title: string
    pdf_url: string
    page_number: number
    line_start: number
    line_end: number
    citation: string
    content_preview: string
    similarity_score: number
    chunk_index: number
  }>
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(true)
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([])
  const [isAsking, setIsAsking] = useState(false)
  const [creditWarningModalOpen, setCreditWarningModalOpen] = useState(false)
  const [supportModalOpen, setSupportModalOpen] = useState(false)
  const [searchHistoryModalOpen, setSearchHistoryModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [creditPurchaseModalOpen, setCreditPurchaseModalOpen] = useState(false)
  const [announcementsModalOpen, setAnnouncementsModalOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Bakım durumu kontrolü
    checkMaintenanceStatus()
    
    // Oturum kontrolü
    if (!authService.isAuthenticated()) {
      window.location.href = '/login'
      return
    }

    const userData = authService.getUser()
    console.log('User data from auth service:', userData) // Debug için
    setUser(userData)
    
    // Kredi bilgilerini yükle
    loadUserCredits()
    
    setLoading(false)
  }, [])

  // Modal state'lerini temizle
  useEffect(() => {
    if (!creditPurchaseModalOpen) {
      // Modal kapatıldığında tüm kısıtlamaları kaldır
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
      
      // Tüm modal elementlerini kaldır
      setTimeout(() => {
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]')
        overlays.forEach(overlay => overlay.remove())
        
        const portals = document.querySelectorAll('[data-radix-portal]')
        portals.forEach(portal => {
          if (portal.querySelector('[data-radix-dialog-content]')) {
            portal.remove()
          }
        })
        
        // Body'den tüm modal class'larını kaldır
        document.body.classList.remove('overflow-hidden')
        document.documentElement.classList.remove('overflow-hidden')
      }, 100)
    } else {
      // Modal açıldığında body scroll'unu devre dışı bırak
      document.body.style.overflow = 'hidden'
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
    }
  }, [creditPurchaseModalOpen])

  // Modal kapatma fonksiyonu
  const handleCreditPurchaseModalClose = (open: boolean) => {
    if (!open) {
      // Modal kapatıldığında tüm state'leri temizle
      setCreditPurchaseModalOpen(false)
      
      // Body scroll'unu ve pointer events'i geri yükle
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
      
      // Tüm modal elementlerini kaldır
      setTimeout(() => {
        // Backdrop elementlerini kaldır
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]')
        overlays.forEach(overlay => overlay.remove())
        
        // Portal elementlerini kaldır
        const portals = document.querySelectorAll('[data-radix-portal]')
        portals.forEach(portal => {
          if (portal.querySelector('[data-radix-dialog-content]')) {
            portal.remove()
          }
        })
        
        // Body'den tüm modal class'larını kaldır
        document.body.classList.remove('overflow-hidden')
        document.documentElement.classList.remove('overflow-hidden')
        
        // Z-index'i sıfırla
        document.body.style.zIndex = 'auto'
        document.documentElement.style.zIndex = 'auto'
        
        // Event listener'ları temizle
        document.removeEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
          }
        })
      }, 100)
    } else {
      setCreditPurchaseModalOpen(open)
    }
  }

  const checkMaintenanceStatus = async () => {
    try {
      const maintenanceStatus = await maintenanceService.checkMaintenanceStatus()
      if (maintenanceStatus.success && maintenanceStatus.data.is_enabled) {
        window.location.href = '/maintenance'
        return
      }
    } catch (error) {
      console.error('Bakım durumu kontrol hatası:', error)
    }
  }

  const loadUserCredits = async () => {
    setCreditsLoading(true)
    try {
      const response = await apiService.getUserCredits()
      console.log('Kredi bilgileri:', response) // Debug için
      if (response.success) {
        setUserCredits(response.data)
      }
    } catch (error) {
      console.error('Kredi bilgileri yüklenirken hata:', error)
    } finally {
      setCreditsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/login'
  }

  const handleSendMessage = async (message: string, filters?: any) => {
    if (isAsking) return
    
    // Yeni arama başladığında mevcut kartı hemen temizle
    setQuestionAnswers([])
    
    console.log('📤 Dashboard: Gönderilen filtreler:', filters)
    
    setIsAsking(true)
    try {
      // ÖNCE kredi kontrolü yap - ask endpoint'ini çağırmadan önce
      const creditResponse = await apiService.getUserCredits()
      if (creditResponse.success) {
        const currentCredits = creditResponse.data
        
        // Kredi kontrolü
        if (!currentCredits.unlimited && currentCredits.current_balance <= 0) {
          setUserCredits(currentCredits) // UI'ı güncelle
          setCreditWarningModalOpen(true)
          setIsAsking(false)
          return // Ask endpoint'ini hiç çağırma
        }
        
        // Kredi bilgilerini güncelle
        setUserCredits(currentCredits)
      } else {
        // Kredi bilgisi alınamazsa güvenlik için soru gönderme
        toast.error('Kredi bilgileri alınamadı. Lütfen tekrar deneyin.')
        setIsAsking(false)
        return
      }
      
      // Kredi yeterliyse ask endpoint'ini çağır - filtreleri her zaman gönder
      console.log('🚀 Dashboard: API\'ye gönderiliyor:', filters)
      const response = await apiService.askQuestion(message, filters)
      
      if (response.success) {
        const newQA: QuestionAnswer = {
          id: Date.now().toString(),
          searchLogId: response.data.search_log_id || Date.now().toString(), // API'den gelen search_log_id
          question: response.data.query,
          answer: response.data.answer,
          reliability: response.data.confidence_breakdown?.overall_score || Math.round((response.data.confidence_score || 0) * 100),
          sources: response.data.sources ? response.data.sources.length : 0,
          creditsUsed: response.data.credit_info.credits_used || 0,
          timestamp: new Date(response.timestamp).toLocaleString('tr-TR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Istanbul'
          }),
          reliabilityData: response.data.confidence_breakdown || null,
          performanceData: { search_stats: response.data.search_stats },
          sourcesData: response.data.sources
        }
        
        setQuestionAnswers(prev => [newQA, ...prev])
        setQuestionAnswers([newQA])
        
        // Kredi bilgilerini güncelle
        if (userCredits && !userCredits.unlimited) {
          setUserCredits({
            ...userCredits,
            current_balance: response.data.credit_info.remaining_balance
          })
        }
      }
    } catch (error: any) {
      console.error('Soru sorma hatası:', error)
      toast.error(error.message || 'Soru sorulurken bir hata oluştu.')
      
      if (error.message.includes('Oturum süresi dolmuş')) {
        setTimeout(() => {
          authService.logout()
          window.location.href = '/login'
        }, 2000)
      }
    } finally {
      setIsAsking(false)
    }
  }

  const handleProfileUpdated = (updatedProfile: any) => {
    // Kullanıcı bilgilerini güncelle
    setUser(prev => prev ? { ...prev, ...updatedProfile } : null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Kullanıcının baş harfini al
  const userInitial = user?.full_name?.charAt(0)?.toUpperCase() || 'U'

  // Kredi gösterimi için fonksiyon
  const renderCreditsDisplay = () => {
    if (creditsLoading) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/50 border border-gray-300/50 dark:border-slate-700/30 rounded-full">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      )
    }
    
    if (!userCredits) return null
    
    if (userCredits.unlimited) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-100/80 to-yellow-100/80 dark:from-amber-500/20 dark:to-yellow-500/20 rounded-full border border-amber-400/50 dark:border-amber-400/30">
          <Coins className="h-4 w-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            ∞ Sınırsız
          </span>
          {userCredits.is_admin && (
            <span className="text-xs bg-amber-200/80 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
      )
    }
    
    // Düşük kredi kontrolü
    const isLowCredit = userCredits.current_balance < 5
    
    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
        isLowCredit 
          ? 'bg-red-100/80 dark:bg-red-900/30 border-red-400/60 dark:border-red-500/50 animate-pulse shadow-md' 
          : 'bg-white/80 dark:bg-slate-800/50 border-gray-300/50 dark:border-slate-700/30'
      }`}>
        <Coins className={`h-4 w-4 transition-colors duration-300 ${
          isLowCredit ? 'text-red-400' : 'text-yellow-400'
        } drop-shadow-sm`} />
        <span className={`text-sm font-medium transition-colors duration-300 ${
          isLowCredit ? 'text-red-600 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
        } drop-shadow-sm`}>
          {userCredits.current_balance}
        </span>
        {userCredits.is_admin && (
          <span className="text-xs bg-blue-100/80 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
            Admin
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-white/20 dark:border-slate-700/30 rounded-2xl shadow-2xl">
          <div className="flex justify-between items-center h-16">
            {/* Sol taraf - Logo ve navigasyon */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center ml-6">
                <img 
                  src={mounted && resolvedTheme === 'dark' ? "/Logo (2).png" : "/Logo-Siyah.png"}
                  alt="Mevzuat GPT" 
                  className="h-8 w-auto drop-shadow-sm"
                  onError={(e) => {
                    console.error('Logo yükleme hatası:', (e.target as HTMLImageElement).src);
                    (e.target as HTMLImageElement).src = "/Logo-Siyah.png"; // Fallback
                  }}
                />
              </div>
            </div>
            
            {/* Sağ taraf - Tema toggle, seviye ve kullanıcı */}
            <div className="flex items-center space-x-4 mr-6">
              
              {/* Kullanıcı Menüsü */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-full bg-white/70 dark:bg-slate-800/50 hover:bg-white/90 dark:hover:bg-slate-700/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-6 h-6 bg-blue-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-blue-600 dark:text-gray-200" />
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg"
                >
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                        {user?.full_name || user?.ad + ' ' + user?.soyad || 'Kullanıcı'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">{user?.email}</span>
                    </div>
                    {user?.meslek && (
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.meslek}
                        </span>
                      </div>
                    )}
                    {user?.calistigi_yer && (
                      <div className="flex items-center space-x-2 mt-1">
                        <User className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.calistigi_yer}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <DropdownMenuItem 
                    onClick={() => setProfileModalOpen(true)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profilim
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setSearchHistoryModalOpen(true)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Sorgu Geçmişi
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => setSupportModalOpen(true)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Destek Talebi
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Ayarlar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-full bg-white/70 dark:bg-slate-800/50 hover:bg-white/90 dark:hover:bg-slate-700/50 p-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-white/20 dark:border-slate-700/30 shadow-2xl rounded-xl"
                >
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      Tema
                    </span>
                  </div>
                  
                  <div className="p-3">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Sun className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Gündüz</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300 mb-1" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Gece</span>
                      </button>
                      
                      <button
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                          theme === 'system' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400 mb-1" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">Sistem</span>
                      </button>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                      Kalan Hizmet Hakkı
                    </span>
                  </div>
                  
                  <div className="p-3">
                    <div className="flex items-center space-x-2">
                      {renderCreditsDisplay()}
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                        onClick={() => {
                          setCreditPurchaseModalOpen(true)
                        }}
                      >
                        💳 Satın Al
                      </Button>
                    </div>
                   </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Duyurular Butonu */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAnnouncementsModalOpen(true)}
                className="h-9 w-9 rounded-full bg-white/70 dark:bg-slate-800/50 hover:bg-white/90 dark:hover:bg-slate-700/50 p-0 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Megaphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        </div>
        </div>
      </header>

      {/* Ana İçerik */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-40 h-full overflow-y-auto">
        <div className="space-y-8">
          {/* Soru-Cevap Kartları */}
          {questionAnswers.map((qa) => (
            <QuestionAnswerCard
              key={qa.id}
              searchLogId={qa.searchLogId}
              question={qa.question}
              answer={qa.answer}
              reliability={qa.reliability}
              sources={qa.sources}
              creditsUsed={qa.creditsUsed}
              timestamp={qa.timestamp}
              reliabilityData={qa.reliabilityData}
              performanceData={qa.performanceData}
              sourcesData={qa.sourcesData}
            />
          ))}
          
          {/* AI Chat Interface - Sadece soru-cevap yoksa göster */}
          {questionAnswers.length === 0 && !isAsking && (
            <AIChatInterface />
          )}
          
          {/* Yükleme durumu */}
          {isAsking && (
            <AIAnalysisAnimation />
          )}
        </div>
      </main>

      {/* Sabit Alt Mesaj Giriş Alanı */}
      <MessageInputFooter
        onSendMessage={handleSendMessage}
        disabled={isAsking}
        placeholder={isAsking ? "Cevap bekleniyor..." : "Merak ettiğiniz konuyu kısaca yazın..."}
      />

      {/* Credit Warning Modal */}
      <CreditWarningModal
        open={creditWarningModalOpen}
        onOpenChange={setCreditWarningModalOpen}
        currentBalance={userCredits?.current_balance || 0}
      />

      {/* Support Tickets Modal */}
      <SupportTicketsModal
        open={supportModalOpen}
        onOpenChange={setSupportModalOpen}
      />

      {/* Search History Modal */}
      <SearchHistoryModal
        open={searchHistoryModalOpen}
        onOpenChange={setSearchHistoryModalOpen}
      />

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        open={creditPurchaseModalOpen}
        onOpenChange={handleCreditPurchaseModalClose}
      />

      {/* Announcements Modal */}
      <AnnouncementsModal
        open={announcementsModalOpen}
        onOpenChange={setAnnouncementsModalOpen}
      />
    </div>
  )
}