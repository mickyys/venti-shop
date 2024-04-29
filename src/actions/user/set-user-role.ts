'use server'
import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Roles } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const setUserRole = async (idUser : string, role : string)  => {

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

        const newRol = Roles[role as keyof typeof Roles];

        const user = await prisma.user.update({
            where: {
                id: idUser
            },
            data: {
                roles : newRol
            }
        });

        revalidatePath('/admin/users')
        return {
            ok: true,
            user
        };
    } catch (error) {
        return {
            ok: false,
            error
        }
    }

}