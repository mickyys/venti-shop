'use client'
import React, { useState } from 'react'
import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5'

interface Props {
    quantity: number
    onQuantityChanged: (quantity: number) => void
}

export const QuantitySelector = ({ quantity, onQuantityChanged } : Props) => {
  
  const onValueQuantityChanged = (value : number) => {
    if(quantity + value < 1){
        return
    }
    onQuantityChanged(quantity + value);
  } 

  return (
    <div className='flex'>
        <button onClick={ ()=> onValueQuantityChanged(-1)}>
            <IoRemoveCircleOutline size={30}/>
        </button>
        <span className='w-20 mx-3 mt-1 bg-gray-300 text-center rounded'>
            {quantity}
        </span>
        <button onClick={()=> onValueQuantityChanged(+1)}>
            <IoAddCircleOutline size={30}/>
        </button>
    </div>
  )
}
