'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import { Product } from '@/interfaces'
import { useCartStore } from '@/store'
import { Size } from '@prisma/client'
import React, { useState } from 'react'

interface Props {
    product: Product
}

export const AddToCart = ({ product }: Props) => {
    const addProductToCart = useCartStore(state => state.addProductToCart)
    const [sizeSelected, setSize] = useState<Size | undefined>()
    const [quantitySelected, setQuantity] = useState<number>(1)
    const [posted, setPosted] = useState<boolean>(false)

    const addToCart = () => {
        setPosted(true)
        if (!sizeSelected) return;

        addProductToCart({
            id: product.id,
            images: product.images[0],
            price: product.price,
            title: product.title,
            size: sizeSelected,
            quantity: quantitySelected,
            slug: product.slug
        });

        setPosted(false)  
        setQuantity(1);
        setSize(undefined);
}


return (
    

    <>
        {posted && !sizeSelected && (
            <span className='mt-2 text-red-500'>
                Debe de seleccionar una talla*
            </span>
        )}

        <SizeSelector
            selectedSize={sizeSelected}
            availableSizes={product.sizes}
            onSizeSelected={setSize}
        />
        <QuantitySelector quantity={quantitySelected} onQuantityChanged={setQuantity} />

        <button onClick={addToCart} className="btn-primary my-5"> Agregar al carrito </button>
    </>
)
}
