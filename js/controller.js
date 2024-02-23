import { M } from '../js/model.js';
import { V } from '../js/vue.js';

let C = {};

// Fonction qui énére une commande aléatoire selon les recettes contenues dans le tableau M.dataRecette et leur niveau associé.
// La commande est placé dans le tableau M.commandes contenant toutes les commandes

let commandeClient = function (niveauMax) {
    // Choisi un index dans le tableau aléatoirement
    let index = Math.floor(Math.random() * M.dataRecette.length);

    // Vérifie que la recette correspond au niveau actuel
    while (M.dataRecette[index].niveau > niveauMax) {
        index = Math.floor(Math.random() * M.dataRecette.length);
    }

    // Envoie la recette dans le tableau M.commandes
    let commande = M.dataRecette[index];
    M.commandes.push(commande);

    // Met à jour la Vue
    let cmd = document.querySelector('#fullCommande')

    // Vérifie si la vue est déjà créé
    if (cmd) {
        cmd.remove()
        V.commandeEntity()
    }
    else {
        V.commandeEntity()
    }

}

// Fonction qui retourne un booléen indiquant si les tableaux "assiette" et "commande" sont identiques.
let validerCommande = function () {
    let currentCommand = M.commandes[M.commandes.length - 1];
    let assiette = M.assiette;
    let commande = currentCommand.ingredients

    // Vérifie si le tableau assiette et commande on la même longueur
    if (assiette.length == commande.length) {
        // Initalisation du booléen
        let bool = true

        for (let i = 0; i < assiette.length; i++) {
            // Si les éléments de même index ne sont pas identiques renvoie false
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


// Fonction qui fait perdre des points lorsque la porte du frigo est ouverte
let lowerFridgeScore = function() {
    let porte = document.querySelector('#fridge-door');
    if (porte.dataset.etat == 'ouvert') {
        M.scoreJ -= 1;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
    }
}
var intervalID = setInterval(lowerFridgeScore, 1000);


// Fonction qui fait perdre des points lorsque la plaque est allumée
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


// Fonction qui gère les cliques sur les objets de type consommables et les mettent/retirent de la main 
C.handlerClickOnConso = function (ev) {
    if (ev.target.className == 'consommable') {
        // Si la main est vide
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
            // Si un ingrédient est dans l'assiette on ne peut pas le reprendre pour ne pas créer de conflit entre le tableau M.assiette et la vue 
            if (ev.target.id == 'inAssiette') {
                return
            };
            //Filtre le tableau M.plateau pour retirer l'objet dont la position a été cliqué 
            if (ev.target.id == 'inPlate') {
                M.plateau = M.plateau.filter(obj => obj.x !== ev.target.getAttribute('position').x);

            }
            //Filtre le tableau M.table pour retirer l'objet dont la position a été cliqué 
            if (ev.target.id == 'inTable') {
                M.table = M.table.filter(obj => obj.z !== ev.target.getAttribute('position').z);

            }

            // Ajoute l'attribut follow-hand pour que l'objet dans la main suive la caméra
            if (!ev.target.hasAttribute('follow-hand')) {
                ev.target.setAttribute('follow-hand', '');
                // Met le stock à 'null' une fois qu'il est sorti de celui de manière à ne pas dupliquer chaque objet dans la pièce si l'on clique dessus
                ev.target.dataset.stock = null
                // Identifie l'objet comme dans la main
                ev.target.id = 'handed'

                // Met l'objet dans la main dans le model 
                M.main.push(ev.target.dataset.id)
            }

            // Arrête le script 
            return
        }

     
    }
    else{
        // Si on a un objet dans la main
        if (M.main.length == 1) {
            // Si l'on clique sur le stock ou le frigo cela "replace" l'objet dans celui-ci et le fait disparaitre de la main à condition qu'il ne soit pas du pain
            if (ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'fridge' && M.main[0] != 'pain') {
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    M.main.shift()
                    return
                
            }
            // L'inverse du précédent pour le pain si l'on clique sur l'étagère
            if(ev.target.dataset.stock == 'stock' || ev.target.dataset.id == 'shelf' && M.main[0] == 'pain'){
                    let hand = document.querySelector('#handed');
                    hand.remove()
                    M.main.shift()
                    return
                
            }
        }
    }


}



// Fonction qui gère les intercations avec l'assiette de commande du client
C.handlerClickOnAssiette = function (ev) {
    if (ev.target.className == 'assiette' || ev.target.id == 'inAssiette') {

        // Arrête le script si la main est vide
        if (M.main.length < 1) {
            return
        }

        if (M.main.length == 1) {
            let objMain = document.querySelector('#handed')

            if (objMain.hasAttribute('follow-hand')) {
                // Retire l'attribut de suivi de la caméra
                objMain.removeAttribute('follow-hand');
                
                // Initialisation du y de l'objet
                let yObj = 1
                for (let i = 0; i < M.assiette.length; i++) {
                    // Comme les ingredients ont globalement la même taille on augmente la hauteur d'une valeur identique dans l'assiette
                    yObj += 0.05
                }

                // Récupère la position de l'assiette
                let posAssiette = ev.target.getAttribute('position')

                // Donne la position de l'objet au centre de l'assiette avec la hauteur modifié
                let posObj = {
                    x: posAssiette.x,
                    y: yObj,
                    z: posAssiette.z
                }

                objMain.setAttribute('position', posObj);
                // Défini l'objet comme dans l'assiette
                objMain.id = 'inAssiette'

                //Met l'id de l'objet placé dans l'assiette dans le tableau de manière à vérifié celui-ci plus tard au moment de la validation
                M.assiette.push(objMain.dataset.id)
                //Retire l'objet de la main
                M.main.shift()
            }

            return
        }
    }
}

// Fonction qui gère les intercations avec le grill
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

// Fonction qui gère les intercations avec le plateau
C.handlerClickOnPlate = function (ev) {
    if (ev.target.className == 'plateau' || ev.target.id == 'inPlate') {
        // Récupérer l'élément plateau
        let plate = document.querySelector('.plateau');

        // Arrête le script si la main est vide
        if (M.main.length < 1) {
            return;
        }

        // Vérifie si le tableau M.plateau contient moins de 2 éléments
        if (M.plateau.length < 2) {
            let objMain = document.querySelector('#handed');

            // Vérifie si les objets sont des steaks
            if (objMain.dataset.id == 'steak' || objMain.dataset.id == 'steak cuit') {
                if (objMain.hasAttribute('follow-hand')) {
                    objMain.removeAttribute('follow-hand');

                     // Récupère la position du plateau
                    let posPlate = plate.getAttribute('position');

                    // Si le plateau est vide ou que qu'il y a un objet à la position 2 dans la vue, place l'objet à la position 1
                    if (M.plateau.length == 0 || M.plateau[0].x == posPlate.x + 0.2) {
                        let posObj = {
                            // Met la position 1
                            x: posPlate.x - 0.15,
                            // Éléve l'objet par rapport au plateau
                            y: posPlate.y + 0.02,
                            z: posPlate.z
                        };

                        objMain.setAttribute('position', posObj);
                    }

                    // Si le plateau contient un steak  à la position 1 dans la vue, place l'objet à la position 2
                    else {
                        let posObj = {
                            // Met la position 2
                            x: posPlate.x + 0.2,
                            // Éléve l'objet par rapport au plateau
                            y: posPlate.y + 0.02,
                            z: posPlate.z
                        };

                        objMain.setAttribute('position', posObj);
                    }

                }

                // Ajouter la position de l'objet principal dans le tableau plateau
                M.plateau.push(objMain.getAttribute('position'));

                // Défini l'objet comme dans le plateau
                objMain.id = 'inPlate';
                M.main.shift();
                return
            }

        }

    }

}

// Fonction qui gère les intercations avec le conteneur de l'ouvre-boite
C.handlerClickOnContainerOB = function (ev) {
    if (ev.target.className == 'containerO-B' || ev.target.id == 'inContainer') {
        if (M.main.length == 1) {
            // Vérifie que c'est bien l'ouvreur de boite dans la main
            if (M.main[0] == "can-opener") {
                let objMain = document.querySelector('#handed')

                if (objMain.hasAttribute('follow-hand')) {
                    objMain.removeAttribute('follow-hand');

                    let posObj = {
                        x: 0,
                        y: 2.2,
                        z: -3.5
                    }

                    objMain.setAttribute('position', posObj);
                    // Défini l'objet comme dans le conteneur
                    objMain.id = 'inContainer'

                    M.containerOB.push(objMain.dataset.id)
                    M.main.shift()
                }

                return
            }
        }

    }
}

// Fonction qui gère les intercations avec la table
C.handlerClickOnTable = function (ev) {

    if (ev.target.className == 'containerTable' || ev.target.id == 'inTable') {
        // Récupérer l'élément table
        let containerTable = document.querySelector('.containerTable');

        if (M.main.length < 1) {
            return;
        }

        // Vérifie si le tableau M.table contient moins de 2 éléments et que l'objet dans la main n'est pas l'ouvreur de boite pour ne placer que les autres types d'objet sur la table
        if (M.table.length < 2 && M.main[0] != "can-opener") {
            let objMain = document.querySelector('#handed');
            if (objMain.hasAttribute('follow-hand')) {
                objMain.removeAttribute('follow-hand');

                let posTbl = containerTable.getAttribute('position');

                // Même système de position que pour C.handlerClickOnPlate mais avec z 
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

            // Défini l'objet comme sur la table
            objMain.id = 'inTable';
            M.main.shift();
            return
        }
    }
}

// Fonction qui vide l'assiette lorsque l'on clique sur le bouton dédié afin de pouvoir trier son contenu et remettre les ingredients dans l'ordre souhaité
C.handlerClickOnEmptyBtn = function (ev){
    if (ev.target.id == 'btn_empty_plate') {
        // Ne fait rien si l'assiette est vide 
        if (M.assiette.length < 1) {
            return

        }
        else {
            // Récupère les ingredients dans l'assiette et dans l'emptyAssiette
            let allIngInAssiette = document.querySelectorAll("#inAssiette")
            // On récupère aussi les ingredients placé précédement dans emptyAssiette pour ne pas créer de conflit dans la vue en regénérant le tout 
            let allIngInEmpty = document.querySelectorAll("#emptyAssiette")

            // Récupére tous les ingrédients dans l'assiette et en dehors
            let allIng = [...allIngInAssiette, ...allIngInEmpty]

            allIng.sort()

            // Initalisation de la hauteur
            let yObj = 1.4
            let posBtn = ev.target.getAttribute('position')

            // Vide le tableau des ingrédients dans assiette
            for (let ing of allIng) {

                // Place les objets au dessus du bouton 
                let posObj = {
                    x: posBtn.x,
                    y: yObj,
                    z: posBtn.z
                }

                // Écarte chaque objet de 0.02
                yObj += 0.2

                // Défini l'objet comme au dessus du bouton 
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


// Composant du timer
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

// Fonction pour valider une commande quand on clique sur la clochette 
C.handlerClickOnBell = function(ev) {
    if (ev.target.id == 'bell_validate') {
        // Annule l'action si l'assiette est vide 
        if (M.assiette.length < 1) {
            return

        }
        else {
            var commandeEntity = document.getElementById('commande');
            let assiette = document.querySelectorAll('#inAssiette')

            // Si la commande est valide
            if (validerCommande() == true) {
                // calcul des points par rapport au niveau de la commande
                M.scoreJ += 100*M.commandes[M.commandes.length - 1].niveau;
                //mettre a jour le score et l'afficher
                scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);


                // Supprime les ingredients de l'assiette dans la vue
                for (let ing of assiette) {
                    ing.remove()
                }

                // Supprime les ingredients de l'assiette dans le model
                while (M.assiette.length > 0) {
                    M.assiette.pop();
                }

                // Supprime la commande de le tableau M.commandes
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

// Fonction qui démarre le jeu quand on clique sur le bouton 'JOUER'
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

// Fonction qui gère les interactions avec le compost
C.handlerClickOnCompost = function () {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "compost") {
        hand.remove();
        M.main.pop();
    }
    // Fait perdre des points si on se trompe de poubelle
    else if(hand.dataset.tri == "recycle"){
        M.scoreJ = M.scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        hand.remove();
        M.main.pop();
    }
}

// Fonction qui gère les interactions avec le recyclage
C.handlerClickOnRecycle = function() {
    let hand = document.querySelector('#handed');
    if (hand.dataset.tri == "recycle") {
        hand.remove();
        M.main.pop();
    }
    // Fait perdre des points si on se trompe de poubelle
    else if(hand.dataset.tri == "compost"){
        M.scoreJ = M.scoreJ - 50;
        scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);
        hand.remove();
        M.main.pop();
    }
}

// Fonction qui permet d'ouvrir la boite de thon
C.handlerClickOnThon = function(ev) {
    // Vérifie que l'on a l'ouvre-boite dans la main
    if (M.main[0] == 'can-opener') {
        // Vérifie que l'on vise la boite de thon
        if (ev.target.dataset.id == "thon-boite") {
            // Vérifie que la boite n'a pas déjà été ouverte
            if (ev.target.dataset.state == 1) {

                // Défini la boite comme ouverte
                ev.target.dataset.state = 0

                // Crée le steak de thon 
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
        

// Affichage du score en 
let scoreJoueur = document.querySelector('#scorej');
scoreJoueur.setAttribute('text', 'value', `SCORE : ${M.scoreJ}`);


export {C}