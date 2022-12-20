class Game {
  //criar o botao de resetar o jogo e tambem o placar da partida(dizer quem esta em 1º e 2º)
  constructor() {
    //cria o botao de reset/resetar
    this.reset = createButton("");

    //cria o titulo do botao reset
    this.resetTittle = createElement("h2");

    //titulo do placar do jogo
    this.leaderTittle = createElement("h2");

    //cria o 1º lugar/colocado
    this.leader1 = createElement("h2");

    //cria o 2º lugar/colocado
    this.leader2 = createElement("h2");

    this.moving = false;

    this.tecla = false;

    this.tecla2 = false;

    this.explodiu = false;
  }

  //
  showElements() {
    this.resetTittle.html("resetar");

    this.resetTittle.class("resetText");

    this.resetTittle.position(width / 2 + 200, 50);

    this.reset.class("resetButton");

    this.reset.position(width / 2 + 230, 100);

    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.leaderTittle.html("Placar");
    this.leaderTittle.class("resetText");
    this.leaderTittle.position(width / 3 - 60, 50);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);
  }

  //funcao de vericar se o jogo estiver funcionando, seu estado
  obterEstado() {
    var estado = database.ref("gameState"); //gameState = estado do jogo/database
    estado.on("value", (data) => {
      gameState = data.val(); //val = valor/value
    });
  }

  //funcao de atualizar o estado do jogo
  atualizarEstado(valor) {
    // "/" = banco de dados
    database.ref("/").update({
      //atualizar o banco de dados

      gameState: valor,
    });
  }

  start() {
    form = new Form(); //cria o formulario

    form.display(); //mostra o formulario na tela pro jogador

    player = new Player();

    player.obtercontagem();

    //-----------------------------------------------------------------------

    //posicao do carro 1
    carro1 = createSprite(width / 2 - 50, height - 100);

    //carregar a imagem do carro 1
    carro1.addImage("carro", carroimagem1);

    carro1.addImage("explodindo", explosao);

    //tamanho da imagem do carro1 (porque o tamanho da imagem é grande)
    carro1.scale = 0.07;

    //posicao do carro 2
    carro2 = createSprite(width / 2 + 100, height - 100);

    //carregar a imagem do carro 2
    carro2.addImage("carro", carroimagem2);

    carro2.addImage("explodindo", explosao);

    //tamanho da imagem do carro2 (porque o tamanho da imagem é grande)
    carro2.scale = 0.07;

    //carros = grupo de carros (carro 1 e 2)
    carros = [carro1, carro2];

    //-------------------------------------------------------------------------------

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image },
    ];

    gasolinas = new Group();
    this.createItems(gasolinas, 5, gasolinasimagem, 0.02);

    obstaculos = new Group();
    this.createItems(
      obstaculos,
      obstaclesPositions.length,
      obstacle1Image,
      0.05,
      obstaclesPositions
    );

    moedas = new Group();
    this.createItems(moedas, 20, moedasimagens, 0.09);
  }

  play() {
    //esconder o formulario
    form.hide();

    this.showElements();

    this.resetar();

    //ler o jogadores
    Player.readPlayers();

    if (todosplayers !== undefined) {
      image(pista, 0, -height * 5, width, height * 6);

      this.showLeaderboard();

      this.showgasolina();

      this.showvida();

      var index = 0;

      for (var p in todosplayers) {
        index = index + 1;

        var x = todosplayers[p].positionx;

        var y = height - todosplayers[p].positiony;
        //---------------------------------------------
        var life = todosplayers[p].life;

        if (life <= 0) {
          carros[index - 1].changeImage("explodindo");

          carros[index - 1].scale = 0.3;
        }
        //---------------------------------------------
        carros[index - 1].position.x = x;

        carros[index - 1].position.y = y;

        if (index === player.index) {
          //a camera acompanha a posicao y do jogador

          camera.position.y = carros[index - 1].position.y;

          this.addGasolinas(index);

          this.addMoedas(index);

          this.colision(index);

          this.colisaodecarros(index);

          if (player.life <= 0) {
            this.explodiu = true;
          }
        }
      }

      this.controles();

      var chegada = height * 6 - 100;

      if (player.positiony > chegada) {
        gameState = 2;

        player.rank += 1;

        player.atualizarposicao();

        this.showRank();
      }

      drawSprites();
    }
  }

  controles() {
    // ! = não
    if (!this.explodiu) {
      //--------------------------------------------------------------------------------------------------
      if (keyIsDown(UP_ARROW)) {
        //mudar a velociade dos jogadores quando for pra cima EX: quanto maior o numero mias rapido ele vai e vice versa
        player.positiony += 10;

        player.atualizarposicao();

        this.moving = true;

        this.tecla2 = false;
      }

      //--------------------------------------------------------------------------------
      else if (keyIsDown(RIGHT_ARROW)) {
        //mudar a velociade dos jogadores quando for pra direita EX: quanto maior o numero mias rapido ele vai e vice versa
        player.positionx += 10;

        player.atualizarposicao();

        this.moving = true;

        this.tecla = true;
      }

      //-----------------------------------------------------------------------------
      else if (keyIsDown(LEFT_ARROW)) {
        //mudar a velociade dos jogadores quando for pra esquerda EX: quanto maior o numero mias rapido ele vai e vice versa
        player.positionx -= 10;

        player.atualizarposicao();

        this.moving = true;

        this.tecla = false;
      }

      //-------------------------------------------------------------------------------
      else if (keyIsDown(DOWN_ARROW)) {
        //mudar a velociade dos jogadores quando for pra cima EX: quanto maior o numero mias rapido ele vai e vice versa
        player.positiony -= 10;

        player.atualizarposicao();

        this.moving = true;

        this.tecla2 = true;
      } else {
        this.moving = false;
      }
      //-----------------------------------------------------------------------------------
    }
  }

  //se o player 1 ganhar o jogo ele fica em primeiro lugar na tela
  //se o player 2 ganhar o jogo ele fica em primeiro lugar na tela
  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(todosplayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    Essa etiqueta é usada para exibir quatro espaços.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  resetar() {
    this.reset.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,

        gameState: 0,

        players: {},
      });

      location.reload();
    });
  }

  createItems(grupos, numero, imagem, scale, matrix = []) {
    //criar os obstaculos e itens do jogo, vao aparecer aleatoriamente no mapa e vão ser coletaveis ou irao te prejudicar caso os toque
    //grupos = qual o grupo vai ser adicionado, EX: pode ser uma moeda, obstaculo ou gasolina

    //numero = quantidade de cada iten tera no jogo
    //
    // obstaculos = balanciado o numero de obstaculos no mapa
    //

    //gerar varias itens de uma vez só
    //os itens do jogo vao aperecer no mapa apenas na pista de corrida de acordo com sua posicao x e y
    for (var i = 0; i < numero; i++) {
      var x;
      var y;

      if (matrix.length > 0) {
        x = matrix[i].x;

        y = matrix[i].y;

        imagem = matrix[i].image;
      } else {
        x = random(width / 2 + 150, width / 2 - 150);

        y = random(-height * 4.5, height - 400);
      }

      var sprite = createSprite(x, y);

      sprite.addImage(imagem);
      sprite.scale = scale;

      grupos.add(sprite);
    }
  }

  addGasolinas(index) {
    //adicionando combustível
    carros[index - 1].overlap(gasolinas, function (collector, collected) {
      player.fuel = 200;
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });

    if (player.fuel > 0 && this.moving) {
      player.fuel -= 0.5;
    }

    if (player.fuel <= 0) {
      gameState = 2;

      this.gameOver();
    }
  }

  addMoedas(index) {
    carros[index - 1].overlap(moedas, function (collector, collected) {
      player.score += 20;
      player.atualizarposicao();
      //o sprite é coletado no grupo de colecionáveis que desencadeou
      //o evento
      collected.remove();
    });
  }

  showvida() {
    push();
    image(vida, width / 2 - 130, height - player.positiony - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positiony - 400, 200, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positiony - 400, player.life, 20);
    noStroke();
    pop();
  }

  showgasolina() {
    push();
    image(
      gasolinasimagem,
      width / 2 - 130,
      height - player.positiony - 300,
      20,
      20
    );
    fill("white");
    rect(width / 2 - 100, height - player.positiony - 300, 200, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.positiony - 300, player.fuel, 20);
    noStroke();
    pop();
  }

  showRank() {
    swal({
      //sweet alert = swal
      title: `Incrível!${"\n"}Rank${"\n"}${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }

  gameOver() {
    swal({
      //sweet alert = swal
      title: `Fim de Jogo`,
      text: "Oops você perdeu a corrida!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigado por jogar",
    });
  }

  colision(index) {
    // -= -> ele mesmo
    if (carros[index - 1].collide(obstaculos)) {
      if (this.tecla) {
        player.positionx -= 100;
      } else {
        player.positionx += 100;
      }

      if (this.tecla2) {
        player.positiony += 100;
      } else {
        player.positiony -= 100;
      }

      if (player.life > 0) {
        player.life -= 50;
      }

      player.atualizarposicao();
    }
  }

  colisaodecarros(index) {
    if (index == 1) {
      if (carros[index - 1].collide(carros[1])) {
        if (this.tecla) {
          player.positionx -= 100;
        } else {
          player.positionx += 100;
        }

        if (this.tecla2) {
          player.positiony += 100;
        } else {
          player.positiony -= 100;
        }

        if (player.life > 0) {
          player.life -= 50;
        }

        player.atualizarposicao();
      }
    }

    if (index == 2) {
      if (carros[index - 1].collide(carros[0])) {
        if (this.tecla) {
          player.positionx -= 100;
        } else {
          player.positionx += 100;
        }

        if (this.tecla2) {
          player.positiony += 100;
        } else {
          player.positiony -= 100;
        }

        if (player.life > 0) {
          player.life -= 50;
        }

        player.atualizarposicao();
      }
    }
  }
}
