"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { authService } from '@/services/auth'
import { apiService, SearchStats } from '@/services/api'
import { maintenanceService } from '@/services/maintenance'
import { Button } from '@/components/ui/button'
import { Sun, Moon, Coins, User, Mail, LogOut, ChevronDown, MessageSquare, Headphones, History, Settings, Bell, X, Circle, FileText, CreditCard, Shield, Zap, Clock } from 'lucide-react'
import { Megaphone } from 'lucide-react'
import { QuestionAnswerCard } from '@/components/dashboard/question-answer-card'
import { MessageInputFooter } from '@/components/dashboard/message-input-footer'
import { CreditWarningModal } from '@/components/dashboard/credit-warning-modal'
import { SearchHistoryPanel } from '@/components/dashboard/search-history-panel'
import { ProfilePanel } from '@/components/dashboard/profile-panel'
import { CreditPurchasePanel } from '@/components/dashboard/credit-purchase-panel'
import { AIChatInterface } from '@/components/dashboard/ai-chat-interface'
import { LoadingIndicator } from '@/components/dashboard/loading-indicator'
import { AIAnalysisAnimation } from '@/components/dashboard/ai-analysis-animation'
import { AnnouncementsPanel } from '@/components/dashboard/announcements-panel'
import { CorporateContractsPanel } from '@/components/dashboard/corporate-contracts-panel'
import { ContactForm } from '@/components/dashboard/contact-form'
import { SupportPanel } from '@/components/dashboard/support-panel'
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
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(true)
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([])
  const [isAsking, setIsAsking] = useState(false)
  const [creditWarningModalOpen, setCreditWarningModalOpen] = useState(false)
  const [supportPanelOpen, setSupportPanelOpen] = useState(false)
  const [corporateContractsModalOpen, setCorporateContractsModalOpen] = useState(false)
  const [corporateContractsPanelOpen, setCorporateContractsPanelOpen] = useState(false)
  const [contactPanelOpen, setContactPanelOpen] = useState(false)
  const [searchHistoryPanelOpen, setSearchHistoryPanelOpen] = useState(false)
  const [profilePanelOpen, setProfilePanelOpen] = useState(false)
  const [creditPurchasePanelOpen, setCreditPurchasePanelOpen] = useState(false)
  const [announcementsPanelOpen, setAnnouncementsPanelOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Modal açıkken dropdown menülerin focus'unu yönet - sadece kritik modallar
  const isAnyModalOpen = false

  useEffect(() => {
    setMounted(true)
    
    // Bakım durumu kontrolü
    checkMaintenanceStatus()
    
    // Oturum kontrolü
    if (!authService.isAuthenticated()) {
      router.push('/login')
      return
    }

    const userData = authService.getUser()
    setUser(userData)
    
    // Kredi bilgilerini yükle
    loadUserCredits()
    
    setLoading(false)
  }, [])

  // Modal state'lerini temizle - sadece gerekli temizlik
  useEffect(() => {
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
    }
  }, [])


  const checkMaintenanceStatus = async () => {
    try {
      const maintenanceStatus = await maintenanceService.checkMaintenanceStatus()
      if (maintenanceStatus.success && maintenanceStatus.data.is_enabled) {
        router.push('/maintenance')
        return
      }
    } catch (error) {
     
    }
  }

  const loadUserCredits = async () => {
    setCreditsLoading(true)
    try {
      const response = await apiService.getUserCredits()
      if (response.success) {
        setUserCredits(response.data)
      }
    } catch (error) {
  
    } finally {
      setCreditsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const handleSendMessage = async (message: string, filters?: any) => {
    if (isAsking) return
    
    // Yeni arama başladığında mevcut kartı hemen temizle
    setQuestionAnswers([])
    
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
     
      toast.error(error.message || 'Soru sorulurken bir hata oluştu.')
      
      if (error.message.includes('Oturum süresi dolmuş')) {
        setTimeout(() => {
          authService.logout()
          router.push('/login')
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
                  className="h-8 w-auto drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.location.reload()}
                  onError={(e) => {
                   
                    (e.target as HTMLImageElement).src = "/Logo-Siyah.png"; // Fallback
                  }}
                />
              </div>
            </div>
            
            {/* Sağ taraf - Tema toggle, seviye ve kullanıcı */}
            <div className="flex items-center space-x-4 mr-6">
              

              {/* İletişim paneli açıkken kapatma butonu */}
              {contactPanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setContactPanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-green-100/80 dark:bg-green-900/30 hover:bg-green-200/80 dark:hover:bg-green-800/40 text-green-700 dark:text-green-300 border border-green-300/50 dark:border-green-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}
              
              {/* Duyurular paneli açıkken kapatma butonu */}
              {announcementsPanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAnnouncementsPanelOpen(false)
                    setContactPanelOpen(false)
                    setCorporateContractsPanelOpen(false)
                    setSearchHistoryPanelOpen(false)
                    setProfilePanelOpen(false)
                    setCreditPurchasePanelOpen(false)
                    setSupportPanelOpen(false)
                  }}
                  className="h-9 px-4 rounded-full bg-blue-100/80 dark:bg-blue-900/30 hover:bg-blue-200/80 dark:hover:bg-blue-800/40 text-blue-700 dark:text-blue-300 border border-blue-300/50 dark:border-blue-700/50"
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}

              {/* Kurumsal sözleşmeler paneli açıkken kapatma butonu */}
              {corporateContractsPanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCorporateContractsPanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-purple-100/80 dark:bg-purple-900/30 hover:bg-purple-200/80 dark:hover:bg-purple-800/40 text-purple-700 dark:text-purple-300 border border-purple-300/50 dark:border-purple-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}

              {/* Destek paneli açıkken kapatma butonu */}
              {supportPanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSupportPanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-orange-100/80 dark:bg-orange-900/30 hover:bg-orange-200/80 dark:hover:bg-orange-800/40 text-orange-700 dark:text-orange-300 border border-orange-300/50 dark:border-orange-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}

              {/* Sorgu geçmişi paneli açıkken kapatma butonu */}
              {searchHistoryPanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchHistoryPanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-indigo-100/80 dark:bg-indigo-900/30 hover:bg-indigo-200/80 dark:hover:bg-indigo-800/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300/50 dark:border-indigo-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}

              {/* Profil paneli açıkken kapatma butonu */}
              {profilePanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setProfilePanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-teal-100/80 dark:bg-teal-900/30 hover:bg-teal-200/80 dark:hover:bg-teal-800/40 text-teal-700 dark:text-teal-300 border border-teal-300/50 dark:border-teal-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}

              {/* Hizmet satın alma paneli açıkken kapatma butonu */}
              {creditPurchasePanelOpen && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCreditPurchasePanelOpen(false)}
                  className="h-9 px-4 rounded-full bg-amber-100/80 dark:bg-amber-900/30 hover:bg-amber-200/80 dark:hover:bg-amber-800/40 text-amber-700 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Sorguya Dön
                </Button>
              )}
              
              {/* Kullanıcı Menüsü */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-full bg-white/70 dark:bg-slate-800/50 hover:bg-white/90 dark:hover:bg-slate-700/50 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isAnyModalOpen}
                  >
                    <div className="w-6 h-6 bg-blue-100 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-blue-600 dark:text-gray-200" />
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg rounded-xl"
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
                    onClick={() => {
                      setProfilePanelOpen(true)
                      setContactPanelOpen(false)
                      setAnnouncementsPanelOpen(false)
                      setCorporateContractsPanelOpen(false)
                      setSupportPanelOpen(false)
                      setSearchHistoryPanelOpen(false)
                      setCreditPurchasePanelOpen(false)
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profilim
                  </DropdownMenuItem>
                  
                  
                  <DropdownMenuItem 
                    onClick={() => {
                      setSupportPanelOpen(true)
                      setContactPanelOpen(false)
                      setAnnouncementsPanelOpen(false)
                      setCorporateContractsPanelOpen(false)
                      setSearchHistoryPanelOpen(false)
                      setProfilePanelOpen(false)
                      setCreditPurchasePanelOpen(false)
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Destek Talebi
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => {
                      setSearchHistoryPanelOpen(true)
                      setContactPanelOpen(false)
                      setAnnouncementsPanelOpen(false)
                      setCorporateContractsPanelOpen(false)
                      setSupportPanelOpen(false)
                      setProfilePanelOpen(false)
                      setCreditPurchasePanelOpen(false)
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <History className="h-4 w-4 mr-2" />
                    Sorgu Geçmişi
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => {
                      setCorporateContractsPanelOpen(true)
                      setContactPanelOpen(false)
                      setAnnouncementsPanelOpen(false)
                      setSupportPanelOpen(false)
                      setSearchHistoryPanelOpen(false)
                      setProfilePanelOpen(false)
                      setCreditPurchasePanelOpen(false)
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Kurumsal Sözleşmeler
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => {
                      setContactPanelOpen(true)
                      setCorporateContractsPanelOpen(false)
                      setSupportPanelOpen(false)
                      setSearchHistoryPanelOpen(false)
                      setProfilePanelOpen(false)
                      setCreditPurchasePanelOpen(false)
                    }}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    İletişim
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
                    disabled={isAnyModalOpen}
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
                        onClick={() => {
                          setTheme('light')
                        }}
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
                        onClick={() => {
                          setTheme('dark')
                        }}
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
                        onClick={() => {
                          setTheme('system')
                        }}
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
                          setCreditPurchasePanelOpen(true)
                          setContactPanelOpen(false)
                      setAnnouncementsPanelOpen(false)
                          setCorporateContractsPanelOpen(false)
                          setSupportPanelOpen(false)
                          setSearchHistoryPanelOpen(false)
                          setProfilePanelOpen(false)
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
                onClick={() => {
                  setAnnouncementsPanelOpen(true)
                  setContactPanelOpen(false)
                  setCorporateContractsPanelOpen(false)
                  setSearchHistoryPanelOpen(false)
                  setProfilePanelOpen(false)
                  setCreditPurchasePanelOpen(false)
                  setSupportPanelOpen(false)
                }}
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
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-40 h-full">
        {announcementsPanelOpen ? (
          <div className="bg-blue-50/10 dark:bg-blue-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Duyurular
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Sistem duyuruları ve önemli bilgilendirmeler
              </p>
            </div>
            
            {/* Duyurular Panel İçeriği */}
            <div className="max-w-4xl mx-auto w-full">
              <AnnouncementsPanel />
            </div>
          </div>
        ) : contactPanelOpen ? (
          <div className="bg-green-50/10 dark:bg-green-900/10 border border-green-200/30 dark:border-green-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                İletişim
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Bize ulaşın ve sorularınızı iletebilirsiniz.
              </p>
            </div>
            
            {/* İletişim Formu */}
            <div className="max-w-2xl mx-auto w-full">
              <ContactForm />
            </div>
          </div>
        ) : corporateContractsPanelOpen ? (
          <div className="bg-purple-50/10 dark:bg-purple-900/10 border border-purple-200/30 dark:border-purple-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Kurumsal Sözleşmeler
              </h2>
            </div>
            
            {/* Kurumsal Sözleşmeler İçeriği */}
            <div className="max-w-4xl mx-auto w-full">
              <CorporateContractsPanel />
            </div>
          </div>
        ) : supportPanelOpen ? (
          <div className="bg-orange-50/10 dark:bg-orange-900/10 border border-orange-200/30 dark:border-orange-700/30 rounded-2xl p-8 min-h-[400px] flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Destek Talebi
              </h2>
            </div>
            
            {/* Destek Panel İçeriği */}
            <div className="flex-1 max-w-4xl mx-auto w-full">
              <SupportPanel />
            </div>
          </div>
        ) : searchHistoryPanelOpen ? (
          <div className="bg-indigo-50/10 dark:bg-indigo-900/10 border border-indigo-200/30 dark:border-indigo-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Sorgu Geçmişi
              </h2>
            </div>
            
            {/* Sorgu Geçmişi Panel İçeriği */}
            <div className="max-w-4xl mx-auto w-full">
              <SearchHistoryPanel />
            </div>
          </div>
        ) : profilePanelOpen ? (
          <div className="bg-teal-50/10 dark:bg-teal-900/10 border border-teal-200/30 dark:border-teal-700/30 rounded-3xl p-8 min-h-[400px] flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Profil Bilgileri
              </h2>
            </div>
            
            {/* Profil Panel İçeriği */}
            <div className="flex-1 max-w-2xl mx-auto w-full">
              <ProfilePanel onProfileUpdated={handleProfileUpdated} />
            </div>
          </div>
        ) : creditPurchasePanelOpen ? (
          <div className="bg-amber-50/10 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Hizmet Satın Al
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Shield className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">256-bit SSL</span>
                  </div>
                  <span>|</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">Anında Aktivasyon</span>
                  </div>
                  <span>|</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Clock className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">7/24 Destek</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hizmet Satın Alma Panel İçeriği */}
            <div className="max-w-5xl mx-auto w-full">
              <CreditPurchasePanel />
            </div>
          </div>
        ) : (
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
            
            {/* Yükleme durumu - Arama sırasında */}
            {isAsking && (
              <AIAnalysisAnimation />
            )}
          </div>
        )}
      </main>

      {/* Sabit Alt Mesaj Giriş Alanı - İletişim paneli, kurumsal sözleşmeler paneli, destek paneli, sorgu geçmişi paneli, profil paneli veya hizmet satın alma paneli açıkken gizle */}
      {!contactPanelOpen && !corporateContractsPanelOpen && !supportPanelOpen && !searchHistoryPanelOpen && !profilePanelOpen && !creditPurchasePanelOpen && (
        <MessageInputFooter
          onSendMessage={handleSendMessage}
          disabled={isAsking}
          placeholder={isAsking ? "Cevap bekleniyor..." : "Merak ettiğiniz konuyu kısaca yazın..."}
        />
      )}

      {/* İletişim paneli, kurumsal sözleşmeler paneli, destek paneli, sorgu geçmişi paneli, profil paneli veya hizmet satın alma paneli açıkken sadece footer yazıları */}
      {(contactPanelOpen || corporateContractsPanelOpen || supportPanelOpen || searchHistoryPanelOpen || profilePanelOpen || creditPurchasePanelOpen) && (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-40">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
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
                    <Circle className="w-2 h-2 text-green-400 fill-green-400" />
                    <span className="text-green-400">Aktif</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credit Warning Modal */}
      <CreditWarningModal
        open={creditWarningModalOpen}
        onOpenChange={setCreditWarningModalOpen}
        currentBalance={userCredits?.current_balance || 0}
      />







    </div>
  )
}