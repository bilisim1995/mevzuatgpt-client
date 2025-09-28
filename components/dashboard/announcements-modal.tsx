"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Calendar, AlertTriangle, Info, CheckCircle, Zap, Bell } from 'lucide-react'
import { announcementsService, Announcement } from '@/services/announcements'
import { toast } from 'sonner'

interface AnnouncementsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRIORITY_CONFIG = {
  urgent: {
    label: 'Acil',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    icon: AlertTriangle,
    iconColor: 'text-red-600 dark:text-red-400'
  },
  high: {
    label: 'Yüksek',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    icon: Zap,
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  normal: {
    label: 'Normal',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  low: {
    label: 'Düşük',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400'
  }
}

export function AnnouncementsModal({ open, onOpenChange }: AnnouncementsModalProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)

  // Modal kapatıldığında tüm etkileri temizle
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Modal kapatıldığında tüm etkileri temizle
      setTimeout(() => {
        // Body'yi tamamen sıfırla
        document.body.style.overflow = ''
        document.body.style.pointerEvents = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.bottom = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.zIndex = ''
        
        document.documentElement.style.overflow = ''
        document.documentElement.style.pointerEvents = ''
        document.documentElement.style.position = ''
        document.documentElement.style.zIndex = ''
        
        // Tüm modal class'larını kaldır
        document.body.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        document.documentElement.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        
        // Tüm modal elementlerini kaldır
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]')
        overlays.forEach(overlay => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
          }
        })
        
        const portals = document.querySelectorAll('[data-radix-portal]')
        portals.forEach(portal => {
          if (portal.querySelector('[data-radix-dialog-content]') && portal.parentNode) {
            portal.parentNode.removeChild(portal)
          }
        })
        
        // Tüm yüksek z-index elementlerini sıfırla
        const allElements = document.querySelectorAll('*')
        allElements.forEach(el => {
          const element = el as HTMLElement
          if (element.style.zIndex && parseInt(element.style.zIndex) > 1000) {
            element.style.zIndex = ''
          }
        })
        
        // Focus'u geri yükle
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement).blur()
        }
        document.body.focus()
        
        // Event listener'ları temizle
        document.removeEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
          }
        })
        
        // Body'yi yeniden aktif hale getir
        document.body.style.pointerEvents = 'auto'
        document.documentElement.style.pointerEvents = 'auto'
        
      }, 200)
    }
    onOpenChange(newOpen)
  }

  useEffect(() => {
    if (open) {
      loadAnnouncements()
    }
  }, [open, priorityFilter])

  const loadAnnouncements = async () => {
    setLoading(true)
    try {
      let response
      if (priorityFilter === 'all') {
        response = await announcementsService.getAnnouncements({ limit: 20 })
      } else {
        response = await announcementsService.getAnnouncementsByPriority(
          priorityFilter as 'low' | 'normal' | 'high' | 'urgent',
          20
        )
      }
      
      if (response.success) {
        setAnnouncements(response.data.announcements)
      }
    } catch (error: any) {
      console.error('Duyuru yükleme hatası:', error)
      toast.error(error.message || 'Duyurular yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
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

  const getPriorityBadge = (priority: string) => {
    const config = PRIORITY_CONFIG[priority as keyof typeof PRIORITY_CONFIG]
    if (!config) return null

    const IconComponent = config.icon

    return (
      <Badge className={`${config.color} flex items-center space-x-1`}>
        <IconComponent className={`w-3 h-3 ${config.iconColor}`} />
        <span>{config.label}</span>
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Megaphone className="w-5 h-5 mr-2" />
                Duyurular
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Sistem duyuruları ve önemli bilgilendirmeler
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenChange(false)}
              className="h-8 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              Kapat
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Filtreler */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Öncelik" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tümü</SelectItem>
                  <SelectItem value="urgent">Acil</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Düşük</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadAnnouncements} size="sm" variant="outline">
                Yenile
              </Button>
            </div>
            {announcements.length > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {announcements.length} duyuru
              </span>
            )}
          </div>

          {/* Duyuru Listesi */}
          <ScrollArea className="h-[60vh]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12">
                <Megaphone className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {priorityFilter === 'all' ? 'Henüz duyuru bulunmuyor.' : 'Bu öncelik seviyesinde duyuru bulunmuyor.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getPriorityBadge(announcement.priority)}
                          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(announcement.publish_date)}
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                          {announcement.title}
                        </h3>
                        <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                          {announcement.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}