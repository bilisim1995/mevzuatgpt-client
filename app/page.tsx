import type { Metadata } from 'next';
import Script from 'next/script';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import HomeRefreshButton from '@/components/landing/home-refresh-button';
import QuoteInfoDialog from '@/components/landing/quote-info-dialog';
import HeroLottie from '@/components/landing/hero-lottie';
import HowItWorksModal from '@/components/landing/how-it-works-modal';
import { VoiceAssistantAnimation } from '@/components/dashboard/voice-assistant-animation';

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
            <img
              src="/logo.svg"
              alt="İlBilge"
              className="h-11 w-auto"
              loading="lazy"
            />
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <HomeRefreshButton className="hover:text-primary" />
            <a href="#ozellikler" className="flex items-center gap-2 hover:text-primary">
              <span className="text-slate-400 dark:text-slate-300" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h10" />
                </svg>
              </span>
              Özellikler
            </a>
            <a href="#nasil-calisir" className="flex items-center gap-2 hover:text-primary">
              <span className="text-slate-400 dark:text-slate-300" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M6 12l4 4L18 8" />
                </svg>
              </span>
              Nasıl Çalışır
            </a>
            <a href="#kullanim-alanlari" className="flex items-center gap-2 hover:text-primary">
              <span className="text-slate-400 dark:text-slate-300" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="8" />
                  <path d="M8 12h8" />
                </svg>
              </span>
              Kullanım Alanları
            </a>
            <a href="#sss" className="flex items-center gap-2 hover:text-primary">
              <span className="text-slate-400 dark:text-slate-300" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M12 4a4 4 0 00-4 4" />
                  <path d="M12 10v4" />
                  <circle cx="12" cy="18" r="1" />
                </svg>
              </span>
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

            <div className="relative flex h-[440px] items-center justify-center md:h-[540px] md:-translate-y-6">
              <HeroLottie className="h-full w-full max-w-[580px] -translate-y-3 md:-translate-y-6" />
            </div>
          </div>
        </section>

        <section className="pb-10 md:pb-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-lg backdrop-blur md:p-8 dark:border-slate-700/50 dark:bg-slate-900/70">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    İlBilge Nedir ?
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl dark:text-white">
                    Mevzuat ve içtihat araştırmalarında akıllı yardımcı
                  </h2>
                </div>
                <p className="max-w-xl text-base text-slate-600 dark:text-slate-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vitae
                  arcu id libero porta dictum. Integer posuere, nibh id hendrerit
                  ultrices, lacus justo facilisis velit.
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 7.5C4 6.12 5.12 5 6.5 5H18" />
                        <path d="M4 16.5C4 17.88 5.12 19 6.5 19H18" />
                        <path d="M4 7.5v9" />
                        <path d="M18 5v14" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Kaynaklı Sonuçlar
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M5 12l4 4L19 6" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Hızlı Özetleme
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <circle cx="12" cy="12" r="6.5" />
                        <path d="M12 8v4l2.5 2.5" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Güncel Takip
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-200">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 16c1.5-3 4-4.5 8-4.5S18.5 13 20 16" />
                        <circle cx="12" cy="8" r="3" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Kurumsal Akış
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur md:p-10 dark:border-slate-700/50 dark:bg-slate-900/70">
              <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Kurumsal Değer Önerileri
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900 md:text-3xl dark:text-white">
                      Enterprise-grade, Secure, Integrations
                    </h2>
                    <p className="text-base text-slate-600 dark:text-slate-300">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                      dignissim, nisl nec placerat interdum, lacus urna facilisis justo,
                      sed cursus turpis lorem eget neque.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Enterprise-grade
                      </h3>
                      <p className="mt-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae
                        nibh at arcu tempor.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Secure
                      </h3>
                      <p className="mt-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                        commodo ligula.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300 sm:col-span-2">
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                        Integrations
                      </h3>
                      <p className="mt-2">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                        laoreet, purus non hendrerit tempus.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-md dark:border-slate-700/60 dark:bg-slate-800">
                    <img
                      id="value-prop-image"
                      src="https://placehold.co/640x420/png?text=Lorem"
                      alt="Örnek gösterim görseli"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      data-value-tab
                      data-image="https://placehold.co/640x420/png?text=Lorem"
                      data-alt="Lorem örnek görseli"
                      data-active="true"
                      className="rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 text-center transition data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:ring-2 data-[active=true]:ring-indigo-500/40 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-400 dark:data-[active=true]:bg-slate-900/80 dark:data-[active=true]:text-white"
                    >
                      Lorem
                    </button>
                    <button
                      type="button"
                      data-value-tab
                      data-image="https://placehold.co/640x420/png?text=Ipsum"
                      data-alt="Ipsum örnek görseli"
                      className="rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 text-center transition data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:ring-2 data-[active=true]:ring-indigo-500/40 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-400 dark:data-[active=true]:bg-slate-900/80 dark:data-[active=true]:text-white"
                    >
                      Ipsum
                    </button>
                    <button
                      type="button"
                      data-value-tab
                      data-image="https://placehold.co/640x420/png?text=Dolor"
                      data-alt="Dolor örnek görseli"
                      className="rounded-xl border border-slate-200/60 bg-white/70 px-3 py-2 text-center transition data-[active=true]:bg-white data-[active=true]:text-slate-900 data-[active=true]:ring-2 data-[active=true]:ring-indigo-500/40 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-400 dark:data-[active=true]:bg-slate-900/80 dark:data-[active=true]:text-white"
                    >
                      Dolor
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Örnek Görseller
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Kurumsal vitrin karoseli
                  </h3>
                </div>
                <span className="hidden rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs text-slate-500 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300 md:inline-flex">
                  Otomatik akış
                </span>
              </div>

              <div className="relative mt-6 overflow-hidden">
                <div className="value-carousel-track flex items-center gap-4">
                  {[
                    'https://placehold.co/420x260/png?text=Case+01',
                    'https://placehold.co/420x260/png?text=Case+02',
                    'https://placehold.co/420x260/png?text=Case+03',
                    'https://placehold.co/420x260/png?text=Case+04',
                    'https://placehold.co/420x260/png?text=Case+05',
                    'https://placehold.co/420x260/png?text=Case+06',
                  ].map((src) => (
                    <div
                      key={src}
                      className="value-carousel-card relative min-w-[220px] overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-md dark:border-slate-700/60 dark:bg-slate-900"
                    >
                      <img
                        src={src}
                        alt="Karosel örnek görseli"
                        className="h-40 w-full object-cover sm:h-44 md:h-48"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-xs text-white">
                        Lorem ipsum
                      </div>
                    </div>
                  ))}

                  {[
                    'https://placehold.co/420x260/png?text=Case+01',
                    'https://placehold.co/420x260/png?text=Case+02',
                    'https://placehold.co/420x260/png?text=Case+03',
                    'https://placehold.co/420x260/png?text=Case+04',
                    'https://placehold.co/420x260/png?text=Case+05',
                    'https://placehold.co/420x260/png?text=Case+06',
                  ].map((src) => (
                    <div
                      key={`${src}-dup`}
                      className="value-carousel-card relative min-w-[220px] overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-md dark:border-slate-700/60 dark:bg-slate-900"
                    >
                      <img
                        src={src}
                        alt="Karosel örnek görseli"
                        className="h-40 w-full object-cover sm:h-44 md:h-48"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 text-xs text-white">
                        Lorem ipsum
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white/80 to-transparent dark:from-slate-900/80"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white/80 to-transparent dark:from-slate-900/80"></div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Sesli Asistan
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Konuşarak mevzuata hızlı erişim
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Mevzuatla Konuşun, Yanıtları Sesli Alın. Klavye ve ekran sınırlarını
                      ortadan kaldırıyoruz. İlBilge’ye mevzuat veya içtihatla ilgili
                      merak ettiklerinizi sesli olarak sorun; o sizin için binlerce
                      sayfayı saniyeler içinde tarasın ve sonucu size sesli bir asistan
                      netliğinde aktarsın. Araştırma yaparken elleriniz serbest, zihniniz
                      sadece çözümde kalsın.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M12 4v10" />
                          <path d="M8 8h8" />
                          <circle cx="12" cy="16" r="3" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Sesli Sorgu
                        </p>
                      <p className="mt-1">
                        Sorularınızı sesli sorun, ilgili dokümanlardan gelen yanıtları
                        anında dinleyin.
                      </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M5 12l3 3 8-8" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Doğruluk Kontrolü
                        </p>
                      <p className="mt-1">
                        RAG ile uydurma riskini azaltır, yanıtları kaynak verilerle
                        doğrularız.
                      </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M4 12h16" />
                          <path d="M12 4v16" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          Anlık Özet
                        </p>
                      <p className="mt-1">
                        Uzun metinleri hızlıca analiz edip kritik noktaları kısa özetler
                        halinde sunarız.
                      </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/60 bg-white/70 p-3 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-200">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                          <path d="M6 8h12" />
                          <path d="M6 12h8" />
                          <path d="M6 16h10" />
                        </svg>
                      </span>
                      <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Yerli Sesli Asistan
                      </p>
                      <p className="mt-1">
                        Türkçe ve hukuki terminolojiye uyumlu, akıcı ve anlaşılır sesli
                        yanıtlar verir.
                      </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-md dark:border-slate-700/60 dark:bg-slate-800">
                  <VoiceAssistantAnimation
                    variant="preview"
                    isListening={false}
                    audioLevel={0}
                    isPlaying={false}
                  />
                  <div className="pointer-events-none absolute inset-x-6 bottom-4 flex items-end justify-center gap-1">
                    <span className="soundwave-bar h-2 w-1.5 rounded-full bg-indigo-500/60 dark:bg-cyan-300/70"></span>
                    <span className="soundwave-bar h-4 w-1.5 rounded-full bg-indigo-500/70 dark:bg-cyan-200/80" style={{ animationDelay: '0.1s' }}></span>
                    <span className="soundwave-bar h-3 w-1.5 rounded-full bg-indigo-500/60 dark:bg-cyan-300/70" style={{ animationDelay: '0.2s' }}></span>
                    <span className="soundwave-bar h-5 w-1.5 rounded-full bg-indigo-500/70 dark:bg-cyan-200/80" style={{ animationDelay: '0.3s' }}></span>
                    <span className="soundwave-bar h-3 w-1.5 rounded-full bg-indigo-500/60 dark:bg-cyan-300/70" style={{ animationDelay: '0.4s' }}></span>
                    <span className="soundwave-bar h-6 w-1.5 rounded-full bg-indigo-500/70 dark:bg-cyan-200/80" style={{ animationDelay: '0.5s' }}></span>
                    <span className="soundwave-bar h-4 w-1.5 rounded-full bg-indigo-500/60 dark:bg-cyan-300/70" style={{ animationDelay: '0.6s' }}></span>
                    <span className="soundwave-bar h-2 w-1.5 rounded-full bg-indigo-500/60 dark:bg-cyan-300/70" style={{ animationDelay: '0.7s' }}></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Öne Çıkan Özellikler
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Akıllı Filtreler
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
                        facilisi, sed feugiat lorem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M7 12l3 3 7-7" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Doğrulama
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        sollicitudin augue sit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 12a8 8 0 0116 0" />
                        <path d="M12 12l4 4" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Hızlı Arama
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                        blandit lorem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                        <path d="M4 6h16v12H4z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Raporlama
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                        posuere.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 3l4 7-4 11-4-11 4-7z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Akıllı Etiketler
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                        sit amet.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M5 7h14" />
                        <path d="M5 12h14" />
                        <path d="M5 17h10" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        İçerik Özetleri
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                        commodo.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 12h16" />
                        <path d="M12 4v16" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Takvim Takibi
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                        vehicula.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Zaman Kazandırır
                      </p>
                      <p className="mt-1 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                        consequat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-md backdrop-blur md:p-5 dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Arayüz Tanıtımı
                  </p>
                </div>
              </div>

              <div className="relative mt-6">
                <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 shadow-md dark:border-slate-700/60 dark:bg-slate-800">
                  <img
                    src="/ana-beyaz.png"
                    alt="Ürün arayüzü görseli"
                    className="h-full w-full object-cover dark:hidden"
                    loading="lazy"
                  />
                  <img
                    src="/ana-siyah.png"
                    alt="Ürün arayüzü görseli"
                    className="hidden h-full w-full object-cover dark:block"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      Vektörleştirme nedir?
                    </p>
                    <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                      Klasik arama ile vektör araması arasındaki fark
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vektör
                      araması, anlam benzerliği üzerinden sonuç döndürür; klasik arama
                      ise kelime eşleşmesine odaklanır.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Klasik Arama
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>Kelime eşleşmesi odaklı</li>
                        <li>Bağlamı sınırlı yorumlar</li>
                        <li>Net ifadelerle daha güçlü</li>
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Vektör Araması
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>Anlam ve niyet odaklı</li>
                        <li>Benzer kavramları yakalar</li>
                        <li>Doğal dilde daha etkilidir</li>
                      </ul>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      Rakiplerimizden farkımız
                    </p>
                    <p className="mt-2">
                      Neden İlBilge? Gerçek Veri, Sıfır Halüsinasyon. Rakiplerimiz
                      sorularınızı doğrudan dil modellerine (LLM) emanet ederek
                      "tahmini" yanıtlar üretirken; biz RAG (Retrieval-Augmented
                      Generation) teknolojisiyle verinizi matematiksel bir kesinliğe
                      dönüştürüyoruz.
                    </p>
                    <p className="mt-2">
                      Bizim sistemimizde LLM bir karar verici değil, veriyi size en
                      anlaşılır şekilde sunan bir tercümandır. Bu sayede uydurulmuş yanıt
                      riskini ortadan kaldırıyor, %100 doküman sadakati sağlıyoruz.
                    </p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-100 p-4 shadow-md dark:border-slate-700/60 dark:bg-slate-800">
                  <div className="absolute -left-8 top-6 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl dark:bg-cyan-400/10"></div>
                  <div className="absolute -right-10 bottom-4 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl dark:bg-indigo-500/10"></div>
                  <HeroLottie
                    className="h-72 w-full origin-center scale-[1.08] sm:h-80"
                    path="/vector.json"
                    ariaLabel="Vektör animasyonu"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Karşılaştırma Tablosu
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Rakipler vs İlBilge
                  </h3>
                </div>
                <span className="hidden rounded-full border border-slate-200/70 bg-white/80 px-3 py-1 text-xs text-slate-500 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300 md:inline-flex">
                  RAG odaklı kıyas
                </span>
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-700/50">
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr_1fr]">
                  <div className="border-b border-slate-200/60 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300">
                    Özellik
                  </div>
                  <div className="border-b border-slate-200/60 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300">
                    Standart Yapay Zeka (Rakipler)
                  </div>
                  <div className="border-b border-slate-200/60 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-slate-300">
                    İlBilge (RAG Teknolojisi)
                  </div>

                  <div className="flex items-start gap-2 border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 7h16" />
                        <path d="M4 12h16" />
                        <path d="M4 17h10" />
                      </svg>
                    </span>
                    Bilgi Kaynağı
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12" />
                          <path d="M18 6l-12 12" />
                        </svg>
                      </span>
                      <span>Modelin kendi eğitimi (Genel bilgi)</span>
                    </div>
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l4 4 10-10" />
                        </svg>
                      </span>
                      <span>Doğrudan sizin yüklediğiniz dokümanlar</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 8v4" />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M8 4h8" />
                      </svg>
                    </span>
                    Doğruluk Payı
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12" />
                          <path d="M18 6l-12 12" />
                        </svg>
                      </span>
                      <span>"Uydurma" (Hallucination) riski yüksek</span>
                    </div>
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l4 4 10-10" />
                        </svg>
                      </span>
                      <span>Matematiksel veri eşleşmesi ile maksimum doğruluk</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 4v8" />
                        <path d="M8 12h8" />
                        <path d="M6 20h12" />
                      </svg>
                    </span>
                    LLM'in Rolü
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12" />
                          <path d="M18 6l-12 12" />
                        </svg>
                      </span>
                      <span>Yanıtı ve bilgiyi kendisi üretir</span>
                    </div>
                  </div>
                  <div className="border-b border-slate-200/60 px-4 py-4 text-sm text-slate-600 dark:border-slate-700/50 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l4 4 10-10" />
                        </svg>
                      </span>
                      <span>Sadece veriyi anlaşılır bir dile çevirir</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M7 12l3 3 7-7" />
                      </svg>
                    </span>
                    Güvenilirlik
                  </div>
                  <div className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 6l12 12" />
                          <path d="M18 6l-12 12" />
                        </svg>
                      </span>
                      <span>Kaynağı belirsiz yanıtlar</span>
                    </div>
                  </div>
                  <div className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12l4 4 10-10" />
                        </svg>
                      </span>
                      <span>Kaynağı dokümana dayalı, doğrulanabilir sonuçlar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="pointer-events-none absolute -left-10 top-6 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/20"></div>
              <div className="pointer-events-none absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/20"></div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    Halüsinasyon Testi (Canlı Kanıt)
                  </p>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Gerçek veri ile uydurma yanıtı kıyaslayın
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Tek tıkla örnek bir soru sorulmuş gibi çalışır ve iki yaklaşımı
                    yan yana gösterir.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-300">
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/80 px-2 py-1 dark:border-slate-700/60 dark:bg-slate-900/70">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12l4 4 10-10" />
                      </svg>
                      Kaynaklı Yanıt
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/80 px-2 py-1 dark:border-slate-700/60 dark:bg-slate-900/70">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 6l12 12" />
                        <path d="M18 6l-12 12" />
                      </svg>
                      Uydurma Riski
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white/80 px-2 py-1 dark:border-slate-700/60 dark:bg-slate-900/70">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12h16" />
                        <path d="M12 4v16" />
                      </svg>
                      Canlı Karşılaştırma
                    </span>
                  </div>
                </div>
                <button
                  id="hallucination-ask"
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:bg-white dark:text-slate-900"
                >
                  Sor
                </button>
              </div>

              <div className="relative mt-6 grid gap-4 md:grid-cols-2">
                <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200/70 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/80 dark:text-slate-300 md:inline-flex">
                  VS
                </span>
                <div className="rounded-2xl border border-rose-200/70 bg-rose-50/70 p-4 text-sm text-slate-700 shadow-sm dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-rose-700 dark:text-rose-200">
                      LLM Cevabı (Uydurma)
                    </p>
                    <span className="rounded-full bg-rose-500/10 px-2 py-1 text-xs text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      Düşük Güven
                    </span>
                  </div>
                  <p id="llm-answer" className="mt-3 text-sm">
                    Soruyu görmek için “Sor” butonuna tıklayın.
                  </p>
                </div>
                <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-sm text-slate-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-950/30 dark:text-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-emerald-700 dark:text-emerald-200">
                      İlBilge RAG Cevabı
                    </p>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                      Güven: %96
                    </span>
                  </div>
                  <p id="rag-answer" className="mt-3 text-sm">
                    Kaynaklı cevabı görmek için “Sor” butonuna tıklayın.
                  </p>
                  <div className="mt-3 rounded-xl border border-emerald-200/60 bg-white/70 px-3 py-2 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-900/40 dark:text-emerald-200">
                    Kaynak: Yüklenen dokümanlar (MADDE 12, Sayfa 4)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Kullanıcı Yorumları
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Gerçek kullanıcılardan kısa geri bildirimler.
                </p>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Ayse K.
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Hukuk Danismani
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        5/5
                      </span>
                      <div className="flex items-center text-amber-500">
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                    facilisis, sapien in cursus placerat, lorem neque. Integer ac
                    ullamcorper lacus, ac dignissim nulla. Nulla facilisi.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Mehmet S.
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Uyum Uzmani
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        5/5
                      </span>
                      <div className="flex items-center text-amber-500">
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
                    varius, nisl sed rutrum porta, erat. Cras ut lorem vitae nibh
                    efficitur luctus.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Elif D.
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Arastirma Ekibi
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                        5/5
                      </span>
                      <div className="flex items-center text-amber-500">
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                        <svg viewBox="0 0 20 20" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M10 15.27l-4.18 2.2 1-4.66-3.5-3.22 4.72-.44L10 5l1.96 4.15 4.72.44-3.5 3.22 1 4.66L10 15.27z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                    posuere, justo nec sagittis eleifend. Pellentesque habitant morbi
                    tristique senectus et netus.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-16 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-md backdrop-blur dark:border-slate-700/50 dark:bg-slate-900/60">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Sıkça Sorulan Sorular
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  10 maddelik kısa yanıtlar.
                </p>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 3a6 6 0 00-6 6" />
                        <path d="M12 9v4" />
                        <circle cx="12" cy="17" r="1" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        IlBilge nedir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                        vitae nunc.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M7 12l3 3 7-7" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Kaynaklar nasil dogrulaniyor?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                        posuere ante at.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 4v16" />
                        <path d="M4 12h16" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Hangi mevzuatlar kapsanir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi
                        convallis.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-500/20 dark:text-fuchsia-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M4 6h16v12H4z" />
                        <path d="M8 10h8" />
                        <path d="M8 14h6" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Raporlar nasil olusturulur?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                        facilisis.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 6v6l4 2" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Yanitlar ne kadar hizli gelir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                        venenatis.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Takimlarla nasil paylasilir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                        blandit.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <circle cx="12" cy="12" r="8" />
                        <path d="M12 8v4l2 2" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Guncelleme sikligi nedir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
                        finibus.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-lime-500/10 text-lime-600 dark:bg-lime-500/20 dark:text-lime-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M6 8h12" />
                        <path d="M6 12h12" />
                        <path d="M6 16h8" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Cikti formatlari nelerdir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                        posuere.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M12 4a4 4 0 014 4c0 2-2 3-4 5-2-2-4-3-4-5a4 4 0 014-4z" />
                        <path d="M8 18h8" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Veri guvenligi nasil saglanir?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                        facilisis.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/70 p-4 text-sm text-slate-600 shadow-sm dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-200">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <path d="M5 6h14" />
                        <path d="M7 10h10" />
                        <path d="M9 14h6" />
                        <path d="M11 18h2" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        Kurumsal paketler mevcut mu?
                      </p>
                      <p className="mt-1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                        erat volutpat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Script id="value-prop-image-switcher" strategy="afterInteractive">
          {`
            (function () {
              var image = document.getElementById('value-prop-image');
              var tabs = document.querySelectorAll('[data-value-tab]');
              if (!image || !tabs.length) return;

              function activate(tab) {
                tabs.forEach(function (item) {
                  item.dataset.active = 'false';
                });
                tab.dataset.active = 'true';
                if (tab.dataset.image) {
                  image.src = tab.dataset.image;
                }
                if (tab.dataset.alt) {
                  image.alt = tab.dataset.alt;
                }
              }

              tabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                  activate(tab);
                });
              });
            })();
          `}
        </Script>
        <Script id="scroll-to-top-progress" strategy="afterInteractive">
          {`
            (function () {
              var button = document.getElementById('scroll-to-top');
              var progress = document.getElementById('scroll-progress');
              if (!button || !progress) return;

              var radius = 18;
              var circumference = 2 * Math.PI * radius;
              progress.style.strokeDasharray = String(circumference);
              progress.style.strokeDashoffset = String(circumference);

              function updateProgress() {
                var scrollTop = window.scrollY || document.documentElement.scrollTop;
                var docHeight = document.documentElement.scrollHeight - window.innerHeight;
                var ratio = docHeight > 0 ? scrollTop / docHeight : 0;
                var offset = circumference * (1 - ratio);
                progress.style.strokeDashoffset = String(offset);

                if (scrollTop > 200) {
                  button.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
                  button.classList.add('opacity-100');
                } else {
                  button.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
                  button.classList.remove('opacity-100');
                }
              }

              button.addEventListener('click', function () {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });

              window.addEventListener('scroll', updateProgress, { passive: true });
              window.addEventListener('resize', updateProgress);
              updateProgress();
            })();
          `}
        </Script>
        <Script id="hallucination-test" strategy="afterInteractive">
          {`
            (function () {
              var askButton = document.getElementById('hallucination-ask');
              var llmAnswer = document.getElementById('llm-answer');
              var ragAnswer = document.getElementById('rag-answer');
              if (!askButton || !llmAnswer || !ragAnswer) return;

              var isRunning = false;
              var llmText =
                "Bu sorunun yanıtı genel olarak kurumlara göre değişir ve çoğu durumda yüzde 75-85 aralığında uygulanır. Ayrıca 2023 güncellemeleriyle birlikte ek istisnalar da getirilmiştir.";
              var ragText =
                "Yüklenen dokümana göre oran %92 olarak belirlenmiştir ve yalnızca MADDE 12 kapsamındaki başvurularda geçerlidir. Ek istisnalar MADDE 14'te listelenmiştir.";

              function setLoading(target) {
                target.innerHTML =
                  "<span class='typing-dot'></span><span class='typing-dot'></span><span class='typing-dot'></span>";
              }

              function typeText(target, text, speed) {
                var i = 0;
                target.textContent = "";
                function tick() {
                  if (i <= text.length) {
                    target.textContent = text.slice(0, i);
                    i += 1;
                    window.setTimeout(tick, speed);
                  }
                }
                tick();
              }

              askButton.addEventListener('click', function () {
                if (isRunning) return;
                isRunning = true;
                askButton.classList.add('opacity-70', 'cursor-wait');
                setLoading(llmAnswer);
                setLoading(ragAnswer);

                window.setTimeout(function () {
                  typeText(llmAnswer, llmText, 18);
                  typeText(ragAnswer, ragText, 16);
                }, 900);

                window.setTimeout(function () {
                  askButton.classList.remove('opacity-70', 'cursor-wait');
                  isRunning = false;
                }, 3200);
              });
            })();
          `}
        </Script>

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
        <button
          id="scroll-to-top"
          type="button"
          aria-label="Yukarı çık"
          className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/70 bg-white/90 text-slate-700 shadow-lg transition opacity-0 translate-y-2 pointer-events-none hover:bg-white dark:border-slate-700/60 dark:bg-slate-900/80 dark:text-slate-200"
        >
          <svg className="absolute h-12 w-12" viewBox="0 0 40 40" aria-hidden>
            <circle
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="2.5"
            />
            <circle
              id="scroll-progress"
              cx="20"
              cy="20"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
          </svg>
          <span className="relative text-lg">↑</span>
        </button>
        <style>{`
          .value-carousel-track {
            width: max-content;
            animation: value-carousel-marquee 28s linear infinite;
          }

          .value-carousel-track:hover {
            animation-play-state: paused;
          }

          @keyframes value-carousel-marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .value-carousel-track {
              animation: none;
            }

            .voice-bar {
              animation: none;
            }

            .typing-dot {
              animation: none;
            }

            .soundwave-bar {
              animation: none;
            }

          }

          .voice-bar {
            animation: voice-equalizer 1.2s ease-in-out infinite;
          }

          @keyframes voice-equalizer {
            0%,
            100% {
              transform: scaleY(0.5);
            }
            50% {
              transform: scaleY(1.2);
            }
          }

          .typing-dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            margin-right: 4px;
            border-radius: 9999px;
            background: currentColor;
            opacity: 0.4;
            animation: typing-bounce 1s ease-in-out infinite;
          }

          .typing-dot:nth-child(2) {
            animation-delay: 0.15s;
          }

          .typing-dot:nth-child(3) {
            animation-delay: 0.3s;
          }

          @keyframes typing-bounce {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            50% {
              transform: translateY(-4px);
              opacity: 1;
            }
          }

          .soundwave-bar {
            animation: soundwave-pulse 1.4s ease-in-out infinite;
          }

          @keyframes soundwave-pulse {
            0%,
            100% {
              transform: scaleY(0.4);
              opacity: 0.6;
            }
            50% {
              transform: scaleY(1.3);
              opacity: 1;
            }
          }

        `}</style>
      </main>

      <footer className="border-t border-white/30 py-10 dark:border-slate-700/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <img src="/logo.svg" alt="İlBilge" className="h-10 w-auto" loading="lazy" />
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