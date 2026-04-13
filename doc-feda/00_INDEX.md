# FedaPay API — Index de la documentation

> **Objectif de ces documents** : Fournir à une IA tout le contexte nécessaire pour aider à l'intégration de l'API FedaPay dans un projet Node.js.

---

## Structure des documents

| Fichier | Contenu |
|---|---|
| `01_overview.md` | Présentation générale, environnements, ressources |
| `02_authentication.md` | Clés API, Bearer token, configuration SDK |
| `03_customers.md` | Création et gestion des clients |
| `04_transactions.md` | Collectes : création, token, callback, statuts, paiement direct |
| `05_payouts.md` | Dépôts : envoi de fonds vers Mobile Money |
| `06_webhooks.md` | Événements temps réel, vérification de signature, bonnes pratiques |
| `07_payment_methods_and_utils.md` | Modes de paiement, devises, balances, logs |
| `08_nodejs_integration_guide.md` | Exemple complet Express.js prêt à l'emploi |

---

## Informations clés à retenir

### Endpoints de base
- **Sandbox** : `https://sandbox-api.fedapay.com/v1`
- **Live** : `https://api.fedapay.com/v1`

### Authentication
```
Authorization: Bearer YOUR_SECRET_API_KEY
Content-Type: application/json
```

### SDK Node.js
```bash
npm install fedapay
```

### Flux principal (collecte)
```
POST /transactions → POST /transactions/{id}/token → redirect(token.url) → GET /transactions/{id}
```

### Flux webhook
```
FedaPay → POST vers votre URL → répondre 200 → traiter event de façon async
```

### Statuts de transaction
`pending` → `approved` / `declined` / `canceled` / `expired` → `transferred` / `refunded`

---

## Points critiques (erreurs courantes à éviter)

1. **Ne jamais faire confiance au statut dans le callback_url** — toujours vérifier via l'API
2. **Email du customer = identifiant unique** — même email = même client mis à jour
3. **merchant_reference doit être unique** — doublon = erreur de création
4. **Webhook : utiliser bodyParser.raw()** — pas express.json() pour la route webhook
5. **Répondre 200 immédiatement** dans le webhook handler, traiter en async ensuite
6. **Clés sandbox et live sont séparées** — ne jamais confondre
7. **TLS v1.2/1.3 requis** pour les URL webhook en production

---

## Contexte du projet

- Backend : **Node.js / Express**
- SDK : `fedapay` npm package
- Devise : **XOF** (Franc CFA)
- Région : **Bénin** (et Afrique de l'Ouest)
