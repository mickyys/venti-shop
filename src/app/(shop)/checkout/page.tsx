import { QuantitySelector, Title } from "@/components";
import { initialData } from "@/seed/seed";
import Image from "next/image";
import Link from "next/link";

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2]
]

export default function CheckoutPage() {

  const total = productsInCart.reduce((acumulador, producto) => {
    return acumulador + producto.price
  },0);
  const impuesto = total * 0.19;
  const totalFinal = total + impuesto;

  return (
    <>
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
          <Title
            title='Verificar orden'
            subTitle=""
            className=""
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col mt-5">
              <span className="text-xl">Editar carrito</span>
              <Link href={"/cart"} className="underline mb-5">Continua comprando</Link>


              {
                productsInCart.map(product => (
                  <div key={product.slug} className="flex mb-5">
                    <Image
                      src={`/products/${product.images[0]}`}
                      width={100}
                      height={100}
                      style={{ width: '100px', height: '100px'}}
                      alt={product.title}
                      className="mr-5 rounded"
                    />
                    <div>
                      <p>{product.title}</p>
                      <p>${product.price} x 3</p>
                      <p className="font-bold">Subtotal: { product.price * 3}</p>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="bg-white rounded-xl shadow-xl p-7">

              <h2 className="text-2xl mb-2">Dirección entrega</h2>
              <div className="mb-10">
                <p className="text-xl">Hector Martinez</p>
                <p className="text-xl">Calle 12</p>
                <p>San Antonio</p>
                <p>Chile</p>
                <p>Codigo postal 12355788</p>
                <p>Telefono 987654321</p>
              </div>

              <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

              <h2 className="text-2xl mb-2">Resumen orden</h2>
              <div className="grid grid-cols-2">
                <span> No. Productos</span>
                <span className="text-right"> {productsInCart.length} articulos</span>

                <span> Subtotal</span>
                <span className="text-right"> { total }</span>

                <span> Impuestos</span>
                <span className="text-right"> { impuesto }</span>

                <span className="text-2xl mt-5"> Total</span>
                <span className="text-right mt-5 text-2xl"> {totalFinal} </span>
              </div>
              <div className="mt-5 mb-2 w-full">
                <Link href={"/orders/123"} className="flex btn-primary justify-center">
                  Colocar orden
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
