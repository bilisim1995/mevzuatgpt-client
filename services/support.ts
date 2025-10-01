interface CreateTicketRequest {
  subject: string
  category: string
  priority: string
  message: string
}

interface CreateTicketResponse {
  success: boolean
  message: string
  ticket: {
    id: string
    ticket_number: string
    subject: string
    category: string
    priority: string
    status: string
    created_at: string
  }
}

interface TicketListResponse {
  tickets: Array<{
    id: string
    ticket_number: string
    subject: string
    category: string
    priority: string
    status: string
    message_count: number
    last_reply_at: string
    created_at: string
  }>
  total_count: number
  has_more: boolean
  page: number
  limit: number
}

interface TicketDetailResponse {
  id: string
  ticket_number: string
  subject: string
  category: string
  priority: string
  status: string
  message_count: number
  messages: Array<{
    id: string
    sender_id: string
    sender_name: string
    sender_email: string
    is_admin: boolean
    message: string
    created_at: string
  }>
  created_at: string
  updated_at: string
}

interface ReplyTicketRequest {
  message: string
}

interface ReplyTicketResponse {
  success: boolean
  message: string
  support_message: {
    id: string
    ticket_id: string
    sender_id: string
    message: string
    created_at: string
  }
}

import { buildApiUrl, API_CONFIG } from '@/lib/config'

export const supportService = {
  async createTicket(data: CreateTicketRequest): Promise<CreateTicketResponse> {
    const token = localStorage.getItem('access_token')
    
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_TICKETS), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    
    const responseText = await response.text()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      let errorMessage = 'Destek talebi oluşturulurken bir hata oluştu.'
      try {
        const errorData = JSON.parse(responseText)
        if (Array.isArray(errorData.detail)) {
          // Handle validation errors array
          errorMessage = errorData.detail.map((err: any) => err.msg || err.message || String(err)).join(', ')
        } else {
          errorMessage = errorData.message || errorData.detail || errorMessage
        }
      } catch (e) {
        errorMessage = responseText || errorMessage
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }
    
    try {
      return JSON.parse(responseText)
    } catch (e) {
   
      throw new Error('Sunucudan geçersiz yanıt alındı.')
    }
  },

  async getTickets(params?: {
    page?: number
    limit?: number
    status?: string
    category?: string
    priority?: string
    search?: string
  }): Promise<TicketListResponse> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.status) searchParams.append('status', params.status)
    if (params?.category) searchParams.append('category', params.category)
    if (params?.priority) searchParams.append('priority', params.priority)
    if (params?.search) searchParams.append('search', params.search)

    const requestUrl = buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_TICKETS}?${searchParams}`)

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    const responseText = await response.text()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      let errorMessage = 'Destek talepleri alınırken bir hata oluştu.'
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorData.detail || errorMessage
      } catch (e) {
        errorMessage = responseText || errorMessage
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }
    
    try {
      return JSON.parse(responseText)
    } catch (e) {
     
      throw new Error('Sunucudan geçersiz yanıt alındı.')
    }
  },

  async getTicketDetail(ticketId: string): Promise<TicketDetailResponse> {
    const token = localStorage.getItem('access_token')
    
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const requestUrl = buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_TICKETS}/${ticketId}`)

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    const responseText = await response.text()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 500) {
        throw new Error('Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.')
      }
      let errorMessage = 'Destek talebi detayı alınırken bir hata oluştu.'
      try {
        const errorData = JSON.parse(responseText)
        if (errorData && typeof errorData === 'object') {
          if (Array.isArray(errorData.detail)) {
            // Handle validation errors array
            errorMessage = errorData.detail.map((err: any) => {
              if (typeof err === 'string') return err
              return err.msg || err.message || 'Bilinmeyen hata'
            }).join(', ')
          } else if (errorData.message && typeof errorData.message === 'string') {
            errorMessage = errorData.message
          } else if (errorData.detail && typeof errorData.detail === 'string') {
            errorMessage = errorData.detail
          }
        } else {
          errorMessage = 'Sunucudan beklenmedik yanıt alındı.'
        }
      } catch (e) {
      
        errorMessage = responseText && responseText.length < 200 ? responseText : 'Sunucu hatası oluştu.'
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }
    
    try {
      return JSON.parse(responseText)
    } catch (e) {
   
      throw new Error('Sunucudan geçersiz yanıt alındı.')
    }
  },

  async replyToTicket(ticketId: string, data: ReplyTicketRequest): Promise<ReplyTicketResponse> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_TICKETS}/${ticketId}/reply`), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Mesaj gönderilirken bir hata oluştu.')
    }
    
    return await response.json()
  }
}