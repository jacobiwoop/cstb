const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { FedaPay, Webhook } = require("fedapay");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const { sendNewsletter } = require("./emailService");

const app = express();
const prisma = new PrismaClient();

// Configuration Multer pour le stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Nettoyage du nom de fichier original + timestamp pour l'unicité
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middleware
app.use(cors());

// --- ROUTE WEBHOOK FEDAPAY (Avant express.json pour le raw body) ---
app.post(
  "/api/fedapay/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["x-fedapay-signature"];
    if (!sig) return res.status(400).send("Signature manquante");

    try {
      const setting = await prisma.setting.findUnique({
        where: { id: "site_settings" },
      });
      if (!setting) return res.status(400).send("Settings missing");

      const s = JSON.parse(setting.value);
      const webhookSecret = s.fedaWebhookSecret;
      if (!webhookSecret) return res.status(400).send("Webhook secret missing");

      const event = Webhook.constructEvent(req.body, sig, webhookSecret);

      if (event.name === "transaction.approved") {
        const transaction = event.data;

        // Enregistrement sécurisé (upsert)
        await prisma.donation.upsert({
          where: { reference: transaction.id.toString() },
          update: { status: "SUCCESS" },
          create: {
            amount: transaction.amount,
            donorName: `${transaction.customer.firstname} ${transaction.customer.lastname}`,
            donorEmail: transaction.customer.email,
            reference: transaction.id.toString(),
            status: "SUCCESS",
          },
        });
        console.log(`[FedaPay] Don approuvé et enregistré: ${transaction.id}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("[FedaPay Webhook Error]:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
);

app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint pour l'upload d'images
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier téléchargé" });
    }
    // On renvoie l'URL relative de l'image
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" });
  }
});

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

// POST: Créer un nouveau commentaire
app.post("/api/comments", async (req, res) => {
  try {
    const { author, text, date, articleId } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        author: author || "Utilisateur Anonyme",
        text,
        date: date || new Date().toLocaleDateString("fr-FR"),
        articleId: parseInt(articleId),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création du commentaire" });
  }
});

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
// ROUTES API - GESTION DE LA NEWSLETTER
// ======================================

// GET: Récupérer tous les abonnés (Admin)
app.get("/api/newsletter", async (req, res) => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(subscribers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération abonnés" });
  }
});

// GET: Se désabonner de la newsletter
app.get("/api/newsletter/unsubscribe", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).send("Email requis");

  try {
    await prisma.subscriber.delete({ where: { email: String(email) } });
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/unsubscribe`,
    );
  } catch (error) {
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/unsubscribe?error=1`,
    );
  }
});

// POST: S'inscrire à la newsletter
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis" });

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Déjà inscrit" });

    const newSubscriber = await prisma.subscriber.create({
      data: { email },
    });
    res.status(201).json(newSubscriber);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur inscription" });
  }
});

// DELETE: Supprimer un abonné
app.delete("/api/newsletter/:id", async (req, res) => {
  try {
    await prisma.subscriber.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur suppression abonné" });
  }
});

// POST: Envoyer la newsletter à tous les abonnés
app.post("/api/newsletter/send", async (req, res) => {
  const { subject, content } = req.body;
  if (!subject || !content) {
    return res.status(400).json({ error: "Sujet et contenu requis" });
  }

  try {
    const subscribers = await prisma.subscriber.findMany({
      select: { email: true },
    });

    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      return res.status(400).json({ error: "Aucun abonné trouvé" });
    }

    await sendNewsletter(emails, subject, content);
    res.json({ success: true, count: emails.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Échec de l'envoi de la newsletter" });
  }
});

// ======================================
// ROUTES API - GESTION DES ACTIONS (LUTTES)
// ======================================

// GET: Récupérer toutes les actions
app.get("/api/actions", async (req, res) => {
  try {
    const actions = await prisma.action.findMany({
      orderBy: [{ date: "asc" }, { order: "asc" }],
    });
    res.json(actions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération actions" });
  }
});

// POST: Créer une action
app.post("/api/actions", async (req, res) => {
  try {
    const newAction = await prisma.action.create({
      data: req.body,
    });
    res.status(201).json(newAction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur création action" });
  }
});

// PUT: Modifier une action
app.put("/api/actions/:id", async (req, res) => {
  try {
    const updatedAction = await prisma.action.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json(updatedAction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur mise à jour action" });
  }
});

// DELETE: Supprimer une action
app.delete("/api/actions/:id", async (req, res) => {
  try {
    await prisma.action.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur suppression action" });
  }
});

// ======================================
// ROUTES API - PARAMÈTRES DU SITE
// ======================================

// GET: Récupérer les paramètres
app.get("/api/settings", async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { id: "site_settings" },
    });
    if (!setting) return res.json({});
    res.json(JSON.parse(setting.value));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération paramètres" });
  }
});

// POST: Enregistrer les paramètres
app.post("/api/settings", async (req, res) => {
  try {
    const value = JSON.stringify(req.body);
    const updated = await prisma.setting.upsert({
      where: { id: "site_settings" },
      update: { value },
      create: { id: "site_settings", value },
    });
    res.json(JSON.parse(updated.value));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur enregistrement paramètres" });
  }
});

// --- DONS & TRANSACTIONS ---

// GET: Liste des dons
app.get("/api/donations", async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur récupération des dons" });
  }
});

// POST: Enregistrer un nouveau don
app.get("/api/donations/stats", async (req, res) => {
  try {
    const totalRaised = await prisma.donation.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    });

    const setting = await prisma.setting.findUnique({
      where: { id: "site_settings" },
    });
    const s = setting ? JSON.parse(setting.value) : {};

    res.json({
      amount: totalRaised._sum.amount || 0,
      goal: s.donationGoal || 50000000,
      publicKey: s.fedaPublicKey || "",
      mode: s.fedaMode || "sandbox",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur statistiques dons" });
  }
});

app.post("/api/donations", async (req, res) => {
  try {
    const { amount, donorName, donorEmail, reference } = req.body;
    const donation = await prisma.donation.create({
      data: {
        amount: parseInt(amount),
        donorName,
        donorEmail,
        reference,
        status: "SUCCESS",
      },
    });
    res.status(201).json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur enregistrement du don" });
  }
});

// ======================================
// DÉMARRAGE DU SERVEUR / SERVE FRONTEND
// --- STATS DASHBOARD ---
app.get("/api/admin/stats", async (req, res) => {
  try {
    const articlesCount = await prisma.article.count();
    const subscribersCount = await prisma.subscriber.count();
    const commentsCount = await prisma.comment.count();

    // Somme des likes
    const likesAggregation = await prisma.article.aggregate({
      _sum: { likes: true },
    });
    const totalLikes = likesAggregation._sum.likes || 0;

    // Activité récente (5 dernières inscriptions)
    const lastSubscribers = await prisma.subscriber.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    const recentActivity = lastSubscribers.map((sub) => ({
      id: `sub_${sub.id}`,
      type: "newsletter",
      title: "Nouvelle inscription newsletter",
      email: sub.email,
      date: sub.createdAt,
    }));

    res.json({
      articles: articlesCount,
      subscribers: subscribersCount,
      likes: totalLikes,
      comments: commentsCount,
      recentActivity,
    });
  } catch (error) {
    console.error("Erreur stats :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des stats" });
  }
});

// ======================================

// Pour que le backend serve le frontend compilé de Vite
app.use(express.static(path.join(__dirname, "../dist")));

// SPA Catch-all : si l'URL ne matche aucune route API, on renvoie index.html de React
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`✅ Serveur Backend API démarré sur le port ${PORT}`);
  console.log(`===========================================`);
});
