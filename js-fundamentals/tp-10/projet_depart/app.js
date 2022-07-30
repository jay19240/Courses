const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 320;

// indice 1er niveau du tableau
let playerRow = 0;

// indice 2em niveau du tableau
let playerCol = 0;

// tableau à deux dimensions représentant la carte du jeu [0 = vide, 1 = mur, 2 = piece, S = spawn]
let map = [
  ['3','0','0','0','0','0','0','0','0','1'],
  ['0','0','0','0','0','0','2','0','0','0'],
  ['0','0','0','0','0','0','2','0','S','0'],
  ['0','0','0','0','0','0','2','0','0','0']
];

// direction courante du personnage
let currentDirection = TILE_DIRECTION_UP;

// image qui contient les fragments graphiques du jeu (sprite)
let spritesheet = new Image();

init();

function init() {
  let image = new Image();
  image.src = '/img/spritesheet.png';
  image.onload = function() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.backgroundColor = '#000';
    spritesheet = image;
    initPlayerPosition();
    initEvents();
    run();
  }
}

function initPlayerPosition() {
  // écrire la fonction qui permet de définir playerRow et playerCol
  // à la position du spawn (noté S dans le tableau).
}

function initEvents() {
  // écrire la fonction qui permet de gérer les évènements clavier afin de
  // faire bouger le joueur dans les quatres directions.
}

function run() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawTiles();
  drawPlayer();
  requestAnimationFrame(run);
}

function drawTiles() {
  // dessiner toutes les cases du tableau à l'écran grâce à la fonction drawImage de canvas !
  // pour rappel: le numéro associé au case indique l'index du sprite dans la spritesheet.
}

function drawPlayer() {
  // dessiner le personnage grâce à la fonction drawImage de canvas !
}