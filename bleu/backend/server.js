const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: "50mb" })); // 50mb limite haute pour autoriser les images base64 temporairement

// ======================================
// ROUTES API - GESTION DES ARTICLES
// ======================================

// GET: Récupérer tous les articles
app.get("/api/articles", async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(articles);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des articles" });
  }
});

// GET: Récupérer un article unique par ID
app.get("/api/articles/:id", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!article) {
      return res.status(404).json({ error: "Article non trouvé" });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la recherche de l'article" });
  }
});

// POST: Créer un nouvel article
app.post("/api/articles", async (req, res) => {
  try {
    const { title, category, author, excerpt, content, image, date } = req.body;

    const newArticle = await prisma.article.create({
      data: {
        title,
        category: category || "Actualité",
        author: author || "CSTB Bénin",
        excerpt: excerpt || "",
        content,
        image: image || null,
        formattedDate: date, // On conserve la string de la date définie dans l'éditeur
      },
    });

    res.status(201).json(newArticle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de l'article" });
  }
});

// PUT: Modifier un article existant
app.put("/api/articles/:id", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { title, category, author, excerpt, content, image, date } = req.body;

    const updatedArticle = await prisma.article.update({
      where: { id: articleId },
      data: {
        title,
        category,
        author,
        excerpt,
        content,
        image,
        formattedDate: date,
      },
    });

    res.json(updatedArticle);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'article" });
  }
});

// DELETE: Supprimer un article
app.delete("/api/articles/:id", async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id: articleId },
    });
    res.status(204).send(); // Pas de contenu à renvoyer après suppression
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'article" });
  }
});

// ======================================
// ROUTES API - GESTION DES COMMENTAIRES
// ======================================

// PUT: Répondre à un commentaire (en tant qu'admin)
app.put("/api/comments/:id", async (req, res) => {
  try {
    const { adminReply } = req.body;
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { adminReply },
    });
    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du commentaire" });
  }
});

// DELETE: Supprimer un commentaire
app.delete("/api/comments/:id", async (req, res) => {
  try {
    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du commentaire" });
  }
});

// ======================================
// ROUTES API - GESTION DES SLIDES
// ======================================

// GET: Récupérer tous les slides (triés par ordre)
app.get("/api/slides", async (req, res) => {
  try {
    const slides = await prisma.slide.findMany({
      orderBy: { order: "asc" },
    });
    res.json(slides);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération slides" });
  }
});

// POST: Créer un slide
app.post("/api/slides", async (req, res) => {
  try {
    const newSlide = await prisma.slide.create({
      data: req.body,
    });
    res.status(201).json(newSlide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur création slide" });
  }
});

// PUT: Modifier un slide
app.put("/api/slides/:id", async (req, res) => {
  try {
    const updatedSlide = await prisma.slide.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updatedSlide);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur mise à jour slide" });
  }
});

// DELETE: Supprimer un slide
app.delete("/api/slides/:id", async (req, res) => {
  try {
    await prisma.slide.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur suppression slide" });
  }
});

// ======================================
// DÉMARRAGE DU SERVEUR / SERVE FRONTEND
// ======================================
const path = require("path");

// Pour que le backend serve le frontend compilé de Vite
app.use(express.static(path.join(__dirname, "../dist")));

// SPA Catch-all : si l'URL ne matche aucune route API, on renvoie index.html de React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`✅ Serveur Backend API démarré sur le port ${PORT}`);
  console.log(`===========================================`);
});
