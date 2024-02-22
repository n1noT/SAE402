import { M } from '../js/model.js';
import { V } from '../js/vue.js';

let C = {};


// Controller
// Génére une commande aléatoire selon les recettes contenues 
// dans le tableau dataRecette et leur niveau associé.
// La commande est placé dans le tableau commandes contenant toutes les commandes
let commandeClient = function (niveauMax) {

    let index = Math.floor(Math.random() * M.dataRecette.length);

    while (M.dataRecette[index].niveau > niveauMax) {
        index = Math.floor(Math.random() * M.dataRecette.length);
    }

    let commande = M.dataRecette[index];
    M.commandes.push(commande);

    let cmd = document.querySelector('#fullCommande')

    if (cmd) {
        cmd.remove()
        V.commandeEntity()
    }
    else {
        V.commandeEntity()
    }

}

// Controller
let validerCommande = function () {
    let currentCommand = M.commandes[M.commandes.length - 1];
    let assiette = M.assiette;
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

// Controller
// Perte de point lorsque la porte du frigo est ouverte
let lowerFridgeScore = function() {
    let porte = document.querySelector('#fridge-door');
    if (porte.dataset.etat == 'ouvert') {
        M.scoreJ -= 1;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
    }
}
var intervalID = setInterval(lowerFridgeScore, 1000);

// Controller
// Perte de point lorsque la plaque est allumé
let lowerGrillScore = function() {
    let grill = document.querySelectorAll('.grill_btn');
    for(let btn of grill){
        if (btn.dataset.etat == 'on') {
            M.scoreJ -= 1;
            scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        }
    }
}
var intervalID = setInterval(lowerGrillScore, 1000);


// Controller
C.handlerClickOnConso = function (ev) {
    if (ev.target.className == 'consommable') {
        // Si la main est vide on attribue follow-hand ce qui le fait suivre la caméra
        if (M.main.length < 1) {
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
                M.plateau = M.plateau.filter(obj => obj.x !== ev.target.getAttribute('position').x);

            }
            if (ev.target.id == 'inTable') {
                M.table = M.table.filter(obj => obj.z !== ev.target.getAttribute('position').z);

            }

            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                ev.target.dataset.stock = null
                ev.target.id = 'handed'

                M.main.push(ev.target.dataset.id)
            }

            // Arrête le script sinon la suite annulera cette action
            return
        }

     
    }
    else{
        if (M.main.length == 1) {
            if (ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'fridge' && M.main[0] != 'pain') {
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    M.main.shift()
                    return
                
            }
            if(ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'shelf' && M.main[0] == 'pain'){
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    M.main.shift()
                    return
                
            }
        }
    }


}



// Controller
C.handlerClickOnAssiette = function (ev) {


    if (ev.target.className == 'assiette' || ev.target.id == 'inAssiette') {
        if (M.main.length < 1) {
            return
        }

        if (M.main.length == 1) {
            let objMain = document.querySelector('#handed')

            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');
                
                let yObj = 1
                for (let i = 0; i < M.assiette.length; i++) {
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

                M.assiette.push(objMain.dataset.id)
                M.main.shift()
            }

            return
        }
    }
}

// Controller
C.handlerClickOnGrill = function (ev) {
    let btn = document.querySelectorAll('.grill_btn');
    let plaque = document.querySelectorAll('.grill');

    // Récupérer l'index de la plaque sur laquelle on a cliqué
    let plaqueIndex = Array.from(plaque).indexOf(ev.target);

    if (ev.target.className == 'grill') {
        if (M.main.length < 1) {
            return;
        }

        if (M.main.length == 1 && plaqueIndex !== -1 && btn[plaqueIndex].dataset.etat === 'on') {
            let objMain = document.querySelector('#handed');
            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let yObj = 1;
                for (let i = 0; i < M.plaques[0].length; i++) {
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
                        V.steakcuit(objCuit);
                    }
                }, 5000);


                setTimeout(function () {

                    if (objMain.id === 'inGrill') {
                        let objCrame = objMain;
                        V.steakcrame(objCrame);

                        // mise a jour du score et affichage
                        M.scoreJ = M.scoreJ - 50;
                        scoreJoueur.setAttribute('text', 'value', `SCORE : ${scoreJ}`);
                    }
                }, 10000);

                M.plaques[0].push(objMain.dataset.id);

                M.main.shift();
            }
            return;
        }
    }
};

