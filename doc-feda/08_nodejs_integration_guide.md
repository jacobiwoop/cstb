# FedaPay API — Guide d'intégration Node.js (Exemple complet)

## Setup du projet

```bash
mkdir mon-projet-fedapay
cd mon-projet-fedapay
npm init -y
npm install express fedapay dotenv body-parser
```

Fichier `.env` :
```
FEDAPAY_SECRET_KEY=sk_sandbox_xxxxxxxxxxxx
FEDAPAY_WEBHOOK_SECRET=wh_sandbox_xxxxxxxxxxxx
NODE_ENV=development
PORT=3000
```

---

## Structure recommandée

```
mon-projet/
├── .env
├── index.js
├── routes/
│   ├── payment.js      ← Routes de paiement
│   └── webhook.js      ← Handler webhook
└── services/
    └── fedapay.js      ← Initialisation SDK
```

---

## services/fedapay.js — Initialisation centralisée

```js
require('dotenv').config();
const { FedaPay } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(
  process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
);

module.exports = FedaPay;
```

---

## routes/payment.js — Créer et initier un paiement

```js
const express = require('express');
const router = express.Router();
const { Transaction } = require('fedapay');
require('../services/fedapay'); // Initialisation

// POST /pay — Créer une transaction et retourner le lien de paiement
router.post('/pay', async (req, res) => {
  const { amount, description, customer_email, customer_name } = req.body;

  try {
    // 1. Créer la transaction
    const transaction = await Transaction.create({
      description: description || 'Paiement',
      amount: parseInt(amount),
      currency: { iso: 'XOF' },
      callback_url: `${process.env.BASE_URL}/payment/callback`,
      customer: {
        email: customer_email,
        firstname: customer_name || 'Client',
      },
      custom_metadata: {
        source: 'web',
        timestamp: Date.now()
      }
    });

    // 2. Générer le token de paiement
    const token = await transaction.generateToken();

    res.json({
      success: true,
      transaction_id: transaction.id,
      payment_url: token.url
    });

  } catch (error) {
    console.error('Erreur création transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /payment/callback — Page de retour après paiement
router.get('/callback', async (req, res) => {
  const { id, status } = req.query;

  try {
    // ⚠️ Toujours vérifier le vrai statut via l'API
    const transaction = await Transaction.retrieve(id);

    if (transaction.status === 'approved') {
      return res.redirect('/success?id=' + id);
    } else {
      return res.redirect('/failed?id=' + id + '&status=' + transaction.status);
    }

  } catch (error) {
    console.error('Erreur vérification statut:', error);
    res.status(500).send('Erreur lors de la vérification du paiement');
  }
});

// GET /payment/status/:id — Vérifier le statut d'une transaction
router.get('/status/:id', async (req, res) => {
  try {
    const transaction = await Transaction.retrieve(req.params.id);
    res.json({
      id: transaction.id,
      status: transaction.status,
      amount: transaction.amount,
      description: transaction.description
    });
  } catch (error) {
    res.status(404).json({ error: 'Transaction introuvable' });
  }
});

module.exports = router;
```

---

## routes/webhook.js — Recevoir les événements FedaPay

```js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { Webhook } = require('fedapay');

// ⚠️ bodyParser.raw() OBLIGATOIRE pour la vérification de signature
router.post('/', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-fedapay-signature'];

  let event;
  try {
    event = Webhook.constructEvent(
      req.body,
      signature,
      process.env.FEDAPAY_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Signature webhook invalide:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Répondre immédiatement
  res.json({ received: true });

  // Traiter l'événement de manière asynchrone
  processEvent(event).catch(console.error);
});

async function processEvent(event) {
  console.log(`[Webhook] Événement reçu: ${event.name} | ID: ${event.id}`);

  switch (event.name) {
    case 'transaction.approved':
      await onTransactionApproved(event.data);
      break;
    case 'transaction.canceled':
      await onTransactionCanceled(event.data);
      break;
    case 'transaction.declined':
      await onTransactionDeclined(event.data);
      break;
    case 'transaction.transferred':
      await onTransactionTransferred(event.data);
      break;
    default:
      console.log(`[Webhook] Événement ignoré: ${event.name}`);
  }
}

async function onTransactionApproved(data) {
  console.log('✅ Paiement approuvé:', data);
  // TODO: Mettre à jour la commande en base de données
  // TODO: Envoyer email de confirmation
  // TODO: Débloquer l'accès au service
}

async function onTransactionCanceled(data) {
  console.log('❌ Transaction annulée:', data);
  // TODO: Notifier le client
  // TODO: Libérer le stock réservé
}

async function onTransactionDeclined(data) {
  console.log('⚠️ Transaction déclinée:', data);
  // TODO: Proposer une autre méthode de paiement
}

async function onTransactionTransferred(data) {
  console.log('💰 Fonds transférés:', data);
  // TODO: Mettre à jour la comptabilité
}

module.exports = router;
```

---

## index.js — Point d'entrée

```js
require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.use('/payment', require('./routes/payment'));
app.use('/webhook', require('./routes/webhook'));

// Pages de résultat (exemple simple)
app.get('/success', (req, res) => {
  res.send(`<h1>✅ Paiement réussi ! Transaction #${req.query.id}</h1>`);
});

app.get('/failed', (req, res) => {
  res.send(`<h1>❌ Paiement échoué. Statut: ${req.query.status}</h1>`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

---

## Tester en sandbox

### Numéros de test Mobile Money (Bénin)

| Opérateur | Numéro | Résultat |
|---|---|---|
| MTN Bénin | `64000001` | Paiement approuvé |
| MTN Bénin | `64000002` | Paiement annulé |
| Moov Bénin | `96000001` | Paiement approuvé |

### Tester les webhooks localement avec ngrok

```bash
# Installer ngrok
npm install -g ngrok

# Exposer votre port local
ngrok http 3000

# Copier l'URL HTTPS générée (ex: https://abc123.ngrok.io)
# L'utiliser comme URL de webhook dans le dashboard sandbox
```

---

## Checklist avant mise en production

- [ ] Remplacer `sk_sandbox_...` par `sk_live_...`
- [ ] Remplacer `wh_sandbox_...` par le secret webhook live
- [ ] Changer `FedaPay.setEnvironment('live')`
- [ ] URL webhook en HTTPS avec certificat SSL valide
- [ ] Vérification de signature activée
- [ ] Ne jamais exposer la clé secrète côté client/frontend
- [ ] Logs d'erreur en place
- [ ] Tests complets en sandbox avant bascule
