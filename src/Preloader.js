
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(80, 72, 'loading');
		this.background.anchor.x = 0.5;
		this.background.anchor.y = 0.5;
		this.preloadBar = this.add.sprite(80, 72, 'loaded');
		this.preloadBar.anchor.x = 0.5;
		this.preloadBar.anchor.y = 0.5;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		this.load.image('title', 'images/title.png');
		this.load.image('subtitle', 'images/subtitle.png');
		this.load.image('titleFooter', 'images/title_footer.png');
		this.load.image('directions', 'images/directions.png');
		this.load.image('start', 'images/start.png');
		
		this.load.audio('music', ['sounds/Fierce_Fighter_Loop.ogg']);
		
		this.load.audio('slash1', ['sounds/slash1.wav']);
		this.load.audio('slash2', ['sounds/slash2.wav']);
		this.load.audio('explode1', ['sounds/Large_Explosion.ogg']);
		this.load.audio('explode2', ['sounds/Large_Explosion2.ogg']);
		this.load.audio('explode3', ['sounds/Small_Explosion.ogg']);
		this.load.audio('hurt', ['sounds/hurt.wav']);
		this.load.audio('ultra', ['sounds/ULTRA_PowerUP.ogg']);
		this.load.audio('ultra', ['sounds/Dash.ogg']);
		this.load.audio('missile', ['sounds/Enemy_Fire_Missile.ogg']);
		
		this.load.spritesheet('mecha', 'images/mecha.png', 32, 32);
		this.load.spritesheet('robo1', 'images/robo1.png', 32, 32);
		this.load.spritesheet('robo2', 'images/robo2.png', 32, 32);
		this.load.spritesheet('robo3', 'images/robo3.png', 32, 32);
		
		this.load.spritesheet('bladeattacks', 'images/bladeattacks.png', 32, 32);
		this.load.spritesheet('ultraattack', 'images/ultraattack.png', 64, 64);
		this.load.spritesheet('roboattacks', 'images/roboattacks.png', 16, 16);
		
		this.load.spritesheet('bladeidle', 'images/bladeidle.png', 32, 32);
		this.load.spritesheet('jets', 'images/jets.png', 16, 16);
		this.load.spritesheet('explosion', 'images/explosion.png', 32, 32);
		this.load.spritesheet('heart', 'images/heart.png', 16, 16);
		
		this.load.image('uibase', 'images/uibase.png');
		this.load.image('hearts', 'images/hearts.png');
		this.load.image('ultrameter', 'images/ultrameter.png');
		this.load.image('gameover', 'images/gameover.png');
		
		this.load.bitmapFont('gem', 'images/gem.png', 'images/gem.xml');

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('music') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	},
	
	render: function () {
		BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);
	}

};
