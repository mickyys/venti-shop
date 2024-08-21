import { getOrderByID } from '@/actions';
import {  paypalCheckPayment } from '@/actions/payments/ventipay-check-payment';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
  params: { id: string; }
}

export default async function VentiPayConfirm({ params }: Props) {
  const { id } = params;
  
  const order = await getOrderByID(id);
  await paypalCheckPayment(id, order.order!.transactionId!);
  redirect(`/orders/${id}`);
  return (
    <>
    <div>VentiPayConfirm {id}</div>
    </>
  )
}
