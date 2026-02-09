"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Info } from 'lucide-react'

interface ReliabilityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reliabilityData: any
}

interface CriterionData {
  score?: number
  weight?: number
  description?: string
  details?: string[]
}
const getCriterionLabel = (key: string) => {
  switch (key) {
    case 'source_quality':
    case 'source_reliability':
      return 'Kaynak Güvenilirliği'
    case 'content_consistency':
      return 'İçerik Tutarlılığı'
    case 'technical_accuracy':
      return 'Teknik Doğruluk'
    case 'currency':
      return 'Güncellik'
    default:
      return key
  }
}

const getCriterionWeight = (criteria: Record<string, CriterionData>, key: string) => {
  if (criteria[key]?.weight !== undefined) return criteria[key]?.weight || 0
  if (key === 'source_reliability' && criteria.source_quality?.weight !== undefined) {
    return criteria.source_quality?.weight || 0
  }
  if (key === 'source_quality' && criteria.source_reliability?.weight !== undefined) {
    return criteria.source_reliability?.weight || 0
  }
  return 0
}

export function ReliabilityModal({ open, onOpenChange, reliabilityData }: ReliabilityModalProps) {
  // Güvenlik kontrolü - reliabilityData null ise varsayılan değerleri kullan
  const safeReliabilityData = reliabilityData || {
    overall_score: 0,
    explanation: "Güvenirlik verisi bulunamadı.",
    criteria: {},
    score_ranges: {
      high: { min: 80, max: 100, desc: "Yüksek güvenirlik" },
      medium: { min: 60, max: 79, desc: "Orta güvenirlik" },
      low: { min: 0, max: 59, desc: "Düşük güvenirlik" }
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-blue-400'
    return 'text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-blue-500'
    return 'bg-red-500'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Güvenirlik Skoru Detayları
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Genel Skor */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Genel Skor</h3>
              <span className={`text-2xl font-bold ${getScoreColor(safeReliabilityData.overall_score)}`}>
                {safeReliabilityData.overall_score}%
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {safeReliabilityData.explanation}
            </p>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${getProgressColor(safeReliabilityData.overall_score)}`}
                style={{ width: `${safeReliabilityData.overall_score}%` }}
              ></div>
            </div>
          </div>

          {/* Kriterler */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(safeReliabilityData.criteria || {}).map(([key, criterion]) => {
              const criterionData = criterion as CriterionData
              return (
              <div key={key} className="bg-gray-50 dark:bg-slate-800/30 rounded-lg p-4 border border-gray-200 dark:border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {getCriterionLabel(key)}
                  </h4>
                  <span className={`text-sm font-semibold ${getScoreColor(criterionData.score || 0)}`}>
                    {(criterionData.score || 0)}%
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {criterionData.description || 'Açıklama bulunamadı'}
                </p>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(criterionData.score || 0)}`}
                    style={{ width: `${criterionData.score || 0}%` }}
                  ></div>
                </div>
                <div className="space-y-1">
                  {(criterionData.details || []).map((detail, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></div>
                      {detail}
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                  Ağırlık: %{criterionData.weight || 0}
                </div>
              </div>
            )})}
          </div>

          {/* Skor Aralıkları */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skor Aralıkları</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700/30">
                <div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Yüksek</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                    {safeReliabilityData.score_ranges.high.min}-{safeReliabilityData.score_ranges.high.max}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{safeReliabilityData.score_ranges.high.desc}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Orta</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                    {safeReliabilityData.score_ranges.medium.min}-{safeReliabilityData.score_ranges.medium.max}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{safeReliabilityData.score_ranges.medium.desc}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700/30">
                <div>
                  <span className="text-red-600 dark:text-red-400 font-medium">Düşük</span>
                  <span className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                    {safeReliabilityData.score_ranges.low.min}-{safeReliabilityData.score_ranges.low.max}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{safeReliabilityData.score_ranges.low.desc}</p>
              </div>
            </div>
          </div>

          {/* Hesaplama Yöntemi */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-6 border border-gray-200 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skor Hesaplama Yöntemi</h3>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Her kriter için ayrı değerlendirme yapılır ve ağırlıklı ortalama alınır.
                Kriterler önem derecelerine göre farklı ağırlıklara sahiptir.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Kaynak Güvenilirliği</span>
                    <span className="text-gray-600 dark:text-gray-400">%{getCriterionWeight(safeReliabilityData.criteria, 'source_reliability')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">İçerik Tutarlılığı</span>
                    <span className="text-gray-600 dark:text-gray-400">%{(safeReliabilityData.criteria.content_consistency as CriterionData)?.weight || 0}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Teknik Doğruluk</span>
                    <span className="text-gray-600 dark:text-gray-400">%{(safeReliabilityData.criteria.technical_accuracy as CriterionData)?.weight || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300">Güncellik</span>
                    <span className="text-gray-600 dark:text-gray-400">%{(safeReliabilityData.criteria.currency as CriterionData)?.weight || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-100 dark:bg-slate-700/30 rounded-lg p-4 mt-4">
                <h4 className="text-gray-900 dark:text-white font-medium mb-2">Hesaplama Formülü</h4>
                <code className="text-cyan-400 text-sm">
                  Toplam Skor = (Kaynak × 0.30) + (Tutarlılık × 0.25) + (Teknik × 0.25) + (Güncellik × 0.20)
                </code>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">
                  Her kriter 0-100 arasında puanlanır ve ağırlıklı ortalama alınır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}