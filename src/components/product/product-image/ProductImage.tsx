import Image from 'next/image'
import React from 'react'

interface Props {
    src?: string,
    alt: string,
    className?: React.StyleHTMLAttributes<HTMLImageElement>['className']
    width?: number,
    height?: number
}

export const ProductImage = ({ src, alt, className, width, height }: Props) => {

    const localSrc = (src) ? src.startsWith('http') ? src : `/products/${src}` : '/imgs/placeholder.jpg'
    console.log(localSrc);
    return (
        <Image
            src={localSrc}
            width={width}
            height={height}
            style={{ width: '100px', height: '100px' }}
            alt={alt}
            className={className}
        />
    )
}
