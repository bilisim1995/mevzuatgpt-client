"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CreditCard, Lock, Shield, CheckCircle, XCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { createDirectPayment, PaymentRequest } from '@/lib/iyzico'
import { performSecurityChecks, SecurityCheckResult } from '@/lib/payment-security'

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
}

interface CardFormData {
  cardNumber: string
  cardHolderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

interface PaymentStep {
  step: 'form' | 'success' | 'error'
  data?: any
}

export function IyzicoPaymentModal({ isOpen, onClose, packageData, onSuccess }: IyzicoPaymentModalProps) {
  const [currentStep, setCurrentStep] = useState<PaymentStep>({ step: 'form' })
  const [loading, setLoading] = useState(false)
  const [showCvv, setShowCvv] = useState(false)
  const [formData, setFormData] = useState<CardFormData>({
    cardNumber: '',
    cardHolderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  })
  const [useTestCard, setUseTestCard] = useState(true)
  const [securityCheck, setSecurityCheck] = useState<SecurityCheckResult | null>(null)

  // İyzico resmi test kart bilgileri
  useEffect(() => {
    if (useTestCard) {
      setFormData({
        cardNumber: '5528790000000008', // Halkbank Master Card (Credit) - Başarılı
        cardHolderName: 'John Doe',
        expiryMonth: '12',
        expiryYear: '30',
        cvv: '123'
      })
    }
  }, [useTestCard])

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
    }
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Güvenlik kontrolü yap
    if (field === 'cardNumber' || field === 'cvv' || field === 'expiryMonth' || field === 'expiryYear') {
      performSecurityCheck()
    }
  }

  const performSecurityCheck = () => {
    if (formData.cardNumber && formData.cvv && formData.expiryMonth && formData.expiryYear) {
      const result = performSecurityChecks(
        formData.cardNumber,
        formData.cvv,
        formData.expiryMonth,
        formData.expiryYear,
        '127.0.0.1', // IP adresi
        packageData.price,
        0 // Önceki deneme sayısı
      )
      setSecurityCheck(result)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Güvenlik kontrolü
      const securityResult = performSecurityChecks(
        formData.cardNumber,
        formData.cvv,
        formData.expiryMonth,
        formData.expiryYear,
        '127.0.0.1',
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
      // İyzico 3D Secure başlatma
      const paymentRequest: PaymentRequest = {
        price: packageData.price,
        currency: 'TRY',
        conversationId: 'conv-' + Date.now(),
        buyerId: 'buyer-' + Date.now(),
        buyerName: 'Test',
        buyerSurname: 'User',
        buyerEmail: 'test@example.com',
        buyerIdentityNumber: '12345678901',
        buyerIp: '127.0.0.1',
        buyerCity: 'İstanbul',
        buyerCountry: 'Türkiye',
        buyerZipCode: '34000',
        buyerAddress: 'Test Adres',
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolderName: formData.cardHolderName,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cvv: formData.cvv,
        installment: 1
      }

      const result = await createDirectPayment(paymentRequest) as any
      
      if (result.status === 'success') {
        setCurrentStep({ step: 'success' })
        onSuccess(packageData.credits)
        toast.success('Ödeme başarıyla tamamlandı!')
      } else {
        setCurrentStep({ step: 'error' })
        toast.error('Ödeme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Ödeme işlemi başlatılamadı')
      setCurrentStep({ step: 'error' })
    } finally {
      setLoading(false)
    }
  }


  const resetModal = () => {
    setCurrentStep({ step: 'form' })
    setFormData({
      cardNumber: '',
      cardHolderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: ''
    })
    setThreeDCode('')
    setLoading(false)
  }

  const handleClose = () => {
    resetModal()
    onClose()
  }

  const renderFormStep = () => (
    <div className="space-y-6">
      {/* Test Kart Bilgileri */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Kart Bilgileri</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseTestCard(!useTestCard)}
            className="text-xs"
          >
            {useTestCard ? 'Manuel Gir' : 'Test Kartı Kullan'}
          </Button>
        </div>
        {useTestCard && (
          <div className="mt-2 text-xs text-blue-700 dark:text-blue-300">
            <p><strong>İyzico Resmi Test Kartı:</strong></p>
            <p>Kart No: 5528 7900 0000 0008 (Halkbank Master Card)</p>
            <p>CVV: 123 | Son Kullanma: 12/2030</p>
            <p className="text-green-600 font-semibold">✅ Başarılı Ödeme Test Kartı</p>
          </div>
        )}
        
        {/* Güvenlik Durumu */}
        {securityCheck && (
          <div className="mt-3 p-3 rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Güvenlik Durumu</span>
              <Badge variant={securityCheck.riskScore > 50 ? "destructive" : securityCheck.riskScore > 20 ? "secondary" : "default"}>
                Risk: {securityCheck.riskScore}%
              </Badge>
            </div>
            
            {securityCheck.errors.length > 0 && (
              <div className="text-red-600 text-xs">
                <strong>Hatalar:</strong> {securityCheck.errors.join(', ')}
              </div>
            )}
            
            {securityCheck.warnings.length > 0 && (
              <div className="text-yellow-600 text-xs">
                <strong>Uyarılar:</strong> {securityCheck.warnings.join(', ')}
              </div>
            )}
            
            {securityCheck.isValid && securityCheck.riskScore <= 20 && (
              <div className="text-green-600 text-xs">
                <strong>✅ Güvenli</strong>
              </div>
            )}
          </div>
        )}
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
              className="pl-10"
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
            placeholder="Ad Soyad"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiryMonth">Ay</Label>
            <Input
              id="expiryMonth"
              value={formData.expiryMonth}
              onChange={(e) => handleInputChange('expiryMonth', e.target.value)}
              placeholder="MM"
              maxLength={2}
            />
          </div>
          <div>
            <Label htmlFor="expiryYear">Yıl</Label>
            <Input
              id="expiryYear"
              value={formData.expiryYear}
              onChange={(e) => handleInputChange('expiryYear', e.target.value)}
              placeholder="YY"
              maxLength={2}
            />
          </div>
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                type={showCvv ? 'text' : 'password'}
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                placeholder="123"
                maxLength={3}
                className="pr-10"
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

      {/* Ödeme Butonu */}
      <Button
        onClick={handlePayment}
        disabled={loading || !formData.cardNumber || !formData.cardHolderName || !formData.expiryMonth || !formData.expiryYear || !formData.cvv}
        className="w-full h-12 text-lg font-semibold"
      >
        {loading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>İşleniyor...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <span>₺{packageData.price} Öde</span>
          </div>
        )}
      </Button>
    </div>
  )


  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
          Ödeme Başarılı!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {packageData.credits.toLocaleString()} hizmet hakkı hesabınıza eklendi
        </p>
      </div>

      <Button onClick={handleClose} className="w-full">
        Tamam
      </Button>
    </div>
  )

  const renderErrorStep = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-10 h-10 text-red-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
          Ödeme Başarısız
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
        </p>
      </div>

      <div className="flex space-x-3">
        <Button variant="outline" onClick={() => setCurrentStep({ step: 'form' })} className="flex-1">
          Tekrar Dene
        </Button>
        <Button onClick={handleClose} className="flex-1">
          Kapat
        </Button>
      </div>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {currentStep.step === 'form' && 'Ödeme Bilgileri'}
            {currentStep.step === 'success' && 'Ödeme Başarılı'}
            {currentStep.step === 'error' && 'Ödeme Başarısız'}
          </DialogTitle>
        </DialogHeader>

        {/* Paket Bilgileri */}
        {currentStep.step === 'form' && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{packageData.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {packageData.credits.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Hizmet Hakkı</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₺{packageData.price}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ₺{packageData.pricePerCredit.toFixed(2)}/hakkı
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Adım İçeriği */}
        {currentStep.step === 'form' && renderFormStep()}
        {currentStep.step === 'success' && renderSuccessStep()}
        {currentStep.step === 'error' && renderErrorStep()}

        {/* Güvenlik Bilgisi */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <Lock className="w-3 h-3" />
          <span>256-bit SSL ile korunmaktadır</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
