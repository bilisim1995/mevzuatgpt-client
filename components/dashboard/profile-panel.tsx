"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Save, RotateCcw, Loader2, Receipt, Calendar, CreditCard, Coins } from 'lucide-react'
import { apiService } from '@/services/api'
import type { UserProfile, UpdateProfileRequest } from '@/services/api'
import { authService } from '@/services/auth'
import { toast } from 'sonner'

interface ProfilePanelProps {
  onProfileUpdated?: (profile: UserProfile) => void
}

interface PurchaseHistory {
  created_at: string
  status: string
  price: string
  payment_id: string
  credit_amount: number
}

interface PurchaseHistoryResponse {
  success: boolean
  data: PurchaseHistory[]
  total: number
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
  
  // Satın alma geçmişi için state'ler
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistory[]>([])
  const [purchaseLoading, setPurchaseLoading] = useState(false)

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

  const loadPurchaseHistory = async () => {
    setPurchaseLoading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'
      const token = localStorage.getItem('access_token')
      
      const response = await fetch(`${baseUrl}/api/user/purchases`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data: PurchaseHistoryResponse = await response.json()
        if (data.success) {
          setPurchaseHistory(data.data)
        } else {
          toast.error('Satın alma geçmişi yüklenemedi.')
        }
      } else {
        toast.error('Satın alma geçmişi yüklenirken bir hata oluştu.')
      }
    } catch (error: any) {
      console.error('Purchase history error:', error)
      toast.error('Satın alma geçmişi yüklenirken bir hata oluştu.')
    } finally {
      setPurchaseLoading(false)
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

  const renderProfileTab = () => {
    if (loading) {
  return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )
    }

    if (!profile) {
      return (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Profil bilgileri yüklenemedi.</p>
        </div>
      )
    }

    return (
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
    )
  }

  const renderBillingTab = () => {
    if (purchaseLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )
    }

    if (purchaseHistory.length === 0) {
      return (
        <div className="text-center py-12">
          <Receipt className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Henüz satın alma geçmişiniz bulunmuyor.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Satın Alma Geçmişi
            {purchaseHistory.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({purchaseHistory.length} kayıt)
              </span>
            )}
          </h3>
          <Button
            onClick={loadPurchaseHistory}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yenile</span>
          </Button>
        </div>

        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
          {purchaseHistory.map((purchase, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {purchase.credit_amount} Kredi
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        purchase.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {purchase.status === 'success' ? 'Başarılı' : 'Başarısız'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(purchase.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {purchase.price} TL
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {purchase.payment_id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Not */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-6">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">ℹ</span>
            </div>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Not:</strong> Satın alımlarla ilgili merak ettiğiniz soru veya itirazınız varsa{' '}
                <a 
                  href="mailto:muhasebe@mevzuatgpt.org" 
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium"
                >
                  muhasebe@mevzuatgpt.org
                </a>{' '}
                adresine mail gönderiniz.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 border border-gray-200 dark:border-gray-700 mb-4 rounded-xl bg-white dark:bg-gray-800">
          <TabsTrigger value="profile" className="text-sm py-2 rounded-lg flex items-center justify-center data-[state=active]:bg-gray-600 data-[state=active]:text-white dark:data-[state=active]:bg-gray-300 dark:data-[state=active]:text-gray-900">
            Profilim
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-sm py-2 rounded-lg flex items-center justify-center data-[state=active]:bg-gray-600 data-[state=active]:text-white dark:data-[state=active]:bg-gray-300 dark:data-[state=active]:text-gray-900" onClick={loadPurchaseHistory}>
            Faturalandırma
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-4">
          {renderProfileTab()}
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          {renderBillingTab()}
        </TabsContent>
      </Tabs>
    </div>
  )
}
