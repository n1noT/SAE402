
import { C } from '../js/controller.js';
import { V } from '../js/vue.js';



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


let fridge = document.querySelector('#fridge-door');
fridge.addEventListener('click', V.handlerClickOnFridge);

let start = document.querySelectorAll('#start');
start.forEach(bouton => {
    bouton.addEventListener('click', C.handlerClickOnStart);
});

let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    bouton.addEventListener('click', V.handlerClicSurBouton);
});

let emptyBtn = document.querySelector('#btn_empty_plate');
emptyBtn.addEventListener('click', C.handlerClickOnEmptyBtn);

let putCompost = document.querySelector('#compost_bin');
putCompost.addEventListener('click', C.handlerClickOnCompost);

let putRecycle = document.querySelector('#recycle_bin');
putRecycle.addEventListener('click', C.handlerClickOnRecycle);

let validBell = document.querySelector('#bell_validate');
validBell.addEventListener('click', C.handlerClickOnBell);


let scene = document.querySelector('a-scene');
scene.addEventListener('click', C.handlerClickOnConso);
scene.addEventListener('click', C.handlerClickOnThon);
scene.addEventListener('click', C.handlerClickOnAssiette);
scene.addEventListener('click', C.handlerClickOnGrill);
scene.addEventListener('click', C.handlerClickOnPlate);
scene.addEventListener('click', C.handlerClickOnContainerOB);
scene.addEventListener('click', C.handlerClickOnTable);

