class Ingredient {
    constructor(nom) {
        this.nom = nom;
    }
}

class IngredientACuire extends Ingredient {
    constructor(nom, temps, couleur) {
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
    constructor(nom) {
        this.nom = nom;
        this.etat = 'off'
    }

    on() {
        console.log(`${this.nom} is on`);
        this.etat = 'on';
    }

    off() {
        console.log(`${this.nom} is off`);
        this.etat = 'off';
    }
}



// GRILL - BOUTONS
function handlerClicSurBouton(ev) {
    let bouton = ev.target;
    console.log(bouton)
    if (ev.target.className == 'grill_btn') {
        if (bouton.dataset.etat == 'off') {
            bouton.setAttribute('material', 'color : #2ECB2C');
            bouton.dataset.etat = 'on'

            return
        }
        else if (bouton.dataset.etat == 'on') {
            bouton.setAttribute('material', 'color : #E92323');
            bouton.dataset.etat = 'off'

            return
        }
    }
}


// FRIDGE
let handlerClickOnFridge = function (ev) {
    let porte = document.querySelector('#fridge-door');
    let tuto1 = document.querySelector('#tuto_step1');
    let tuto2 = document.querySelector('#tuto_step2');
    let tutoFridge = document.querySelector('#tuto_stepFridge');


    if (ev.target.className == 'frigo-door') {
        if (porte.dataset.etat == 'ferme') {
            if (tutoFridge.dataset.etat == 'actif') {
                tuto1.setAttribute("value", " ");
                tuto2.setAttribute("value", " ");
                porte.setAttribute('gltf-model', './assets/models/fridge/door/door-open.glb');
                porte.setAttribute('rotation', '0 90 180');
                porte.setAttribute('scale', '0.8 0.9 0.6');
                porte.dataset.etat = 'ouvert'
                tutoFridge.setAttribute('value', 'Clic une fois sur le steak pour le recuperer ! ');

                return
            }
            else {
                porte.setAttribute('gltf-model', './assets/models/fridge/door/door-open.glb');
                porte.setAttribute('rotation', '0 90 180');
                porte.setAttribute('scale', '0.8 0.9 0.6');
                porte.dataset.etat = 'ouvert'

                return
            }
        }
        if (porte.dataset.etat == 'ouvert') {

            porte.setAttribute('gltf-model', './assets/models/fridge/door/door-close.glb');
            porte.setAttribute('rotation', '0 90 180');
            porte.setAttribute('scale', '0.9 1.1 1');
            porte.dataset.etat = 'ferme'
            tutoFridge.setAttribute('value', 'Rends-toi au Grill pour faire cuire le steak !')
            tutoFridge.dataset.etat = 'inactif'
            return

        }

    }
}





// Liste des ingrédients créés
const pain = new Ingredient('pain');
const fromage = new Ingredient('fromage');
const steak = new IngredientACuire('steak', 60, '#DD3F61');
const poulet = new IngredientACuire('poulet', 40, '#DD3F61');


// Tableau des commandes faites par les clients
let commandes = [];

// Tableau des recettes que les clients peuvent commander 
let dataRecette = [
    {
        nom: 'burger boeuf', niveau: 1, ingredients: [
            pain, steak.cui(), fromage, pain
        ]
    },
    {
        nom: 'burger poulet', niveau: 1, ingredients: [
            pain, poulet.cui(), pain
        ]
    },
    {
        nom: 'double burger', niveau: 2, ingredients: [
            pain, fromage, steak.cui(), pain, steak, pain
        ]
    },
]

// Tableau contenant les 3 assiettes où l'on prépare les commandes
let assiettes = [[], [], []]

let plaques = [[], [], [], []]

let main = []


// Génére une commande aléatoire selon les recettes contenues 
// dans le tableau dataRecette et leur niveau associé.
// La commande est placé dans le tableau commandes contenant toutes les commandes

let commandeClient = function (niveauMax) {

    let index = Math.floor(Math.random() * dataRecette.length);

    while (dataRecette[index].niveau > niveauMax) {
        index = Math.floor(Math.random() * dataRecette.length);
    }

    let commande = dataRecette[index]

    commandes.push(commande)

}

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



let handlerClickOnConso = function (ev) {
    let tutoFridge = document.querySelector('#tuto_stepFridge');

    if (ev.target.className == 'consommable') {
        if (ev.target.dataset.stock == 'stock') {
            if (ev.target.dataset.id == 'steak') {
                if(tutoFridge.dataset.etat == 'actif'){
                    // Créer une copie de l'élement ingredient choisi dans le stock pour avoir une reserve infini
                    let ing = document.createElement('a-entity');
    
                    ing.setAttribute('obj-model', ev.target.getAttribute('obj-model'));
                    ing.setAttribute('position', ev.target.getAttribute('position'));
                    ing.setAttribute('rotation', ev.target.getAttribute('rotation'));
                    ing.setAttribute('scale', ev.target.getAttribute('scale'));
                    ing.setAttribute('material', ev.target.getAttribute('material'));
                    ing.classList.add('consommable');
                    ing.dataset.id = ev.target.dataset.id
                    ing.dataset.stock = 'stock'
                    tutoFridge.setAttribute('value', 'Clic de nouveau sur la porte pour fermer le frigo !');
                    tutoFridge.dataset.etat = "inactif"
                    document.querySelector('a-scene').appendChild(ing);
    
                    // S'il y a un objet dans la main le script s'arrête pour ne pas avoir plusieurs objets dans la main et créer des conflits
                    if (main.length == 1) {
                        console.log("stop")
                        return
                    }

                }
                else {
                    // Créer une copie de l'élement ingredient choisi dans le stock pour avoir une reserve infini
                    let ing = document.createElement('a-entity');
    
                    ing.setAttribute('obj-model', ev.target.getAttribute('obj-model'));
                    ing.setAttribute('position', ev.target.getAttribute('position'));
                    ing.setAttribute('rotation', ev.target.getAttribute('rotation'));
                    ing.setAttribute('scale', ev.target.getAttribute('scale'));
                    ing.setAttribute('material', ev.target.getAttribute('material'));
                    ing.classList.add('consommable');
                    ing.dataset.id = ev.target.dataset.id
                    ing.dataset.stock = 'stock'

                    document.querySelector('a-scene').appendChild(ing);
    
                    // S'il y a un objet dans la main le script s'arrête pour ne pas avoir plusieurs objets dans la main et créer des conflits
                    if (main.length == 1) {
                        console.log("stop")
                        return
                    }
                }




            }
        }

        console.log("non-stop")

        // Si la main est vide on attribue follow-hand ce qui le fait suivre la caméra
        if (main.length < 1) {
            if (ev.target.id == 'inAssiette') {
                assiettes[0] = assiettes[0].filter(ing => ing != ev.target.dataset.id)
                console.log('clic sur assiette PLEINE ')
                console.log(assiettes[0])
            };

            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                ev.target.dataset.stock = null
                ev.target.id = 'handed'

                main.push(ev.target.dataset.id)
            }
            console.log('main')
            console.log(main)
            // Arrête le script sinon la suite annulera cette action
            return
        }

        if (main.length < 1) {
            if (ev.target.id == 'inAssiette') {
                assiettes[0] = assiettes[0].filter(ing => ing != ev.target.dataset.id)
                console.log('clic sur assiette PLEINE ')
                console.log(assiettes[0])
            };

            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                ev.target.dataset.stock = null
                ev.target.id = 'handed'

                main.push(ev.target.dataset.id)
            }
            console.log('main')
            console.log(main)
            // Arrête le script sinon la suite annulera cette action
            return
        }

