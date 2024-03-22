'use server';

import prisma from "@/lib/prisma";
import { sleep } from "@/utils";

export const getStockBySlug = async (slug: string) : Promise<number> => {
    try {
        // await sleep(3);
        const product = await prisma.product.findFirst({
            select: {
                inStock: true
            },
            where: {
                slug
            }
        });

        if (!product) return 0;

        return product.inStock ?? 0;

    } catch (error) {
        console.log(error);
        throw new Error('Error al obtener stock');
    }
}