
BasicGame.MainMenu = function (game) {
	this.title = null;
	this.subtitle = null;

	this.music = null;
	
	this.mecha = null;
};

BasicGame.MainMenu.prototype = {

	create: function () {
		this.sound.volume = 0.3;
		
		if(!this.music)
		{
			this.music = this.add.audio('music', 0.7, true);
			this.music.play();
		}
		
		this.playKey = this.input.keyboard.addKey(Phaser.Keyboard.Z);
    	this.musicKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    	this.soundKey = this.input.keyboard.addKey(Phaser.Keyboard.S);

		this.title = this.add.sprite(80, 20, 'title');
		this.title.anchor.setTo(0.5, 0.5);
		this.subtitle = this.add.sprite(80, 32, 'subtitle');
		this.subtitle.anchor.setTo(0.5, 0.5);
		this.subtitle.flashTimer = 0;
		this.titleFooter = this.add.sprite(0, 144, 'titleFooter');
		this.titleFooter.anchor.setTo(0, 1);
		this.directions = this.add.image(0, 0, 'directions');
		this.start = this.add.image(80, 90, 'start');
		this.start.anchor.setTo(0.5, 0);

		this.physics.startSystem(Phaser.Physics.ARCADE);
	},

	update: function () {
		this.subtitle.flashTimer++;
		if(this.subtitle.flashTimer > 30)
		{
			this.subtitle.flashTimer = 0;
			if(this.subtitle.y == 32)
			{
				this.subtitle.y = -32;
				this.start.y = -32;
			}
			else
			{
				this.subtitle.y = 32;
				this.start.y = 90;
			}
		}
		
		if (this.playKey.downDuration())
		{
			this.startGame();
		}
		
		if (this.musicKey.downDuration())
		{
			if(this.music.volume == 0)
				this.music.volume = 0.7;
			else
				this.music.volume = 0;
		}
		
		if (this.soundKey.downDuration())
		{
			if(this.sound.volume == 0)
				this.sound.volume = 0.3;
			else
				this.sound.volume = 0;
		}
	},

	startGame: function (pointer) {
		this.game.state.add('Game', BasicGame.Game);
		this.state.start('Game');
	},
	
	render: function () {
		BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);
	}

};
