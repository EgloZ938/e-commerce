# 🚀 Utilisation de l’IA dans notre projet

---

## 👥 **Les créateurs du projet**  
Ce projet a été réalisé avec passion par :  
- **Théo EVON**  
- **Médy DANIEL**  

---

## 🧠 **Comment nous avons utilisé l’IA**  
Nous avons utilisé **GitHub Copilot** pour :  
- ✨ Générer du code **React** (composants, hooks, etc.) et des routes **Express**.  
- 🛠️ Optimiser le code en proposant des alternatives plus claires ou performantes.  
- ⚡ Corriger rapidement les erreurs et éviter les oublis.  

---

## 🔍 **Où elle a été la plus utile et pourquoi**  

### 🖥️ **Frontend avec React**  
- Copilot a été très efficace pour créer des composants réutilisables, comme :  
  - 🗂️ Les **cartes produits**.  
  - 📝 Les **formulaires**.  
- Cela nous a permis de nous concentrer sur les **détails visuels** et **fonctionnels**.

### 🌐 **Backend avec Node.js**  
- Il a proposé des structures standard pour :  
  - 📂 Les **routes**.  
  - 🧰 Les **middleware**.  
- Ces suggestions ont simplifié la gestion des **données** et des **erreurs**.

---

## 🎯 **L’impact de l’IA sur notre code**  

- ⏳ **Gain de temps** : Moins de temps passé sur des tâches répétitives ou complexes.  
- 🔧 **Code optimisé** : Propositions basées sur les **bonnes pratiques**, rendant le code plus **lisible** et **maintenable**.  
- 🛡️ **Moins d’erreurs** : Corrections et alertes sur des erreurs courantes ou des oublis.  


---

## 💡 **Conclusion**  
L’IA a été un outil précieux qui nous a permis de :  
- Travailler **plus vite** et **mieux**.  
- Éviter des erreurs.  
- Produire un code de **qualité**.  

---

# 📝 Exercice : Génération de Tests Automatiques et Défis de Codage avec IA

---

## ✨ **Exercice 1 : Génération de Tests Automatiques avec Copilot**

### 🎯 Objectif :  
Créer des tests unitaires automatiques dans un projet Node.js pour assurer une couverture de code optimale.

### 📚 **Explications :**
L'objectif est de tester deux fonctions simples :
- `add(a, b)` : ajoute deux nombres.
- `multiply(a, b)` : multiplie deux nombres.

Les tests sont écrits en utilisant **Jest**, un framework de tests populaire pour Node.js. Ils couvrent différents cas, comme l'utilisation de zéro dans les calculs.

### 🛠️ **Exemple de code :**
#### Fonction `add` :
```javascript
function add(a, b) {
    return a + b;
}
```

#### Test pour `add` :
```javascript
test('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
});
```

Ce test vérifie que la fonction additionne correctement deux nombres.

#### Fonction `multiply` :
```javascript
function multiply(a, b) {
    return a * b;
}
```

#### Test pour `multiply` :
```javascript
test('multiplies two numbers correctly', () => {
    expect(multiply(2, 3)).toBe(6);
});
```

Le test valide que la multiplication fonctionne comme attendu, y compris dans des cas spécifiques comme avec un zéro.

---

## ✨ **Exercice 2 : Défis de Codage avec IA**

### 🎯 Objectif :  
Créer et comparer différentes méthodes de tri en JavaScript avec l'aide de l'IA.

### 📚 **Explications :**
Cet exercice présente trois approches différentes pour trier un tableau d'entiers :
1. **Bubble Sort** : Une méthode simple et lente basée sur des comparaisons successives.
2. **Quick Sort** : Une méthode rapide et efficace basée sur le paradigme "diviser pour régner".
3. **Native Sort** : Utilisation de la méthode `sort()` native de JavaScript.

### 🛠️ **Exemple de code :**
#### Bubble Sort :
```javascript
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
        }
    }
    return arr;
}
```

**Explication** :  
Chaque élément est comparé à son voisin, et un échange est effectué si nécessaire. Ce processus est répété jusqu'à ce que le tableau soit trié.

#### Quick Sort :
```javascript
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.filter(el => el < pivot);
    const right = arr.filter(el => el > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}
```

**Explication** :  
L'algorithme choisit un pivot et partitionne le tableau en deux parties : les éléments inférieurs et supérieurs au pivot. Ce processus est récursif.

#### Native Sort :
```javascript
function nativeSort(arr) {
    return arr.sort((a, b) => a - b);
}
```

**Explication** :  
La méthode native utilise une fonction de comparaison personnalisée pour trier les éléments.

