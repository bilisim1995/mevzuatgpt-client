"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

interface CorporateContractsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CorporateContractsModal({ open, onOpenChange }: CorporateContractsModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Modal kapatıldığında tüm etkileri temizle
      setTimeout(() => {
        // Body'yi tamamen sıfırla
        document.body.style.overflow = ''
        document.body.style.pointerEvents = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.right = ''
        document.body.style.bottom = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.zIndex = ''
        
        document.documentElement.style.overflow = ''
        document.documentElement.style.pointerEvents = ''
        document.documentElement.style.position = ''
        document.documentElement.style.zIndex = ''
        
        // Tüm modal class'larını kaldır
        document.body.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        document.documentElement.classList.remove('overflow-hidden', 'fixed', 'modal-open')
        
        // Tüm modal elementlerini kaldır
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay]')
        overlays.forEach(overlay => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay)
          }
        })
        
        const portals = document.querySelectorAll('[data-radix-portal]')
        portals.forEach(portal => {
          if (portal.querySelector('[data-radix-dialog-content]') && portal.parentNode) {
            portal.parentNode.removeChild(portal)
          }
        })
        
        // Tüm yüksek z-index elementlerini sıfırla
        const allElements = document.querySelectorAll('*')
        allElements.forEach(el => {
          const element = el as HTMLElement
          if (element.style.zIndex && parseInt(element.style.zIndex) > 1000) {
            element.style.zIndex = ''
          }
        })
        
        // Focus'u geri yükle
        if (document.activeElement && document.activeElement !== document.body) {
          (document.activeElement as HTMLElement).blur()
        }
        document.body.focus()
        
        // Event listener'ları temizle
        document.removeEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            e.preventDefault()
            e.stopPropagation()
          }
        })
        
        // Body'yi yeniden aktif hale getir
        document.body.style.pointerEvents = 'auto'
        document.documentElement.style.pointerEvents = 'auto'
        
      }, 200)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] max-h-[80vh] p-0 m-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <div className="h-full flex flex-col">
          <Tabs defaultValue="privacy" className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                    Kurumsal Sözleşmeler
                  </DialogTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenChange(false)}
                    className="h-8 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          Kapat
        </Button>
                </div>
              </DialogHeader>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-10 border border-gray-200 dark:border-gray-700">
                <TabsTrigger value="privacy" className="text-sm py-2 border-r border-gray-200 dark:border-gray-700">
                  Gizlilik Politikası
                </TabsTrigger>
                <TabsTrigger value="terms" className="text-sm py-2 border-r border-gray-200 dark:border-gray-700">
                  İptal ve İade Koşulları
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-sm py-2 border-r border-gray-200 dark:border-gray-700">
                  Kullanım Koşulları
                </TabsTrigger>
                <TabsTrigger value="cookies" className="text-sm py-2 border-r border-gray-200 dark:border-gray-700">
                  Çerez Politikası
                </TabsTrigger>
                <TabsTrigger value="data" className="text-sm py-2">
                  KVKK Aydınlatma Metni
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 min-h-0 p-4 overflow-hidden">
              <TabsContent value="privacy" className="h-full">
                <ScrollArea className="h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Giriş: Amaç ve Kapsam
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Gizlilik Politikası, <strong>Mevzuat GPT</strong> ("biz", "Platform") olarak sunduğumuz hizmetlerin kullanımı sırasında kullanıcılarımızdan ("siz", "İlgili Kişi") topladığımız kişisel verilerin nasıl işlendiğini, korunduğunu ve bu konudaki haklarınızı açıklamaktadır. Gizliliğiniz bizim için en yüksek önceliktir ve tüm veri işleme faaliyetlerimizi <strong>6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)</strong> ve ilgili diğer yasal mevzuatlara tam uyum içinde yürütmeyi taahhüt ederiz.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Veri Sorumlusunun Kimliği
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          KVKK uyarınca, kişisel verilerinizle ilgili veri sorumlusu <strong>Mevzuat GPT</strong>'dir.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Web Sitesi:</strong> mevzuatgpt.org</li>
                          <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Toplanan Kişisel Veriler ve Toplanma Yöntemleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformumuzu kullanmanız sırasında sizden aşağıdaki kişisel verileri, belirtilen yöntemlerle toplayabiliriz:
                        </p>
                        
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                          Doğrudan Sizin Tarafınızdan Sağlanan Veriler:
                        </h5>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Kimlik ve İletişim Verileri:</strong> Platforma üye olurken veya bizimle iletişime geçtiğinizde paylaştığınız ad, soyadı, e-posta adresi gibi bilgiler.</li>
                        </ul>
                        
                        <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                          Hizmet Kullanımı Sırasında Otomatik Olarak Toplanan Veriler:
                        </h5>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Kullanım ve Tercih Verileri:</strong> Platform üzerinde gerçekleştirdiğiniz aramalar, sorduğunuz sorular, etkileşimde bulunduğunuz içerikler, hizmetlerimizi kullanım sıklığınız ve tercihleriniz.</li>
                          <li><strong>İşlem Güvenliği Verileri:</strong> IP adresiniz, cihaz bilgileri (işletim sistemi, tarayıcı türü), çerez verileri, siteye giriş ve çıkış zamanlarınız gibi log kayıtları.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Kişisel Verilerin İşlenme Amaçları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Kişisel verileriniz, aşağıdaki amaçlar doğrultusunda ve bu amaçlarla sınırlı olarak işlenmektedir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Hizmet Sunumu:</strong> Platforma erişiminizi sağlamak, hesap yönetiminizi gerçekleştirmek ve talep ettiğiniz hizmetleri sunmak.</li>
                          <li><strong>Hizmet Geliştirme:</strong> Kullanıcı deneyimini iyileştirmek, hizmetlerimizin performansını analiz etmek ve yeni özellikler geliştirmek.</li>
                          <li><strong>Güvenlik:</strong> Platformun, kullanıcılarımızın ve verilerin güvenliğini sağlamak; sahtekarlığı ve kötüye kullanımı önlemek.</li>
                          <li><strong>İletişim ve Destek:</strong> Sorularınıza, taleplerinize ve geri bildirimlerinize yanıt vermek; gerektiğinde hizmetle ilgili önemli bildirimleri (güncellemeler, güvenlik uyarıları vb.) iletmek.</li>
                          <li><strong>Yasal Yükümlülükler:</strong> Yasal ve idari yükümlülüklerimizi yerine getirmek, resmi makamlardan gelen taleplere yanıt vermek.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. Kişisel Verilerin Üçüncü Kişilerle Paylaşılması
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Kişisel verileriniz, kural olarak sizin açık rızanız olmaksızın üçüncü kişilerle paylaşılmaz. Ancak aşağıdaki durumlarda ve veri minimizasyonu ilkesine sıkı sıkıya bağlı kalarak paylaşım yapılabilir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Hizmet Sağlayıcılar:</strong> Platformun çalışması için gerekli olan teknik altyapı (sunucu, barındırma), analiz ve güvenlik hizmetlerini aldığımız iş ortaklarımızla, hizmetin gerektirdiği ölçüde paylaşılabilir.</li>
                          <li><strong>Yasal Merciler:</strong> Yasal bir zorunluluk olması halinde, yetkili kamu kurum ve kuruluşlarının talepleri doğrultusunda paylaşım yapılabilir.</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Tüm paylaşımlar, yasal çerçeveye uygun ve verilerinizin güvenliğini sağlayacak sözleşmesel güvenceler altında gerçekleştirilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. Veri Güvenliği Tedbirleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Kişisel verilerinizin güvenliğini sağlamak amacıyla uygun teknik ve idari tedbirleri alıyoruz. Bu kapsamda; verilerinize yetkisiz erişimi, kaybolmasını veya ifşa edilmesini önlemek için şifreleme (SSL dahil), erişim kontrol mekanizmaları, düzenli güvenlik denetimleri ve veri minimizasyonu gibi yöntemler kullanmaktayız.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          7. Verilerin Saklanma Süreleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Kişisel verileriniz, ilgili yasal mevzuatta öngörülen saklama sürelerine veya verinin işlenme amacının gerektirdiği makul sürelere uygun olarak saklanır. İşlenme amacı ortadan kalktığında veya yasal süre dolduğunda, verileriniz geri döndürülemez şekilde silinir, yok edilir veya anonim hale getirilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          8. İlgili Kişi Olarak Haklarınız (KVKK Madde 11)
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          KVKK kapsamında kişisel verilerinize ilişkin aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                          <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,</li>
                          <li>Verilerin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
                          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
                          <li>Verilerinizin düzeltilmesi, silinmesi veya yok edilmesi halinde bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                          <li>Verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu haklarınızı kullanmak için taleplerinizi <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> e-posta adresine yazılı olarak iletebilirsiniz. Başvurunuz en kısa sürede ve en geç otuz (30) gün içinde ücretsiz olarak sonuçlandırılacaktır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          9. Çerez Politikası
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Web sitemizi ziyaretiniz sırasında kullanıcı deneyiminizi geliştirmek, site trafiğini analiz etmek ve hizmetlerimizin performansını artırmak amacıyla çerezler (cookies) kullanmaktayız. Kullandığımız çerezler ve tercihlerinizi nasıl yönetebileceğiniz hakkında detaylı bilgi için <strong>Çerez Politikamızı</strong> inceleyebilirsiniz. Tarayıcınızın ayarlarından çerez tercihlerinizi dilediğiniz zaman değiştirebilirsiniz.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          10. Gizlilik Politikasındaki Değişiklikler
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Gizlilik Politikası, sunduğumuz hizmetlerdeki veya yasal mevzuattaki değişikliklere bağlı olarak güncellenebilir. Politikada yapılan önemli değişiklikler size e-posta veya Platform üzerinden bildirilecektir. Güncel politika, bu sayfada yayımlandığı tarihten itibaren geçerli olacaktır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          11. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Gizlilik Politikası veya kişisel verilerinizin işlenmesi ile ilgili her türlü soru ve talebiniz için bizimle <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden iletişime geçebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="terms" className="h-full">
                <ScrollArea className="h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu belge, <strong>Mevzuat GPT</strong> (bundan sonra "Platform" olarak anılacaktır) üzerinden satın alınan kredi paketlerinin iptal ve iade koşullarını düzenlemektedir. Platformumuzu kullanarak ve kredi paketi satın alarak aşağıdaki şartları kabul etmiş sayılırsınız.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Hizmetin Tanımı ve Niteliği
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Mevzuat GPT, kullanıcılara yapay zeka tabanlı mevzuat sorgulama hizmeti sunar. Bu hizmet, "kredi" adı verilen dijital kullanım hakları aracılığıyla sağlanır. Kullanıcılar, çeşitli boyutlardaki kredi paketlerini satın alarak Platform üzerinde sorgu yapma hakkı elde ederler.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Satın alınan her bir kredi paketi, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği kapsamında <strong>"elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallar"</strong> niteliğindedir. Bu nedenle, iade koşulları bu yasal çerçeveye göre belirlenmiştir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Cayma Hakkı ve İstisnası
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin (ğ) bendi uyarınca, "elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmelerde" tüketicinin <strong>cayma hakkı bulunmamaktadır.</strong>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Ancak, müşteri memnuniyetini önemsediğimiz için aşağıdaki özel koşulu sunuyoruz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Satın aldığınız kredi paketinden <strong>hiçbir krediyi kullanmamış olmanız şartıyla</strong>, satın alma tarihinden itibaren <strong>14 (on dört) gün</strong> içinde iptal ve tam iade talebinde bulunabilirsiniz. Bu durumda, ödediğiniz tutarın tamamı, kesintisiz olarak ödeme yaptığınız yönteme iade edilir.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. İade Edilemeyecek Durumlar
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Aşağıdaki durumlarda kredi paketleri için iptal veya iade işlemi <strong>yapılamamaktadır:</strong>
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Kısmi Kullanım:</strong> Satın alınan bir kredi paketinden <strong>en az bir (1) kredi dahi kullanılmışsa</strong>, hizmetin ifası başlamış sayılır ve paket için kısmi veya tam iade yapılmaz. Her sorgu, hizmetin anında tüketilmesi anlamına gelir ve bu işlem geri alınamaz.</li>
                          <li><strong>Cayma Hakkı Süresinin Aşılması:</strong> Hiç kullanılmamış dahi olsa, satın alma tarihinden itibaren 14 günlük süre geçmiş olan kredi paketleri için iade işlemi gerçekleştirilmez.</li>
                          <li><strong>Sübjektif Memnuniyetsizlik:</strong> Yapay zeka tarafından üretilen yanıtların doğruluğu, niteliği veya beklentilerinizi karşılamaması gibi sübjektif nedenlere dayalı iade talepleri kabul edilmez. Sunulan hizmet, sorgunun işlenmesi ve bir yanıt üretilmesidir; sonucun mükemmelliği garanti edilmez.</li>
                          <li><strong>Kullanıcı Sözleşmesi İhlali:</strong> Hizmet Koşullarımızı ihlal etmeniz nedeniyle hesabınızın askıya alınması veya sonlandırılması durumunda, kalan krediler için iade yapılmaz.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Teknik Arıza Halinde İade Koşulları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformumuzdan kaynaklanan kanıtlanabilir bir teknik arıza (örneğin; sistem hatası nedeniyle kredinizin düşmesi ancak sorgu sonucunun üretilmemesi) yaşanması durumunda, iade politikamız şu şekilde işler:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Öncelikli olarak, yaşanan teknik arıza nedeniyle haksız olarak düşülen kredi miktarı tespit edilerek hesabınıza <strong>kredi olarak iade edilir.</strong></li>
                          <li>Sorunun çözülemediği ve hizmetin sağlanamadığı istisnai durumlarda, sorundan etkilenen işlem özelinde nakit iadesi değerlendirilebilir. Bu tür talepler, teknik ekibimizin incelemesi sonucunda karara bağlanır.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. İptal ve İade Başvuru Süreci
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          İade koşullarına uygun bir talebiniz olması durumunda, aşağıdaki adımları izlemeniz gerekmektedir:
                        </p>
                        <ol className="list-decimal pl-6 text-gray-700 dark:text-gray-300 mb-3">
                          <li><strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> e-posta adresine, talebinizi açıkça belirten bir e-posta gönderin.</li>
                          <li>E-postanızda aşağıdaki bilgilerin eksiksiz olarak yer aldığından emin olun:
                            <ul className="list-disc pl-6 mt-2">
                              <li>Platforma kayıtlı e-posta adresiniz.</li>
                              <li>Sipariş numarası veya satın alma tarihi.</li>
                              <li>İade talebinizin gerekçesi (Örn: "Hiç kullanılmamış paketi iade etmek istiyorum", "Teknik arıza yaşandı").</li>
                            </ul>
                          </li>
                          <li>Talebiniz ekibimiz tarafından en geç 5 (beş) iş günü içinde incelenerek size e-posta yoluyla geri dönüş yapılacaktır.</li>
                          <li>İadenizin onaylanması durumunda, ödemeniz iyzico aracılığıyla ödeme yaptığınız kredi kartınıza/banka hesabınıza iade edilecektir. İade tutarının hesabınıza yansıması, bankanızın işlem sürelerine bağlı olarak 7-14 iş günü sürebilir.</li>
                        </ol>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          İptal ve iade politikamız ile ilgili her türlü sorunuz için bizimle <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden iletişime geçmekten çekinmeyin.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="usage" className="h-full">
                <ScrollArea className="h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Lütfen bu Kullanım Koşulları ve Hizmet Sözleşmesi'ni ("Sözleşme") dikkatlice okuyunuz. Bu Sözleşme, <strong>Mevzuat GPT</strong> ("Platform", "biz", "bizim") tarafından sunulan hizmetleri ("Hizmet") kullanımınıza ilişkin yasal olarak bağlayıcı şartları ve koşulları açıklamaktadır.
                        </p>
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Platforma erişerek veya herhangi bir hizmetini kullanarak, bu Sözleşme'yi, Gizlilik Politikamızı ve İptal ve İade Politikamızı okuduğunuzu, anladığınızı ve tüm koşullarını kabul ettiğinizi beyan etmiş olursunuz. Bu koşulları kabul etmiyorsanız, Platformu kullanmamalısınız.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Hizmetin Tanımı ve Önemli Yasal Uyarı
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Mevzuat GPT, kullanıcılara yapay zeka algoritmaları aracılığıyla Türk mevzuatı hakkında bilgi ve cevaplar sunan bir bilgi platformudur.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 font-semibold text-red-600 dark:text-red-400">
                          <strong>KRİTİK UYARI:</strong> Platform tarafından üretilen içerikler, yalnızca bilgilendirme ve araştırma amaçlıdır. <strong>HUKUKİ DANIŞMANLIK HİZMETİ DEĞİLDİR VE BU ŞEKİLDE YORUMLANAMAZ.</strong> Yapay zeka modelleri hata yapabilir, eksik veya güncel olmayan bilgiler sunabilir. Alınan cevaplar, profesyonel bir avukat veya hukuk danışmanının görüşünün yerine geçmez. Platformdan elde ettiğiniz bilgilere dayanarak alacağınız kararlar veya yapacağınız işlemler tamamen kendi sorumluluğunuzdadır. Mevzuat GPT, üretilen içeriklerin doğruluğu, eksiksizliği veya güncelliği konusunda hiçbir garanti vermez ve bu içeriklerin kullanımından doğabilecek hiçbir zarardan sorumlu tutulamaz.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Kullanıcı Hesabı ve Sorumluluklar
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Uygunluk:</strong> Hizmetlerimizi kullanmak için en az 18 yaşında ve yasal olarak sözleşme yapma ehliyetine sahip olmanız gerekmektedir.</li>
                          <li><strong>Hesap Bilgileri:</strong> Kayıt sırasında doğru, güncel ve eksiksiz bilgi sağlamakla yükümlüsünüz. Hesap bilgilerinizdeki değişiklikleri güncellemek sizin sorumluluğunuzdadır.</li>
                          <li><strong>Hesap Güvenliği:</strong> Hesap şifrenizin gizliliğini korumak ve hesabınız üzerinden gerçekleştirilen tüm faaliyetlerden siz sorumlusunuz. Hesabınızın yetkisiz kullanıldığını fark ettiğinizde derhal bizi bilgilendirmelisiniz.</li>
                          <li><strong>Tek Hesap:</strong> Her kullanıcı yalnızca bir adet hesap açabilir. Birden fazla hesap oluşturmak veya başka birinin hesabını izinsiz kullanmak yasaktır.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Kredi Sistemi ve Ödemeler
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Kredi Satın Alımı:</strong> Platformdaki hizmetler, ön ödemeli "kredi" paketleri satın alınarak kullanılır. Her sorgu, belirli bir miktarda kredinin hesabınızdan düşülmesine neden olur.</li>
                          <li><strong>Kredilerin Niteliği:</strong> Satın alınan krediler, yalnızca Platform içinde hizmet almak için kullanılabilir. Krediler nakde çevrilemez, başka bir kullanıcıya devredilemez ve iade edilemez (İptal ve İade Politikamızda belirtilen istisnai durumlar hariç).</li>
                          <li><strong>Fiyatlandırma:</strong> Kredi paketi fiyatları önceden haber verilmeksizin değiştirilebilir. Ancak bu değişiklik, daha önce satın almış olduğunuz kredileri etkilemez.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Yasaklı Faaliyetler
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformu kullanırken aşağıdakileri yapmamayı kabul edersiniz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Yasa Dışı Kullanım:</strong> Yürürlükteki yasalara aykırı herhangi bir faaliyette bulunmak.</li>
                          <li><strong>Sistemi Kötüye Kullanma:</strong> Platformun altyapısına makul olmayan ölçüde yük bindirmek, otomatik botlar, örümcekler (spiders) veya kazıyıcılar (scrapers) kullanarak veri çekmek.</li>
                          <li><strong>Tersine Mühendislik:</strong> Platformun altyapısını, algoritmalarını veya kaynak kodlarını deşifre etmeye, kaynak koda dönüştürmeye veya tersine mühendislik yapmaya çalışmak.</li>
                          <li><strong>Güvenlik İhlali:</strong> Platformun güvenlik önlemlerini delmeye veya test etmeye çalışmak.</li>
                          <li><strong>Hesap Paylaşımı:</strong> Hesabınızı başka kişilerle paylaşmak, satmak veya kiralamak.</li>
                          <li><strong>Zararlı İçerik:</strong> Virüs veya diğer zararlı yazılımları bulaştırmak.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. Fikri Mülkiyet Hakları
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Platformun Mülkiyeti:</strong> Platformun kendisi, yazılımı, tasarımı, metinleri, grafikleri, logoları ve diğer tüm bileşenleri Mevzuat GPT'nin mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.</li>
                          <li><strong>Kullanıcı İçeriği:</strong> Platforma girdiğiniz sorgular ("Kullanıcı İçeriği") size aittir. Ancak, hizmeti sağlamak, iyileştirmek ve geliştirmek amacıyla bu içeriği kullanmamız, depolamamız ve işlememiz için bize dünya çapında, telifsiz ve münhasır olmayan bir lisans vermiş olursunuz. Bu kullanım daima anonimleştirilmiş verilerle yapılır ve gizliliğiniz korunur.</li>
                          <li><strong>Üretilen İçerik:</strong> Platform tarafından üretilen cevapları kişisel veya şirket içi amaçlarla kullanabilirsiniz. Ancak, bu cevapları ticari olarak yeniden satmak, kamuya açık olarak yayınlamak veya bizden yazılı izin almadan türev çalışmalar oluşturmak yasaktır.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. Sorumluluğun Reddi ve Sınırlandırılması
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Hizmet, <strong>"OLDUĞU GİBİ"</strong> ve <strong>"MEVCUT OLDUĞU GİBİ"</strong> sunulmaktadır. Platformun kesintisiz, hatasız veya güvenli olacağına dair açık veya zımni hiçbir garanti vermemekteyiz.</li>
                          <li>Mevzuat GPT, hizmetin kullanımından veya kullanılamamasından kaynaklanan hiçbir doğrudan, dolaylı, arızi veya cezai zarardan (veri kaybı, kar kaybı dahil ancak bunlarla sınırlı olmamak üzere) sorumlu olmayacaktır.</li>
                          <li>Herhangi bir durumda, bu Sözleşme kapsamında size karşı toplam sorumluluğumuz, ilgili talepten önceki son üç (3) ay içinde bize ödediğiniz toplam tutarı aşamaz.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          7. Sözleşmenin Feshi
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Sözleşme'nin herhangi bir maddesini ihlal etmeniz durumunda, önceden haber vermeksizin hesabınızı askıya alma veya kalıcı olarak sonlandırma hakkımızı saklı tutarız. Hesabınızın sonlandırılması durumunda, kalan kredileriniz için herhangi bir iade yapılmaz ve Platforma erişiminiz engellenir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          8. Sözleşmedeki Değişiklikler
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Sözleşme'yi zaman zaman güncelleme hakkımızı saklı tutarız. Değişiklikler bu sayfada yayınlandığı tarihten itibaren geçerli olur. Önemli değişiklikleri size e-posta yoluyla veya Platform üzerinden bildirebiliriz. Değişikliklerden sonra Platformu kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          9. Uygulanacak Hukuk ve Yetkili Mahkeme
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Sözleşme, Türkiye Cumhuriyeti kanunlarına tabi olacak ve bu kanunlara göre yorumlanacaktır. Bu Sözleşme'den kaynaklanan veya bu Sözleşme ile bağlantılı her türlü uyuşmazlığın çözümünde <strong>Kayseri Mahkemeleri ve İcra Daireleri</strong> münhasıran yetkilidir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          10. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Bu Kullanım Koşulları ile ilgili sorularınız için bizimle <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden iletişime geçebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="cookies" className="h-full">
                <ScrollArea className="h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Çerez Politikası
                      </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Çerez Politikası, <strong>Mevzuat GPT</strong> ("Platform", "biz") olarak web sitemizde (mevzuatgpt.org) kullanılan çerezlere ilişkin size bilgi vermek amacıyla hazırlanmıştır. Platformumuzu kullanarak, bu politikada açıklanan çerezlerin kullanımını kabul etmiş olursunuz.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Çerez (Cookie) Nedir?
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınızda veya mobil cihazınızda depolanan küçük metin dosyalarıdır. Bu dosyalar, ziyaretinizle ilgili bilgileri (örneğin, oturum bilgileriniz, dil tercihiniz) saklayarak sonraki ziyaretlerinizde daha iyi bir kullanıcı deneyimi sunulmasına yardımcı olur.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Neden Çerez Kullanıyoruz?
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformumuzda çerezleri aşağıdaki amaçlarla kullanmaktayız:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Zorunlu İşlevsellik:</strong> Platformun temel fonksiyonlarının çalışması için gereklidir. Bu çerezler olmadan hizmetlerimizi güvenli ve düzgün bir şekilde sunamayız.
                            <ul className="list-disc pl-6 mt-2">
                              <li><em>Örnek:</em> Kullanıcı oturumunuzu açık tutmak, hesap güvenliğini sağlamak.</li>
                            </ul>
                          </li>
                          <li><strong>Performans ve Analiz:</strong> Kullanıcıların Platformu nasıl kullandığını anlamamıza yardımcı olur. Hangi sayfaların daha popüler olduğunu, sitede ne kadar zaman geçirildiğini anonim olarak analiz ederek hizmetlerimizi iyileştirmek için kullanırız.
                            <ul className="list-disc pl-6 mt-2">
                              <li><em>Örnek:</em> Google Analytics gibi servisler aracılığıyla ziyaretçi sayısını ve davranışlarını izlemek.</li>
                            </ul>
                          </li>
                          <li><strong>İşlevsellik ve Tercihler:</strong> Yaptığınız tercihleri (örneğin, "Beni Hatırla" seçeneği) hatırlayarak size daha kişiselleştirilmiş bir deneyim sunmamızı sağlar.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Kullandığımız Çerez Türleri
                        </h4>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Oturum Çerezleri:</strong> Tarayıcınızı kapattığınızda otomatik olarak silinen geçici çerezlerdir. Temel olarak, ziyaretiniz süresince Platformun düzgün çalışmasını sağlarlar.</li>
                          <li><strong>Kalıcı Çerezler:</strong> Cihazınızda belirli bir süre boyunca kalan ve Platformu tekrar ziyaret ettiğinizde sizi tanımamıza yardımcı olan çerezlerdir.</li>
                          <li><strong>Birinci Taraf Çerezler:</strong> Doğrudan Mevzuat GPT tarafından yerleştirilen çerezlerdir.</li>
                          <li><strong>Üçüncü Taraf Çerezler:</strong> İş ortaklarımız (örneğin, Google Analytics) tarafından yerleştirilen çerezlerdir. Bu çerezlerin yönetimi ilgili üçüncü tarafın gizlilik politikalarına tabidir.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Çerezleri kabul etmek zorunda değilsiniz. İnternet tarayıcınızın ayarlarını değiştirerek çerez tercihlerinizi yönetebilirsiniz. Çoğu tarayıcı, çerezleri kabul etme, reddetme, yalnızca belirli türleri kabul etme veya bir site çerez kaydetmeye çalıştığında sizi uyarma seçenekleri sunar.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Ancak, zorunlu çerezleri engellemeniz durumunda Platformumuzun bazı özelliklerinin düzgün çalışmayabileceğini lütfen unutmayın.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Tarayıcınızdaki çerezleri nasıl yöneteceğinize dair bilgilere aşağıdaki bağlantılardan ulaşabilirsiniz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                          <li><a href="https://support.mozilla.org/tr/kb/cerezleri-silme-web-sitelerinin-bilgilerini-kaldirma" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                          <li><a href="https://support.microsoft.com/tr-tr/windows/microsoft-edge-g%C3%B6zatma-verileri-ve-gizlilik-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                          <li><a href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. Politikadaki Değişiklikler
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlandığı andan itibaren geçerli olacaktır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Çerez politikamızla ilgili sorularınız için bizimle <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden iletişime geçebilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="data" className="h-full">
                <ScrollArea className="h-[60vh] border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="p-4">
                    <div className="space-y-4">
                      <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                          KVKK Aydınlatma Metni
                      </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu aydınlatma metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun ("KVKK") 10. maddesi uyarınca, Veri Sorumlusu sıfatıyla <strong>Mevzuat GPT</strong> ("Platform") olarak, kişisel verilerinizin işlenmesine ilişkin sizi bilgilendirmek amacıyla hazırlanmıştır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Veri Sorumlusunun Kimliği
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          KVKK uyarınca Veri Sorumlusu, <strong>Mevzuat GPT</strong>'dir.
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Web Sitesi:</strong> mevzuatgpt.org</li>
                          <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Kişisel Verilerin İşlenme Amaçları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Toplanan kişisel verileriniz, aşağıda belirtilen amaçlar doğrultusunda KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde işlenecektir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Hizmetlerimizin sunulması ve bu kapsamdaki üyelik işlemlerinin gerçekleştirilmesi,</li>
                          <li>Satın alınan kredi paketlerine ilişkin finansal ve muhasebesel süreçlerin yürütülmesi,</li>
                          <li>Kullanıcı talep, soru ve şikayetlerinin yönetilmesi ve müşteri desteği sağlanması,</li>
                          <li>Platformun teknik altyapısının ve veri güvenliğinin sağlanması,</li>
                          <li>Hizmet kalitesini artırmak amacıyla kullanım alışkanlıklarının analiz edilmesi ve hizmetlerin iyileştirilmesi,</li>
                          <li>Yasal düzenlemelerden kaynaklanan yükümlülüklerin yerine getirilmesi ve yetkili kurum ve kuruluşlara bilgi verilmesi,</li>
                          <li>Platformun hizmet koşullarına aykırı kullanımların ve sahtekarlığın önlenmesi.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Kişisel Verilerin Aktarılması
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Kişisel verileriniz, yukarıda sayılan amaçların gerçekleştirilmesi doğrultusunda ve KVKK'nın 8. ve 9. maddelerine uygun olarak, yurt içinde veya yurt dışında bulunan aşağıdaki alıcı gruplarıyla paylaşılabilir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Tedarikçiler ve İş Ortakları:</strong> Hizmetin teknik altyapısını (sunucu, barındırma), ödeme altyapısını (örn: iyzico) ve analiz hizmetlerini sağlayan iş ortaklarımızla, hizmetin gerektirdiği ölçüde.</li>
                          <li><strong>Yetkili Kamu Kurum ve Kuruluşları:</strong> Yasal bir zorunluluk gereği veya hukuki uyuşmazlıkların çözümü amacıyla talep edilmesi halinde, mahkemeler ve diğer kamu kurumları ile.</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Kişisel verileriniz, Platformumuza üye olmanız, hizmetlerimizi kullanmanız, bizimle iletişime geçmeniz gibi durumlarda web sitemiz ve çerezler gibi otomatik yollarla toplanmaktadır.
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Bu veriler, KVKK'nın 5. maddesinde belirtilen;
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>(c) bendi:</strong> "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması,"</li>
                          <li><strong>(ç) bendi:</strong> "Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması,"</li>
                          <li><strong>(f) bendi:</strong> "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması"</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          hukuki sebeplerine dayanılarak işlenmektedir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. İlgili Kişi Olarak Haklarınız (KVKK Madde 11)
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Kişisel veri sahibi olarak KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
                          <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
                          <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
                          <li>Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme,</li>
                          <li>Verilerin eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme,</li>
                          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
                          <li>(d) ve (e) bentleri uyarınca yapılan işlemlerin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
                          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
                          <li>Verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300">
                          Yukarıda sıralanan haklarınıza yönelik başvurularınızı <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> e-posta adresi üzerinden bize iletebilirsiniz. Talebiniz, niteliğine göre en kısa sürede ve en geç otuz (30) gün içinde ücretsiz olarak sonuçlandırılacaktır.
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
