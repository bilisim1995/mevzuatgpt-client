"use client"

import { useMemo, useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { MicOff } from 'lucide-react'
import { useTheme } from 'next-themes'
import { VOICE_ANIM_CONFIG as CFG } from '@/lib/voice-anim-config'

interface VoiceAssistantAnimationProps {
  isListening: boolean
  audioLevel: number
  onStop?: () => void
  questionText?: string
  isBoosting?: boolean
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax - inMin === 0) return outMin
  return outMin + ((clamp(value, inMin, inMax) - inMin) * (outMax - outMin)) / (inMax - inMin)
}

function ReactiveBlob({ smoothedLevelRef, isDark, isPlaying = false }: { smoothedLevelRef: React.RefObject<number>, isDark: boolean, isPlaying?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<any>(null)

  const tempColor = useMemo(() => new THREE.Color(), [])
  // Palet: tema bazlı daha koyu tonlar
  const cool = useMemo(() => new THREE.Color(isDark ? '#0891b2' : '#0ea5e9'), [isDark]) // cyan-700 / cyan-500
  const mid = useMemo(() => new THREE.Color(isDark ? '#1e3a8a' : '#60a5fa'), [isDark])  // blue-800 / blue-400 (light modda daha açık)
  const hot = useMemo(() => new THREE.Color(isDark ? '#6d28d9' : '#7c3aed'), [isDark])  // violet-700 / violet-600

  useFrame((state, delta) => {
    const level = smoothedLevelRef.current ?? 0
    if (!materialRef.current || !meshRef.current) return

    // Seslendirme sırasında ses efekti göster
    const effectiveLevel = isPlaying ? 0.8 : level
    const targetDistort = CFG.blob.distortBase + effectiveLevel * CFG.blob.distortGain
    const targetSpeed = CFG.blob.speedBase + effectiveLevel * CFG.blob.speedGain
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, delta * 4)
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, delta * 4)

    // Renk geçişi: ses seviyesine göre renk değişimi
    const currentColor = new THREE.Color(materialRef.current.color)
    if (effectiveLevel > CFG.blob.colorGate) {
      // Ses algılandığında veya seslendirme sırasında daha canlı renkler
      const targetColor = effectiveLevel > 0.5 ? hot : mid
      currentColor.lerp(targetColor, Math.min(1, delta * CFG.blob.colorLerpFast))
    } else {
      // Sessizlikte orta tona dön
      currentColor.lerp(mid, Math.min(1, delta * CFG.blob.colorLerpSlow))
    }
    materialRef.current.color = currentColor

    // Ses dalgası animasyonu: ses seviyesine göre ölçek ve nefes
    const baseBreathing = 1 + Math.sin(state.clock.getElapsedTime() * 0.6) * CFG.blob.scaleBreathAmp
    const soundScale = 1 + effectiveLevel * CFG.blob.scaleGain
    const breathing = baseBreathing * soundScale
    meshRef.current.scale.setScalar(breathing)
  })

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
      <mesh castShadow receiveShadow ref={meshRef}>
        <icosahedronGeometry args={[1.2, 48]} />
        <MeshDistortMaterial
          ref={materialRef}
          speed={0.8}
          distort={0.2}
          color={isDark ? '#1e3a8a' : '#60a5fa'}
          envMapIntensity={0.35}
          roughness={0.2}
          metalness={0.04}
        />
      </mesh>
    </Float>
  )
}

// ReactiveRing kaldırıldı

