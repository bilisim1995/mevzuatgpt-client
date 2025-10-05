// INTERFACES
interface AskResponse {
  success: boolean
  timestamp: string
  data: {
    query: string
    answer: string
    search_log_id: string
    confidence_score: number
    sources: any[]
    institution_filter: string | null
    search_stats: {
      total_chunks_found: number
      embedding_time_ms: number
      search_time_ms: number
      generation_time_ms: number
      reliability_time_ms: number
      total_pipeline_time_ms: number
      cache_used: boolean
      rate_limit_remaining: number
    }
    llm_stats: {
      model_used: string
      prompt_tokens: number
      response_tokens: number
    }
    confidence_breakdown: {
      overall_score: number
      explanation: string
      criteria: {
        source_reliability: {
          score: number
          weight: number
          description: string
          details: string[]
        }
        content_consistency: {
          score: number
          weight: number
          description: string
          details: string[]
        }
        technical_accuracy: {
          score: number
          weight: number
          description: string
          details: string[]
        }
        currency: {
          score: number
          weight: number
          description: string
          details: string[]
        }
      }
      score_ranges: {
        high: {
          min: number
          max: number
          desc: string
        }
        medium: {
          min: number
          max: number
          desc: string
        }
        low: {
          min: number
          max: number
          desc: string
        }
      }
    }
    credit_info: {
      credits_used: number
      remaining_balance: number
    }
  }
}

export interface FeedbackResponse {
  success: boolean
  message: string
  feedback: {
    id: string
    user_id: string
    search_log_id: string
    query_text: string
    answer_text: string
    feedback_type: string
    feedback_comment?: string
    created_at: string
    updated_at?: string
  }
}

export interface UserFeedback {
  id: string
  search_log_id: string
  query: string
  answer: string
  feedback_type: string
  feedback_comment?: string
  created_at: string
  updated_at?: string
}

export interface FeedbackHistoryResponse {
  success: boolean
  message: string
  feedback_list: UserFeedback[]
  total_count: number
  has_more: boolean
  page: number
  limit: number
}

export interface ExistingFeedback {
  id: string
  user_id: string
  search_log_id: string
  query_text: string
  answer_text: string
  feedback_type: string
  feedback_comment?: string
  created_at: string
  updated_at?: string
}

// ================== DÜZELTME BURADA ==================
export interface SearchHistoryItem {
  id: string
  query: string
  response: string | null // DÜZELTME: API'den null gelebileceği için bu alan güncellendi.
  sources: Array<{
    document_id: string
    title: string
    institution: string
    similarity_score: number
    pdf_url: string
  }>
  reliability_score: number
  credits_used: number
  institution_filter: string | null
  results_count: number
  execution_time: number
  created_at: string
}
// ======================================================

export interface SearchHistoryResponse {
  success: boolean
  data: {
    items: SearchHistoryItem[]
    total_count: number
    page: number
    limit: number
    has_more: boolean
  }
}

export interface SearchHistoryStats {
  success: boolean
  data: {
    total_searches: number
    total_credits_used: number
    average_reliability: number
    most_used_institution: string
    searches_this_month: number
    searches_today: number
  }
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  ad?: string
  soyad?: string
  meslek?: string
  calistigi_yer?: string
  role: string
  created_at: string
  updated_at?: string
}

export interface ProfileResponse {
  success: boolean
  data: UserProfile
}

export interface UpdateProfileRequest {
  full_name?: string
  ad?: string
  soyad?: string
  meslek?: string
  calistigi_yer?: string
}

export interface UpdateProfileResponse {
  success: boolean
  data: UserProfile
}

import { buildApiUrl, API_CONFIG } from '@/lib/config'

export interface SearchStats {
  total_chunks_found: number
  embedding_time_ms: number
  search_time_ms: number
  generation_time_ms: number
  reliability_time_ms: number
  total_pipeline_time_ms: number
  cache_used: boolean
  rate_limit_remaining: number
}

// ================== DÜZELTME BURADA ==================
// HATA DÜZELTMESİ: 'import' ifadesi dosyanın en üst seviyesine taşındı.
import { maintenanceService } from './maintenance'
// ======================================================

