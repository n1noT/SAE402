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
let plaques = [[], [], [], []];

// Tableau contenant la contenance du plateau
let plateau = [];

let table = [];

let containerOB = [];

// Tableau contenant les objet dans la main
let main = [];

// variable de score
let scoreJ = 0;

let commandeEntity = function () {
    var bulle = document.createElement('a-gltf-model');
    bulle.setAttribute('src', '../assets/models/cmd/Speech.glb');
    bulle.setAttribute('position', '-5.5 3.34 0');
    bulle.setAttribute('rotation', '0 90 0');
    bulle.setAttribute('scale', '2 1 1');
    bulle.id = 'bulle';

    var character = document.createElement('a-gltf-model');
    character.setAttribute('src', '../assets/models/character/BeachCharacter.glb');
    character.setAttribute('position', '-5.7 -1 0');
    character.setAttribute('rotation', '0 90 0');
    character.setAttribute('scale', '2 2 2');

    var commandeEntity = document.createElement('a-entity');
    commandeEntity.setAttribute('id', 'commande');
    commandeEntity.setAttribute('position', '-5.2 3.6 1.1');
    commandeEntity.setAttribute('rotation', '0 90 0');
    commandeEntity.setAttribute('text', 'value: Bonjour !; color: black; width: 5; align: center');

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

// Perte de point lorsque la porte du frigo est ouverte
let lowerFridgeScore = function () {
    let porte = document.querySelector('#fridge-door');
    if (porte.dataset.etat == 'ouvert') {
        scoreJ -= 1;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
    }
}
var intervalID = setInterval(lowerFridgeScore, 1000);

// FRIDGE
let handlerClickOnFridge = function (ev) {
    let porte = document.querySelector('#fridge-door');



    if (ev.target.className == 'frigo-door') {
        if (porte.dataset.etat == 'ferme') {

            porte.setAttribute('gltf-model', '../assets/models/fridge/door/door-open.glb');
            porte.setAttribute('rotation', '0 90 180');
            porte.setAttribute('scale', '0.8 0.9 0.6');
            porte.dataset.etat = 'ouvert'

            return
        }
    }
    if (porte.dataset.etat == 'ouvert') {
        porte.setAttribute('gltf-model', '../assets/models/fridge/door/door-close.glb');
        porte.setAttribute('rotation', '0 90 180');
        porte.setAttribute('scale', '0.9 1.1 1');
        porte.dataset.etat = 'ferme'

        return

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


// Perte de point lorsque la plaque est allumé
let lowerGrillScore = function () {
    let grill = document.querySelectorAll('.grill_btn');
    for (let btn of grill) {
        if (btn.dataset.etat == 'on') {
            scoreJ -= 1;
            scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
        }
    }
}
var intervalID = setInterval(lowerGrillScore, 1000);

// GRILL - BOUTONS
function handlerClicSurBouton(ev) {
    let bouton = ev.target;

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


let handlerClickOnConso = function (ev) {
    if (ev.target.className == 'consommable') {
        // Si la main est vide on attribue follow-hand ce qui le fait suivre la caméra
        if (main.length < 1) {
            if (ev.target.dataset.stock == 'stock') {

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
                if (ev.target.dataset.id == 'thon-boite') {
                    ing.dataset.state = 1
                }

                document.querySelector('a-scene').appendChild(ing);

            }
            // Si un ingrédient est dans l'assiette on ne peut pas le reprendre pour ne pas créer de conflit entre le tableau asseite[i] et la vue 
            if (ev.target.id == 'inAssiette') {
                return
            };
            if (ev.target.id == 'inPlate') {
                plateau = plateau.filter(obj => obj.x !== ev.target.getAttribute('position').x);

            }
            if (ev.target.id == 'inTable') {
                table = table.filter(obj => obj.z !== ev.target.getAttribute('position').z);

            }

            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                ev.target.dataset.stock = null
                ev.target.id = 'handed'

                main.push(ev.target.dataset.id)
            }

            // Arrête le script sinon la suite annulera cette action
            return
        }

     
    }
    else{
        if (main.length == 1) {
            if (ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'fridge' && main[0] != 'pain') {
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    main.shift()
                    return
                
            }
            if(ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'shelf' && main[0] == 'pain'){
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    main.shift()
                    return
                
            }
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
                let yObj = 1
                for (let i = 0; i < assiettes[0].length; i++) {
                    yObj += 0.05
                }


                let posAssiette = ev.target.getAttribute('position')

                let posObj = {
                    x: posAssiette.x,
                    y: yObj,
                    z: posAssiette.z
                }

                objMain.setAttribute('position', posObj);
                objMain.id = 'inAssiette'

                assiettes[0].push(objMain.dataset.id)

                main.shift()
            }

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

                let posGrill = ev.target.getAttribute('position');

                let posObj = {
                    x: posGrill.x,
                    y: posGrill.y,
                    z: posGrill.z
                };

                objMain.setAttribute('position', posObj);
                objMain.id = 'inGrill';

                setTimeout(function () {
                    if (objMain.id === 'inGrill') {
                        let objCuit = objMain;
                        steakcuit(objCuit);
                    }
                }, 5000);


                setTimeout(function () {

                    if (objMain.id === 'inGrill') {
                        let objCrame = objMain;
                        steakcrame(objCrame);
                        steakcrame(objCrame);

                        // mise a jour du score et affichage
                        scoreJ = scoreJ - 50;
                        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
                    }
                }, 10000);

                plaques[0].push(objMain.dataset.id);


                main.shift();
            }

            return;
        }
    }
};


let handlerClickOnPlate = function (ev) {
    if (ev.target.className == 'plateau' || ev.target.id == 'inPlate') {
        // Récupérer l'élément plateau
        let plate = document.querySelector('.plateau');

        if (main.length < 1) {
            return;
        }

        if (plateau.length < 2) {
            let objMain = document.querySelector('#handed');
            if (objMain.dataset.id == 'steak' || objMain.dataset.id == 'steak cuit') {
                if (objMain.hasAttribute('follow-hand')) {
                    objMain.removeAttribute('follow-hand');

                    let posPlate = plate.getAttribute('position');

                    if (plateau.length == 0 || plateau[0].x == posPlate.x + 0.2) {
                        let posObj = {
                            x: posPlate.x - 0.15,
                            y: posPlate.y + 0.02,
                            z: posPlate.z
                        };

                        objMain.setAttribute('position', posObj);
                    }

                    else {
                        let posObj = {
                            x: posPlate.x + 0.2,
                            y: posPlate.y + 0.02,
                            z: posPlate.z
                        };

                        objMain.setAttribute('position', posObj);
                    }

                }

                // Ajouter la position de l'objet principal dans le tableau plateau
                plateau.push(objMain.getAttribute('position'));


                objMain.id = 'inPlate';
                main.shift();
                return
            }

        }

    }

}



let handlerClickOnContainerOB = function (ev) {
    if (ev.target.className == 'containerO-B' || ev.target.id == 'inContainer') {
        if (main[0] == "can-opener") {
            if (main.length < 1) {
                return
            }

            if (main.length == 1) {
                let objMain = document.querySelector('#handed')

                if (objMain.hasAttribute('follow-hand')) {
                    objMain.removeAttribute('follow-hand');

                    let posObj = {
                        x: 0,
                        y: 2.2,
                        z: -3.5
                    }

                    objMain.setAttribute('position', posObj);
                    objMain.id = 'inContainer'

                    containerOB.push(objMain.dataset.id)

                    main.shift()
                }

                return
            }
        }

    }
}


let handlerClickOnTable = function (ev) {

    if (ev.target.className == 'containerTable' || ev.target.id == 'inTable') {
        // Récupérer l'élément plateau
        let containerTable = document.querySelector('.containerTable');

        if (main.length < 1) {
            return;
        }

        if (table.length < 2 && main[0] != "can-opener") {
            let objMain = document.querySelector('#handed');
            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let posTbl = containerTable.getAttribute('position');

                if (table.length == 0 || table[0].z == posTbl.z + 0.45) {
                    let posObj = {
                        x: posTbl.x,
                        y: posTbl.y + 0.05,
                        z: posTbl.z - 0.15
                    };

                    objMain.setAttribute('position', posObj);
                }

                else {
                    let posObj = {
                        x: posTbl.x,
                        y: posTbl.y + 0.05,
                        z: posTbl.z + 0.45
                    };

                    objMain.setAttribute('position', posObj);
                }

            }

            // Ajouter la position de l'objet principal dans le tableau plateau
            table.push(objMain.getAttribute('position'));


            objMain.id = 'inTable';
            main.shift();
            return
        }
    }
}


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


