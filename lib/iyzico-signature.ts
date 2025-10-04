import crypto from 'crypto'

// İyzico signature hesaplama fonksiyonu
export function generateIyzicoSignature(
  apiKey: string,
  secretKey: string,
  randomString: string,
  requestData: any
): string {
  // Request body'yi stringify et
  const requestString = JSON.stringify(requestData)
  
  // Signature için gerekli string'i oluştur
  const signatureString = `[locale=${requestData.locale},conversationId=${requestData.conversationId},price=${requestData.price},paidPrice=${requestData.paidPrice},currency=${requestData.currency},installment=${requestData.installment},paymentChannel=${requestData.paymentChannel},paymentGroup=${requestData.paymentGroup},callbackUrl=${requestData.callbackUrl},enabledInstallments=${JSON.stringify(requestData.enabledInstallments)},buyer=${JSON.stringify(requestData.buyer)},shippingAddress=${JSON.stringify(requestData.shippingAddress)},billingAddress=${JSON.stringify(requestData.billingAddress)},basketItems=${JSON.stringify(requestData.basketItems)},paymentCard=${JSON.stringify(requestData.paymentCard)}]`
  
  // Hash hesapla
  const hashString = `${apiKey}${randomString}${secretKey}${signatureString}`
  const hash = crypto.createHash('sha1').update(hashString).digest('base64')
  
  return hash
}

// İyzico API isteği için header oluştur
export function createIyzicoHeaders(
  apiKey: string,
  secretKey: string,
  randomString: string,
  requestData: any
) {
  const signature = generateIyzicoSignature(apiKey, secretKey, randomString, requestData)
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `IYZWS ${apiKey}:${signature}`,
    'x-iyzi-rnd': randomString,
    'x-iyzi-client-version': '1.0.0'
  }
}
