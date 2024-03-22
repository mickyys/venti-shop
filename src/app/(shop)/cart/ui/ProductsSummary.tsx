'use client'
import { useCartStore } from '@/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { currencyFormat } from '../../../../utils/currencyFormat';


export const ProductsSummary = () => {
    const { subTotal, impuesto, totalFinal, items } = useCartStore(state => state.getSummaryInformations())
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <div className=" bg-white rounded-xl shadow-xl p-7 h-fit">
            <h2 className="text-2xl mb-2">Resumen orden</h2>
            <div className="grid grid-cols-2">
                <span> No. Productos</span>
                <span className="text-right"> {items} { items === 1 ? 'articulo' : 'articulos'}</span>

                <span> Subtotal</span>
                <span className="text-right"> {currencyFormat(subTotal)} </span>

                <span> Impuestos</span>
                <span className="text-right"> {currencyFormat(impuesto)}</span>

                <span className="text-2xl mt-5"> Total</span>
                <span className="text-right mt-5 text-2xl"> {currencyFormat(totalFinal)} </span>
            </div>
            <div className="mt-5 mb-2 w-full">
                <Link href={"/checkout/address"} className="flex btn-primary justify-center">Checkout</Link>
            </div>
        </div>
    )
}
