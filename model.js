class Ingredient {
    constructor(nom, tri) {
      this.nom = nom;
      this.tri = tri
    }
}

class IngredientACuire extends Ingredient {
    constructor(nom, tri, temps, couleur) {
        super(nom, tri);
        
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
const pain = new Ingredient('pain', 'compost');
const fromage = new Ingredient('fromage', 'compost');
const steak = new IngredientACuire('steak', 'compost', 60, '#DD3F61');
const steakCuit = new IngredientACuire('steak',  'compost', 60, '#DD3F61');
steakCuit.cui('#DFFFF01')
const pouletCuit = new IngredientACuire('steak', 'compost', 60, '#DD3F61');
pouletCuit.cui('#DFFFF01')


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

let main = []

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



let handlerClickOnFridge = function(ev){
    let porte = document.querySelector('#fridge-door')
    
   if(ev.target.className == 'frigo-door'){
        if(porte.dataset.etat == 'ouvert'){
            porte.setAttribute('gltf-model','./assets/models/fridge/door/door-open.glb');
            porte.setAttribute('rotation','0 90 180');
            porte.setAttribute('scale','0.8 0.9 0.6');
            porte.dataset.etat = 'ferme'
        
            return
        }
        if(porte.dataset.etat == 'ferme'){
            porte.setAttribute('gltf-model','./assets/models/fridge/door/door-close.glb');
            porte.setAttribute('rotation','0 90 180');
            porte.setAttribute('scale','0.9 1.1 1');
            porte.dataset.etat = 'ouvert'
            
            return
        }

   }
}



let testFridge = document.querySelector('#fridge-door');
testFridge.addEventListener('click', handlerClickOnFridge);

 // Fonction pour mettre à jour la position de l'entité "follower" à une distance fixe de la caméra
 function updateFollowerPosition(toFollow) {
    // Obtenir une référence à l'entité de la caméra
    var camera = document.getElementById('camera');
    // Obtenir la position de la caméra
    var cameraPosition = camera.getAttribute('position');
    
    // Définir la position de l'entité suiveuse à une distance fixe de la caméra
    var distance = 1; // Distance désirée
    var followerPosition = {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z - distance // Ajustez cette valeur pour changer la distance
    };
    
    // Mettre à jour la position de l'entité suiveuse
    var follower = document.getElementById(toFollow);
    follower.setAttribute('position', followerPosition);
  }

  
  AFRAME.registerComponent('follow-hand', {
    tick: function () {
      // Obtenir une référence à l'entité de la caméra
      var camera = document.getElementById('camera');
      // Obtenir la direction dans laquelle la caméra regarde
      var cameraDirection = new THREE.Vector3();
      camera.object3D.getWorldDirection(cameraDirection);
      
      // Définir la distance à laquelle l'entité suiveuse doit être placée devant la caméra
      var distance = -1.5; // Distance désirée
      
      // Calculer la position de l'entité suiveuse
      var followerPosition = new THREE.Vector3();
      followerPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);
      
      // Mettre à jour la position de l'entité suiveuse
      this.el.object3D.position.copy(followerPosition);


    }
  });
  
 


let handlerClickOnConso = function(ev){
 
    if(ev.target.className == 'consommable'){
        if(ev.target.dataset.stock == 'stock'){
            // Créer une copie de l'élement ingredient choisi dans le stock pour avoir une reserve infini
            let ing = document.createElement('a-entity');
    
            ing.setAttribute('obj-model', ev.target.getAttribute('obj-model'));
            ing.setAttribute('position', ev.target.getAttribute('position'));
            ing.setAttribute('rotation',  ev.target.getAttribute('rotation'));
            ing.setAttribute('scale',  ev.target.getAttribute('scale'));
            ing.setAttribute('material',  ev.target.getAttribute('material'));
            ing.classList.add('consommable');
            ing.entity = ev.target.id
            ing.dataset.stock = 'stock'

            document.querySelector('a-scene').appendChild(ing);

            // S'il y a un objet dans la main le script s'arrête pour ne pas avoir plusieurs objets dans la main et créer des conflits
            if(main.length == 1){
                console.log("stop")
                return
            }
        }

        console.log("non-stop")

        // Si la main est vide on attribue follow-hand ce qui le fait suivre la caméra
        if(main.length < 1){
            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                ev.target.dataset.stock = null
              }
              main.push(ev.target.id)
              console.log(main.length)
              // Arrête le script sinon la suite annulera cette action
              return
        }

        // Si la main est pleine on retire follow-hand ce qui "pose" l'objet dans la main dans l'espace
        if(main.length == 1){
            if (ev.target.hasAttribute('follow-hand')) {
                ev.target.removeAttribute('follow-hand');
                
              }
              main.shift()
              console.log(main)
              return
        }
    }

    
    
    
}



let scene = document.querySelector('a-scene');
scene.addEventListener('click', handlerClickOnConso);






  
