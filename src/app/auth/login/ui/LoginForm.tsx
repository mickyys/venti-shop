'use client'
import { authenticate } from '@/actions'
import { titleFont } from '@/config/fonts'
import clsx from 'clsx'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

export const LoginForm = () => {
    const [state, dispatch] = useFormState(authenticate, undefined);
    console.log('state', state);
    useEffect(() => {
      if(state === 'Success') {
        window.location.replace('/')
      }
    }, [state])
    
    return (
        <>
            <form action={dispatch} >
                <h1 className={`${titleFont.className} text-4xl mb-5`}>Ingresar</h1>

                <div className="flex flex-col">

                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        className="px-5 py-2 border bg-gray-200 rounded mb-5"
                        type="email"
                        name='email'
                    />


                    <label htmlFor="password">Contraseña</label>
                    <input
                        name='password'
                        className="px-5 py-2 border bg-gray-200 rounded mb-5"
                        type="text" />


                    {state === 'Invalid credentials.' && (
                        <><div
                            className="flex flow-row mb-3 items-end space-x-1"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            <p className="text-sm text-red-500">Credenciales Incorrectas</p>
                        </div>
                        </>
                    )}

                    <LoginButton />

                    {/* divisor l ine */}
                    <div className="flex items-center my-5">
                        <div className="flex-1 border-t border-gray-500"></div>
                        <div className="px-2 text-gray-800">O</div>
                        <div className="flex-1 border-t border-gray-500"></div>
                    </div>

                    <Link
                        href="/auth/new-account"
                        className="btn-secondary text-center">
                        Crear una nueva cuenta
                    </Link>

                </div>
            </form>
        </>
    )
}

function LoginButton() {
    const { pending } = useFormStatus();
    return (
        <button 
            aria-disabled={pending}
            disabled={pending}
            type='submit'
            className={clsx({
                'btn-primary': !pending,
                'btn-disabled': pending
            })}>
            Ingresar
        </button>
    );
}