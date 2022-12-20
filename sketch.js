var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player, game;
var playerCount; //contagem de players totais
var gameState; //estado de jogo
var todosplayers; 

//var dos obstaculos, moedas, itens do jogo
var obstaculos, gasolinas, moedas

//var das imagens dos obstaculos, moedas e itens do jogo
var obstacle1Image, obstacle2Image, gasolinasimagem, moedasimagens, vida //(vida é uma imagem e nao um iten do jogo)

//var dos carros do jogo
var carro1, carro2, carros, explosao

//var das imagens dos carros
var carroimagem1, carroimagem2


var pista


function preload() {
  //pre carrega as imagens
  backgroundImage = loadImage("./assets/planodefundo.png");

  carroimagem1 = loadImage("./assets/car1.png");

  carroimagem2 = loadImage("./assets/car2.png");

  pista = loadImage("./assets/track.jpg");

  obstacle1Image = loadImage("./assets/obstacle1.png");

  obstacle2Image = loadImage("./assets/obstacle2.png");

  gasolinasimagem = loadImage("./assets/fuel.png");

  moedasimagens = loadImage("./assets/goldCoin.png");

  vida = loadImage("./assets/life.png");

  explosao = loadImage("./assets/blast.png");

}

function setup() {
  //função de configuração
  canvas = createCanvas(windowWidth, windowHeight);
  
  database = firebase.database(); //ligando o banco de dados

  game = new Game(); //criando um novo jogo

  game.obterEstado();

  game.start(); //iniciando um novo jogo

  bgImg = backgroundImage;
}

function draw() {
  background(bgImg);

  if (playerCount===2){

    game.atualizarEstado(1);

  }

  if (gameState===1){

    game.play()

  }
}

function windowResized() {
  //estica ou diminui a tela
  resizeCanvas(windowWidth, windowHeight);
}

