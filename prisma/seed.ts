import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { generateUniqueSlug } from "../src/lib/slug";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const properties = [
  {
    title: "Ático de lujo en Salamanca",
    address: "Barrio de Salamanca",
    city: "Madrid",
    price: 1500000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqm: 180,
    type: "Penthouse",
    status: "FOR SALE",
    badge: "Exclusivo",
    description:
      "Espectacular ático reformado con materiales de altísima calidad. Cuenta con una impresionante terraza orientada al sur y vistas despejadas.",
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    imageAlt: "Ático en Madrid",
    isFeatured: true,
    latitude: 40.4299,
    longitude: -3.6826,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Villa moderna en Marbella",
    address: "Milla de Oro",
    city: "Marbella",
    price: 2000000,
    priceType: "sale",
    beds: 5,
    baths: 4,
    sqm: 400,
    type: "Villa",
    status: "FOR SALE",
    badge: "Destacado",
    description:
      "Villa de diseño contemporáneo ubicada en la exclusiva Milla de Oro. Dispone de piscina infinita, jardín privado y domótica avanzada.",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    imageAlt: "Villa en Marbella",
    isFeatured: true,
    latitude: 36.5101,
    longitude: -4.8824,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Chalet independiente con vistas",
    address: "Pinares de San Antón",
    city: "Málaga",
    price: 850000,
    priceType: "sale",
    beds: 4,
    baths: 3,
    sqm: 250,
    type: "House",
    status: "FOR SALE",
    badge: "Oportunidad",
    description:
      "Precioso chalet con vistas panorámicas al mar Mediterráneo. Grandes ventanales que aportan mucha luz natural durante todo el día.",
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    imageAlt: "Chalet en Málaga",
    isFeatured: true,
    latitude: 36.7213,
    longitude: -4.4214,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Piso céntrico e histórico",
    address: "El Born",
    city: "Barcelona",
    price: 500000,
    priceType: "sale",
    beds: 2,
    baths: 1,
    sqm: 90,
    type: "Apartment",
    status: "FOR SALE",
    description:
      "Encantador piso en una finca histórica del barrio de El Born. Conserva suelos hidráulicos originales y vigas de madera vistas.",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    imageAlt: "Piso en Barcelona",
    isFeatured: false,
    latitude: 41.3874,
    longitude: 2.1686,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Dúplex con gran terraza",
    address: "Triana",
    city: "Sevilla",
    price: 420000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqm: 140,
    type: "House",
    status: "FOR SALE",
    description:
      "Dúplex muy luminoso en el corazón del barrio de Triana. Ofrece una espaciosa terraza perfecta para disfrutar del buen clima andaluz.",
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    imageAlt: "Dúplex en Sevilla",
    isFeatured: false,
    latitude: 37.3891,
    longitude: -5.9845,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Casa tradicional renovada",
    address: "Casco Viejo",
    city: "Bilbao",
    price: 300000,
    priceType: "sale",
    beds: 3,
    baths: 2,
    sqm: 120,
    type: "House",
    status: "FOR SALE",
    description:
      "Vivienda completamente renovada manteniendo el estilo clásico bilbaíno. A un paso de comercios y zonas de ocio del Casco Viejo.",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    imageAlt: "Casa en Bilbao",
    isFeatured: false,
    latitude: 43.263,
    longitude: -2.935,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Apartamento moderno y luminoso",
    address: "Ruzafa",
    city: "Valencia",
    price: 150000,
    priceType: "sale",
    beds: 1,
    baths: 1,
    sqm: 50,
    type: "Apartment",
    status: "FOR SALE",
    description:
      "Acogedor apartamento de estilo moderno en el vibrante barrio de Ruzafa. Ideal para solteros o parejas que buscan vivir cerca de todo.",
    imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
    imageAlt: "Apartamento en Valencia",
    isFeatured: false,
    latitude: 39.4699,
    longitude: -0.3774,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
  {
    title: "Estudio céntrico recién pintado",
    address: "Malasaña",
    city: "Madrid",
    price: 180000,
    priceType: "sale",
    beds: 1,
    baths: 1,
    sqm: 60,
    type: "Apartment",
    status: "FOR SALE",
    description:
      "Práctico estudio situado en una zona tranquila de Malasaña. Totalmente equipado y listo para entrar a vivir.",
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    imageAlt: "Estudio en Madrid",
    isFeatured: false,
    latitude: 40.4253,
    longitude: -3.7046,
    userId: "cmp3n0cmu0000vim9v49aymwx",
  },
];

async function main() {
  await prisma.payment.deleteMany();
  await prisma.property.deleteMany();
  await prisma.user.deleteMany();

  const [demoHash, adminHash] = await Promise.all([
    bcrypt.hash("Demo1234!", 12),
    bcrypt.hash("Admin1234!", 12),
  ]);

  await prisma.user.createMany({
    data: [
      {
        id: "cmp3n0cmu0000vim9v49aymwx",
        name: "Demo User",
        email: "demo@luxe.com",
        passwordHash: demoHash,
        role: "user",
      },
      {
        name: "Demo Admin",
        email: "admin@luxe.com",
        passwordHash: adminHash,
        role: "admin",
      },
    ],
  });

  console.log("Seeded 2 users: demo@luxe.com / admin@luxe.com");

  const usedSlugs = new Set<string>();
  const propertiesWithSlugs = properties.map((p) => {
    const slug = generateUniqueSlug(p.title, usedSlugs);
    usedSlugs.add(slug);
    return { ...p, slug };
  });

  await prisma.property.createMany({ data: propertiesWithSlugs });
  console.log(`Seeded ${properties.length} properties.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
