"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThumbsUp, ThumbsDown, Copy, Share2, Clock, Coins, Info, FileText, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { apiService } from '@/services/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ReliabilityModal } from './modals/reliability-modal'
import { SourcesModal } from './modals/sources-modal'
import { PerformanceModal } from './modals/performance-modal'
import { CreditInfoModal } from './modals/credit-info-modal'

import { SearchStats } from '@/services/api'

// Konfeti animasyonu için yardımcı fonksiyon
const createConfetti = (element: HTMLElement, color: string) => {
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  
  for (let i = 0; i < 8; i++) {
    const confetti = document.createElement('div')
    confetti.style.position = 'fixed'
    confetti.style.left = centerX + 'px'
    confetti.style.top = centerY + 'px'
    confetti.style.width = '4px'
    confetti.style.height = '4px'
    confetti.style.backgroundColor = color
    confetti.style.borderRadius = '50%'
    confetti.style.pointerEvents = 'none'
    confetti.style.zIndex = '9999'
    confetti.style.transform = 'scale(0)'
    
    document.body.appendChild(confetti)
    
    const angle = (i / 8) * Math.PI * 2
    const distance = 20 + Math.random() * 15
    const endX = centerX + Math.cos(angle) * distance
    const endY = centerY + Math.sin(angle) * distance
    
    confetti.animate([
      { transform: 'scale(0) translate(0, 0)', opacity: 1 },
      { transform: 'scale(1) translate(' + (endX - centerX) + 'px, ' + (endY - centerY) + 'px)', opacity: 1, offset: 0.7 },
      { transform: 'scale(0.5) translate(' + (endX - centerX) + 'px, ' + (endY - centerY + 10) + 'px)', opacity: 0 }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
      document.body.removeChild(confetti)
    }
  }
}

interface QuestionAnswerCardProps {
  question: string
  answer: string
  reliability: number
  sources: number
  creditsUsed: number
  timestamp: string
  responseTimeSeconds?: number
  reliabilityData?: any
  performanceData?: { search_stats: SearchStats }
  searchLogId?: string
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

export function QuestionAnswerCard({
  question,
  answer,
  reliability,
  sources,
  creditsUsed,
  timestamp,
  responseTimeSeconds,
  reliabilityData,
  performanceData,
  searchLogId,
  sourcesData,
}: QuestionAnswerCardProps) {
  const [liked, setLiked] = useState<boolean | null>(null)
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [dislikeModalOpen, setDislikeModalOpen] = useState(false)
  const [dislikeReason, setDislikeReason] = useState('')
  const [dislikeSubmitting, setDislikeSubmitting] = useState(false)
  const [reliabilityModalOpen, setReliabilityModalOpen] = useState(false)
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false)
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false)
  const [creditInfoModalOpen, setCreditInfoModalOpen] = useState(false)

  const actualReliabilityScore = reliabilityData?.overall_score ?? reliability

  useEffect(() => {
    if (searchLogId) {
      checkExistingFeedback()
    }
  }, [searchLogId])

  const checkExistingFeedback = async () => {
    if (!searchLogId) return
    try {
      const feedback = await apiService.checkFeedback(searchLogId)
      if (feedback && feedback.feedback_type) {
        setLiked(feedback.feedback_type === 'like')
      }
    } catch (error) {}
  }

  const handleFeedback = async (isLike: boolean, comment?: string) => {
    if (!searchLogId || feedbackLoading) {
      toast.warning('Feedback gönderilemiyor. Lütfen daha sonra tekrar deneyin.');
      return
    }
    
    setFeedbackLoading(true)
    try {
      await apiService.sendFeedback(searchLogId, isLike, comment)
      setLiked(isLike)
      
      setTimeout(() => {
        const buttonSelector = isLike ? '[data-feedback="like"]' : '[data-feedback="dislike"]'
        const button = document.querySelector(buttonSelector) as HTMLElement
        if (button) {
          const color = isLike ? '#22c55e' : '#ef4444'
          createConfetti(button, color)
        }
      }, 100)
      
      toast.success(isLike ? 'Beğeni kaydedildi!' : 'Geri bildiriminiz kaydedildi.')
    } catch (error: any) {
      toast.error(error.message || 'Değerlendirme gönderilirken bir hata oluştu.')
    } finally {
      setFeedbackLoading(false)
    }
  }

  const handleLikeClick = () => handleFeedback(true)

  const handleDislikeClick = () => {
    if (liked === false) return
    setDislikeModalOpen(true)
  }

  const handleDislikeSubmit = async () => {
    if (!dislikeReason.trim()) {
      toast.error('Lütfen geri bildirim sebebinizi yazın.')
      return
    }
    setDislikeSubmitting(true)
    try {
      await handleFeedback(false, dislikeReason.trim())
      setDislikeModalOpen(false)
      setDislikeReason('')
    } catch (error) {
    } finally {
      setDislikeSubmitting(false)
    }
  }

  const handleDislikeModalClose = () => {
    setDislikeModalOpen(false)
    setDislikeReason('')
  }
  
  const getReliabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getReliabilityDotColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    return 'bg-red-500'
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer)
      toast.success('Cevap panoya kopyalandı!')
    } catch (error) {
      toast.error('Kopyalama başarısız oldu.')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mevzuat GPT Cevabı',
          text: `Soru: ${question}\n\nCevap: ${answer}`
        })
      } catch (error) {}
    } else {
      handleCopy()
      toast.info('Paylaşım desteklenmiyor, cevap panoya kopyalandı.');
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent('Mevzuat GPT Cevabı')
    const body = encodeURIComponent(`Soru: ${question}\n\nCevap: ${answer}\n\n---\nMevzuat GPT ile oluşturuldu`)
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`
    window.open(mailtoUrl, '_blank')
    toast.success('E-posta uygulaması açılıyor...')
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*Mevzuat GPT Cevabı*\n\n*Soru:* ${question}\n\n*Cevap:* ${answer}\n\n---\n_Mevzuat GPT ile oluşturuldu_`)
    const whatsappUrl = `https://wa.me/?text=${text}`
    window.open(whatsappUrl, '_blank')
    toast.success('WhatsApp açılıyor...')
  }

  const cleanAnswerText = (text: string) => {
    return text
      .replace(/\\n\\n/g, '\n\n')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/(#{1,6}\s+[^\n]+)(\n)(?!\n)/g, '$1\n\n')
      .replace(/(#{1,6}\s+[^\n]+)(\n\n+)/g, '$1\n\n')
      .replace(/(^|\n)(#{1,6}\s+[^\n]+)\n(?!\n)/g, '$1$2\n\n')
      .replace(/\n\n+/g, '\n\n')
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/([^\n])\n([ \t]*[-*+]\s+)/g, '$1\n\n$2')
      .replace(/([^\n])\n([ \t]*\d+\.\s+)/g, '$1\n\n$2')
      .replace(/\n([ \t]*[-*+]\s+[^\n]+)\n(?!\n)/g, '\n$1\n')
      .replace(/\n([ \t]*\d+\.\s+[^\n]+)\n(?!\n)/g, '\n$1\n')
      .replace(/\s+\n/g, '\n')
      .replace(/\n\s+/g, '\n')
      .trim()
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Soru Balonu */}
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl bg-blue-600 px-5 py-3.5 text-white shadow-md">
          <p className="text-sm font-medium leading-relaxed">
            {question}
          </p>
          <div className="mt-2 flex items-center justify-end text-[10px] text-blue-100 opacity-80">
            <Clock className="mr-1 h-3 w-3" />
            {timestamp}
          </div>
        </div>
      </div>

      {/* Cevap Kartı */}
      <div className="flex justify-start w-full">
        {/* Sol tarafta ufak bir boşluk veya avatar için yer bırakılabilir, şimdilik direkt kart */}
        <div className="w-full">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            
            {/* İçerik Alanı */}
            <div className="p-5 md:p-8">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Başlıklar
                    h1: ({children}) => (
                      <h1 className="text-2xl font-bold mb-6 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100 flex items-center">
                        <span className="w-1.5 h-6 bg-blue-500 rounded-full mr-3 block"></span>
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-lg font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">
                        {children}
                      </h3>
                    ),
                    h4: ({children}) => <h4 className="text-base font-semibold mt-4 mb-2">{children}</h4>,
                    
                    // Paragraflar
                    p: ({children}) => (
                      <p className="mb-4 leading-7 text-gray-700 dark:text-gray-300 last:mb-0">
                        {children}
                      </p>
                    ),
                    
                    // Listeler
                    ul: ({children}) => (
                      <ul className="my-4 pl-6 list-disc space-y-1.5 marker:text-gray-400 text-gray-700 dark:text-gray-300">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="my-4 pl-6 list-decimal space-y-1.5 marker:text-gray-500 marker:font-medium text-gray-700 dark:text-gray-300">
                        {children}
                      </ol>
                    ),
                    li: ({children}) => (
                      <li className="pl-1 leading-7">
                        {children}
                      </li>
                    ),
                    
                    // Vurgular
                    strong: ({children}) => (
                      <strong className="font-bold text-gray-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10 pl-4 py-2 my-6 italic rounded-r text-gray-700 dark:text-gray-300">
                        {children}
                      </blockquote>
                    ),
                    
                    // Kod Blokları
                    code: ({children, className}) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1.5 py-0.5 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      )
                    },
                    pre: ({children}) => (
                      <pre className="bg-gray-900 text-gray-50 p-4 rounded-lg overflow-x-auto my-6 text-sm font-mono shadow-inner border border-gray-700">
                        {children}
                      </pre>
                    ),
                    
                    // Tablolar
                    table: ({children}) => (
                      <div className="my-6 w-full overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm text-left border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
                        {children}
                      </thead>
                    ),
                    tbody: ({children}) => (
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {children}
                      </tbody>
                    ),
                    tr: ({children}) => (
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({children}) => (
                      <th className="px-4 py-3 whitespace-nowrap">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="px-4 py-3 align-top">
                        {children}
                      </td>
                    ),
                    
                    // Linkler
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-700 dark:hover:text-blue-300 decoration-blue-300 underline-offset-2"
                      >
                        {children}
                      </a>
                    ),

                    // Ayırıcı
                    hr: () => <hr className="my-8 border-gray-100 dark:border-gray-800" />,
                  }}
                >
                  {cleanAnswerText(answer)}
                </ReactMarkdown>
              </div>
            </div>

            {/* Alt Bilgi Çubuğu (Footer) */}
            <div className="bg-gray-50/50 dark:bg-gray-800/30 px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Sol: Metrikler */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button 
                  onClick={() => setCreditInfoModalOpen(true)}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                >
                  <Coins className="h-3.5 w-3.5 mr-1.5 text-yellow-500" />
                  <span>{creditsUsed} Kredi</span>
                </button>
                
                <div className="w-px h-3 bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

                <button 
                  onClick={() => setReliabilityModalOpen(true)}
                  className="group flex items-center space-x-1.5 hover:bg-white dark:hover:bg-gray-800 px-2 py-1 rounded-full transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <div className={`w-2 h-2 rounded-full ${getReliabilityDotColor(actualReliabilityScore)}`}></div>
                  <span className={`font-medium ${getReliabilityColor(actualReliabilityScore)}`}>
                    %{actualReliabilityScore} Güvenirlik
                  </span>
                </button>
                
                <button 
                  onClick={() => setSourcesModalOpen(true)}
                  className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{sources} Kaynak</span>
                </button>

                {typeof responseTimeSeconds === 'number' && (
                  <button
                    onClick={() => setPerformanceModalOpen(true)}
                    className="flex items-center space-x-1.5 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors px-2 py-1"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>{responseTimeSeconds}s</span>
                  </button>
                )}
              </div>
              
              {/* Sağ: Aksiyon Butonları */}
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5 shadow-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLikeClick}
                    disabled={feedbackLoading}
                    data-feedback="like"
                    className={`h-8 w-8 rounded-md transition-colors ${liked === true ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <div className="w-px bg-gray-200 dark:bg-gray-700 my-1 mx-0.5"></div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDislikeClick}
                    disabled={feedbackLoading}
                    data-feedback="dislike"
                    className={`h-8 w-8 rounded-md transition-colors ${liked === false ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="Kopyala"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Paylaş"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={handleEmailShare}>
                        <Mail className="h-4 w-4 mr-2" />
                        E-posta ile Gönder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleWhatsAppShare}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp ile Gönder
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dislike Feedback Modal */}
      <Dialog open={dislikeModalOpen} onOpenChange={handleDislikeModalClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-full">
                <ThumbsDown className="w-4 h-4 text-red-600" />
              </div>
              <span>Geri Bildirim</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Bu cevabı beğenmemenizin sebebini belirtir misiniz? Geri bildiriminiz hizmetimizi geliştirmemize yardımcı olacak.
            </p>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Örn: Cevap eksik bilgi içeriyor, yanlış kaynak kullanılmış, anlaşılır değil..."
                value={dislikeReason}
                onChange={(e) => setDislikeReason(e.target.value)}
                rows={4}
                className="resize-none focus-visible:ring-red-500"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Minimum 10 karakter
                </span>
                <span className="text-xs text-muted-foreground">
                  {dislikeReason.length}/500
                </span>
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleDislikeModalClose}
                className="flex-1"
                disabled={dislikeSubmitting}
              >
                İptal
              </Button>
              <Button
                onClick={handleDislikeSubmit}
                disabled={dislikeSubmitting || dislikeReason.trim().length < 3}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {dislikeSubmitting ? 'Kaydediliyor...' : 'Gönder'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Modals */}
      <ReliabilityModal
        open={reliabilityModalOpen}
        onOpenChange={setReliabilityModalOpen}
        reliabilityData={reliabilityData}
      />
      
      <SourcesModal
        open={sourcesModalOpen}
        onOpenChange={setSourcesModalOpen}
        sources={sources}
        sourcesData={sourcesData}
      />
      
      <PerformanceModal
        open={performanceModalOpen}
        onOpenChange={setPerformanceModalOpen}
        performanceData={performanceData || { search_stats: { total_chunks_found: 0, embedding_time_ms: 0, search_time_ms: 0, generation_time_ms: 0, reliability_time_ms: 0, total_pipeline_time_ms: 0, cache_used: false, rate_limit_remaining: 0, low_confidence: false, confidence_threshold: 0, credits_waived: false } }}
        sourcesData={sourcesData}
      />
      
      <CreditInfoModal
        open={creditInfoModalOpen}
        onOpenChange={setCreditInfoModalOpen}
        creditsUsed={creditsUsed}
      />
      
    </div>
  )
}