let starsLeft = 3;

function loseStar() {
    if (starsLeft > 1) {
        const starElement = document.getElementById(`star${starsLeft}`);
        starElement.setAttribute('material', 'color', '#808080');
        starsLeft--;

    }
    else if (starsLeft == 1) {
        const starElement = document.getElementById(`star${starsLeft}`);
        starElement.setAttribute('material', 'color', '#808080');
        resetGame();
    }
}

let resetGame = function () {
    scoreJ = 0;
    scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
    // Vide le tableau des ingrédients dans assiette
    while (assiettes[0].length > 0) {
        assiettes[0].pop();
    };
    // vider la main
    while (main.length > 0) {
        main.pop();
    };
}



AFRAME.registerComponent('timer-controller', {
    init: function () {


        var timerEntity = document.getElementById('timer');
        var commandeEntity = document.getElementById('commande');
        var ingredientsEntity = document.getElementById('ingredients');

        // Initialisez le timer à 60 secondes
        var timerValue = 60;

        // récupère la liste des ingrédients requis pour la recette
        var ingredients = commandes[commandes.length - 1].ingredients;
        // Affiche les ingrédients en colonne
        var ingredientsText = ingredients.join('\n');

        // Met à jour le timer chaque seconde
        this.interval = setInterval(function () {
            // Met à jour le texte du timer
            timerEntity.setAttribute('text', 'value', timerValue);
            ingredientsEntity.setAttribute('text', 'value', ingredientsText)

            // si le timer est au dessus de 9
            if (timerValue > 9) {
                commandeEntity.setAttribute('text', 'value', `Je voudrais un ${commandes[commandes.length - 1].nom} !`);
                timerEntity.setAttribute('text', 'color', 'white');
            }

            // si le timer passe en dessous de 10
            if (timerValue < 10) {
                timerEntity.setAttribute('text', 'color', 'red');
            }

            // si le timer arrive a 0
            if (timerValue === 0) {
                commandeEntity.setAttribute('text', 'value', 'Dommage, je me casse !');

                loseStar();
                // mettre a jour le score et l'afficher
                scoreJ = scoreJ - 100;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);



                // TODO difficulté en fonction du score !



                // génere la prochaine commande
                commandeClient(2)
                clearInterval(this.interval)
            }

            timerValue--;
        }, 1000);
    },

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
                scoreJ += 100 * commandes[commandes.length - 1].niveau;
                //mettre a jour le score et l'afficher
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

                commandeEntity.setAttribute('text', 'value', 'commande VALIDE')
                for (let ing of assiette) {
                    ing.remove()
                }

                while (assiettes[0].length > 0) {
                    assiettes[0].pop();
                }


                while (commandes.length > 0) {
                    commandes.pop()
                }

                commandeClient(2)


            }
            else {
                // mettre a jour le score et l'afficher
                scoreJ = scoreJ - 100;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

                commandeEntity.setAttribute('text', 'value', 'commande INVALIDE')

                for (let ing of assiette) {
                    ing.remove()
                }

                while (assiettes[0].length > 0) {
                    assiettes[0].pop();
                }

                commandes.pop()

                commandeClient(1)

                // Perte d'une étoile
                loseStar()

                return
            }

        }
    }
}

