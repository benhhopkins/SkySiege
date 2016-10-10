BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    
    // ticker for effect frequency
    this.effectTicker = 0;

	// ticker for enemy spawns
	this.waveTicker = 0;
	this.wave = 0;
	this.waveSpawned = false;
	
	// for ending game
	this.endTicker = 0;

    // player object and parameters
    this.mecha = null;
    
    // groups
    this.friendlies = null;
    this.enemies = null;
    this.effects = null;
    
    // score
    this.score = 0;
};

BasicGame.Game.prototype = {

    create: function () {
        // make sure physics is started
        this.physics.startSystem(Phaser.Physics.ARCADE);
        
        // create groups
        this.mechaAttacks = this.add.group();
        this.enemies = this.add.group();
        this.enemyAttacks = this.add.group();
        this.effects = this.add.group();
        this.powerups = this.add.group();
        
        // create player object
        this.mecha = new Mecha(this);
        this.game.add.existing(this.mecha);
        
        // HUD
        this.uibase = this.add.image(0, 144, 'uibase');
        this.uibase.anchor.setTo(0, 1);
        this.hearts = this.add.image(0, 135, 'hearts');
        this.hearts.anchor.setTo(0, 1);
        this.ultrameter = this.add.image(0, 143, 'ultrameter');
        this.ultrameter.anchor.setTo(0, 1);
        
        this.heartsCrop = new Phaser.Rectangle(0, 0, this.hearts.width, this.hearts.height);
        this.ultrameterCrop = new Phaser.Rectangle(0, 0, 0, this.ultrameter.height);
        
        this.hearts.crop(this.heartsCrop);
        this.ultrameter.crop(this.ultrameterCrop);
        
        this.scoreText = this.add.bitmapText(2, 2, 'gem', String(this.score), 16);
        
        // audio
        this.sfxExplode1 = this.add.audio('explode1');
        this.sfxExplode2 = this.add.audio('explode2');
        this.sfxExplode3 = this.add.audio('explode3');
        this.sfxHurt = this.add.audio('hurt');
        
    },

    update: function () {
            // effect ticker counts to 600
            this.effectTicker++;
            if(this.effectTicker >= 600)
            {
                this.effectTicker = 0;
            }
            
            if(this.endTicker == 0)
            {
    			this.scoreText.text = String(this.score);
            	
	            this.waveTicker++;
	    		if(this.waveTicker > 600)
	            {
	            	this.wave++;
	            	this.waveTicker = 1;
	            	this.waveSpawned = false;
	            }
	            
	            if(this.wave == 0)
	            {
	            	if(this.waveTicker % 150 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 1)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
		            	this.enemies.add(new Robo1(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 200 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 2)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
		            	this.enemies.add(new Robo2(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 300 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 3)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
		            	for (var i = 0; i < 3; i++)
		            		this.enemies.add(new Robo1(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 200 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 4)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
		            	
		            	for (var i = 0; i < 3; i++)
		            		this.enemies.add(new Robo2(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 200 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 5)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
	            		this.enemies.add(new Robo2(this, 180, 77));
	            	}
		            
		            if(this.waveTicker % 300 == 0)
		            {
		            	this.enemies.add(new Robo2(this, 180, 77));
		            }
	            }
	            else if(this.wave == 6)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
	            		this.enemies.add(new Robo3(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 300 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 7)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
	            		for (var i = 0; i < 2; i++)
		            		this.enemies.add(new Robo2(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 50 == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
	            }
	            else if(this.wave == 8)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
	            		for (var i = 0; i < 6; i++)
		            		this.enemies.add(new Robo1(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 200 == 0)
		            {
		                this.enemies.add(new Robo2(this, 180, 77));
		            }
	            }
	            else if(this.wave == 8)
	            {
	            	if(!this.waveSpawned)
	            	{
	            		this.waveSpawned = true;
		            	this.enemies.add(new Robo3(this, 180, 77));
	            	}
	            	
	            	if(this.waveTicker % 300 == 0)
		            {
		                this.enemies.add(new Robo3(this, 180, 77));
		            }
	            }
	            else if(this.wave > 8)
	            {
	            	if(this.waveTicker % Math.round(2000 / this.wave) == 0)
		            {
		                this.enemies.add(new Robo1(this, 180, 77));
		            }
		            
		            if(this.waveTicker % Math.round(4000 / this.wave) == 0)
		            {
		                this.enemies.add(new Robo2(this, 180, 77));
		            }
		            
		            if(this.waveTicker % Math.round(10000 / this.wave) == 0)
		            {
		                this.enemies.add(new Robo3(this, 180, 77));
		            }
	            }
            }
            
            // end game
            if(this.endTicker > 0)
            {
            	this.endTicker++;
            	if(this.endTicker == 60)
            	{
            		this.subtitle = this.add.sprite(80, 60, 'gameover');
					this.subtitle.anchor.setTo(0.5, 0.5);
					this.sfxHurt.play();
					
					this.scoreText.text = "SCORE: " + String(this.score);
					this.scoreText.anchor.setTo(0.5, 0.5);
					this.scoreText.x = 80;
					this.scoreText.y = 80;
            	}
            	
            	if(this.endTicker > 60 && this.input.keyboard.isDown(Phaser.Keyboard.Z))
            	{
					this.quitGame();
            	}
            }
        
            // process collisions
            this.physics.arcade.overlap(this.mecha, this.enemyAttacks,
                function (mecha, attack) {
                    attack.hitUnitCallback(mecha);
                    mecha.hitCallback();
                }.bind(this));
            this.physics.arcade.overlap(this.enemies, this.mechaAttacks,
                function (enemy, attack) {
                	attack.hitUnitCallback(enemy);
                    enemy.hitCallback();
                }.bind(this));
            this.physics.arcade.overlap(this.mechaAttacks, this.enemyAttacks,
                function (mechaAttack, enemyAttack) {
                	enemyAttack.hitAttackCallback(mechaAttack);
                	mechaAttack.hitAttackCallback(enemyAttack);
                }.bind(this));
            this.physics.arcade.overlap(this.mecha, this.powerups,
                function (mecha, powerup) {
                	if(mecha.health < 4)
					{
                    	mecha.health++;
						mecha.ultraHP++;
						this.heartsCrop.width = 32 * mecha.health / 4;
						this.hearts.updateCrop();
					}
                    powerup.destroy();
                }.bind(this));
                
            // exit with esc
            if(this.input.keyboard.isDown(Phaser.Keyboard.ESC))
            	this.quitGame();
    },

    quitGame: function () {
        this.state.start('MainMenu');
		this.game.state.remove('Game');
    },
	
	render: function () {
		BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);
	}

};