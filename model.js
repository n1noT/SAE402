class Ingredient {
    constructor(nom) {
      this.nom = nom;
    }
}

class IngredientACuire extends Ingredient {
    constructor(nom,temps, couleur) {
        super(nom);
        this.etat = 'cru';
        this.temps = temps
        this.couleur = couleur
    }

    cui(couleur) {
        console.log(`${this.nom} est en train de cuire.`);
        this.etat = 'cuit';
        this.couleur = couleur
    }

    crame(couleur) {
        console.log(`${this.nom} est cramé !`);
        this.etat = 'crame';
        this.couleur = couleur
      }

}

class KitchenElement {
    constructor(nom){
        this.nom = nom;
        this.etat = 'off'
    }

    on(){
        console.log(`${this.nom} is on`);
        this.etat = 'on';
    }

    off(){
        console.log(`${this.nom} is off`);
        this.etat = 'off';
    }
}

class Plancha extends KitchenElement {
    constructor(nom, bouton) {
        super(nom);
        this.bouton = bouton;
    }

    // Méthode pour activer la plancha
    on() {
        super.on();
        this.bouton.forEach(id => {
            const button = document.querySelector(`#${id}`);
            if (button) {
                button.setAttribute('material', 'color', '#00FF00'); 
            }
        });
    }


    off() {
        super.off();
        this.bouton.forEach(id => {
            const button = document.querySelector(`#${id}`);
            if (button) {
                button.setAttribute('material', 'color', '#E92323'); 
            }
        });
    }
}

// Fonction pour simuler un clic sur un bouton
function cliquerSurBouton(idBouton) {
    let id =  '#' + idBouton;
    let bouton = document.querySelector(id);
    if (bouton) {
        // Change l'état du bouton
        bouton.setAttribute('material', 'color : #00FF00');
    } else {
        console.log(`Le bouton avec l'ID ${idBouton} n'existe pas.`);
    }
}

// Créer une instance de la plancha avec les ID des boutons
const plancha = new Plancha('maPlancha', ['plancha_btn1', 'plancha_btn2', 'plancha_btn3', 'plancha_btn4']);

// Appeler la méthode on() pour activer la plancha
plancha.on();

// Appeler la fonction pour simuler un clic sur un bouton




// Liste des ingrédients créés
const pain = new Ingredient('pain');
const fromage = new Ingredient('fromage');
const steak = new IngredientACuire('steak', 60, '#DD3F61');
const poulet = new IngredientACuire('poulet', 40, '#DD3F61');


// Tableau des commandes faites par les clients
let commandes = [];

// Tableau des recettes que les clients peuvent commander 
let dataRecette = [
    {nom: 'burger boeuf', niveau:1, ingredients:[
        pain, steak.cui(), pain
    ]
    },
    {nom: 'burger poulet', niveau:1, ingredients:[
        pain, poulet.cui(), pain
    ]
    },
    {nom: 'double burger', niveau:2, ingredients:[
        pain, fromage, steak.cui(), pain, steak, pain
    ]
    },
]

// Tableau contenant les 3 assiettes où l'on prépare les commandes

let assiettes = [
    {num: 1, assiette:[]},
    // {num: 2, assiette:[]},
    // {num: 3, assiette:[]},
]

// Génére une commande aléatoire selon les recettes contenues 
// dans le tableau dataRecette et leur niveau associé.
// La commande est placé dans le tableau commandes contenant toutes les commandes


let commandeClient = function(niveauMax){
 
    let index = Math.floor(Math.random() * dataRecette.length);

    while ( dataRecette[index].niveau > niveauMax){
        index = Math.floor(Math.random() * dataRecette.length);
    }
    
    let commande = dataRecette[index]

    commandes.push(commande)
    
}

commandeClient(1)

cliquerSurBouton('plancha_btn3');
