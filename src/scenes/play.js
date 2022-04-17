class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png'); // single player rocket
        this.load.image('rocketp1', './assets/rocketp1.png'); // 2 player p1 rocket
        this.load.image('rocketp2', './assets/rocketp2.png'); // 2 player p2 rocket
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('asteroidsbig', './assets/asteroids_big.png');
        // problem with asset
        //this.load.image('asteroidsmed', './assets/asteroids_mid.png');

        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png',
            {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        let width = config.width;
        let height = config.height;

        this.defineKeys();

        this.starfield = this.add.tileSprite(0, 0, width, height, 'starfield').setOrigin(0, 0);
        this.asteroidsbig = this.add.tileSprite(0, 0, width, height, 'asteroidsbig').setOrigin(0, 0);
        //this.asteroidsmed = this.add.tileSprite(0, 0, width, height, 'asteroidsmed').setOrigin(0, 0);

        Game.players = new Array(Game.settings.numPlayers);
        for (let i = 0; i < Game.players.length; ++i) {
            Game.players[i] = {
                score : 0
            };
        }

        this.rockets = new Array(Game.settings.numPlayers);

        if (Game.settings.numPlayers == 2) {
            // add rocket (p1) - p1 texture
            this.rockets[0] = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocketp1');
            this.rockets[0].setOrigin(0.5, 0);
            this.rockets[0].playerID = 0;
            this.rockets[0].setControls(keyLEFT, keyRIGHT, keyUP);

            // add rocket (p2) - p2 texture
            this.rockets[1] = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocketp2');
            this.rockets[1].setOrigin(0.5, 0);
            this.rockets[1].playerID = 1;
            this.rockets[1].setControls(keyA, keyD, keyW);
        }
        else {
            // add rocket (p1) - neutral texture
            this.rockets[0] = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocket');
            this.rockets[0].setOrigin(0.5, 0);
            this.rockets[0].playerID = 0;
            this.rockets[0].setControls(keyLEFT, keyRIGHT, keyUP);
        }

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
        this.scoreConfig = {
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
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2,
            Game.players[0].score, this.scoreConfig);
        if (Game.settings.numPlayers == 2) {
            this.scoreRight = this.add.text(width - borderUISize - borderPadding - this.scoreConfig.fixedWidth,
                borderUISize + borderPadding*2, Game.players[1].score, this.scoreConfig);
        }

        this.timeLeft = Game.settings.gameTimer;
        this.timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 100
        }
        this.formatTimerText = t => Math.max(Math.floor(t / 1000), 0); 
        this.timerText = this.add.text((width / 2) - (this.timerConfig.fixedWidth / 2),
            borderUISize + borderPadding*2, this.formatTimerText(this.timeLeft), this.timerConfig);
        
        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        this.scoreConfig.fixedWidth = 0;

        // audio manager
        this.music = Audio.addMulti(this, 'playMusic');
        this.music.setGlobalConfig({loop: true});
        this.music.play();
    }

    update(time, delta) {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.music.destroy();
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.music.destroy();
            this.scene.start("menu");
        }

        this.starfield.tilePositionX -= 4;
        this.asteroidsbig.tilePositionX -= 1;

        if (!this.gameOver) {
            // update time
            this.timeLeft -= delta;
            this.timerText.text = this.formatTimerText(this.timeLeft);

            const pitchDriftTime = 5000;
            let det = clamp(((pitchDriftTime - this.timeLeft) / pitchDriftTime), 0, 1) * (-1 * 1200);
            this.music.setGlobalConfig({detune: det});
            

            if (this.timeLeft <= 0) {
                //this.music.setGlobalConfig({detune: 0});
                this.timeUp();
            }

            // update rockets
            this.rockets.forEach(r => r.update());

            // update ships
            this.ships.forEach(s => s.update());
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

        if (Game.settings.numPlayers == 1) {
            this.timeLeft += 3000;
        }

        const minDetune = -1000;
        const maxDetune = 1000;
        // random detune, pan based on position of ship
        let sConfig = {
            detune : getRandomInclusive(minDetune, maxDetune),
            pan : (((ship.x / Game.config.width) * 2.0) - 1.0)
        }
        let sfx = this.sound.play('sfx_explosion', sConfig);
    }

    timeUp() {
        let width = Game.config.width;
        let height = Game.config.height;
        this.add.text(width/2, height/2, 'GAME OVER', this.scoreConfig).setOrigin(0.5);
        this.add.text(width/2, height/2 + 64, 'Press (R) to Restart or <- for Menu',
            this.scoreConfig).setOrigin(0.5);
        this.gameOver = true;
        this.music.setConfig('Synth 1', {mute : true});
        this.music.setConfig('Drums', {mute : true});
    }
}