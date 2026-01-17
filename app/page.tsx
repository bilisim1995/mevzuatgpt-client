import type { Metadata } from 'next';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import HomeRefreshButton from '@/components/landing/home-refresh-button';

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
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-24">
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
            <div className="flex flex-col gap-7 md:pt-6">
              <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 md:text-7xl dark:text-white">
                Verilerinizi <br />
                <span className="text-gradient">Akıllı RAG ile Güçlendirin</span>
              </h1>
              <p className="text-base text-slate-600 md:text-xl dark:text-slate-300">
                Statik belgeleri dinamik bilgi grafiklerine dönüştürün. İlBilge,
                mevzuat ve içtihat verileri ile yapay zeka zekası arasında köprü
                kurar.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="glass-button-primary rounded-xl px-5 py-3.5 text-base font-semibold text-white">
                  Geliştirmeye Başla
                </Link>
                <Link
                  href="/login"
                  className="glass-button rounded-xl px-5 py-3.5 text-base font-semibold text-slate-600 transition hover:text-slate-900 dark:text-slate-200"
                >
                  Demoyu İzle
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-base text-slate-500 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
                  99.9% Bağlam doğruluğu
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#22d3ee]"></span>
                  &lt; 50ms Gecikme
                </div>
              </div>
            </div>

            <div className="relative flex h-[420px] items-center justify-center md:h-[500px]">
              <div className="absolute h-72 w-72 rounded-full bg-[#22d3ee]/20 blur-[100px] animate-pulse-slow"></div>
              <div className="absolute h-48 w-48 rounded-full bg-[#a855f7]/15 blur-[80px]"></div>

              <div className="relative h-full w-full max-w-[460px] -translate-y-6 transform-style-3d">
                <div className="absolute left-0 top-1/2 w-44 -translate-y-1/2 rounded-xl glass-panel p-4 animate-float border-t border-white/20">
                  <div className="mb-3 h-2 w-12 rounded-full bg-white/20"></div>
                  <div className="space-y-2">
                    <div className="h-1 w-full rounded-full bg-white/10"></div>
                    <div className="h-1 w-full rounded-full bg-white/10"></div>
                    <div className="h-1 w-3/4 rounded-full bg-white/10"></div>
                    <div className="h-1 w-full rounded-full bg-white/10"></div>
                    <div className="h-1 w-5/6 rounded-full bg-white/10"></div>
                  </div>
                  <div className="relative mt-4 h-20 w-full overflow-hidden rounded bg-white/5 border border-white/5">
                    <div className="scan-line absolute left-0 top-0 h-1 w-full animate-scan"></div>
                  </div>
                </div>

                <svg
                  className="absolute left-[140px] top-1/2 hidden h-[100px] w-[140px] -translate-y-1/2 text-[#22d3ee]/70 md:block"
                  viewBox="0 0 140 100"
                >
                  <path
                    d="M0,50 C40,50 40,20 140,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M0,50 C40,50 40,80 140,80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <path
                    d="M0,50 C50,50 60,50 140,50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle r="3" fill="#22d3ee">
                    <animateMotion
                      dur="2s"
                      path="M0,50 C40,50 40,20 140,20"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="2.5" fill="#a855f7">
                    <animateMotion
                      dur="2.5s"
                      path="M0,50 C40,50 40,80 140,80"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="1.5" fill="#ffffff">
                    <animateMotion
                      dur="1.8s"
                      path="M0,50 C50,50 60,50 140,50"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 animate-float-delayed">
                  <div className="relative h-52 w-52">
                    <div className="absolute left-1/2 top-1/2 z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-[#0DA6E0] to-blue-700 shadow-[0_0_40px_rgba(8,145,178,0.45)]">
                      <div className="absolute inset-0 rounded-full border border-white/30 animate-pulse-slow"></div>
                    </div>
                    <div className="absolute left-1/2 top-0 z-10 h-10 w-10 -translate-x-1/2 rounded-xl glass-panel animate-float-delayed"></div>
                    <div className="absolute bottom-4 left-4 z-10 h-12 w-12 rounded-xl glass-panel border border-[#22d3ee]/30"></div>
                    <div className="absolute bottom-10 right-0 z-10 h-9 w-9 rounded-full border border-[#a855f7]/60 bg-slate-900/80 dark:bg-[#151e32]">
                      <div className="absolute inset-0 m-auto h-2.5 w-2.5 rounded-full bg-[#a855f7]"></div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 left-12 rounded-lg glass-panel px-4 py-2.5 text-[11px] text-[#a855f7] shadow-lg">
                  <span className="block font-mono text-slate-500"># RAG Pipeline</span>
                  <span className="block font-mono">vector_db.query(user_prompt)</span>
                  <span className="block font-mono text-emerald-300">&gt;&gt; context_retrieved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ozellikler" className="relative overflow-hidden bg-[#0B1120] py-16 text-white md:py-24">
          <div className="absolute inset-0 hero-grid-pattern opacity-[0.03]"></div>
          <div className="absolute top-[40%] hidden w-full opacity-40 lg:block">
            <svg className="h-24 w-full" preserveAspectRatio="none" aria-hidden>
              <path
                className="animate-draw"
                d="M0,48 Q720,120 1440,48"
                fill="none"
                stroke="url(#grad-feature-line)"
                strokeWidth="2"
                strokeDasharray="1000"
              />
              <defs>
                <linearGradient id="grad-feature-line" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="relative mx-auto max-w-6xl px-4">
            <div className="mb-12 max-w-2xl">
              <h2 className="text-2xl font-semibold md:text-3xl">
                İlBilge ile mevzuat araştırmalarınız daha net, daha hızlı
              </h2>
              <p className="mt-3 text-slate-300">
                Kaynak doğrulama, özetleme ve güncel takip özellikleri tek
                platformda birleşir.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const borderAccent =
                  index === 0
                    ? 'hover:border-[#22d3ee]/60'
                    : index === 1
                      ? 'hover:border-[#a855f7]/60'
                      : index === 2
                        ? 'hover:border-blue-500/60'
                        : 'hover:border-emerald-400/60';
                return (
                  <div
                    key={feature.title}
                    className={`group relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)] ${borderAccent}`}
                  >
                    <div className="mb-5 h-12 w-12 rounded-xl border border-white/10 bg-[#151e32] shadow-[0_0_20px_rgba(34,211,238,0.15)]"></div>
                    <h3 className="text-lg font-semibold group-hover:text-[#22d3ee]">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="nasil-calisir" className="bg-white/40 py-16 md:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Üç adımda sonuç alın
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-300">
                    Adım {index + 1}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kullanim-alanlari" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold md:text-3xl">
                  İlBilge kimler için?
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Hukuki araştırma yapan tüm ekipler, hızlı ve güvenilir sonuç
                  almak için İlBilge’yi tercih eder.
                </p>
              </div>
              <div className="space-y-4">
                {useCases.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/30 bg-white/90 px-4 py-3 text-sm shadow-md dark:border-slate-700/40 dark:bg-slate-900/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="sss" className="bg-white/40 py-16 md:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Sıkça sorulan sorular
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80">
                <h3 className="text-lg font-semibold">
                  İlBilge hangi kaynakları kullanır?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Resmi mevzuat, içtihat ve güncel düzenlemeler temel alınır.
                  Çıktılar her zaman kaynak referanslarıyla birlikte gelir.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80">
                <h3 className="text-lg font-semibold">
                  Ekipler birlikte çalışabilir mi?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Evet. Paylaşılabilir raporlar ve ortak çalışma alanları ile
                  ekip içi koordinasyon kolaylaşır.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80">
                <h3 className="text-lg font-semibold">
                  Mobilde sorunsuz çalışır mı?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  İlBilge, mobil uyumlu arayüzü sayesinde tüm cihazlarda hızlı
                  ve kolay kullanım sağlar.
                </p>
              </div>
              <div className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80">
                <h3 className="text-lg font-semibold">
                  İlBilge güvenli mi?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Güvenli erişim, rol bazlı kontrol ve kurumsal ihtiyaçlara
                  uygun altyapı sunar.
                </p>
              </div>
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