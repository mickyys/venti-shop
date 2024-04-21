'use client'
import { useAddressStore, useCartStore } from '@/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { currencyFormat, sleep } from '@/utils';
import clsx from 'clsx';
import { placeOrder } from '@/actions';
import { useRouter } from 'next/navigation';

export const PlaceOrder = () => {
    const addressStore = useAddressStore(state => state.address);
    const { subTotal, impuesto, totalFinal, items } = useCartStore(state => state.getSummaryInformations())
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart);

    const router = useRouter();
    const { firstName, lastName, address, address2, city, country, postalCode, phone } = addressStore;
    const [loaded, setLoaded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)

    useEffect(() => {
        setLoaded(true);
    }, [])

    if (!loaded) {
        return <p>Cargando...</p>
    }

    const onPlaceOrder = async()=>{
        setIsPlacingOrder(true);
        const productToOrder = cart.map(product => ({
            productId: product.id,
            quantity: product.quantity,
            size: product.size
        }));

        const resp = await placeOrder(productToOrder, addressStore);
        console.log(resp);

        if(!resp?.ok){
            setIsPlacingOrder(false);
            setErrorMessage(resp?.message);
            return;
        }

        clearCart();
        router.replace('/orders/' + resp.order?.id);
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección entrega</h2>
            <div className="mb-10">
                <p className="text-xl">{firstName} {lastName}</p>
                <p>{address}</p>
                <p>{address2}</p>
                <p>{city}</p>
                <p>{country}</p>
                <p>Codigo Postal: {postalCode}</p>
                <p>Telefono {phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen orden</h2>
            <div className="grid grid-cols-2">
                <span> No. Productos</span>
                <span className="text-right"> {items} articulos</span>

                <span> Subtotal</span>
                <span className="text-right"> {currencyFormat(subTotal)}</span>

                <span> Impuestos</span>
                <span className="text-right"> {currencyFormat(impuesto)}</span>

                <span className="text-2xl mt-5"> Total</span>
                <span className="text-right mt-5 text-2xl"> {currencyFormat(totalFinal)} </span>
            </div>
            <div className="mt-5 mb-2 w-full">

                <p className='text-red-500 mb-2'>{errorMessage}</p>

                
                <button 
                onClick={onPlaceOrder}
                className={
                    clsx({
                        'btn-primary' : !isPlacingOrder,
                        'btn-disabled' : isPlacingOrder
                    })
                }>
                    Colocar orden
                </button>
            </div>
        </div>
    )
}
