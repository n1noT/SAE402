// Tableau des commandes faites par les clients
let commandes = [];

// Tableau des recettes que les clients peuvent commander 
let dataRecette = [
    {
        nom: 'burger boeuf', niveau: 1, ingredients: [
            'pain', 'steak cuit', 'pain'
        ]
    },
    {
        nom: 'burger thon', niveau: 1, ingredients: [
            'pain', 'thon', 'pain'
        ]
    },
    {
        nom: 'cheese burger', niveau: 2, ingredients: [
            'pain', 'fromage', 'steak cuit', 'pain'
        ]
    },
    {
        nom: 'double burger', niveau: 2, ingredients: [
            'pain', 'steak cuit', 'pain', 'steak cuit', 'pain'
        ]
    },
    {
        nom: 'double cheese burger', niveau: 3, ingredients: [
            'pain', 'fromage', 'steak', 'pain', 'fromage', 'steak', 'pain'
        ]
    },
    {
        nom: 'triple burger', niveau: 3, ingredients: [
            'pain', 'fromage', 'steak', 'steak', 'steak', 'pain'
        ]
    },
];


// Tableau contenant les 3 assiettes où l'on prépare les commandes 
let assiettes = [[], [], []];

// Tableau contenant les 4 contenances des plaques de cuisson
let plaques = [[], [], [], []]

// Tableau contenant les objet dans la main
let main = [];

// variable de score
let scoreJ = 0;

let commandeEntity = function () {
    var bulle = document.createElement('a-gltf-model');
    bulle.setAttribute('src', './assets/models/cmd/Speech.glb');
    bulle.setAttribute('position', '-5.5 3.34 0');
    bulle.setAttribute('rotation', '0 90 0');
    bulle.setAttribute('scale', '2 1 1');
    bulle.id = 'bulle';

    var character = document.createElement('a-gltf-model');
    character.setAttribute('src', './assets/models/character/BeachCharacter.glb');
    character.setAttribute('position', '-5.7 -1 0');
    character.setAttribute('rotation', '0 90 0');
    character.setAttribute('scale', '2 2 2');

    var commandeEntity = document.createElement('a-entity');
    commandeEntity.setAttribute('id', 'commande');
    commandeEntity.setAttribute('position', '-5.2 3.6 1.1');
    commandeEntity.setAttribute('rotation', '0 90 0');
    commandeEntity.setAttribute('text', 'value: un burger et plus vite que ca !; color: black; width: 5; align: center');

    var valideEntity = document.createElement('a-entity');
    valideEntity.setAttribute('id', 'valide');
    valideEntity.setAttribute('position', '-5.2 4.6 -2');
    valideEntity.setAttribute('rotation', '0 90 0');
    valideEntity.setAttribute('text', 'value: ; color: black; width: 5; align: center');

    var ingredientsEntity = document.createElement('a-entity');
    ingredientsEntity.setAttribute('id', 'ingredients');
    ingredientsEntity.setAttribute('position', '0 1.9 3.3');
    ingredientsEntity.setAttribute('rotation', '0 180 0');
    ingredientsEntity.setAttribute('text', 'value: ; color: black; width: 4; align: center');

    var timerEntity = document.createElement('a-entity');
    timerEntity.setAttribute('id', 'timer');
    // timerEntity.setAttribute('position', '-5.2 3.9 1.1');
    // timerEntity.setAttribute('rotation', '0 90 0');
    // timerEntity.setAttribute('text', 'value: 10; color: black; width: 8; align: center');

    var timerControllerEntity = document.createElement('a-entity');
    timerControllerEntity.setAttribute('timer-controller', '');


    var fullCommande = document.createElement('a-entity');
    fullCommande.id = 'fullCommande'

    fullCommande.appendChild(bulle);
    fullCommande.appendChild(character);
    fullCommande.appendChild(commandeEntity);
    fullCommande.appendChild(valideEntity);
    fullCommande.appendChild(ingredientsEntity);
    fullCommande.appendChild(timerEntity);
    fullCommande.appendChild(timerControllerEntity);

    var scene = document.querySelector('a-scene');
    scene.appendChild(fullCommande);
}

