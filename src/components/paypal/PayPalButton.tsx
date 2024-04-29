'use client'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from '@paypal/paypal-js'
import React from 'react'
import { paypalCheckPayment, setOrdersTransaction } from '@/actions'

interface Props {
    orderId: string,
    amount: number
}

export const PayPalButton = ({orderId, amount} : Props) => {

    const [{ isPending }] = usePayPalScriptReducer();
    const roundedAmount = (Math.round(amount * 100) / 100)

    if (isPending) {
        return <div className='animate-pulse mb-20'>
            <div className='h-12 bg-gray-300 rounded'></div>
            <div className='h-12 bg-gray-300 rounded mt-2'></div>
        </div>;
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => {
        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    reference_id: orderId,
                    amount: {
                        value: roundedAmount.toString(),
                        currency_code: 'USD'
                    }
                }
            ]
        })
        console.log('transactionId =======>',transactionId);
        const { ok } = await setOrdersTransaction(orderId, transactionId);
        if(!ok){
            throw new Error("No se puedo actualizar la orden")
        }
        return transactionId;
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions) : Promise<void> =>{
        console.log("onApprove");
        const details = await actions.order?.capture();
        if(!details) return

        await paypalCheckPayment(details.id!);
    }

    return (
        <div className='relative z-0'>
            <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
        />
        </div>        
    )
}
