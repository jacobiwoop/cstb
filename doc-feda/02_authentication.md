# FedaPay API — Authentification & Configuration

## Obtenir ses clés API

1. Créer un compte sur https://sandbox.fedapay.com (test) ou https://live.fedapay.com (production)
2. Aller dans **Paramètres → API** dans le dashboard
3. Copier la **clé secrète** (secret key) — ne jamais l'exposer côté client

---

## Authentification

Toutes les requêtes doivent inclure un header `Authorization` de type **Bearer** :

```
Authorization: Bearer YOUR_SECRET_API_KEY
```

**Exemple cURL :**
```bash
curl -X GET https://sandbox-api.fedapay.com/v1/transactions \
  -H 'Authorization: Bearer sk_sandbox_xxxxxxxxxxxx' \
  -H 'Content-Type: application/json'
```

---

## Configuration du SDK Node.js

### Installation
```bash
npm install fedapay --save
```

### Initialisation (à faire une seule fois au démarrage)
```js
const { FedaPay } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('sandbox'); // 'sandbox' | 'live'
```

> ✅ Bonne pratique : toujours stocker la clé dans une variable d'environnement `.env`, jamais en dur dans le code.

### Exemple avec dotenv
```js
require('dotenv').config();
const { FedaPay } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(process.env.NODE_ENV === 'production' ? 'live' : 'sandbox');
```

Fichier `.env` :
```
FEDAPAY_SECRET_KEY=sk_sandbox_xxxxxxxxxxxx
```

---

## Types de clés API

| Type | Préfixe | Usage |
|---|---|---|
| Clé secrète sandbox | `sk_sandbox_...` | Tests, développement |
| Clé secrète live | `sk_live_...` | Production réelle |

> ⚠️ Les clés sandbox et live sont totalement séparées. Une clé sandbox ne fonctionnera jamais sur l'API live.

---

## Headers standard pour toutes les requêtes

```
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
```
