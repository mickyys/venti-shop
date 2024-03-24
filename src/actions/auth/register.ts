'use server'

import prisma from "@/lib/prisma";
import bcryptjs from 'bcryptjs';

export const registerUser = async (name: string, email: string, password: string) => {
    try {

        const existUser = await prisma.user.findFirst({where: { email}})            
        if(existUser) {
           throw new Error(`User ${email} already exists`)
        }

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email.toLocaleLowerCase(),
                password: bcryptjs.hashSync(password)
            },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
        
        return {
            ok:true,
            user: user,
            message: `User ${email} created`
        }
    } catch (error) {
        console.log(error);
        return{
            ok: false,
            message: 'No se pudo crear el usuario'
        }
    }
}