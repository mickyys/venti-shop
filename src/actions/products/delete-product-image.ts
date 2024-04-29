'use server'
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { revalidatePath } from 'next/cache';
cloudinary.config(process.env.CLOUDINARY_URL ?? '')

export const deleteProductImage = async (imageId: number, imageUrl: string) => {
    if (!imageUrl.startsWith('http')) {
        return {
            ok: false,
            error: 'Image url is not valid'
        }
    }

    const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

    try {

        await cloudinary.uploader.destroy(imageName);
        const productImage = await prisma.productImage.delete({
            where: {
                id: imageId
            },
            select: {
                product:{
                    select:{
                        slug: true
                    }
                }
            }
        });

        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${productImage.product.slug}`)
        revalidatePath(`/products/${productImage.product.slug}`)

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            error
        }
    }

}