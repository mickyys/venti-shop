'use client'
import { QuantitySelector } from '@/components';
import { ProductImage } from '@/components/product/product-image/ProductImage';
import { useCartStore } from '@/store';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export const ProductsInCart = () => {
    const productsInCart = useCartStore(state => state.cart);
    const updateProductToCart = useCartStore(state => state.updateProductToCart);
    const removeProductToCart = useCartStore(state => state.removeProductToCart);
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
                    <ProductImage
                        src={product.images}
                        width={100}
                        height={100}
                        alt={product.title}
                        className="mr-5 rounded"
                    />
                    <div>
                        <Link className='hover:underline cursor-pointer' href={`/product/${product.slug}`}>
                            <p>{product.title}</p>
                        </Link>

                        <p>{product.size}</p>
                        <p>${product.price}</p>
                        <QuantitySelector quantity={product.quantity} onQuantityChanged={ (quantity)=> updateProductToCart(product, quantity) } />
                        <button className="underline mb-3" onClick={() => removeProductToCart(product)}>
                            Remover
                        </button>
                    </div>
                </div>
            ))
            }
        </>

    )
}
