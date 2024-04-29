import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import React from 'react'
import { ProductForm } from './ui/ProductForm';

interface Props{
    params:{
        slug: string;
    }
}

export default async function ProductSlugPage({ params } : Props) {
  const { slug } = params;  

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories()
  ])
  

  if(!product && slug !== 'new'){
    redirect('/admin/products');
  }
  console.log('product', product);
  const title = slug === 'new' ? 'Nuevo Producto' : 'Editar Producto';

  return (
    <>
    <Title title={title} subTitle='' className='' />
    <ProductForm product={product ?? {}} categories={categories} />
    </>
  )
}
