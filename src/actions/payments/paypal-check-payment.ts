'use server'

import { PaypalOrderStatusResponse } from "@/interfaces";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  console.log('paypalCheckPayment =================================', paypalTransactionId);
  const token = await getPaypalToken();
  console.log('token =================================', token);

  if (!token) {
    return {
      ok: false,
      error: 'Could not get PayPal token'
    }
  }

  const orderStatus = await getOrderPayPalByTransactionId(token, paypalTransactionId);

  if (!orderStatus) {
    return {
      ok: false,
      error: 'Could not get PayPal order'
    }
  }
  console.log('orderStatus =================================', orderStatus);
  const { status, purchase_units } = orderStatus;
  if (status !== 'COMPLETED') {
    return {
      ok: false,
      error: 'PayPal order is not completed'
    }
  }

  try {
    const { reference_id } = purchase_units[0];
    
    await prisma.order.update({
      where: {
        id: reference_id
      },
      data: {
        isPaid: true,
        paidAt: new Date()
      }
    });

    revalidatePath(`/orders/${reference_id}`);

    return {
      ok: true,
      message: 'PayPal order is completed'
    }

  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: 'PayPal order is not completed'
    }
  }
}


const getOrderPayPalByTransactionId = async (token: string, paypalTransactionId: string): Promise<PaypalOrderStatusResponse | null> => {

  try {
    const url = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}` ?? '';
    const myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const resp = await fetch(url, {...requestOptions, cache: 'no-cache'});
    const data = await resp.json();
    return data;

  } catch (error) {
    return null;
  }
}


const getPaypalToken = async (): Promise<string | null> => {

  try {
    const url = process.env.PAYPAL_OAUTH_URL ?? ''
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    const base64Token = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    const resp = await fetch(url, {...requestOptions, cache: 'no-cache'});
    const data = await resp.json();
    const { access_token, token_type } = data;
    return `${token_type} ${access_token}`;
  } catch (error) {
    return null;
  }

}