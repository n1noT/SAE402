// Model
// Tableau des commandes faites par les clients
let commandes = [];

// Model
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
let assiette = [];

// Tableau contenant les 4 contenances des plaques de cuisson
let plaques = [[], [], [], []];

// Tableau contenant les objets dans le plateau
let plateau = [];

// Tableau contenant les objets sur la table
let table = [];

// Tableau contenant l'ouvre-boite
let containerOB = [];

// Tableau contenant les objet dans la main 
let main = [];

// Variable de score 
let scoreJ = 0;

// Variable des étoiles
let starsLeft = 3;

// Objet M contenant les getters et setters
export const M = {
    get dataRecette() {
        return dataRecette;
    },
    get commandes() {
        return commandes;
    },
    set commandes(nvCommandes) {
        commandes = nvCommandes;
    },
    get assiette() {
        return assiette;
    },
    set assiette(nvAssiette) {
        assiette = nvAssiette;
    },
    get plaques() {
        return plaques;
    },
    set plaques(nvPlaques) {
        plaques = nvPlaques;
    },
    get plateau() {
        return plateau;
    },
    set plateau(nvPlateau) {
        plateau = nvPlateau;
    },
    get table() {
        return table;
    },
    set table(nvTable) {
        table = nvTable;
    },
    get containerOB() {
        return containerOB;
    },
    set containerOB(nvContainerOB) {
        containerOB = nvContainerOB;
    },
    get main() {
        return main;
    },
    set main(nvMain) {
        main = nvMain;
    },
    get scoreJ() {
        return scoreJ;
    },
    set scoreJ(nouveauScore) {
        scoreJ = nouveauScore;
    },
    get starsLeft() {
        return starsLeft;
    },
    set starsLeft(nouveauNombre) {
        starsLeft = nouveauNombre;
    }
};
