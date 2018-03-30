var width = 800
var height = 600
var game = new Phaser.Game(
  width,
  height,
  Phaser.AUTO,
  '',
  { preload: preload, create: create, update: update });

function preload() {
  game.load.atlas('breakout', 'assets/breakout-set.png', 'assets/breakout-set.json')
  game.load.image('background', 'assets/starfield-bg.jpg')
}

var background
var paddle

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  background = game.add.sprite(0, 0, 'background')
  background.width = width
  background.height = height

  paddle = game.add.sprite(0, 500, 'breakout', 'paddle_blue.png')
  paddle.anchor.setTo(0.5, 0.5)
  game.physics.enable(paddle, Phaser.Physics.ARCADE)
  paddle.body.collideWorldBounds = true;
}

function update() {
  var buffer = 32
  paddle.x = game.input.x

  if (paddle.x < buffer) {
    paddle.x = buffer
  } else if (paddle.x > (width - buffer)) {
    paddle.x = (width - buffer)
  }
}