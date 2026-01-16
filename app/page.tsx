import type { Metadata } from 'next';
import Image from 'next/image';
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_band_colored.svg"
              alt="İlBilge logosu"
              width={140}
              height={36}
              priority
            />
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
              href="/login"
              className="hidden rounded-full border px-4 py-2 text-sm font-medium hover:bg-secondary md:inline-flex"
            >
              Giriş Yap
            </Link>
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
        <section className="bg-transparent">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center gap-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#0DA6E0]">
                İlBilge
              </p>
              <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
                Mevzuat ve içtihat araştırmalarınızı hızlandıran yapay zeka
                destekli asistan
              </h1>
              <p className="text-base text-muted-foreground md:text-lg">
                İlBilge, hukuki araştırmaları güvenilir kaynaklarla birleştirir,
                sonuçları anlaşılır özetlere dönüştürür ve ekiplerin ortak
                çalışma hızını artırır.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-full bg-[#0DA6E0] px-6 py-3 text-center text-sm font-medium text-white hover:opacity-90"
                >
                  Ücretsiz Dene
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-[#2E77BC]/40 px-6 py-3 text-center text-sm font-medium text-[#2E77BC] hover:bg-[#2E77BC]/10"
                >
                  Demo Gör
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span>Kaynaklı cevaplar</span>
                <span>Güncel mevzuat takibi</span>
                <span>Mobil uyumlu deneyim</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-6 shadow-2xl dark:border-slate-700/30 dark:bg-slate-900/85">
                <div className="space-y-4">
                  <div className="rounded-2xl bg-blue-50/80 p-4 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                    “İlBilge, 6102 sayılı Türk Ticaret Kanunu kapsamında,
                    pay devri süreçlerinde dikkat edilmesi gereken kritik
                    maddeleri özetler.”
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-300/60 p-4 text-xs text-slate-500 dark:border-slate-700/60 dark:text-slate-300">
                    <p className="font-medium text-slate-800 dark:text-slate-100">Öne Çıkan Kaynaklar</p>
                    <ul className="mt-2 space-y-1">
                      <li>TTK m. 490-492</li>
                      <li>Yargıtay 11. HD 2022/1234</li>
                      <li>Güncel Tebliğ 2024/7</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-blue-100/80 p-4 text-xs text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                    Raporu tek tıkla paylaşın ve ekipçe aynı kaynağı görün.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ozellikler" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-2xl font-semibold md:text-3xl">
                İlBilge ile mevzuat araştırmalarınız daha net, daha hızlı
              </h2>
              <p className="mt-3 text-muted-foreground">
                Kaynak doğrulama, özetleme ve güncel takip özellikleri tek
                platformda birleşir.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/30 bg-white/90 p-6 shadow-xl dark:border-slate-700/40 dark:bg-slate-900/80"
                >
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="nasil-calisir" className="bg-white/40 py-16 md:py-24 dark:bg-slate-900/40">
          <div className="mx-auto max-w-6xl px-6">
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
          <div className="mx-auto max-w-6xl px-6">
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
          <div className="mx-auto max-w-6xl px-6">
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
          <div className="mx-auto max-w-6xl px-6">
            <div className="rounded-3xl bg-gradient-to-r from-blue-600/90 to-indigo-600/90 px-6 py-12 text-center text-white shadow-2xl md:px-12 dark:from-blue-600/70 dark:to-indigo-700/70">
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
                  className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-900 hover:opacity-90"
                >
                  Hemen Başla
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/30 py-10 dark:border-slate-700/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 md:flex-row md:items-center md:justify-between">
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