"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Shield, Zap, Clock, Check, Building, Users, Award } from 'lucide-react'
import { toast } from 'sonner'

interface CreditPurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CREDIT_PACKAGES = [
  {
    id: 'basic',
    name: 'Temel Paket',
    credits: 100,
    price: 59,
    originalPrice: 79,
    pricePerCredit: 0.59,
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    bgGradient: 'from-slate-50/90 to-gray-50/90 dark:from-slate-900/90 dark:to-gray-900/90',
    borderGradient: 'from-slate-200/60 to-gray-200/60 dark:from-slate-700/60 dark:to-gray-700/60',
    icon: Building,
    popular: false,
    features: [
      'Temel sorgulama hizmetleri',
      'Standart güvenilirlik analizi',
      'E-posta desteği'
    ]
  },
  {
    id: 'professional',
    name: 'Profesyonel Paket',
    credits: 500,
    price: 249,
    originalPrice: 349,
    pricePerCredit: 0.50,
    gradient: 'from-blue-600 via-blue-700 to-indigo-800',
    bgGradient: 'from-blue-50/90 to-indigo-50/90 dark:from-blue-900/90 dark:to-indigo-900/90',
    borderGradient: 'from-blue-200/60 to-indigo-200/60 dark:from-blue-700/60 dark:to-indigo-700/60',
    icon: Users,
    popular: true,
    features: [
      'Gelişmiş sorgulama özellikleri',
      'Detaylı güvenilirlik raporları',
      'Öncelikli telefon desteği',
      'Özel filtreler ve arama seçenekleri'
    ]
  },
  {
    id: 'enterprise',
    name: 'Kurumsal Paket',
    credits: 2000,
    price: 799,
    originalPrice: 1199,
    pricePerCredit: 0.40,
    gradient: 'from-emerald-600 via-teal-700 to-cyan-800',
    bgGradient: 'from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/90 dark:to-teal-900/90',
    borderGradient: 'from-emerald-200/60 to-teal-200/60 dark:from-emerald-700/60 dark:to-teal-700/60',
    icon: Award,
    popular: false,
    features: [
      'Sınırsız sorgulama özellikleri',
      'Kapsamlı analiz raporları',
      'Özel hesap yöneticisi',
      'Kurumsal entegrasyon desteği',
      'Özelleştirilmiş çözümler'
    ]
  }
]

export function CreditPurchaseModal({ open, onOpenChange }: CreditPurchaseModalProps) {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [purchasing, setPurchasing] = useState(false)

  const handlePurchase = async (packageId: string) => {
    const pkg = CREDIT_PACKAGES.find(p => p.id === packageId)
    if (!pkg) return

    setSelectedPackage(packageId)
    setPurchasing(true)

    try {
      // Simulated purchase process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(`${pkg.name} başarıyla satın alındı! ${pkg.credits.toLocaleString()} hizmet hakkı hesabınıza eklendi.`)
      onOpenChange(false)
    } catch (error) {
      toast.error('Satın alma işlemi başarısız oldu. Lütfen tekrar deneyin.')
    } finally {
      setPurchasing(false)
      setSelectedPackage(null)
    }
  }

  // Modal kapatıldığında tüm etkileri temizle
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedPackage(null)
      setPurchasing(false)
      
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-3xl">
        {/* Kapat Butonu */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenChange(false)}
          className="absolute right-4 top-4 z-50 h-8 w-16 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          Kapat
        </Button>
        {/* Header */}
        <DialogHeader className="pb-3 border-b border-gray-200/30 dark:border-gray-700/30">
          <div className="text-center">
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Hizmet Satın Al
            </DialogTitle>
            
            {/* Security info */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Shield className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Zap className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Anında Aktivasyon</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Clock className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">7/24 Destek</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
            {CREDIT_PACKAGES.map((pkg) => {
              const IconComponent = pkg.icon
              const isSelected = selectedPackage === pkg.id
              const isPurchasing = purchasing && isSelected

              return (
                <div
                  key={pkg.id}
                  className={`relative group cursor-pointer transition-all duration-500 ${
                    pkg.popular ? 'lg:scale-105' : ''
                  } hover:scale-105 hover:-translate-y-2`}
                >
                  {/* Popular badge */}
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 text-xs font-bold shadow-xl rounded-full animate-pulse">
                        ÖNERİLEN
                      </Badge>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative h-full rounded-2xl p-6 backdrop-blur-xl border-2 transition-all duration-500 group-hover:shadow-2xl flex flex-col ${
                    pkg.popular 
                      ? 'shadow-xl border-blue-300/60 dark:border-blue-600/60 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20' 
                      : 'shadow-lg hover:shadow-xl border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80'
                  } group-hover:border-opacity-80`}>
                    {/* Background */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pkg.bgGradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pkg.borderGradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="text-center mb-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.gradient} shadow-lg mb-2 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <IconComponent className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                          {pkg.name}
                        </h3>
                        
                        <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg p-2 mb-2 border border-gray-200/60 dark:border-gray-700/60 shadow-inner">
                          <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                            {pkg.credits.toLocaleString()}
                          </div>
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                            Hizmet Hakkı
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <span className="text-lg font-black text-gray-900 dark:text-white">
                            ₺{pkg.price}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through opacity-75">
                            ₺{pkg.originalPrice}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-3 font-medium">
                          Hizmet Hakkı başına ₺{pkg.pricePerCredit.toFixed(2)}
                        </div>
                      </div>

                      <div className="space-y-1 mb-4 flex-1">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-start space-x-2 text-xs text-gray-700 dark:text-gray-300">
                            <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="leading-relaxed">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto">
                        <Button
                          onClick={() => handlePurchase(pkg.id)}
                          disabled={purchasing}
                          className={`w-full h-9 rounded-lg font-bold text-white shadow-lg transition-all duration-500 transform ${
                            isPurchasing
                              ? 'bg-gray-400 cursor-not-allowed scale-95'
                              : `bg-gradient-to-r ${pkg.gradient} hover:shadow-2xl hover:scale-105 hover:-translate-y-1 active:scale-95 active:translate-y-0`
                          }`}
                        >
                          {isPurchasing ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span className="text-xs">İşleniyor...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <CreditCard className="w-4 h-4 drop-shadow-sm" />
                              <span className="text-xs tracking-wide">Satın Al</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-200/40 dark:border-gray-700/40 pt-3 bg-gray-50/50 dark:bg-gray-800/30 rounded-b-3xl">
          <div className="flex items-center justify-center">
            <img 
              src="./logo_band_colored.svg" 
              alt="Ödeme Yöntemleri" 
              className="h-8 opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}