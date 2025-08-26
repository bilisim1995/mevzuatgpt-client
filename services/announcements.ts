interface Announcement {
  id: string
  title: string
  content: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  publish_date: string
  created_at: string
}

interface AnnouncementsResponse {
  success: boolean
  data: {
    announcements: Announcement[]
    total: number
    filters: {
      limit: number
      priority: string | null
      include_inactive: boolean
    }
    timestamp: string
  }
}

import { buildApiUrl } from '@/lib/config'

export const announcementsService = {
  async getAnnouncements(params?: {
    limit?: number
    priority?: 'low' | 'normal' | 'high' | 'urgent'
    include_inactive?: boolean
  }): Promise<AnnouncementsResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.include_inactive) searchParams.append('include_inactive', params.include_inactive.toString())

    const url = buildApiUrl(`/api/announcements?${searchParams.toString()}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Duyurular yüklenirken bir hata oluştu.')
    }
    
    return await response.json()
  },

  async getAnnouncementById(id: string): Promise<{ success: boolean; data: Announcement }> {
    const url = buildApiUrl(`/api/announcements/${id}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Duyuru detayı yüklenirken bir hata oluştu.')
    }
    
    return await response.json()
  },

  async getAnnouncementsByPriority(
    priority: 'low' | 'normal' | 'high' | 'urgent',
    limit?: number
  ): Promise<AnnouncementsResponse> {
    const searchParams = new URLSearchParams()
    if (limit) searchParams.append('limit', limit.toString())

    const url = buildApiUrl(`/api/announcements/priority/${priority}?${searchParams.toString()}`)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Öncelikli duyurular yüklenirken bir hata oluştu.')
    }
    
    return await response.json()
  }
}

export type { Announcement, AnnouncementsResponse }