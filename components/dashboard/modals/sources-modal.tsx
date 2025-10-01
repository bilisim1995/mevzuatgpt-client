"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FileText, ExternalLink, Star } from 'lucide-react'

interface SourcesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sources: number
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

export function SourcesModal({ open, onOpenChange, sources, sourcesData }: SourcesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            {sourcesData && sourcesData.length > 0 ? `Kaynak Bilgileri (${sourcesData.length})` : (
              <p className="text-gray-600 dark:text-gray-400">
                {sourcesData === undefined ? 'Kaynak bilgileri yükleniyor...' : 'Kaynak bilgisi bulunamadı.'}
              </p>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {sourcesData && sourcesData.length > 0 ? (
            sourcesData.map((source, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <button
                      onClick={() => {
                        if (source.pdf_url) {
                          window.open(source.pdf_url, '_blank', 'noopener,noreferrer')
                        } else {
                          console.warn('PDF URL bulunamadı:', source)
                        }
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm flex items-center transition-colors group cursor-pointer"
                    >
                      <FileText className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                      {source.document_title || 'Belge'}
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {source.citation}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {(source.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-100 dark:bg-slate-700/30 rounded p-3 mb-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {source.content_preview}
                  </p>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>Sayfa {source.page_number}</span>
                    <span>Satır {source.line_start}-{source.line_end}</span>
                    <span>Chunk #{source.chunk_index}</span>
                  </div>
                  {source.pdf_url && (
                    <button
                      onClick={() => {
                        window.open(source.pdf_url, '_blank', 'noopener,noreferrer')
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors flex items-center"
                    >
                      PDF'i Aç
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Kaynak bilgisi bulunamadı.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}