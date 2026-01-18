import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import HomeRefreshButton from '@/components/landing/home-refresh-button';
import QuoteInfoDialog from '@/components/landing/quote-info-dialog';
import HeroLottie from '@/components/landing/hero-lottie';
import HowItWorksModal from '@/components/landing/how-it-works-modal';

export const metadata: Metadata = {
  title: 'İlBilge | Mevzuat ve İçtihat Asistanı',
  description:
    'İlBilge, mevzuat ve içtihat araştırmalarını hızlandıran, güvenilir kaynaklarla çalışan yapay zeka destekli asistan.',
};

const features = [
  {
    title: 'Kaynaklı Yanıtlar',
    description:
      'Her çıktı, ilgili mevzuat ve içtihat referanslarıyla birlikte sunulur.',
  },
  {
    title: 'Akıllı Özetler',
    description:
      'Uzun metinleri, kararları ve mevzuatı hızla anlaşılır özetlere dönüştürür.',
  },
  {
    title: 'Güncel Takip',
    description:
      'Değişen mevzuatı takip eder, kritik güncellemeleri hızlıca öne çıkarır.',
  },
  {
    title: 'Kurumsal Akış',
    description:
      'Ekipler için güvenli çalışma alanları ve paylaşılabilir raporlar sunar.',
  },
];

const steps = [
  {
    title: 'Sorunu Tanımla',
    description: 'Aradığın konuyu ya da soruyu doğal dille yaz.',
  },
  {
    title: 'İlBilge Araştırır',
    description:
      'Mevzuat, içtihat ve ilgili kaynakları tarar, önceliklendirir.',
  },
  {
    title: 'Özet ve Öneri',
    description:
      'Net özetler, ilgili maddeler ve takip adımları tek sayfada.',
  },
];

const useCases = [
  'Avukatlık ve danışmanlık büroları',
  'Kamu kurumlarında mevzuat birimleri',
  'Uyum ve risk yönetimi ekipleri',
  'Akademik ve araştırma çalışmaları',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-foreground dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-md dark:border-slate-700/30 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">İlBilge</span>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <HomeRefreshButton className="hover:text-primary" />
            <a href="#ozellikler" className="hover:text-primary">
              Özellikler
            </a>
            <a href="#nasil-calisir" className="hover:text-primary">
              Nasıl Çalışır
            </a>
            <a href="#kullanim-alanlari" className="hover:text-primary">
              Kullanım Alanları
            </a>
            <a href="#sss" className="hover:text-primary">
              SSS
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/register"
              className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 md:inline-flex"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-24 md:pt-28 md:pb-28">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-[#0B1120] dark:via-slate-900 dark:to-indigo-900"></div>
            <div className="absolute inset-0 hero-grid-pattern bg-grid-mask opacity-[0.03]"></div>
            <div className="absolute left-[15%] top-[-25%] h-[520px] w-[520px] rounded-full bg-[#0DA6E0]/15 blur-[120px] dark:bg-[#22d3ee]/20"></div>
            <div className="absolute bottom-[-20%] right-[10%] h-[480px] w-[480px] rounded-full bg-[#7c3aed]/10 blur-[140px]"></div>
            <svg
              className="absolute inset-0 h-full w-full neural-lines pointer-events-none"
              viewBox="0 0 1440 900"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M0,400 C300,300 600,500 1440,200"
                fill="none"
                stroke="url(#grad-neural-1)"
                strokeWidth="1.4"
              />
              <path
                d="M-100,600 C400,800 800,400 1500,700"
                fill="none"
                stroke="url(#grad-neural-2)"
                strokeWidth="1.4"
              />
              <defs>
                <linearGradient id="grad-neural-1" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0B1120" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#0B1120" />
                </linearGradient>
                <linearGradient id="grad-neural-2" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0B1120" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#0B1120" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="mx-auto grid max-w-6xl items-start gap-16 px-4 md:grid-cols-2">
            <div className="flex flex-col gap-7 md:pt-6 md:-translate-y-6">
                <h1 className="animate-in slide-in-from-bottom-6 fade-in-0 duration-700 text-4xl font-semibold leading-[1.05] text-slate-900 md:text-6xl dark:text-white">
                Mevzuatı <br />
                <span className="text-gradient">Vektör Tabanlı Ai ile Hızlandırın</span>
              </h1>
              <QuoteInfoDialog />
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="relative rounded-full p-[2px]">
                    <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-90">
                      <span className="absolute -inset-[40%] rounded-full bg-[conic-gradient(from_0deg,rgba(255,255,255,0.75),transparent,rgba(255,255,255,0.45),transparent)] opacity-85 dark:opacity-60 animate-border-spin"></span>
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.55),_transparent_55%)]"></span>
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.45),_transparent_55%)]"></span>
                    </span>
                    <span className="relative z-10 flex items-center gap-2 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 px-6 py-3 text-base font-semibold text-slate-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                      Kullanmaya Başlayın
                      <span aria-hidden className="transition group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </span>
                </Link>
                <HowItWorksModal />
              </div>
              <div className="flex flex-wrap items-center gap-6 text-base text-slate-500 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  199 Kamu Kurumu İle Entegre
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22d3ee]"></span>
                  &lt; 50ms Gecikme
                </div>
              </div>
            </div>

            <div className="relative flex h-[420px] items-center justify-center md:h-[500px] md:-translate-y-6">
              <HeroLottie className="h-full w-full max-w-[520px] -translate-y-3 md:-translate-y-6" />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 px-4 py-12 text-center text-white shadow-2xl md:px-10 dark:from-blue-600/70 dark:to-indigo-700/70">
              <h2 className="text-2xl font-semibold md:text-3xl">
                İlBilge ile mevzuat araştırmalarınızı bugün hızlandırın
              </h2>
              <p className="mt-3 text-sm text-white/80 md:text-base">
                Kısa sürede sonuç alın, ekiplerle birlikte hareket edin ve
                güncel kalın.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:opacity-90"
                >
                  Hemen Başla
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/60 px-4 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/30 py-10 dark:border-slate-700/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold">İlBilge</p>
            <p className="text-sm text-muted-foreground">
              Mevzuat ve içtihat araştırmalarında güvenilir AI asistanı.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <a href="#ozellikler" className="hover:text-primary">
              Özellikler
            </a>
            <a href="#nasil-calisir" className="hover:text-primary">
              Nasıl Çalışır
            </a>
            <a href="#kullanim-alanlari" className="hover:text-primary">
              Kullanım Alanları
            </a>
            <a href="#sss" className="hover:text-primary">
              SSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}