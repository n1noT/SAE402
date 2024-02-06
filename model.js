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


// Liste des ingrédients créés
const pain = new Ingredient('pain');
const fromage = new Ingredient('fromage');
const steak = new IngredientACuire('steak', 60, '#DD3F61');
const steakCuit = new IngredientACuire('steak', 60, '#DD3F61');
steakCuit.cui('#DFFFF01')
const pouletCuit = new IngredientACuire('steak', 60, '#DD3F61');
pouletCuit.cui('#DFFFF01')

console.log(steak.cui('#DDFGD0'));
// Tableau des commandes faites par les clients
let commandes = [];

// Tableau des recettes que les clients peuvent commander 
let dataRecette = [
    {nom: 'burger boeuf', niveau:1, ingredients:[
        pain, steakCuit, pain
    ]
    },
    {nom: 'burger poulet', niveau:1, ingredients:[
        pain, pouletCuit, pain
    ]
    },
    {nom: 'double burger', niveau:2, ingredients:[
        pain, fromage, steak, pain, steak, pain
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

console.log(commandes)
  


