# FedaPay API — Gestion des Clients (Customers)

## Concept

Un **Customer** est un client associé à une transaction. Il peut être créé à l'avance ou à la volée lors de la création d'une transaction.

> ⚠️ FedaPay identifie les clients par leur **adresse email**. Si vous envoyez le même email avec des données différentes, FedaPay **mettra à jour** le client existant, il n'en créera pas un nouveau.

---

## Créer un client

### Via SDK Node.js
```js
const { FedaPay, Customer } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('sandbox');

const customer = await Customer.create({
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@example.com',
  phone_number: {
    number: '97000000',
    country: 'BJ'   // Code pays ISO (BJ = Bénin, CI = Côte d'Ivoire, TG = Togo)
  }
});

console.log(customer.id); // ID à stocker pour réutiliser
```

### Via cURL
```bash
curl -X POST https://sandbox-api.fedapay.com/v1/customers \
  -H 'Authorization: Bearer YOUR_SECRET_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "phone_number": {
      "number": "97000000",
      "country": "BJ"
    }
  }'
```

---

## Champs du Customer

| Champ | Type | Requis | Description |
|---|---|---|---|
| `firstname` | string | Non | Prénom |
| `lastname` | string | Non | Nom |
| `email` | string | Non* | Email (identifiant unique) |
| `phone_number.number` | string | Non | Numéro de téléphone |
| `phone_number.country` | string | Non | Code pays ISO (BJ, CI, TG...) |

> *L'email est fortement recommandé — c'est la clé d'identification.

---

## Codes pays courants

| Pays | Code |
|---|---|
| Bénin | `BJ` |
| Côte d'Ivoire | `CI` |
| Togo | `TG` |
| Sénégal | `SN` |
| Cameroun | `CM` |

---

## Créer un client à la volée dans une transaction

Vous pouvez créer le client directement lors de la création de la transaction, sans étape séparée :

```js
const transaction = await Transaction.create({
  description: 'Commande #001',
  amount: 5000,
  currency: { iso: 'XOF' },
  callback_url: 'https://monsite.com/callback',
  customer: {
    firstname: 'Jane',
    lastname: 'Smith',
    email: 'jane@example.com',
    phone_number: {
      number: '96000000',
      country: 'BJ'
    }
  }
});
```

---

## Réutiliser un client existant

Si le client est déjà enregistré, passez simplement son `id` :

```js
const transaction = await Transaction.create({
  description: 'Commande #002',
  amount: 3000,
  currency: { iso: 'XOF' },
  customer: { id: 42 }   // ID du customer déjà créé
});
```

---

## Réponse d'un Customer (objet)

```json
{
  "id": 42,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "phone_number": {
    "number": "97000000",
    "country": "BJ"
  },
  "created_at": "2025-01-01T10:00:00Z",
  "updated_at": "2025-01-01T10:00:00Z"
}
```
