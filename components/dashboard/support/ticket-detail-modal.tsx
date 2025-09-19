"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Send, MessageCircle, User, Shield, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { supportService } from '@/services/support'
import { toast } from 'sonner'

interface TicketDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticketId: string | null
  onTicketUpdated?: () => void
}

interface TicketMessage {
  id: string
  sender_id: string
  sender_name: string
  sender_email: string
  is_admin: boolean
  message: string
  created_at: string
}

interface TicketDetail {
  id: string
  ticket_number: string
  subject: string
  category: string
  priority: string
  status: string
  message_count: number
  messages: TicketMessage[]
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  { value: 'teknik_sorun', label: 'Teknik Sorun' },
  { value: 'hesap_sorunu', label: 'Hesap Sorunu' },
  { value: 'ozellik_talebi', label: 'Özellik Talebi' },
  { value: 'genel_soru', label: 'Genel Soru' },
  { value: 'diger', label: 'Diğer' }
]

const PRIORITIES = [
  { value: 'dusuk', label: 'Düşük' },
  { value: 'orta', label: 'Orta' },
  { value: 'yuksek', label: 'Yüksek' },
  { value: 'acil', label: 'Acil' }
]

export function TicketDetailModal({ open, onOpenChange, ticketId, onTicketUpdated }: TicketDetailModalProps) {
  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (open && ticketId) {
      loadTicketDetail()
    }
  }, [open, ticketId])

  const loadTicketDetail = async () => {
    if (!ticketId) return
    
    setLoading(true)
    try {
      const response = await supportService.getTicketDetail(ticketId)
      setTicket(response)
    } catch (error: any) {
      console.error('Ticket detay yükleme hatası:', error)
      const errorMessage = error.message && error.message !== '[object Object]' 
        ? error.message 
        : 'Sunucudan beklenmedik bir hata alındı. Lütfen daha sonra tekrar deneyin.'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!ticketId || !replyMessage.trim()) {
      toast.error('Lütfen mesajınızı yazın.')
      return
    }

    setSending(true)
    try {
      await supportService.replyToTicket(ticketId, { message: replyMessage.trim() })
      toast.success('Mesajınız gönderildi!')
      setReplyMessage('')
      loadTicketDetail() // Refresh ticket detail
      onTicketUpdated?.() // Refresh ticket list
    } catch (error: any) {
      console.error('Mesaj gönderme hatası:', error)
      toast.error(error.message || 'Mesaj gönderilirken bir hata oluştu.')
    } finally {
      setSending(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'acik':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"><AlertCircle className="w-3 h-3 mr-1" />Açık</Badge>
      case 'cevaplandi':
        return <Badge variant="default" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"><MessageCircle className="w-3 h-3 mr-1" />Cevaplandı</Badge>
      case 'kapatildi':
        return <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"><CheckCircle className="w-3 h-3 mr-1" />Kapatıldı</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'acil': return 'text-red-600 dark:text-red-400'
      case 'yuksek': return 'text-orange-600 dark:text-orange-400'
      case 'orta': return 'text-yellow-600 dark:text-yellow-400'
      case 'dusuk': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            {ticket ? `Ticket #${ticket.ticket_number}` : 'Ticket Detayları'}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 flex-1">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : !ticket ? (
          <div className="text-center py-12 flex-1">
            <MessageCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Ticket bulunamadı.</p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {/* Ticket Header */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50 mb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {ticket.subject}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    {getStatusBadge(ticket.status)}
                    <span className="text-gray-600 dark:text-gray-400">
                      {CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category}
                    </span>
                    <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                      {PRIORITIES.find(p => p.value === ticket.priority)?.label || ticket.priority}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(ticket.created_at)}
                  </div>
                  <div className="text-xs">
                    {ticket.message_count} mesaj
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 flex flex-col min-h-0">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Mesajlar</h4>
              <ScrollArea className="flex-1 border border-gray-200 dark:border-slate-700 rounded-lg">
                <div className="p-4 space-y-4">
                  {ticket.messages.map((message, index) => (
                    <div key={message.id} className="space-y-3">
                      <div className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.is_admin 
                            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-xl' 
                            : 'bg-gray-100 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/30 rounded-xl'
                        }`}>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              message.is_admin 
                                ? 'bg-blue-100 dark:bg-blue-800/50' 
                                : 'bg-gray-200 dark:bg-slate-600'
                            }`}>
                              {message.is_admin ? (
                                <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm font-medium ${
                                  message.is_admin 
                                    ? 'text-blue-700 dark:text-blue-300' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {message.sender_name}
                                  {message.is_admin && (
                                    <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
                                      Destek
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDateShort(message.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {message.message}
                          </div>
                        </div>
                      </div>
                      {index < ticket.messages.length - 1 && (
                        <Separator className="bg-gray-200 dark:bg-slate-700" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Reply Section */}
            {ticket.status !== 'kapatildi' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Yanıt Gönder</h4>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Mesajınızı yazın..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSendReply}
                      disabled={sending || !replyMessage.trim()}
                      className="flex items-center space-x-2 min-w-[120px] rounded-lg"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Gönderiliyor...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Gönder</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {ticket.status === 'kapatildi' && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Bu ticket kapatılmıştır. Yeni mesaj gönderemezsiniz.
                </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}