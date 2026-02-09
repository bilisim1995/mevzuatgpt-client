"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThumbsUp, ThumbsDown, Copy, Share2, Clock, Coins, Info, FileText, Mail, MessageCircle, Sparkles, Bot, ChevronRight, Shield, Zap } from 'lucide-react'
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

  // Güvenirlik skorunu tutarlı hale getir
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

  // Metni temizle ve düzenle
  const cleanAnswerText = (text: string) => {
    return text
      .replace(/\\n\\n/g, '\n\n')
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      // Başlıkları düzenle
      .replace(/(#{1,6}\s+[^\n]+)(\n)(?!\n)/g, '$1\n\n')
      .replace(/(#{1,6}\s+[^\n]+)(\n\n+)/g, '$1\n\n')
      .replace(/(^|\n)(#{1,6}\s+[^\n]+)\n(?!\n)/g, '$1$2\n\n')
      
      // İPUCU ve NOT düzenlemesi: İpucu kelimesini yakala ve kesinlikle alt satıra indir
  
      
      // Liste maddelerini düzenle (Maddeler arası boşlukları garantiye al)
      .replace(/(\n\d+\.\s+)/g, '\n\n$1') // Numaralı maddelerden önce boş satır
      .replace(/(\n[-*+]\s+)/g, '\n\n$1') // Noktalı maddelerden önce boş satır
      
      // Genel temizlik
      .replace(/\n\n+/g, '\n\n')
      .replace(/\n\s*\n/g, '\n\n')
      .trim()
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Soru Balonu */}
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[75%]">
          <div className="relative rounded-2xl rounded-tr-md bg-gradient-to-br from-blue-600 to-blue-700 px-5 py-4 text-white shadow-lg shadow-blue-500/10">
            <p className="text-[15px] font-medium leading-relaxed">
              {question}
            </p>
            <div className="mt-2.5 flex items-center justify-end text-[11px] text-blue-200/80">
              <Clock className="mr-1 h-3 w-3" />
              {timestamp}
            </div>
          </div>
        </div>
      </div>

      {/* Cevap Kartı */}
      <div className="flex justify-start w-full">
        <div className="w-full">
          <div className="group bg-white dark:bg-gray-900/80 rounded-2xl rounded-tl-md border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
            
            {/* Üst Bar - AI Göstergesi */}
            <div className="flex items-center gap-2.5 px-5 pt-4 pb-2">
              
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
                  AI
                </span>
          
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-500">İlBilge hata yapabilir. Lütfen cevabı kontrol ediniz.</span>
               
              </div>
            </div>

            {/* İçerik Alanı */}
            <div className="px-5 pb-2 md:px-8 md:pb-4">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Başlıklar
                    h1: ({children}) => (
                      <h1 className="text-[22px] font-bold mb-5 pb-3 border-b border-gray-200 dark:border-gray-700/60 text-gray-900 dark:text-gray-50 first:mt-0 mt-8">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-lg font-bold mt-8 mb-4 text-gray-900 dark:text-gray-50 flex items-center gap-3">
                        <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full shrink-0"></span>
                        <span>{children}</span>
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-base font-semibold mt-6 mb-3 text-gray-800 dark:text-gray-200">
                        {children}
                      </h3>
                    ),
                    h4: ({children}) => (
                      <h4 className="text-sm font-semibold mt-5 mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        {children}
                      </h4>
                    ),
                    
                    // Paragraflar
                    p: ({children}) => (
                      <p className="mb-4 leading-[1.8] text-[15px] text-gray-700 dark:text-gray-300 last:mb-0">
                        {children}
                      </p>
                    ),
                    
                    // Numaralı Liste (OL)
                    ol: ({children}) => (
                      <ol className="my-4 ml-1 pl-5 list-decimal space-y-3 marker:text-blue-500 dark:marker:text-blue-400 marker:font-semibold text-gray-700 dark:text-gray-300">
                        {children}
                      </ol>
                    ),
                    
                    // Noktalı Liste (UL)
                    ul: ({children}) => (
                      <ul className="my-4 ml-1 pl-5 list-disc space-y-2.5 marker:text-gray-400 dark:marker:text-gray-500 text-gray-700 dark:text-gray-300">
                        {children}
                      </ul>
                    ),
                    
                    // Liste Elemanları (LI)
                    li: ({children}) => (
                      <li className="pl-1.5 leading-[1.8] text-[15px]">
                        {children}
                      </li>
                    ),
                    
                    // Vurgular
                    strong: ({children}) => (
                      <strong className="font-semibold text-gray-900 dark:text-white">
                        {children}
                      </strong>
                    ),
                    em: ({children}) => (
                      <em className="italic text-gray-600 dark:text-gray-400">{children}</em>
                    ),
                    blockquote: ({children}) => (
                      <blockquote className="relative border-l-[3px] border-blue-400 dark:border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 pl-4 pr-4 py-3 my-5 rounded-r-lg text-gray-600 dark:text-gray-400 text-[14px] italic">
                        {children}
                      </blockquote>
                    ),
                    
                    // Kod Blokları
                    code: ({children, className}) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-gray-200/80 dark:border-gray-700">
                          {children}
                        </code>
                      ) : (
                        <code className={className}>{children}</code>
                      )
                    },
                    pre: ({children}) => (
                      <pre className="bg-gray-950 text-gray-100 p-5 rounded-xl overflow-x-auto my-5 text-[13px] font-mono ring-1 ring-gray-800">
                        {children}
                      </pre>
                    ),
                    
                    // Tablolar
                    table: ({children}) => (
                      <div className="my-5 w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700/80 shadow-sm">
                        <table className="w-full text-sm text-left border-collapse">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider font-medium border-b border-gray-200 dark:border-gray-700">
                        {children}
                      </thead>
                    ),
                    tbody: ({children}) => (
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/50">
                        {children}
                      </tbody>
                    ),
                    tr: ({children}) => (
                      <tr className="hover:bg-gray-50/80 dark:hover:bg-gray-800/30 transition-colors">
                        {children}
                      </tr>
                    ),
                    th: ({children}) => (
                      <th className="px-4 py-3 whitespace-nowrap font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="px-4 py-3 align-top text-gray-700 dark:text-gray-300">
                        {children}
                      </td>
                    ),
                    
                    // Linkler
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 font-medium underline decoration-blue-300/50 dark:decoration-blue-500/30 underline-offset-2 hover:decoration-blue-500 dark:hover:decoration-blue-400 transition-colors"
                      >
                        {children}
                      </a>
                    ),

                    // Ayırıcı
                    hr: () => <hr className="my-8 border-gray-150 dark:border-gray-800" />,
                  }}
                >
                  {cleanAnswerText(answer)}
                </ReactMarkdown>
              </div>
            </div>

            {/* Alt Bilgi Çubuğu (Footer) */}
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-800/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Sol: Metrikler */}
                <div className="flex bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200/80 dark:border-gray-700/60 p-0.5 shadow-sm text-xs">
                  <button 
                    onClick={() => setCreditInfoModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200"
                  >
                    <Coins className="h-3 w-3" />
                    <span className="font-medium">{creditsUsed} Kredi</span>
                  </button>
                  <div className="w-px bg-gray-200 dark:bg-gray-700/60 my-1.5"></div>
                  <button 
                    onClick={() => setReliabilityModalOpen(true)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                      actualReliabilityScore >= 80 
                        ? 'text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : actualReliabilityScore >= 60 
                          ? 'text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                          : 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Shield className="h-3 w-3" />
                    <span className="font-medium">%{actualReliabilityScore}</span>
                  </button>
                  <div className="w-px bg-gray-200 dark:bg-gray-700/60 my-1.5"></div>
                  <button 
                    onClick={() => setSourcesModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
                  >
                    <FileText className="h-3 w-3" />
                    <span className="font-medium">{sources} Kaynak</span>
                  </button>
                  {typeof responseTimeSeconds === 'number' && (
                    <>
                      <div className="w-px bg-gray-200 dark:bg-gray-700/60 my-1.5"></div>
                      <button
                        onClick={() => setPerformanceModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/40 transition-all duration-200"
                      >
                        <Zap className="h-3 w-3" />
                        <span className="font-medium">{responseTimeSeconds}s</span>
                      </button>
                    </>
                  )}
                </div>
                
                {/* Sağ: Aksiyon Butonları */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <div className="flex bg-white dark:bg-gray-800/80 rounded-lg border border-gray-200/80 dark:border-gray-700/60 p-0.5 shadow-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLikeClick}
                      disabled={feedbackLoading}
                      data-feedback="like"
                      className={`h-8 w-8 rounded-md transition-all duration-200 ${liked === true ? 'text-green-600 bg-green-50 dark:bg-green-900/30 shadow-sm' : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'}`}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </Button>
                    <div className="w-px bg-gray-200 dark:bg-gray-700/60 my-1.5"></div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDislikeClick}
                      disabled={feedbackLoading}
                      data-feedback="dislike"
                      className={`h-8 w-8 rounded-md transition-all duration-200 ${liked === false ? 'text-red-600 bg-red-50 dark:bg-red-900/30 shadow-sm' : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="w-px h-5 bg-gray-200 dark:bg-gray-700/50 mx-0.5 hidden sm:block"></div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
                    title="Kopyala"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-all"
                        title="Paylaş"
                      >
                        <Share2 className="h-3.5 w-3.5" />
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