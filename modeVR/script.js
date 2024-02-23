
import { C } from '../js/controller.js';
import { V } from '../js/vue.js';


// Composant qui fait en sorte qu'un objet suive la main/manette
AFRAME.registerComponent('follow-hand', {
    tick: function () {
        var object = this.el;
        var rightController = document.getElementById('rightController');
        var rightControllerPosition = rightController.getAttribute('position');

        // place l'objet à la position de la main avec une hauteur de 0.1 de plus pour éviter les conflits au clic
        object.setAttribute('position', {
            x: rightControllerPosition.x,
            y: rightControllerPosition.y + 0.1,
            z: rightControllerPosition.z 
        });
    }
});

// Attribution des EventListener
let fridge = document.querySelector('#fridge-door');
fridge.addEventListener('click', V.handlerClickOnFridge);
document.querySelector('#rightController').addEventListener('triggerdown', V.handlerClickOnFridge);

let start = document.querySelectorAll('#start');
start.forEach(bouton => {
    bouton.addEventListener('click', C.handlerClickOnStart);
    document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnStart);
});

let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    bouton.addEventListener('click', V.handlerClicSurBouton);
    document.querySelector('#rightController').addEventListener('triggerdown', V.handlerClicSurBouton);
});

let emptyBtn = document.querySelector('#btn_empty_plate');
emptyBtn.addEventListener('click', C.handlerClickOnEmptyBtn);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnEmptyBtn);

let putCompost = document.querySelector('#compost_bin');
putCompost.addEventListener('click', C.handlerClickOnCompost);
putCompost.addEventListener('triggerdown', C.handlerClickOnCompost);

let putRecycle = document.querySelector('#recycle_bin');
putRecycle.addEventListener('click', C.handlerClickOnRecycle);
putRecycle.addEventListener('triggerdown', C.handlerClickOnRecycle);

let validBell = document.querySelector('#bell_validate');
validBell.addEventListener('click', C.handlerClickOnBell);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnBell);

let scene = document.querySelector('a-scene');
scene.addEventListener('click', C.handlerClickOnConso);
scene.addEventListener('click', C.handlerClickOnThon);
scene.addEventListener('click', C.handlerClickOnAssiette);
scene.addEventListener('click', C.handlerClickOnGrill);
scene.addEventListener('click', C.handlerClickOnPlate);
scene.addEventListener('click', C.handlerClickOnContainerOB);
scene.addEventListener('click', C.handlerClickOnTable);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnConso);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnThon);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnAssiette);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnGrill);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnPlate);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnContainerOB);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnTable);