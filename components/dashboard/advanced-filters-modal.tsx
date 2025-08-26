"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { Settings, RotateCcw, Save, Info } from 'lucide-react'

export interface FilterSettings {
  institution_filter?: string
  limit: number
  similarity_threshold: number
  use_cache: boolean
}

interface AdvancedFiltersModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: FilterSettings
  onSettingsChange: (settings: FilterSettings) => void
}

const INSTITUTIONS = [
  { value: "all", label: "Tüm Kurumlar" },
  { value: "anayasa_mahkemesi", label: "Anayasa Mahkemesi" },
  { value: "danistay", label: "Danıştay" },
  { value: "yargitay", label: "Yargıtay" },
  { value: "sayistay", label: "Sayıştay" },
  { value: "sgk", label: "Sosyal Güvenlik Kurumu" },
  { value: "tbmm", label: "TBMM" },
  { value: "cumhurbaskanligi", label: "Cumhurbaşkanlığı" },
  { value: "bakanliklar", label: "Bakanlıklar" },
]

export function AdvancedFiltersModal({ 
  open, 
  onOpenChange, 
  settings, 
  onSettingsChange 
}: AdvancedFiltersModalProps) {
  const [localSettings, setLocalSettings] = useState<FilterSettings>(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    console.log('🔧 Modal: Kaydedilen ayarlar:', localSettings)
    onSettingsChange(localSettings)
    onOpenChange(false)
  }

  const handleReset = () => {
    const defaultSettings: FilterSettings = {
      institution_filter: "",
      limit: 5,
      similarity_threshold: 0.5,
      use_cache: false
    }
    setLocalSettings(defaultSettings)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Detaylı Filtreleme
          </DialogTitle>
        </DialogHeader>

        <TooltipProvider delayDuration={0}>
          <div className="space-y-6">
          {/* Kurum Seç */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Kurum Seç
              </Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3 h-3 text-blue-500 dark:text-blue-400 cursor-help animate-pulse hover:animate-none" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">Aramanızı belirli bir kurumla sınırlandırabilirsiniz. Tüm kurumlar seçildiğinde bütün kaynaklarda arama yapılır.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Select
              value={localSettings.institution_filter || "all"}
              onValueChange={(value) => 
                setLocalSettings(prev => ({ 
                  ...prev, 
                  institution_filter: value === "all" ? undefined : value 
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Kurum seçin" />
              </SelectTrigger>
              <SelectContent>
                {INSTITUTIONS.map((institution) => (
                  <SelectItem key={institution.value} value={institution.value}>
                    {institution.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kaynak Sayısı */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kaynak Sayısı
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-blue-500 dark:text-blue-400 cursor-help animate-pulse hover:animate-none" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">Cevabınızda kaç adet kaynak belge kullanılacağını belirler. Daha fazla kaynak daha kapsamlı cevap sağlar ancak daha fazla kredi harcar.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {localSettings.limit}
              </span>
            </div>
            <Slider
              value={[localSettings.limit]}
              onValueChange={(value) => 
                setLocalSettings(prev => ({ ...prev, limit: value[0] }))
              }
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Benzerlik Eşiği */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Benzerlik Eşiği
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-blue-500 dark:text-blue-400 cursor-help animate-pulse hover:animate-none" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">Sorunuzla ne kadar benzer belgelerin dahil edileceğini belirler:</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• %30: Geniş arama - Daha fazla sonuç</li>
                      <li>• %50: Dengeli - Varsayılan ayar</li>
                      <li>• %70: Sıkı arama - Daha kaliteli sonuç</li>
                      <li>• %100: En sıkı - Sadece çok benzer</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                %{Math.round(localSettings.similarity_threshold * 100)}
              </span>
            </div>
            <Slider
              value={[localSettings.similarity_threshold]}
              onValueChange={(value) => 
                setLocalSettings(prev => ({ ...prev, similarity_threshold: value[0] }))
              }
              max={1.0}
              min={0.3}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>%30 (Geniş)</span>
              <span>%100</span>
            </div>
          </div>

          {/* Hafızadaki Cevap */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hafızadaki Cevap
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-blue-500 dark:text-blue-400 cursor-help animate-pulse hover:animate-none" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 p-3 rounded-lg shadow-lg">
                  <p className="text-sm">Daha önce sorulmuş benzer sorular için kaydedilmiş cevapları kullanır. Açık olduğunda daha hızlı yanıt alırsınız ve daha az kredi harcar.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Switch
              checked={localSettings.use_cache}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, use_cache: checked }))
              }
            />
          </div>
        </div>
        </TooltipProvider>

        {/* Butonlar */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sıfırla</span>
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Kaydet</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}