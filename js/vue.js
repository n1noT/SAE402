let V = {}

// Vue
V.commandeEntity = function () {
    var bulle = document.createElement('a-gltf-model');
    bulle.setAttribute('src', '../assets/models/cmd/Speech.glb');
    bulle.setAttribute('position', '-5.5 3.34 0');
    bulle.setAttribute('rotation', '0 90 0');
    bulle.setAttribute('scale', '2.5 1 1');
    bulle.id = 'bulle';

    var character = document.createElement('a-gltf-model');
    character.setAttribute('src', '../assets/models/character/BeachCharacter.glb');
    character.setAttribute('position', '-5.7 -1 0');
    character.setAttribute('rotation', '0 90 0');
    character.setAttribute('scale', '2 2 2');
    character.setAttribute('id', 'character');

    var commandeEntity = document.createElement('a-entity');
    commandeEntity.setAttribute('id', 'commande');
    commandeEntity.setAttribute('position', '-5.2 3.6 1.45');
    commandeEntity.setAttribute('rotation', '0 90 0');
    commandeEntity.setAttribute('text', 'value: Bonjour !; color: black; width: 5; align: center');

    var valideEntity = document.createElement('a-entity');
    valideEntity.setAttribute('id', 'valide');
    valideEntity.setAttribute('position', '-5.2 4.6 -2');
    valideEntity.setAttribute('rotation', '0 90 0');
    valideEntity.setAttribute('text', 'value: ; color: black; width: 5; align: center');

    var ingredientsEntity = document.createElement('a-entity');
    ingredientsEntity.setAttribute('id', 'ingredients');
    ingredientsEntity.setAttribute('position', '0 1.75 3.3');
    ingredientsEntity.setAttribute('rotation', '0 180 0');
    ingredientsEntity.setAttribute('text', 'value: ; color: black; width: 4; align: center');

    var timerEntity = document.createElement('a-entity');
    timerEntity.setAttribute('id', 'timer');

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

// Vue
// FRIDGE
V.handlerClickOnFridge = function (ev) {
    let porte = document.querySelector('#fridge-door');


    if (ev.target.className == 'frigo-door') {
        if (porte.dataset.etat == 'ferme') {


            porte.setAttribute('gltf-model', '../assets/models/fridge/door/door-open.glb');
            porte.setAttribute('rotation', '0 90 180');
            porte.setAttribute('scale', '0.8 0.9 0.6');
            porte.dataset.etat = 'ouvert'

            return
            
        }
        if (porte.dataset.etat == 'ouvert') {
            porte.setAttribute('gltf-model', '../assets/models/fridge/door/door-close.glb');
            porte.setAttribute('rotation', '0 90 180');
            porte.setAttribute('scale', '0.9 1.1 1');
            porte.dataset.etat = 'ferme'
            return

        }

    }
}

// Vue
// Fonction pour mettre à jour la position de l'entité "follower" à une distance fixe de la caméra
V.updateFollowerPosition = function (toFollow) {
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


// Vue
V.steakcuit = function (objMain) {
    objMain.setAttribute('material', 'color : #622828');
    objMain.dataset.id += " cuit"
};

// Vue
V.steakcrame = function (objMain) {
    objMain.setAttribute('material', 'color : #210202');
    objMain.dataset.id = "crame"
};

// Vue
// GRILL - BOUTONS
V.handlerClicSurBouton = function (ev) {
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

export {V};