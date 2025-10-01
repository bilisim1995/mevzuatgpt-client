"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Save, RotateCcw, Loader2 } from 'lucide-react'
import { apiService } from '@/services/api'
import type { UserProfile, UpdateProfileRequest } from '@/services/api'
import { authService } from '@/services/auth'
import { toast } from 'sonner'

interface ProfilePanelProps {
  onProfileUpdated?: (profile: UserProfile) => void
}

export function ProfilePanel({ onProfileUpdated }: ProfilePanelProps) {
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

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token')
      
      const response = await apiService.getUserProfile()
      
      if (response.success) {
        setProfile(response.data)
        setFormData({
          full_name: response.data.full_name || '',
          ad: response.data.ad || '',
          soyad: response.data.soyad || '',
          meslek: response.data.meslek || '',
          calistigi_yer: response.data.calistigi_yer || ''
        })
      } else {
       
        toast.error('API yanıtı başarısız olarak işaretlendi.')
      }
    } catch (error: any) {
     
      
      toast.error(error.message || 'Profil bilgileri yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
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

     
      // Eğer hiçbir değişiklik yoksa
      if (Object.keys(updateData).length === 0) {
       
        toast.info('Herhangi bir değişiklik yapılmadı.')
        setSaving(false)
        return
      }

      
      const response = await apiService.updateUserProfile(updateData)
      
      if (response.success) {
        setProfile(response.data)
        
        // localStorage'daki user bilgisini güncelle
        const currentUser = authService.getUser()
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        
        onProfileUpdated?.(response.data)
        toast.success('Güncelleme başarılı!')
      } else {
       
        toast.error('Profil güncellenirken bir hata oluştu.')
      }
    } catch (error: any) {
      
      const errorMessage = error.message || 'Profil güncellenirken bir hata oluştu.'

      toast.error(errorMessage)
    } finally {
      setSaving(false)
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
    <div className="h-full flex flex-col">
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
        <div className="space-y-6">
              {/* Hesap Bilgileri */}
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hesap Bilgileri</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="inline-flex items-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
                    <span className="mr-2">📧</span>
                    {profile.email}
                  </div>
                  <div className="inline-flex items-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium capitalize">
                    <span className="mr-2">👤</span>
                    {profile.role}
                  </div>
                  <div className="inline-flex items-center px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                    <span className="mr-2">📅</span>
                    {new Date(profile.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              {/* Kişisel Bilgiler */}
              <div className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
                  <div className="space-y-3">
                    <Label htmlFor="ad" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Ad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ad"
                      value={formData.ad}
                      onChange={(e) => handleInputChange('ad', e.target.value)}
                      placeholder="Adınız"
                      maxLength={50}
                      className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="soyad" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Soyad <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="soyad"
                      value={formData.soyad}
                      onChange={(e) => handleInputChange('soyad', e.target.value)}
                      placeholder="Soyadınız"
                      maxLength={50}
                      className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl">
                  <div className="space-y-3">
                    <Label htmlFor="meslek" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Meslek
                    </Label>
                    <Input
                      id="meslek"
                      value={formData.meslek}
                      onChange={(e) => handleInputChange('meslek', e.target.value)}
                      placeholder="Mesleğiniz"
                      maxLength={100}
                      className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="calistigi_yer" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Çalıştığı Yer
                    </Label>
                    <Input
                      id="calistigi_yer"
                      value={formData.calistigi_yer}
                      onChange={(e) => handleInputChange('calistigi_yer', e.target.value)}
                      placeholder="Çalıştığınız yer"
                      maxLength={150}
                      className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-teal-500 dark:focus:border-teal-400 rounded-xl bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="flex items-center space-x-2 h-12 px-6 text-base font-medium border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Sıfırla</span>
                </Button>
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="flex items-center space-x-2 min-w-[140px] h-12 px-6 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Kaydet</span>
                    </>
                  )}
                </Button>
              </div>
        </div>
      )}
    </div>
  )
}
