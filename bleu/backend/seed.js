const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const slides = [
  {
    title: "La CSTB vous souhaite la bienvenue",
    subtitle: "L'Afrique accueille le monde entier au Bénin",
    description:
      "Découvrez Cotonou, ville dynamique et carrefour culturel de l'Afrique de l'Ouest. Hébergement, visa, transport — tout est prévu pour vous accueillir.",
    image: "/src/assets/hero.jpg",
    primaryBtn: "Voir les organisations",
    primaryLink: "/qui-sommes-nous",
    secondaryBtn: "Explorer les activités",
    secondaryLink: "/actualites",
    order: 1,
  },
  {
    title: "Défendre vos droits au quotidien",
    subtitle: "Une confédération forte et solidaire",
    description:
      "Nous luttons contre la précarité et pour l'amélioration constante des conditions de vie et de travail de la classe ouvrière béninoise.",
    image: "/src/assets/2f2be7a217340647bfcfaebd36fdfaed.jpg",
    primaryBtn: "Nos revendications",
    primaryLink: "/actualites",
    secondaryBtn: "Notre histoire",
    secondaryLink: "/qui-sommes-nous",
    order: 2,
  },
  {
    title: "Solidarité et Action",
    subtitle: "Ensemble, nous sommes plus forts",
    description:
      "Participez à nos mobilisations et soutenez nos initiatives sociales comme la Clinique CSTB à Accronville.",
    image: "/src/assets/bf4a8e607ef1b4140078e5bf7db147b9.jpg",
    primaryBtn: "Faire un don",
    primaryLink: "/vote",
    secondaryBtn: "Nous contacter",
    secondaryLink: "/contact",
    order: 3,
  },
];

async function main() {
  console.log("Emptying slide table...");
  await prisma.slide.deleteMany();

  console.log("Seeding new slides...");
  for (const s of slides) {
    await prisma.slide.create({ data: s });
  }

  console.log("Database seeded successfully with 3 slides.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
