'use server'
import { auth } from "@/auth.config";
import { Address, ValidSizes } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: ValidSizes
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    };

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(product => product.productId)
            }
        }
    })

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
    const { subTotal, tax, total } = productIds.reduce((totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(p => p.id === item.productId);

        if (!product) throw new Error(`Product ${item.productId} not found`);

        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal
        totals.tax += subTotal * 0.19;
        totals.total += subTotal * 1.19;
        return totals;
    }, { subTotal: 0, tax: 0, total: 0 })


    try {
        const prismaTx = await prisma.$transaction(async (tx) => {

            const updatedProductsPromises = products.map(async (product) => {
                const productQuantity = productIds.filter(p => p.productId === product.id).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) throw new Error(`${product.id} no tiene cantidad`);

                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            updatedProducts.forEach((updatedProduct) => {
                if (updatedProduct.inStock < 0) {
                    throw new Error(`${updatedProduct.title} no tiene cantidad`);
                }
            })


            const order = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    OrderItem: {
                        createMany: {
                            data: productIds.map(item => ({
                                productId: item.productId,
                                quantity: item.quantity,
                                size: item.size,
                                price: products.find(p => p.id = item.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            const { country, ...restAddress } = address;
            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id
                }
            })

            return {
                order,
                orderAddress,
                updatedProducts
            };
        });

        return {
            ok:true,
            order : prismaTx.order,
            prismaTx
        }
    } catch (error: any) {
        return {
            ok: false,
            message: error.message
        }
    }


}