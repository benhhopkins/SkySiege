GameObj = function (scene, spriteKey, x, y, team) {
	Phaser.Sprite.call(this, scene.game, x, y, spriteKey, 0);
	this.anchor.setTo(0.5, 0.5);
	this.scene = scene;
	this.team = team;
	this.health = 1;
	this.dead = false;
	this.scene.game.physics.arcade.enable(this);
};

GameObj.prototype = Object.create(Phaser.Sprite.prototype, {
		update: {
			value: function(){ // override
			
				if(this.health <= 0)
				{
					this.dead = true;
				}
				
				if(this.dead)
				{
					this.destroyCallback();
					this.destroy();
				}
			}
		},
		hitCallback: {
			value: function() { // override
			
			}
		},
		destroyCallback: {
			value: function() { // override
			
			}
		}
	});
GameObj.prototype.constructor = GameObj;

Attack = function (scene, spriteKey, x, y, team) {
	Phaser.Sprite.call(this, scene.game, x, y, spriteKey, 0);
	this.anchor.setTo(0.5, 0.5);
	this.scene = scene;
	this.team = team;
	this.damage = 1;
	this.dead = false;
	this.scene.game.physics.arcade.enable(this);
};

Attack.prototype = Object.create(Phaser.Sprite.prototype, {
		update: {
			value: function(){ // override
				if(this.dead)
				{
					this.destroyCallback();
					this.destroy();
				}
			}
		},
		hitUnitCallback: {
			value: function (unit) { // override
				unit.health -= this.damage;
				this.damage = 0;
			}
		},
		hitAttackCallback: {
			value: function (attack) { // override
				
			}
		},
		destroyCallback: {
			value: function () { // override
				
			}
		}
	});
Attack.prototype.constructor = Attack;

Effect = function (scene, x, y, key, animation) {
    Phaser.Sprite.call(this, scene.game, x, y, key, 0);
    this.scene = scene;
    
    this.anchor.setTo(0.5, 0.5);
    
    if(key == 'jets')
    {
        this.animations.add('small', [0, 1, 2, 3, 4, 5], 30);
        this.animations.add('large', [8, 9, 10, 11, 12, 13, 14], 30);
        this.animations.add('down', [16, 17, 18, 19, 20, 21], 30);
        this.animations.add('missile', [24, 25, 26, 27, 28], 30);
    }
    else if(key == 'explosion')
    {
    	this.animations.add('explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8], 20);
    	this.animations.add('explosionsmall', [9, 10, 11, 12, 13, 14, 15, 16], 20);
    }
    
    this.animations.play(animation, 30, false, true);
};

Effect.prototype = Object.create(Phaser.Sprite.prototype);
Effect.prototype.constructor = Effect;


HeartPowerUp = function (scene, x, y) {
    Phaser.Sprite.call(this, scene.game, x, y, 'heart', 0);
    this.scene = scene;

	this.anchor.setTo(0.5, 0.5);    
    this.animations.add('heart', [0, 1], 10, true);
    this.animations.play('heart');
   
    this.scene.game.physics.arcade.enable(this);
    this.body.setSize(12, 12, 2, 2);
    this.body.velocity.x = -25;
};

HeartPowerUp.prototype = Object.create(Phaser.Sprite.prototype);
HeartPowerUp.prototype.constructor = HeartPowerUp;