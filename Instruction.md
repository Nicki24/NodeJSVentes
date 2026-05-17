CAHIER DES CHARGES
Application Web de Gestion des Ventes
1. Présentation du projet
1.1 Intitulé du projet

Développement d’une application web de gestion des ventes avec :

Backend : NestJS
Frontend : Angular
Base de données : MySQL avec WampServer
1.2 Contexte

Dans plusieurs commerces ou petites entreprises, les ventes sont encore enregistrées manuellement, ce qui peut entraîner :

des erreurs de calcul ;
une mauvaise gestion des données ;
une difficulté d’analyse des ventes.

Ce projet vise à développer une application web moderne permettant la gestion automatique des ventes et la visualisation des statistiques à travers des graphiques.

1.3 Objectif général

Créer une application web permettant :

d’ajouter des ventes ;
d’afficher les ventes dans un tableau ;
de modifier et supprimer les ventes ;
de calculer automatiquement les montants ;
d’afficher les statistiques des ventes ;
de visualiser les données à l’aide d’un histogramme et d’un diagramme circulaire (camembert).
2. Technologies utilisées
2.1 Frontend
Technologie	Utilisation
Angular	Interface utilisateur
TypeScript	Développement frontend
Bootstrap / Angular Material	Design et responsive
Chart.js / ng2-charts	Graphiques
2.2 Backend
Technologie	Utilisation
NestJS	API REST
NodeJS	Serveur backend
TypeORM	Communication base de données
2.3 Base de données
Technologie	Utilisation
MySQL	Gestion des données
WampServer	Hébergement local MySQL
3. Architecture générale du système
Utilisateur
     |
     v
Frontend Angular
     |
HTTP REST API
     |
     v
Backend NestJS
     |
TypeORM
     |
     v
MySQL (WampServer)
4. Fonctionnalités attendues
4.1 Gestion des ventes

L’application doit permettre :

Ajouter une vente

L’utilisateur saisit :

Numéro produit
Désignation
Prix
Quantité

Le système calcule automatiquement :

Montant = Prix × Quantité
Afficher les ventes

Les ventes doivent être affichées dans un tableau contenant :

| Design | Prix | Quantité | Montant | Actions |

Modifier une vente

L’utilisateur peut modifier :

le prix ;
la quantité ;
la désignation.

Le montant doit être recalculé automatiquement.

Supprimer une vente

L’utilisateur peut supprimer une ligne du tableau.

4.2 Gestion des statistiques

En bas du tableau, le système doit afficher :

le montant total ;
le montant minimal ;
le montant maximal.
4.3 Visualisation graphique

Les statistiques doivent être représentées sous forme de :

Histogramme

Permettant de visualiser :

montant total ;
montant minimal ;
montant maximal.
Diagramme circulaire (camembert)

Permettant de représenter graphiquement :

la répartition des montants.
5. Base de données
5.1 SGBD utilisé

La base de données sera créée et exécutée avec :

WampServer + MySQL
5.2 Nom de la base de données
gestion_vente
5.3 Table principale
Table : vente
Champ	Type	Description
id	INT	Identifiant
numProduit	VARCHAR(50)	Numéro produit
design	VARCHAR(100)	Désignation
prix	DECIMAL(10,2)	Prix unitaire
quantite	INT	Quantité
montant	DECIMAL(10,2)	Prix × quantité
created_at	TIMESTAMP	Date création
5.4 Script SQL complet
CREATE DATABASE gestion_vente;

USE gestion_vente;

CREATE TABLE vente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    numProduit VARCHAR(50) NOT NULL,
    
    design VARCHAR(100) NOT NULL,
    
    prix DECIMAL(10,2) NOT NULL,
    
    quantite INT NOT NULL,
    
    montant DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
6. Backend NestJS
6.1 Structure du projet
src/
 ├── vente/
 │    ├── dto/
 │    ├── entities/
 │    ├── vente.controller.ts
 │    ├── vente.service.ts
 │    ├── vente.module.ts
 │    └── vente.entity.ts
 │
 ├── app.module.ts
 └── main.ts
6.2 Entité Vente
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
export class Vente {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numProduit: string;

  @Column()
  design: string;

  @Column('decimal')
  prix: number;

  @Column()
  quantite: number;

  @Column('decimal')
  montant: number;

  @CreateDateColumn()
  created_at: Date;
}
6.3 API REST
Méthode	URL	Fonction
POST	/vente	Ajouter
GET	/vente	Afficher tout
GET	/vente/:id	Afficher un
PUT	/vente/:id	Modifier
DELETE	/vente/:id	Supprimer
7. Frontend Angular
7.1 Structure du frontend
src/app/
 ├── components/
 │     ├── vente-form/
 │     ├── vente-list/
 │     ├── statistiques/
 │     └── charts/
7.2 Interfaces prévues
Formulaire d’ajout

Champs :

Numéro produit
Désignation
Prix
Quantité

Bouton :

Ajouter
Tableau des ventes

Colonnes :

| Design | Prix | Quantité | Montant | Actions |

Actions :

Modifier
Supprimer
Zone statistiques

Affichage :

Montant total
Montant minimal
Montant maximal
Zone graphiques
Histogramme

Affichage des statistiques sous forme de barres.

Camembert

Affichage des statistiques sous forme circulaire.

8. Calculs métiers
8.1 Calcul du montant
montant = prix * quantite;
8.2 Calcul du total
total = somme(montant);
8.3 Calcul du minimum
minimum = Math.min(...montants);
8.4 Calcul du maximum
maximum = Math.max(...montants);
9. Contraintes techniques

L’application doit être :

responsive ;
simple à utiliser ;
rapide ;
sécurisée ;
maintenable.
10. Validation des données
Champ	Règle
numProduit	obligatoire
design	obligatoire
prix	supérieur à 0
quantite	supérieur à 0
11. Sécurité minimale
Validation des formulaires
Gestion des erreurs HTTP
Activation CORS
Vérification des types de données
12. Outils de développement
Outil	Utilisation
VS Code	Développement
WampServer	Base de données MySQL
Postman	Test API
GitHub	Versionnage
13. Étapes de réalisation
Étape	Description
Analyse	Étude du besoin
Conception BD	Création MySQL
Backend	Développement NestJS
Frontend	Développement Angular
Graphiques	Histogramme + camembert
Tests	Vérification générale
14. Résultats attendus

À la fin du projet, l’application devra :

✅ Ajouter des ventes
✅ Modifier des ventes
✅ Supprimer des ventes
✅ Calculer automatiquement les montants
✅ Afficher les statistiques
✅ Générer un histogramme
✅ Générer un diagramme circulaire
✅ Utiliser NestJS + Angular + MySQL (WampServer)