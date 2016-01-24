var game = new Phaser.Game(320, 480, Phaser.CANVAS, null, {preload: preload, create: create, update: update});

//gameobjects
var player;
var pipes;

//variables affecting gameplay
var gravity = 900;
var flapPower = 300;
var pipeSpeed = 50;
var holeSize = 120;

//variables for tracking and showing score
var score;
var scoreText;

//Executed at the beginning, load assets here
function preload() {
	game.load.image("player", "assets/player.png");
	game.load.image("pipe", "assets/pipe.png");
}

//Called after preload function, initialize game, sprites, etc.
function create() {
	game.stage.backgroundColor = "#80CCCC";
	game.physics.startSystem(Phaser.Physics.Arcade);

	//add player as sprite and enable physics
	player = game.add.sprite(80, 240, "player");
	game.physics.arcade.enable(player);
	player.body.gravity.y = gravity;

	//listening keyboard input
	var key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	key.onDown.add(function() {
		flap();
	});

	//init pipes group and add timer to add new pipes periodically
	pipes = game.add.group();
	game.time.events.loop(4000, addPipes);

	//init score and text showing it
	score = 0;
	scoreText = game.add.text(10, 10 , "0", {
		font:"bold 16px Arial"
	});

	//add one pipe group for game start
	addPipes();
}

//Called 60 times per second, update game logic here
function update() {

	//check for pipe collision
	game.physics.arcade.collide(player, pipes, die);
	
	//check for ground or ceiling collision
	if (player.y < -50 || player.y > 460) {
		die();
	}

	//loop through pipes to see if player has passed one
	pipes.forEach(function(p) {
		if (p.x + 50 <= player.x && p.hasScored == false) {
			p.hasScored = true;
			score += 1;
			scoreText.text = score;
		}
	});
}

//modifying player's velocity on y-axis
function flap() {
	player.body.velocity.y = -flapPower;
}

//player is killed, restarting game
function die() {
	game.state.start(game.state.current);
}

//generate random hole position and create new pair of pipes
function addPipes(pipeHolePosition) {

	//generate random position for hole
	var pipeHolePosition = game.rnd.between(50, 430 - holeSize);

	//create upper pipe, notice hasScored attribute which will be needed with scoring
	var upperPipe = game.add.sprite(320, pipeHolePosition - 480, "pipe");
	upperPipe.hasScored = false;
	game.physics.arcade.enable(upperPipe, Phaser.Physics.Arcade);
	upperPipe.body.velocity.x = -pipeSpeed;
	pipes.add(upperPipe);

	//create lower pipe
	var lowerPipe = game.add.sprite(320, pipeHolePosition + holeSize, "pipe");
	game.physics.arcade.enable(lowerPipe, Phaser.Physics.Arcade);
	lowerPipe.body.velocity.x = -pipeSpeed;
	pipes.add(lowerPipe);
}