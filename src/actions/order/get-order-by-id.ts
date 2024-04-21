import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrderByID = async (id: string) => {

    try {
        const session = await auth();
        const userId = session?.user.id;
        if (!userId) {
            return {
                ok: false,
                message: "No hay sesión de usuario"
            }
        };



        const order = await prisma.order.findFirst({
            where: {
                id
            },
            include:{
                OrderAddress: {
                    include: {
                        country: true
                    }
                },
                OrderItem:{
                    select:{
                        price: true,
                        quantity: true,
                        size: true,
                        product: {
                            select:{
                                title: true,
                                slug: true,
                                ProductImage:{
                                    select:{
                                        url: true
                                    },
                                    take:1
                                }
                            }
                        }
                    }
                }
            }
        });

        if(!order) {
            return {
                ok: false,
                message: "No se encontró la orden"
            }
        }
        if (order.userId != userId && !session.user.roles.includes("user")) {
            return {
                ok: false,
                message: "No tienes permisos para realizar esta acción"
            }
        }

        return {
            ok: true,
            order
        };
    } catch (error) {
        return {
            ok: false,
            error
        }
    }

}