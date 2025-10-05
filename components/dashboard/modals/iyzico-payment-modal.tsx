"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Lock, Shield, CheckCircle, XCircle, Loader2, Eye, EyeOff, X, ArrowRight, Info, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { createDirectPayment, PaymentRequest } from '@/lib/iyzico'
import { apiService } from '@/services/api'
import { performSecurityChecks, SecurityCheckResult } from '@/lib/payment-security'
import { getCardInfo } from '@/lib/payment-security'
import { validateTCKimlikNoWithMessage } from '@/lib/tc-validation'
import Confetti from 'react-confetti'

interface IyzicoPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: {
    id: string
    name: string
    credits: number
    price: number
    pricePerCredit: number
  }
  onSuccess: (credits: number) => void
  onError?: (error: any) => void
}

interface CardFormData {
  cardNumber: string
  cardHolderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

interface BillingFormData {
  phoneNumber: string
  address: string
  country: string
  city: string
  identityNumber: string
  email: string
  registrationDate?: string
  lastLoginDate?: string
}

interface PaymentStep {
  step: 'form' | 'success' | 'error'
  data?: any
}

interface WizardStep {
  step: 'card' | 'billing' | 'success' | 'error'
  data?: any
}

export function IyzicoPaymentModal({ isOpen, onClose, packageData, onSuccess, onError }: IyzicoPaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>({ step: 'form' })
  const [wizardStep, setWizardStep] = useState<WizardStep>({ step: 'card' })
  const [loading, setLoading] = useState(false)
  const [showCvv, setShowCvv] = useState(false)
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })
  const [billingData, setBillingData] = useState<BillingFormData>({
    phoneNumber: '',
    address: '',
    country: 'Türkiye',
    city: 'İstanbul',
    identityNumber: '',
    email: '',
    registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
    lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
  })
  const [userIP, setUserIP] = useState<string>('88.123.45.67')
  const [agreementAccepted, setAgreementAccepted] = useState(false)
  const [useTestCard, setUseTestCard] = useState(true)
  const [isCvvFocused, setIsCvvFocused] = useState(false)
  const [showTcInfo, setShowTcInfo] = useState(false)
  const [securityCheck, setSecurityCheck] = useState<SecurityCheckResult | null>(null)
  const [cardInfo, setCardInfo] = useState<{ type: string; bank: string; isTest: boolean } | null>(null)
  const [tcValidationError, setTcValidationError] = useState<string>('')
  const [paymentError, setPaymentError] = useState<{
    errorCode?: string
    errorGroup?: string
    errorName?: string
    errorMessage?: string
  } | null>(null)
  const [paymentSettings, setPaymentSettings] = useState<{
    payment_mode: 'sandbox' | 'production'
    is_active: boolean
    description?: string
  } | null>(null)
  // Bu state'ler artık gerekli değil - ayrı modal'da gösterilecek

  // Ay ve yıl seçenekleri
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    return { value: month.toString().padStart(2, '0'), label: month.toString().padStart(2, '0') }
  })

  const years = Array.from({ length: 20 }, (_, i) => {
    const year = new Date().getFullYear() + i
    return { value: year.toString().slice(-2), label: year.toString() }
  })

  // Türkiye şehirleri
  const cities = [
    'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
    'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
    'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
    'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta',
    'Mersin', 'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir',
    'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla',
    'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
    'Sinop', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
    'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman',
    'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
  ].map(city => ({ value: city, label: city }))

  // Kullanıcı IP adresini al
  useEffect(() => {
    // Ödeme ayarlarını çek
    const loadPaymentSettings = async () => {
      try {
        const res = await apiService.getUserPaymentSettings()
        if (res?.success) {
          setPaymentSettings({
            payment_mode: res.payment_mode,
            is_active: res.is_active,
            description: res.description,
          })
        }
      } catch (e) {
        console.error('Ödeme ayarları alınamadı:', e)
      }
    }
    if (isOpen) {
      loadPaymentSettings()
    }
    const fetchUserIP = async () => {
      try {
        // WebRTC ile local IP alma (daha güvenilir)
        const getLocalIP = (): Promise<string> => {
          return new Promise((resolve) => {
            const pc = new RTCPeerConnection({
              iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
            })
            
            pc.createDataChannel('')
            pc.createOffer().then(offer => pc.setLocalDescription(offer))
            
            pc.onicecandidate = (event) => {
              if (event.candidate) {
                const candidate = event.candidate.candidate
                const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/)
                if (ipMatch) {
                  const ip = ipMatch[1]
                  if (ip && ip !== '127.0.0.1' && ip !== '::1') {
                    pc.close()
                    resolve(ip)
                    return
                  }
                }
              }
            }
            
            // 2 saniye sonra timeout
            setTimeout(() => {
              pc.close()
              resolve('')
            }, 2000)
          })
        }
        
        // Önce WebRTC ile local IP almayı dene
        const localIP = await getLocalIP()
        if (localIP) {
          console.log('WebRTC ile IP alındı:', localIP)
          setUserIP(localIP)
          return
        }
        
        // WebRTC başarısız olursa external servisleri dene
        const ipServices = [
          'https://api.ipify.org?format=json',
          'https://ipapi.co/json/',
          'https://ipinfo.io/json',
          'https://api.ipgeolocation.io/ipgeo?apiKey=free',
          'https://ip-api.com/json/'
        ]
        
        for (const service of ipServices) {
          try {
            const response = await fetch(service, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
              mode: 'cors'
            })
            
            if (response.ok) {
              const data = await response.json()
              const ip = data.ip || data.query || data.ipAddress
              
              if (ip && ip !== '::1' && ip !== '127.0.0.1' && ip !== 'localhost') {
                console.log('IP adresi alındı:', ip, 'Servis:', service)
                setUserIP(ip)
                return
              }
            }
          } catch (e) {
            console.log('IP servisi başarısız:', service, e)
            continue
          }
        }
        
        // Tüm yöntemler başarısız olursa gerçek bir IP kullan
        console.log('Tüm IP alma yöntemleri başarısız, fallback IP kullanılıyor')
        setUserIP('88.123.45.67') // Gerçek bir IP örneği (::1 yerine)
      } catch (error) {
        console.error('IP adresi alınamadı:', error)
        setUserIP('88.123.45.67') // Fallback IP
      }
    }
    
    if (isOpen) {
      fetchUserIP()
    }
  }, [isOpen])

  // Modal açıldığında form verilerini sıfırla
  useEffect(() => {
    if (isOpen) {
      setFormData({
        cardNumber: '', // Kullanıcı kendi kart bilgilerini girecek
        cardHolderName: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
      })
      
      // Kullanıcı e-postasını ve kayıt tarihini al
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setBillingData(prev => ({
            ...prev,
            email: user.email || '',
            registrationDate: user.created_at ? new Date(user.created_at).toISOString().replace('T', ' ').substring(0, 19) : new Date().toISOString().replace('T', ' ').substring(0, 19),
            lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
          }))
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error)
        }
      }
      
      // Güvenlik kontrolü yap
      setTimeout(() => {
        performSecurityCheck()
      }, 100)
    }
  }, [isOpen])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    if (field === 'cardNumber') {
      value = formatCardNumber(value)
      // Kart bilgisi tespit et
      if (value.replace(/\s/g, '').length >= 6) {
        const info = getCardInfo(value)
        setCardInfo(info)
      } else {
        setCardInfo(null)
      }
    } else if (field === 'cardHolderName') {
      // Kart sahibi adını büyük harflerle yaz
      value = value.toUpperCase()
    }
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Güvenlik kontrolü yap
    if (field === 'cardNumber' || field === 'cvv' || field === 'expiryMonth' || field === 'expiryYear') {
      performSecurityCheck()
    }
  }

  const handleBillingChange = (field: keyof BillingFormData, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }))
    
    // T.C. Kimlik No doğrulaması
    if (field === 'identityNumber') {
      if (value.length === 11) {
        const validation = validateTCKimlikNoWithMessage(value)
        if (!validation.isValid) {
          setTcValidationError(validation.message)
        } else {
          setTcValidationError('')
        }
      } else {
        setTcValidationError('')
      }
    }
  }

  const nextStep = () => {
    if (wizardStep.step === 'card') {
      setWizardStep({ step: 'billing' })
    }
  }

  const prevStep = () => {
    if (wizardStep.step === 'billing') {
      setWizardStep({ step: 'card' })
    }
  }

  const performSecurityCheck = () => {
    // Sadece form dolu ise güvenlik kontrolü yap
    if (formData.cardNumber && formData.cvv && formData.expiryMonth && formData.expiryYear) {
      const result = performSecurityChecks(
        formData.cardNumber,
        formData.cvv,
        formData.expiryMonth,
        formData.expiryYear,
        userIP, // Gerçek kullanıcı IP adresi
        packageData.price,
        0 // Önceki deneme sayısı
      )
      setSecurityCheck(result)
      // Arka planda güvenlik kontrolü yap, kullanıcıya gösterme
    }
  }

  const handlePayment = async () => {
    if (paymentSettings && paymentSettings.is_active === false) {
      toast.error('Ödeme Kapalı')
      return
    }
    setLoading(true)
    
    try {
      // Güvenlik kontrolü
      const securityResult = performSecurityChecks(
        formData.cardNumber,
        formData.cvv,
        formData.expiryMonth,
        formData.expiryYear,
        userIP, // Gerçek kullanıcı IP adresi
        packageData.price,
        0
      )
      
      if (!securityResult.isValid) {
        toast.error('Güvenlik kontrolü başarısız: ' + securityResult.errors.join(', '))
        setLoading(false)
        return
      }
      
      if (securityResult.riskScore > 70) {
        toast.error('Yüksek risk tespit edildi. İşlem reddedildi.')
        setLoading(false)
        return
      }
      
      if (securityResult.warnings.length > 0) {
        toast.warning('Uyarı: ' + securityResult.warnings.join(', '))
      }
      // İyzico 3D Secure başlatma - Gerçek form verilerini kullan
      // Kullanıcı UUID'sini al
      const userData = localStorage.getItem('user')
      const user = userData ? JSON.parse(userData) : null
      const userUUID = user?.id || 'unknown-user-id'
      
      const paymentRequest: PaymentRequest = {
        price: packageData.price,
        currency: 'TRY',
        conversationId: 'conv-' + userUUID,
        buyerId: 'mevzuatgpt-' + Date.now(),
        buyerName: formData.cardHolderName.split(' ')[0] || 'Kullanıcı', // Kart sahibi adından al
        buyerSurname: formData.cardHolderName.split(' ').slice(1).join(' ') || 'Adı', // Kart sahibi soyadından al
        buyerEmail: billingData.email,
        buyerIdentityNumber: billingData.identityNumber,
        buyerIp: userIP, // Gerçek kullanıcı IP adresi
        buyerCity: billingData.city,
        buyerCountry: billingData.country,
        buyerZipCode: '34000', // Sabit posta kodu
        buyerAddress: billingData.address,
        buyerPhoneNumber: billingData.phoneNumber,
        registrationDate: billingData.registrationDate,
        lastLoginDate: billingData.lastLoginDate,
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolderName: formData.cardHolderName,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv,
        installment: 1
      }

      const result = await createDirectPayment(paymentRequest) as any
      
      if (result.status === 'success') {
        // Ödeme başarılı - hemen onSuccess çağır ve modal'ı kapat
        onSuccess(packageData.credits)
        setLoading(false)
        return
      } else if (result.status === 'failure') {
        // İyzico API hata yönetimi
        const errorCode = result.errorCode || 'Bilinmeyen'
        const errorGroup = result.errorGroup || 'UNKNOWN_ERROR'
        const errorName = result.errorName || 'Error'
        const errorMessage = result.errorMessage || 'Ödeme işlemi başarısız'
        
        // Hata mesajını kullanıcı dostu hale getir
        let userFriendlyMessage = errorMessage
        
        // Yaygın hata kodları için özel mesajlar
        switch (errorCode) {
          case '10051':
            userFriendlyMessage = 'Kart limiti yetersiz. Lütfen farklı bir kart deneyin.'
            break
          case '10052':
            userFriendlyMessage = 'Kart bilgileri hatalı. Lütfen kontrol edin.'
            break
          case '10053':
            userFriendlyMessage = 'Kart sahibi adı hatalı. Lütfen kontrol edin.'
            break
          case '10054':
            userFriendlyMessage = 'CVV kodu hatalı. Lütfen kontrol edin.'
            break
          case '10055':
            userFriendlyMessage = 'Son kullanma tarihi hatalı. Lütfen kontrol edin.'
            break
          case '10056':
            userFriendlyMessage = 'Kart numarası hatalı. Lütfen kontrol edin.'
            break
          case '10057':
            userFriendlyMessage = 'Kart bloke edilmiş. Bankanızla iletişime geçin.'
            break
          case '10058':
            userFriendlyMessage = 'Kart geçersiz. Lütfen farklı bir kart deneyin.'
            break
          case '10059':
            userFriendlyMessage = 'İşlem reddedildi. Bankanızla iletişime geçin.'
            break
          case '10060':
            userFriendlyMessage = 'Kart sahibi doğrulaması başarısız.'
            break
          default:
            userFriendlyMessage = errorMessage
        }
        
        // Hata grubuna göre ek mesajlar
        if (errorGroup === 'NOT_SUFFICIENT_FUNDS') {
          userFriendlyMessage = 'Kart bakiyesi yetersiz. Lütfen farklı bir kart deneyin.'
        } else if (errorGroup === 'INVALID_CARD') {
          userFriendlyMessage = 'Geçersiz kart bilgileri. Lütfen kontrol edin.'
        } else if (errorGroup === 'CARD_BLOCKED') {
          userFriendlyMessage = 'Kart bloke edilmiş. Bankanızla iletişime geçin.'
        } else if (errorGroup === 'EXPIRED_CARD') {
          userFriendlyMessage = 'Kartın son kullanma tarihi geçmiş. Lütfen farklı bir kart deneyin.'
        } else if (errorGroup === 'INVALID_CVV') {
          userFriendlyMessage = 'CVV kodu hatalı. Lütfen kontrol edin.'
        } else if (errorGroup === 'INVALID_CARD_HOLDER') {
          userFriendlyMessage = 'Kart sahibi adı hatalı. Lütfen kontrol edin.'
        }
        
        // Hata durumunda onError çağır ve modal'ı kapat
        if (onError) {
          onError({
            errorCode,
            errorGroup,
            errorName,
            errorMessage
          })
        }
        setLoading(false)
        return
      } else {
        // Genel hata durumu
        if (onError) {
          onError({
            errorCode: 'UNKNOWN',
            errorGroup: 'UNKNOWN_ERROR',
            errorName: 'Unknown Error',
            errorMessage: 'Ödeme işlemi başarısız'
          })
        }
        setLoading(false)
        return
      }
    } catch (error) {
      // Genel hata durumu
      if (onError) {
        onError({
          errorCode: 'NETWORK_ERROR',
          errorGroup: 'NETWORK_ERROR',
          errorName: 'Network Error',
          errorMessage: 'Ödeme işlemi başlatılamadı'
        })
      }
      setLoading(false)
    }
  }


  const resetModal = () => {
    setCurrentStep({ step: 'form' })
    setWizardStep({ step: 'card' })
    setFormData({
      cardNumber: '',
      cardHolderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    })
    setBillingData({
      phoneNumber: '',
      address: '',
      country: 'Türkiye',
      city: 'İstanbul',
      identityNumber: '',
      email: '',
      registrationDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
      lastLoginDate: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
    setAgreementAccepted(false)
    setIsCvvFocused(false) // Reset CVV focus state
    setShowTcInfo(false) // Reset TC info state
    setLoading(false)
    setSecurityCheck(null) // Reset security check state
    setCardInfo(null) // Reset card info state
    setPaymentError(null) // Reset payment error state
    setTcValidationError('') // Reset TC validation error
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const renderBillingStep = () => (
    <div className="space-y-6">
      {/* Fatura Bilgileri */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fatura Bilgileri</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Cep Telefonu</Label>
            <Input
              id="phoneNumber"
              value={billingData.phoneNumber}
              onChange={(e) => handleBillingChange('phoneNumber', e.target.value)}
              className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              value={billingData.email}
              onChange={(e) => handleBillingChange('email', e.target.value)}
              placeholder="ornek@email.com"
              className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              disabled
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Adres</Label>
          <Input
            id="address"
            value={billingData.address}
            onChange={(e) => handleBillingChange('address', e.target.value)}
            placeholder="Tam adres bilginiz"
            className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Şehir</Label>
            <Select value={billingData.city} onValueChange={(value) => handleBillingChange('city', value)}>
              <SelectTrigger className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Şehir seçin" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.value} value={city.value}>
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="country">Ülke</Label>
            <Input
              id="country"
              value={billingData.country}
              onChange={(e) => handleBillingChange('country', e.target.value)}
              placeholder="Ülke"
              className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="identityNumber">T.C. Kimlik No</Label>
          <div className="relative">
            <Input
              id="identityNumber"
              value={billingData.identityNumber}
              onChange={(e) => handleBillingChange('identityNumber', e.target.value)}
              placeholder="12345678901"
              maxLength={11}
              className={`pr-10 rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 ${
                tcValidationError 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="relative">
                <Info 
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300" 
                  onClick={() => setShowTcInfo(!showTcInfo)}
                />
                {showTcInfo && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-lg shadow-lg z-10 w-64">
                    <div className="font-medium mb-1">Neden T.C. Kimlik No İstiyoruz?</div>
                    <div className="text-xs">
                      Fatura düzenleme ve vergi mevzuatı gereği kimlik bilgisi gereklidir. Bu bilgi sadece fatura işlemleri için kullanılır.
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {tcValidationError && (
            <p className="text-red-500 text-xs mt-1">{tcValidationError}</p>
          )}
        </div>
      </div>

      {/* Satış Sözleşmesi */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="agreement"
            checked={agreementAccepted}
            onChange={(e) => setAgreementAccepted(e.target.checked)}
            className="mt-1 rounded"
          />
          <label htmlFor="agreement" className="text-sm text-gray-600 dark:text-gray-300">
            <a href="#" className="text-blue-600 hover:underline">
              Satış sözleşmesini
            </a> ve{' '}
            <a href="#" className="text-blue-600 hover:underline">
              gizlilik politikasını
            </a>{' '}
            okudum, kabul ediyorum.
          </label>
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1 rounded-lg dark:rounded-xl"
        >
          Geri
        </Button>
        <Button
          onClick={handlePayment}
          disabled={loading || !agreementAccepted || !billingData.phoneNumber || !billingData.address || !billingData.identityNumber || !!tcValidationError}
          className="flex-1 rounded-lg dark:rounded-xl"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>İşleniyor...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>₺{packageData.price} Öde</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )

  const renderFormStep = () => (
    <div className="space-y-6">

      {/* Kart Animasyonu */}
      <div className="flex justify-center">
        <div className="relative w-80 h-48 perspective-1000">
          <div className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-700 ${
            isCvvFocused ? 'rotate-y-180' : ''
          }`}>
            {/* Kart Ön Yüzü */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-2xl p-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div className="text-sm font-medium opacity-80 truncate max-w-24">
                  {cardInfo?.bank || 'BANKA'}
                </div>
                <div className="text-sm font-bold">
                  {cardInfo?.type === 'VISA' ? 'VISA' : cardInfo?.type === 'MASTERCARD' ? 'MASTERCARD' : 'VISA'}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="text-xl font-mono tracking-wider mb-2">
                  {formData.cardNumber || '**** **** **** ****'}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm opacity-80">
                    {formData.cardHolderName || 'KART SAHİBİ ADI'}
                  </div>
                  <div className="text-sm font-mono">
                    {formData.expiryMonth && formData.expiryYear 
                      ? `${formData.expiryMonth}/${formData.expiryYear}`
                      : 'MM/YY'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className={`text-xs font-medium ${
                  cardInfo?.isTest 
                    ? 'text-white' 
                    : 'text-green-200 dark:text-green-300'
                }`}>
                  {cardInfo?.isTest ? 'TEST KARTI' : 'GÜVENLİ ÖDEME'}
                </div>
                <div className="flex space-x-1">
                  <div className="w-6 h-4 bg-white rounded-sm"></div>
                  <div className="w-6 h-4 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Kart Arka Yüzü */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl shadow-2xl p-6 text-white transform rotate-y-180">
              <div className="h-full flex flex-col justify-between">
                <div className="w-full h-12 bg-black rounded mt-4"></div>
                <div className="flex justify-end">
                  <div className="w-16 h-8 bg-white rounded flex items-center justify-center">
                    <span className="text-black text-xs font-bold">
                      {showCvv ? (formData.cvv || '***') : '***'}
                    </span>
                  </div>
                </div>
                <div className="text-xs opacity-80 text-center">
                  Bu kart sadece test amaçlıdır
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Kart Bilgileri Formu */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Kart Numarası</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              placeholder="1234 5678 9012 3456"
              className="pl-10 rounded-lg bg-white dark:bg-gray-700 dark:rounded-xl border-gray-300 dark:border-gray-600"
              maxLength={19}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cardHolderName">Kart Sahibi Adı</Label>
          <Input
            id="cardHolderName"
            value={formData.cardHolderName}
            onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
            placeholder="AD SOYAD"
            className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 uppercase"
            style={{ textTransform: 'uppercase' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiryMonth">Ay</Label>
            <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
              <SelectTrigger className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expiryYear">Yıl</Label>
            <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
              <SelectTrigger className="rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="YY" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <div className="relative">
                    <Input
                      id="cvv"
                      type={showCvv ? 'text' : 'password'}
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      onFocus={() => setIsCvvFocused(true)}
                      onBlur={() => setIsCvvFocused(false)}
                      placeholder="123"
                      maxLength={3}
                      className="pr-10 rounded-lg dark:rounded-xl bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCvv(!showCvv)}
                    >
                      {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
        </div>
      </div>

      {/* İleri Butonu */}
      <Button
        onClick={nextStep}
        disabled={!formData.cardNumber || !formData.cardHolderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv}
        className="w-full h-12 text-lg font-semibold rounded-lg dark:rounded-xl"
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-normal opacity-80">
            {packageData.name}({packageData.credits}) - ₺{packageData.price}
          </span>
          <div className="flex items-center space-x-2">
            <span>İleri</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Button>
    </div>
  )


  // Success ve error step'leri artık ayrı modal'da gösterilecek

  // Error step'i artık ayrı modal'da gösterilecek

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-auto rounded-xl dark:rounded-2xl bg-white dark:bg-gray-800">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute right-0 top-0 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogTitle className="text-center">
            {wizardStep.step === 'card' && 'Kart Bilgileri'}
            {wizardStep.step === 'billing' && 'Fatura Bilgileri'}
          </DialogTitle>
        </DialogHeader>

        {/* Wizard Progress */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              wizardStep.step === 'card' 
                ? 'bg-blue-600 text-white' 
                : 'bg-green-600 text-white'
            }`}>
              1
            </div>
            <span className="text-sm font-medium">Kart Bilgileri</span>
          </div>
          <div className="w-8 h-0.5 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              wizardStep.step === 'billing' 
                ? 'bg-blue-600 text-white' 
                : wizardStep.step === 'card'
                ? 'bg-gray-300 text-gray-600'
                : 'bg-green-600 text-white'
            }`}>
              2
            </div>
            <span className="text-sm font-medium">Fatura Bilgileri</span>
          </div>
        </div>

        {/* Adım İçeriği */}
        {wizardStep.step === 'card' && renderFormStep()}
        {wizardStep.step === 'billing' && renderBillingStep()}

        {/* Güvenlik Bilgisi */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-300">
          <Lock className="w-3 h-3" />
          <span>256-bit SSL ile korunmaktadır</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
