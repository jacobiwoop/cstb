# FedaPay API — Méthodes de Paiement, Balances & Utilitaires

## Méthodes de paiement

### Modes avec redirection (tous opérateurs)
Lors d'une collecte avec redirection, le client choisit son mode de paiement sur la page FedaPay. Vous n'avez pas à spécifier le mode.

### Modes sans redirection (paiement direct)
Disponibles uniquement pour intégration directe (sans redirection vers page FedaPay) :

| Mode | Opérateur | Pays |
|---|---|---|
| `mtn_open` | MTN Mobile Money | Bénin |
| `moov` | Moov Money | Bénin |
| `moov_tg` | Moov Money | Togo |
| `mtn_ci` | MTN Mobile Money | Côte d'Ivoire |

> ⚠️ Orange Money et les cartes de crédit ne sont disponibles qu'avec redirection vers la page de paiement FedaPay.

---

## Devises (Currencies)

### Devise principale
| Code ISO | Nom | Pays |
|---|---|---|
| `XOF` | Franc CFA | Bénin, Côte d'Ivoire, Togo, Sénégal... |

### Récupérer les devises disponibles

```js
const { FedaPay, Currency } = require('fedapay');

const currencies = await Currency.all();
```

```bash
GET /v1/currencies
```

---

## Balances (Soldes)

Vérifier le solde de votre compte FedaPay :

```bash
GET /v1/balances
GET /v1/balances/{id}
```

### Réponse typique
```json
{
  "id": 1,
  "amount": 150000,
  "currency": "XOF",
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-04-13T10:00:00Z"
}
```

---

## Logs

Accéder aux logs de l'API pour déboguer :

```bash
GET /v1/logs          # Tous les logs
GET /v1/logs/{id}     # Un log spécifique
```

Également accessible depuis le dashboard : **API → Logs**

---

## Événements (Events)

Consulter l'historique de tous les événements :

```bash
GET /v1/events        # Tous les événements
GET /v1/events/{id}   # Un événement spécifique
```

---

## Récupération de fonds

Pour retirer les fonds collectés sur votre compte FedaPay vers votre compte bancaire ou Mobile Money personnel, tout se gère depuis le **Dashboard FedaPay** :

Dashboard → **Fonds** → Demander un retrait

> Cela ne passe pas par l'API — c'est une opération manuelle dans l'interface.

---

## Résumé des endpoints disponibles

| Ressource | Endpoints |
|---|---|
| **Customers** | `GET/POST/PUT/DELETE /customers` |
| **Transactions** | `GET/POST/PUT/DELETE /transactions` |
| **Token de paiement** | `POST /transactions/{id}/token` |
| **Paiement direct** | `POST /{mode}` (ex: `/mtn_open`) |
| **Payouts** | `GET/POST/PUT/DELETE /payouts` |
| **Start payout** | `PUT /payouts/{id}/start` |
| **Events** | `GET /events`, `GET /events/{id}` |
| **Balances** | `GET /balances`, `GET /balances/{id}` |
| **Currencies** | `GET /currencies`, `GET /currencies/{id}` |
| **Logs** | `GET /logs`, `GET /logs/{id}` |
| **Webhooks** | `GET /webhooks`, `GET /webhooks/{id}` |
