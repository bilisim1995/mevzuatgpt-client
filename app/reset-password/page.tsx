import { Suspense } from 'react'; // React'ten Suspense'i import edin
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { ThemeToggle } from '@/components/theme-toggle';

// Yüklenirken gösterilecek basit bir bileşen
function LoadingFallback() {
  return <div>Form yükleniyor...</div>;
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-lg w-full space-y-8">
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}