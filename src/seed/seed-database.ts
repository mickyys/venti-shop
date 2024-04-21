import prisma from '../lib/prisma';
import { countries, initialData } from './seed';


async function main() {

    // await Promise.all([
       await prisma.orderAddress.deleteMany(),
       await prisma.orderItem.deleteMany(),
       await prisma.order.deleteMany(),
       await prisma.userAddress.deleteMany(),
       await prisma.productImage.deleteMany(),
       await prisma.product.deleteMany(),
       await prisma.category.deleteMany(),
       await prisma.user.deleteMany(),
       await prisma.country.deleteMany()
    // ]);

    const { categories, products, users } = initialData;
    const categoriesData = categories.map((name) => ({ name }));

    await Promise.all([
        prisma.category.createMany({ data: categoriesData }),
        prisma.user.createMany({ data: users }),
        prisma.country.createMany({ data: countries})
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