// Controller
C.handlerClickOnPlate = function (ev) {
    if (ev.target.className == 'plateau' || ev.target.id == 'inPlate') {
        // Récupérer l'élément plateau
        let plate = document.querySelector('.plateau');

        if (M.main.length < 1) {
            return;
        }

        if (M.plateau.length < 2) {
            let objMain = document.querySelector('#handed');
            if (objMain.dataset.id == 'steak' || objMain.dataset.id == 'steak cuit') {
                if (objMain.hasAttribute('follow-hand')) {
                    objMain.removeAttribute('follow-hand');

                    let posPlate = plate.getAttribute('position');

                    if (M.plateau.length == 0 || M.plateau[0].x == posPlate.x + 0.2) {
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
                M.plateau.push(objMain.getAttribute('position'));


                objMain.id = 'inPlate';
                M.main.shift();
                return
            }

        }

    }

}

// Controller
C.handlerClickOnContainerOB = function (ev) {
    if (ev.target.className == 'containerO-B' || ev.target.id == 'inContainer') {
        if (M.main[0] == "can-opener") {
            if (M.main.length < 1) {
                return
            }

            if (M.main.length == 1) {
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

                    M.main.shift()
                }

                return
            }
        }

    }
}

// Controller
C.handlerClickOnTable = function (ev) {

    if (ev.target.className == 'containerTable' || ev.target.id == 'inTable') {
        // Récupérer l'élément plateau
        let containerTable = document.querySelector('.containerTable');

        if (M.main.length < 1) {
            return;
        }

        if (M.table.length < 2 && M.main[0] != "can-opener") {
            let objMain = document.querySelector('#handed');
            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let posTbl = containerTable.getAttribute('position');

                if (M.table.length == 0 || M.table[0].z == posTbl.z + 0.45) {
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
            M.table.push(objMain.getAttribute('position'));


            objMain.id = 'inTable';
            M.main.shift();
            return
        }
    }
}

// Controller
C.handlerClickOnEmptyBtn = function (ev){
    if (ev.target.id == 'btn_empty_plate') {
        if (M.assiette.length < 1) {
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
            while (M.assiette.length > 0) {
                M.assiette.pop();
            }


        }
    }
}


// Controller
AFRAME.registerComponent('timer-controller', {
    init: function () {


        var timerEntity = document.getElementById('timer');
        var commandeEntity = document.getElementById('commande');
        var ingredientsEntity = document.getElementById('ingredients');

        // Initialisez le timer à 60 secondes
        var timerValue = 60;

        // récupère la liste des ingrédients requis pour la recette
        var ingredients = M.commandes[M.commandes.length - 1].ingredients;
        // Affiche les ingrédients en colonne
        var ingredientsText = ingredients.join('\n');

        // Met à jour le timer chaque seconde
        this.interval = setInterval(function () {
            // Vérifie si le timer est déjà à zéro
            if (timerValue < 0) {
                clearInterval(this.interval); // Arrête le timer
                return; // Sort de la fonction setInterval
            }

            // Met à jour le texte du timer
            timerEntity.setAttribute('text', 'value', timerValue);
            ingredientsEntity.setAttribute('text', 'value', ingredientsText)

            // si le timer est au dessus de 9
            if (timerValue > 9) {
                commandeEntity.setAttribute('text', 'value', `Je voudrais un ${M.commandes[M.commandes.length - 1].nom} !`);
                timerEntity.setAttribute('text', 'color', 'white');
            }

            // si le timer passe en dessous de 10
            if (timerValue < 10) {
                timerEntity.setAttribute('text', 'color', 'red');
            }

            // si le timer arrive a 0
            if (timerValue === 0) {

                // mettre a jour le score et l'afficher
                M.scoreJ = M.scoreJ - 100;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);


                commandeEntity.setAttribute('text', 'value', 'Je ne reviendrai plus !');

                setTimeout(function() {
                    difficultyByScore();
                    loseStar();
                }, 1000);


                clearInterval(this.interval)
            }

            timerValue--;
        }, 1000);

    },

    remove: function () {
        clearInterval(this.interval);
    },
});

// Controller
let difficultyByScore = function(){
    if(M.scoreJ < 300){
        commandeClient(1)
    }
    else if(M.scoreJ < 500){
        commandeClient(2)
    }
    else {
        commandeClient(3)
    }
}

// Controller
C.handlerClickOnBell = function(ev) {
    if (ev.target.id == 'bell_validate') {
        if (M.assiette.length < 1) {
            return

        }
        else {
            var commandeEntity = document.getElementById('commande');
            let assiette = document.querySelectorAll('#inAssiette')

            if (validerCommande() == true) {
                // calcul des points par rapport au niveau de la commande
                M.scoreJ += 100*M.commandes[M.commandes.length - 1].niveau;
                //mettre a jour le score et l'afficher
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);



                for (let ing of assiette) {
                    ing.remove()
                }

                while (M.assiette.length > 0) {
                    M.assiette.pop();
                }


                while (M.commandes.length > 0) {
                    M.commandes.pop()
                }

                commandeEntity.setAttribute('text', 'value', 'Merci !')

                setTimeout(function() {
                    difficultyByScore();
                }, 1000);


            }
            else {
                // mettre a jour le score et l'afficher
                M.scoreJ = M.scoreJ - 100;
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
                
                for (let ing of assiette) {
                    ing.remove()
                }
                
                while (M.assiette.length > 0) {
                    M.assiette.pop();
                }
                
                M.commandes.pop()
                
                commandeEntity.setAttribute('text', 'value', 'Je ne reviendrai plus !')

                setTimeout(function() {
                    difficultyByScore();
                    // Perte d'une étoile
                    loseStar()
                }, 1000);

                

                return
            }

        }
    }
}

