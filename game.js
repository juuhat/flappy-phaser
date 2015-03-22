var game = new Phaser.Game(320, 480, Phaser.CANVAS, null, {preload: preload, create: create, update: update});

var player;
var gravity = 900;
var flapPower = 300;
var pipeSpeed = 50;
var pipes;
var holeSize = 120;

var score;
var scoreText;

function preload() {
	game.load.image("player", "assets/player.png");
	game.load.image("pipe", "assets/pipe.png");
}

function create() {
	game.stage.backgroundColor = "#80CCCC";
	game.physics.startSystem(Phaser.Physics.Arcade);

	scoreText = game.add.text(10,10,"-",{
		font:"bold 16px Arial"
	});

	player = game.add.sprite(80, 240, "player");
	game.physics.arcade.enable(player);
	player.body.gravity.y = gravity;

	var key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	key.onDown.add(function() {
		flap();
	});
		
	pipes = game.add.group();
	game.time.events.loop(4000, addPipe);

	addPipe();

	score = 0;
}

function update() {
	game.physics.arcade.collide(player, pipes, die);
	
	if (player.y < -50 || player.y > 460) {
		die();
	}

	pipes.forEach(function(p) {
		if (p.x <= player.x && !p.hasScored) {
			p.hasScored = true;
			score += 0.5;
			scoreText.text = score;
		}
	});

}

function addPipe() {
	var pipeHolePosition = game.rnd.between(50, 430-holeSize);
	var pipes = new PipeGroup(pipeHolePosition);
}

function flap() {
	player.body.velocity.y = -flapPower;
}

function die() {
	game.state.start(game.state.current);
}

var PipeGroup = function(pipeHolePosition) {
	var upperPipe = game.add.sprite(320, pipeHolePosition-480, "pipe");
	game.physics.arcade.enable(upperPipe, Phaser.Physics.Arcade);
	upperPipe.body.velocity.x = -pipeSpeed;
	pipes.add(upperPipe);

	var lowerPipe = game.add.sprite(320, pipeHolePosition+holeSize, "pipe");
	game.physics.arcade.enable(lowerPipe, Phaser.Physics.Arcade);
	lowerPipe.body.velocity.x = -pipeSpeed;
	pipes.add(lowerPipe);

	this.hasScored = false;
}