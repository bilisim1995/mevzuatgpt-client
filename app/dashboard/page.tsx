"use client"

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { authService } from '@/services/auth'
import { apiService, SearchStats } from '@/services/api'
import { maintenanceService } from '@/services/maintenance'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Coins, User, Mail, LogOut, ChevronDown, MessageSquare, Headphones, History, Settings, Bell, X, Circle, FileText, CreditCard, Shield, Zap, Clock, Sun, Moon, PanelLeftClose, PanelLeftOpen, Activity, Trash2, Plus } from 'lucide-react'
import { Megaphone } from 'lucide-react'
import { QuestionAnswerCard } from '@/components/dashboard/question-answer-card'
import { MessageInputFooter } from '@/components/dashboard/message-input-footer'
import { CreditWarningModal } from '@/components/dashboard/credit-warning-modal'
import { ProfilePanel } from '@/components/dashboard/profile-panel'
import { CreditPurchasePanel } from '@/components/dashboard/credit-purchase-panel'
import { AIChatInterface } from '@/components/dashboard/ai-chat-interface'
import { LoadingIndicator } from '@/components/dashboard/loading-indicator'
import { AIAnalysisAnimation } from '@/components/dashboard/ai-analysis-animation'
import { VoiceAssistantAnimation } from '@/components/dashboard/voice-assistant-animation'
import { useVoiceAnalysis } from '@/hooks/use-voice-analysis'
import { AnnouncementsPanel } from '@/components/dashboard/announcements-panel'
import { CorporateContractsPanel } from '@/components/dashboard/corporate-contracts-panel'
import { ContactForm } from '@/components/dashboard/contact-form'
import { SupportPanel } from '@/components/dashboard/support-panel'
import { toast } from 'sonner'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { buildApiUrl, API_CONFIG } from '@/lib/config'

interface DashboardPageProps {
  initialConversationId?: string
}

interface User {
  id: string
  email: string
  full_name: string
  ad?: string
  soyad?: string
  meslek?: string
  calistigi_yer?: string
  profile_image_url?: string
  avatar_url?: string
  role: string
  created_at: string
}

interface UserCredits {
  current_balance: number
  is_admin: boolean
  unlimited: boolean
}

interface HealthStatus {
  isHealthy: boolean
  lastChecked: Date | null
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
  responseTimeSeconds?: number
  reliabilityData?: any
  performanceData?: { search_stats: SearchStats }
  sourcesData?: Array<{
    document_title: string
    pdf_url?: string
    page_number?: number
    line_start?: number
    line_end?: number
    citation: string
    content_preview: string
    similarity_score: number
    chunk_index?: number
  }>
}

interface ConversationListItem {
  conversation_id: string
  title: string
  created_at: string
  message_count: number
}

