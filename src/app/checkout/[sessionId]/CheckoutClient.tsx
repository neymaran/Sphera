/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
import { useRouter } from 'next/navigation'

export default function CheckoutClient({ 
  sessionId, 
  mpPublicKey, 
  totalAmount, 
  buyerEmail,
  primaryColor 
}: { 
  sessionId: string
  mpPublicKey: string
  totalAmount: number
  buyerEmail: string
  primaryColor: string
}) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    initMercadoPago(mpPublicKey, { locale: 'pt-BR' })
  }, [mpPublicKey])

  const initialization = {
    amount: parseFloat(totalAmount.toFixed(2)),
    payer: {
      email: buyerEmail,
    }
  }

  const customization = {
    paymentMethods: {
      pix: 'all',
      creditCard: 'all',
      debitCard: 'all',
    },
    visual: {
      style: {
        theme: 'default' as const,
        customVariables: {
          baseColor: primaryColor
        }
      }
    }
  }

  const onSubmit = async (param: any) => {
    setIsProcessing(true)
    setErrorMsg('')
    try {
      const response = await fetch('/api/checkout/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: param.formData || param,
          sessionId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      router.push(`/ingresso/${sessionId}`)
    } catch (error: any) {
      console.error(error)
      setErrorMsg(error.message || 'Erro inesperado ao pagar.')
      setIsProcessing(false)
      throw error
    }
  }

  const onError = async (error: any) => {
    console.error(error)
  }

  return (
    <div>
      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {errorMsg}
        </div>
      )}
      
      {isProcessing && (
        <div className="mb-6 p-4 bg-blue-50 text-blue-600 rounded-lg text-sm border border-blue-100 flex items-center justify-center gap-2 font-medium">
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          Processando pagamento...
        </div>
      )}

      <div className={isProcessing ? 'opacity-50 pointer-events-none' : ''}>
        <Payment
          initialization={initialization}
          customization={customization as any}
          onSubmit={onSubmit}
          onError={onError}
        />
      </div>
    </div>
  )
}
