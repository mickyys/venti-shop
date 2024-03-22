import { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SummaryInformation {
    subTotal: number;
    impuesto: number;
    totalFinal: number;
    items: number;
}

interface State {
    cart: CartProduct[]
    addProductToCart: (product: CartProduct) => void;
    getTotalItems: ()=> number;
    getSummaryInformations: () => SummaryInformation;
    removeProductToCart: (product: CartProduct) => void;
    updateProductToCart: (product: CartProduct, quantity: number) => void;
}

export const useCartStore = create<State>()(
    persist(
        (set, get) => ({
            cart: [],
            getTotalItems: () => {
                const {cart} = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            getSummaryInformations: () => {
                const { cart } = get();
                const subTotal = cart.reduce((subTotal, product) => (product.quantity * product.price) + subTotal, 0);
                const impuesto = subTotal * 0.19;
                const totalFinal = subTotal + impuesto;
                const items = cart.reduce((total, item) => total + item.quantity, 0);

                return {
                    subTotal,
                    impuesto,
                    totalFinal,
                    items
                }
            },
            addProductToCart: (product: CartProduct) => {
                const { cart } = get();
                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                )

                if (!productInCart) {
                    set({cart: [...cart, product]})
                    return;
                }

                const updateProductToCart = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: item.quantity + product.quantity }
                    }
                    return item;
                });

                set({
                    cart: updateProductToCart
                })

            },
            removeProductToCart: (product: CartProduct) => {
                const { cart } = get();
                const updateProductToCart = cart.filter(
                    (item) => item.id !== product.id || item.size !== product.size
                )
                set({
                    cart: updateProductToCart
                }) 
            },
            updateProductToCart: (product: CartProduct, quantity : number) => {
                const { cart } = get();

                const updateProductToCart = cart.map(item => {
                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity }
                    }
                    return item;
                });

                set({
                    cart: updateProductToCart
                })
            }
            
        }),
        {
            name: 'shooping-cart',
            
        }
    )

)