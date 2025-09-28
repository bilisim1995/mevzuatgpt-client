import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { ThemeToggle } from '@/components/theme-toggle'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MevzuatGPT - Hesap Oluşturun',
  description: 'MevzuatGPT hesabınızı oluşturun ve hukuki sorularınıza AI destekli yanıtlar alın.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-lg w-full space-y-8">
        <RegisterForm />
      </div>
    </div>
  )
}