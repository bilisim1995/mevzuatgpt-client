// İyzico konfigürasyonu (Test ortamı)
export const iyzicoConfig = {
  apiKey: 'sandbox-Fa5NExTBNOHvExD91jpG5UUiA9hB1OwP',
  secretKey: 'sandbox-WxoGjsPXGSTgSLjcoxlFS1gJ0ahhPzJ7',
  baseUrl: 'https://sandbox-api.iyzipay.com'
}


// Ödeme işlemi için gerekli parametreler
export interface PaymentRequest {
  price: number
  currency: string
  conversationId: string
  buyerId: string
  buyerName: string
  buyerSurname: string
  buyerEmail: string
  buyerIdentityNumber: string
  buyerIp: string
  buyerCity: string
  buyerCountry: string
  buyerZipCode: string
  buyerAddress: string
  buyerPhoneNumber?: string
  registrationDate?: string
  lastLoginDate?: string
  cardNumber: string
  cardHolderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
  installment: number
}

// Direkt ödeme (3D Secure olmadan)
export const createDirectPayment = async (request: PaymentRequest) => {
  try {
    // İyzico API'sine gerçek direkt ödeme isteği gönder
    const response = await fetch('/api/iyzico/create-direct-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw new Error('Payment failed')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Payment error:', error)
    throw error
  }
}

