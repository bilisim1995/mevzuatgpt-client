/**
 * T.C. Kimlik No doğrulama fonksiyonları
 */

/**
 * T.C. Kimlik No'nun geçerli olup olmadığını kontrol eder
 * @param tcNo - Kontrol edilecek T.C. Kimlik No
 * @returns boolean - Geçerli ise true, değilse false
 */
export function validateTCKimlikNo(tcNo: string): boolean {
  // Boş veya null kontrolü
  if (!tcNo || tcNo.trim() === '') {
    return false
  }

  // Sadece rakam kontrolü
  if (!/^\d+$/.test(tcNo)) {
    return false
  }

  // 11 haneli olmalı
  if (tcNo.length !== 11) {
    return false
  }

  // İlk hane 0 olamaz
  if (tcNo[0] === '0') {
    return false
  }

  // Tüm haneler aynı olamaz (11111111111 gibi)
  if (/^(\d)\1{10}$/.test(tcNo)) {
    return false
  }

  // Algoritma kontrolü
  const digits = tcNo.split('').map(Number)
  
  // 1, 3, 5, 7, 9. hanelerin toplamı
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  
  // 2, 4, 6, 8. hanelerin toplamı
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  
  // 10. hane kontrolü: (oddSum * 7 - evenSum) % 10
  const checkDigit10 = (oddSum * 7 - evenSum) % 10
  if (checkDigit10 !== digits[9]) {
    return false
  }
  
  // 11. hane kontrolü: (oddSum + evenSum + digits[9]) % 10
  const checkDigit11 = (oddSum + evenSum + digits[9]) % 10
  if (checkDigit11 !== digits[10]) {
    return false
  }

  return true
}

/**
 * T.C. Kimlik No'nun geçerli olup olmadığını kontrol eder ve hata mesajı döndürür
 * @param tcNo - Kontrol edilecek T.C. Kimlik No
 * @returns {isValid: boolean, message: string}
 */
export function validateTCKimlikNoWithMessage(tcNo: string): {isValid: boolean, message: string} {
  if (!tcNo || tcNo.trim() === '') {
    return { isValid: false, message: 'T.C. Kimlik No boş olamaz' }
  }

  if (!/^\d+$/.test(tcNo)) {
    return { isValid: false, message: 'T.C. Kimlik No sadece rakamlardan oluşmalıdır' }
  }

  if (tcNo.length !== 11) {
    return { isValid: false, message: 'T.C. Kimlik No 11 haneli olmalıdır' }
  }

  if (tcNo[0] === '0') {
    return { isValid: false, message: 'T.C. Kimlik No 0 ile başlayamaz' }
  }

  if (/^(\d)\1{10}$/.test(tcNo)) {
    return { isValid: false, message: 'Geçersiz T.C. Kimlik No formatı' }
  }

  const digits = tcNo.split('').map(Number)
  const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]
  const evenSum = digits[1] + digits[3] + digits[5] + digits[7]
  
  const checkDigit10 = (oddSum * 7 - evenSum) % 10
  if (checkDigit10 !== digits[9]) {
    return { isValid: false, message: 'Geçersiz T.C. Kimlik No' }
  }
  
  const checkDigit11 = (oddSum + evenSum + digits[9]) % 10
  if (checkDigit11 !== digits[10]) {
    return { isValid: false, message: 'Geçersiz T.C. Kimlik No' }
  }

  return { isValid: true, message: 'Geçerli T.C. Kimlik No' }
}

/**
 * Test için geçerli T.C. Kimlik No'ları
 */
export const VALID_TEST_TC_NUMBERS = [
  '12345678901', // Test için geçerli TC
  '11111111110', // Test için geçerli TC
  '22222222220', // Test için geçerli TC
]

/**
 * Test için geçersiz T.C. Kimlik No'ları
 */
export const INVALID_TEST_TC_NUMBERS = [
  '1234567890',  // 10 haneli
  '123456789012', // 12 haneli
  '01234567890',  // 0 ile başlıyor
  '11111111111',  // Tüm haneler aynı
  '00000000000',  // Tüm haneler 0
  '12345678900',  // Geçersiz algoritma
]

/**
 * T.C. Kimlik No'nun test numarası olup olmadığını kontrol eder
 * @param tcNo - Kontrol edilecek T.C. Kimlik No
 * @returns boolean - Test numarası ise true, değilse false
 */
export function isTestTCNumber(tcNo: string): boolean {
  return VALID_TEST_TC_NUMBERS.includes(tcNo)
}