        // Si la main est pleine on retire follow-hand ce qui "pose" l'objet dans la main dans l'espace
        if (main.length == 1) {
            if (ev.target.hasAttribute('follow-hand')) {
                ev.target.removeAttribute('follow-hand');
                if (ev.target.id == 'handed') {
                    ev.target.id = ''
                    main.shift()
                }
            }
            console.log('main')
            console.log(main)
            return
        }


    }




}




let handlerClickOnAssiette = function (ev) {


    if (ev.target.className == 'assiette') {
        if (main.length < 1) {
            return
        }

        if (main.length == 1) {
            let objMain = document.querySelector('#handed')

            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let yObj = 1
                for (let i = 0; i < assiettes[0].length; i++) {
                    yObj += 0.05
                }
                console.log(yObj)

                let posAssiette = ev.target.getAttribute('position')

                let posObj = {
                    x: posAssiette.x,
                    y: yObj,
                    z: posAssiette.z
                }

                objMain.setAttribute('position', posObj);
                objMain.id = 'inAssiette'

                assiettes[0].push(objMain.dataset.id)
                console.log(assiettes[0])
                main.shift()
            }

            console.log('clic sur assiette VIDE')
            console.log(assiettes[0])

            return
        }
    }
}



// LISTENER SCENE

let scene = document.querySelector('a-scene');
scene.addEventListener('click', handlerClickOnConso);
scene.addEventListener('click', handlerClickOnAssiette);

// LISTENER GRILL
let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    bouton.addEventListener('click', handlerClicSurBouton);
});

// LISTENER FRIDGE
let fridge = document.querySelector('#fridge-door');
fridge.addEventListener('click', handlerClickOnFridge);
