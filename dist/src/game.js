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
var gameStarted = false
var baseSpeed = 100

var brickRows = 4
var bricksPerRow = 15
var speedBrickIndex = Math.floor(Math.random() * 60)

var bricks
var normalBrick
var speedBrick

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  background = game.add.sprite(0, 0, 'background')
  background.width = width
  background.height = height

  paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_blue.png')
  paddle.anchor.setTo(0.5, 0.5)
  game.physics.enable(paddle, Phaser.Physics.ARCADE)
  paddle.body.collideWorldBounds = true
  paddle.body.immovable = true

  ball = game.add.sprite(game.world.centerX, paddle.y - 25, 'ball')
  ball.scale.setTo(0.04, 0.04)
  game.physics.enable(ball, Phaser.Physics.ARCADE)
  ball.body.collideWorldBounds = true
  ball.body.bounce.set(1)

  createBricks()

  game.input.onDown.add(function() {
    if (gameStarted == false) {
      gameStarted = true
      ball.body.velocity.x = Math.floor(Math.random() * leftOrRight() * 200)
      ball.body.velocity.y = Math.floor(Math.random() * -150) - baseSpeed
    }
  })
}

function update() {
  var buffer = 32
  paddle.x = game.input.x

  if (!gameStarted) {
    ball.x = game.input.x
  }

  if (paddle.x < buffer) {
    paddle.x = buffer
  } else if (paddle.x > (width - buffer)) {
    paddle.x = (width - buffer)
  }

  game.physics.arcade.collide(ball, paddle, ballAndPaddleCollide, null, this)
  game.physics.arcade.collide(ball, bricks, ballAndBrickCollide, null, this)
}


//============================================================================//

function createBricks() {
  var leftmostEdge = 95
  var brickWidth = 40
  var topmostEdge = 140
  var verticalSpacing = 50

  bricks = game.add.group()
  bricks.enableBody = true
  bricks.physicsBodyType = Phaser.Physics.ARCADE

  // Go through each row
  for(var row = 0; row < brickRows; row++) {
    // Go through the number of bricks per row
    for(var brickIndex = 0; brickIndex < bricksPerRow; brickIndex++) {
      var brickNumber = ((row * bricksPerRow) + brickIndex)

      // Create brick
      normalBrick = bricks.create(
        leftmostEdge + (brickWidth * brickIndex),
        topmostEdge + (verticalSpacing * row),
        'breakout',
        colorForBrick(brickNumber, row))
      normalBrick.scale.setTo(1.2, 1.2)
      normalBrick.body.bounce.set(1);
      normalBrick.body.immovable = true;
    }
  }

  bricks.children[speedBrickIndex].speedBrick = true
}

function colorForBrick(brickNumber, row) {
  console.log(brickNumber)
  if (speedBrickIndex == brickNumber) {
    return 'brick_speed.png'
  } else {
    return colorForRow(row)
  }
}

// row: 0 - first row, 1 - second row, etc..
function colorForRow(row) {
  if (row == 0) {
    return 'brick_blue.png'
  } else if (row == 1) {
    return 'brick_green.png'
  } else if (row == 2) {
    return 'brick_red.png'
  } else if (row == 3) {
    return 'brick_purple.png'
  }
}

// Generate a random number,
//  odd goes to the left
//  even goes to the right
// -1 for the left, 1 for the right
function leftOrRight() {
  random = Math.floor(Math.random() * 10)
  if (random % 2 == 0) {
    return 1
  } else {
    return -1
  }
}

function ballAndPaddleCollide(_ball, _paddle) {
  if (_ball.x < _paddle.x) {
    difference = _paddle.x - _ball.x
    _ball.body.velocity.x = (-10 * difference)
  } else {
    difference = _ball.x - _paddle.x
    _ball.body.velocity.x = (10 * difference)
  }
}

function ballAndBrickCollide(_ball, _brick) {
  _brick.kill()
  if (_brick.speedBrick) {
    doubleSpeed()
  }
}

function doubleSpeed() {
  ball.body.velocity.y += ball.body.velocity.y
  ball.body.velocity.x += ball.body.velocity.y
}
