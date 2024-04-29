"use client";

import { Category, Product, ProductImage as ProductImageInterface } from "@/interfaces";
import { useForm } from "react-hook-form";
import clsx from 'clsx';
import { createUpdateProduct, deleteProductImage } from "@/actions";
import { useRouter } from "next/navigation";
import { ProductImage } from "@/components/product/product-image/ProductImage";

interface Props {
    product: Partial<Product> & { ProductImage?: ProductImageInterface[] };
    categories: Category[]
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface FormInputs {
    title: string;
    slug: string;
    description: string;
    price: number;
    gender: 'men' | 'women' | 'kid' | 'unisex';
    inStock: number;
    sizes: string[];
    categoryId: string;
    tags: string;
    images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {
    console.log("productImage=====>", product.ProductImage);
    const router = useRouter();
    const { handleSubmit, register, formState: { isValid }, getValues, setValue, watch } = useForm<FormInputs>({
        defaultValues: {
            ...product,
            sizes: product.sizes ?? [],
            tags: product.tags?.join(', '),
            images: undefined
        }
    });

    const onSizeChange = (size: string) => {
        const sizes = new Set(getValues('sizes'));
        sizes.has(size) ? sizes.delete(size) : sizes.add(size);

        setValue('sizes', Array.from(sizes));
        watch('sizes');
    }

    const onSubmit = async (data: FormInputs) => {
        console.log(data);
        const formData = new FormData();
        if (product.id) formData.append('id', product.id);
        formData.append('title', data.title);
        formData.append('slug', data.slug);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('gender', data.gender);
        formData.append('inStock', data.inStock.toString());
        formData.append('sizes', data.sizes.toString());
        formData.append('categoryId', data.categoryId);
        formData.append('tags', data.tags);

        if (data.images) {
            for (let i = 0; i < data.images.length; i++) {
                formData.append('images', data.images[i]);
            }
        }

        const { ok, error } = await createUpdateProduct(formData);

        if (ok) {
            router.replace(`/admin/product/${product.slug}`);
        } else {
            console.error(error);
            return;
        }
    };

    const deleteImage = async (imageId: number, imageUrl: string) => {
        await deleteProductImage(imageId, imageUrl);
    }

    return (
        <form className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Textos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Título</span>
                    <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Slug</span>
                    <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('slug', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Descripción</span>
                    <textarea
                        rows={5}
                        className="p-2 border rounded-md bg-gray-200"
                        {...register('description', { required: true })}
                    ></textarea>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Price</span>
                    <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register('price', { required: true, min: 0 })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Tags</span>
                    <input type="text" className="p-2 border rounded-md bg-gray-200"  {...register('tags', { required: true })} />
                </div>

                <div className="flex flex-col mb-2">
                    <span>Gender</span>
                    <select className="p-2 border rounded-md bg-gray-200"  {...register('gender', { required: true })}>
                        <option value="">[Seleccione]</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="kid">Kid</option>
                        <option value="unisex">Unisex</option>
                    </select>
                </div>

                <div className="flex flex-col mb-2">
                    <span>Categoria</span>
                    <select className="p-2 border rounded-md bg-gray-200"  {...register('categoryId', { required: true })}>
                        <option value="">[Seleccione]</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-primary w-full" disabled={!isValid} >
                    Guardar
                </button>
            </div>

            {/* Selector de tallas y fotos */}
            <div className="w-full">
                <div className="flex flex-col mb-2">
                    <span>Stock</span>
                    <input type="number" className="p-2 border rounded-md bg-gray-200"  {...register('inStock', { required: true, min: 0 })} />
                </div>
                {/* As checkboxes */}
                <div className="flex flex-col">
                    <span>Tallas</span>
                    <div className="flex flex-wrap">

                        {
                            sizes.map(size => (
                                // bg-blue-500 text-white <--- si está seleccionado
                                <div key={size}
                                    onClick={() => onSizeChange(size)}
                                    className={
                                        clsx(
                                            "flex items-center justify-center w-10 h-10 mr-2 border rounded-md cursor-pointer",
                                            {
                                                'bg-blue-500 text-white': getValues('sizes').includes(size)
                                            }
                                        )}>
                                    <span>{size}</span>
                                </div>
                            ))
                        }

                    </div>


                    <div className="flex flex-col mb-2">

                        <span>Fotos</span>
                        <input
                            type="file"
                            multiple
                            className="p-2 border rounded-md bg-gray-200"
                            accept="image/png, image/jpeg, image/avif"
                            {...register('images')}
                        />

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {product.ProductImage?.map(productImage => (
                            <div key={productImage.id}>
                                <ProductImage alt={product?.title ?? ''} src={productImage.url} width={300} height={300} className="rounded-t shadow-md" />
                                <button
                                    onClick={() => deleteImage(productImage.id, productImage.url)}
                                    className="btn-danger w-full rounded-b-xl">
                                    Eliminar
                                </button>
                            </div>

                        ))}
                    </div>

                </div>
            </div>
        </form >
    );
};