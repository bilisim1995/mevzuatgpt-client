"use client"

import { useState } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Minus, RotateCcw, Search, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FullscreenAnswerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  answer: string
  question: string
}

export function FullscreenAnswerModal({ open, onOpenChange, answer, question }: FullscreenAnswerModalProps) {
  const [fontSize, setFontSize] = useState(16) // Base font size in px
  
  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24)) // Max 24px
  }
  
  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12)) // Min 12px
  }
  
  const resetFontSize = () => {
    setFontSize(16) // Reset to default
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[95vh] bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 flex flex-col">
        <DialogHeader className="flex-shrink-0 border-b border-gray-200 dark:border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Cevap Detayı
            </DialogTitle>
            
            {/* Font Size Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 px-2 min-w-[3rem] text-center">
                  {fontSize}px
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-slate-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                
                <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1"></div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFontSize}
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-slate-700"
                  title="Varsayılan boyuta sıfırla"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Answer Content */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                style={{ fontSize: `${fontSize}px` }}
              >
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Başlıklar
                    h1: ({children}) => (
                      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white border-b-2 border-blue-500 pb-3">
                        {children}
                      </h1>
                    ),
                    h2: ({children}) => (
                      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-l-4 border-blue-500 pl-4 bg-blue-50 dark:bg-blue-900/20 py-2 rounded-r-lg">
                        {children}
                      </h2>
                    ),
                    h3: ({children}) => (
                      <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                        {children}
                      </h3>
                    ),
                    
                    // Paragraflar
                    p: ({children}) => (
                      <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
                        {children}
                      </p>
                    ),
                    
                    // Listeler
                    ul: ({children}) => (
                      <ul className="mb-4 pl-6 space-y-2 text-gray-800 dark:text-gray-200 list-disc">
                        {children}
                      </ul>
                    ),
                    ol: ({children}) => (
                      <ol className="mb-4 pl-6 space-y-2 text-gray-800 dark:text-gray-200 list-decimal">
                        {children}
                      </ol>
                    ),
                    li: ({children}) => (
                      <li className="text-gray-800 dark:text-gray-200 relative pl-2">
                        {children}
                      </li>
                    ),
                    
                    // Vurgular
                    strong: ({children}) => (
                      <strong className="font-semibold text-gray-900 dark:text-white bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">
                        {children}
                      </strong>
                    ),
                    em: ({children}) => (
                      <em className="italic text-blue-600 dark:text-blue-400 font-medium">
                        {children}
                      </em>
                    ),
                    
                    // Kod
                    code: ({className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '')
                      const isCodeBlock = match && className
                      
                      return isCodeBlock ? (
                         <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-6 rounded-lg overflow-x-auto mb-4 text-sm border-l-4 border-blue-500 shadow-lg">
                           <code className={className} {...props}>{children}</code>
                         </pre>
                      ) : (
                        <code className="bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-sm font-mono border border-gray-300 dark:border-gray-600" {...props}>
                          {children}
                        </code>
                      )
                    },
                    pre: ({children}) => <>{children}</>,
                    
                    // Alıntılar
                    blockquote: ({children}) => (
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 pl-6 py-4 mb-4 rounded-r-lg relative">
                        <div className="absolute top-2 left-2 text-blue-400 text-2xl font-serif"></div>
                        <div className="italic text-gray-700 dark:text-gray-300 ml-4">
                          {children}
                        </div>
                      </blockquote>
                    ),
                    
                    // Linkler
                    a: ({href, children}) => (
                      <a 
                        href={href} 
                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-500 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 py-0.5 rounded transition-all duration-200" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    
                    // Tablolar
                    table: ({children}) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({children}) => (
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        {children}
                      </thead>
                    ),
                    tbody: ({children}) => (
                      <tbody className="bg-white dark:bg-gray-900">
                        {children}
                      </tbody>
                    ),
                    tr: ({children}) => (
                      <tr className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        {children}
                      </tr>
                    ),
                    th: ({children}) => (
                      <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-r border-gray-300 dark:border-gray-600 last:border-r-0">
                        {children}
                      </th>
                    ),
                    td: ({children}) => (
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}