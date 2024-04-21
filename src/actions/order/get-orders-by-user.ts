import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getOrdersByUser = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    };

    const orders = await prisma.order.findMany({
        where: {
            userId
        },
        include: {
            OrderAddress: true
        }
    });

    return {
        ok: true,
        orders
    };
}