"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, History, BarChart3, Clock, Coins, FileText, ExternalLink, Star, TrendingUp, Calendar, Target } from 'lucide-react'
import { apiService, SearchHistoryItem, SearchHistoryStats } from '@/services/api'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const INSTITUTIONS = [
  { value: "all", label: "Tüm Kurumlar" },
  { value: "SGK", label: "Sosyal Güvenlik Kurumu" },
  { value: "Çalışma Bakanlığı", label: "Çalışma Bakanlığı" },
  { value: "Anayasa Mahkemesi", label: "Anayasa Mahkemesi" },
  { value: "Danıştay", label: "Danıştay" },
  { value: "Yargıtay", label: "Yargıtay" },
  { value: "Sayıştay", label: "Sayıştay" },
  { value: "TBMM", label: "TBMM" },
  { value: "Cumhurbaşkanlığı", label: "Cumhurbaşkanlığı" },
  { value: "Bakanlıklar", label: "Bakanlıklar" },
]

export function SearchHistoryPanel() {
  const [activeTab, setActiveTab] = useState('history')
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [stats, setStats] = useState<SearchHistoryStats['data'] | null>(null)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filters
  const [institutionFilter, setInstitutionFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    if (activeTab === 'history') {
      loadSearchHistory(1, true)
    } else if (activeTab === 'stats') {
      loadStats()
    }
  }, [activeTab])

  // Reset pagination when filters change
  useEffect(() => {
    if (activeTab === 'history') {
      setCurrentPage(1)
      loadSearchHistory(1, true)
    }
  }, [institutionFilter, searchTerm])

  const loadSearchHistory = async (pageNum: number, reset: boolean = false) => {
    if (reset) {
      setLoading(true)
      setSearchHistory([])
    } else {
      setLoadingMore(true)
    }
    
    try {
      const response = await apiService.getSearchHistory({
        page: pageNum,
        limit: itemsPerPage,
        institution: institutionFilter === 'all' ? undefined : institutionFilter || undefined
      })
      
      if (response.success) {
        // Normalize data to ensure sources is always an array
        const normalizedItems = response.data.items.map(item => ({
          ...item,
          sources: item.sources || []
        }))
        
        if (reset) {
          setSearchHistory(normalizedItems)
        } else {
          setSearchHistory(prev => [...prev, ...normalizedItems])
        }
        setCurrentPage(pageNum)
        setTotalCount(response.data.total_count)
        setHasMore(response.data.has_more)
      }
    } catch (error: any) {
    
      toast.error(error.message || 'Sorgu geçmişi yüklenirken bir hata oluştu.')
    } finally {
      if (reset) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
  }

  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const response = await apiService.getSearchHistoryStats()
      if (response.success) {
        setStats(response.data)
      }
    } catch (error: any) {
    
      toast.error(error.message || 'İstatistikler yüklenirken bir hata oluştu.')
    } finally {
      setStatsLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadSearchHistory(currentPage + 1, false)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      loadSearchHistory(newPage, true)
    }
  }

  const handleNextPage = () => {
    if (hasMore) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      loadSearchHistory(newPage, true)
    }
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    loadSearchHistory(pageNumber, true)
  }

  const handleFilterChange = () => {
    setCurrentPage(1)
    loadSearchHistory(1, true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Istanbul'
    })
  }

  const getReliabilityColor = (score: number) => {
    const percentage = Math.round(score * 100)
    if (percentage >= 80) return 'text-green-400'
    if (percentage >= 60) return 'text-blue-400'
    return 'text-red-400'
  }

  const getReliabilityDotColor = (score: number) => {
    const percentage = Math.round(score * 100)
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    return 'bg-red-500'
  }

  const filteredHistory = searchHistory.filter(item => 
    searchTerm === '' || item.query.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10 border border-gray-200 dark:border-gray-700 mb-4 rounded-xl bg-white dark:bg-gray-800">
          <TabsTrigger value="history" className="text-sm py-2 rounded-lg">
            <History className="h-4 w-4 mr-2" />
            Geçmiş Sorgular
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-sm py-2 rounded-lg">
            <BarChart3 className="h-4 w-4 mr-2" />
            İstatistikler
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {/* Filtreler */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Sorgu içinde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 text-sm border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-xl bg-white dark:bg-gray-800"
              />
            </div>
            <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
              <SelectTrigger className="w-48 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                <SelectValue placeholder="Kurum Filtrele" />
              </SelectTrigger>
              <SelectContent>
                {INSTITUTIONS.map(institution => (
                  <SelectItem key={institution.value} value={institution.value}>
                    {institution.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleFilterChange} size="sm" variant="outline" className="h-10 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Sorgu Listesi */}
          <div className="max-h-[40vh] overflow-y-auto space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  {searchHistory.length === 0 ? 'Henüz sorgu geçmişiniz bulunmuyor.' : 'Arama kriterinize uygun sonuç bulunamadı.'}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-2">
                        {item.query}
                      </h4>
                      <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getReliabilityDotColor(item.reliability_score)}`}></div>
                          <span className={`font-medium ${getReliabilityColor(item.reliability_score)}`}>
                            {Math.round(item.reliability_score * 100)}% Güvenirlik
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" />
                          <span>{(item.sources || []).length} Kaynak</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Coins className="w-3 h-3" />
                          <span>{item.credits_used} Kredi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.execution_time.toFixed(2)}s</span>
                        </div>
                        {item.institution_filter && (
                          <Badge variant="secondary" className="text-xs">
                            {item.institution_filter}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Cevap */}
                  <div className="bg-gray-100 dark:bg-gray-700/30 rounded-xl p-3 mb-3 max-h-32 overflow-y-auto">
                    <div className="prose prose-sm max-w-none dark:prose-invert prose-gray dark:prose-slate text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {
                          // item.response'ın varlığını (null/undefined olmadığını) kontrol et
                          item.response
                            // Eğer response varsa, uzunluğunu kontrol edip kısalt
                            ? (item.response.length > 300 ? `${item.response.substring(0, 300)}...` : item.response)
                            // Eğer response null ise, kullanıcıya bilgi ver
                            : '*Bu sorgu için bir yanıt oluşturulmadı.*'
                        }
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Kaynaklar */}
                  {(item.sources || []).length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-gray-700 dark:text-gray-300">Kaynaklar:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(item.sources || []).slice(0, 2).map((source, index) => (
                          <div key={index} className="bg-white dark:bg-gray-800/30 rounded-xl p-2 border border-gray-200 dark:border-gray-600/30">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                {source.pdf_url ? (
                                  <button
                                    onClick={() => window.open(source.pdf_url, '_blank')}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-xs font-medium flex items-center transition-colors group"
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    {source.document_title}
                                    <ExternalLink className="w-2 h-2 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                ) : (
                                  <div className="text-gray-600 dark:text-gray-400 text-xs font-medium flex items-center">
                                    <FileText className="w-3 h-3 mr-1 text-gray-400 dark:text-gray-500" />
                                    {source.document_title}
                                  </div>
                                )}
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                  {source.source_institution}
                                </p>
                                {(source.citation || typeof source.page_number === 'number') && (
                                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                                    {source.citation && <span>{source.citation}</span>}
                                    {typeof source.page_number === 'number' && (
                                      <span>{source.citation ? ' • ' : ''}Sayfa {source.page_number}</span>
                                    )}
                                    {typeof source.line_start === 'number' && typeof source.line_end === 'number' && (
                                      <span> • Satır {source.line_start}-{source.line_end}</span>
                                    )}
                                  </p>
                                )}
                                {source.content_preview && (
                                  <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                                    {source.content_preview}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center space-x-1 ml-2">
                                <Star className="w-2 h-2 text-yellow-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {((source.similarity_score || 0) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(item.sources || []).length > 2 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{(item.sources || []).length - 2} kaynak daha
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sayfa {currentPage} - {Math.min(currentPage * itemsPerPage, totalCount)} / {totalCount} sorgu
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1 || loading}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl"
                  >
                    Önceki
                  </Button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400 px-2">
                    {currentPage}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!hasMore || loading}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                        Yükleniyor...
                      </>
                    ) : (
                      'Sonraki'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Pagination info when no more pages */}
          {!hasMore && totalCount > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toplam {totalCount} sorgu - Sayfa {currentPage}
                </p>
                
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={loading}
                    className="bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl"
                  >
                    Önceki Sayfa
                  </Button>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="max-h-[50vh] overflow-y-auto">
            {statsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              </div>
            ) : !stats ? (
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">İstatistik bilgileri yüklenemedi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800/50 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Toplam Sorgu</h3>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total_searches}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-lg flex items-center justify-center">
                        <Coins className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Kullanılan Kredi</h3>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.total_credits_used}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800/50 rounded-lg flex items-center justify-center">
                        <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-purple-700 dark:text-purple-300">Ortalama Güvenirlik</h3>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {Math.round(stats.average_reliability * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-800/50 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">En Çok Kullanılan</h3>
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.most_used_institution}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-800/50 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Bu Ay</h3>
                        <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{stats.searches_this_month}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-6 border border-rose-200 dark:border-rose-700/30">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-rose-100 dark:bg-rose-800/50 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-rose-700 dark:text-rose-300">Bugün</h3>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.searches_today}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
