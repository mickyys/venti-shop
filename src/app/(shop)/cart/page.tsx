import { Title } from "@/components";
import Link from "next/link";
import { ProductsInCart } from "./ui/ProductsInCart";
import { ProductsSummary } from "./ui/ProductsSummary";

export default function CartPage() {

  // redirect('/empty');
  

  return (
    <>
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
          <Title
            title='Carrito'
            subTitle=""
            className=""
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col mt-5">
              <span className="text-xl">Agregar más items</span>
              <Link href={"/"} className="underline mb-5">Continua comprando</Link>
              <ProductsInCart />
            </div>
            <ProductsSummary />
          </div>
        </div>
      </div>
    </>
  );
}
