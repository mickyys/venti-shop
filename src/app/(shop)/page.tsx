export const revalidate = 60; //60 segundos

import { getPaginationProductWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: string;
  }
}

export default async function ShopPage( { searchParams } : Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, currentPage, totalPages } = await getPaginationProductWithImages({ page });

  if(products.length === 0) {
    redirect('/')
  }

  return (
    <> 
      <Title
        title="Tienda"
        subTitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />

      <Pagination total={totalPages} />
    </>
  );
}