function handlerClickOnStart(ev) {
    if (ev.target.id == 'start') {
        commandeClient(1);

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
    }
    else if (hand.dataset.tri == "recycle") {
        scoreJ = scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
        hand.remove();
        main.pop();
    }
}

function handlerClickOnRecycle() {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "recycle") {
        hand.remove();
        main.pop();
    }
    else if (hand.dataset.tri == "compost") {
        scoreJ = scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
        hand.remove();
        main.pop();
    }
}

function handlerClickOnThon(ev) {
    if (main[0] == 'can-opener') {
        if (ev.target.dataset.id == "thon-boite") {
            if (ev.target.dataset.state == 1) {

                ev.target.dataset.state = 0

                var thon = document.createElement('a-entity');
                thon.setAttribute('obj-model', 'obj: ../assets/models/ingredients/base.obj;');
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
let scoreJoueur = document.querySelector('#scorej');
scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);

let fridge = document.querySelector('#fridge-door');
fridge.addEventListener('click', handlerClickOnFridge);

let start = document.querySelectorAll('#start');
start.forEach(bouton => {
    bouton.addEventListener('click', handlerClickOnStart);
});

let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    bouton.addEventListener('click', handlerClicSurBouton);
});

let emptyBtn = document.querySelector('#btn_empty_plate');
emptyBtn.addEventListener('click', handlerClickOnEmptyBtn);

let putCompost = document.querySelector('#compost_bin');
putCompost.addEventListener('click', handlerClickOnCompost);

let putRecycle = document.querySelector('#recycle_bin');
putRecycle.addEventListener('click', handlerClickOnRecycle);

let validBell = document.querySelector('#bell_validate');
validBell.addEventListener('click', handlerClickOnBell);


let scene = document.querySelector('a-scene');
scene.addEventListener('click', handlerClickOnConso);
scene.addEventListener('click', handlerClickOnThon);
scene.addEventListener('click', handlerClickOnAssiette);
scene.addEventListener('click', handlerClickOnGrill);
scene.addEventListener('click', handlerClickOnPlate);
scene.addEventListener('click', handlerClickOnContainerOB);
scene.addEventListener('click', handlerClickOnTable);

