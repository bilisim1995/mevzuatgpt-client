"use client"

import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth'
import { authService } from '@/services/auth'
import { Eye, EyeOff, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

// Şifre güçlülük hesaplama fonksiyonu
const calculatePasswordStrength = (password: string) => {
  let score = 0
  let feedback = []
  
  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push('En az 8 karakter')
  }
  
  if (/[a-z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Küçük harf')
  }
  
  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push('Büyük harf')
  }
  
  if (/[0-9]/.test(password)) {
    score += 25
  } else {
    feedback.push('Rakam')
  }
  
  let strength = 'Çok Zayıf'
  let color = 'bg-red-500'
  
  if (score >= 75) {
    strength = 'Güçlü'
    color = 'bg-green-500'
  } else if (score >= 50) {
    strength = 'Orta'
    color = 'bg-yellow-500'
  } else if (score >= 25) {
    strength = 'Zayıf'
    color = 'bg-orange-500'
  }
  
  return { score, strength, color, feedback }
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [bothAccepted, setBothAccepted] = useState(false)
  const [marketingAccepted, setMarketingAccepted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')
  const watchedAd = watch('ad', '')
  const watchedSoyad = watch('soyad', '')
  const watchedEmail = watch('email', '')
  const watchedConfirmPassword = watch('confirmPassword', '')
  
  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(watchedPassword || '')
  }, [watchedPassword])

  // Şifre eşleşme kontrolü
  const passwordsMatch = watchedPassword === watchedConfirmPassword
  const showPasswordMismatch = watchedPassword !== '' && watchedConfirmPassword !== '' && !passwordsMatch

  // 1. aşama için form validasyonu
  const isStep1Valid = watchedAd.trim() !== '' && 
                      watchedSoyad.trim() !== '' && 
                      watchedEmail.trim() !== '' && 
                      watchedPassword.trim() !== '' && 
                      watchedPassword.length >= 8 &&
                      watchedConfirmPassword.trim() !== '' &&
                      passwordsMatch

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.register({
        ad: data.ad,
        soyad: data.soyad,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        meslek: data.meslek,
        calistigiYer: data.calistigiYer,
      })
      
      toast.success('Kayıt başarılı! Dashboard\'a yönlendiriliyorsunuz...')
      
      // Başarılı kayıt sonrası dashboard'a yönlendir (token zaten kaydedildi)
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)
      
    } catch (error: any) {
      
      toast.error(error.message || 'Kayıt işlemi başarısız oldu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-3xl">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          {mounted && (
            <Image 
              src="/logo.svg"
              alt="MevzuatGPT Logo" 
              width={64}
              height={64}
              className="h-16 w-auto drop-shadow-lg"
              unoptimized
            />
          )}
        </div>
    
        
        {/* Wizard Progress Bar */}
        <div className="flex items-center justify-center mt-6 mb-4">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= 1 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                currentStep >= 1 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Temel Bilgiler
              </span>
            </div>
            
            {/* Connector Line */}
            <div className={`w-12 h-0.5 transition-all duration-300 ${
              currentStep >= 2 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-700'
            }`}></div>
            
            {/* Step 2 */}
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep >= 2 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium transition-colors duration-300 ${
                currentStep >= 2 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                Ek Bilgiler
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Step 1: Temel Bilgiler */}
          {currentStep === 1 && (
            <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="ad" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Ad</Label>
              <div className="relative">
                <Input
                  id="ad"
                  type="text"
                  placeholder="Adınız"
                  className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg peer"
                  {...register('ad')}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
              </div>
              {errors.ad && (
                <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="mr-2 text-red-400">⚠</span>
                  {errors.ad.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="soyad" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Soyad</Label>
              <div className="relative">
                <Input
                  id="soyad"
                  type="text"
                  placeholder="Soyadınız"
                  className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg peer"
                  {...register('soyad')}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
              </div>
              {errors.soyad && (
                <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="mr-2 text-red-400">⚠</span>
                  {errors.soyad.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">E-Posta Adresi</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg peer"
                {...register('email')}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Şifre</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Şifrenizi giriniz"
                className="h-12 px-4 pr-12 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </Button>
            </div>
            
            {/* Şifre güçlülük göstergesi */}
            {watchedPassword && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Şifre Güçlülüğü:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score >= 75 ? 'text-green-600' :
                    passwordStrength.score >= 50 ? 'text-yellow-600' :
                    passwordStrength.score >= 25 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength.score} 
                  className="h-2"
                />
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Eksik: {passwordStrength.feedback.join(', ')}
                  </div>
                )}
              </div>
            )}
            
            {errors.password && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Şifre Tekrarı</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Şifrenizi tekrar giriniz"
                className="h-12 px-4 pr-12 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-110"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                {errors.confirmPassword.message}
              </p>
            )}
            {showPasswordMismatch && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                Şifreler eşleşmiyor. Lütfen aynı şifreyi girin.
              </p>
            )}
          </div>
            </div>
          )}

          {/* Step 2: Ek Bilgiler */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="meslek" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Meslek (Opsiyonel)</Label>
                <div className="relative">
                  <Input
                    id="meslek"
                    type="text"
                    placeholder="Mesleğiniz"
                    className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg peer"
                    {...register('meslek')}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
                </div>
                {errors.meslek && (
                  <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="mr-2 text-red-400">⚠</span>
                    {errors.meslek.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="calistigiYer" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Çalıştığı Yer (Opsiyonel)</Label>
                <div className="relative">
                  <Input
                    id="calistigiYer"
                    type="text"
                    placeholder="Çalıştığınız yer"
                    className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg peer"
                    {...register('calistigiYer')}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none opacity-0 transition-opacity duration-300 peer-focus:opacity-100"></div>
                </div>
                {errors.calistigiYer && (
                  <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                    <span className="mr-2 text-red-400">⚠</span>
                    {errors.calistigiYer.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="both"
              checked={bothAccepted}
              onCheckedChange={(checked) => setBothAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="both"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <span>
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-primary hover:text-primary/80 cursor-pointer underline">
                        KVKK Metni
                    </span>
                  </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] bg-gray-50/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700 rounded-2xl">
                        <DialogHeader className="relative">
                          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white pr-8">
                            Kişisel Verilerin Korunması Kanunu (KVKK) Aydınlatma Metni
                          </DialogTitle>
                          <button
                            onClick={() => {
                              const dialog = document.querySelector('[data-radix-dialog-content]')
                              if (dialog) {
                                const closeButton = dialog.querySelector('[data-radix-dialog-close]') as HTMLButtonElement
                                closeButton?.click()
                              }
                            }}
                            className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          </button>
                    </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm bg-white dark:bg-gray-900 rounded-xl p-6">
                          <div className="prose prose-gray dark:prose-invert max-w-none">
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Bu KVKK Aydınlatma Metni, <strong>Mevzuat GPT</strong> olarak kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                            </p>
                            
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              1. Veri Sorumlusu
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Kişisel verilerinizle ilgili veri sorumlusu <strong>Mevzuat GPT</strong>'dir. İletişim bilgilerimiz:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                              <li><strong>Web Sitesi:</strong> mevzuatgpt.org</li>
                              <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                            </ul>
                            
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              2. Kişisel Verilerin İşlenme Amaçları
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                              <li>Hizmet sunumu ve hesap yönetimi</li>
                              <li>Müşteri hizmetleri ve destek</li>
                              <li>Güvenlik ve sahtekarlık önleme</li>
                              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                            </ul>
                            
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              3. Kişisel Verilerin Saklanma Süreleri
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır. İşlenme amacı ortadan kalktığında verileriniz silinir veya anonim hale getirilir.
                            </p>
                            
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              4. Haklarınız
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              KVKK kapsamında kişisel verilerinize ilişkin haklarınız bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                            </p>
                            
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                              5. İletişim
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                              KVKK kapsamındaki haklarınızı kullanmak veya sorularınız için bizimle iletişime geçebilirsiniz:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                              <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                              <li><strong>Adres:</strong> Finans Plaza D:32, No:14 Gevher Nesibe Mahallesi Gök Geçidi Sokak, Kocasinan, Kayseri 38010, Türkiye</li>
                            </ul>
                          </div>
                    </div>
                  </DialogContent>
                </Dialog>
                  {' ve '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-primary hover:text-primary/80 cursor-pointer underline">
                        Kullanım Koşullarını
                      </span>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] bg-gray-50/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700 rounded-2xl">
                      <DialogHeader className="relative">
                        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white pr-8">
                          Kullanım Koşulları
                        </DialogTitle>
                        <button
                          onClick={() => {
                            const dialog = document.querySelector('[data-radix-dialog-content]')
                            if (dialog) {
                              const closeButton = dialog.querySelector('[data-radix-dialog-close]') as HTMLButtonElement
                              closeButton?.click()
                            }
                          }}
                          className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                      </DialogHeader>
                      <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm bg-white dark:bg-gray-900 rounded-xl p-6">
                        <div className="prose prose-gray dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Bu belge, <strong>Mevzuat GPT</strong> (bundan sonra "Platform" olarak anılacaktır) üzerinden satın alınan kredi paketlerinin iptal ve iade koşullarını düzenlemektedir. Platformumuzu kullanarak ve kredi paketi satın alarak aşağıdaki şartları kabul etmiş sayılırsınız.
                          </p>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            1. Hizmetin Tanımı ve Niteliği
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Mevzuat GPT, kullanıcılara yapay zeka tabanlı mevzuat sorgulama hizmeti sunar. Bu hizmet, "kredi" adı verilen dijital kullanım hakları aracılığıyla sağlanır. Kullanıcılar, çeşitli boyutlardaki kredi paketlerini satın alarak Platform üzerinde sorgu yapma hakkı elde ederler.
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Satın alınan her bir kredi paketi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında <strong>"elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallar"</strong> niteliğindedir. Bu nedenle, iade koşulları bu yasal çerçeveye göre belirlenmiştir.
                          </p>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            2. Cayma Hakkı ve İstisnası
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin (ğ) bendi uyarınca, "elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmelerde" tüketicinin <strong>cayma hakkı bulunmamaktadır.</strong>
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Ancak, müşteri memnuniyetini önemsediğimiz için aşağıdaki özel koşulu sunuyoruz:
                          </p>
                          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                            <li>Satın aldığınız kredi paketinden <strong>hiçbir krediyi kullanmamış olmanız şartıyla</strong>, satın alma tarihinden itibaren <strong>14 (on dört) gün</strong> içinde iptal ve tam iade talebinde bulunabilirsiniz. Bu durumda, ödediğiniz tutarın tamamı, kesintisiz olarak ödeme yaptığınız yönteme iade edilir.</li>
                          </ul>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            3. İade Edilemeyecek Durumlar
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            Aşağıdaki durumlarda kredi paketleri için iptal veya iade işlemi <strong>yapılamamaktadır:</strong>
                          </p>
                          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                            <li>Satın aldığınız kredi paketinden <strong>herhangi bir krediyi kullanmış olmanız</strong> (tek bir sorgu bile yapmış olmanız yeterlidir)</li>
                            <li>14 günlük iade süresinin <strong>dolmuş olması</strong></li>
                            <li>Kredi paketinin <strong>süresi dolmuş olması</strong> (kredi paketleri belirli bir süre için geçerlidir)</li>
                            <li>Hesabınızın <strong>güvenlik ihlali</strong> nedeniyle askıya alınmış olması</li>
                          </ul>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            4. İade İşlem Süreci
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            İade talebinizi aşağıdaki yöntemlerle iletebilirsiniz:
                          </p>
                          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                            <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                            <li><strong>Destek Paneli:</strong> Dashboard üzerinden destek talebi oluşturma</li>
                          </ul>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            İade talebiniz en geç <strong>3 iş günü</strong> içinde değerlendirilir ve sonuçlandırılır. Onaylanan iadeler, <strong>7-14 iş günü</strong> içinde ödeme yaptığınız yönteme iade edilir.
                          </p>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            5. Yasal Çerçeve
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Bu koşullar, 6502 sayılı Tüketicinin Korunması Hakkında Kanun, Mesafeli Sözleşmeler Yönetmeliği ve ilgili mevzuat hükümlerine uygun olarak hazırlanmıştır. Yasal düzenlemelerde değişiklik olması halinde, bu koşullar da güncellenecektir.
                          </p>
                          
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            6. İletişim
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Sorularınız ve talepleriniz için bizimle iletişime geçebilirsiniz:
                          </p>
                          <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                            <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                            <li><strong>Adres:</strong> Finans Plaza D:32, No:14 Gevher Nesibe Mahallesi Gök Geçidi Sokak, Kocasinan, Kayseri 38010, Türkiye</li>
                          </ul>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  {' Kabul Ediyorum'}
                </span>
              </label>
            </div>
          </div>

          {/* Ticari İletişim Checkbox (Opsiyonel) */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="marketing"
              checked={marketingAccepted}
              onCheckedChange={(checked) => setMarketingAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="marketing"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Ticari iletişim amacıyla iletişim bilgilerimin kullanılmasını kabul ediyorum.
              </label>
            </div>
          </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            {currentStep === 1 ? (
              <div className="flex justify-start">
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Zaten hesabınız var mı?{' '}
                  <a 
                    href="/login" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200"
                  >
                    Giriş yapın
                  </a>
                </p>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="h-12 px-6 text-base font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
              >
                Geri
              </Button>
            )}
            
            {currentStep === 1 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                disabled={!isStep1Valid}
                className={`h-12 px-6 text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] ${
                  isStep1Valid 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed hover:scale-100'
                }`}
              >
                İleri
              </Button>
            ) : (
          <Button 
            type="submit" 
                className="h-12 px-6 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 tracking-wide relative overflow-hidden group" 
            disabled={isLoading || !bothAccepted}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
            </div>
          </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}