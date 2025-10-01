"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Megaphone, Calendar, AlertTriangle, Info, CheckCircle, Zap, Bell } from 'lucide-react'
import { announcementsService, Announcement } from '@/services/announcements'
import { toast } from 'sonner'

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

export function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    loadAnnouncements()
  }, [priorityFilter])

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
      <Badge className={`${config.color} flex items-center space-x-1 rounded-xl`}>
        <IconComponent className={`w-3 h-3 ${config.iconColor}`} />
        <span>{config.label}</span>
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtreler */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40 h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800">
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
          <Button 
            onClick={loadAnnouncements} 
            size="sm" 
            variant="outline"
            className="h-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
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
      <div className="max-h-[60vh] overflow-y-auto">
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
                className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 border border-gray-200 dark:border-slate-700/50"
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
      </div>
    </div>
  )
}
