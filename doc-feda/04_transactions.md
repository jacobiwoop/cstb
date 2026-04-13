# FedaPay API — Collectes (Transactions / Collects)

## Concept

Une **collecte** est une demande de paiement faite à un client. C'est le flux principal : vous créez une transaction, générez un lien de paiement, redirigez le client, puis vérifiez le statut.

---

## Flux complet d'une collecte

```
1. Créer la transaction (POST /transactions)
        ↓
2. Générer le token de paiement (POST /transactions/{id}/token)
        ↓
3. Rediriger le client vers token.url
        ↓
4. Client effectue le paiement sur la page FedaPay
        ↓
5. FedaPay redirige vers callback_url avec ?id=...&status=...
        ↓
6. Vérifier le statut réel via l'API (GET /transactions/{id})
```

---

## Étape 1 — Créer une transaction

### SDK Node.js
```js
const { FedaPay, Transaction } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('sandbox');

const transaction = await Transaction.create({
  description: 'Paiement commande #1234',
  amount: 2000,                          // En centimes entiers (XOF = FCFA)
  currency: { iso: 'XOF' },
  callback_url: 'https://monsite.com/callback',
  customer: { id: 42 }                   // ou objet customer complet
});

console.log(transaction.id);  // ex: 258
```

### Paramètres de création

| Champ | Type | Requis | Description |
|---|---|---|---|
| `description` | string | ✅ | Description de la transaction |
| `amount` | integer | ✅ | Montant entier (ex: 2000 = 2000 FCFA) |
| `currency` | object | ✅ | `{ iso: 'XOF' }` |
| `callback_url` | string (URL) | Non | URL de retour après paiement |
| `customer` | object | Non | Client (`{ id }` ou objet complet) |
| `mode` | string | Non | Méthode de paiement pour paiement direct |
| `merchant_reference` | string | Non | Votre propre référence unique |
| `custom_metadata` | object | Non | Données personnalisées clé-valeur |

---

## Étape 2 — Générer le token de paiement

```js
const token = await transaction.generateToken();
// token.token  → le token string
// token.url    → l'URL de la page de paiement sécurisée
```

### Via cURL
```bash
curl -X POST https://sandbox-api.fedapay.com/v1/transactions/258/token \
  -H 'Authorization: Bearer YOUR_SECRET_KEY'
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "url": "https://checkout.fedapay.com/pay/258?token=eyJ..."
}
```

---

## Étape 3 — Rediriger le client

```js
// Dans une route Express :
const token = await transaction.generateToken();
return res.redirect(token.url);
```

---

## Étape 4 — Callback URL

FedaPay redirige vers votre `callback_url` avec ces paramètres :

```
https://monsite.com/callback?id=258&status=approved
https://monsite.com/callback?id=259&status=canceled
```

> ⚠️ **Ne jamais faire confiance au statut dans l'URL.** Toujours vérifier via l'API.

---

## Étape 5 — Vérifier le statut réel

```js
const { FedaPay, Transaction } = require('fedapay');

// Dans votre route callback
app.get('/callback', async (req, res) => {
  const { id } = req.query;
  
  const transaction = await Transaction.retrieve(id);
  
  if (transaction.status === 'approved') {
    // Paiement confirmé — débloquer l'accès, enregistrer la commande...
  } else {
    // Paiement non abouti
  }
});
```

---

## Statuts d'une transaction

| Statut | Description |
|---|---|
| `pending` | En attente (statut initial) |
| `approved` | Paiement réussi ✅ |
| `declined` | Interrompu par le client |
| `canceled` | Solde insuffisant ou autre problème |
| `refunded` | Remboursé au client |
| `transferred` | Fonds transférés au marchand |
| `expired` | Expiré après 24h sans paiement |

> `canceled` et `declined` ne sont **pas des statuts finaux** — une nouvelle tentative est possible. Une transaction `pending` expire automatiquement après **24 heures**.

---

## Paiement direct sans redirection (Mobile Money)

Pour MTN Bénin, Moov Bénin, Moov Togo, MTN Côte d'Ivoire uniquement :

```js
// 1. Créer la transaction
const transaction = await Transaction.create({ ... });

// 2. Générer le token
const token = await transaction.generateToken();

// 3. Déclencher le paiement directement
const response = await fetch(
  `https://sandbox-api.fedapay.com/v1/mtn_open`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: token.token,
      phone_number: {
        number: '64000001',
        country: 'BJ'
      }
    })
  }
);
```

Modes disponibles sans redirection : `mtn_open`, `moov`, `moov_tg`, `mtn_ci`

---

## Données personnalisées

### merchant_reference (référence unique marchand)
```js
const transaction = await Transaction.create({
  description: 'Commande',
  amount: 5000,
  currency: { iso: 'XOF' },
  merchant_reference: 'CMD-2025-001',   // Doit être UNIQUE
  customer: { email: 'john@example.com' }
});
```

Récupérer par référence marchand :
```bash
GET /v1/transactions/merchant/CMD-2025-001
```

### custom_metadata (données libres)
```js
const transaction = await Transaction.create({
  description: 'Abonnement premium',
  amount: 10000,
  currency: { iso: 'XOF' },
  customer: { email: 'user@app.com' },
  custom_metadata: {
    client_id: 'USER-14567',
    forfait: 'premium',
    langue: 'fr'
  }
});
```

> ⚠️ `merchant_reference` doit être **unique**. En cas de doublon, la création échoue. Ne jamais y mettre des données sensibles.

---

## Réponse d'une transaction (objet)

```json
{
  "id": 258,
  "reference": "T-ABC123",
  "amount": 2000,
  "description": "Paiement commande #1234",
  "callback_url": "https://monsite.com/callback",
  "status": "approved",
  "created_at": "2025-04-13T10:00:00Z",
  "updated_at": "2025-04-13T10:05:00Z"
}
```

---

## Endpoints résumés

| Méthode | Endpoint | Action |
|---|---|---|
| `POST` | `/transactions` | Créer une transaction |
| `GET` | `/transactions/{id}` | Récupérer une transaction |
| `PUT` | `/transactions/{id}` | Mettre à jour |
| `DELETE` | `/transactions/{id}` | Supprimer |
| `GET` | `/transactions` | Lister / rechercher |
| `POST` | `/transactions/{id}/token` | Générer le lien de paiement |
| `POST` | `/transactions/{id}/send-payment` | Envoyer paiement direct |
