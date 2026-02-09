"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ThumbsUp, ThumbsDown, Copy, Share2, Clock, Coins, Info, FileText, Mail, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { apiService } from '@/services/api' // SearchStats tipi apiService içinde export ediliyor varsayımıyla
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
  
  // 8 adet küçük konfeti parçacığı oluştur
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
    
    // Rastgele yön ve mesafe
    const angle = (i / 8) * Math.PI * 2
    const distance = 20 + Math.random() * 15
    const endX = centerX + Math.cos(angle) * distance
    const endY = centerY + Math.sin(angle) * distance
    
    // Animasyon
    confetti.animate([
      {
        transform: 'scale(0) translate(0, 0)',
        opacity: 1
      },
      {
        transform: 'scale(1) translate(' + (endX - centerX) + 'px, ' + (endY - centerY) + 'px)',
        opacity: 1,
        offset: 0.7
      },
      {
        transform: 'scale(0.5) translate(' + (endX - centerX) + 'px, ' + (endY - centerY + 10) + 'px)',
        opacity: 0
      }
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

  // Güvenirlik skorunu tutarlı hale getir - önce reliabilityData'dan al, yoksa reliability prop'unu kullan
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
    } catch (error) {
      
    }
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

  const handleLikeClick = () => {
    handleFeedback(true)
  }

  const handleDislikeClick = () => {
    if (liked === false) {
      // Zaten dislike edilmişse, tekrar dislike etme
      return
    }
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
      // Hata zaten handleFeedback içinde handle ediliyor
    } finally {
      setDislikeSubmitting(false)
    }
  }

  const handleDislikeModalClose = () => {
    setDislikeModalOpen(false)
    setDislikeReason('')
  }
  const getReliabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-blue-400'
    return 'text-red-400'
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
      } catch (error) {
        // Paylaşım iptal edildi
      }
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

  // Metni temizle - tüm newline karakterlerini düzgün satır sonlarına çevir
  const cleanAnswerText = (text: string) => {
    return text
      // Önce escape edilmiş karakterleri temizle
      .replace(/\\n\\n/g, '\n\n')  // \\n\\n -> \n\n (escape edilmiş paragraf sonu)
      .replace(/\\n/g, '\n')        // \\n -> \n (escape edilmiş satır sonu)
      
      // BAŞLIK KURALLARI - Başlık satırından sonra mutlaka alt satıra geç
      .replace(/(#{1,6}\s+[^\n]+)(\n)(?!\n)/g, '$1\n\n')  // Başlık sonrası tek satır -> çift satır
      .replace(/(#{1,6}\s+[^\n]+)(\n\n+)/g, '$1\n\n')      // Başlık sonrası çoklu satır -> çift satır
      
      // Başlık karakterlerini temizle (kaldırıldı)
      // .replace(/^#{1,6}\s+/gm, '')  // Başlık karakterlerini sil (#, ##, ###, vb.)
      
      // Sonra normal karakterleri işle
      .replace(/\n\n+/g, '\n\n')    // Çoklu boş satırları tek boş satıra çevir
      .replace(/\n\s*\n/g, '\n\n')  // Satır sonu + boşluk + satır sonu -> tek paragraf sonu
      .replace(/\s+\n/g, '\n')     // Satır sonundaki boşlukları temizle
      .replace(/\n\s+/g, '\n')      // Satır başındaki boşlukları temizle
      .trim()                       // Başta ve sonda boşlukları temizle
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Soru Balonu */}
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[70%] rounded-2xl bg-blue-600 px-4 py-3 text-white shadow-lg">
          <p className="text-sm leading-relaxed">
            {question}
          </p>
          <div className="mt-3 inline-flex items-center justify-end text-[11px] text-blue-100">
            <Clock className="mr-1.5 h-3 w-3" />
            {timestamp}
          </div>
        </div>
      </div>

      {/* Cevap Balonu */}
      <div className="flex justify-start">
        <div className="w-full max-w-[95%] sm:max-w-[85%] ml-3">
          <div className="space-y-4 p-4">
            <div className="relative">
              <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-gray-200/50 dark:border-slate-700/40">
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    skipHtml={false}
                    components={{
                      // Başlıklar
                      h1: ({children}) => (
                        <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                          {children}
                        </h1>
                      ),
                      h2: ({children}) => (
                        <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white border-l-4 border-blue-500 pl-3">
                          {children}
                        </h2>
                      ),
                      h3: ({children}) => (
                        <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-900 dark:text-white border-l-3 border-green-500 pl-3 bg-green-50 dark:bg-green-900/20 py-2 rounded-r-md">
                          {children}
                        </h3>
                      ),
                      h4: ({children}) => (
                        <h4 className="text-base font-medium mb-2 mt-3 text-gray-800 dark:text-gray-200">
                          {children}
                        </h4>
                      ),
                      h5: ({children}) => (
                        <h5 className="text-sm font-medium mb-1 mt-2 text-gray-700 dark:text-gray-300">
                          {children}
                        </h5>
                      ),
                      h6: ({children}) => (
                        <h6 className="text-xs font-medium mb-1 mt-2 text-gray-600 dark:text-gray-400">
                          {children}
                        </h6>
                      ),
                      
                      // Paragraflar
                      p: ({children}) => (
                        <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed text-base">
                          {children}
                        </p>
                      ),
                      
                      // Listeler
                      ul: ({children}) => (
                        <ul className="mb-4 pl-6 space-y-2 text-gray-800 dark:text-gray-200 list-disc marker:text-blue-500 dark:marker:text-blue-400">
                          {children}
                        </ul>
                      ),
                      ol: ({children}) => (
                        <ol className="mb-4 pl-6 space-y-2 text-gray-800 dark:text-gray-200 list-decimal marker:font-bold marker:text-blue-500 dark:marker:text-blue-400">
                          {children}
                        </ol>
                      ),
                      li: ({children}) => (
                        <li className="text-gray-800 dark:text-gray-200 leading-relaxed">
                          {children}
                        </li>
                      ),
                      
                      // Metin formatları
                      strong: ({children}) => (
                        <strong className="font-semibold text-gray-900 dark:text-white">
                          {children}
                        </strong>
                      ),
                      em: ({children}) => (
                        <em className="italic text-gray-700 dark:text-gray-300">
                          {children}
                        </em>
                      ),
                      del: ({children}) => (
                        <del className="line-through text-gray-500 dark:text-gray-500">
                          {children}
                        </del>
                      ),
                      
                      // Kod blokları
                      code: ({children}) => (
                        <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700">
                          {children}
                        </code>
                      ),
                      pre: ({children}) => (
                        <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm font-mono border border-gray-700 dark:border-gray-600">
                          {children}
                        </pre>
                      ),
                      
                      // Blockquote
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-4 py-3 mb-4 rounded-r-lg italic text-gray-700 dark:text-gray-300">
                          {children}
                        </blockquote>
                      ),
                      
                      // Linkler
                      a: ({href, children}) => (
                        <a 
                          href={href} 
                          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 hover:no-underline transition-colors" 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      
                      // Tablolar
                      table: ({children}) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600 rounded-lg">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({children}) => (
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          {children}
                        </thead>
                      ),
                      tbody: ({children}) => (
                        <tbody className="bg-white dark:bg-gray-900">
                          {children}
                        </tbody>
                      ),
                      tr: ({children}) => (
                        <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          {children}
                        </tr>
                      ),
                      th: ({children}) => (
                        <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white">
                          {children}
                        </th>
                      ),
                      td: ({children}) => (
                        <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-800 dark:text-gray-200">
                          {children}
                        </td>
                      ),
                      
                      // Yatay çizgi
                      hr: () => (
                        <hr className="my-6 border-gray-300 dark:border-gray-600" />
                      ),
                      
                      // Satır sonları
                      br: () => <br className="mb-2" />,
                    }}
                  >
                    {cleanAnswerText(answer)}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Alt Bilgiler ve Aksiyonlar */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700/40">
              {/* Mobil: Kredi üstte, butonlar altta */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {/* Kredi Bilgisi + Güvenirlik/Kaynaklar */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3 lg:mb-0">
                  <button 
                    onClick={() => setCreditInfoModalOpen(true)}
                    className="flex items-center text-xs text-gray-900 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    <Coins className="h-3 w-3 mr-1" />
                    <span className="font-light">{creditsUsed} Kredi Kullanıldı</span>
                  </button>
                  
                  <div className="flex items-center space-x-4 text-xs">
                    <button 
                      onClick={() => setReliabilityModalOpen(true)}
                      className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700/30 px-2 py-1 rounded-md transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${getReliabilityDotColor(actualReliabilityScore)}`}></div>
                      <span className={`font-medium ${getReliabilityColor(actualReliabilityScore)}`}>
                        {actualReliabilityScore}% Güvenirlik
                      </span>
                      <Info className="w-3 h-3 text-gray-900 dark:text-gray-400" />
                    </button>
                    
                    <button 
                      onClick={() => setSourcesModalOpen(true)}
                      className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700/30 px-2 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-gray-900 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-400 font-light">Kaynaklar ({sources})</span>
                    </button>
                    {typeof responseTimeSeconds === 'number' && (
                      <button
                        onClick={() => setPerformanceModalOpen(true)}
                        className="flex items-center space-x-2 px-2 py-1 text-xs text-gray-900 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        <span className="font-light">{responseTimeSeconds}s</span>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Butonlar - Geniş ekranda tek satırda */}
                <div className="flex items-center justify-center lg:justify-end space-x-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLikeClick}
                      disabled={feedbackLoading}
                      data-feedback="like"
                      className={`h-8 w-8 p-0 rounded-md ${liked === true ? 'text-green-600 bg-green-100/70 dark:text-green-400 dark:bg-green-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'} ${feedbackLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDislikeClick}
                      disabled={feedbackLoading}
                      data-feedback="dislike"
                      className={`h-8 w-8 p-0 rounded-md ${liked === false ? 'text-red-400 bg-red-900/20' : 'text-gray-600 dark:text-gray-400 hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'} ${feedbackLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="h-5 w-px bg-gray-300 dark:bg-slate-600/40"></div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md font-light"
                      aria-label="Kopyala"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-md font-light"
                          aria-label="Paylaş"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-48 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white"
                      >
                        <DropdownMenuItem 
                          onClick={handleEmailShare}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          E-posta ile Gönder
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleWhatsAppShare}
                          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-900 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
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
      </div>

      {/* Dislike Feedback Modal */}
      <Dialog open={dislikeModalOpen} onOpenChange={handleDislikeModalClose}>
        <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <ThumbsDown className="w-5 h-5 mr-2 text-red-400" />
              Geri Bildirim
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Bu cevabı beğenmemenizin sebebini belirtir misiniz? Geri bildiriminiz hizmetimizi geliştirmemize yardımcı olacak.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Geri bildirim sebebi <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Örn: Cevap eksik bilgi içeriyor, yanlış kaynak kullanılmış, anlaşılır değil..."
                value={dislikeReason}
                onChange={(e) => setDislikeReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dislikeReason.length}/500 karakter
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
                disabled={dislikeSubmitting || !dislikeReason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {dislikeSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
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