export default function DashboardPage({ initialConversationId }: DashboardPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null)
  const [creditsLoading, setCreditsLoading] = useState(true)
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    isHealthy: false,
    lastChecked: null
  })
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswer[]>([])
  const [isAsking, setIsAsking] = useState(false)
  const [isConversationLoading, setIsConversationLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null)
  const [conversations, setConversations] = useState<ConversationListItem[]>([])
  const [conversationsLoading, setConversationsLoading] = useState(false)
  const [conversationSearch, setConversationSearch] = useState('')
  const [isConversationPanelCollapsed, setIsConversationPanelCollapsed] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ConversationListItem | null>(null)
  const [creditWarningModalOpen, setCreditWarningModalOpen] = useState(false)
  const [supportPanelOpen, setSupportPanelOpen] = useState(false)
  const [corporateContractsModalOpen, setCorporateContractsModalOpen] = useState(false)
  const [corporateContractsPanelOpen, setCorporateContractsPanelOpen] = useState(false)
  const [contactPanelOpen, setContactPanelOpen] = useState(false)
  const [profilePanelOpen, setProfilePanelOpen] = useState(false)
  const [creditPurchasePanelOpen, setCreditPurchasePanelOpen] = useState(false)
  const [announcementsPanelOpen, setAnnouncementsPanelOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const mainScrollRef = useRef<HTMLDivElement | null>(null)
  
  // Sesli asistan hook'u
  const { audioLevel, isListening, startListening, stopListening, error, waveform, isUploading, finalizeAndUpload, isBoosting, isPlaying, stopAudio, questionText } = useVoiceAnalysis()

  // Modal açıkken dropdown menülerin focus'unu yönet - sadece kritik modallar
  const isAnyModalOpen = false
  const isDarkTheme = theme === 'dark' || (theme === 'system' && resolvedTheme === 'dark')

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

    // Sohbet listesini yükle
    loadConversations()
    
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!initialConversationId) return
    if (!authService.isAuthenticated()) return
    loadConversation(initialConversationId)
  }, [initialConversationId])

  useEffect(() => {
    if (!mainScrollRef.current) return
    requestAnimationFrame(() => {
      mainScrollRef.current?.scrollTo({
        top: mainScrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    })
  }, [questionAnswers.length])

  useEffect(() => {
    if (!mainScrollRef.current || !isAsking) return
    requestAnimationFrame(() => {
      mainScrollRef.current?.scrollTo({
        top: mainScrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    })
  }, [isAsking])

  // Modal state'lerini temizle - sadece gerekli temizlik
  useEffect(() => {
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset'
      document.body.style.pointerEvents = 'auto'
      document.documentElement.style.pointerEvents = 'auto'
    }
  }, [])

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

  useEffect(() => {
    checkHealth()
    const interval = setInterval(() => {
      checkHealth()
    }, 15 * 60 * 1000)

    return () => clearInterval(interval)
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

  const loadConversations = async () => {
    setConversationsLoading(true)
    try {
      const response = await apiService.getConversations()
      if (response.success) {
        setConversations(response.data.conversations || [])
      }
    } catch (error: any) {
      toast.error(error.message || 'Sohbet listesi yüklenirken bir hata oluştu.')
    } finally {
      setConversationsLoading(false)
    }
  }

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
  }

  const createConversationId = () => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID()
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }

  const formatTimestamp = (value?: string) => {
    return new Date(value || Date.now()).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    })
  }

  const formatConversationDate = (value: string) => {
    return new Date(value).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Istanbul'
    })
  }

  const filteredConversations = conversations.filter(item =>
    conversationSearch.trim() === '' ||
    item.title.toLowerCase().includes(conversationSearch.trim().toLowerCase())
  )

  const buildQuestionAnswersFromMessages = (messages: Array<{
    id: string
    role: 'user' | 'assistant'
    query?: string | null
    response?: string | null
    search_log_id?: string | null
    credits_used?: number | null
    reliability_score?: number | null
    sources?: Array<{
      document_id: string
      document_title: string
      similarity_score: number
      source_institution: string
      citation: string
      content_preview: string
    }> | null
    created_at: string
  }>) => {
    const result: QuestionAnswer[] = []

    messages.forEach(message => {
      if (message.role === 'user') {
        result.push({
          id: message.id,
          searchLogId: message.search_log_id || undefined,
          question: message.query || '',
          answer: '',
          reliability: 0,
          sources: 0,
          creditsUsed: message.credits_used || 0,
          timestamp: formatTimestamp(message.created_at),
          reliabilityData: null,
        })
        return
      }

      const searchLogId = message.search_log_id || undefined
      const sourcesData = message.sources
        ? message.sources.map(source => ({
            document_title: source.document_title,
            citation: source.citation,
            content_preview: source.content_preview,
            similarity_score: source.similarity_score
          }))
        : undefined
      const reliabilityScore = typeof message.reliability_score === 'number'
        ? Math.round(message.reliability_score * 100)
        : 0
      let targetIndex = -1
      for (let i = result.length - 1; i >= 0; i -= 1) {
        const candidate = result[i]
        if (candidate.answer) continue
        if (!searchLogId || candidate.searchLogId === searchLogId) {
          targetIndex = i
          break
        }
      }

      if (targetIndex === -1) {
        result.push({
          id: message.id,
          searchLogId,
          question: '',
          answer: message.response || '',
          reliability: reliabilityScore,
          sources: message.sources ? message.sources.length : 0,
          creditsUsed: message.credits_used || 0,
          timestamp: formatTimestamp(message.created_at),
          reliabilityData: null,
          sourcesData
        })
        return
      }

      result[targetIndex] = {
        ...result[targetIndex],
        id: message.id,
        answer: message.response || '',
        reliability: reliabilityScore || result[targetIndex].reliability,
        sources: message.sources ? message.sources.length : result[targetIndex].sources,
        creditsUsed: message.credits_used || result[targetIndex].creditsUsed,
        timestamp: formatTimestamp(message.created_at),
        sourcesData: sourcesData || result[targetIndex].sourcesData
      }
    })

    return result
  }

  const mapHistorySources = (sources?: Array<{
    document_id: string
    document_title: string
    source_institution: string
    content?: string | null
    similarity_score: number
    category?: string | null
    publish_date?: string | null
    pdf_url?: string | null
    citation?: string | null
    page_number?: number | null
    line_start?: number | null
    line_end?: number | null
    content_preview?: string | null
  }> | null) => {
    if (!sources || sources.length === 0) return undefined
    return sources.map(source => ({
      document_title: source.document_title,
      pdf_url: source.pdf_url || undefined,
      page_number: source.page_number ?? undefined,
      line_start: source.line_start ?? undefined,
      line_end: source.line_end ?? undefined,
      citation: source.citation || '',
      content_preview: source.content_preview || source.content || '',
      similarity_score: source.similarity_score
    }))
  }

  const enrichAnswersWithHistory = (answers: QuestionAnswer[], historyItems: Array<{
    query: string
    response: string | null
    sources: Array<any>
    reliability_score: number
    credits_used: number
    execution_time?: number | null
  }>) => {
    const historyMap = new Map<string, typeof historyItems[number]>()
    historyItems.forEach(item => {
      const key = `${item.query}||${item.response || ''}`
      historyMap.set(key, item)
    })

    return answers.map(answer => {
      const key = `${answer.question}||${answer.answer}`
      const historyItem = historyMap.get(key)
      if (!historyItem) return answer

      const mappedSources = mapHistorySources(historyItem.sources)
      return {
        ...answer,
        reliability: Math.round(historyItem.reliability_score * 100),
        creditsUsed: historyItem.credits_used,
        sources: historyItem.sources ? historyItem.sources.length : 0,
        sourcesData: mappedSources,
        responseTimeSeconds: typeof historyItem.execution_time === 'number' ? historyItem.execution_time : answer.responseTimeSeconds
      }
    })
  }

  const loadConversation = async (activeConversationId: string) => {
    setIsConversationLoading(true)
    try {
      const response = await apiService.getConversation(activeConversationId)
      if (response.success) {
        setConversationId(response.data.conversation_id)
        const baseAnswers = buildQuestionAnswersFromMessages(response.data.messages)
        setQuestionAnswers(baseAnswers)
        try {
          const historyResponse = await apiService.getSearchHistory({ page: 1, limit: 20 })
          if (historyResponse.success) {
            setQuestionAnswers(enrichAnswersWithHistory(baseAnswers, historyResponse.data.items))
          }
        } catch (historyError) {
          console.error('Sorgu geçmişi alınamadı:', historyError)
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Sohbet yüklenirken bir hata oluştu.')
    } finally {
      setIsConversationLoading(false)
    }
  }

  const handleConversationSelect = (item: ConversationListItem) => {
    if (conversationId === item.conversation_id) return
    setQuestionAnswers([])
    setConversationId(item.conversation_id)
    window.history.replaceState(null, '', `/dashboard/sohbet/${item.conversation_id}`)
    loadConversation(item.conversation_id)
  }

  const handleConversationDeleteClick = (item: ConversationListItem) => {
    setDeleteTarget(item)
    setDeleteDialogOpen(true)
  }

  const confirmConversationDelete = async () => {
    if (!deleteTarget) return
    try {
      const response = await apiService.deleteConversation(deleteTarget.conversation_id)
      if (response.success) {
        if (conversationId === deleteTarget.conversation_id) {
          await loadConversations()
          window.location.href = '/dashboard'
          return
        }
        setConversations(prev => prev.filter(conversation => conversation.conversation_id !== deleteTarget.conversation_id))
      }
    } catch (error: any) {
      toast.error(error.message || 'Sohbet silinirken bir hata oluştu.')
    } finally {
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  const handleSendMessage = async (message: string, filters?: any) => {
    if (isAsking) return

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
      
      let activeConversationId = conversationId
      const isNewConversation = !activeConversationId
      if (!activeConversationId) {
        activeConversationId = createConversationId()
        setConversationId(activeConversationId)
        window.history.replaceState(null, '', `/dashboard/sohbet/${activeConversationId}`)
      }

      // Kredi yeterliyse ask endpoint'ini çağır - filtreleri her zaman gönder
      const response = await apiService.askQuestion(message, filters, activeConversationId || undefined)
      
      if (response.success) {
        const returnedConversationId = response.data.conversation_id
        if (returnedConversationId && returnedConversationId !== conversationId) {
          setConversationId(returnedConversationId)
          window.history.replaceState(null, '', `/dashboard/sohbet/${returnedConversationId}`)
        }

        const newQA: QuestionAnswer = {
          id: Date.now().toString(),
          searchLogId: response.data.search_log_id || Date.now().toString(), // API'den gelen search_log_id
          question: response.data.query,
          answer: response.data.answer,
          reliability: response.data.confidence_breakdown?.overall_score || Math.round((response.data.confidence_score || 0) * 100),
          sources: response.data.sources ? response.data.sources.length : 0,
          creditsUsed: response.data.credit_info.credits_used || 0,
          timestamp: formatTimestamp(response.timestamp),
          responseTimeSeconds: typeof response.data.search_stats?.total_pipeline_time_ms === 'number'
            ? Math.round((response.data.search_stats.total_pipeline_time_ms / 1000) * 100) / 100
            : undefined,
          reliabilityData: response.data.confidence_breakdown || null,
          performanceData: { search_stats: response.data.search_stats },
          sourcesData: response.data.sources
        }
        
        setQuestionAnswers(prev => [...prev, newQA])

        if (isNewConversation) {
          loadConversations()
        }
        
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

  const handleClosePanels = () => {
    setAnnouncementsPanelOpen(false)
    setContactPanelOpen(false)
    setCorporateContractsPanelOpen(false)
    setProfilePanelOpen(false)
    setCreditPurchasePanelOpen(false)
    setSupportPanelOpen(false)
  }

  const closeButton = (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClosePanels}
      className="absolute top-4 right-4 z-10 h-9 px-3 rounded-full bg-white/90 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700/70 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <X className="h-4 w-4" />
      <span>Kapat</span>
    </Button>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Kullanıcının baş harfini al
  const getUserInitials = () => {
    const firstName = user?.ad?.trim() || user?.full_name?.trim().split(' ')[0] || ''
    const lastName = user?.soyad?.trim() || user?.full_name?.trim().split(' ').slice(1).join(' ') || ''
    if (firstName && lastName) {
      return (firstName[0] + lastName[0]).toUpperCase()
    }
    if (firstName) {
      return firstName.slice(0, 2).toUpperCase()
    }
    return 'U'
  }

  const profileImageUrl = user?.profile_image_url || user?.avatar_url || ''

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
      {/* Logo - Sol Sabit */}
      <div className="fixed left-4 top-4 z-[60]">
        <img 
          src="/logo.svg"
          alt="Mevzuat GPT" 
          className="h-12 w-auto drop-shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => {
            window.location.href = '/dashboard'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/logo.svg"
          }}
        />
      </div>

      {/* Sol Sohbet Listesi */}
      <div className={`fixed left-4 top-20 bottom-6 z-[50] ${isConversationPanelCollapsed ? 'w-12' : 'w-64'}`}>
        <div className={`bg-white/90 dark:bg-slate-800/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-600/40 rounded-2xl shadow-lg p-3 h-full flex flex-col transition-opacity ${isConversationPanelCollapsed ? 'items-center' : 'opacity-80 hover:opacity-100'}`}>
          <div className={`flex items-center ${isConversationPanelCollapsed ? 'justify-center' : 'justify-between'} mb-3 w-full`}>
            {!isConversationPanelCollapsed && (
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center space-x-2">
                <History className="h-3 w-3" />
                <span>Sohbet Geçmişi</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsConversationPanelCollapsed(prev => !prev)}
              className="h-7 w-7 rounded-full border border-gray-200/60 dark:border-slate-600/50 bg-white/70 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-700/60 flex items-center justify-center text-gray-500 dark:text-gray-300 transition-colors"
              aria-label={isConversationPanelCollapsed ? 'Sohbet geçmişini aç' : 'Sohbet geçmişini küçült'}
              title={isConversationPanelCollapsed ? 'Aç' : 'Küçült'}
            >
              {isConversationPanelCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
            {!isConversationPanelCollapsed && conversationsLoading && (
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></div>
            )}
          </div>

          {isConversationPanelCollapsed ? (
            <div className="flex flex-col items-center h-full w-full">
              <History className="h-4 w-4 text-gray-500 dark:text-gray-300 mt-2" />
              <div className="mt-auto flex flex-col items-center space-y-3 pb-1">
                <button
                  type="button"
                  onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
                  className="h-8 w-8 rounded-full border border-gray-200/60 dark:border-slate-600/50 bg-white/70 dark:bg-slate-900/40 flex items-center justify-center text-gray-500 dark:text-gray-300"
                  aria-label={isDarkTheme ? 'Gündüz moda geç' : 'Gece moda geç'}
                  title="Tema"
                >
                  {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </button>
                <div
                  className="h-8 w-8 rounded-full border border-gray-200/60 dark:border-slate-600/50 bg-white/70 dark:bg-slate-900/40 flex items-center justify-center"
                  title={healthStatus.isHealthy ? 'Durum: Aktif' : 'Durum: Pasif'}
                >
                  <Activity className={`h-4 w-4 ${healthStatus.isHealthy ? 'text-green-400' : 'text-red-400'}`} />
                </div>
              </div>
            </div>
          ) : (
            <>
              <input
                value={conversationSearch}
                onChange={(event) => setConversationSearch(event.target.value)}
                placeholder="Sohbetlerde ara..."
                className="mb-3 h-10 w-full rounded-xl border border-slate-200/70 dark:border-slate-600/50 bg-white/80 dark:bg-slate-900/40 px-3 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              />

              <div className="flex-1">
                {conversationsLoading ? (
                  <div className="space-y-2">
                    <div className="h-10 w-11/12 rounded-lg bg-gray-100 dark:bg-slate-700/40 animate-pulse"></div>
                    <div className="h-10 w-10/12 rounded-lg bg-gray-100 dark:bg-slate-700/40 animate-pulse"></div>
                    <div className="h-10 w-9/12 rounded-lg bg-gray-100 dark:bg-slate-700/40 animate-pulse"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                    {conversations.length === 0 ? 'Henüz sohbet yok.' : 'Aramanıza uygun sohbet bulunamadı.'}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.map(item => (
                      <div
                        key={item.conversation_id}
                        className={`w-full text-left p-2 rounded-lg border transition-colors ${
                          conversationId === item.conversation_id
                            ? 'border-blue-400/60 bg-blue-50/80 dark:bg-blue-900/20'
                            : 'border-transparent hover:border-gray-200 dark:hover:border-slate-600/50 hover:bg-gray-50 dark:hover:bg-slate-700/30'
                        } overflow-hidden`}
                      >
                        <div
                          onClick={() => handleConversationSelect(item)}
                          className="flex-1 text-left min-w-0 cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              handleConversationSelect(item)
                            }
                          }}
                        >
                          <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate max-w-full">
                            {item.title}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatConversationDate(item.created_at)}</span>
                            <div className="flex items-center space-x-2">
                              <span>{item.message_count} mesaj</span>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation()
                                  handleConversationDeleteClick(item)
                                }}
                                className="h-6 w-6 flex items-center justify-center rounded-full border border-gray-200/60 dark:border-slate-600/50 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/50 transition-colors"
                                title="Sohbeti sil"
                                aria-label="Sohbeti sil"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-3 border-t border-gray-200 dark:border-slate-700/50 pt-2">
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                  <button
                    type="button"
                    onClick={() => setTheme(isDarkTheme ? 'light' : 'dark')}
                    className="inline-flex items-center space-x-1 rounded-full px-2 py-1 bg-white/70 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/40 shadow-sm backdrop-blur hover:opacity-100 transition-all duration-300"
                    aria-label={isDarkTheme ? 'Gündüz moda geç' : 'Gece moda geç'}
                  >
                    <span>{isDarkTheme ? 'Gündüz' : 'Gece'}</span>
                    {isDarkTheme ? <Moon className="h-3 w-3 text-gray-500" /> : <Sun className="h-3 w-3 text-amber-500" />}
                  </button>
                  <div className="flex items-center space-x-1 rounded-full bg-white/80 dark:bg-gray-800/70 px-2 py-1 border border-gray-200/50 dark:border-gray-700/40 shadow-sm backdrop-blur">
                    <span>Durum:</span>
                    <Circle
                      className={`w-2 h-2 ${
                        healthStatus.isHealthy ? 'text-green-400 fill-green-400' : 'text-red-400 fill-red-400'
                      }`}
                    />
                    <span className={healthStatus.isHealthy ? 'text-green-400' : 'text-red-400'}>
                      {healthStatus.isHealthy ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 border-t border-gray-200 dark:border-slate-700/50 pt-2 text-[10px] text-gray-400 dark:text-gray-500">
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
            </>
          )}
        </div>
      </div>

      {/* Profil - Sağ Sabit */}
      <div className="fixed right-4 top-4 z-[60] flex items-center space-x-2">
        {pathname?.startsWith('/dashboard/sohbet/') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.location.href = '/dashboard'
            }}
            className="h-10 px-3 rounded-full bg-white/90 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-600/40 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs font-medium">Yeni Sohbet Başlat</span>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 px-3 rounded-full bg-white/90 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700/70 backdrop-blur-sm border border-slate-200/60 dark:border-slate-600/40 flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isAnyModalOpen}
            >
              <Avatar className="h-8 w-8 border border-slate-700/70 dark:border-slate-200/70">
                {profileImageUrl && (
                  <AvatarImage src={profileImageUrl} alt={user?.full_name || 'Profil'} />
                )}
                <AvatarFallback className="bg-blue-100 text-[10px] font-semibold text-blue-700 dark:bg-slate-600 dark:text-gray-200">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
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
                setAnnouncementsPanelOpen(true)
                setContactPanelOpen(false)
                setCorporateContractsPanelOpen(false)
                setProfilePanelOpen(false)
                setCreditPurchasePanelOpen(false)
                setSupportPanelOpen(false)
              }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              <Megaphone className="h-4 w-4 mr-2" />
              Duyurular
            </DropdownMenuItem>

            <DropdownMenuItem 
              onClick={() => {
                setProfilePanelOpen(true)
                setContactPanelOpen(false)
                setAnnouncementsPanelOpen(false)
                setCorporateContractsPanelOpen(false)
                setSupportPanelOpen(false)
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
                setCorporateContractsPanelOpen(true)
                setContactPanelOpen(false)
                setAnnouncementsPanelOpen(false)
                setSupportPanelOpen(false)
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
                setProfilePanelOpen(false)
                setCreditPurchasePanelOpen(false)
              }}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-200"
            >
              <Mail className="h-4 w-4 mr-2" />
              İletişim
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />

            <div className="p-3">
              <div className="flex items-center space-x-2">
                {renderCreditsDisplay()}
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full"
                  onClick={() => {
                    setCreditPurchasePanelOpen(true)
                    setContactPanelOpen(false)
                    setAnnouncementsPanelOpen(false)
                    setCorporateContractsPanelOpen(false)
                    setSupportPanelOpen(false)
                    setProfilePanelOpen(false)
                  }}
                >
                  💳 Satın Al
                </Button>
              </div>
            </div>
            
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
      </div>


      {/* Ana İçerik */}
      <main ref={mainScrollRef} className="max-w-5xl mx-auto px-6 pt-24 pb-40 h-[calc(100vh-6rem)] overflow-y-auto overscroll-contain">
        {announcementsPanelOpen ? (
          <div className="relative bg-blue-50/10 dark:bg-blue-900/10 border border-blue-200/30 dark:border-blue-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            {closeButton}
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
          <div className="relative bg-green-50/10 dark:bg-green-900/10 border border-green-200/30 dark:border-green-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            {closeButton}
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
          <div className="relative bg-purple-50/10 dark:bg-purple-900/10 border border-purple-200/30 dark:border-purple-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            {closeButton}
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
          <div className="relative bg-orange-50/10 dark:bg-orange-900/10 border border-orange-200/30 dark:border-orange-700/30 rounded-2xl p-8 min-h-[400px] flex flex-col shadow-lg">
            {closeButton}
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
        ) : profilePanelOpen ? (
          <div className="relative bg-teal-50/10 dark:bg-teal-900/10 border border-teal-200/30 dark:border-teal-700/30 rounded-3xl p-8 min-h-[400px] flex flex-col shadow-lg">
            {closeButton}
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
          <div className="relative bg-amber-50/10 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-700/30 rounded-2xl p-8 flex flex-col shadow-lg">
            {closeButton}
           
            {/* Hizmet Satın Alma Panel İçeriği */}
            <div className="max-w-5xl mx-auto w-full">
              <CreditPurchasePanel onCreditsUpdated={loadUserCredits} />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {isConversationLoading && questionAnswers.length === 0 && (
              <div className="space-y-6">
                <div className="bg-white/90 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/40 rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-4 w-1/3 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-5/6 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="bg-white/90 dark:bg-slate-800/60 border border-gray-200/50 dark:border-slate-700/40 rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-4 w-1/4 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  <div className="mt-4 space-y-2">
                    <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-4/5 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-3 w-3/5 bg-gray-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            )}

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
                responseTimeSeconds={qa.responseTimeSeconds}
                reliabilityData={qa.reliabilityData}
                performanceData={qa.performanceData}
                sourcesData={qa.sourcesData}
              />
            ))}
            
            {/* AI Chat Interface - Sadece soru-cevap yoksa göster */}
            {questionAnswers.length === 0 && !isAsking && !isConversationLoading && (
              <AIChatInterface 
                userCredits={userCredits} 
                onCreditPurchase={() => setCreditPurchasePanelOpen(true)}
                isListening={isListening}
                audioLevel={audioLevel}
                onVoiceStop={stopListening}
                waveform={waveform}
                isUploading={isUploading}
                onFinalize={finalizeAndUpload}
                onStartListening={startListening}
                isBoosting={isBoosting}
                isPlaying={isPlaying}
                onStopAudio={stopAudio}
                questionText={questionText}
              />
            )}
            
            {/* Yükleme durumu - Arama sırasında */}
            {isAsking && (
              <AIAnalysisAnimation />
            )}
            
          </div>
        )}
      </main>

      {/* Sabit Alt Mesaj Giriş Alanı - İletişim paneli, kurumsal sözleşmeler paneli, destek paneli, sorgu geçmişi paneli, profil paneli veya hizmet satın alma paneli açıkken gizle */}
      {!contactPanelOpen && !corporateContractsPanelOpen && !supportPanelOpen && !profilePanelOpen && !creditPurchasePanelOpen && (
        <MessageInputFooter
          onSendMessage={handleSendMessage}
          disabled={isAsking}
          placeholder={isAsking ? "Cevap bekleniyor..." : "Merak ettiğiniz konuyu kısaca yazın..."}
          onVoiceStart={startListening}
          onVoiceStop={stopListening}
          isVoiceActive={isListening}
        />
      )}

      {/* Credit Warning Modal */}
      <CreditWarningModal
        open={creditWarningModalOpen}
        onOpenChange={setCreditWarningModalOpen}
        currentBalance={userCredits?.current_balance || 0}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sohbeti Sil</DialogTitle>
            <DialogDescription>
              {deleteTarget ? (
                <>
                  <span className="block">
                    "{deleteTarget.title}" sorunuzla başlayan ve {deleteTarget.message_count} mesajlı bu geçmiş silinmek isteniyor mu?
                  </span>
                  <span className="block mt-2">
                    Silerseniz bu sohbetteki içerikler geri alınamayacak.
                  </span>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={confirmConversationDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>






    </div>
  )
}