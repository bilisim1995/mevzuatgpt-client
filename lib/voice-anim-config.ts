// Merkezi ayar dosyası: Ses tepki animasyonu
// Bu dosyadaki ayarlar, 3D sesli asistan görselinin davranışını kontrol eder.
// Değerleri değiştirerek, ana kürenin (blob) ve partiküllerin (küçük toplar)
// sese verdiği tepkiyi kolayca ayarlayabilirsiniz.
export const VOICE_ANIM_CONFIG = {
  /**
   * Genel seviye yumuşatma katsayısı.
   * Daha yüksek değer = Ses seviyesine daha hızlı tepki (daha az yumuşatma).
   * Daha düşük değer = Daha yumuşak, gecikmeli tepki.
   */
  smoothingLerp: 10, // Scene içinde: smoothedLevel = lerp(smoothedLevel, level, delta * smoothingLerp)

  // Küre (blob) ayarları
  blob: {
    /**
     * Materyal distorsiyonunun taban değeri.
     * Değer arttıkça küre yüzeyi daha pürüzlü/bozuk görünür.
     */
    distortBase: 0.2,
    /**
     * Ses seviyesine bağlı distorsiyon katsayısı.
     * Nihai distorsiyon = distortBase + level * distortGain
     */
    distortGain: 0.6,
    /**
     * Materyal animasyonunun taban hızı.
     */
    speedBase: 1.2,
    /**
     * Ses seviyesine bağlı hız artışı katsayısı.
     * Nihai hız = speedBase + level * speedGain
     */
    speedGain: 1.8,
    /**
     * Nefes alma-g verme efektinin genliği (ses bağımsız temel salınım).
     */
    scaleBreathAmp: 0.02,
    /**
     * Ses seviyesine bağlı ölçek artışı katsayısı.
     * Nihai ölçek çarpanı = 1 + level * scaleGain
     */
    scaleGain: 0.3,
    /**
     * Renk geçişi eşiği. level bu eşiğin üzerindeyse daha canlı renklere geçilir.
     */
    colorGate: 0.1,
    /**
     * Renk karışım hızı (ses algılandığında). Daha yüksek = daha hızlı renk değişimi.
     */
    colorLerpFast: 3,
    /**
     * Renk karışım hızı (sessizken orta tona dönüş). Daha yüksek = daha hızlı dönüş.
     */
    colorLerpSlow: 2,
  },

  // Partiküller (küçük toplar)
  particles: {
    /**
     * Render edilecek partikül adedi. Artırmak GPU/CPU yükünü yükseltebilir.
     */
    count: 100,
    /**
     * Partiküllerin sabit açısal dönüş hızı. Daha yüksek = daha hızlı dönüş.
     */
    baseSpeed: 0.5,
    /**
     * Upload (yanıt beklenirken) hız çarpanı. Düşünme etkisi için hızlanır.
     */
    uploadSpeedMultiplier: 3.5,
    /**
     * Ses seviyesi bu eşiğin üzerinde ise partiküller gizlenir.
     */
    hideThreshold: 0.1,
    /**
     * Partikül halkasının yarıçap aralığı. Ses arttıkça bu aralıkta büyür.
     */
    baseRadiusRange: [1.4, 2.2] as [number, number],
    /**
     * Partiküllerin dikey salınım genliği.
     */
    verticalAmp: 0.2,
  },

  /**
   * Gürültü kapısı: Çok düşük seviyeleri (ambiyans/gürültü) bastırmak için eşik.
   * level bu eşikten küçükse tepki büyük oranda zayıflatılır.
   */
  noiseGate: 0.03,
}


