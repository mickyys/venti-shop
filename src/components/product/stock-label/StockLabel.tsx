'use client'

import { getStockBySlug } from '@/actions';
import { titleFont } from '@/config/fonts'
import React, { useEffect, useState } from 'react'

interface Props {
    slug: string;
}

export const StockLabel = ({ slug }: Props) => {

    const [stock, setStock] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getStocks();
    }, [])


    const getStocks = async () => {
        const stockSlug = await getStockBySlug(slug);
        setStock(stockSlug);
        setIsLoading(false);
    }
    return (
        <>
            {isLoading ?
                <h1 className={`${titleFont.className} antialiased font-bold text-lg bg-gray-200 animate-pulse`}>
                    &nbsp;
                </h1>
                :
                <h1 className={`${titleFont.className} antialiased font-bold text-lg `}>
                    Stock: {stock}
                </h1>
            }
        </>
    )
}
