Mecha = function (scene) {
    GameObj.call(this, scene, 'mecha', 80, 72, 0);
    
    this.health = 4;
    
    this.animations.add('idle', [0], 30, true);
    this.animations.add('up', [4], 30, true);
    this.animations.add('down', [8], 30, true);
    this.animations.add('attack', [12, 13, 14, 15, 16, 17, 18, 19], 30, false);
    this.animations.add('ultra', [20, 21, 22, 23], 30, true);
    
    this.blade = this.scene.game.make.sprite(-11, 6, 'bladeidle');
    this.blade.anchor.setTo(0.5, 0.5);
    this.blade.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7], 30, true);
    this.blade.animations.play('idle');
    this.addChild(this.blade);
    
    this.attackFrames = 0;
    
    this.body.setSize(8, 8, 12, 12);
    
    this.state = 'idle';
    this.ultraTicks = 0;
    this.ultraHP = 4;
    
    // set up controls
    this.dpad = this.scene.input.keyboard.createCursorKeys();
    this.attackKey = this.scene.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.dashKey = this.scene.input.keyboard.addKey(Phaser.Keyboard.X);
    
    // control parameters
    this.speedXMax = 70;
    this.speedYMax = 120;
    
    // sounds
    this.sfxSlash1 = this.scene.add.audio('slash1');
    this.sfxSlash2 = this.scene.add.audio('slash2');
    this.sfxUltra = this.scene.add.audio('ultra');
};

Mecha.prototype = Object.create(GameObj.prototype, {
    update: {
        value: function(){ // override
            if (this.dpad.left.isDown &&
                !this.dpad.right.isDown &&
                this.body.velocity.x > -this.speedXMax &&
                this.state != 'attack')
            {
            	if(this.state == 'idle')
                	this.body.velocity.x -= 5;
                else
                	this.body.velocity.x -= 10;
                if(this.body.velocity.x < -this.speedXMax)
                    this.body.velocity.x = -this.speedXMax;
            }
            else if (this.dpad.right.isDown &&
                !this.dpad.left.isDown &&
                this.body.velocity.x < this.speedXMax &&
                this.state != 'attack')
            {
                if(this.state == 'idle')
                	this.body.velocity.x += 5;
                else
                	this.body.velocity.x += 10;
                if(this.body.velocity.x > this.speedXMax)
                    this.body.velocity.x = this.speedXMax;
            }
            else
            {
                this.body.velocity.x *= 0.95;
                if(Math.abs(this.body.velocity.x) < 10)
                    this.body.velocity.x = 0;
            }
            
            if (this.dpad.up.isDown &&
                !this.dpad.down.isDown &&
                this.state != 'attack')
            {
                if(this.body.velocity.y > -this.speedYMax)
                {
                    this.body.velocity.y -= 10;
                    if(this.body.velocity.y < -this.speedYMax)
                        this.body.velocity.y = -this.speedYMax;
                }
                
                if(this.state == 'idle')
                	this.animations.play('up');
                this.blade.y = 8;
                    
                if(this.dpad.up.downDuration())
                {
                    this.scene.effects.add(new Effect(this.scene, this.x + 2, this.y + 8, 'jets', 'large'));
                    this.scene.effects.add(new Effect(this.scene, this.x - 2, this.y + 10, 'jets', 'large'));
                    
                    this.body.velocity.y -= 20;
                }
                
                if(this.scene.effectTicker % 15 == 0)
                {
                    this.scene.effects.add(new Effect(this.scene, this.x + 2, this.y + 8, 'jets', 'small'));
                    this.scene.effects.add(new Effect(this.scene, this.x - 2, this.y + 10, 'jets', 'small'));
                }
            }
            else if (this.dpad.down.isDown &&
                !this.dpad.up.isDown &&
                this.state != 'attack')
            {
                if(this.body.velocity.y < this.speedYMax)
                {
                    this.body.velocity.y += 10;
                    if(this.body.velocity.y > this.speedYMax)
                        this.body.velocity.y = this.speedYMax;
                }
                
                if(this.state == 'idle')
                	this.animations.play('down');
                this.blade.y = 4;
                    
                if(this.dpad.down.downDuration())
                {
                    this.scene.effects.add(new Effect(this.scene, this.x + 4, this.y - 7, 'jets', 'down'));
                    this.scene.effects.add(new Effect(this.scene, this.x - 4, this.y - 6, 'jets', 'down'));
                    
                    this.body.velocity.y += 20;
                }
            }
            else
            {
                this.body.velocity.y *= 0.95;
                if(Math.abs(this.body.velocity.y) < 10)
                    this.body.velocity.y = 0;
                    
                if(this.state == 'idle')
                {
                    this.animations.play('idle');
                    this.blade.y = 6;
                }
                    
                if(this.scene.effectTicker % 30 == 0)
                {
                    this.scene.effects.add(new Effect(this.scene, this.x + 2, this.y + 8, 'jets', 'small'));
                    this.scene.effects.add(new Effect(this.scene, this.x - 2, this.y + 10, 'jets', 'small'));
                }
            }
            
            // keep player in-bounds
            if(this.x < 0)
            {
                this.body.velocity.x = 30;
            }
            else if(this.x > 140)
            {
                this.body.velocity.x = -30;
            }
            if(this.y < 0)
            {
                this.body.velocity.y = 10;
            }
            else if(this.y > 144)
            {
                this.body.velocity.y = -30;
            }
            
            // start ultra mode
            if(this.state != 'ultra' && this.scene.ultrameterCrop.width >= 39)
            {
            	this.ultraTicks = 300;
            	this.state = 'ultra';
				this.ultraHP = this.health;
            	this.animations.play('ultra');
            	this.sfxUltra.play();
            }
            
            if(this.state == 'ultra')
            {
            	if(this.scene.effectTicker % 2 == 0)
            	{
            		this.scene.ultrameterCrop.width = 39;
            	}
            	else
            	{
            		this.scene.ultrameterCrop.width = 0;
            	}
            	this.scene.ultrameter.updateCrop();
            	
            	if(this.ultraTicks % 20 == 0)
            	{
            		this.scene.mechaAttacks.add(new UltraAttack(this.scene, this.x, this.y));
            	}
            	
            	this.ultraTicks--;
            	if(this.ultraTicks <= 0)
            	{
            		this.state = 'idle';
					if(this.ultraHP > this.health)
						this.health = this.ultraHP;
            		this.scene.ultrameterCrop.width = 0;
            		this.scene.ultrameter.updateCrop();
            	}
            }
            
            // player attacks
            if(this.state == 'idle' && this.attackKey.downDuration())
            {
                this.state = 'attacking';
                this.blade.alpha = 0;
                this.attackFrames = 20;
                this.animations.play('attack');
                this.scene.mechaAttacks.add(new MechaAttack(this.scene, this.x + 8, this.y));
                
                if(this.scene.effectTicker % 2 == 0)
                    this.sfxSlash1.play();
                else
                    this.sfxSlash2.play();
            }
            
            if(this.attackFrames > 0)
            {
                this.attackFrames--;
                if(this.state == 'attacking' && this.attackFrames == 0)
                {
                    this.state = 'idle';
                    this.blade.alpha = 1;
                    this.blade.frame = 0;
                }
            }
            
            GameObj.prototype.update.apply(this); // super
        }
    },
    hitCallback: {
        value: function (){ //override
        	if(this.state == 'ultra')
        	{
        		this.health = this.ultraHP;
        	}
        	else
        	{
	        	this.scene.sfxHurt.play();
	        	
	        	this.scene.heartsCrop.width = 32 * this.health / 4;
	        	this.scene.hearts.updateCrop();
        	}
        }
    },
    destroyCallback: {
        value: function (){ //override
        	this.scene.endTicker = 1;
        }
    }
});
Mecha.prototype.constructor = Mecha;


