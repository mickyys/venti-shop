import { ValidSizes } from '@/interfaces';
import clsx from 'clsx';
import React from 'react'

interface Props {
    selectedSize?: ValidSizes;
    availableSizes: ValidSizes[];
    onSizeSelected: (size: ValidSizes) => void;
}

export const SizeSelector = ({ selectedSize, availableSizes = [], onSizeSelected }: Props) => {
    return (
        <div className='my-5 '>
            <h3 className='font-bold'>Tallas disponibles</h3>
            <div className='flex'>
                {
                    availableSizes.map((size) => (
                        <button
                            onClick={() => onSizeSelected(size)}
                            key={size}
                            className={
                                clsx(
                                    "mx-2 hover:underline text-lg",
                                    {
                                        'underline': size === selectedSize
                                    }
                                )
                            }
                        >
                            {size}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}
