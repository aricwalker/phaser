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
  game.load.image('ball', 'assets/ball.png')
}

var background
var paddle
var ball

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  background = game.add.sprite(0, 0, 'background')
  background.width = width
  background.height = height

  paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_blue.png')
  paddle.anchor.setTo(0.5, 0.5)
  game.physics.enable(paddle, Phaser.Physics.ARCADE)
  paddle.body.collideWorldBounds = true

  ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball')
  ball.scale.setTo(0.04, 0.04)
  game.physics.enable(ball, Phaser.Physics.ARCADE)
  ball.body.collideWorldBounds = true
  ball.body.bounce.set(1)

  ball.body.velocity.x = 100
  ball.body.velocity.y = 175
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
