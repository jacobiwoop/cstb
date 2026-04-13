# FedaPay API — Webhooks & Événements

## Concept

Les **webhooks** sont des notifications HTTP que FedaPay envoie à votre serveur en temps réel lorsqu'un événement important se produit (paiement approuvé, annulé, payout envoyé, etc.).

> Sans webhook, vous devez interroger l'API manuellement pour connaître le statut. Avec un webhook, FedaPay vous prévient automatiquement.

---

## Événements disponibles

### Cycle de vie des transactions
| Événement | Déclencheur |
|---|---|
| `transaction.created` | Transaction créée |
| `transaction.approved` | Paiement validé ✅ |
| `transaction.declined` | Interrompu par le client |
| `transaction.canceled` | Annulé (solde insuffisant, etc.) |
| `transaction.updated` | Statut mis à jour |
| `transaction.transferred` | Fonds transférés sur le compte marchand |

### Cycle de vie des clients
| Événement | Déclencheur |
|---|---|
| `customer.created` | Nouveau client ajouté |
| `customer.updated` | Profil client modifié |
| `customer.deleted` | Client supprimé |

---

## Configurer un webhook (Dashboard)

1. Connexion au dashboard FedaPay (sandbox ou live)
2. Aller dans **API → Webhooks**
3. Cliquer **Créer un Webhook**
4. Renseigner :
   - **URL de destination** (doit être HTTPS en production)
   - Événements à écouter (tous ou sélection spécifique)
   - En-têtes HTTP personnalisés (optionnel)
5. Cliquer **Créer** pour activer

---

## Recevoir un webhook — Exemple Express.js complet

```js
const express = require('express');
const bodyParser = require('body-parser');
const { Webhook } = require('fedapay');

const app = express();

// ⚠️ Important : utiliser bodyParser.raw() pour les webhooks
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-fedapay-signature'];
  const endpointSecret = process.env.FEDAPAY_WEBHOOK_SECRET;

  let event;

  try {
    event = Webhook.constructEvent(req.body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature invalide:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Répondre 200 IMMÉDIATEMENT avant tout traitement lourd
  res.json({ received: true });

  // Traiter l'événement de manière asynchrone
  handleEvent(event);
});

async function handleEvent(event) {
  switch (event.name) {
    case 'transaction.approved':
      console.log('Paiement approuvé:', event.data);
      // → Débloquer l'accès, envoyer email de confirmation...
      break;

    case 'transaction.canceled':
      console.log('Transaction annulée:', event.data);
      // → Notifier le client, libérer le stock réservé...
      break;

    case 'transaction.declined':
      console.log('Transaction déclinée:', event.data);
      break;

    case 'transaction.transferred':
      console.log('Fonds transférés:', event.data);
      break;

    case 'customer.created':
      console.log('Nouveau client:', event.data);
      break;

    default:
      console.log(`Événement non géré: ${event.name}`);
  }
}

app.listen(4242, () => console.log('Serveur webhook sur port 4242'));
```

---

## Obtenir le secret du webhook

1. Dashboard → **Webhooks** → sélectionner votre webhook
2. Cliquer sur **"Click to reveal"** pour voir le secret
3. Le stocker dans `.env` : `FEDAPAY_WEBHOOK_SECRET=wh_sandbox_...`

> Les secrets sont **différents entre sandbox et live**, et **uniques par webhook**.

---

## Vérification de signature

FedaPay signe chaque requête avec un header `X-FEDAPAY-SIGNATURE`. La vérification garantit que :
- La requête provient bien de FedaPay (pas d'un attaquant)
- Le contenu n'a pas été altéré
- La requête n'est pas une "replay attack" (l'horodatage est inclus dans la signature)

Le SDK Node.js gère tout cela avec `Webhook.constructEvent()`.

---

## Stratégie de retry automatique

Si votre serveur ne répond pas avec un statut `2xx`, FedaPay réessaie automatiquement :

- Jusqu'à **9 relances** à intervalles exponentiels
- Délai max entre essais : **2 minutes**
- Après **10 échecs** : le webhook est **automatiquement désactivé**

Pour éviter la désactivation automatique : décocher l'option **"Désactiver le webhook en cas d'erreur"** dans le dashboard.

Pour re-déclencher manuellement : Dashboard → **Logs** du webhook → **Re-déclencher**.

---

## Bonnes pratiques

### 1. Répondre 200 immédiatement
```js
// ✅ Correct
res.json({ received: true });   // D'abord
await processPayment(event);    // Ensuite

// ❌ Incorrect
await processPayment(event);    // Peut timeout
res.json({ received: true });
```

### 2. Éviter les doublons
FedaPay peut parfois envoyer le même événement deux fois. Stocker les IDs traités :

```js
const processedEvents = new Set(); // En prod : utiliser une DB

async function handleEvent(event) {
  if (processedEvents.has(event.id)) {
    console.log('Événement déjà traité, ignoré:', event.id);
    return;
  }
  processedEvents.add(event.id);
  // ... traitement
}
```

### 3. Traitement asynchrone
Utiliser une file d'attente (Bull, BullMQ, etc.) pour les traitements lourds :

```js
// Au lieu de traiter directement, mettre en queue
app.post('/webhook', async (req, res) => {
  // Valider signature...
  res.json({ received: true });           // 200 immédiat
  await paymentQueue.add(event);          // Traitement async
});
```

### 4. Exiger HTTPS en production
- URL du webhook : obligatoirement HTTPS
- Certificat SSL valide
- TLS v1.2 ou v1.3 uniquement

### 5. Filtrer les événements nécessaires
Ne s'abonner qu'aux événements utiles pour votre app — évite de surcharger le serveur.
