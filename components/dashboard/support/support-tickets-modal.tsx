"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Ticket, MessageCircle, Clock, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react'
import { supportService } from '@/services/support'
import { toast } from 'sonner'
import { TicketDetailModal } from './ticket-detail-modal'

interface SupportTicketsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface TicketItem {
  id: string
  ticket_number: string
  subject: string
  category: string
  priority: string
  status: string
  message_count: number
  last_reply_at: string
  created_at: string
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

const STATUSES = [
  { value: 'acik', label: 'Açık' },
  { value: 'cevaplandi', label: 'Cevaplandı' },
  { value: 'kapatildi', label: 'Kapatıldı' }
]

export function SupportTicketsModal({ open, onOpenChange }: SupportTicketsModalProps) {
  const [activeTab, setActiveTab] = useState('list')
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  
  // Yeni ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'orta',
    message: ''
  })

  useEffect(() => {
    if (open && activeTab === 'list') {
      loadTickets()
    }
  }, [open, activeTab])

  const loadTickets = async () => {
    setLoading(true)
    try {
      const response = await supportService.getTickets({
        page: 1,
        limit: 20,
        status: statusFilter === 'all' ? undefined : statusFilter || undefined,
        category: categoryFilter === 'all' ? undefined : categoryFilter || undefined,
        search: searchTerm || undefined
      })
      setTickets(response.tickets)
    } catch (error: any) {
      console.error('Ticket yükleme hatası:', error)
      toast.error(error.message || 'Destek talepleri yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.category || !newTicket.message.trim()) {
      toast.error('Lütfen tüm gerekli alanları doldurun.')
      return
    }

    if (newTicket.subject.trim().length < 5) {
      toast.error('Konu en az 5 karakter olmalıdır.')
      return
    }

    setCreating(true)
    try {
      await supportService.createTicket(newTicket)
      toast.success('Destek talebiniz başarıyla oluşturuldu!')
      setNewTicket({ subject: '', category: '', priority: 'orta', message: '' })
      setActiveTab('list')
      loadTickets()
    } catch (error: any) {
      console.error('Ticket oluşturma hatası:', error)
      toast.error(error.message || 'Destek talebi oluşturulurken bir hata oluştu.')
    } finally {
      setCreating(false)
    }
  }

  const handleTicketClick = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setDetailModalOpen(true)
  }

  const handleDetailModalClose = () => {
    setDetailModalOpen(false)
    setSelectedTicketId(null)
  }

  const handleTicketUpdated = () => {
    loadTickets() // Refresh ticket list when ticket is updated
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Ticket className="w-5 h-5 mr-2" />
            Destek Talepleri
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-slate-800">
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <Ticket className="w-4 h-4" />
              <span>Taleplerim</span>
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Yeni Talep</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Filtreler */}
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="Konu içinde ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {STATUSES.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36 h-9">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={loadTickets} size="sm" variant="outline" className="h-9">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {/* Ticket Listesi */}
            <ScrollArea className="h-96">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12">
                  <Ticket className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Henüz destek talebiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {ticket.ticket_number}
                            </span>
                            {getStatusBadge(ticket.status)}
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                            {ticket.subject}
                          </h4>
                          <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                            <span className="capitalize">
                              {CATEGORIES.find(c => c.value === ticket.category)?.label || ticket.category}
                            </span>
                            <span className={`capitalize font-medium ${getPriorityColor(ticket.priority)}`}>
                              {PRIORITIES.find(p => p.value === ticket.priority)?.label || ticket.priority}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="w-3 h-3 mr-1" />
                              {ticket.message_count} mesaj
                            </span>
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center mb-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(ticket.created_at)}
                          </div>
                          {ticket.last_reply_at && (
                            <div className="text-green-600 dark:text-green-400">
                              Son: {formatDate(ticket.last_reply_at)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Konu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    placeholder="Sorun veya talebinizi özetleyin"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newTicket.category}
                      onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Öncelik</Label>
                    <Select
                      value={newTicket.priority}
                      onValueChange={(value) => setNewTicket(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITIES.map(priority => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Mesaj <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Sorununuzu veya talebinizi detaylı olarak açıklayın..."
                    rows={8}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  />
                </div>

                <Button
                  onClick={handleCreateTicket}
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Destek Talebi Oluştur
                    </>
                  )}
                </Button>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Ticket Detail Modal */}
        <TicketDetailModal
          open={detailModalOpen}
          onOpenChange={handleDetailModalClose}
          ticketId={selectedTicketId}
          onTicketUpdated={handleTicketUpdated}
        />
      </DialogContent>
    </Dialog>
  )
}