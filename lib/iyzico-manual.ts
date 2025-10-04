import crypto from 'crypto'

// İyzico API konfigürasyonu
export const IYZICO_CONFIG = {
  apiKey: 'sandbox-7OzmQy32DrtWAhongzdGLb7HJLNTffxL',
  secretKey: 'sandbox-NG9DJJUZqXOqtWu0v88UTt3q7N11zyhz',
  baseUrl: 'https://sandbox-api.iyzipay.com'
}

// İyzico HMACSHA256 signature hesaplama (Resmi dokümantasyona göre)
export function generateIyzicoSignature(
  apiKey: string,
  secretKey: string,
  randomKey: string,
  uriPath: string,
  requestData: any
): string {
  // Request body'yi stringify et
  const requestBody = JSON.stringify(requestData)
  
  // Payload oluştur: randomKey + uriPath + requestBody
  const payload = randomKey + uriPath + requestBody
  
  // HMACSHA256 ile şifrele
  const encryptedData = crypto.createHmac('sha256', secretKey).update(payload).digest('hex')
  
  return encryptedData
}

// İyzico API isteği için header oluştur (HMACSHA256)
export function createIyzicoHeaders(
  apiKey: string,
  secretKey: string,
  randomKey: string,
  uriPath: string,
  requestData: any
) {
  const signature = generateIyzicoSignature(apiKey, secretKey, randomKey, uriPath, requestData)
  
  // Authorization string oluştur
  const authorizationString = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`
  const base64EncodedAuthorization = Buffer.from(authorizationString).toString('base64')
  
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `IYZWSv2 ${base64EncodedAuthorization}`,
    'x-iyzi-rnd': randomKey
  }
}


// Direkt ödeme (3D Secure olmadan) - Non-3DS
export async function createDirectPayment(requestData: any) {
  try {
    const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15)
    const uriPath = '/payment/auth' // Non-3DS için doğru endpoint
    const headers = createIyzicoHeaders(
      IYZICO_CONFIG.apiKey,
      IYZICO_CONFIG.secretKey,
      randomKey,
      uriPath,
      requestData
    )

    const response = await fetch(`${IYZICO_CONFIG.baseUrl}/payment/auth`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log('İyzico API Error (Direct Payment):', errorText)
      throw new Error(`İyzico API Error: ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.log('İyzico API Connection Error:', error)
    throw error
  }
}

