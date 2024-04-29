'use client'
import { removeAddress, setUserAddress } from '@/actions'
import { Checkbox } from '@/components'
import { Address } from '@/interfaces'
import { useAddressStore } from '@/store'
import { Country } from '@prisma/client'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


interface FormInputs {
    firstName: string
    lastName: string
    address: string
    address2: string
    postalCode: string
    city: string
    country: string
    phone: string
    rememberAddress: boolean
}

interface Props {
    countries: Country[],
    userStoreAddress?: Partial<Address>
}

export const AddressForm = ({ countries, userStoreAddress = {} }: Props) => {
    const { setAddress, address } = useAddressStore(state => state);
    const { data: session } = useSession({ required: true });
    const [errorMessage, setErrorMessage] = useState<string>('');
    const router = useRouter();
    const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<FormInputs>({
        defaultValues: {
            ...userStoreAddress as any,
            rememberAddress: false
        }
    })
    useEffect(() => {
        reset(address);
    }, [address, reset])


    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('');
        console.log(data);
        const { rememberAddress, ...restAddress } = data;
        setAddress(restAddress);

        if (data.rememberAddress) {
            console.log("session!.user.id", session!.user.id);
            await setUserAddress(restAddress, session!.user.id)
        } else {
            await removeAddress(session!.user.id);
        }

        router.push('/checkout');
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2">
            <div className="flex flex-col mb-2">
                <span>Nombres</span>
                <input
                    type="text"
                    autoFocus
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.firstName?.type === 'required',
                        })}
                    {...register('firstName', { required: true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Apellidos</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.lastName?.type === 'required',
                        })}
                    {...register('lastName', { required: true })}

                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.address?.type === 'required',
                        })}
                    {...register('address', { required: true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Dirección 2 (opcional)</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.address2?.type === 'required',
                        })}
                    {...register('address2')}
                />
            </div>


            <div className="flex flex-col mb-2">
                <span>Código postal</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.postalCode?.type === 'required',
                        })}
                    {...register('postalCode', { required: true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>Ciudad</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.city?.type === 'required',
                        })}
                    {...register('city', { required: true })}
                />
            </div>

            <div className="flex flex-col mb-2">
                <span>País</span>
                <select
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.country?.type === 'required',
                        })}
                    {...register('country', { required: true })}
                >
                    <option value="">[ Seleccione ]</option>
                    {
                        countries.map(country => (
                            <option key={country.id} value={country.id}>{country.name}</option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col mb-2">
                <span>Teléfono</span>
                <input
                    type="text"
                    className={clsx(
                        "p-2 border bg-gray-200 rounded-md",
                        {
                            'border-red-500': errors.phone?.type === 'required',
                        })}
                    {...register('phone', { required: true })}
                />
            </div>

            <div className="flex flex-col mb-2 sm:mt-1">
                <Checkbox register={register} text={'¿Recordar dirección?'} className='mb-10' />
                <button
                    type='submit'
                    className={clsx(
                        "flex w-full sm:w-1/2 justify-center", {
                        'btn-primary': isValid,
                        'btn-disabled': !isValid
                    })}>
                    Siguiente
                </button>
            </div>
        </form>
    )
}
