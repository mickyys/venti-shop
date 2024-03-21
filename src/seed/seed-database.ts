import prisma from '../lib/prisma';
import { initialData } from './seed';


async function main() {

    await Promise.all([
        prisma.productImage.deleteMany(),
        prisma.product.deleteMany(),
        prisma.category.deleteMany()
    ]);

    const { categories, products } = initialData;
    const categoriesData = categories.map((name) => ({ name }));

    await Promise.all([
        prisma.category.createMany({
            data: categoriesData
        })
    ]);

    const categoriesDB = await prisma.category.findMany();
    const categoriesMap = categoriesDB.reduce((acc, category) => {
        acc[category.name.toLocaleLowerCase()] = category.id;
        return acc;
    }, {} as Record<string, string>);


    products.forEach(async (product) => {
        const { type, images, ...rest } = product;
        const dbProduct = await prisma.product.create({
            data: {
                ...rest,
                categoryId: categoriesMap[product.type]
            }
        })

        const imagesData = await prisma.productImage.createMany({
            data: images.map((image) => ({
                url: image,
                productId: dbProduct.id
            }))
        })
    })


    console.log('Seed ejecutado correctamente');
}

(() => {
    if (process.env.NODE_ENV === 'production') {
        return;
    }

    main()
})();