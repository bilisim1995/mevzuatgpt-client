interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: {
    id: string
    email: string
    full_name: string
    ad?: string
    soyad?: string
    meslek?: string
    calistigi_yer?: string
    role: string
    created_at: string
    updated_at: string | null
  }
}

interface RegisterResponse {
  message: string
  user: {
    id: string
    email: string
    full_name: string
    role: string
    created_at: string
  }
}

import { maintenanceService } from './maintenance'
import { buildApiUrl, API_CONFIG } from '@/lib/config'

export const authService = {
  translateErrorMessage(message: string): string {
    const translations: { [key: string]: string } = {
      'String should have at least 8 characters': 'Şifre en az 8 karakter olmalıdır',
      'String should have at most 50 characters': 'En fazla 50 karakter olmalıdır',
      'Invalid email format': 'Geçersiz e-posta formatı',
      'Email already exists': 'Bu e-posta adresi zaten kullanılıyor',
      'Passwords do not match': 'Şifreler eşleşmiyor',
      'Invalid password': 'Geçersiz şifre',
      'User not found': 'Kullanıcı bulunamadı',
      'Invalid credentials': 'Geçersiz kimlik bilgileri',
      'Account is disabled': 'Hesap devre dışı',
      'Too many login attempts': 'Çok fazla giriş denemesi',
      'Token expired': 'Token süresi dolmuş',
      'Invalid token': 'Geçersiz token',
      'Field required': 'Bu alan zorunludur',
      'Invalid input': 'Geçersiz giriş',
      'Server error': 'Sunucu hatası',
      'Network error': 'Ağ hatası',
      'Timeout': 'Zaman aşımı'
    }
    
    // Tam eşleşme kontrolü
    if (translations[message]) {
      return translations[message]
    }
    
    // Kısmi eşleşme kontrolü
    for (const [key, value] of Object.entries(translations)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value
      }
    }
    
    // Eşleşme bulunamazsa orijinal mesajı döndür
    return message
  },
  async login(data: { email: string; password: string; turnstile_token?: string }): Promise<LoginResponse> {
    try {
      // Bakım durumu kontrolü (hata durumunda devam et)
      const maintenanceStatus = await maintenanceService.checkMaintenanceStatus()
      if (maintenanceStatus.success && maintenanceStatus.data.is_enabled) {
        throw new Error('Sistem bakımda. Bakım sayfasına yönlendiriliyorsunuz.')
      }
    } catch (maintenanceError) {
      // Bakım kontrolü başarısız olursa devam et
      console.warn('Bakım durumu kontrol edilemedi, giriş işlemine devam ediliyor')
    }
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          turnstile_token: data.turnstile_token
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (!response.ok) {
        // API'den gelen hata mesajını kullan
        if (result.detail) {
          if (typeof result.detail === 'string') {
            throw new Error(result.detail)
          } else if (Array.isArray(result.detail)) {
            const errorMsg = result.detail.map((err: any) => err.msg).join(', ')
            throw new Error(errorMsg)
          }
        }
        if (result.message) {
          throw new Error(result.message)
        }
        throw new Error('Giriş başarısız')
      }
      
      // Token'ı localStorage'a kaydet
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token_expires_at', (Date.now() + result.expires_in * 1000).toString())
      }
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.')
        }
        throw error
      }
      throw new Error('Beklenmeyen bir hata oluştu')
    }
  },

  async register(data: { 
    ad: string;
    soyad: string;
    email: string; 
    password: string;
    confirmPassword: string;
    meslek?: string;
    calistigiYer?: string;
  }): Promise<LoginResponse> {
    try {
      // Bakım durumu kontrolü (hata durumunda devam et)
      const maintenanceStatus = await maintenanceService.checkMaintenanceStatus()
      if (maintenanceStatus.success && maintenanceStatus.data.is_enabled) {
        throw new Error('Sistem bakımda. Bakım sayfasına yönlendiriliyorsunuz.')
      }
    } catch (maintenanceError) {
      // Bakım kontrolü başarısız olursa devam et
      console.warn('Bakım durumu kontrol edilemedi, kayıt işlemine devam ediliyor')
    }
    
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: `${data.ad} ${data.soyad}`,
          ad: data.ad,
          soyad: data.soyad,
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
          meslek: data.meslek,
          calistigi_yer: data.calistigiYer,
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (!response.ok) {
        // API'den gelen hata mesajını kullan ve Türkçe'ye çevir
        if (result.detail) {
          if (typeof result.detail === 'string') {
            throw new Error(this.translateErrorMessage(result.detail))
          } else if (Array.isArray(result.detail)) {
            const errorMsg = result.detail.map((err: any) => this.translateErrorMessage(err.msg)).join(', ')
            throw new Error(errorMsg)
          }
        }
        throw new Error('Kayıt işlemi başarısız oldu')
      }
      
      // Başarılı kayıt sonrası token'ı kaydet (giriş yapmış sayılır)
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token)
        localStorage.setItem('refresh_token', result.refresh_token)
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token_expires_at', (Date.now() + result.expires_in * 1000).toString())
      }
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.')
        }
        throw error
      }
      throw new Error('Beklenmeyen bir hata oluştu')
    }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    localStorage.removeItem('token_expires_at')
  },

  getToken(): string | null {
    return localStorage.getItem('access_token')
  },

  getUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  isAuthenticated(): boolean {
    const token = this.getToken()
    const expiresAt = localStorage.getItem('token_expires_at')
    
    if (!token || !expiresAt) {
      return false
    }
    
    return Date.now() < parseInt(expiresAt)
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || result.detail || 'Şifre sıfırlama talebi gönderilemedi')
      }
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.')
        }
        throw error
      }
      throw new Error('Şifre sıfırlama talebi gönderilemedi')
    }
  },

  async verifyResetToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.VERIFY_RESET_TOKEN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || result.detail || 'Token doğrulanamadı')
      }
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.')
        }
        throw error
      }
      throw new Error('Token doğrulanamadı')
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RESET_PASSWORD), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: newPassword
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || result.detail || 'Şifre sıfırlanamadı')
      }
      
      return result
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Bağlantı zaman aşımına uğradı. Lütfen internet bağlantınızı kontrol edin.')
        }
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.')
        }
        throw error
      }
      throw new Error('Şifre sıfırlanamadı')
    }
  }
}