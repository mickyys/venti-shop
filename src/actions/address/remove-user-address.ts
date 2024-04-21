import prisma from "@/lib/prisma";


export const removeAddress = async (userId : string) => {
    try {
        console.log(`removeAddress ==========================> `, userId);
        await prisma.user.delete({
            where: {
                id: userId
            },
        });
        
        return {
            ok: true
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo borrar la dirección'
        }
    }
}