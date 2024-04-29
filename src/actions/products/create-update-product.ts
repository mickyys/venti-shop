'use server'

import prisma from '@/lib/prisma';
import { Gender, Product, Size } from '@prisma/client';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL ?? '')



const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0),
    gender: z.nativeEnum(Gender),
    inStock: z.coerce.number().min(0),
    categoryId: z.string().uuid(),
    sizes: z.coerce.string().transform(val => val.split(',')),
    tags: z.coerce.string()
});

export const createUpdateProduct = async (formData: FormData) => {
    console.log(formData);

    const data = Object.fromEntries(formData);
    const productParsed = productSchema.safeParse(data);

    if (!productParsed.success) {
        console.log(productParsed.error);
        return {
            ok: false,
            error: productParsed.error
        }
    }

    try {
        productParsed.data.slug = productParsed.data.slug.toLowerCase().replace(/ /g, '-').trim();
        const { id, ...rest } = productParsed.data;

        const prismaTx = await prisma.$transaction(async (tx) => {
        
            let product: Product;
            const tagsArray = rest.tags.split(',').map(tag => tag.trim().toLocaleLowerCase());

            if (id) {
                product = await tx.product.update({
                    data: {
                        ...rest, sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    },
                    where: {
                        id
                    }
                })
            } else {
                product = await tx.product.create({
                    data: {
                        ...rest, sizes: {
                            set: rest.sizes as Size[]
                        },
                        tags: {
                            set: tagsArray
                        }
                    },
                })
            }

            if (formData.getAll('images')) {
                const images = await uploadImages(formData.getAll('images') as File[]);
                console.log('list images cloudinary', images);

                if(!images){
                    throw new Error(`Image upload failed`);
                }

                const productImage = await tx.productImage.createMany({
                    data: images.map(image => ({
                        url: image!,
                        productId: product.id
                    }))
                })

                console.log("productImage ==>", productImage);
            }

            return {
                ok: true,
                product
            }
        });

        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${prismaTx.product.slug}`)
        revalidatePath(`/products/${prismaTx.product.slug}`)

        return {
            ok: true,
            product: prismaTx.product
        }
    } catch (error) {
        return {
            ok: false,
            error
        }
    }

}


const uploadImages = async (images: File[]) => {
    try {
        const uploadPromises = await images.map(async (image) => {
            try {
                const buffer = await image.arrayBuffer();
                const base64Image = Buffer.from(buffer).toString('base64');
                return cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`).then(r => r.secure_url);
            } catch (error) {
                console.log(error);
                return null;
            }
        });

        const uploadImages = await Promise.all(uploadPromises);
        return uploadImages;

    } catch (error) {
        console.error(error);
        return null;
    }
}