import crypto from 'crypto'

// İyzico API konfigürasyonları (sandbox ve production)
export const IYZICO_CONFIGS: Record<'sandbox' | 'production', { apiKey: string; secretKey: string; baseUrl: string }> = {
  sandbox: {
    apiKey: 'sandbox-7OzmQy32DrtWAhongzdGLb7HJLNTffxL',
    secretKey: 'sandbox-NG9DJJUZqXOqtWu0v88UTt3q7N11zyhz',
    baseUrl: 'https://sandbox-api.iyzipay.com'
  },
  production: {
    apiKey: 'M3C1KyZHo48GPnUJK5sRys1LqAxNOlwM',
    secretKey: 'YcQ6GmGjFr33XdSBRWgxfkREh72eKz3y',
    baseUrl: 'https://api.iyzipay.com'
  }
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
export async function createDirectPayment(requestData: any, mode: 'sandbox' | 'production' = 'sandbox') {
  try {
    const randomKey = new Date().getTime() + Math.random().toString(36).substring(2, 15)
    const uriPath = '/payment/auth' // Non-3DS için doğru endpoint
    const selectedConfig = IYZICO_CONFIGS[mode] || IYZICO_CONFIGS.sandbox
    const headers = createIyzicoHeaders(selectedConfig.apiKey, selectedConfig.secretKey, randomKey, uriPath, requestData)

    const baseUrlOverride = (requestData && requestData.__baseUrlOverride) ? requestData.__baseUrlOverride : selectedConfig.baseUrl
    // İç kullanım alanı olan __baseUrlOverride istekten kaldırılır
    if (requestData && requestData.__baseUrlOverride) {
      delete requestData.__baseUrlOverride
    }
    const response = await fetch(`${baseUrlOverride}/payment/auth`, {
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

