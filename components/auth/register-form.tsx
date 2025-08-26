"use client"

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { registerSchema, RegisterFormData } from '@/lib/validations/auth'
import { authService } from '@/services/auth'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
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
  const [kvkkAccepted, setKvkkAccepted] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')
  
  const passwordStrength = useMemo(() => {
    return calculatePasswordStrength(watchedPassword || '')
  }, [watchedPassword])

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
      console.error('Kayıt hatası:', error)
      toast.error(error.message || 'Kayıt işlemi başarısız oldu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Hesap Oluşturun
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400 text-xs font-medium">
          Yeni hesabınızı oluşturun
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="kvkk"
              checked={kvkkAccepted}
              onCheckedChange={(checked) => setKvkkAccepted(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="kvkk"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-primary hover:text-primary/80 cursor-pointer underline">
                      KVKK Koşullarını Kabul Ediyorum
                    </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Kişisel Verilerin Korunması Kanunu (KVKK) Metni</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 text-sm">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                      <p>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                      </p>
                      <p>
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8 tracking-wide relative overflow-hidden group" 
            disabled={isLoading || !kvkkAccepted}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {isLoading ? 'Kayıt oluşturuluyor...' : 'Kayıt Ol'}
            </div>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}