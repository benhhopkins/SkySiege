Enemy = function (scene, spriteKey, x, y) {
    GameObj.call(this, scene, spriteKey, x, y, 1);
    this.scale.x = -1;
    
    this.speedMod = 3;
    this.moveTo = new Phaser.Point(
    	this.game.math.between(60, 160),
    	this.game.math.between(0, 140));
};

Enemy.prototype = Object.create(GameObj.prototype, {
    update: {
        value: function(){ // override
            this.body.velocity.x += (this.moveTo.x - this.x) / 2 - this.body.velocity.x / this.speedMod;
            this.body.velocity.y += (this.moveTo.y - this.y) / 2 - this.body.velocity.y / this.speedMod;
            
            if(Math.abs(this.x - this.moveTo.x) < 5 &&
            	Math.abs(this.y - this.moveTo.y) < 5)
        	{
        		this.moveTo = new Phaser.Point(
			    	this.game.math.between(50, 160),
			    	this.game.math.between(0, 140));
        	}
            	
            
            
            GameObj.prototype.update.apply(this); // super
        }
    },
    destroyCallback: {
        value: function (){ //override
        	GameObj.prototype.destroyCallback.apply(this); // super
        }
    }
});
Enemy.prototype.constructor = Enemy;

Robo1 = function (scene, x, y) {
    Enemy.call(this, scene, 'robo1', x, y);
    this.scale.x = -1;
    
    this.animations.add('idle', [0], 30, true);
    
    this.game.physics.arcade.enable(this);
    
    this.body.setSize(8, 8, 12, 12);
    
    this.attackTimer = this.game.math.between(100, 200);
};

Robo1.prototype = Object.create(Enemy.prototype, {
    update: {
        value: function(){ // override
		    this.attackTimer--;
		    if(this.attackTimer == 0)
		    {
		        this.attackTimer = this.game.math.between(100, 200);
		        this.scene.enemyAttacks.add(new Robo1Attack(this.scene, this.x, this.y, this.game.math.between(-100, -50), 0));
		    }
		    
		    if(this.scene.effectTicker % 30 == 0)
            {
                this.scene.effects.add(new Effect(this.scene, this.x, this.y + 6, 'jets', 'small'));
            }
		    
		    Enemy.prototype.update.apply(this); // super
        }
    },
    destroyCallback: {
        value: function (){ //override
        	Enemy.prototype.destroyCallback.apply(this); // super
        	
        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'explosion', 'explosion'));
        	if(this.scene.effectTicker % 2 == 0)
        		this.scene.sfxExplode1.play();
        	else
        		this.scene.sfxExplode2.play();
        		
        	this.scene.ultrameterCrop.width += 2;
        	this.scene.ultrameter.updateCrop();
        	this.scene.score += 2;
        }
    }
});
Robo1.prototype.constructor = Robo1;

Robo1Attack = function (scene, x, y, velx, vely) {
    Attack.call(this, scene, 'roboattacks', x, y, 1);
    
    this.body.setSize(6, 6, 5, 5);
    this.body.velocity.x = velx;
    this.body.velocity.y = vely;
    
    this.animations.add('orb', [0, 1], 30, true);
    this.animations.add('orbmecha', [2, 3], 30, true);
    this.animations.play('orb');
};

Robo1Attack.prototype = Object.create(Attack.prototype, {
    update: {
        value: function(){ // override
            Attack.prototype.update.apply(this); // super
        }
    },
    hitUnitCallback: {
    	value: function (unit){ //override
			Attack.prototype.hitUnitCallback.apply(this, [ unit ]); // super
			
			unit.body.velocity.x += this.body.velocity.x / 2;
			unit.body.velocity.y += this.body.velocity.y / 2;
			this.dead = true;
    	}
	},
	hitAttackCallback: {
    	value: function (attack){ //override
			Attack.prototype.hitAttackCallback.apply(this, [ attack ]); // super
			
			this.dead = true;
    	}
	},
    destroyCallback: {
        value: function (){ //override
        	Attack.prototype.destroyCallback.apply(this); // super
        	
        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'explosion', 'explosionsmall'));
        	this.scene.sfxExplode3.play();
        }
    }
});
Robo1Attack.prototype.constructor = Robo1Attack;

Robo2 = function (scene, x, y) {
    Enemy.call(this, scene, 'robo2', x, y);
    this.scale.x = -1;
    
    this.animations.add('idle', [0], 30, true);
    
    this.game.physics.arcade.enable(this);
    
    this.body.setSize(16, 16, 8, 8);
    
    this.attackTimer = this.game.math.between(80, 160);
    
    this.speedMod = 5;
    
    this.health = 2;
};

