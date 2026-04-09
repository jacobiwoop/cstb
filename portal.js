const { spawn } = require("child_process");
const express = require("express");

const app = express();
const port = 8080;

let urlBleu = "Génération du tunnel...";
let urlRouge = "Génération du tunnel...";

// On récupère les adresses des services depuis l'environnement ou docker network
const targetBleu = process.env.BLEU_URL || "http://bleu:3001";
const targetRouge = process.env.ROUGE_URL || "http://rouge:3002";

function startTunnel(target, name) {
  console.log(`Démarrage tunnel Cloudflare pour ${name} sur ${target}`);
  const tunnel = spawn("cloudflared", ["tunnel", "--url", target]);

  tunnel.stderr.on("data", (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log(`[${name}] Nouveau lien : ${match[0]}`);
      if (name === "Bleu") urlBleu = match[0];
      if (name === "Rouge") urlRouge = match[0];
    }
  });

  tunnel.on("close", () => setTimeout(() => startTunnel(target, name), 5000));
}

// Lancement des tunnels
startTunnel(targetBleu, "Bleu");
startTunnel(targetRouge, "Rouge");
startTunnel("http://localhost:8080", "Portail"); // Accès distant au hub lui-même 🚀

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Portail CSTB Bénin</title>
        <meta charset="utf-8">
        <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; background: #f0f2f5; padding-top: 50px; }
            .card { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 400px; text-align: center; margin-bottom: 20px; }
            .btn { display: inline-block; padding: 12px 24px; border-radius: 8px; color: white; text-decoration: none; font-weight: bold; margin-top: 15px; }
            .btn-bleu { background: #007cba; }
            .btn-rouge { background: #e63946; }
            .status { font-size: 0.8em; color: #666; margin-top: 10px; }
        </style>
        <script>
            if (window.location.search !== '?ready') {
                setTimeout(() => window.location.reload(), 5000);
            }
        </script>
    </head>
    <body>
        <h1>CSTB Bénin - Serveur Privé</h1>
        <div class="card" style="border-top: 5px solid #007cba">
            <h2>Version BLEU</h2>
            <p>Moderne & Admin</p>
            <a href="${urlBleu}" class="btn btn-bleu" target="_blank">Ouvrir le site</a>
            <div class="status">${urlBleu}</div>
        </div>
        <div class="card" style="border-top: 5px solid #e63946">
            <h2>Version ROUGE</h2>
            <p>Classique</p>
            <a href="${urlRouge}" class="btn btn-rouge" target="_blank">Ouvrir le site</a>
            <div class="status">${urlRouge}</div>
        </div>
    </body>
    </html>
    `);
});

app.listen(port, () => console.log(`Portail prêt sur le port ${port}`));
