// configuration de l'api
const API_BASE = 'http://localhost:3004';
const ENDPOINT = '/antigaspi';
const API_URL  = `${API_BASE}${ENDPOINT}`;

// récupère le nombre total de produits anti-gaspi
async function productLeft() {
	const res   = await fetch(`${API_URL}`);
	const json  = await res.json();
	return json['waste-count'];
}

/**
 * Exercice 1 - nombre de produits anti-gaspi
 * fonction productLeft qui retourne le nombre de produits mis en valeurs
 */

// affiche le compteur de produits anti-gaspi dans l'interface
productLeft()
	.then(count => {
		document.getElementById('gaspi-count').textContent = count;
	})

/**
 * Exercice 2 - afficher les produits anti-gaspi
 * fonction displayProduct qui affiche les produits anti-gaspi dans le tableau de l'api
 */

// affiche tous les produits anti-gaspi dans la liste principale
function displayProducts() {
	fetch(`${API_URL}`)
		.then(res  => res.json())
		.then(data => {
			const receipes = data['waste-receipes'];
			const gaspiList   = document.getElementById('gaspi-list');

			// vide la liste avant d'ajouter les nouveaux éléments
			gaspiList.innerHTML = '';

			// crée un élément de liste pour chaque recette
			receipes.forEach(({ title, description }) => {
				createLi(gaspiList, title, description);
			});
		})
		.catch(console.error);
}

/**
 * Exercice 3 - les catégories de produit
 * fonction productCategories qui renvoie toutes les catégories de l'api dans les li demandées
 */

// affiche toutes les catégories disponibles sous forme de tags cliquables
function productCategories() {
	fetch(API_URL)
		.then(res => res.json())
		.then(data => {
			// vérifie que les catégories existent et sont un tableau
			const categories = Array.isArray(data.categories) ? data.categories : [];

			const ul = document.getElementById('cat-tags');
			// vide la liste des catégories
			ul.innerHTML = '';

			// crée un tag cliquable pour chaque catégorie
			categories.forEach(category => {
				const li = document.createElement('li');
				li.classList.add('tag');
				// ajoute un événement de clic pour filtrer par catégorie
				li.addEventListener('click', displayCategories)
				li.textContent = category;
				ul.appendChild(li);
			});
		})
		.catch(console.error);
}

/**
 * Exercice 4 - Afficher les produits d'une catégorie
 * fonction displayCategories, qui permet d'afficher les bon produit en fonction de la catégorie sélectionnée
 */

// filtre et affiche les produits d'une catégorie spécifique
function displayCategories(event) {
	const categoryInfo = event.currentTarget.textContent.trim();

	const categoryList = document.getElementById('categorie-list');
	// vide la liste avant d'afficher les produits filtrés
	categoryList.innerHTML = '';
	console.log(categoryInfo);

	// récupère les produits de la catégorie sélectionnée
	fetch(`${API_BASE}/${encodeURIComponent(categoryInfo)}`)
		.then(res => res.json())
		.then((products) => {
			// crée un élément de liste pour chaque produit de la catégorie
			products.forEach(({ title, description }) => {
				createLi(categoryList, title, description);
			});
		})
}

/**
 * Exercice 5 - Faire disparaitre un produit
 * todo
 */

/**
 * Fonction createdLi qui construit les listes d'affichage des produits qui se répètent dans le code
 *
 */

// fonction utilitaire pour créer un élément de liste avec titre, description et bouton
function createLi(ul, title, description) {
	const li = document.createElement('li');
	const liTitle = document.createElement('h3');
	const liText = document.createElement('p');
	const liButton = document.createElement('button');
	liTitle.textContent = title;
	liText.textContent = description;
	liButton.textContent = 'Acheter';

	// assemble les éléments dans l'ordre
	li.appendChild(liTitle);
	li.appendChild(liText);
	li.appendChild(liButton);
	ul.appendChild(li);
}

// initialisation de l'application au chargement de la page
document.addEventListener('DOMContentLoaded', displayProducts);
document.addEventListener('DOMContentLoaded', productCategories);
document.addEventListener('DOMContentLoaded', () => {
	// vide la liste des catégories au démarrage
	document.getElementById('categorie-list').innerHTML = '';
});