// Génére une commande aléatoire selon les recettes contenues 
// dans le tableau dataRecette et leur niveau associé.
// La commande est placé dans le tableau commandes contenant toutes les commandes
let commandeClient = function (niveauMax) {

    let index = Math.floor(Math.random() * dataRecette.length);

    while (dataRecette[index].niveau > niveauMax) {
        index = Math.floor(Math.random() * dataRecette.length);
    }

    let commande = dataRecette[index];
    commandes.push(commande);

    let cmd = document.querySelector('#fullCommande')

    if (cmd) {
        cmd.remove()
        commandeEntity()
    }
    else {
        commandeEntity()
    }

}


let validerCommande = function () {
    let currentCommand = commandes[commandes.length - 1];
    let assiette = assiettes[0];
    let commande = currentCommand.ingredients

    if (assiette.length == commande.length) {
        let bool = true

        for (let i = 0; i < assiette.length; i++) {
            if (assiette[i] != commande[i]) {
                bool = false
            }
        }

        return bool
    }
    else {
        return false
    }
}


// FRIDGE
let handlerClickOnFridge = function (ev) {
    let porte = document.querySelector('#fridge-door');
    let tuto1 = document.querySelector('#tuto_step1');
    let tuto2 = document.querySelector('#tuto_step2');
    let tutoFridge = document.querySelector('#tuto_stepFridge');
    let tutoGrill = document.querySelector('#tuto_stepGrill');


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
            tutoFridge.setAttribute('value', 'Rends-toi au Grill pour faire cuire le steak !');
            tutoGrill.setAttribute('value', "Appuie sur le bouton de la plaque pour l'allumer !");
            tutoFridge.dataset.etat = 'inactif'
            return

        }

    }
}

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

// AFRAME.registerComponent('follow-hand', {
//     tick: function () {
//         // Obtenir une référence à l'entité de la caméra
//         var camera = document.getElementById('camera');
//         // Obtenir la direction dans laquelle la caméra regarde
//         var cameraDirection = new THREE.Vector3();
//         camera.object3D.getWorldDirection(cameraDirection);

//         // Définir la distance à laquelle l'entité suiveuse doit être placée devant la caméra
//         var distance = -1.5; // Distance désirée

//         // Calculer la position de l'entité suiveuse
//         var followerPosition = new THREE.Vector3();
//         followerPosition.copy(camera.object3D.position).addScaledVector(cameraDirection, distance);

//         // Mettre à jour la position de l'entité suiveuse
//         this.el.object3D.position.copy(followerPosition);


//     }
// });

AFRAME.registerComponent('follow-hand', {
    tick: function () {
        var object = this.el;
        var rightController = document.getElementById('rightController');
        var rightControllerPosition = rightController.getAttribute('position');

        object.setAttribute('position', rightControllerPosition);
    }
});

// GRILL - BOUTONS
function handlerClicSurBouton(ev) {
    let bouton = ev.target;
    let tutoGrill = document.querySelector('#tuto_stepGrill');
    console.log(bouton)

    if (ev.target.className == 'grill_btn') {
        if (bouton.dataset.etat == 'off') {
            bouton.setAttribute('material', 'color : #2ECB2C');
            bouton.dataset.etat = 'on'

            if (tutoGrill.dataset.etat == 'actif') {
                tutoGrill.setAttribute('value', "Maintenant, tu peux placer le steak sur la plaque !"
                );
            }
            return
        }
        else if (bouton.dataset.etat == 'on') {
            bouton.setAttribute('material', 'color : #E92323');
            bouton.dataset.etat = 'off'


            return
        }
    }
}


