"use client"

import { useState } from 'react'
import { Turnstile } from '@marsidev/react-turnstile'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { loginSchema, LoginFormData } from '@/lib/validations/auth'
import { authService } from '@/services/auth'
import { Eye, EyeOff, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      console.log('Giriş başarılı:', response)
      toast.success('Giriş başarılı!')
      // Başarılı giriş sonrası dashboard'a yönlendir
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Giriş hatası:', error)
      toast.error(error instanceof Error ? error.message : 'Giriş bilgileri hatalı. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      toast.error('Lütfen e-posta adresinizi giriniz.')
      return
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast.error('Geçerli bir e-posta adresi giriniz.')
      return
    }

    setForgotPasswordLoading(true)
    try {
      await authService.forgotPassword(forgotPasswordEmail)
      setForgotPasswordSent(true)
      toast.success('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.')
    } catch (error: any) {
      console.error('Şifre sıfırlama hatası:', error)
      toast.error(error.message || 'Şifre sıfırlama talebi gönderilemedi.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const resetForgotPasswordModal = () => {
    setForgotPasswordEmail('')
    setForgotPasswordSent(false)
    setForgotPasswordLoading(false)
  }

  return (
    <Card className="w-full max-w-lg shadow-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-2 tracking-tight">
          Giriş Yap
        </CardTitle>
        <p className="text-center text-gray-600 dark:text-gray-400 text-xs font-medium">
          Hesabınıza güvenli giriş yapın
        </p>
      </CardHeader>
      <CardContent className="space-y-6 px-8 pb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              E-Posta Adresi
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm hover:shadow-md focus:shadow-lg"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                {errors.email.message}
              </p>
            )}
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Şifre
            </Label>
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
            {errors.password && (
              <p className="text-xs text-red-500 mt-2 flex items-center bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg border border-red-200 dark:border-red-800">
                <span className="mr-2 text-red-400">⚠</span>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Şifremi Unuttum Linki */}
          <div className="text-right">
            <Dialog open={forgotPasswordModalOpen} onOpenChange={(open) => {
              setForgotPasswordModalOpen(open)
              if (!open) resetForgotPasswordModal()
            }}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium underline decoration-2 underline-offset-2 transition-colors"
                >
                  Şifremi Unuttum
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Şifre Sıfırlama
                  </DialogTitle>
                </DialogHeader>
                
                {!forgotPasswordSent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
                    </p>
                    
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        E-Posta Adresi
                      </Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setForgotPasswordModalOpen(false)}
                        className="flex-1"
                      >
                        İptal
                      </Button>
                      <Button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={forgotPasswordLoading}
                        className="flex-1"
                      >
                        {forgotPasswordLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Gönderiliyor...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2 h-4 w-4" />
                            Gönder
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        E-posta Gönderildi!
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Eğer <strong>{forgotPasswordEmail}</strong> adresi sistemde kayıtlıysa, 
                        şifre sıfırlama bağlantısı gönderilmiştir.
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        E-postanızı kontrol edin ve spam klasörünü de kontrol etmeyi unutmayın.
                      </p>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setForgotPasswordModalOpen(false)}
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Giriş Sayfasına Dön
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4 pt-4">
            <Label className="text-sm font-semibold text-gray-800 dark:text-gray-200 tracking-wide">
              Güvenlik Doğrulaması
            </Label>
            <div className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
              <Turnstile
                siteKey="1x00000000000000000000AA" // Test site key
                onSuccess={(token) => setTurnstileToken(token)}
                onError={() => setTurnstileToken(null)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-8 tracking-wide relative overflow-hidden group" 
            disabled={isLoading}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center justify-center">
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </div>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}