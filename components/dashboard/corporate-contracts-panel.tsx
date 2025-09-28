"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function CorporateContractsPanel() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="privacy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-10 border border-gray-200 dark:border-gray-700 mb-4 rounded-xl bg-white dark:bg-gray-800">
          <TabsTrigger value="privacy" className="text-sm py-2 rounded-lg">
            Gizlilik Politikası
          </TabsTrigger>
          <TabsTrigger value="terms" className="text-sm py-2 rounded-lg">
            İptal ve İade Koşulları
          </TabsTrigger>
          <TabsTrigger value="usage" className="text-sm py-2 rounded-lg">
            Kullanım Koşulları
          </TabsTrigger>
          <TabsTrigger value="cookies" className="text-sm py-2 rounded-lg">
            Çerez Politikası
          </TabsTrigger>
          <TabsTrigger value="data" className="text-sm py-2 rounded-lg">
            KVKK Aydınlatma Metni
          </TabsTrigger>
        </TabsList>
        <TabsContent value="privacy" className="space-y-4">
          <div className="max-h-[55vh] overflow-y-auto">
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
          </div>
        </TabsContent>
        
        <TabsContent value="terms" className="space-y-4">
          <div className="max-h-[55vh] overflow-y-auto">
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
                          <li>Satın aldığınız kredi paketinden <strong>herhangi bir krediyi kullanmış olmanız</strong> (tek bir sorgu bile yapmış olmanız yeterlidir)</li>
                          <li>14 günlük iade süresinin <strong>dolmuş olması</strong></li>
                          <li>Kredi paketinin <strong>süresi dolmuş olması</strong> (kredi paketleri belirli bir süre için geçerlidir)</li>
                          <li>Hesabınızın <strong>güvenlik ihlali</strong> nedeniyle askıya alınmış olması</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. İade İşlem Süreci
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          İade talebinizi aşağıdaki yöntemlerle iletebilirsiniz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a> adresine "İade Talebi" konulu e-posta göndererek</li>
                          <li><strong>Platform İçi:</strong> Hesap ayarlarınızdan "İade Talebi" bölümünü kullanarak</li>
                        </ul>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          İade talebinizde aşağıdaki bilgileri belirtmeniz gerekmektedir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Hesap e-posta adresiniz</li>
                          <li>Satın alma tarihi</li>
                          <li>Kredi paketi türü ve miktarı</li>
                          <li>İade talep sebebi</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. İade İşlem Süresi
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Geçerli iade talepleriniz, talebin alındığı tarihten itibaren <strong>en geç 5 (beş) iş günü</strong> içinde işleme alınır ve ödeme yaptığınız yönteme iade edilir. İade işlemi, ödeme sağlayıcınızın işlem süresine bağlı olarak 1-3 iş günü daha sürebilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. İletişim ve Destek
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          İptal ve iade işlemleri ile ilgili her türlü soru ve talebiniz için <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
                        </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4">
          <div className="max-h-[55vh] overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Kullanım Koşulları, <strong>Mevzuat GPT</strong> (bundan sonra "Platform" olarak anılacaktır) hizmetlerinin kullanımına ilişkin kuralları ve koşulları belirlemektedir. Platformumuzu kullanarak bu koşulları kabul etmiş sayılırsınız.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Hizmet Tanımı
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Mevzuat GPT, yapay zeka teknolojisi kullanarak mevzuat sorgulama hizmeti sunan bir platformdur. Kullanıcılar, kredi sistemi aracılığıyla platform üzerinde sorgu yapabilir ve mevzuat bilgilerine erişebilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Kullanıcı Yükümlülükleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformu kullanırken aşağıdaki kurallara uymanız gerekmektedir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Doğru ve güncel bilgiler sağlamak</li>
                          <li>Platformu yasal amaçlarla kullanmak</li>
                          <li>Başkalarının haklarını ihlal etmemek</li>
                          <li>Güvenlik önlemlerini ihlal etmemek</li>
                          <li>Spam veya zararlı içerik göndermemek</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Kredi Sistemi
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Platform, kredi sistemi ile çalışır. Kullanıcılar, çeşitli kredi paketleri satın alarak platform hizmetlerinden yararlanabilir. Krediler belirli süre için geçerlidir ve kullanılmadığı takdirde süresi dolduğunda geçersiz hale gelir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Hizmet Kısıtlamaları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Platform, aşağıdaki durumlarda hizmeti kısıtlayabilir veya askıya alabilir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Güvenlik ihlali şüphesi</li>
                          <li>Kullanım koşullarının ihlali</li>
                          <li>Teknik bakım ve güncellemeler</li>
                          <li>Yasal zorunluluklar</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. Sorumluluk Sınırları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Platform, hizmetlerin kesintisiz olmasını garanti etmez. Teknik arızalar, bakım çalışmaları veya diğer nedenlerle hizmet geçici olarak kesintiye uğrayabilir. Platform, bu tür kesintilerden doğan zararlardan sorumlu değildir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          6. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Kullanım koşulları ile ilgili sorularınız için <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
                        </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="cookies" className="space-y-4">
          <div className="max-h-[55vh] overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu Çerez Politikası, <strong>Mevzuat GPT</strong> web sitesi ve platformu üzerinde çerezlerin nasıl kullanıldığını açıklamaktadır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Çerez Nedir?
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Çerezler, web sitelerini ziyaret ettiğinizde tarayıcınız tarafından bilgisayarınıza veya mobil cihazınıza kaydedilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin daha iyi çalışmasını sağlar ve kullanıcı deneyimini geliştirir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Çerez Türleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          Platformumuzda aşağıdaki çerez türlerini kullanmaktayız:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Zorunlu Çerezler:</strong> Platformun temel işlevselliği için gerekli</li>
                          <li><strong>Analitik Çerezler:</strong> Kullanım istatistikleri ve performans analizi</li>
                          <li><strong>Fonksiyonel Çerezler:</strong> Kullanıcı tercihlerini hatırlama</li>
                          <li><strong>Güvenlik Çerezleri:</strong> Güvenlik ve kimlik doğrulama</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Çerez Yönetimi
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Tarayıcınızın ayarlarından çerez tercihlerinizi yönetebilirsiniz. Ancak, bazı çerezleri devre dışı bırakmanız platformun işlevselliğini etkileyebilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          Çerez politikası ile ilgili sorularınız için <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
                        </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <div className="max-h-[55vh] overflow-y-auto">
            <div className="p-4">
              <div className="space-y-4">
                <div className="prose prose-gray dark:prose-invert max-w-none text-sm">
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Bu KVKK Aydınlatma Metni, <strong>Mevzuat GPT</strong> olarak kişisel verilerinizin işlenmesi hakkında sizi bilgilendirmek amacıyla hazırlanmıştır.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          1. Veri Sorumlusu
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Kişisel verilerinizle ilgili veri sorumlusu <strong>Mevzuat GPT</strong>'dir. İletişim bilgilerimiz:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li><strong>Web Sitesi:</strong> mevzuatgpt.org</li>
                          <li><strong>E-posta:</strong> <a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          2. Kişisel Verilerin İşlenme Amaçları
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:
                        </p>
                        <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
                          <li>Hizmet sunumu ve hesap yönetimi</li>
                          <li>Müşteri hizmetleri ve destek</li>
                          <li>Güvenlik ve sahtekarlık önleme</li>
                          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                        </ul>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          3. Kişisel Verilerin Saklanma Süreleri
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca saklanır. İşlenme amacı ortadan kalktığında verileriniz silinir veya anonim hale getirilir.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          4. Haklarınız
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                          KVKK kapsamında kişisel verilerinize ilişkin haklarınız bulunmaktadır. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
                        </p>
                        
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          5. İletişim
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">
                          KVKK ile ilgili sorularınız için <strong><a href="mailto:info@mevzuatgpt.org" className="text-blue-600 dark:text-blue-400 hover:underline">info@mevzuatgpt.org</a></strong> adresi üzerinden bizimle iletişime geçebilirsiniz.
                        </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
