'use client'

import { login, registerUser } from '@/actions'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormInputs = {
    name: string
    email: string
    password: string
}

export const RegisterForm = () => {
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage('');
        const { name, email, password } = data
        const resp = await registerUser(name, email, password);
        if(!resp.ok) {
            setErrorMessage(resp.message);
            return
        }
        await login(email.toLowerCase(), password);
        window.location.replace('/')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

            

            <label htmlFor="text">Nombre</label>
            <input
                className={ clsx(
                    "px-5 py-2 border bg-gray-200 rounded mb-5",
                    {
                        'border-red-500': errors.name?.type ==='required',
                    }
                )}
                type="text"
                autoFocus
                {...register('name', { required: true })}
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
                className={ clsx(
                    "px-5 py-2 border bg-gray-200 rounded mb-5",
                    {
                        'border-red-500': errors.email?.type ==='required',
                    }
                )}
                type="email"
                {...register('email', { required: true, pattern: /\S+@\S+\.\S+/i })}
            />


            <label htmlFor="password">Contraseña</label>
            <input
                className={ clsx(
                    "px-5 py-2 border bg-gray-200 rounded mb-2",
                    {
                        'border-red-500': errors.password?.type ==='required',
                    }
                )}
                type="text"
                {...register('password', { required: true })}
            />
    {
                errorMessage &&
                <span className='text-red-500 mb-3'> { errorMessage} </span>
            }
            <button
                type='submit'
                className="btn-primary">
                Crear cuenta
            </button>


            {/* divisor l ine */}
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login"
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
