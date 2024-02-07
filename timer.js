import "./model.js";

AFRAME.registerComponent('timer-controller', {
    init: function () {
        // Récupérez l'entité du timer
        var timerEntity = document.getElementById('timer');
        var commandeEntity = document.getElementById('commande');

        // Initialisez le timer à 10 secondes
        var timerValue = 10;

        // Mettez à jour le timer chaque seconde
        this.interval = setInterval(function () {
            if (timerValue > 0) {
                timerValue--;

            }

            // Mettez à jour le texte du timer
            timerEntity.setAttribute('text', 'value', timerValue);

            // Changez la couleur en rouge lorsque le timer atteint 0
            if (timerValue === 0) {
                commandeEntity.setAttribute('text', 'value', 'Dommage, je me casse !');

                timerEntity.setAttribute('text', 'color', 'red');
                timerEntity.setAttribute('text', 'value', '0');
            }
        }, 1000);
    },

    // Assurez-vous de nettoyer l'intervalle lors de la suppression du composant
    remove: function () {
        clearInterval(this.interval);
    },
});
