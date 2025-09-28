"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Ticket, MessageCircle, Clock, AlertCircle, CheckCircle, Search, Filter } from 'lucide-react'
import { supportService } from '@/services/support'
import { toast } from 'sonner'

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

export function SupportPanel() {
  const [activeTab, setActiveTab] = useState('list')
  const [tickets, setTickets] = useState<TicketItem[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  
  // Yeni ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: '',
    priority: 'orta',
    message: ''
  })

  // Ticket'ları yükle
  const loadTickets = async () => {
    setLoading(true)
    try {
      const response = await supportService.getTickets()
      if (response.tickets) {
        setTickets(response.tickets)
      }
    } catch (error) {
      console.error('Ticket yükleme hatası:', error)
      toast.error('Ticket\'lar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  // Yeni ticket oluştur
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.subject || !newTicket.category || !newTicket.message) {
      toast.error('Lütfen tüm alanları doldurun')
      return
    }

    setCreating(true)
    try {
      const response = await supportService.createTicket({
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message
      })

      if (response.success) {
        toast.success('Destek talebi başarıyla oluşturuldu')
        setNewTicket({ subject: '', category: '', priority: 'orta', message: '' })
        setActiveTab('list')
        loadTickets()
      } else {
        toast.error(response.message || 'Destek talebi oluşturulamadı')
      }
    } catch (error) {
      console.error('Ticket oluşturma hatası:', error)
      toast.error('Destek talebi oluşturulurken bir hata oluştu')
    } finally {
      setCreating(false)
    }
  }

  // Filtrelenmiş ticket'lar
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || !statusFilter || ticket.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || !categoryFilter || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Status badge rengi
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'acik':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'cevaplandi':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'kapatildi':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // Priority badge rengi
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'acil':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'yuksek':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'orta':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'dusuk':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  // Tarih formatı
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    if (activeTab === 'list') {
      loadTickets()
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 border border-gray-200 dark:border-gray-700 mb-4 rounded-xl bg-white dark:bg-gray-800">
          <TabsTrigger value="list" className="text-sm py-2 rounded-lg">
            Destek Taleplerim
          </TabsTrigger>
          <TabsTrigger value="create" className="text-sm py-2 rounded-lg">
            Yeni Talep
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {/* Filtreler */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Ticket ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
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
                <SelectTrigger className="w-32 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
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
            </div>
          </div>

          {/* Ticket Listesi */}
          <div className="max-h-[60vh] overflow-y-auto space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Henüz destek talebiniz bulunmuyor</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-gray-800/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-sm text-gray-600 dark:text-gray-400">
                          #{ticket.ticket_number}
                        </span>
                        <Badge className={getStatusBadgeColor(ticket.status)}>
                          {STATUSES.find(s => s.value === ticket.status)?.label}
                        </Badge>
                        <Badge className={getPriorityBadgeColor(ticket.priority)}>
                          {PRIORITIES.find(p => p.value === ticket.priority)?.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {ticket.subject}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {CATEGORIES.find(c => c.value === ticket.category)?.label}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {ticket.message_count} mesaj
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(ticket.last_reply_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="create" className="space-y-4">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Konu *</Label>
              <Input
                id="subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Destek talebinizin konusunu yazın"
                required
                className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Kategori *</Label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
                  required
                >
                  <SelectTrigger className="h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
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
              
              <div>
                <Label htmlFor="priority" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Öncelik</Label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}
                >
                  <SelectTrigger className="h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
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
            
            <div>
              <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mesaj *</Label>
              <Textarea
                id="message"
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Sorununuzu detaylı olarak açıklayın"
                rows={6}
                required
                className="border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-6"
              >
                {creating ? 'Oluşturuluyor...' : 'Destek Talebi Oluştur'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab('list')}
                className="rounded-xl h-10 px-6 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                İptal
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
