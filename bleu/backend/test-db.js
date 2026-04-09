const { PrismaClient } = require("@prisma/client");
process.env.DATABASE_URL =
  "file:/home/aiko/Documents/cstb/bleu/backend/prisma/dev.db";
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Tentative de connexion à la base de données...");
    const slides = await prisma.slide.findMany();
    console.log("Succès ! Nombre de slides :", slides.length);
  } catch (e) {
    console.error("ERREUR PRISMA :");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
