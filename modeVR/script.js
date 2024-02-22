
import { C } from '../js/controller.js';
import { V } from '../js/vue.js';



AFRAME.registerComponent('follow-hand', {
    tick: function () {
        var object = this.el;
        var rightController = document.getElementById('rightController');
        var rightControllerPosition = rightController.getAttribute('position');

        object.setAttribute('position', rightControllerPosition);
    }
});

document.querySelector('#rightController').addEventListener('triggerdown', V.handlerClickOnFridge);

let start = document.querySelectorAll('#start');
start.forEach(bouton => {
    document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnStart);
});

let grill = document.querySelectorAll('.grill_btn');
grill.forEach(bouton => {
    document.querySelector('#rightController').addEventListener('triggerdown', V.handlerClicSurBouton);
});

document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnEmptyBtn);

let putCompost = document.querySelector('#compost_bin');
putCompost.addEventListener('triggerdown', C.handlerClickOnCompost);

let putRecycle = document.querySelector('#recycle_bin');
putRecycle.addEventListener('triggerdown', C.handlerClickOnRecycle);

document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnBell);

document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnConso);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnThon);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnAssiette);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnGrill);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnPlate);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnContainerOB);
document.querySelector('#rightController').addEventListener('triggerdown', C.handlerClickOnTable);

