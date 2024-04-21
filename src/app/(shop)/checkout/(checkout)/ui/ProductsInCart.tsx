'use client'
import { useCartStore } from '@/store';
import { currencyFormat } from '@/utils';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export const ProductsInCart = () => {
    const productsInCart = useCartStore(state => state.cart);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, [])

    if (!loaded) {
        return <p>Cargando...</p>
    }

    return (
        <>
            {productsInCart.map(product => (
                <div key={product.slug + product.size} className="flex mb-5">
                    <Image
                        src={`/products/${product.images}`}
                        width={100}
                        height={100}
                        style={{ width: '100px', height: '100px' }}
                        alt={product.title}
                        className="mr-5 rounded"
                    />
                    <div>
                        <span>
                            <p>{product.title}</p>
                        </span>

                        <p>{product.size}</p>
                        <p className='font-bold'>{currencyFormat(product.price * product.quantity)}</p>
                        <p>${product.quantity}</p>                        
                    </div>
                </div>
            ))
            }
        </>

    )
}
