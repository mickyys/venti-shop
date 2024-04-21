'use server';

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";




export const setUserAddress = async (address : Address, userId : string) => {
    try {
        console.log(`setUserAddress ==========================> `, userId);
        const newAddress = await createOrReplaceAddress(address, userId);
        return {
            ok: true,
            address: newAddress
        }
        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }
    }
}

export const createOrReplaceAddress = async (address : Address, userId : string) => {
    try {
        const storeAddress = await prisma.userAddress.findUnique({
            where: {
                userId
            }
        });
        const addressToSave = {
            userId: userId,
            address: address.address,
            address2: address.address2,
            postalCode: address.postalCode,
            countryId: address.country,
            phone: address.phone,              
            firstName: address.firstName,
            lastName: address.lastName,
            city: address.city
        };

        if(!storeAddress){
            const newAddress = await prisma.userAddress.create({
                data: addressToSave
            });

            return {
                ok: true,
                message: 'Dirección creada correctamente',
                address: newAddress
            }
        }else{
            const updateAdress = await prisma.userAddress.update({
                where: {
                    userId
                },
                data: addressToSave
            });

            return {
                ok: true,
                message: 'Dirección actualizada correctamente',
                address: updateAdress
            }
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: 'No se pudo grabar la dirección'
        }
    }
}