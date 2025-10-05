"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Confetti from 'react-confetti'

interface PaymentResultModalProps {
  isOpen: boolean
  onClose: () => void
  result: {
    status: 'success' | 'error'
    packageData?: {
      name: string
      credits: number
      price: number
    }
    paymentId?: string
    orderNumber?: string
    errorCode?: string
    errorGroup?: string
    errorName?: string
    errorMessage?: string
  }
}

export function PaymentResultModal({ isOpen, onClose, result }: PaymentResultModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && result.status === 'success') {
      setShowConfetti(true)
      // 3 saniye sonra konfeti'yi kapat
      setTimeout(() => {
        setShowConfetti(false)
      }, 3000)
    }
  }, [isOpen, result.status])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Kopyalandı!')
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const renderSuccessContent = () => (
    <div className="text-center space-y-6">
      <div>
        <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
          Satın Alma Başarılı! 🎉
        </h3>
        
        {/* Paket Bilgileri */}
        {result.packageData && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              {result.packageData.name} paketiniz kapsamında
            </p>
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              {result.packageData.price} TL karşılığında hesabınıza {result.packageData.credits.toLocaleString()} Kullanım Hakkı yüklendi
            </p>
          </div>
        )}
        
        {/* Sipariş No */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
          <div className="space-y-3">
            <div className="text-lg font-medium text-green-800 dark:text-green-200">Sipariş No</div>
            <div className="flex items-center justify-center space-x-3">
              <span className="font-mono text-xl bg-green-100 dark:bg-green-800 px-4 py-2 rounded-lg font-bold">
                {result.orderNumber}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(result.orderNumber || '')}
                className="h-8 w-8 p-0 hover:bg-green-200 dark:hover:bg-green-700"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={refreshPage}
          className="flex-1 rounded-lg dark:rounded-xl"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Sayfayı Yenile
        </Button>
        <Button 
          onClick={onClose} 
          className="flex-1 rounded-lg dark:rounded-xl"
        >
          Tamam
        </Button>
      </div>
    </div>
  )

  const renderErrorContent = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
        <XCircle className="w-10 h-10 text-red-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
          Ödeme Başarısız
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
        </p>
        
        {/* Detaylı hata bilgisi */}
        {(result.errorCode || result.errorGroup || result.errorName || result.errorMessage) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-left">
            <div className="text-sm text-red-800 dark:text-red-200">
              <div className="font-medium mb-2">Hata Detayları:</div>
              {result.errorCode && (
                <div className="mb-1">
                  <span className="font-medium">Hata Kodu:</span> {result.errorCode}
                </div>
              )}
              {result.errorGroup && (
                <div className="mb-1">
                  <span className="font-medium">Hata Grubu:</span> {result.errorGroup}
                </div>
              )}
              {result.errorName && (
                <div className="mb-1">
                  <span className="font-medium">Hata Adı:</span> {result.errorName}
                </div>
              )}
              {result.errorMessage && (
                <div className="mb-1">
                  <span className="font-medium">Hata Mesajı:</span> {result.errorMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={onClose} 
          className="flex-1 rounded-lg dark:rounded-xl"
        >
          Kapat
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Konfeti Animasyonu */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md mx-auto rounded-xl dark:rounded-2xl bg-white dark:bg-gray-800">
          <DialogHeader className="relative">
            <DialogTitle className="text-center">
              {result.status === 'error' && 'Ödeme Başarısız'}
            </DialogTitle>
          </DialogHeader>

          {/* İçerik */}
          {result.status === 'success' && renderSuccessContent()}
          {result.status === 'error' && renderErrorContent()}
        </DialogContent>
      </Dialog>
    </>
  )
}
