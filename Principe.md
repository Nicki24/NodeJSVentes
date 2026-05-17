17. Contraintes et règles de gestion de l’application

Afin de rendre l’application plus professionnelle, sécurisée et fiable, plusieurs contraintes doivent être respectées durant le développement.

17.1 Contraintes sur les produits
Unicité du numéro produit

Chaque produit doit posséder un identifiant unique.

Règle

Il est interdit d’ajouter deux produits avec le même :

numProduit
Exemple

❌ Interdit :

numProduit	Design
P001	Clavier
P001	Souris

✅ Autorisé :

numProduit	Design
P001	Clavier
P002	Souris
Désignation obligatoire

Le champ :

design

ne doit jamais être vide.

Prix obligatoire

Le prix doit être saisi obligatoirement.

Quantité obligatoire

La quantité doit être renseignée avant l’enregistrement.

17.2 Contraintes de validation des données
Prix positif

Le prix doit être supérieur à zéro.

Règle
prix > 0
Quantité positive

La quantité doit être supérieure à zéro.

Règle
quantite > 0
Valeurs numériques uniquement

Les champs :

prix
quantité

doivent accepter uniquement des nombres.

Longueur maximale des champs
Champ	Taille maximale
numProduit	50 caractères
design	100 caractères
Suppression des espaces inutiles

Les espaces avant ou après les textes doivent être automatiquement supprimés.

Interdiction des champs vides

Aucun champ principal ne doit être vide lors de l’ajout.

17.3 Contraintes de calcul
Calcul automatique du montant

Le montant ne doit jamais être saisi manuellement.

Le système doit calculer automatiquement :

montant = prix × quantite
Recalcul automatique après modification

Lorsqu’un utilisateur modifie :

le prix ;
la quantité ;

le montant doit être recalculé automatiquement.

Mise à jour automatique des statistiques

Après chaque :

ajout ;
modification ;
suppression ;

les statistiques doivent être recalculées automatiquement.

17.4 Contraintes sur la suppression
Confirmation obligatoire

Avant suppression :

une boîte de confirmation doit apparaître.
Exemple
Voulez-vous vraiment supprimer cette vente ?
Suppression définitive

Une vente supprimée disparaît définitivement de la base de données.

17.5 Contraintes ergonomiques
Interface responsive

L’application doit fonctionner sur :

ordinateur ;
tablette ;
smartphone.
Temps de réponse rapide

Les opérations doivent être rapides et fluides.

Navigation simple

L’utilisateur doit pouvoir accéder facilement :

au formulaire ;
au tableau ;
aux statistiques ;
aux graphiques.
Messages utilisateur clairs

Le système doit afficher des messages explicites.

Exemples

✅ Vente ajoutée avec succès
❌ Numéro produit déjà existant
❌ Erreur lors de la suppression

17.6 Contraintes de sécurité
Validation côté frontend

Angular doit vérifier :

les champs vides ;
les types de données ;
les valeurs incorrectes.
Validation côté backend

NestJS doit également vérifier toutes les données avant insertion.

Protection contre les erreurs API

Le backend doit gérer :

les erreurs serveur ;
les requêtes invalides ;
les données incorrectes.
Activation CORS

Le backend doit autoriser les requêtes provenant du frontend Angular.

Protection des routes API

Les routes doivent être structurées correctement pour éviter les accès incorrects.

17.7 Contraintes base de données
Clé primaire obligatoire

Le champ :

id

doit être unique et auto-incrémenté.

Contrainte UNIQUE

Le champ :

numProduit

doit avoir une contrainte UNIQUE dans MySQL.

Exemple SQL
CREATE TABLE vente (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    numProduit VARCHAR(50) UNIQUE NOT NULL,
    
    design VARCHAR(100) NOT NULL,
    
    prix DECIMAL(10,2) NOT NULL,
    
    quantite INT NOT NULL,
    
    montant DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
17.8 Contraintes graphiques
Mise à jour automatique des graphiques

Les graphiques doivent se mettre à jour automatiquement après chaque opération.

Affichage clair des données

Les graphiques doivent afficher :

titres ;
légendes ;
valeurs visibles.
Différenciation des couleurs

Chaque statistique doit avoir une couleur différente pour éviter la confusion.

17.9 Contraintes techniques
Architecture modulaire

Le projet doit respecter une architecture claire :

frontend séparé ;
backend séparé ;
base de données séparée.
Utilisation des bonnes pratiques

Le code doit être :

propre ;
commenté ;
organisé ;
maintenable.
Gestion GitHub

Le projet doit utiliser Git/GitHub pour :

sauvegarder le code ;
suivre les modifications ;
collaborer facilement.
17.10 Contraintes de performance
Chargement optimisé

L’application doit éviter :

les rechargements inutiles ;
les appels API excessifs.
Optimisation des requêtes SQL

Les requêtes doivent être rapides et bien structurées.

17.11 Contraintes professionnelles supplémentaires
Tri des données

Le tableau peut être trié par :

prix ;
quantité ;
montant.
Recherche dynamique

L’utilisateur peut rechercher un produit par :

numéro produit ;
désignation.
Pagination

Si les données deviennent nombreuses :

le tableau doit être paginé.
Historique des dates

Chaque vente doit enregistrer :

la date de création.
17.12 Résultat professionnel attendu

L’application finale doit :

✅ empêcher les doublons
✅ sécuriser les données
✅ afficher des statistiques fiables
✅ avoir une interface moderne
✅ être rapide et responsive
✅ respecter les bonnes pratiques professionnelles
✅ être facilement maintenable et évolutive