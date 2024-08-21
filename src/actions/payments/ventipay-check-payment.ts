'use server'

import { VentiPayResponse } from "@/interfaces/ventipay.interface";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const createOrderPayment = async (idOrder: string, amount: number): Promise<VentiPayResponse | null> => {
    try {
      const url = `${process.env.VENIT_URL_BASE}/payments`;      
      const requestOptions = {
        method: "POST",
        headers: {
            "Authorization": `${process.env.VENTI_API_KEY_SECRET}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "cancel_url_method": "get",
            "capture": true,
            "currency": process.env.VENTI_CURRENCY,
            "success_url_method": "get",
            "amount": Math.round(amount),
            "cancel_url": `http://localhost:3000/ventipay/${idOrder}`,
            "description": `Orden ${idOrder.split('-')[0]}`,
            "success_url": `http://localhost:3000/ventipay/${idOrder}`
        })
      };
      const resp = await fetch(url, {...requestOptions, cache: 'no-cache'});
      const data = await resp.json();
      return data;
  
    } catch (error) {
        console.log("error createOrderPayment =========> ", error);
      return null;
    }
  }

export const getOrderPayment = async (id : string) : Promise<VentiPayResponse | null> =>{
  try {
    const url = `${process.env.VENIT_URL_BASE}/payments/${id}`;      
    const requestOptions = {
      method: "GET",
      headers: {
          "Authorization": `${process.env.VENTI_API_KEY_SECRET}`,
          "Content-Type": "application/json"
      }
    };
    const resp = await fetch(url, {...requestOptions, cache: 'no-cache'});
    const data = await resp.json();
    return data;

  } catch (error) {
      console.log("error createOrderPayment =========> ", error);
    return null;
  }
}

export const paypalCheckPayment = async (idOrder : string, paypalTransactionId: string) => {
  
  const order = await getOrderPayment(paypalTransactionId);

  if (order!.status !== 'succeeded') {
    return {
      ok: false,
      error: 'Order is not completed'
    }
  }

  try {
    
    await prisma.order.update({
      where: {
        id: idOrder
      },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    });

    revalidatePath(`/orders/${idOrder}`);

    return {
      ok: true,
      message: 'Order is completed'
    }

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: 'Order is not completed'
    }
  }
}