MechaAttack = function (scene, x, y) {
    Attack.call(this, scene, 'bladeattacks', x, y, 0);
    
    this.body.setSize(24, 24, 4, 4);
    this.body.velocity.x = 50;
    
    this.animations.add('cut', [4, 5, 6, 7, 8], 30);
    this.animations.play('cut', 30, false, true);
};

MechaAttack.prototype = Object.create(Attack.prototype, {
    update: {
        value: function(){ // override
            Attack.prototype.update.apply(this); // super
        }
    },
    hitUnitCallback: {
    	value: function (unit){ //override
			Attack.prototype.hitUnitCallback.apply(this, [ unit ]); // super
			
			unit.body.velocity.x += 80;
    	}
	},
	hitAttackCallback: {
    	value: function (attack){ //override
			Attack.prototype.hitAttackCallback.apply(this, [ attack ]); // super
			
			if(attack.animations.currentAnim.name == 'orb')
			{
				attack.dead = false;
				attack.animations.play('orbmecha');
	            attack.body.velocity.x = -attack.body.velocity.x;
	            this.scene.enemyAttacks.remove(attack);
	            this.scene.mechaAttacks.add(attack);
	            
	            this.scene.ultrameterCrop.width += 1;
	            this.scene.ultrameter.updateCrop();
	            this.scene.score += 1;
			}
    	}
	},
    destroyCallback: {
        value: function (){ //override
        	Attack.prototype.destroyCallback.apply(this); // super
        }
    }
});
MechaAttack.prototype.constructor = MechaAttack;

UltraAttack = function (scene, x, y) {
    Attack.call(this, scene, 'ultraattack', x, y, 0);
    
    this.body.setSize(48, 48, 8, 8);
    
    this.animations.add('ultra', [0, 1, 2, 3, 4, 5]);
    this.animations.play('ultra', 30, false, true);
    
    this.damage = 100;
};

UltraAttack.prototype = Object.create(Attack.prototype, {
    update: {
        value: function(){ // override
            Attack.prototype.update.apply(this); // super
        }
    },
    hitUnitCallback: {
    	value: function (unit){ //override
			Attack.prototype.hitUnitCallback.apply(this, [ unit ]); // super
    	}
	},
	hitAttackCallback: {
    	value: function (attack){ //override
			Attack.prototype.hitAttackCallback.apply(this, [ attack ]); // super
    	}
	},
    destroyCallback: {
        value: function (){ //override
        	Attack.prototype.destroyCallback.apply(this); // super
        }
    }
});
UltraAttack.prototype.constructor = UltraAttack;