// API SERVICE
export const apiService = {
  async getUserPaymentSettings(): Promise<{
    success: boolean
    payment_mode: 'sandbox' | 'production'
    is_active: boolean
    description?: string
  }> {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_PAYMENT_SETTINGS), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      throw new Error('Ödeme ayarları alınırken bir hata oluştu.')
    }

    return await response.json()
  },
  async askQuestion(query: string, filters?: any): Promise<AskResponse> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const requestBody: any = { query }
    
    // Filtreler varsa değerlerini kontrol et ve gönder
    if (filters) {
      
      // Institution filter - boş ise null gönder
      if (filters.institution_filter && filters.institution_filter !== "all") {
        requestBody.institution_filter = filters.institution_filter
      } else {
        requestBody.institution_filter = null
      }
      
      // Diğer filtreler
      // Limit - kullanıcının seçtiği değeri kullan
      requestBody.limit = filters.limit || 5
      
      // Similarity threshold - kullanıcının seçtiği değeri kullan
      requestBody.similarity_threshold = filters.similarity_threshold || 0.5
      
      // Use cache - kullanıcının seçtiği değeri kullan
      requestBody.use_cache = filters.use_cache !== undefined ? filters.use_cache : false
    } else {
      // Filtre yoksa varsayılan değerleri kullan
      requestBody.institution_filter = null
      requestBody.limit = 5
      requestBody.similarity_threshold = 0.5
      requestBody.use_cache = false
    }

  
    
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_ASK), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
    
  
    
    const responseText = await response.text()
   
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      let errorMessage = 'Soru sorulurken bir hata oluştu.'
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorData.detail || errorMessage
      } catch (e) {
        errorMessage = responseText || errorMessage
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }
    
    try {
      const result = JSON.parse(responseText)
      
     
      
      // Başarılı cevap sonrası bakım durumu kontrolü
      try {
        const maintenanceStatus = await maintenanceService.checkMaintenanceStatus()
        if (maintenanceStatus.success && maintenanceStatus.data.is_enabled) {
          // Bakım aktifse 2 saniye sonra yönlendir (kullanıcı cevabı görebilsin)
          setTimeout(() => {
            window.location.href = '/maintenance'
          }, 2000)
        }
      } catch (maintenanceError) {
        
      }
      
      return result
    } catch (e) {
     
      throw new Error('Sunucudan geçersiz yanıt alındı.')
    }
  },

  async getUserCredits(): Promise<{
    success: boolean
    data: {
      current_balance: number
      is_admin: boolean
      unlimited: boolean
    }
  }> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_CREDITS), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      throw new Error('Kredi bilgileri alınırken bir hata oluştu.')
    }
    
    return await response.json()
  },

  async sendFeedback(searchLogId: string, isLike: boolean, comment?: string): Promise<FeedbackResponse> {
    const token = localStorage.getItem('access_token')
    
   
    
    if (!token) {
     
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    // searchLogId validation
    if (!searchLogId || searchLogId === 'undefined' || searchLogId === 'null') {
      
      throw new Error('Geçersiz arama ID\'si. Lütfen sayfayı yenileyin.')
    }

    const requestBody = {
      "search_log_id": searchLogId,
      "feedback_type": isLike ? "like" : "dislike",
      "feedback_comment": comment || null
    }
    
  
    
    const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_FEEDBACK), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
    
  
    
    const responseText = await response.text()
   
    
    let data
    try {
      data = JSON.parse(responseText)
   
    } catch (parseError) {
  
      if (response.ok) {
        throw new Error('Sunucudan geçersiz JSON yanıtı alındı.')
      }
      // If response is not ok, we can use the raw text as a fallback error message
      data = { detail: responseText };
    }
    
    if (!response.ok) {
       
      if (response.status === 401) {
      
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 422) {
        
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: any) => err.msg || err.message || String(err)).join(', ')
         
          throw new Error(`Doğrulama hatası: ${errorMessages}`)
        }
      }
      if (response.status === 404) {
      
        throw new Error('Belirtilen sorgu bulunamadı veya size ait değil.')
      }
      const errorMessage = data?.message || data?.detail || `Değerlendirme gönderilirken bir hata oluştu. (HTTP ${response.status})`
    
      throw new Error(errorMessage)
    }
    
   
    return data
  },

  async checkFeedback(searchLogId: string): Promise<ExistingFeedback | null> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_FEEDBACK_SEARCH}/${searchLogId}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (response.status === 404) {
      return null // Feedback bulunamadı
    }
    
    if (!response.ok) {
      
      return null
    }
    
    const responseText = await response.text()
    
    // Eğer response null ise (feedback yoksa) - API artık null döndürüyor
    if (responseText === 'null' || responseText.trim() === '' || responseText.trim() === 'null') {
      return null
    }
    
    try {
      const data = JSON.parse(responseText)
      return data || null
    } catch (error) {
     
      return null
    }
  },

  async deleteFeedback(feedbackId: string): Promise<{ message: string }> {
    const token = localStorage.getItem('access_token')
    

    
    if (!token) {
      
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    // feedbackId validation
    if (!feedbackId || feedbackId === 'undefined' || feedbackId === 'null') {
 
      throw new Error('Geçersiz feedback ID\'si.')
    }

    
    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_FEEDBACK_DELETE}/${feedbackId}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    

    
    const responseText = await response.text()
   
    
    let data
    try {
      data = JSON.parse(responseText)
     
    } catch (parseError) {
     
  
      if (response.ok) {
        throw new Error('Sunucudan geçersiz JSON yanıtı alındı.')
      }
      data = { detail: responseText };
    }
    
    if (!response.ok) {
       
      if (response.status === 401) {
       
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 404) {
       
        throw new Error('Belirtilen feedback bulunamadı.')
      }
      const errorMessage = data?.message || data?.detail || `Feedback silinirken bir hata oluştu. (HTTP ${response.status})`
      
      throw new Error(errorMessage)
    }
    
 
    return data
  },

  async getFeedbackHistory(page: number = 1, limit: number = 20): Promise<FeedbackHistoryResponse> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const response = await fetch(buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_FEEDBACK_HISTORY}?page=${page}&limit=${limit}`), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 403) {
        throw new Error('Bu işlem için yetkiniz bulunmuyor.')
      }
      if (response.status === 500) {
        throw new Error('Sunucu hatası oluştu. Lütfen tekrar deneyin.')
      }
      const errorMessage = data?.message || data?.detail || `Değerlendirme geçmişi alınırken bir hata oluştu. (HTTP ${response.status})`
      throw new Error(errorMessage)
    }
    
    return {
      success: true,
      message: 'Başarılı',
      feedback_list: data.feedback_list || [],
      total_count: data.total_count || 0,
      has_more: data.has_more || false,
      page: data.page || page,
      limit: data.limit || limit
    }
  },

  async getSearchHistory(params?: {
    page?: number
    limit?: number
    institution?: string
  }): Promise<SearchHistoryResponse> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const searchParams = new URLSearchParams()
    searchParams.append('page', (params?.page || 1).toString())
    searchParams.append('limit', (params?.limit || 10).toString())
    if (params?.institution && params.institution !== 'all') {
      searchParams.append('institution', params.institution)
    }

    const url = buildApiUrl(`${API_CONFIG.ENDPOINTS.USER_SEARCH_HISTORY}?${searchParams.toString()}`)

    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
   
    
    const data = await response.json()
 
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 404) {
        return {
          success: true,
          data: {
            items: [],
            total_count: 0,
            page: params?.page || 1,
            limit: params?.limit || 20,
            has_more: false
          }
        }
      }
      const errorMessage = data?.message || data?.detail || data?.error || `Sorgu geçmişi alınırken bir hata oluştu. (HTTP ${response.status})`
      throw new Error(errorMessage)
    }
    
    return data
  },

  async getSearchHistoryStats(): Promise<SearchHistoryStats> {
    const token = localStorage.getItem('access_token')
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_SEARCH_HISTORY_STATS)
   
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
  
    const data = await response.json()
  
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 404) {
        return {
          success: true,
          data: {
            total_searches: 0,
            total_credits_used: 0,
            average_reliability: 0,
            most_used_institution: "Henüz arama yapılmamış",
            searches_this_month: 0,
            searches_today: 0
          }
        }
      }
      const errorMessage = data?.message || data?.detail || data?.error || `İstatistikler alınırken bir hata oluştu. (HTTP ${response.status})`
      throw new Error(errorMessage)
    }
    
    return data
  },

  async getUserProfile(): Promise<ProfileResponse> {
    const token = localStorage.getItem('access_token')
    
    
    if (!token) {
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE)
 
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
 
    
    const responseText = await response.text()
 
    
    let data
    try {
      data = JSON.parse(responseText)
   
    } catch (parseError) {
   
      throw new Error('Sunucudan geçersiz JSON yanıtı alındı.')
    }
    
    if (!response.ok) {
      
      if (response.status === 401) {
      
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      const errorMessage = data?.message || data?.detail || data?.error || `Profil bilgileri alınırken bir hata oluştu. (HTTP ${response.status})`
     
      throw new Error(errorMessage)
    }
    
   
    return { success: true, data: data }
  },

  async updateUserProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    const token = localStorage.getItem('access_token')
    
  
    
    if (!token) {
      
      throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
    }

    const url = buildApiUrl(API_CONFIG.ENDPOINTS.USER_PROFILE)
   
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    })
    
  
    
    const responseText = await response.text()
  
    
    let data
    try {
      data = JSON.parse(responseText)
     
    } catch (parseError) {
     
      throw new Error('Sunucudan geçersiz JSON yanıtı alındı.')
    }
    
    if (!response.ok) {
      
      if (response.status === 401) {
       
        throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
      }
      if (response.status === 422) {
       
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: any) => err.msg || err.message || String(err)).join(', ')
         
          throw new Error(`Doğrulama hatası: ${errorMessages}`)
        }
      }
      const errorMessage = data?.message || data?.detail || data?.error || `Profil güncellenirken bir hata oluştu. (HTTP ${response.status})`
     
      throw new Error(errorMessage)
    }
    
  
    return { success: true, data: data }
  },
}