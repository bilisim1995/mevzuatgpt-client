interface MaintenanceStatus {
  is_enabled: boolean
  title: string
  message: string
  start_time: string | null
  end_time: string | null
}

interface MaintenanceResponse {
  success: boolean
  timestamp: string
  data: MaintenanceStatus
}

import { buildApiUrl, API_CONFIG } from '@/lib/config'

export const maintenanceService = {
  async checkMaintenanceStatus(): Promise<MaintenanceResponse> {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.MAINTENANCE_STATUS), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        // Hata durumunda varsayılan yanıt döndür
        return {
          success: false,
          timestamp: new Date().toISOString(),
          data: {
            is_enabled: false,
            title: 'Sistem Durumu Bilinmiyor',
            message: 'Sistem durumu kontrol edilemiyor, lütfen daha sonra tekrar deneyin.',
            start_time: null,
            end_time: null
          }
        }
      }
      
      return await response.json()
    } catch (error) {
      // Don't log fetch errors to console to avoid cluttering
      console.warn('API sunucusuna bağlanılamıyor, offline modda çalışılıyor')
      // Hata durumunda varsayılan yanıt döndür
      return {
        success: false,
        timestamp: new Date().toISOString(),
        data: {
          is_enabled: false,
          title: 'Sistem Durumu Bilinmiyor',
          message: 'Sistem durumu kontrol edilemiyor, lütfen daha sonra tekrar deneyin.',
          start_time: null,
          end_time: null
        }
      }
    }
  }
}