// O formulário serve para cadastrar os jogadores
//ele é a primeira coisa que carrega quando o jogo inicia

class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome"); //caixa de entrada para escrever o nome
    this.playButton = createButton("Jogar"); //botao para começar a jogar
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo"); //titulo do jogo
    this.greeting = createElement("h2"); //cumprimento, dialogo com o jogador
  }

  posicaoNaTela() {
    this.titleImg.position(120, 50);
    this.input.position(width / 2, height / 2);
    this.playButton.position(width / 2, height / 2 + 50);
    this.greeting.position(width / 2, height / 2);

    //estilo dos elementos na tela
    //encontre no arquivo style.css
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  mousePressed() {

    this.playButton.mousePressed(()=>{

      this.playButton.hide();
      this.input.hide();
      //br = break
      this.greeting.html(`Bem vido a Corrida ${this.input.value()},</br> chega de perde tempo, começe a corrida`) // ``="" formar diferente de usar as aspas
      
      //qunado alguem jogador entrar, ira adicionar +1 jogador 
      playerCount+=1

      //salvar o nome do jogador que colocou seu nome no "this.imput ou formulario"
      player.name = this.input.value();

      //quando um jogador entrar no jogo, ele vai ter o numero da quantidade de jogadores
      //EX: se tiver 3 jogadores na partida, se vocer for o ultimo jogador a entrar entao voce vai ser o "Player3"
      player.index = playerCount

      //adicionar jogador
      player.addplayer();

      //atulaizar a contagem quando o jogador entrar na partida
      player.atualizarcontagem(playerCount);

      // ler as posicoes "x" e "y" dos jogadores
      player.obterdistancia();

    })


  }

  //esconder
  hide() {
    //quando o jogo começar , o hide irá esconder os seguintes textos:
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  display() {
    //mostrar tudo na tela
    this.posicaoNaTela();
    this.mousePressed();
  }
}
