"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Coins } from 'lucide-react'

interface CreditInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  creditsUsed: number
}

export function CreditInfoModal({ open, onOpenChange, creditsUsed }: CreditInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Kredi Sistemi Hakkında
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Neden Kredi Sistemi */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Neden Kredi Sistemi?</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700/30">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">🏗️ Altyapı Maliyetleri</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Yüksek performanslı sunucular, veri depolama ve işleme sistemleri için sürekli yatırım gerekiyor
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700/30">
                <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">🤖 AI Model Maliyetleri</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Özel eğitilmiş yapay zeka modellerinin çalıştırılması ve güncellenmesi önemli işlem gücü gerektiriyor
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700/30">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">♻️ Sürdürülebilirlik</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  Kredi sistemi, hizmetin devamlılığını ve kalitesini korumak için gerekli kaynakları sağlıyor
                </p>
              </div>
            </div>
          </div>

          {/* Kredi Hesaplama */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kredi Hesaplama</h3>
            <div className="space-y-4">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4 border border-cyan-200 dark:border-cyan-700/30">
                <h4 className="font-medium text-cyan-700 dark:text-cyan-300 mb-2">🔵 Temel Kredi (1 Kredi)</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                  Her soru için başlangıç olarak 1 kredi kullanılır
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Bu, sorunun işleme alınması için gereken minimum kredidir
                </p>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-700/30">
                <h4 className="font-medium text-amber-700 dark:text-amber-300 mb-2">🟢 Soru Uzunluğuna Göre Ek Kredi</h4>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                  Her 100 karakter için +1 kredi eklenir
                </p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">Örnek hesaplamalar:</p>
                  <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 ml-4">
                    <p>• 250 karakterlik soru = 1 (temel) + 3 (karakter bazlı) = 4 kredi</p>
                    <p>• 520 karakterlik soru = 1 (temel) + 6 (karakter bazlı) = 7 kredi</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-slate-700/30 rounded-lg p-4">
                <h4 className="text-gray-900 dark:text-white font-medium mb-2">📊 Toplam Hesaplama Formülü</h4>
                <code className="text-cyan-400 text-sm block bg-slate-800/50 p-3 rounded border">
                  Toplam Kredi = Temel Kredi (1) + Karakter Kredisi (soru_uzunluğu/100)
                </code>
              </div>
            </div>
          </div>

          {/* Sistem Faydaları */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bu kredi sistemi:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                Kullanım miktarını adil şekilde ölçümlüyor
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                Detaylı cevapları teşvik ediyor
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                Kaynak kullanımını özendiriyor
              </div>
              <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
                Sistem kaynaklarının verimli kullanımını sağlıyor
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}