import Link from 'next/link'
import { LoginForm } from '@/components/auth/login-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-lg w-full space-y-8">
        <LoginForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Hesabınız yok mu?{' '}
            <Link 
              href="/register" 
              className="text-primary hover:text-primary/80 font-medium underline decoration-2 underline-offset-2 transition-colors"
            >
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}