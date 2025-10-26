"use client"

import { useEffect, useRef, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

// Web Speech API tiplerini tanımla
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
  type: string
}

interface UseVoiceAnalysisReturn {
  audioLevel: number
  isListening: boolean
  startListening: () => Promise<void>
  stopListening: () => void
  error: string | null
  waveform: Float32Array | null
  isUploading?: boolean
  finalizeAndUpload: () => Promise<void>
  isBoosting?: boolean
  isPlaying?: boolean
  stopAudio: () => void
  questionText?: string
}

export function useVoiceAnalysis(): UseVoiceAnalysisReturn {
  const [audioLevel, setAudioLevel] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [waveform, setWaveform] = useState<Float32Array | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isBoosting, setIsBoosting] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [questionText, setQuestionText] = useState<string>('')
  const [realtimeText, setRealtimeText] = useState<string>('')
  const [isRealtimeListening, setIsRealtimeListening] = useState(false)
  // Otomatik sessizlikle finalize kapalı
  const [autoFinalizeEnabled] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<BlobPart[]>([])
  
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Float32Array | null>(null)
  const animationRef = useRef<number>()
  const lastSpeechTsRef = useRef<number>(0)
  const autoFinalizingRef = useRef<boolean>(false)
  const recognitionRef = useRef<any | null>(null)

  // Gerçek zamanlı konuşma tanıma başlat
  const startRealtimeSTT = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Bu tarayıcı konuşma tanımayı desteklemiyor')
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'tr-TR'
    
    recognition.onstart = () => {
      setIsRealtimeListening(true)
      setRealtimeText('') // Başlangıçta temizle
      console.log('[REALTIME-STT] Başladı')
    }
    
    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }
      
      // Anlık metni güncelle
      setRealtimeText(finalTranscript + interimTranscript)
    }
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('[REALTIME-STT] Hata:', event.error)
      setIsRealtimeListening(false)
    }
    
    recognition.onend = () => {
      setIsRealtimeListening(false)
      console.log('[REALTIME-STT] Bitti')
    }
    
    recognitionRef.current = recognition
    recognition.start()
  }

  const startListening = async () => {
    try {
      setError(null)
      if (isUploading) {
        // Yükleme bitene kadar yeni oturum başlatma
        try { console.warn('[STT] Upload sürüyor, lütfen bekleyin...') } catch {}
        return
      }
      // Upload state reset
      setIsUploading(false)
      // Metinleri temizle - yeni konuşma başlıyor
      setRealtimeText('')
      setQuestionText('')
      try { console.log('[VOICE] startListening() çağrıldı') } catch {}
      
      // Gerçek zamanlı STT başlat
      startRealtimeSTT()
      
      // Mikrofon erişimi
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      })
      
      mediaStreamRef.current = stream
      try { console.log('[VOICE] getUserMedia OK, track count =', stream.getTracks().length) } catch {}
      
      // Audio Context oluştur
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      // iOS/Safari: kullanıcı etkileşiminden sonra resume gerekebilir
      try { await audioContext.resume() } catch {}
      audioContextRef.current = audioContext
      
      // Analyser node oluştur
      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.85
      analyserRef.current = analyser
      dataArrayRef.current = new Float32Array(analyser.fftSize)
      
      // Mikrofon stream'ini analyser'a bağla
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      // MediaRecorder ile kayıt başlat (STT upload için)
      try {
        const options: MediaRecorderOptions = { mimeType: 'audio/webm' }
        const recorder = new MediaRecorder(stream, options)
        recordedChunksRef.current = []
        recorder.ondataavailable = (e: BlobEvent) => {
          try { console.log('[REC] ondataavailable size=', e?.data?.size) } catch {}
          if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data)
        }
        recorder.onstart = () => { try { console.log('[REC] start') } catch {} }
        recorder.onstop = async () => {
          try { console.log('[REC] stop, chunks=', recordedChunksRef.current.length) } catch {}
          try {
            setIsUploading(true)
            try { console.log('[REC] onstop → uploadTranscribe başlıyor') } catch {}
            const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' })
            recordedChunksRef.current = []
            await uploadTranscribe(blob)
          } catch (e: any) {
            toast({ title: 'STT Hatası', description: e?.message || String(e), variant: 'destructive' })
          } finally {
            // Upload bitti: boost ve upload kapat; sesli mod açık kalsın
            setIsUploading(false)
            setIsBoosting(false)
            // setIsListening(false) kaldırıldı - sesli mod açık kalsın
            try { console.log('[UPLOAD] bitti → sesli mod açık kaldı') } catch {}
          }
        }
        recorder.onerror = (ev) => { try { console.error('[REC] error', ev) } catch {} }
        mediaRecorderRef.current = recorder
        recorder.start()
        try { console.log('[REC] recorder.start() çağrıldı') } catch {}
      } catch {}

      setIsListening(true)
      lastSpeechTsRef.current = performance.now()
      autoFinalizingRef.current = false
      try { console.log('[VOICE] Listening = true') } catch {}
      
      // Ses seviyesi analizi
      const analyzeAudio = () => {
        if (!analyserRef.current || !dataArrayRef.current || !audioContextRef.current) return
        
        analyserRef.current.getFloatTimeDomainData(dataArrayRef.current)
        // RMS hesapla (daha güvenilir ses genliği ölçümü)
        let sumSquares = 0
        for (let i = 0; i < dataArrayRef.current.length; i++) {
          const v = dataArrayRef.current[i]
          sumSquares += v * v
        }
        const rms = Math.sqrt(sumSquares / dataArrayRef.current.length)
        // dBFS ~ 20*log10(rms); burada 0-1 arası normalize edelim
        const normalized = Math.min(rms * 3.5, 1) // hassasiyet faktörü
        setAudioLevel(normalized)

        // Otomatik finalize devre dışı (autoFinalizeEnabled=false). İleride açmak için guard.
        if (autoFinalizeEnabled) {
          const silenceThreshold = 0.06
          const silenceDurationMs = 600
          const now = performance.now()
          if (normalized > silenceThreshold) {
            lastSpeechTsRef.current = now
          } else if (isListening && mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            const elapsed = now - lastSpeechTsRef.current
            if (!autoFinalizingRef.current && elapsed > silenceDurationMs) {
              autoFinalizingRef.current = true
            try { setIsUploading(true); console.log('[AUTO] Sessizlik → finalize + upload başlıyor') } catch {}
              try { mediaRecorderRef.current.requestData?.() } catch {}
              try { mediaRecorderRef.current.stop() } catch {}
            }
          }
        }

        // Downsample waveform to ~96 samples for visualization
        const targetLen = 96
        const step = Math.floor(dataArrayRef.current.length / targetLen) || 1
        const down = new Float32Array(targetLen)
        for (let i = 0; i < targetLen; i++) {
          down[i] = dataArrayRef.current[i * step] || 0
        }
        setWaveform(down)
        
        animationRef.current = requestAnimationFrame(analyzeAudio)
      }
      
      analyzeAudio()
      
    } catch (err) {
      console.error('Mikrofon erişim hatası:', err)
      setError('Mikrofon erişimi reddedildi veya kullanılamıyor')
      setIsListening(false)
    }
  }

  const { toast } = useToast()

  const stopListening = () => {
    try { console.log('[VOICE] stopListening() çağrıldı') } catch {}
    setIsListening(false)
    setAudioLevel(0)
    
    // Gerçek zamanlı STT'yi durdur
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRealtimeListening(false)
    
    // Tüm media stream'leri durdur - agresif yaklaşım
    try {
      // Mevcut stream'i durdur
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
          track.stop()
          console.log('[VOICE] Track durduruldu:', track.kind, track.label)
        })
        mediaStreamRef.current = null
        console.log('[VOICE] Media stream temizlendi')
      }
      
      // Tüm aktif media stream'leri durdur (güvenlik için)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Mevcut tüm stream'leri bul ve durdur
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
          .then(stream => {
            stream.getTracks().forEach(track => {
              track.stop()
              console.log('[VOICE] Ekstra track durduruldu:', track.kind)
            })
          })
          .catch(() => {
            // Zaten stream yok, sorun değil
            console.log('[VOICE] Ekstra stream bulunamadı (normal)')
          })
      }
    } catch (e) {
      console.error('[VOICE] Media stream durdurma hatası:', e)
    }
    
    // Audio context'i kapat
    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close()
        }
        audioContextRef.current = null
        console.log('[VOICE] Audio context kapatıldı')
      } catch (e) {
        console.error('[VOICE] Audio context kapatma hatası:', e)
      }
    }
    
    // Animation frame'i iptal et
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
    
    analyserRef.current = null

    // Kayıt durdur
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      const recorder = mediaRecorderRef.current
      try { 
        setIsUploading(true)
        console.log('[UPLOAD] başlatılıyor (stopListening)') 
      } catch {}
      try { recorder.requestData?.() } catch {}
      try { recorder.stop() } catch {}
    }
    
    // MediaRecorder'ı da temizle
    mediaRecorderRef.current = null
    
    // Mikrofon izinlerini geri al - tarayıcı seviyesinde
    try {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then(result => {
          console.log('[VOICE] Mikrofon izni durumu:', result.state)
          // İzin durumunu kontrol et ama değiştirme (güvenlik nedeniyle)
        }).catch(() => {
          console.log('[VOICE] İzin sorgusu desteklenmiyor')
        })
      }
    } catch (e) {
      console.log('[VOICE] İzin kontrolü yapılamadı:', e)
    }
    
    // Kullanıcıya mikrofon izinlerini manuel kapatmasını söyle
    toast({ 
      title: 'Mikrofon Durduruldu', 
      description: 'Sesli mod kapatıldı. Mikrofon izinlerini tamamen kapatmak için tarayıcı ayarlarından "Bu site için mikrofon erişimini engelle" seçeneğini kullanabilirsiniz.',
      duration: 5000
    })
    
    console.log('[VOICE] stopListening tamamlandı - tüm kaynaklar temizlendi')
  }

  const uploadTranscribe = async (audioBlob: Blob) => {
    const token = typeof window !== 'undefined' ? (localStorage.getItem('access_token') || localStorage.getItem('token')) : null
    if (!token) {
      toast({ title: 'Giriş gerekli', description: 'JWT bulunamadı. Lütfen yeniden giriş yapın.', variant: 'destructive' })
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://d918281c-1bd6-402c-9393-c4aff6ab45cd-00-24vj3sc6uk3ba.worf.replit.dev'
    if (!baseUrl) {
      toast({ title: 'Yapılandırma Hatası', description: 'NEXT_PUBLIC_API_BASE_URL tanımlı değil.', variant: 'destructive' })
      return
    }

    // Boyut kontrolü (25MB)
    if (audioBlob.size > 25 * 1024 * 1024) {
      toast({ title: 'Dosya çok büyük', description: 'Ses kaydı 25MB sınırını aşıyor.', variant: 'destructive' })
      return
    }

    const form = new FormData()
    const file = new File([audioBlob], 'speech.webm', { type: audioBlob.type || 'audio/webm' })
    form.set('file', file)
    form.set('language', 'tr')
    form.set('limit', '5')
    form.set('similarity_threshold', '0.5')
    form.set('response_style', 'concise')

    try {
      try { console.log('[UPLOAD] fetch →', `${baseUrl}/api/user/voice-query`, 'file.size=', file.size) } catch {}
      const res = await fetch(`${baseUrl}/api/user/voice-query`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      const raw = await res.text()
      // DEBUG: Sunucu yanıtını test için konsola yazdır
      try { console.log('[VOICE-QUERY][status]', res.status) } catch {}
      try { console.log('[VOICE-QUERY][raw]', raw) } catch {}
      let data: any
      try { data = JSON.parse(raw) } catch { data = { success: false, detail: raw } }
      try { console.log('[VOICE-QUERY][json]', data) } catch {}

      if (!res.ok || !data?.success) {
        const msg = data?.message || data?.detail || 'Sesli sorgu başarısız'
        toast({ title: 'Sesli Sorgu Hatası', description: msg, variant: 'destructive' })
        try { console.warn('[VOICE-QUERY] Fail:', msg) } catch {}
        return
      }

      const transcribedText = data?.data?.transcribed_text || ''
      setQuestionText(transcribedText) // Soru metnini sakla
      try { console.log('[VOICE-QUERY] Success transcribed_text:', transcribedText) } catch {}
      toast({ title: 'Sesli Sorgu', description: transcribedText || 'Metin boş döndü.' })
      
      // TTS: Sesli yanıtı çal
      try {
        const b64 = data?.data?.audio_base64
        const fmt = (data?.data?.audio_format || 'mp3').toLowerCase()
        if (b64) {
          const src = `data:audio/${fmt};base64,${b64}`
          const audio = new Audio(src)
          setCurrentAudio(audio) // Mevcut ses referansını sakla
          setIsPlaying(true) // Seslendirme başladı
          await audio.play().catch(() => {})
          // Seslendirme bittiğinde
          audio.onended = () => {
            setIsPlaying(false)
            setCurrentAudio(null)
          }
        } else {
          try { console.warn('[TTS] audio_base64 bulunamadı') } catch {}
        }
      } catch (e) {
        try { console.warn('[TTS] error', e) } catch {}
      }
    } catch (err: any) {
      try { console.error('[UPLOAD][catch]', err) } catch {}
      toast({ title: 'Sesli Sorgu Hatası', description: err?.message || String(err), variant: 'destructive' })
    }
  }

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      setCurrentAudio(null)
      setIsPlaying(false)
    }
  }

  const finalizeAndUpload = async () => {
    try { console.log('[FINALIZE] buton tıklandı') } catch {}
    
    // Gerçek zamanlı STT'yi durdur ve metni kaydet
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setIsRealtimeListening(false)
    
    // Realtime metni final metin olarak kaydet
    if (realtimeText.trim()) {
      setQuestionText(realtimeText.trim())
    } else {
      // Eğer realtime metin yoksa, boş string olarak ayarla
      setQuestionText('')
    }
    
    if (!mediaRecorderRef.current) {
      toast({ title: 'Kayıt bulunamadı', description: 'Gönderilecek kayıt yok.', variant: 'destructive' })
      return
    }
    if (mediaRecorderRef.current.state === 'inactive') {
      toast({ title: 'Kayıt bitti', description: 'Yeni bir kayıt başlatarak tekrar deneyin.', variant: 'destructive' })
      return
    }
    try {
      setIsUploading(true)
      setIsBoosting(true) // Hızlanma sadece "Soruyu Gönder" ile başlasın
      try { console.log('[FINALIZE] requestData + stop çağrılıyor') } catch {}
      mediaRecorderRef.current.requestData?.()
      mediaRecorderRef.current.stop()
      // Sesli mod açık kalsın: isListening'i kapatmıyoruz
    } catch (e: any) {
      setIsUploading(false)
      setIsBoosting(false)
      toast({ title: 'Gönderim hatası', description: e?.message || String(e), variant: 'destructive' })
    }
  }

  // Cleanup
  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [])

  return {
    audioLevel,
    isListening,
    startListening,
    stopListening,
    error,
    waveform,
    isUploading,
    finalizeAndUpload,
    isPlaying,
    stopAudio,
    questionText: realtimeText || questionText || ''
  }
}
