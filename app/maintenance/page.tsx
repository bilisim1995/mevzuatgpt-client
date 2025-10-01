"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, RefreshCw, LogIn } from 'lucide-react'
import { maintenanceService } from '@/services/maintenance'
import Link from 'next/link'

interface MaintenanceStatus {
  is_enabled: boolean
  title: string
  message: string
  start_time: string | null
  end_time: string | null
}

export default function MaintenancePage() {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    checkMaintenanceStatus()
    
    // Her 30 saniyede bir kontrol et
    const interval = setInterval(checkMaintenanceStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      const response = await maintenanceService.checkMaintenanceStatus()
      if (response.success) {
        setMaintenanceData(response.data)
        
        // Eğer bakım modu kapalıysa login sayfasına yönlendir
        if (!response.data.is_enabled) {
          window.location.href = '/login'
        }
      }
    } catch (error) {
   
    } finally {
      setLoading(false)
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                Sistem Durumu Kontrol Ediliyor
              </span>
            </h3>
          </div>
          
          <div className="flex items-center justify-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
            <div className="w-3 h-3 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
            <div className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.45s'}}></div>
            <div className="w-3 h-3 bg-red-500 dark:bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={mounted && resolvedTheme === 'dark' ? "/Logo (2).png" : "/Logo-Siyah.png"}
            alt="Mevzuat GPT" 
            className="h-12 w-auto mx-auto mb-6"
            // --- DÜZELTİLEN BÖLÜM BAŞLANGICI ---
            onError={(e) => {
              const target = e.target as HTMLImageElement;
             
              target.src = "/Logo-Siyah.png"; // Fallback olarak her zaman çalışan bir logo ata
            }}
            // --- DÜZELTİLEN BÖLÜM SONU ---
          />
        </div>

        {/* Bakım Kartı */}
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
          
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
              {maintenanceData?.title || 'Sistem Bakımda'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            {/* Mesaj */}
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700/30">
              <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                {maintenanceData?.message || 'Sistem şu anda bakımda. Lütfen daha sonra tekrar deneyin.'}
              </p>
            </div>

            {/* Zaman Bilgileri */}
            {(maintenanceData?.start_time || maintenanceData?.end_time) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700/50">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Bakım Zamanları
                </h3>
                <div className="space-y-3">
                  {maintenanceData.start_time && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Başlangıç:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDateTime(maintenanceData.start_time)}
                      </span>
                    </div>
                  )}
                  {maintenanceData.end_time && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Bitiş:</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {formatDateTime(maintenanceData.end_time)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aksiyonlar */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={checkMaintenanceStatus}
                variant="outline"
                className="flex-1 h-12 text-sm font-medium border-2 border-gray-300 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500 transition-all duration-200"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Durumu Yenile
              </Button>
              
              <Link href="/login" className="flex-1">
                <Button className="w-full h-12 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl">
                  <LogIn className="w-4 h-4 mr-2" />
                  Giriş Sayfasına Dön
                </Button>
              </Link>
            </div>

            {/* Bilgilendirme */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sistem otomatik olarak kontrol edilmektedir. Bakım tamamlandığında otomatik yönlendirileceksiniz.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            <a
              href="https://orbitinovasyon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              Orbit İnovasyon Ltd.
            </a>
            tarafından geliştirildi
          </p>
        </div>
      </div>
    </div>
  )
}