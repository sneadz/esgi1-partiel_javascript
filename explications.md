## Vue d'ensemble

Ce fichier JavaScript gère une application web qui affiche des produits anti-gaspi. Il interagit avec une API pour récupérer et afficher des données de manière dynamique.

## Configuration de l'API

```javascript
const API_BASE = 'http://localhost:3004';
const ENDPOINT = '/antigaspi';
const API_URL  = `${API_BASE}${ENDPOINT}`;
```

**Pourquoi cette approche ?**
- Séparation des préoccupations : l'URL de base et l'endpoint sont séparés pour faciliter la maintenance
- Réutilisabilité : `API_BASE` peut être facilement modifié pour changer d'environnement (dev, prod, etc.)
- Lisibilité : l'URL complète est construite de manière explicite

## Exercice 1 : Compteur de produits anti-gaspi

### Fonction `productLeft()`

```javascript
async function productLeft() {
    const res   = await fetch(`${API_URL}`);
    const json  = await res.json();
    return json['waste-count'];
}
```

**Manipulations effectuées :**
- Utilisation de `async/await` pour une gestion asynchrone propre
- Appel à l'API avec `fetch()`
- Parsing de la réponse JSON
- Extraction de la propriété `waste-count`

**Pourquoi async/await ?**
- Plus lisible que les promesses avec `.then()`
- Gestion d'erreur plus simple avec `try/catch`
- Code plus séquentiel et facile à comprendre

### Affichage du compteur

```javascript
productLeft()
    .then(count => {
        document.getElementById('gaspi-count').textContent = count;
    })
```

**Manipulations effectuées :**
- Récupération de l'élément DOM par son ID
- Modification du contenu textuel avec `textContent`

**Pourquoi `textContent` et non `innerHTML` ?**
- Sécurité : évite les injections XSS
- Performance : plus rapide pour du texte simple
- Sémantique : plus approprié pour du contenu textuel

## Exercice 2 : Affichage des produits anti-gaspi

### Fonction `displayProducts()`

```javascript
function displayProducts() {
    fetch(`${API_URL}`)
        .then(res  => res.json())
        .then(data => {
            const receipes = data['waste-receipes'];
            const gaspiList   = document.getElementById('gaspi-list');

            gaspiList.innerHTML = '';

            receipes.forEach(({ title, description }) => {
                createLi(gaspiList, title, description);
            });
        })
        .catch(console.error);
}
```

**Manipulations effectuées :**
- Récupération des données de l'API
- Extraction du tableau `waste-receipes`
- Vidage de la liste existante
- Itération sur chaque recette avec `forEach()`
- Utilisation de la déstructuration pour extraire `title` et `description`

**Pourquoi `innerHTML = ''` ?**
- Méthode rapide pour vider un conteneur
- Plus efficace que de supprimer chaque enfant individuellement

**Pourquoi la déstructuration ?**
- Code plus concis et lisible
- Évite les répétitions de `receipe.title`, `receipe.description`

## Exercice 3 : Affichage des catégories

### Fonction `productCategories()`

```javascript
function productCategories() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const categories = Array.isArray(data.categories) ? data.categories : [];

            const ul = document.getElementById('cat-tags');
            ul.innerHTML = '';

            categories.forEach(category => {
                const li = document.createElement('li');
                li.classList.add('tag');
                li.addEventListener('click', displayCategories)
                li.textContent = category;
                ul.appendChild(li);
            });
        })
        .catch(console.error);
}
```

**Manipulations effectuées :**
- Vérification que `data.categories` est bien un tableau
- Création dynamique d'éléments `<li>`
- Ajout de la classe CSS `tag`
- Attachement d'un événement de clic
- Ajout des éléments au DOM

**Pourquoi `Array.isArray()` ?**
- Défensive programming : évite les erreurs si l'API retourne des données inattendues
- Robustesse : l'application ne plante pas si les catégories sont manquantes

**Pourquoi `addEventListener` ?**
- Séparation des préoccupations : logique d'événement séparée du HTML
- Flexibilité : permet d'ajouter/supprimer des événements dynamiquement

## Exercice 4 : Filtrage par catégorie

### Fonction `displayCategories()`

```javascript
function displayCategories(event) {
    const categoryInfo = event.currentTarget.textContent.trim();

    const categoryList = document.getElementById('categorie-list');
    categoryList.innerHTML = '';
    console.log(categoryInfo);

    fetch(`${API_BASE}/${encodeURIComponent(categoryInfo)}`)
        .then(res => res.json())
        .then((products) => {
            products.forEach(({ title, description }) => {
                createLi(categoryList, title, description);
            });
        })
}
```

**Manipulations effectuées :**
- Récupération du texte de l'élément cliqué
- Nettoyage avec `trim()` pour enlever les espaces
- Encodage de l'URL avec `encodeURIComponent()`
- Construction d'une nouvelle URL pour l'API
- Affichage des produits filtrés

**Pourquoi `event.currentTarget` ?**
- Plus sûr que `event.target` : pointe toujours vers l'élément qui a l'événement attaché
- Évite les problèmes si l'élément a des enfants

**Pourquoi `encodeURIComponent()` ?**
- Sécurité : évite les injections dans l'URL
- Conformité : encode correctement les caractères spéciaux pour les URLs

## Exercice 5 : Fonction utilitaire

### Fonction `createLi()`

```javascript
function createLi(ul, title, description) {
    const li = document.createElement('li');
    const liTitle = document.createElement('h3');
    const liText = document.createElement('p');
    const liButton = document.createElement('button');
    liTitle.textContent = title;
    liText.textContent = description;
    liButton.textContent = 'Acheter';

    li.appendChild(liTitle);
    li.appendChild(liText);
    li.appendChild(liButton);
    ul.appendChild(li);
}
```

**Manipulations effectuées :**
- Création d'éléments DOM avec `createElement()`
- Structure HTML : `<li><h3><p><button>`
- Assemblage des éléments avec `appendChild()`

**Pourquoi cette fonction utilitaire ?**
- DRY (Don't Repeat Yourself) : évite la duplication de code
- Réutilisabilité : utilisée dans plusieurs endroits
- Maintenance : modification centralisée de la structure des éléments

## Initialisation de l'application

```javascript
document.addEventListener('DOMContentLoaded', displayProducts);
document.addEventListener('DOMContentLoaded', productCategories);
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('categorie-list').innerHTML = '';
});
```

**Manipulations effectuées :**
- Attente du chargement complet du DOM
- Exécution séquentielle des fonctions d'initialisation
- Nettoyage de la liste des catégories

**Pourquoi `DOMContentLoaded` ?**
- Garantit que le DOM est prêt avant d'exécuter le JavaScript
- Évite les erreurs de sélection d'éléments inexistants
- Meilleure performance que `window.onload`

## Choix d'architecture

### Gestion asynchrone
- **Promesses** : pour de simples opérations chaînées
- **Async/await** : pour les fonctions complexes nécessitant une gestion d'erreur

### Manipulation du DOM
- **Sélection par ID** : pour les éléments uniques et fréquemment utilisés
- **Création d'éléments** : plutôt que `innerHTML` pour plus de contrôle
- **Classes CSS** : pour le styling et l'identification des éléments

### Gestion d'erreurs
- **Console.error** : pour le débogage en développement
- **Vérifications défensives** : pour éviter les plantages

### Structure du code
- **Fonctions pures** : séparation claire des responsabilités
- **Commentaires explicatifs** : pour la maintenance et la compréhension
- **Nommage explicite** : variables et fonctions auto-documentées 