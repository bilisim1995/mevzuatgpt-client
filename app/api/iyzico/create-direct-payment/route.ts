import { NextRequest, NextResponse } from 'next/server'
import { createDirectPayment } from '@/lib/iyzico-manual'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Gerçek kullanıcı IP adresini al
    const getClientIP = (request: NextRequest): string => {
      const forwarded = request.headers.get('x-forwarded-for')
      const realIP = request.headers.get('x-real-ip')
      const cfConnectingIP = request.headers.get('cf-connecting-ip')
      const xClientIP = request.headers.get('x-client-ip')
      const xForwarded = request.headers.get('x-forwarded')
      
      // Öncelik sırasına göre IP adresini al
      if (forwarded) {
        const ips = forwarded.split(',').map(ip => ip.trim())
        const validIP = ips.find(ip => ip && ip !== '::1' && ip !== '127.0.0.1' && ip !== 'localhost')
        if (validIP) return validIP
        return ips[0]
      }
      if (realIP && realIP !== '::1' && realIP !== '127.0.0.1') {
        return realIP
      }
      if (cfConnectingIP && cfConnectingIP !== '::1' && cfConnectingIP !== '127.0.0.1') {
        return cfConnectingIP
      }
      if (xClientIP && xClientIP !== '::1' && xClientIP !== '127.0.0.1') {
        return xClientIP
      }
      if (xForwarded && xForwarded !== '::1' && xForwarded !== '127.0.0.1') {
        return xForwarded
      }
      
      // Fallback olarak gerçek bir IP kullan (::1 yerine)
      return '88.123.45.67'
    }
    
    const clientIP = getClientIP(request)
    const currentDate = new Date()
    const registrationDate = body.registrationDate || currentDate.toISOString().split('T')[0] + ' 10:00:00'
    const lastLoginDate = body.lastLoginDate || currentDate.toISOString().split('T')[0] + ' 10:00:00'
    
    const requestData = {
      locale: 'tr',
      conversationId: body.conversationId,
      price: parseFloat(body.price.toString()),
      paidPrice: parseFloat(body.price.toString()),
      currency: 'TRY',
      installment: body.installment || 1,
      paymentChannel: 'WEB',
      paymentGroup: 'PRODUCT',
      basketId: 'B' + Date.now(),
      buyer: {
        id: body.buyerId, // mevzuatgpt-xxxxx formatında gelecek
        name: body.buyerName,
        surname: body.buyerSurname,
        gsmNumber: body.buyerPhoneNumber || '+905350000000',
        email: body.buyerEmail,
        identityNumber: body.buyerIdentityNumber,
        lastLoginDate: lastLoginDate,
        registrationDate: registrationDate,
        registrationAddress: body.buyerAddress,
        ip: clientIP, // Gerçek IP adresi
        city: body.buyerCity,
        country: body.buyerCountry,
        zipCode: body.buyerZipCode
      },
      shippingAddress: {
        contactName: body.buyerName + ' ' + body.buyerSurname,
        city: body.buyerCity,
        country: body.buyerCountry,
        address: body.buyerAddress,
        zipCode: body.buyerZipCode
      },
      billingAddress: {
        contactName: body.buyerName + ' ' + body.buyerSurname,
        city: body.buyerCity,
        country: body.buyerCountry,
        address: body.buyerAddress,
        zipCode: body.buyerZipCode
      },
      basketItems: [
        {
          id: 'BI101',
          name: 'Hizmet Hakkı',
          category1: 'Hizmet',
          category2: 'Kredi',
          itemType: 'VIRTUAL',
          price: parseFloat(body.price.toString())
        }
      ],
      // Ek güvenlik ve takip bilgileri
      callbackUrl: process.env.NEXT_PUBLIC_BASE_URL + '/payment/callback',
      enabledInstallments: [1],
      // Kullanıcı davranış analizi için ek bilgiler
      userAgent: request.headers.get('user-agent') || 'Unknown',
      referrer: request.headers.get('referer') || '',
      acceptLanguage: request.headers.get('accept-language') || 'tr-TR',
      paymentCard: {
        cardHolderName: body.cardHolderName,
        cardNumber: body.cardNumber,
        expireMonth: body.expiryMonth,
        expireYear: body.expiryYear,
        cvc: body.cvv,
        registerCard: 0
      }
    }

    // Detaylı ödeme bilgilerini logla
    console.log('=== İyzico Ödeme İsteği Detayları ===')
    console.log('Kullanıcı IP:', clientIP)
    console.log('Kayıt Tarihi:', registrationDate)
    console.log('Son Giriş:', lastLoginDate)
    console.log('Kart Sahibi:', body.cardHolderName)
    console.log('Kart Numarası:', body.cardNumber?.replace(/(.{4})/g, '$1 ').replace(/\s+$/, ''))
    console.log('Son Kullanma:', `${body.expiryMonth}/${body.expiryYear}`)
    console.log('Fatura Adresi:', body.buyerAddress)
    console.log('Şehir:', body.buyerCity)
    console.log('Ülke:', body.buyerCountry)
    console.log('E-posta:', body.buyerEmail)
    console.log('Telefon:', body.buyerPhoneNumber)
    console.log('T.C. Kimlik:', body.buyerIdentityNumber)
    console.log('User Agent:', request.headers.get('user-agent'))
    console.log('Referrer:', request.headers.get('referer'))
    console.log('Accept Language:', request.headers.get('accept-language'))
    console.log('=====================================')

    // payment_mode header'ına göre baseUrl override et
    const paymentMode = request.headers.get('x-payment-mode') || ''
    if (paymentMode === 'sandbox') {
      ;(requestData as any).__baseUrlOverride = 'https://sandbox-api.iyzipay.com'
    } else if (paymentMode === 'production') {
      ;(requestData as any).__baseUrlOverride = 'https://api.iyzipay.com'
    }

    // Gerçek İyzico API çağrısı - Direkt ödeme
    try {
      const result = await createDirectPayment(requestData)
      console.log('İyzico Direct Payment Response:', result)
      return NextResponse.json(result)
    } catch (error: any) {
      console.error('İyzico API Error:', error)
      return NextResponse.json({ 
        error: 'Payment failed',
        details: error.message 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error('Server Error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
