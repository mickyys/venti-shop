export const revalidate = 60; //60 segundos
import { getPaginationProductWithCategory } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { ValidGenders } from "@/interfaces";

interface Props {
  params :{
    id: ValidGenders;
  } 
}

const type : Record<ValidGenders, string> = {
  men: 'Hombres',
  women: 'Mujeres',
  kid: 'Niños',
  unisex: 'Todos'
}

export default async function CategoryPage( { params } : Props) {
  const { id } = params;
  const { products, totalPages } = await getPaginationProductWithCategory({ gender: id})

  return (
    <> 
      <Title 
        title={`Articulos de ${type[id]}`}
        subTitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />
      <Pagination total={totalPages} />
    </>
  );
}
