// import { PrismaClient } from '@/src/generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// const adapter = new PrismaPg({
//     connectionString: process.env.DATABASE_URL!,
// });

// const prisma = new PrismaClient({ adapter });

// async function main() {
//     const categories = [
//         { name: 'Streamings' },
//         { name: 'Finanças' },
//         { name: 'Redes Sociais' },
//         { name: 'Jogos' },
//         { name: 'Lojas' },
//         { name: 'Saúde', },
//         { name: 'Instituições' },
//         { name: 'Corporativos' },
//         { name: 'Técnicos' },
//         { name: 'Aplicativos' },
//         { name: 'Acesso Físico' },
//         { name: 'Outros' },
//     ];

//     for (const category of categories) {
//         const cipherText = await encryptCategoryName(category.name);
//         const exists = await prisma.category.findFirst({
//             where: {
//                 cipherText,
//             },
//         });

//         if (!exists) {
//             await prisma.category.create({
//                 data: {
//                     cipherText,
//                 },
//             });
//         }
//     }

//     console.log('Categorias criadas.');
// }

// main()
//     .catch(console.error)
//     .finally(async () => {
//         await prisma.$disconnect();
//     });
