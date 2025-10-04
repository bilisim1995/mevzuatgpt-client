import { NextRequest, NextResponse } from 'next/server'
import { createDirectPayment } from '@/lib/iyzico-manual'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
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
        id: body.buyerId,
        name: body.buyerName,
        surname: body.buyerSurname,
        gsmNumber: '+905350000000',
        email: body.buyerEmail,
        identityNumber: body.buyerIdentityNumber,
        lastLoginDate: new Date().toISOString().split('T')[0] + ' 10:00:00',
        registrationDate: new Date().toISOString().split('T')[0] + ' 10:00:00',
        registrationAddress: body.buyerAddress,
        ip: body.buyerIp,
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
      paymentCard: {
        cardHolderName: body.cardHolderName,
        cardNumber: body.cardNumber,
        expireMonth: body.expiryMonth,
        expireYear: body.expiryYear,
        cvc: body.cvv,
        registerCard: 0
      }
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
