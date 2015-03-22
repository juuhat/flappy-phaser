var playState = function(game) {}

var player;
var gravity = 900;
var flapPower = 300;
var pipeSpeed = 50;
var pipes;

playState.prototype = {
	preload: function() {
		this.load.image("player", "assets/player.png");
		this.load.image("pipe", "assets/pipe.png");
	},

	create: function() {
		this.stage.backgroundColor = "#80CCCC";
		this.physics.startSystem(Phaser.Physics.Arcade);

		player = this.add.sprite(80, 240, "player");
		this.physics.arcade.enable(player);
		player.body.gravity.y = gravity;

		var key = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		key.onDown.add(function() {
			this.flap();
		}, this);
		
		pipes = this.add.group();
		this.time.events.loop(4000, this.addPipe, this);

		this.addPipe();

	},

	update: function() {
		this.physics.arcade.collide(player, pipes, this.die, null, this);

		if (player.y < -50 || player.y > 460) {
			this.die();
		}

	},

	addPipe: function() {
		var pipeHole = 100;
		var pipeHolePosition = this.rnd.between(50, 430-pipeHole);
		
		var upperPipe = this.add.sprite(320, pipeHolePosition-480, "pipe");
		this.physics.arcade.enable(upperPipe, Phaser.Physics.Arcade);
		upperPipe.body.velocity.x = -pipeSpeed;
		pipes.add(upperPipe);

		var lowerPipe = this.add.sprite(320, pipeHolePosition+pipeHole, "pipe");
		this.physics.arcade.enable(lowerPipe, Phaser.Physics.Arcade);
		lowerPipe.body.velocity.x = -pipeSpeed;
		pipes.add(lowerPipe);
	},

	flap: function() {
		player.body.velocity.y = -flapPower;
	},

	die: function(game) {
		this.state.start("Play");
	}

}