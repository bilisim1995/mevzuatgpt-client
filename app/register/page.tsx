import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-lg w-full space-y-8">
        <RegisterForm />
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Zaten hesabınız var mı?{' '}
            <Link 
              href="/login" 
              className="text-primary hover:text-primary/80 font-medium underline decoration-2 underline-offset-2 transition-colors"
            >
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}