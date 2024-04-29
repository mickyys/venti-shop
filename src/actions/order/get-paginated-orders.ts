import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return {
            ok: false,
            message: "No hay sesión de usuario"
        }
    };

    if (!session.user.roles.includes('admin')) {
        return {
            ok: false,
            message: "Role 'ADMIN' does not exist"
        }
    };


    const orders = await prisma.order.findMany({
        orderBy:{
            createdAt: 'desc'
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