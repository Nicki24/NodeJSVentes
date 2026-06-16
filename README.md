# TechStock

Application web moderne de **gestion des ventes** développée avec **NestJS** (backend) et **Angular** (frontend), utilisant **MySQL** comme base de données.

## Fonctionnalités

- Ajouter, modifier et supprimer des ventes
- Calcul automatique des montants (prix × quantité)
- Tableau des ventes avec tri, recherche et pagination
- Statistiques : total, minimum, maximum
- Graphiques : histogramme et diagramme circulaire (Chart.js)
- Interface responsive et moderne

## Technologies

| Couche     | Technologie            |
|------------|------------------------|
| Frontend   | Angular 21, Chart.js   |
| Backend    | NestJS 11, TypeORM     |
| Base de données | MySQL (WampServer) |

## Captures d'écran

### Dashboard
![Dashboard](pictures/Capture%20d'écran%202026-06-16%20100637.png)

### Tableau des ventes
![Tableau des ventes](pictures/Capture%20d'écran%202026-06-16%20100702.png)

### Statistiques et graphiques
![Statistiques](pictures/Capture%20d'écran%202026-06-16%20100726.png)

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou +)
- [WampServer](https://www.wampserver.com/) (MySQL)
- [Git](https://git-scm.com/)

## Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/Nicki24/NodeJSVentes.git
cd NodeJSVentes
```

### 2. Base de données

Démarrez WampServer, puis créez la base de données avec phpMyAdmin ou via la ligne de commande :

```sql
CREATE DATABASE gestion_vente;
```

### 3. Backend

```bash
cd backend
npm install
npm run start:dev
```

Le backend démarre sur `http://localhost:3000`.

### 4. Frontend

```bash
cd frontend
npm install
npm start
```

Le frontend démarre sur `http://localhost:4200`.

### 5. Utilisation

Ouvrez `http://localhost:4200` dans votre navigateur et commencez à ajouter des ventes.

## API REST

| Méthode | URL              | Description          |
|---------|------------------|----------------------|
| POST    | `/vente`         | Ajouter une vente    |
| GET     | `/vente`         | Lister les ventes    |
| GET     | `/vente/:id`     | Voir une vente       |
| PUT     | `/vente/:id`     | Modifier une vente   |
| DELETE  | `/vente/:id`     | Supprimer une vente  |
| GET     | `/vente/stats`   | Statistiques         |
