import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getUsers = async ()  => {

    try {
        const session = await auth();
        const userId = session?.user.id;
        if (!userId) {
            return {
                ok: false,
                message: "No hay sesión de usuario"
            }
        };

        if (session.user.roles.includes("user")) {
            return {
                ok: false,
                message: "No tienes permisos para realizar esta acción"
            }
        }



        const users = await prisma.user.findMany({
            orderBy:{
                name: 'asc'
            }
        });

        return {
            ok: true,
            users
        };
    } catch (error) {
        return {
            ok: false,
            error
        }
    }

}