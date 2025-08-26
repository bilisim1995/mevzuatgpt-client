"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Coins, CreditCard } from 'lucide-react'

interface CreditWarningModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBalance: number
}

export function CreditWarningModal({ open, onOpenChange, currentBalance }: CreditWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-400" />
            Kredi Yetersiz
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Uyarı Mesajı */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700/30">
            <div className="flex items-center mb-3">
              <Coins className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <span className="text-red-700 dark:text-red-300 font-medium">Mevcut Krediniz</span>
            </div>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              {currentBalance} Kredi
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Soru sormak için en az 1 krediniz olması gerekiyor.
            </p>
          </div>

          {/* Bilgilendirme */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50">
            <h4 className="text-gray-900 dark:text-white font-medium mb-3 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Kredi Nasıl Alınır?
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>• Yöneticinizle iletişime geçin</p>
              <p>• Kredi paketinizi yenileyin</p>
              <p>• Hesap ayarlarınızı kontrol edin</p>
            </div>
          </div>

          {/* Kapatma Butonu */}
          <div className="flex justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white"
            >
              Anladım
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}