let handlerClickOnConso = function (ev) {
    let tutoFridge = document.querySelector('#tuto_stepFridge');

    if (ev.target.className == 'consommable') {
        if (ev.target.dataset.stock == 'stock') {
            if (tutoFridge.dataset.etat == 'actif') {

                tutoFridge.setAttribute('value', 'Clic de nouveau pour le fermer !');
                tutoFridge.dataset.etat = "inactif"

            }

            // Créer une copie de l'élement ingredient choisi dans le stock pour avoir une reserve infini
            let ing = document.createElement('a-entity');

            ing.setAttribute('obj-model', ev.target.getAttribute('obj-model'));
            ing.setAttribute('position', ev.target.getAttribute('position'));
            ing.setAttribute('rotation', ev.target.getAttribute('rotation'));
            ing.setAttribute('scale', ev.target.getAttribute('scale'));
            ing.setAttribute('material', ev.target.getAttribute('material'));
            ing.classList.add('consommable');
            ing.dataset.id = ev.target.dataset.id;
            ing.dataset.stock = 'stock';
            ing.dataset.tri = ev.target.dataset.tri;
            if(ev.target.dataset.id == 'thon-boite'){
                ing.dataset.state =1
            }

            document.querySelector('a-scene').appendChild(ing);

            // S'il y a un objet dans la main le script s'arrête pour ne pas avoir plusieurs objets dans la main et créer des conflits
            if (main.length == 1) {
                console.log("stop")
                return
            }


        }

        console.log("non-stop")

        // Si la main est vide on attribue follow-hand ce qui le fait suivre la caméra
        if (main.length < 1) {
            // Si un ingrédient est dans l'assiette on ne peut pas le reprendre pour ne pas créer de conflit entre le tableau asseite[i] et la vue 
            if (ev.target.id == 'inAssiette') {
                return
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


    if (ev.target.className == 'assiette' || ev.target.id == 'inAssiette') {
        if (main.length < 1) {
            return
        }

        if (main.length == 1) {
            let objMain = document.querySelector('#handed')

            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');
                console.log(assiettes[0].length)
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

let steakcuit = function (objMain) {
    objMain.setAttribute('material', 'color : #622828');
    objMain.dataset.id += " cuit"
};

let steakcrame = function (objMain) {
    objMain.setAttribute('material', 'color : #210202');
    objMain.dataset.id = "crame"
};

let handlerClickOnGrill = function (ev) {
    let btn = document.querySelectorAll('.grill_btn');
    let plaque = document.querySelectorAll('.grill');
    let tutoGrill = document.querySelector('#tuto_stepGrill');

    // Récupérer l'index de la plaque sur laquelle on a cliqué
    let plaqueIndex = Array.from(plaque).indexOf(ev.target);

    if (ev.target.className == 'grill') {
        if (main.length < 1) {
            return;
        }

        if (main.length == 1 && plaqueIndex !== -1 && btn[plaqueIndex].dataset.etat === 'on') {
            let objMain = document.querySelector('#handed');
            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let yObj = 1;
                for (let i = 0; i < plaques[0].length; i++) {
                    yObj += 0;
                }
                console.log(yObj);

                let posGrill = ev.target.getAttribute('position');

                let posObj = {
                    x: posGrill.x,
                    y: posGrill.y,
                    z: posGrill.z
                };

                objMain.setAttribute('position', posObj);
                objMain.id = 'inGrill';


                if (tutoGrill.dataset.etat == 'actif') {
                    tutoGrill.setAttribute('value', "Patiente pendant que le steak cuit... Attention a ne pas le faire bruler !");
                }
                setTimeout(function () {

                    if (tutoGrill.dataset.etat == 'actif') {
                        tutoGrill.setAttribute('value', "Appuie sur le bouton pour eteindre la plaque et dirige-toi vers le plan de travail !");
                    }
                    let objCuit = objMain;
                    steakcuit(objCuit);
                }, 5000);


                setTimeout(function () {

                    if (objMain.id === 'inGrill') {
                        let objCrame = objMain;
                        steakcrame(objCrame);
                        steakcrame(objCrame);

                        // mise a jour du score et affichage
                        scoreJ = scoreJ - 25;
                        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
                    }
                }, 10000);

                plaques[0].push(objMain.dataset.id);
                console.log(plaques[0]);

                main.shift();
            }
            console.log(objMain.dataset.id)
            console.log('clic sur plaque VIDE');
            console.log(plaques[0]);
            return;
        }
    }
};

function handlerClickOnEmptyBtn(ev) {
    if (ev.target.id == 'btn_empty_plate') {
        if (assiettes[0].length < 1) {
            return

        }
        else {
            let allIngInAssiette = document.querySelectorAll("#inAssiette")
            let allIngInEmpty = document.querySelectorAll("#emptyAssiette")

            // Récupére tous les ingrédients dans l'assiette et en dehors
            let allIng = [...allIngInAssiette, ...allIngInEmpty]

            allIng.sort()

            let yObj = 1.4
            let posBtn = ev.target.getAttribute('position')

            // Vide le tableau des ingrédients dans assiette
            for (let ing of allIng) {

                let posObj = {
                    x: posBtn.x,
                    y: yObj,
                    z: posBtn.z
                }

                yObj += 0.2

                ing.id = 'emptyAssiette'
                ing.setAttribute('position', posObj)
            }

            // Vide le tableau des ingrédients dans assiette
            while (assiettes[0].length > 0) {
                assiettes[0].pop();
            }


        }
    }
}

AFRAME.registerComponent('timer-controller', {
    init: function () {


        var timerEntity = document.getElementById('hud_timer');
        var bulle = document.getElementById('bulle');
        var commandeEntity = document.getElementById('commande');
        var ingredientsEntity = document.getElementById('ingredients');

        // Initialisez le timer à 100 secondes
        var timerValue = 100;

        // récupère la liste des ingrédients requis pour la recette
        var ingredients = commandes[commandes.length - 1].ingredients;
        // Affiche les ingrédients en colonne
        var ingredientsText = ingredients.join('\n');

        // Met à jour le timer chaque seconde
        this.interval = setInterval(function () {
            if (timerValue > 0) {
                commandeEntity.setAttribute('text', 'value', `Je voudrais un ${commandes[commandes.length - 1].nom} !`);
                ingredientsEntity.setAttribute('text', 'value', ingredientsText)
                timerValue--;
            }

            // Met à jour le texte du timer
            timerEntity.setAttribute('text', 'value', timerValue);

            if (timerValue === 0) {
                //mettre a jour le score et l'afficher
                scoreJ = scoreJ - 50;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

                commandeEntity.setAttribute('text', 'value', 'Dommage, je me casse !');

                timerEntity.setAttribute('text', 'color', 'red');
                timerEntity.setAttribute('text', 'value', '0');

                commandeClient(2)
                clearInterval(this.interval)
            }
        }, 1000);
    },

    // Assurez-vous de nettoyer l'intervalle lors de la suppression du composant
    remove: function () {
        clearInterval(this.interval);
    },
});

function handlerClickOnBell(ev) {
    if (ev.target.id == 'bell_validate') {
        if (assiettes[0].length < 1) {
            return

        }
        else {
            var commandeEntity = document.getElementById('valide');
            let assiette = document.querySelectorAll('#inAssiette')

            if (validerCommande() == true) {
                // calcul des points par rapport au niveau de la commande
                scoreJ += 100*commandes[commandes.length - 1].niveau;
                //mettre a jour le score et l'afficher
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

                commandeEntity.setAttribute('text', 'value', 'commande VALIDE')
                // commandeEntity.setAttribute('text', 'color', '0x00ffff')
                for (let ing of assiette) {
                    ing.remove()
                }

                while (assiettes[0].length > 0) {
                    assiettes[0].pop();
                }

                console.log(commandes)

                while (commandes.length > 0) {
                    commandes.pop()
                }

                console.log(commandes)
                commandeClient(2)
                console.log(commandes)

            }
            else {
                //mettre a jour le score et l'afficher
                scoreJ = scoreJ - 50;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

                commandeEntity.setAttribute('text', 'value', 'commande INVALIDE')
                // commandeEntity.setAttribute('text', 'color', '0xff00')

                for (let ing of assiette) {
                    ing.remove()
                }

                while (assiettes[0].length > 0) {
                    assiettes[0].pop();
                }


                console.log(commandes)

                commandes.pop()
                console.log(commandes[0])
                commandeClient(1)
                console.log(commandes)
            }

        }
    }
}

function handlerClickOnStart(ev) {
    if (ev.target.id == 'start') {
        commandeClient(2);
        let tuto1 = document.querySelector('#tuto_step1')
        tuto1.setAttribute('value', 'Ton premier client est arrive, prepare sa commande !')

        let tuto2 = document.querySelector('#tuto_step2')
        tuto2.setAttribute('value', 'Il desire un burger. Pour commencer, recupere un steak dans le frigo !')

        let start = document.querySelectorAll('#start');
        start.forEach(elt => {
            elt.remove();
        });
    }
}

function handlerClickOnCompost() {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "compost") {
        hand.remove();
        main.pop();
        console.log(main)
    }
}

function handlerClickOnRecycle() {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "recycle") {
        hand.remove();
        main.pop();
        console.log(main)
    }
}

function handlerClickOnThon(ev) {
    if(main[0] == 'can-opener'){
        if (ev.target.dataset.id == "thon-boite") {
            if (ev.target.dataset.state == 1) {
                
                ev.target.dataset.state = 0
                console.log(ev.target.dataset.state)

                var thon = document.createElement('a-entity');
                thon.setAttribute('obj-model', 'obj: ./assets/models/ingredients/base.obj;');
                thon.setAttribute('position', ev.target.getAttribute('position'));
                thon.setAttribute('rotation', '0 180 0');
                thon.setAttribute('scale', '1 1 1');
                thon.setAttribute('material', 'color: #FFECE4;');
                thon.setAttribute('class', 'consommable');
                thon.setAttribute('data-id', 'thon');
                thon.setAttribute('data-stock', '');
                thon.setAttribute('data-tri', 'compost');

                var scene = document.querySelector('a-scene');
                scene.appendChild(thon);
            }
        }
    }
}
        

// Affichage du score en HUD
let scoreJoueur = document.querySelector('#hud_scorej');
scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

let fridge = document.querySelector('#fridge-door');
fridge.addEventListener('click', handlerClickOnFridge);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnFridge);

let start = document.querySelectorAll('#start');
start.forEach(bouton => {
    bouton.addEventListener('click', handlerClickOnStart);
    document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnStart);
});


let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    bouton.addEventListener('click', handlerClicSurBouton);
    document.querySelector('#rightController').addEventListener('triggerdown', handlerClicSurBouton);
});

let emptyBtn = document.querySelector('#btn_empty_plate');
emptyBtn.addEventListener('click', handlerClickOnEmptyBtn);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnEmptyBtn);

let putCompost = document.querySelector('#compost_bin');
putCompost.addEventListener('click', handlerClickOnCompost);
putCompost.addEventListener('triggerdown', handlerClickOnCompost);



let putRecycle = document.querySelector('#recycle_bin');
putRecycle.addEventListener('click', handlerClickOnRecycle);
putRecycle.addEventListener('triggerdown', handlerClickOnRecycle);



let validBell = document.querySelector('#bell_validate');
validBell.addEventListener('click', handlerClickOnBell);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnBell);

let scene = document.querySelector('a-scene');
scene.addEventListener('click', handlerClickOnConso);
scene.addEventListener('click', handlerClickOnThon);
scene.addEventListener('click', handlerClickOnAssiette);
scene.addEventListener('click', handlerClickOnGrill);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnConso);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnThon);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnAssiette);
document.querySelector('#rightController').addEventListener('triggerdown', handlerClickOnGrill);

