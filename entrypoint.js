const { spawn } = require("child_process");
const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;

let urlBleu = "En attente... (Veuillez patienter 10-15s)";
let urlRouge = "En attente... (Veuillez patienter 10-15s)";

// Démarre cloudflared et parse l'URL .trycloudflare.com
function startTunnel(localPort, name) {
  console.log(`Démarrage du tunnel pour ${name} (port ${localPort})`);
  const tunnel = spawn("cloudflared", [
    "tunnel",
    "--url",
    `http://localhost:${localPort}`,
  ]);

  tunnel.stderr.on("data", (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);
    if (match) {
      console.log(`[${name}] URL Cloudflare trouvée : ${match[0]}`);
      if (name === "Bleu") urlBleu = match[0];
      if (name === "Rouge") urlRouge = match[0];
    }
  });

  tunnel.on("close", (code) => {
    console.log(`Tunnel ${name} fermé avec le code ${code}`);
  });
}

// 1. Démarrer Bleu (Backend Express qui sert également le Frontend React compilé) sur le port 3001
const bleuProc = spawn("node", ["server.js"], {
  cwd: path.join(__dirname, "bleu", "backend"),
});
bleuProc.stdout.on("data", (d) => console.log(`[BLEU] ${d.toString().trim()}`));
bleuProc.stderr.on("data", (d) =>
  console.error(`[BLEU ERR] ${d.toString().trim()}`),
);

// 2. Démarrer Rouge (Frontend React Static via serve) sur le port 3002
const rougeProc = spawn("npx", ["serve", "-s", "dist", "-p", "3002"], {
  cwd: path.join(__dirname, "rouge"),
});
rougeProc.stdout.on("data", (d) =>
  console.log(`[ROUGE] ${d.toString().trim()}`),
);
rougeProc.stderr.on("data", (d) =>
  console.error(`[ROUGE ERR] ${d.toString().trim()}`),
);

// 3. Lancer les tunnels un peu après le démarrage des serveurs locaux
setTimeout(() => {
  startTunnel(3001, "Bleu");
  startTunnel(3002, "Rouge");
}, 5000);

// 4. Serveur Web Portail (le seul port exposé par Render)
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portail Déploiement CSTB</title>
        <style>
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                display: flex; flex-direction: column; align-items: center; justify-content: center; 
                height: 100vh; margin: 0; background-color: #f1f5f9; 
            }
            .container { 
                text-align: center; background: white; padding: 50px; 
                border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
                max-width: 600px; width: 90%;
            }
            h1 { color: #0f172a; margin-bottom: 5px; font-size: 28px; }
            p { color: #64748b; margin-bottom: 40px; }
            .card {
                border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 20px;
                transition: transform 0.2s, box-shadow 0.2s;
                position: relative;
                overflow: hidden;
            }
            .card:hover { transform: translateY(-2px); box-shadow: 0 10px 15px rgba(0,0,0,0.05); }
            .btn { 
                display: block; padding: 15px 30px; border-radius: 10px; font-weight: bold; 
                text-decoration: none; color: white; transition: opacity 0.2s; font-size: 16px;
                margin-bottom: 15px; position: relative; z-index: 10;
            }
            .btn:hover { opacity: 0.9; }
            .btn-bleu { background-color: #007cba; box-shadow: 0 4px 14px rgba(0, 124, 186, 0.4); }
            .btn-rouge { background-color: #e63946; box-shadow: 0 4px 14px rgba(230, 57, 70, 0.4); }
            .url { font-size: 13px; color: #64748b; background: #f8fafc; padding: 8px 12px; border-radius: 6px; display: inline-block; word-break: break-all;}
            .loading-badge { background: #fef08a; color: #854d0e; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 6px; display: inline-flex; align-items:center; gap:8px; margin-bottom:15px; }
            .spinner { width: 14px; height: 14px; border: 2px solid #854d0e; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
        <script>
            // Auto-refresh de la page tant qu'on n'a pas reçu les deux adresses Cloudflare
            if ('${urlBleu}'.includes('attente') || '${urlRouge}'.includes('attente')) {
                setTimeout(() => window.location.reload(), 3000);
            }
        </script>
    </head>
    <body>
        <div class="container">
            <h1>CSTB Bénin - Déploiements</h1>
            <p>Portail centralisé des visions Staging</p>
            
            <div class="card" style="border-top: 4px solid #007cba;">
                ${urlBleu.includes("attente") ? '<div class="loading-badge"><div class="spinner"></div> Génération du tunnel en cours...</div>' : ""}
                <a href="${urlBleu.includes("http") ? urlBleu : "#"}" target="_blank" class="btn btn-bleu" style="${urlBleu.includes("attente") ? "opacity:0.5; pointer-events:none;" : ""}">Explorer la version BLEU</a>
                <div class="url">${urlBleu}</div>
            </div>
            
            <div class="card" style="border-top: 4px solid #e63946;">
                ${urlRouge.includes("attente") ? '<div class="loading-badge"><div class="spinner"></div> Génération du tunnel en cours...</div>' : ""}
                <a href="${urlRouge.includes("http") ? urlRouge : "#"}" target="_blank" class="btn btn-rouge" style="${urlRouge.includes("attente") ? "opacity:0.5; pointer-events:none;" : ""}">Explorer la version ROUGE</a>
                <div class="url">${urlRouge}</div>
            </div>
        </div>
    </body>
    </html>
    `);
});

app.listen(port, () => {
  console.log(`Portail Express démarré avec succès sur le port ${port}`);
});
