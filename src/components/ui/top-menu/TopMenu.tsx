'use client'
import { titleFont } from '@/config/fonts'
import { useCartStore, useUIStore } from '@/store'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoCarOutline, IoCartOutline, IoSearchOutline } from 'react-icons/io5'

export const TopMenu = () => {
    const openSideMenu = useUIStore(state => state.openSideMenu);
    const totalItems = useCartStore(state => state.getTotalItems());
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setLoaded(true)
    }, [])
    

    return (
        <nav className='flex px-5 justify-between items-center w-full'>
            <div>
                <Link href='/'>
                    <span className={`${titleFont.className} antialiased font-bold`}>Venti
                    </span>
                    <span>
                        | Shop
                    </span>
                </Link>
            </div>
            <div className='hidden sm:block'>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={"/gender/men"}>Hombres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={"/gender/women"}>Mujeres</Link>
                <Link className='m-2 p-2 rounded-md transition-all hover:bg-gray-100' href={"/gender/kid"}>Niños</Link>
            </div>

            <div className='flex items-center'>
                <Link href={"/search"} className='mx-2'>
                    <IoSearchOutline className='w-5 h-5' />
                </Link>
                <Link href={(
                    ((totalItems === 0) && loaded )?
                    '/empty' :
                    '/cart'
                    )} className='mx-2'>
                    <div className='relative'>
                        {( loaded && totalItems > 0) && (
                            <span className='fade-in absolute px-1 text-xs rounded-full font-bold -top-2 bg-blue-700 text-white -right-2'>{totalItems}</span>
                        )}
                        <IoCartOutline className='w-5 h-5' />
                    </div>
                </Link>
                <button onClick={openSideMenu} className='m-2 p-2 rounded-md transition-all hover:bg-gray-100'>Menú</button>
            </div>


        </nav>
    )
}