### 🔍 **Comparaison des Méthodes :**
- **Bubble Sort** : Simple mais inefficace pour les grands ensembles de données.
- **Quick Sort** : Rapide et adapté à la plupart des cas.
- **Native Sort** : Optimisé pour des besoins courants.

---

# ⚙️ **Fonctionnalités du projet**

Notre application e-commerce est une plateforme moderne qui offre une expérience utilisateur complète, allant de la navigation sur les produits jusqu'à la gestion des commandes via une interface administrateur. Voici un aperçu détaillé de ses fonctionnalités :

---

## 🛒 **Frontend (Interface Utilisateur)**

### 🌟 **Pages principales :**
1. **Accueil (Home)**  
   - Présentation des **produits phares** via un **carousel interactif**.
   - Affichage des **catégories** avec des animations élégantes.  
   - Boutons pour naviguer directement vers les détails des produits ou ajouter au panier.

2. **Liste des produits (ProductList)**  
   - Affichage de tous les produits disponibles avec un style en grille.  
   - Recherche et filtre par catégories.  

3. **Détail du produit (ProductDetail)**  
   - Description complète d'un produit, incluant :  
     - Image, nom, marque, description, prix, et disponibilité.  
   - Possibilité d’ajouter au panier directement depuis cette page.  

4. **Panier (Cart)**  
   - Visualisation des articles ajoutés.  
   - Modification des quantités ou suppression d’articles.  
   - Redirection vers la page de paiement.

5. **Authentification (Login & Register)**  
   - Création de compte utilisateur.  
   - Connexion sécurisée avec gestion des sessions.  

6. **Profil utilisateur (Profile)**  
   - Visualisation des informations personnelles.  
   - Historique des commandes.

---

## 🛠️ **Backend (API et Gestion des Données)**

### 🗂️ **Structure des fichiers backend :**
1. **Fichiers de configuration (config/db.js)**  
   - Connexion à la base de données MongoDB.

2. **Modèles (models)**  
   - `userModel.js` : Gestion des utilisateurs.  
   - `productModel.js` : Gestion des produits.  
   - `cartModel.js` : Gestion des paniers.  
   - `orderModel.js` : Gestion des commandes.  

3. **Contrôleurs (controllers)**  
   - `authController.js` : Authentification et gestion des utilisateurs.  
   - `productController.js` : Gestion des produits (ajout, mise à jour, suppression).  
   - `cartController.js` : Gestion des articles dans le panier.  
   - `stripeController.js` : Intégration avec **Stripe** pour les paiements simulés.  

4. **Middlewares (middleware)**  
   - `authMiddleware.js` : Protection des routes avec vérification des jetons.  
   - `generateToken.js` : Génération des tokens JWT.  
   - `uploadMiddleware.js` : Gestion des fichiers téléversés.  

5. **Routes (routes)**  
   - `authRoutes.js` : Routes pour l’inscription et la connexion.  
   - `productRoutes.js` : Routes CRUD pour les produits.  
   - `cartRoutes.js` : Routes pour la gestion des paniers.  
   - `stripeRoutes.js` : Routes pour les paiements Stripe.  
   - `uploadRoutes.js` : Routes pour la gestion des téléversements de fichiers.  

6. **Utilitaires (utils/seeder.js)**  
   - Script pour peupler la base de données avec des produits ou utilisateurs par défaut.

---

## 🛡️ **Interface Administrateur**

1. **Connexion Administrateur (LoginAdmin)**  
   - Page dédiée pour les administrateurs.  

2. **Dashboard Administrateur (AdminDashboard)**  
   - Vue d’ensemble des statistiques (produits, utilisateurs, commandes).  

3. **Gestion des Produits**  
   - **Liste des produits** avec options pour ajouter, modifier ou supprimer.  
   - **Création et modification** de produits avec téléversement d’images.  

4. **Gestion des Utilisateurs (AdminUsers)**  
   - Visualisation de tous les utilisateurs enregistrés.  
   - Suppression ou modification des droits.  

---

## 💳 **Paiement et Commandes**

- Intégration de **Stripe** pour gérer les paiements simulés.  
- Suivi des commandes, incluant l’historique dans le profil utilisateur.  

---

## 🔗 **Technologies utilisées**

### Frontend :  
- **React.js** : Framework principal.  
- **Tailwind CSS** : Design moderne et réactif.  
- **Redux** : Gestion des états globaux.  

### Backend :  
- **Node.js** avec **Express.js** : API RESTful.  
- **MongoDB** : Base de données pour stocker les utilisateurs, produits, commandes, etc.  
- **Stripe API** : Gestion des paiements.
