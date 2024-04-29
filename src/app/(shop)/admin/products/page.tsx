// https://tailwindcomponents.com/component/hoverable-table
import { getPaginationProductWithImages } from '@/actions';
import { Pagination, Title } from '@/components';
import Image from 'next/image';

import Link from 'next/link';
import { currencyFormat } from '../../../../utils/currencyFormat';
import { ProductImage } from '@/components/product/product-image/ProductImage';

interface Props {
  searchParams: {
    page?: number
  }
}
export default async function AdminOrderPage({ searchParams } : Props) {

const page = searchParams.page ? +searchParams.page : 1;

const { products, currentPage, totalPages } = await getPaginationProductWithImages({ page: page });

return (
  <>
    <Title title="Orders" subTitle='' className='' />

    <div className='flex justify-end mb-5'>
      <Link href='/admin/product/new' className='btn-primary'>
        Nuevo producto
      </Link>
    </div>

    <div className="mb-10">
      <table className="min-w-full mb-5">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Imagen
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Titulo
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Precio
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Genero
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Inventario
            </th>
            <th scope="col" className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
              Tallas
            </th>
          </tr>
        </thead>
        <tbody>

          {products?.map(product => {
            return (

              <tr key={product.id} className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100">

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <ProductImage
                    src={product.ProductImage[0]?.url}
                    width={80}
                    height={80}
                    alt={product.title}
                    className="mr-5 rounded"
                  />
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <Link href={`/admin/product/${product.slug}`} className='hover:cursor-pointer hover:underline'>
                  {product.title}
                  </Link> 
                </td>
                <td className="text-sm text-gray-900 font-bold px-6">
                  {currencyFormat(product.price)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  {product.gender}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 ">
                  {product.inStock}
                </td>
                <td className="text-sm text-gray-900 font-bold px-6 ">
                  {product.sizes.join(", ")}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <Pagination total={totalPages} />
    </div>
  </>
);
}