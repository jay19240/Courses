const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;
const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 320;

const TILE_DIRECTION_UP = 7;
const TILE_DIRECTION_RIGHT = 6;
const TILE_DIRECTION_DOWN = 5;
const TILE_DIRECTION_LEFT = 4;

let playerRow = 0;
let playerCol = 0;

let map = [
  ['3','0','0','0','0','0','0','0','0','1'],
  ['0','0','0','0','0','0','2','0','0','0'],
  ['0','0','0','0','0','0','2','0','S','0'],
  ['0','0','0','0','0','0','2','0','0','0']
];

let currentDirection = TILE_DIRECTION_UP;
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
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] == 'S') {
        playerRow = i;
        playerCol = j;
      }
    }
  }
}

function initEvents() {
  document.addEventListener("keydown", handleKeyDownEvent);
}

function run() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      drawTile(i, j);
    }
  }

  drawPlayer();

  requestAnimationFrame(run);
}

function drawTile(row, col) {
  let index = parseInt(map[row][col]);
  let sx = index * TILE_WIDTH;
  let sy = 0;
  let dx = col * TILE_WIDTH;
  let dy = row * TILE_HEIGHT;
  ctx.drawImage(spritesheet, sx, sy, TILE_WIDTH, TILE_HEIGHT, dx, dy, TILE_WIDTH, TILE_HEIGHT);
}

function drawPlayer() {
  let sx = currentDirection * TILE_WIDTH;
  let sy = 0;
  let dx = playerCol * TILE_WIDTH;
  let dy = playerRow * TILE_HEIGHT;
  ctx.drawImage(spritesheet, sx, sy, TILE_WIDTH, TILE_HEIGHT, dx, dy, TILE_WIDTH, TILE_HEIGHT);
}

function handleKeyDownEvent(e) {
  let nextPlayerRow = playerRow;
  let nextPlayerCol = playerCol;

  if (e.key == "Up" || e.key == "ArrowUp") {
    currentDirection = TILE_DIRECTION_UP;
    nextPlayerRow--;
  }
  if (e.key == "Right" || e.key == "ArrowRight") {
    currentDirection = TILE_DIRECTION_RIGHT;
    nextPlayerCol++;
  }
  if (e.key == "Down" || e.key == "ArrowDown") {
    currentDirection = TILE_DIRECTION_DOWN;
    nextPlayerRow++;
  }
  else if (e.key == "Left" || e.key == "ArrowLeft") {
    currentDirection = TILE_DIRECTION_LEFT;
    nextPlayerCol--;
  }

  if (nextPlayerCol < 0 || nextPlayerCol >= map[0].length) {
    return;
  }
  if (nextPlayerRow < 0 || nextPlayerRow >= map.length) {
    return;
  }
  if (map[nextPlayerRow][nextPlayerCol] == 1) {
    return;
  }

  if (map[nextPlayerRow][nextPlayerCol] == '2') {
    map[nextPlayerRow][nextPlayerCol] = '0';
    playerRow = nextPlayerRow;
    playerCol = nextPlayerCol;
  }
  else {
    playerRow = nextPlayerRow;
    playerCol = nextPlayerCol;
  }
}