// Controller
C.handlerClickOnStart = function(ev) {
    if (ev.target.id == 'start') {
        // définir le score a 0
        M.scoreJ = 0;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        // redonner toutes les étoiles
        let starsElement = document.querySelectorAll('.stars');
        for(let star of starsElement){
            star.setAttribute('material', 'color', '#FFFB00');
        }
        //générer une commande de niveau 1
        commandeClient(1);

        let start = document.querySelectorAll('#start');
        start.forEach(elt => {
            elt.remove();
        });
    }
}

// Controller
C.handlerClickOnCompost = function () {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "compost") {
        hand.remove();
        M.main.pop();
    }
    else if(hand.dataset.tri == "recycle"){
        M.scoreJ = M.scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        hand.remove();
        M.main.pop();
    }
}

// Controller
C.handlerClickOnRecycle = function() {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "recycle") {
        hand.remove();
        M.main.pop();
    }
    else if(hand.dataset.tri == "compost"){
        M.scoreJ = M.scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        hand.remove();
        M.main.pop();
    }
}

// Controller
C.handlerClickOnThon = function(ev) {
    if (M.main[0] == 'can-opener') {
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

// Controller
let loseStar = function() {
  if (M.starsLeft > 1) {
    const starElement = document.getElementById(`star${M.starsLeft}`);
    starElement.setAttribute('material', 'color', '#808080');
    M.starsLeft--;
  }
  else if (M.starsLeft == 1){
    const starElement = document.getElementById(`star${M.starsLeft}`);
    starElement.setAttribute('material', 'color', '#808080');
    resetGame();
    M.starsLeft = 3;
  }
}

// Controller
let resetGame = function(){

    let objMain = document.querySelector('#handed');

    // Vide le tableau des ingrédients dans assiette
    while (M.assiette.length > 0) {
        M.assiette.pop();
    };
    // vider la main
    while (M.main.length > 0) {
        M.main.pop();
        objMain.remove();
    };

    fullCommande.remove();

    let scene =  document.querySelector("a-scene");

    var box = document.createElement("a-box");
    box.setAttribute("rotation", "0 90 0");
    box.setAttribute("position", "-1.5 2 0");
    box.setAttribute("scale", "0.8 0.3 0.1");
    box.setAttribute("color", "#00FF00");
    box.setAttribute("id", "start");
    scene.appendChild(box);
    
    // Création du texte
    var text = document.createElement("a-text");
    text.setAttribute("value", "LANCER LE JEU");
    text.setAttribute("rotation", "0 90 0");
    text.setAttribute("position", "-1.4 2 0.325");
    text.setAttribute("scale", "0.4 0.4 0.4");
    text.setAttribute("color", "#000000");
    text.setAttribute("id", "start");
    scene.appendChild(text);

    let start = document.querySelectorAll('#start');
    start.forEach(bouton => {
    bouton.addEventListener('click', C.handlerClickOnStart);
});
}
        
// Controller
// Affichage du score en HUD
let scoreJoueur = document.querySelector('#scorej');
scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);


export {C}