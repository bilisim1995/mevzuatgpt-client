"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Activity, Search, Cpu, Database, Zap, Info, Clock, HardDrive } from 'lucide-react'
import { SearchStats } from '@/services/api'

interface PerformanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  performanceData: { search_stats: SearchStats }
  sourcesData?: Array<{
    document_title: string
    pdf_url: string
    page_number: number
    line_start: number
    line_end: number
    citation: string
    content_preview: string
    similarity_score: number
    chunk_index: number
  }>
}

export function PerformanceModal({ open, onOpenChange, performanceData, sourcesData }: PerformanceModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            <Activity className="inline-block w-5 h-5 mr-2" />
            Performans Detayları
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3">
          {sourcesData && sourcesData.length > 0 ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2.5 border border-blue-200 dark:border-blue-700/30">
              <div className="flex items-center mb-2">
                <Search className="w-4 h-4 text-blue-600 dark:text-blue-300 mr-2" />
                <div className="text-blue-700 dark:text-blue-300 font-medium text-xs">Bulunan Belge</div>
              </div>
              <div className="text-gray-900 dark:text-white font-semibold text-base">{performanceData.search_stats.total_chunks_found} adet</div>
            </div>
          ) : null}
            
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2.5 border border-purple-200 dark:border-purple-700/30">
            <div className="flex items-center mb-2">
              <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-300 mr-2" />
              <div className="text-purple-700 dark:text-purple-300 font-medium text-xs">Vektör Çevirme</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">{performanceData.search_stats.embedding_time_ms}ms</div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2.5 border border-green-200 dark:border-green-700/30">
            <div className="flex items-center mb-2">
              <Database className="w-4 h-4 text-green-600 dark:text-green-300 mr-2" />
              <div className="text-green-700 dark:text-green-300 font-medium text-xs">Veritabanı Arama</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">{performanceData.search_stats.search_time_ms}ms</div>
          </div>
          
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-2.5 border border-cyan-200 dark:border-cyan-700/30">
            <div className="flex items-center mb-2">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-300 mr-2" />
              <div className="text-cyan-700 dark:text-cyan-300 font-medium text-xs">Cevap Üretme</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">{performanceData.search_stats.generation_time_ms}ms</div>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2.5 border border-amber-200 dark:border-amber-700/30">
            <div className="flex items-center mb-2">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-300 mr-2" />
              <div className="text-amber-700 dark:text-amber-300 font-medium text-xs">Güvenilirlik</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">{performanceData.search_stats.reliability_time_ms}ms</div>
          </div>
          
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-2.5 border border-red-200 dark:border-red-700/30">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-red-600 dark:text-red-300 mr-2" />
              <div className="text-red-700 dark:text-red-300 font-medium text-xs">Toplam Süre</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">
              {(performanceData.search_stats.total_pipeline_time_ms / 1000).toFixed(1)}s
            </div>
          </div>
        
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-2.5 border border-indigo-200 dark:border-indigo-700/30">
            <div className="flex items-center justify-center mb-2">
              <HardDrive className="w-4 h-4 text-indigo-600 dark:text-indigo-300 mr-2" />
              <div className="text-indigo-700 dark:text-indigo-300 font-medium text-xs">Önbellek Durumu</div>
            </div>
            <div className="text-gray-900 dark:text-white font-semibold text-base">
              {performanceData.search_stats.cache_used ? 'Kullanıldı' : 'Kullanılmadı'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}