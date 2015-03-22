var playState = function(game) {}

var player;
var gravity = 900;
var flapPower = 400;

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
		key.onDown.add(function(key) {
			flap();
		});

	},

	update: function() {
		
	}
}

function flap() {
	player.body.velocity.y = -flapPower;
}