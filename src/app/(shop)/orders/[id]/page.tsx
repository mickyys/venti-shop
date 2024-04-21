import { getOrderByID } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { initialData } from "@/seed/seed";
import clsx from "clsx";
import Image from "next/image";
import { IoCardOutline } from "react-icons/io5";
import { currencyFormat } from '../../../../utils/currencyFormat';
import { redirect } from "next/navigation";

interface Props {
  params: { id: string; }
}

export default async function OrderPage({ params }: Props) {

  const { id } = params;

  //todo: verificar id y usuario
  const { order, ok } = await getOrderByID(id);

  if (!ok) {
    redirect('/');
  }

  const { total, tax, subTotal, isPaid, itemsInOrder, OrderAddress, OrderItem } = order!;
  const { firstName, lastName, address, address2, city, phone, postalCode, country } = OrderAddress!;

  return (
    <>
      <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
        <div className="flex flex-col w-[1000px]">
          <Title
            title={`Orden #${id.split('-')[0]}`}
            subTitle=""
            className=""
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            <div className="flex flex-col mt-5">
              <OrderStatus isPaid={isPaid} />

              {
                OrderItem.map(order => (
                  <div key={order.product.slug + order.size} className="flex mb-5">
                    <Image
                      src={`/products/${order.product.ProductImage[0].url}`}
                      width={100}
                      height={100}
                      style={{ width: '100px', height: '100px' }}
                      alt={order.product.title}
                      className="mr-5 rounded"
                    />
                    <div>
                      <p>{order.product.title}</p>
                      <p>{currencyFormat(order.price)} x {order.quantity}</p>
                      <p className="font-bold">Subtotal: {currencyFormat(order.price * order.quantity)}</p>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="bg-white rounded-xl shadow-xl p-7">

              <h2 className="text-2xl mb-2">Dirección entrega</h2>
              <div className="mb-10">
                <p className="text-xl">{firstName} {lastName}</p>
                <p>{address}</p>
                <p>{address2}</p>
                <p>{city}</p>
                <p>{country.name}</p>
                <p>Codigo postal {postalCode}</p>
                <p>Telefono {phone}</p>
              </div>

              <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

              <h2 className="text-2xl mb-2">Resumen orden</h2>
              <div className="grid grid-cols-2">
                <span> No. Productos</span>
                <span className="text-right"> {itemsInOrder} articulos</span>

                <span> Subtotal</span>
                <span className="text-right"> {currencyFormat(subTotal)}</span>

                <span> Impuestos</span>
                <span className="text-right"> {currencyFormat(tax)}</span>

                <span className="text-2xl mt-5"> Total</span>
                <span className="text-right mt-5 text-2xl"> {currencyFormat(total)} </span>
              </div>
              <div className="mt-5 mb-2 w-full">
                {
                  isPaid? (
                    <OrderStatus isPaid={isPaid} />
                  ) : (
                    <PayPalButton amount={order!.total} orderId={order!.id} />
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
