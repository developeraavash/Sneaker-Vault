import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createCategory() {
  const category = await prisma.category.createMany({
    data: [{ name: "Men" }, { name: "Women" }, { name: "Kid" }],
  });
}

// const products = [
//     {
//       name: 'Nike Air Max 1',
//       categoryId: 1,
//       price: 15000,
//       stock: 15,
//       url: 'nike-air-max1',
//       description: 'Classic Nike Air Max 1 with timeless design.',
//     },
//     {
//       name: "Nike Air Max 1 '86 OG",
//       categoryId: 1,
//       price: 16000,
//       stock: 12,
//       url: 'nike-air-max-1-86OG',
//       description: 'Original Nike Air Max 1 from 1986, a collector’s item.',
//     },
//     {
//       name: 'Nike Air Max 87 N7',
//       categoryId: 1,
//       price: 17000,
//       stock: 18,
//       url: 'nike-air-max-87-N7',
//       description: 'Special edition Nike Air Max 87 with N7 design.',
//     },
//     {
//       name: 'Nike Air Max 90',
//       categoryId: 1,
//       price: 14000,
//       stock: 20,
//       url: 'nike-air-max-90',
//       description: 'Iconic Nike Air Max 90 with bold design.',
//     },
//     {
//       name: 'Nike Air Max 270',
//       categoryId: 1,
//       price: 15000,
//       stock: 11,
//       url: 'nike-air-max-270',
//       description: 'Nike Air Max 270 with modern look and comfort.',
//     },
//     {
//       name: 'Nike Air Max 2017',
//       categoryId: 1,
//       price: 15500,
//       stock: 14,
//       url: 'nike-air-max-2017',
//       description: 'Nike Air Max 2017, perfect for running and casual wear.',
//     },
//     {
//       name: 'Nike Air Max DN',
//       categoryId: 1,
//       price: 14500,
//       stock: 13,
//       url: 'nike-air-max-dn',
//       description: 'Sleek and stylish Nike Air Max DN.',
//     },
//     {
//       name: 'Nike Air Max DN SE',
//       categoryId: 1,
//       price: 14700,
//       stock: 19,
//       url: 'nike-air-max-dn-se',
//       description: 'Special edition Nike Air Max DN SE.',
//     },
//     {
//       name: 'Nike Air Max Flyknit Racer Next Nature',
//       categoryId: 1,
//       price: 16500,
//       stock: 17,
//       url: 'nike-air-max-flyknit-racer-next-nature',
//       description: 'Eco-friendly Nike Air Max Flyknit Racer Next Nature.',
//     },
//     {
//       name: 'Nike Air Max Goadome',
//       categoryId: 1,
//       price: 17500,
//       stock: 10,
//       url: 'nike-air-max-goadome',
//       description: 'Durable and rugged Nike Air Max Goadome.',
//     },
//     {
//       name: 'Nike Air Max Plus',
//       categoryId: 1,
//       price: 16000,
//       stock: 16,
//       url: 'nike-air-max-plus',
//       description: 'Bold and dynamic Nike Air Max Plus.',
//     },
//     {
//       name: 'Nike Air VaporMax 2023 Flyknit',
//       categoryId: 1,
//       price: 18000,
//       stock: 12,
//       url: 'nike-air-vapormax-2023-flynit',
//       description: 'Innovative Nike Air VaporMax 2023 Flyknit.',
//     },
//     {
//       name: 'Nike Air VaporMax Plus',
//       categoryId: 1,
//       price: 17500,
//       stock: 15,
//       url: 'nike-air-vapormax-plus',
//       description: 'Comfortable and stylish Nike Air VaporMax Plus.',
//     },
//   ];

// const products = [
//     {
//       name: 'Air Jordan 1 Low',
//       categoryId: 1,
//       price: 12000,
//       stock: 15,
//       url: 'air-jordan-1-low',
//       description: 'Stylish Air Jordan 1 Low with classic design.',
//     },
//     {
//       name: 'Air Jordan 1 Low SE',
//       categoryId: 1,
//       price: 13000,
//       stock: 18,
//       url: 'air-jordan-1-low-se',
//       description: 'Special edition Air Jordan 1 Low SE.',
//     },
//     {
//       name: 'Air Jordan 4 Retro Oxidized Green',
//       categoryId: 1,
//       price: 14000,
//       stock: 12,
//       url: 'air-jordan-4-retro-oxidized-green',
//       description: 'Retro Air Jordan 4 with oxidized green accents.',
//     },
//   ];

const products = [
  {
    name: "Nike Dunk High",
    categoryId: 1,
    price: 13000,
    stock: 15,
    url: "nike-dunk-high",
    description: "Classic Nike Dunk High with iconic design.",
  },
  {
    name: "Nike Dunk Low",
    categoryId: 1,
    price: 12000,
    stock: 18,
    url: "nike-dunk-low",
    description: "Sleek Nike Dunk Low for everyday wear.",
  },
  {
    name: "Nike Dunk Low Retro",
    categoryId: 1,
    price: 12500,
    stock: 12,
    url: "nike-dunk-low-retro",
    description: "Vintage Nike Dunk Low Retro for retro vibes.",
  },
  {
    name: "Nike Dunk Low Retro Premium",
    categoryId: 1,
    price: 14000,
    stock: 14,
    url: "nike-dunk-low-retro-premium",
    description:
      "Premium edition Nike Dunk Low Retro with high-quality materials.",
  },
  {
    name: "Nike Dunk Low Retro SE",
    categoryId: 1,
    price: 13500,
    stock: 16,
    url: "nike-dunk-low-retro-se",
    description: "Special edition Nike Dunk Low Retro SE.",
  },
];
async function insertProducts() {
  const product = await prisma.product.createMany({
    data: products,
  });
}
const images = [
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p1.webp",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p2.webp",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p3.webp",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p4.jpg",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p5.webp",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p6.webp",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p7.jpg",
    productId: 30,
  },
  {
    url: "http://localhost:5000/assets/nike-dunk/nike-dunk-low-retro-se/p8.jpg",
    productId: 30,
  },
];

async function insertImages() {
  const product = await prisma.image.createMany({
    data: images,
  });
}

// createCategory()

insertImages();
