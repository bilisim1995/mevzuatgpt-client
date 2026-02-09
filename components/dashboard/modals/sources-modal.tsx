"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, ExternalLink, BookOpen, Hash, Layers, ChevronRight, Search } from 'lucide-react'

interface SourcesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sources: number
  sourcesData?: Array<{
    document_title: string
    pdf_url?: string
    page_number?: number
    line_start?: number
    line_end?: number
    citation: string
    content_preview: string
    similarity_score: number
    chunk_index?: number
  }>
}

const getScoreColor = (score: number) => {
  if (score >= 70) return { bar: 'bg-green-500', text: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700/40' }
  if (score >= 50) return { bar: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700/40' }
  return { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-700/40' }
}

export function SourcesModal({ open, onOpenChange, sources, sourcesData }: SourcesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-2xl p-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              {sourcesData && sourcesData.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span>Kaynak Bilgileri</span>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    {sourcesData.length}
                  </span>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 font-normal text-base">
                  {sourcesData === undefined ? 'Kaynak bilgileri yükleniyor...' : 'Kaynak bilgisi bulunamadı'}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-3">
            {sourcesData && sourcesData.length > 0 ? (
              sourcesData.map((source, index) => {
                const scorePercent = Math.round(source.similarity_score * 100)
                const colors = getScoreColor(scorePercent)

                return (
                  <div
                    key={index}
                    className="group rounded-xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-800/40 hover:border-gray-300 dark:hover:border-slate-600 hover:shadow-sm transition-all duration-200 overflow-hidden"
                  >
                    {/* Kaynak Header */}
                    <div className="flex items-start gap-3 p-4 pb-3">
                      {/* Sıra Numarası */}
                      <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 dark:bg-slate-700/60 text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                        {index + 1}
                      </div>

                      {/* Başlık ve Atıf */}
                      <div className="flex-1 min-w-0">
                        {source.pdf_url ? (
                          <button
                            onClick={() => window.open(source.pdf_url, '_blank', 'noopener,noreferrer')}
                            className="text-left w-full group/link"
                          >
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover/link:text-blue-500 dark:group-hover/link:text-blue-300 truncate transition-colors">
                                {source.document_title || 'Belge'}
                              </span>
                              <ExternalLink className="w-3 h-3 text-blue-400 dark:text-blue-500 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {source.document_title || 'Belge'}
                            </span>
                          </div>
                        )}
                        {source.citation && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                            {source.citation}
                          </p>
                        )}
                      </div>

                      {/* Benzerlik Skoru */}
                      <div className={`flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-lg border ${colors.bg} ${colors.border}`}>
                        <span className={`text-sm font-bold ${colors.text}`}>
                          %{scorePercent}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-500 leading-none">benzerlik</span>
                      </div>
                    </div>

                    {/* Icerik Onizleme */}
                    {source.content_preview && (
                      <div className="mx-4 mb-3 bg-gray-50 dark:bg-slate-700/20 rounded-lg p-3 border border-gray-100 dark:border-slate-700/30">
                        <p className="text-[13px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                          {source.content_preview}
                        </p>
                      </div>
                    )}

                    {/* Alt Bilgiler */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/60 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 flex-wrap">
                        {typeof source.page_number === 'number' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/50 text-xs text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-3 h-3" />
                            Sayfa {source.page_number}
                          </span>
                        )}
                        {typeof source.line_start === 'number' && typeof source.line_end === 'number' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/50 text-xs text-gray-600 dark:text-gray-400">
                            <Hash className="w-3 h-3" />
                            Satır {source.line_start}-{source.line_end}
                          </span>
                        )}
                        {typeof source.chunk_index === 'number' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600/50 text-xs text-gray-600 dark:text-gray-400">
                            <Layers className="w-3 h-3" />
                            Parça #{source.chunk_index}
                          </span>
                        )}
                      </div>
                      {source.pdf_url && (
                        <button
                          onClick={() => window.open(source.pdf_url, '_blank', 'noopener,noreferrer')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 transition-colors"
                        >
                          PDF Aç
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 mb-4">
                  <Search className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">Kaynak bulunamadı</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Bu cevap için henüz kaynak bilgisi mevcut değil.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
