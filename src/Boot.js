var BasicGame = {};

BasicGame.pixel = { scale: 3, canvas: null, context: null, width: 0, height: 0 };

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    init: function () {
        this.game.canvas.style['display'] = 'none';

	    BasicGame.pixel.canvas = Phaser.Canvas.create(this, this.game.width * BasicGame.pixel.scale, this.game.height * BasicGame.pixel.scale);
	    BasicGame.pixel.context = BasicGame.pixel.canvas.getContext('2d');
	    Phaser.Canvas.addToDOM(BasicGame.pixel.canvas);
	    Phaser.Canvas.setSmoothingEnabled(BasicGame.pixel.context, false);
	    BasicGame.pixel.width = BasicGame.pixel.canvas.width;
	    BasicGame.pixel.height = BasicGame.pixel.canvas.height;
        
        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        this.game.stage.backgroundColor = 0x4396FF;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            //this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            //this.scale.setMinMax(480, 260, 1024, 768);
            //this.scale.forceLandscape = true;
            //this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {
        this.load.image('loading', 'images/loading.png');
        this.load.image('loaded', 'images/loaded.png');
    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    },
    
    render: function() {
        BasicGame.pixel.context.drawImage(this.game.canvas, 0, 0, this.game.width, this.game.height, 0, 0, BasicGame.pixel.width, BasicGame.pixel.height);
    }

};
