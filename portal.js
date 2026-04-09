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
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portail CSTB Bénin</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            .iframe-container { height: 65vh; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; background: white; }
            iframe { width: 100%; height: 100%; border: none; }
            .dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
            .bg-ready { background-color: #10b981; }
            .bg-waiting { background-color: #f59e0b; }
        </style>
        <script>
            // Auto-refresh toutes le 10s pour capter les URLs au démarrage
            if (window.location.href.indexOf('ready') === -1) {
                setTimeout(() => window.location.reload(), 10000);
            }
        </script>
    </head>
    <body class="bg-[#f8fafc] min-h-screen font-sans text-[#1e293b]">
        <div class="max-w-[1600px] mx-auto px-6 py-8">
            <header class="flex items-center justify-between mb-8 pb-4 border-b border-[#e2e8f0]">
                <div>
                    <h1 class="text-3xl font-black text-[#0f172a]">CSTB Bénin - Portail Hub</h1>
                    <p class="text-sm text-[#64748b]">Aperçu en direct et gestion des versions</p>
                </div>
                <div class="text-right">
                    <div class="text-xs font-bold text-[#64748b] uppercase tracking-widest mb-1">Tunnel Status</div>
                    <div class="flex items-center gap-4 text-xs font-medium">
                        <span><span class="dot ${urlBleu.startsWith("http") ? "bg-ready" : "bg-waiting"}"></span> Bleu</span>
                        <span><span class="dot ${urlRouge.startsWith("http") ? "bg-ready" : "bg-waiting"}"></span> Rouge</span>
                    </div>
                </div>
            </header>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <!-- Version BLEU (Moderne) -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between px-2">
                        <div>
                            <h2 class="text-xl font-bold text-blue-700">Version moderne (Bleu)</h2>
                            <p class="text-xs text-gray-500">${urlBleu}</p>
                        </div>
                        <a href="${urlBleu}" target="_blank" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs transition-all shadow-md">Plein écran ↗</a>
                    </div>
                    <div class="iframe-container">
                        ${
                          urlBleu.startsWith("http")
                            ? `<iframe src="${urlBleu}" title="Aperçu Bleu"></iframe>`
                            : `<div class="flex items-center justify-center h-full text-gray-400 italic">Génération du tunnel en cours...</div>`
                        }
                    </div>
                </div>

                <!-- Version ROUGE (Classique) -->
                <div class="flex flex-col gap-4">
                    <div class="flex items-center justify-between px-2">
                        <div>
                            <h2 class="text-xl font-bold text-red-700">Version classique (Rouge)</h2>
                            <p class="text-xs text-gray-500">${urlRouge}</p>
                        </div>
                        <a href="${urlRouge}" target="_blank" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs transition-all shadow-md">Plein écran ↗</a>
                    </div>
                    <div class="iframe-container">
                        ${
                          urlRouge.startsWith("http")
                            ? `<iframe src="${urlRouge}" title="Aperçu Rouge"></iframe>`
                            : `<div class="flex items-center justify-center h-full text-gray-400 italic">Génération du tunnel en cours...</div>`
                        }
                    </div>
                </div>
            </div>

            <footer class="mt-12 text-center">
                <p class="text-[#94a3b8] text-xs font-bold uppercase tracking-widest italic">CSTB Bénin - Déploiement Privé Propulsé par Antigravity</p>
            </footer>
        </div>
    </body>
    </html>
  `);
});

app.listen(port, () => console.log(`Portail prêt sur le port ${port}`));
