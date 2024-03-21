'use server'
import { ValidGenders } from '@/interfaces';
import prisma from '../../lib/prisma'

interface PaginationOptions{
    page?: number;
    take?: number;
    gender?: ValidGenders;
}

export const getPaginationProductWithImages = async ({ page = 1, take= 12 } : PaginationOptions) => {

    if(isNaN(Number(page))) page = 1;
    if( page < 1 ) page = 1;

    try {
        const products = await prisma.product.findMany({
            take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take:2,
                    select:{
                        url: true
                    }
                }
            }
        })

        const total = await prisma.product.count({});
        const totalPages = Math.ceil(total / take);
        
        return {
            currentPage: page,
            totalPages,
            products: products.map(product => ({
                ...product,
                 images: product.ProductImage.map(image => image.url)
            }))
        };

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo cargar productos');
    }
}


export const getPaginationProductWithCategory= async ({ page = 1, take= 12, gender= 'men' } : PaginationOptions) => {

    if(isNaN(Number(page))) page = 1;
    if( page < 1 ) page = 1;

    try {
        console.log("gender: " + gender);
        const products = await prisma.product.findMany({
            where:{
                gender
            },
            take,
            skip: (page - 1) * take,
            include: {
                ProductImage: {
                    take:2,
                    select:{
                        url: true
                    }
                }
            }
        })
        

        console.log("products", products);

        const total = await prisma.product.count({ where: { gender }});
        const totalPages = Math.ceil(total / take);
        
        return {
            currentPage: page,
            totalPages,
            products: products.map(product => ({
                ...product,
                 images: product.ProductImage.map(image => image.url)
            }))
        };

    } catch (error) {
        console.log(error);
        throw new Error('No se pudo cargar productos');
    }
}