// Ödeme güvenlik kontrolleri
export interface SecurityCheckResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  riskScore: number // 0-100 (0 = güvenli, 100 = yüksek risk)
}

// Luhn algoritması ile kart numarası doğrulama
export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(cleaned)) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// CVV doğrulama
export function validateCVV(cvv: string, cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  // Visa, Mastercard, Discover: 3 haneli
  if (['4', '5'].includes(cleaned[0]) || cleaned.startsWith('6')) {
    return /^\d{3}$/.test(cvv)
  }
  
  // American Express: 4 haneli
  if (cleaned.startsWith('3')) {
    return /^\d{4}$/.test(cvv)
  }
  
  return /^\d{3,4}$/.test(cvv)
}

// Son kullanma tarihi kontrolü
export function validateExpiryDate(month: string, year: string): boolean {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1
  
  const expMonth = parseInt(month)
  const expYear = parseInt(year)
  
  if (expMonth < 1 || expMonth > 12) return false
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  if (expYear > currentYear + 20) return false // 20 yıl sonrası şüpheli
  
  return true
}

// BIN kontrolü
export function getCardInfo(cardNumber: string): { type: string; bank: string; isTest: boolean } {
  const cleaned = cardNumber.replace(/\s/g, '')
  const bin = cleaned.substring(0, 6)
  
  // Test kartları
  const testBins = ['552879', '454671', '555544', '411111', '400000']
  const isTest = testBins.some(testBin => cleaned.startsWith(testBin))
  
  // Kart türü tespiti
  if (cleaned.startsWith('4')) {
    return { type: 'VISA', bank: 'Bilinmeyen', isTest }
  }
  if (cleaned.startsWith('5') && (cleaned[1] >= '1' && cleaned[1] <= '5')) {
    return { type: 'MASTERCARD', bank: 'Bilinmeyen', isTest }
  }
  if (cleaned.startsWith('3') && (cleaned[1] === '4' || cleaned[1] === '7')) {
    return { type: 'AMEX', bank: 'Bilinmeyen', isTest }
  }
  if (cleaned.startsWith('6')) {
    return { type: 'DISCOVER', bank: 'Bilinmeyen', isTest }
  }
  
  return { type: 'UNKNOWN', bank: 'Bilinmeyen', isTest }
}

// IP risk analizi
export function analyzeIPRisk(ip: string): { risk: number; country: string; isProxy: boolean } {
  // Basit IP analizi (gerçek uygulamada GeoIP servisi kullanılmalı)
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')
  const isPrivate = ip.startsWith('172.') || ip.startsWith('169.254.')
  
  let risk = 0
  let country = 'TR'
  let isProxy = false
  
  if (isLocalhost) {
    risk = 10 // Geliştirme ortamı
    country = 'TR'
  } else if (isPrivate) {
    risk = 20 // Özel ağ
  } else {
    // Gerçek IP analizi burada yapılabilir
    risk = 30 // Varsayılan risk
  }
  
  return { risk, country, isProxy }
}

// Şüpheli aktivite kontrolü
export function detectSuspiciousActivity(
  cardNumber: string,
  ip: string,
  amount: number,
  previousAttempts: number = 0
): { isSuspicious: boolean; reasons: string[] } {
  const reasons: string[] = []
  
  // Çok fazla deneme
  if (previousAttempts > 3) {
    reasons.push('Çok fazla başarısız deneme')
  }
  
  // Yüksek tutar
  if (amount > 10000) {
    reasons.push('Yüksek tutar')
  }
  
  // Test kartı ile yüksek tutar
  const cardInfo = getCardInfo(cardNumber)
  if (cardInfo.isTest && amount > 1000) {
    reasons.push('Test kartı ile yüksek tutar')
  }
  
  // IP risk analizi
  const ipRisk = analyzeIPRisk(ip)
  if (ipRisk.risk > 50) {
    reasons.push('Yüksek risk IP adresi')
  }
  
  return {
    isSuspicious: reasons.length > 0,
    reasons
  }
}

// Ana güvenlik kontrolü
export function performSecurityChecks(
  cardNumber: string,
  cvv: string,
  expiryMonth: string,
  expiryYear: string,
  ip: string,
  amount: number,
  previousAttempts: number = 0
): SecurityCheckResult {
  const errors: string[] = []
  const warnings: string[] = []
  let riskScore = 0
  
  // Kart numarası kontrolü
  if (!validateCardNumber(cardNumber)) {
    errors.push('Geçersiz kart numarası')
    riskScore += 30
  }
  
  // CVV kontrolü
  if (!validateCVV(cvv, cardNumber)) {
    errors.push('Geçersiz CVV')
    riskScore += 25
  }
  
  // Son kullanma tarihi kontrolü
  if (!validateExpiryDate(expiryMonth, expiryYear)) {
    errors.push('Geçersiz son kullanma tarihi')
    riskScore += 20
  }
  
  // BIN kontrolü
  const cardInfo = getCardInfo(cardNumber)
  if (cardInfo.type === 'UNKNOWN') {
    warnings.push('Bilinmeyen kart türü')
    riskScore += 10
  }
  
  if (cardInfo.isTest) {
    warnings.push('Test kartı kullanılıyor')
    riskScore += 5
  }
  
  // IP risk analizi
  const ipRisk = analyzeIPRisk(ip)
  riskScore += ipRisk.risk
  
  if (ipRisk.isProxy) {
    warnings.push('Proxy IP tespit edildi')
    riskScore += 15
  }
  
  // Şüpheli aktivite kontrolü
  const suspicious = detectSuspiciousActivity(cardNumber, ip, amount, previousAttempts)
  if (suspicious.isSuspicious) {
    warnings.push(...suspicious.reasons)
    riskScore += suspicious.reasons.length * 10
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    riskScore: Math.min(riskScore, 100)
  }
}
