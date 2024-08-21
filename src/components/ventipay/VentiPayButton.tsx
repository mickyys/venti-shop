'use client'
import { setOrdersTransaction } from '@/actions'
import { createOrderPayment } from '@/actions/payments/ventipay-check-payment'
import Image from 'next/image'
import React from 'react'

interface Props {
    orderId: string,
    amount: number
}

export const VentiPayButton = ({orderId, amount} : Props) => {

    const createPay = async () => {
        console.log('createPay', orderId, amount);
        const order = await createOrderPayment(orderId, amount);
        await setOrdersTransaction(orderId, order!.id);
        window.location.href = order!.url
        
    }

    return (
        <button onClick={createPay} className="w-full h-[40px] mb-4 flex items-center justify-center bg-gray-200">
            <Image width={100}
                height={100} src="/imgs/ventipay.svg" alt="Pagar con VentiPay" className="h-full object-contain" />
        </button>

    )
}
