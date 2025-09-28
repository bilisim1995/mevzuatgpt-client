"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User, Save, RotateCcw, Loader2 } from 'lucide-react'
import { apiService } from '@/services/api'
import type { UserProfile, UpdateProfileRequest } from '@/services/api'
import { authService } from '@/services/auth'
import { toast } from 'sonner'

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdated?: (profile: UserProfile) => void
}

export function ProfileModal({ open, onOpenChange, onProfileUpdated }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    ad: '',
    soyad: '',
    meslek: '',
    calistigi_yer: ''
  })

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
      loadProfile()
    }
  }, [open])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      console.log('🔍 Profil yükleme başladı...')
      console.log('🔑 Token kontrol:', token ? 'Mevcut' : 'Yok')
      console.log('🌐 API Endpoint: GET /api/user/profile')
      
      const response = await apiService.getUserProfile()
      console.log('✅ API yanıtı tam:', JSON.stringify(response, null, 2))
      
      if (response.success) {
        setProfile(response.data)
        console.log('👤 Profil verisi detay:', JSON.stringify(response.data, null, 2))
        setFormData({
          full_name: response.data.full_name || '',
          ad: response.data.ad || '',
          soyad: response.data.soyad || '',
          meslek: response.data.meslek || '',
          calistigi_yer: response.data.calistigi_yer || ''
        })
        console.log('📝 Form verisi ayarlandı:', {
          full_name: response.data.full_name || '',
          ad: response.data.ad || '',
          soyad: response.data.soyad || '',
          meslek: response.data.meslek || '',
          calistigi_yer: response.data.calistigi_yer || ''
        })
      } else {
        console.error('❌ API başarısız yanıt:', response)
        toast.error('API yanıtı başarısız olarak işaretlendi.')
      }
    } catch (error: any) {
      console.error('❌ Profil yükleme hatası:', error)
      console.error('🔍 Hata detayları:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      toast.error(error.message || 'Profil bilgileri yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
      console.log('🏁 Profil yükleme tamamlandı')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    // Validasyon kontrolleri
    const trimmedAd = formData.ad.trim()
    const trimmedSoyad = formData.soyad.trim()
    const trimmedMeslek = formData.meslek.trim()
    const trimmedCalistigiYer = formData.calistigi_yer.trim()

    console.log('🔄 Profil güncelleme başladı')
    console.log('📝 Form verileri:', {
      trimmedAd,
      trimmedSoyad,
      trimmedMeslek,
      trimmedCalistigiYer
    })
    console.log('👤 Mevcut profil:', profile)
    console.log('🌐 API Endpoint: PUT /api/user/profile')
    
    if (!trimmedAd || !trimmedSoyad) {
      toast.error('Ad ve soyad alanları zorunludur.')
      return
    }

    // Karakter sınırları kontrolü
    if (trimmedAd.length > 50) {
      toast.error('Ad en fazla 50 karakter olabilir.')
      return
    }
    if (trimmedSoyad.length > 50) {
      toast.error('Soyad en fazla 50 karakter olabilir.')
      return
    }
    if (trimmedMeslek.length > 100) {
      toast.error('Meslek en fazla 100 karakter olabilir.')
      return
    }
    if (trimmedCalistigiYer.length > 150) {
      toast.error('Çalıştığı yer en fazla 150 karakter olabilir.')
      return
    }

    setSaving(true)
    try {
      // Sadece değişen alanları gönder
      const updateData: UpdateProfileRequest = {}
      
      const newFullName = `${trimmedAd} ${trimmedSoyad}`
      if (newFullName !== profile?.full_name) {
        updateData.full_name = newFullName
      }
      if (trimmedAd !== (profile?.ad || '')) {
        updateData.ad = trimmedAd
      }
      if (trimmedSoyad !== (profile?.soyad || '')) {
        updateData.soyad = trimmedSoyad
      }
      if (trimmedMeslek !== (profile?.meslek || '')) {
        updateData.meslek = trimmedMeslek || undefined
      }
      if (trimmedCalistigiYer !== (profile?.calistigi_yer || '')) {
        updateData.calistigi_yer = trimmedCalistigiYer || undefined
      }

      console.log('📤 Gönderilecek güncelleme verisi:', JSON.stringify(updateData, null, 2))
      // Eğer hiçbir değişiklik yoksa
      if (Object.keys(updateData).length === 0) {
        console.log('ℹ️ Hiçbir değişiklik yok')
        toast.info('Herhangi bir değişiklik yapılmadı.')
        setSaving(false)
        return
      }

      
      const response = await apiService.updateUserProfile(updateData)
      console.log('✅ Güncelleme API yanıtı:', JSON.stringify(response, null, 2))
      
      if (response.success) {
        console.log('✅ Güncelleme başarılı, profil güncelleniyor')
        setProfile(response.data)
        
        // localStorage'daki user bilgisini güncelle
        const currentUser = authService.getUser()
        console.log('👤 Mevcut localStorage user:', currentUser)
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data }
          console.log('👤 Güncellenecek user:', updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          console.log('💾 LocalStorage güncellendi:', updatedUser)
        }
        
        onProfileUpdated?.(response.data)
        toast.success('Güncelleme başarılı!')
        onOpenChange(false)
      } else {
        console.error('❌ API success=false:', response)
        toast.error('Profil güncellenirken bir hata oluştu.')
      }
    } catch (error: any) {
      console.error('❌ Profil güncelleme hatası:', error)
      console.error('❌ Hata detayları:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
      const errorMessage = error.message || 'Profil güncellenirken bir hata oluştu.'
      console.error('❌ Gösterilecek hata mesajı:', errorMessage)
      toast.error(errorMessage)
    } finally {
      setSaving(false)
      console.log('🏁 Profil güncelleme işlemi tamamlandı')
    }
  }

  const handleReset = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        ad: profile.ad || '',
        soyad: profile.soyad || '',
        meslek: profile.meslek || '',
        calistigi_yer: profile.calistigi_yer || ''
      })
      toast.info('Form sıfırlandı.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="w-5 h-5 mr-2" />
            Profil Bilgileri
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Kişisel bilgilerinizi görüntüleyin ve düzenleyin
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : !profile ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Profil bilgileri yüklenemedi.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 pr-4">
              {/* Hesap Bilgileri */}
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50">
                <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Hesap Bilgileri</h3>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">E-posta</Label>
                    <div className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700/30 rounded px-2 py-1 mt-1">
                      {profile.email}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Rol</Label>
                    <div className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700/30 rounded px-2 py-1 mt-1 capitalize">
                      {profile.role}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Kayıt Tarihi</Label>
                    <div className="text-xs text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700/30 rounded px-2 py-1 mt-1">
                      {new Date(profile.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kişisel Bilgiler */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Kişisel Bilgiler</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ad"
                      value={formData.ad}
                      onChange={(e) => handleInputChange('ad', e.target.value)}
                      placeholder="Adınız"
                      maxLength={50}
                      className="h-10"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.ad.length}/50 karakter
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="soyad" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Soyad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="soyad"
                      value={formData.soyad}
                      onChange={(e) => handleInputChange('soyad', e.target.value)}
                      placeholder="Soyadınız"
                      maxLength={50}
                      className="h-10"
                    />
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.soyad.length}/50 karakter
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meslek" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Meslek
                  </Label>
                  <Input
                    id="meslek"
                    value={formData.meslek}
                    onChange={(e) => handleInputChange('meslek', e.target.value)}
                    placeholder="Mesleğiniz"
                    maxLength={100}
                    className="h-10"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.meslek.length}/100 karakter
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calistigi_yer" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Çalıştığı Yer
                  </Label>
                  <Input
                    id="calistigi_yer"
                    value={formData.calistigi_yer}
                    onChange={(e) => handleInputChange('calistigi_yer', e.target.value)}
                    placeholder="Çalıştığınız yer"
                    maxLength={150}
                    className="h-10"
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formData.calistigi_yer.length}/150 karakter
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="sticky bottom-0 bg-white dark:bg-slate-900 pt-4 border-t border-gray-200 dark:border-slate-700 -mx-4 px-4 -mb-4 pb-4">
                <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="flex items-center space-x-2 min-w-[120px] w-full"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Kaydet</span>
                    </>
                  )}
                </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}