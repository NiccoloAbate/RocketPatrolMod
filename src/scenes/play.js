class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png'); // single player rocket
        this.load.image('rocketp1', './assets/rocket.png'); // 2 player p1 rocket
        this.load.image('rocketp2', './assets/rocket.png'); // 2 player p2 rocket
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png',
            {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        let width = config.width;
        let height = config.height;

        this.defineKeys();

        this.starfield = this.add.tileSprite(0, 0, width, height, 'starfield').setOrigin(0, 0);
        
        Game.players = new Array(Game.settings.numPlayers);
        for (let i = 0; i < Game.players.length; ++i) {
            Game.players[i] = {
                score : 0
            };
        }

        this.rockets = new Array(Game.settings.numPlayers);
        // add rocket (p1)
        this.rockets[0] = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocketp1');
        this.rockets[0].setOrigin(0.5, 0);
        this.rockets[0].playerID = 0;
        this.rockets[0].setControls(keyLEFT, keyRIGHT, keyUP);

        // add rocket (p2)
        this.rockets[1] = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocketp2');
        this.rockets[1].setOrigin(0.5, 0);
        this.rockets[1].playerID = 1;
        this.rockets[1].setControls(keyA, keyD, keyW);

        this.ships = new Array(3);
        this.ships[0] = new Spaceship(this, width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ships[1] = new Spaceship(this, width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ships[2] = new Spaceship(this, width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        let rectColor = 0x00FF00;
        let borderColor = 0xFFFFFF;
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, width, borderUISize * 2, rectColor).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, height - borderUISize, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, height, borderColor).setOrigin(0, 0);
        this.add.rectangle(width - borderUISize, 0, borderUISize, height, borderColor).setOrigin(0, 0);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, Game.players[0].score, scoreConfig);
        this.scoreRight = this.add.text(width - borderUISize - borderPadding - scoreConfig.fixedWidth,
            borderUISize + borderPadding*2, Game.players[1].score, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(Game.settings.gameTimer, () => {
            this.add.text(width/2, height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(width/2, height/2 + 64, 'Press (R) to Restart or <- for Menu',
                scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menu");
        }

        this.starfield.tilePositionX -= 4;
        
        if (!this.gameOver) {
            this.rockets.forEach(r => r.update());
            //this.p1Rocket.update();
            //this.p2Rocket.update();

            this.ships.forEach(s => s.update());
            //this.ship01.update();
            //this.ship02.update();
            //this.ship03.update();
        }

        // check collisions
        for (let j = 0; j < this.rockets.length; ++j) {
            for (let i = 0; i < this.ships.length; ++i) {
                if(this.checkCollision(this.rockets[j], this.ships[i])) {
                    this.rockets[j].reset();
                    this.shipExplode(this.ships[i], this.rockets[j]);
                }
            }
        }
    }

    defineKeys() {
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    checkCollision(sprite1, sprite2) {
        let bounds1 = sprite1.getBounds();
        let bounds2 = sprite2.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(bounds1, bounds2);
    }

    shipExplode(ship, rocket) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');                 // play explode animation
        boom.on('animationcomplete', () => {        // callback after anim completes
            ship.reset();                           // reset ship position
            ship.alpha = 1;                         // make ship visible again
            boom.destroy();                         // remove explosion sprite
        });

        // score add and repaint
        Game.players[rocket.playerID].score += ship.points;
        let scoreText = rocket.playerID == 0 ? this.scoreLeft : this.scoreRight;
        scoreText.text = Game.players[rocket.playerID].score;

        this.sound.play('sfx_explosion');
    }
}