# FedaPay API — Vue d'ensemble

## Qu'est-ce que FedaPay ?

FedaPay est une passerelle de paiement en ligne africaine, conçue pour les développeurs, entreprises, ONG et travailleurs indépendants. Elle permet d'**accepter des paiements** (collectes) et d'**envoyer des fonds** (dépôts/payouts) vers des comptes Mobile Money.

> Plateforme principale : Bénin, Côte d'Ivoire, Togo et autres pays d'Afrique de l'Ouest.

---

## Deux grandes fonctionnalités

### 1. Collectes (Collects)
Encaisser de l'argent depuis vos clients via :
- Mobile Money (MTN, Moov, Orange...)
- Cartes de crédit
- Lien de paiement partageable
- Widget Checkout.js intégré sur votre site

### 2. Dépôts (Payouts)
Envoyer de l'argent vers un compte Mobile Money. Utile pour rembourser, payer des prestataires, distribuer des fonds.

> ⚠️ Les dépôts ne sont actuellement disponibles que vers des comptes Mobile Money.

---

## Environnements

| Environnement | URL API | Dashboard |
|---|---|---|
| **Sandbox** (test) | `https://sandbox-api.fedapay.com/v1` | https://sandbox.fedapay.com |
| **Live** (production) | `https://api.fedapay.com/v1` | https://live.fedapay.com |

Toujours développer et tester en **sandbox** avant de passer en live.

---

## Stack technique

- API **RESTful** — endpoints prévisibles, JSON en entrée/sortie
- Authentification via **Bearer Token** (clé API secrète)
- SDK officiel Node.js : `npm install fedapay`
- Autres SDKs disponibles : PHP, Ruby, React.js, Angular

---

## Ressources officielles

| Ressource | Lien |
|---|---|
| Documentation principale | https://docs.fedapay.com |
| API Reference | https://docs.fedapay.com/api-reference/introduction-fr |
| SDK Node.js (GitHub) | https://github.com/fedapay/fedapay-node |
| App démo Node.js | https://github.com/fedapay-samples/sample-node |
| Support | https://support.fedapay.com |
