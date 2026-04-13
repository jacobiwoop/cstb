# FedaPay API — Dépôts (Payouts)

## Concept

Les **Payouts** permettent d'envoyer de l'argent depuis votre compte FedaPay vers le compte Mobile Money d'un bénéficiaire. Utile pour : remboursements, paiement de prestataires, distribution de gains, etc.

> ⚠️ Les payouts ne sont actuellement disponibles que vers des comptes **Mobile Money** (pas de virement bancaire direct).

---

## Flux d'un payout

```
1. Créer le payout (POST /payouts)
        ↓
2. Démarrer le payout (PUT /payouts/{id}/start)
        ↓
3. Statut mis à jour automatiquement (sent / failed)
        ↓
4. Webhook notifie votre serveur du résultat
```

---

## Créer un payout

### SDK Node.js
```js
const { FedaPay, Payout } = require('fedapay');

FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment('sandbox');

const payout = await Payout.create({
  amount: 5000,
  currency: { iso: 'XOF' },
  mode: 'mtn',                          // Mode de paiement
  customer: {
    firstname: 'Alice',
    lastname: 'Martin',
    email: 'alice@example.com',
    phone_number: {
      number: '97000000',
      country: 'BJ'
    }
  }
});

console.log(payout.id);
```

### Via cURL
```bash
curl -X POST https://sandbox-api.fedapay.com/v1/payouts \
  -H 'Authorization: Bearer YOUR_SECRET_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "amount": 5000,
    "currency": { "iso": "XOF" },
    "mode": "mtn",
    "customer": {
      "email": "alice@example.com",
      "phone_number": {
        "number": "97000000",
        "country": "BJ"
      }
    }
  }'
```

---

## Paramètres de création

| Champ | Type | Requis | Description |
|---|---|---|---|
| `amount` | integer | ✅ | Montant à envoyer |
| `currency` | object | ✅ | `{ iso: 'XOF' }` |
| `mode` | string | ✅ | Mode de paiement (`mtn`, `moov`, etc.) |
| `customer` | object | ✅ | Destinataire (avec numéro de téléphone) |

---

## Démarrer le payout

Après création, il faut explicitement déclencher l'envoi :

```js
// Le SDK expose cette méthode
await payout.sendNow();

// Ou via cURL :
// PUT /payouts/{id}/start
```

---

## Statuts d'un payout

| Statut | Description |
|---|---|
| `pending` | Créé, pas encore envoyé |
| `scheduled` | Programmé pour envoi |
| `sent` | Envoyé avec succès ✅ |
| `failed` | Échec de l'envoi ❌ |

---

## Réponse d'un payout (objet complet)

```json
{
  "id": 99,
  "reference": "P-XYZ456",
  "amount": 5000,
  "status": "sent",
  "customer_id": 42,
  "currency_id": 1,
  "mode": "mtn",
  "commission": 50,
  "fees": 0,
  "fixed_commission": 50,
  "amount_transferred": 4950,
  "amount_debited": 5000,
  "created_at": "2025-04-13T10:00:00Z",
  "updated_at": "2025-04-13T10:02:00Z",
  "sent_at": "2025-04-13T10:02:00Z",
  "failed_at": null,
  "merchant_reference": null,
  "custom_metadata": {}
}
```

### Champs importants

| Champ | Description |
|---|---|
| `amount_transferred` | Montant réellement reçu par le bénéficiaire |
| `amount_debited` | Montant débité de votre compte FedaPay |
| `commission` | Commission FedaPay |
| `fees` | Frais opérateur |
| `last_error_code` | Code d'erreur si `status = failed` |

---

## Endpoints résumés

| Méthode | Endpoint | Action |
|---|---|---|
| `POST` | `/payouts` | Créer un payout |
| `GET` | `/payouts/{id}` | Récupérer un payout |
| `PUT` | `/payouts/{id}` | Mettre à jour |
| `DELETE` | `/payouts/{id}` | Supprimer |
| `GET` | `/payouts` | Lister |
| `PUT` | `/payouts/{id}/start` | Démarrer l'envoi |
