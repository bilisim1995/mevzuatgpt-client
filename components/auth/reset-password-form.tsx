"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { authService } from '@/services/auth'
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Şifre en az 8 karakter olmalıdır'),
  confirmPassword: z.string().min(8, 'Şifre tekrarı en az 8 karakter olmalıdır'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

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

export function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenVerifying, setTokenVerifying] = useState(true)
  const [resetSuccess, setResetSuccess] = useState(false)
  
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const watchedPassword = watch('password') || ''
  const passwordStrength = calculatePasswordStrength(watchedPassword)

  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setTokenValid(false)
      setTokenVerifying(false)
    }
  }, [token])

  const verifyToken = async () => {
    if (!token) return
    
    setTokenVerifying(true)
    try {
      await authService.verifyResetToken(token)
      setTokenValid(true)
    } catch (error: any) {
      
      setTokenValid(false)
      toast.error(error.message || 'Geçersiz veya süresi dolmuş token.')
    } finally {
      setTokenVerifying(false)
    }
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Geçersiz token.')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword(token, data.password)
      setResetSuccess(true)
      toast.success('Şifreniz başarıyla değiştirildi!')
    } catch (error: any) {
     
      toast.error(error.message || 'Şifre sıfırlanırken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenVerifying) {
    return (
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Token Doğrulanıyor...
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Lütfen bekleyiniz
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (tokenValid === false) {
    return (
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Geçersiz Token
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş. 
              Lütfen yeni bir şifre sıfırlama talebi oluşturun.
            </p>
            <Link href="/login">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (resetSuccess) {
    return (
      <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Şifre Değiştirildi!
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Şifreniz başarıyla değiştirildi. Artık yeni şifrenizle giriş yapabilirsiniz.
            </p>
            <Link href="/login">
              <Button className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Yeni Şifre Belirleyin
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400 text-xs font-medium">
          Güvenli bir şifre oluşturun
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Yeni Şifre
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Yeni şifrenizi giriniz"
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
                  <span className="text-xs text-gray-600 dark:text-gray-400">Şifre Güçlülüğü:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score >= 75 ? 'text-green-600 dark:text-green-400' :
                    passwordStrength.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' :
                    passwordStrength.score >= 25 ? 'text-orange-600 dark:text-orange-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {passwordStrength.strength}
                  </span>
                </div>
                <Progress 
                  value={passwordStrength.score} 
                  className="h-2"
                />
                {passwordStrength.feedback.length > 0 && (
                  <div className="text-xs text-gray-600 dark:text-gray-400">
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
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Şifre Tekrarı
            </Label>
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

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8 tracking-wide relative overflow-hidden group" 
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
              {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              {isLoading ? 'Şifre değiştiriliyor...' : 'Şifreyi Değiştir'}
            </div>
          </Button>
        </form>
        
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link 
            href="/login" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium underline decoration-2 underline-offset-2 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Giriş sayfasına dön
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}