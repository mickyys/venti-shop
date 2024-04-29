export interface Product {
    id: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: ValidSizes[];
    slug: string;
    tags: string[];
    title: string;
    // type: ValidTypes;
    gender: ValidGenders;
    categoryId: string;
}

export interface ProductImage {
    id: number;
    url: string;
    productId: string;
}

export interface CartProduct {
    id: string;
    slug: string;
    quantity: number;
    title: string;
    price: number;
    size: ValidSizes;
    images: string;
}

export type ValidGenders = 'men' | 'women' | 'kid' | 'unisex';
export type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
export type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';