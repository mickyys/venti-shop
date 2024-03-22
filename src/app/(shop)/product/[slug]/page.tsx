export const revalidate = 604800 // 7 dias

import type { Metadata, ResolvingMetadata } from 'next'
import { getProductBySlug } from "@/actions";
import { QuantitySelector, SizeSelector, SlidesShow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { notFound } from "next/navigation";
import { AddToCart } from './ui/AddToCart';

interface Props {
  params: {
    slug: string;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = params
  
  const product = await getProductBySlug(slug);

  return {
    title: product?.title ?? '',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? '',
      description: product?.description ?? '',
      images: [`/products/${product?.images[1]}`],
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound()
  }

  return (
    <>
      <div className="mt-5 mb-20 grid grid-cols-1 md:grid-cols-3 gap-3">

        <div className="col-span-1 md:col-span-2">
          <SlidesShow
            images={product.images}
            title=""
            className=""
          />
        </div>
        <div className="col-span-1 px-5">
          <StockLabel slug={product.slug} />
          <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
            {product.title}
          </h1>
          <p className="text-lg mb-5">${product.price}</p>
          <AddToCart product={product} />
          <h3 className="font-bold text-sm">Descripción</h3>
          <p className="font-light">{product.description}</p>
        </div>
      </div>
    </>
  );
}