function OrbitingParticles({ smoothedLevelRef, waveform, isUploading = false, isPlaying = false }: { smoothedLevelRef: React.RefObject<number>, waveform?: Float32Array | null, isUploading?: boolean, isPlaying?: boolean }): JSX.Element {
  const count = CFG.particles.count
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const speedRef = useRef(0.25)

  const particles = useMemo(() => Array.from({ length: count }, () => ({
    angleOffset: Math.random() * Math.PI * 2,
    yOffset: (Math.random() - 0.5) * 2,
  })), [count])

  useFrame((state, delta) => {
    const level = smoothedLevelRef.current ?? 0
    if (!instancedMeshRef.current) return
    const t = state.clock.getElapsedTime()
    const targetRadius = mapRange(level, 0, 1, CFG.particles.baseRadiusRange[0], CFG.particles.baseRadiusRange[1])
    const currentRadius = (instancedMeshRef.current.userData.radius as number) || 1.6
    const radius = THREE.MathUtils.lerp(currentRadius, targetRadius, delta * 2)
    instancedMeshRef.current.userData.radius = radius

    // Hız: Gönderiliyor süresince sabit boost, değilse anında tam normal hız
    speedRef.current = isUploading
      ? CFG.particles.baseSpeed * CFG.particles.uploadSpeedMultiplier
      : CFG.particles.baseSpeed

    const N = particles.length
    particles.forEach((data, i) => {
      // Seslendirme sırasında topları gizle
      if (isPlaying) {
        dummy.position.set(0, -100, 0) // Görünmez yere taşı
        dummy.updateMatrix()
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
        return
      }
      
      // Ses algılandığında topları gizle (upload yoksa). Upload aktifken daima görünür
      if (!isUploading && level > CFG.particles.hideThreshold) {
        dummy.position.set(0, -100, 0) // Görünmez yere taşı
        dummy.updateMatrix()
        instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
        return
      }
      
      // Sadece orbit dönüşü (ses yokken)
      const angle = data.angleOffset + t * speedRef.current
      const y = Math.sin(angle * 2 + data.yOffset) * CFG.particles.verticalAmp
      
      dummy.position.set(
        Math.cos(angle) * radius, 
        y, 
        Math.sin(angle) * radius
      )
      dummy.updateMatrix()
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedMeshRef} args={[undefined as any, undefined as any, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial color="#93c5fd" emissive="#60a5fa" emissiveIntensity={0.75} />
    </instancedMesh>
  )
}

function Scene({ isListening, audioLevel, waveform, isUploading = false, boostUntil = 0, isBoosting = false, isPlaying = false }: { isListening: boolean, audioLevel: number, waveform?: Float32Array | null, isUploading?: boolean, boostUntil?: number, isBoosting?: boolean, isPlaying?: boolean }) {
  const smoothedLevelRef = useRef(0)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useFrame((_, delta) => {
    const targetLevel = isListening ? clamp(audioLevel * 1.1, 0, 1) : 0
    // Algılama eşiği: çok düşük gürültüleri filtrele
    const gated = targetLevel < CFG.noiseGate ? targetLevel * 0.2 : targetLevel
    smoothedLevelRef.current = THREE.MathUtils.lerp(smoothedLevelRef.current, gated, delta * CFG.smoothingLerp)
  })

  return (
    <>[2025-10-15 11:40:45] - IP: 46.232.159.32 - POST Data: []
      {/* Arkaplan transparan: bilinçli olarak sahne rengi set edilmiyor */}
      <ambientLight intensity={isDark ? 0.18 : 0.22} />
      <hemisphereLight groundColor="black" intensity={isDark ? 0.35 : 0.45} />
      <spotLight position={[8, 10, 8]} angle={0.3} penumbra={1} intensity={isDark ? 0.9 : 1.1} castShadow />

      {/* Arka kart/zemin kaldırıldı */}

      {/* Küre (blob) ve etrafında dönen küçük parçacıklar */}
      <OrbitingParticles smoothedLevelRef={smoothedLevelRef} waveform={waveform} isUploading={isUploading} isPlaying={isPlaying} />
      <ReactiveBlob smoothedLevelRef={smoothedLevelRef} isDark={isDark} isPlaying={isPlaying} />

      <Environment preset="city" background={false} />
      <EffectComposer>
        {/* Bloom yarıçapını artırmak için threshold düşürülür, seviye artırılır */}
        <Bloom luminanceThreshold={isDark ? 0.38 : 0.34} intensity={isDark ? 0.55 : 0.7} levels={5} mipmapBlur />
      </EffectComposer>
    </>
  )
}

export function VoiceAssistantAnimation({ isListening, audioLevel, onStop, waveform, isUploading = false, onFinalize, onStart, isPlaying = false, onStopAudio, questionText, isBoosting = false }: VoiceAssistantAnimationProps & { waveform?: Float32Array | null, isUploading?: boolean, onFinalize?: () => void, onStart?: () => void, isPlaying?: boolean, onStopAudio?: () => void }) {
  const [reactEnabled, setReactEnabled] = useState(false)
  const [boostUntil, setBoostUntil] = useState<number>(0)

  // Upload bittiğinde tepkiselliği kapat (cevap geldikten sonra "Bir Konuşma Başlat" moduna dön)
  useEffect(() => {
    if (!isUploading) {
      setReactEnabled(false)
    }
  }, [isUploading])

  // Upload durumu değişince boost'u anında yönet: başlarken hemen hızlandır, biter bitmez kapat
  useEffect(() => {
    if (isUploading) {
      setBoostUntil(performance.now() + 60000) // güvenli buffer: 60s, bittiğinde kapatılacak
    } else {
      setBoostUntil(0)
    }
  }, [isUploading])
  return (
    <div className="flex w-full min-h-[60vh] items-center justify-center px-4">
      <div className="flex w-full max-w-[720px] flex-col items-center justify-center gap-8">
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px]">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, 0.5, 6], fov: 45 }}
            gl={{ alpha: true }}
            style={{ background: 'transparent' }}
          >
            <Scene isListening={(isListening && reactEnabled && !isUploading)} audioLevel={audioLevel} waveform={waveform} isUploading={isUploading} boostUntil={boostUntil} isPlaying={isPlaying} />
          </Canvas>
          {/* Üst fade kaldırıldı */}
        </div>

        <div className="flex flex-col items-center gap-2 -mt-8">
          {/* Dinleme durumu metni - butonun üstünde sabit konumda */}
          <div className="h-6 flex items-center">
            {reactEnabled && !isUploading && (
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                {questionText && questionText.trim() ? questionText : "Şuan sizi dinliyorum..."}
              </p>
            )}
          </div>
          
          <div className="flex gap-3">
            {/* Bir Konuşma Başlat butonu - sadece seslendirme yokken görünür */}
            {!isPlaying && (
              <button
                type="button"
                onClick={() => {
                  if (!reactEnabled) {
                    // Yeni Soru Gönder akışı: tepkiyi aç ve dinlemeyi başlat
                    setReactEnabled(true)
                    onStart?.()
                  } else {
                    // Soruyu Gönder akışı: finalize
                    onFinalize?.()
                  }
                }}
                disabled={isUploading}
                className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 shadow-sm transition dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-disabled={isUploading}
              >
                {isUploading ? 'Gönderiliyor...' : (reactEnabled ? 'Soruyu Gönder' : 'Bir Konuşma Başlat')}
              </button>
            )}
            
            {/* Cevabı Durdur butonu - sadece seslendirme sırasında görünür */}
            {isPlaying && (
              <button
                type="button"
                onClick={() => {
                  onStopAudio?.()
                  setReactEnabled(false) // Reset to "Bir Konuşma Başlat" mode
                }}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition dark:bg-red-500 dark:hover:bg-red-600"
              >
                Cevabı Durdur
              </button>
            )}
          </div>
        </div>

        {/* Durdurma butonu kaldırıldı; durdurma chat'teki mikrofon ile yapılacak */}
      </div>
    </div>
  )
}