// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser, getPaginatedOrders } from '@/actions';
import { Title } from '@/components';
import clsx from 'clsx';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';

export default async function AdminOrderPage() {

  const { ok, orders } = await getPaginatedOrders();
  if(!ok){
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Orders" subTitle='' className='' />

      <div className="mb-10">
        <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                #ID
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Nombre completo
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Estado
              </th>
              <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                Opciones
              </th>
            </tr>
          </thead>
          <tbody>

            {orders?.map(order => {
              return (

                <tr key={order.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id.split('-')[0]}</td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {order.OrderAddress?.firstName} {order.OrderAddress?.lastName}
                  </td>
                  <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">

                    <IoCardOutline className={
                      clsx(
                        {
                          'text-red-500': !order.isPaid,
                          'text-green-700': order.isPaid,
                        }
                      )
                    } />
                    <span className=
                      {
                        clsx(
                          {
                            'mx-2 text-red-500': !order.isPaid,
                            'mx-2 text-green-700': order.isPaid,
                          }
                        )
                      }>{order.isPaid ? 'Pagado' : 'No pagada'}</span>

                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 ">
                    <Link href={`/orders/${order.id}`} className="hover:underline">
                      Ver orden
                    </Link>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}