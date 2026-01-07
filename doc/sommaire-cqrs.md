# Documentation de l'Architecture CQRS et Event Sourcing

## Table des Matières

- [Architecture Globale](#architecture-globale)
- [Introduction](#introduction)
- [Concepts de Base](#concepts-de-base)
- [Pourquoi CQRS + Event Sourcing ?](#pourquoi-cqrs--event-sourcing)
  - [Flux de Travail Asynchrone et Distribué](#flux-de-travail-asynchrone-et-distribué)
  - [Exigences de Forte Auditabilité](#exigences-de-forte-auditabilité)
  - [Modèles de Lecture et d'Écriture Divergents](#modèles-de-lecture-et-décriture-divergents)
  - [Intégration Distribuée](#intégration-distribuée)
- [Concepts Architecturaux Clés](#concepts-architecturaux-clés)
  - [Conception Pilotée par le Domaine (DDD)](#conception-pilotée-par-le-domaine-ddd)
  - [CQRS](#cqrs)
  - [Event Sourcing](#event-sourcing)
  - [Projections Inline (Journal d'Audit)](#projections-inline-journal-daudit)
  - [Patron Outbox et Événements d'Intégration](#patron-outbox-et-événements-dintégration)
- [Conclusion](#conclusion)

---

## Architecture Globale

Voici le diagramme de l'architecture haut-niveau appliqué dans le projet :

![Diagramme de l'Architecture](./architecture-cqrs-es.png)

---

## Introduction

Cette documentation décrit l'approche architecturale utilisant **la Conception Pilotée par le Domaine (DDD)**, **la Ségrégation des Responsabilités de Commande et de Requête (CQRS)** et le **Event Sourcing (ES)**. Cette approche est adaptée pour automatiser des flux de travail complexes, en s’appuyant sur :

- **DDD** pour modéliser les concepts clés du domaine
- **CQRS et ES** pour maintenir la cohérence et l'auditabilité
- **Projections asynchrones** pour les modèles de lecture
- **Patron Outbox** pour une livraison fiable des événements d'intégration
- Une architecture monolithique aujourd'hui, mais conçue pour être distribuée, permettant des mises à jour et notifications en temps réel

---

## Concepts de Base

L'architecture modélise les comportements et contraintes clés des systèmes complexes, tels que :

- Le suivi de la progression des joueurs
- Le suivi des hauts-faits des joueurs
- Le suivi des suspicions de fraude

Ces processus sont parfaitement adaptés pour une architecture **orientée événements**, où le Event Sourcing assure une gestion précise de l'état et de l'historique.

---

## Pourquoi CQRS + Event Sourcing ?

### Flux de Travail Asynchrone et Distribué

Les mises à jour se produisent de manière asynchrone, et divers composants réagissent aux événements de domaine. Une architecture réactive soutient naturellement ce flux distribué orienté événements.

---

### Exigences de Forte Auditabilité

Des historiques complets des événements sont nécessaires pour suivre :

- Les hauts-faits
- Les activités des joueurs (fraudes)
- L'évolution du rush au fil du temps

L'Event Sourcing fournit une **chronologie immuable et chronologique** de tous les événements passés.

---

### Modèles de Lecture et d'Écriture Divergents

Le **modèle d'écriture** applique des règles strictes et des invariants du domaine, tandis que le **modèle de lecture** est optimisé pour :

- Les dashboards utilisateurs
- Les notifications en temps réel
- Les interfaces de visualisation et de suivi

CQRS permet à ces modèles de se développer indépendamment, chacun étant adapté à ses tâches spécifiques.

---

### Intégration Distribuée

Le système doit s'intégrer de manière transparente avec diverses API, services et contextes. L'utilisation d'un Outbox + IntegrationEventBus garantit :

- La livraison fiable des messages
- Les réessais et retransmissions
- Le traitement idempotent côté consommateur

---

## Concepts Architecturaux Clés

### Conception Pilotée par le Domaine (DDD)

**Agrégats**  
Définissent des limites métiers et préservent les invariants.

**Entités / Objets de Valeur**  
Représentent les concepts clés du domaine.

**Événements de Domaine**  
Capturent les occurrences significatives au sein du domaine.

**Contextes Bornés**  
Segmentent le domaine en sous-domaines logiquement cohérents.

---

### CQRS

Les commandes sont utilisées pour les mutations d'état, et les requêtes pour la lecture de l'état. Cette séparation permet d’optimiser les modèles de lecture alimentés par les projections, tandis que les opérations d'écriture restent concentrées sur le Event Sourcing et les invariants.

---

### Event Sourcing

La reconstruction de l'état suit ces étapes :

1. Charger les événements passés
2. Reconstruire les agrégats
3. Exécuter la logique de commande
4. Générer de nouveaux événements

Les avantages incluent :

- Une piste d'audit complète
- La recalculation précise de l'état
- Un débogage simplifié
- Des capacités de requêtes temporelles

---

### Projections Inline (Journal d'Audit)

Les projections mises à jour **synchrones** avec les transactions du magasin d'événements maintiennent un cache instantané. Cela permet des calculs rapides de différences d'état et impose une forte cohérence pour les opérations de lecture immédiates.

---

### Patron Outbox et Événements d'Intégration

Les transactions du côté écriture peuvent produire des événements d'intégration enregistrés dans un Outbox. Un planificateur les publie ensuite sur l'IntegrationEventBus.

Avantages :

- Empêche la perte de messages
- Garantit l'absence de doublons
- Les consommateurs sont entièrement idempotents
- Soutient les projections asynchrones

---

### Événements Traités et Prévention de Mise à Jour Orageuse

Le système suit l'ID unique de chaque événement d'intégration pour maintenir l'idempotence et s'assurer qu'il n'y a pas d'applications doubles. Les modèles de lecture, étant **basés sur la traction**, sont mis à jour de manière réactive, ce qui évite les reconstructions d'état dupliquées inutiles.

---

## Conclusion

L'utilisation de **DDD + CQRS + Event Sourcing** offre une architecture évolutive, traçable et cohérente. Elle modélise efficacement les systèmes complexes, offrant une transparence totale et un alignement avec les exigences d'un domaine orienté événements.

Les sections futures exploreront les applications spécifiques de ce modèle, incluant les agrégats, les magasins d'événements, les projections et les stratégies d'intégration.