Robo2.prototype = Object.create(Enemy.prototype, {
    update: {
        value: function(){ // override
		    this.attackTimer--;
		    if(this.attackTimer == 0)
		    {
		        this.attackTimer = this.game.math.between(80, 160);
		        
		        var attackVector = new Phaser.Point(this.scene.mecha.x - this.x, this.scene.mecha.y - this.y);
		        attackVector.normalize();
		        
		        this.scene.enemyAttacks.add(new Robo1Attack(this.scene, this.x, this.y, 100 * attackVector.x, 100 * attackVector.y));
		    }
		    
		    if(this.scene.effectTicker % 17 == 0)
            {
                this.scene.effects.add(new Effect(this.scene, this.x, this.y + 6, 'jets', 'large'));
            }
		    
		    Enemy.prototype.update.apply(this); // super
        }
    },
    destroyCallback: {
        value: function (){ //override
        	Enemy.prototype.destroyCallback.apply(this); // super
        	
        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'explosion', 'explosion'));
        	if(this.scene.effectTicker % 2 == 0)
        		this.scene.sfxExplode1.play();
        	else
        		this.scene.sfxExplode2.play();
        		
        	this.scene.ultrameterCrop.width += 5;
        	this.scene.ultrameter.updateCrop();
        	this.scene.score += 5;
        	
        	if(this.game.math.between(0, 100) > 80)
        	{
        		this.scene.powerups.add(new HeartPowerUp(this.scene, this.x, this.y));
        	}
        }
    }
});
Robo2.prototype.constructor = Robo2;


Robo3 = function (scene, x, y) {
    Enemy.call(this, scene, 'robo3', x, y);
    this.scale.x = -1;
    
    this.animations.add('idle', [0], 30, true);
    
    this.game.physics.arcade.enable(this);
    
    this.body.setSize(16, 16, 8, 8);
    
    this.attackTimer = this.game.math.between(50, 100);
    
    this.speedMod = 2;
    
    this.health = 4;
};

Robo3.prototype = Object.create(Enemy.prototype, {
    update: {
        value: function(){ // override
		    this.attackTimer--;
		    if(this.attackTimer == 0)
		    {
		        this.attackTimer = this.game.math.between(150, 250);
		        
		        var attackVector = new Phaser.Point(this.scene.mecha.x - this.x, this.scene.mecha.y - this.y);
		        attackVector.normalize();
		        
		        this.scene.enemyAttacks.add(new Robo3Attack(this.scene, this.x, this.y, 20 * attackVector.x, 20 * attackVector.y));
		    }
		    
		    if(this.scene.effectTicker % 17 == 0)
            {
                this.scene.effects.add(new Effect(this.scene, this.x, this.y + 6, 'jets', 'small'));
            }
		    
		    Enemy.prototype.update.apply(this); // super
        }
    },
    destroyCallback: {
        value: function (){ //override
        	Enemy.prototype.destroyCallback.apply(this); // super
        	
        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'explosion', 'explosion'));
        	if(this.scene.effectTicker % 2 == 0)
        		this.scene.sfxExplode1.play();
        	else
        		this.scene.sfxExplode2.play();
        		
        	this.scene.ultrameterCrop.width += 10;
        	this.scene.ultrameter.updateCrop();
        	this.scene.score += 10;
        	
        	if(this.game.math.between(0, 100) > 50)
        	{
        		this.scene.powerups.add(new HeartPowerUp(this.scene, this.x, this.y));
        	}
        }
    }
});
Robo3.prototype.constructor = Robo3;


Robo3Attack = function (scene, x, y, velx, vely) {
    Attack.call(this, scene, 'roboattacks', x, y, 1);
    
    this.body.setSize(6, 6, 5, 5);
    this.body.velocity.x = velx;
    this.body.velocity.y = vely;
    
    this.animations.add('orbmissile', [4, 5], 10, true);
    this.animations.play('orbmissile');
};

Robo3Attack.prototype = Object.create(Attack.prototype, {
    update: {
        value: function(){ // override
        	if(this.animations.currentAnim.name == 'orbmissile')
			{
	            var moveVector = new Phaser.Point(this.scene.mecha.x - this.x, this.scene.mecha.y - this.y);
		        moveVector.normalize();
		        moveVector.x = this.body.velocity.x + 5 * moveVector.x;
		        moveVector.y = this.body.velocity.y + 5 * moveVector.y;
		        
		        var speed = this.body.velocity.getMagnitude();
		        speed = Math.max(speed, 100);
		        
		        moveVector.normalize();
		        this.body.velocity.x = speed * moveVector.x;
		        this.body.velocity.y = speed * moveVector.y;
		        
		        if(this.scene.effectTicker % 13 == 0)
		        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'jets', 'missile'));
			}
			
	        Attack.prototype.update.apply(this); // super
        }
    },
    hitUnitCallback: {
    	value: function (unit){ //override
			Attack.prototype.hitUnitCallback.apply(this, [ unit ]); // super
			
			unit.body.velocity.x += this.body.velocity.x / 2;
			unit.body.velocity.y += this.body.velocity.y / 2;
			this.dead = true;
    	}
	},
	hitAttackCallback: {
    	value: function (attack){ //override
			Attack.prototype.hitAttackCallback.apply(this, [ attack ]); // super
			
			this.dead = true;
    	}
	},
    destroyCallback: {
        value: function (){ //override
        	Attack.prototype.destroyCallback.apply(this); // super
        	
        	this.scene.effects.add(new Effect(this.scene, this.x, this.y, 'explosion', 'explosionsmall'));
        	this.scene.sfxExplode3.play();
        }
    }
});
Robo3Attack.prototype.constructor = Robo3Attack;