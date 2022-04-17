class Menu extends Phaser.Scene {
    constructor() {
        super("menu");
    }

    preload() {
        let width = config.width;
        let height = config.height;

        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');

        // menu text config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
            top: 5,
            bottom: 5,
            },
            fixedWidth: 0
        }

        // show menu text
        this.add.text(width / 2, height / 2 - borderUISize - borderPadding,
            'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(width / 2, height / 2, 'Use <--> arrows to move & (F) to fire',
            menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#80FF00';
        menuConfig.color = '#800';
        this.add.text(width / 2, height / 2 + borderUISize + borderPadding,
            'Press <- for Novice or -> for Expert', menuConfig).setOrigin(0.5);
        
        this.add.text(width / 2, height / 2 + 2 * borderUISize + 2 * borderPadding,
            'Choose # player with up/down', menuConfig).setOrigin(0.5);
        menuConfig.align = 'center';
        menuConfig.backgroundColor = '#F3B141';
        menuConfig.color = '#843605';
        this.numPlayers = 1;
        this.numPlayersToString = n => n + ' Player';
        this.numPlayersText = this.add.text(width / 2,
            height / 2 + 3 * borderUISize + 3 * borderPadding,
            this.numPlayersToString(this.numPlayers), menuConfig).setOrigin(0.5);

        Audio.preload(this);
    }

    create() {
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            const maxPlayers = 2;
            this.numPlayers = Math.min(this.numPlayers + 1, maxPlayers);
            this.numPlayersText.text = this.numPlayersToString(this.numPlayers);
            this.sound.play('sfx_select');
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            const minPlayers = 1;
            this.numPlayers = Math.max(this.numPlayers - 1, minPlayers);
            this.numPlayersText.text = this.numPlayersToString(this.numPlayers);
            this.sound.play('sfx_select');
        }
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            // easy mode
            Game.settings = {
                numPlayers: this.numPlayers,
                spaceshipSpeed: 3,
                gameTimer: 60000    
            }
            this.sound.play('sfx_select');
            this.scene.start('play');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            // hard mode
            Game.settings = {
                numPlayers: this.numPlayers,
                spaceshipSpeed: 4,
                gameTimer: 45000    
            }
            this.sound.play('sfx_select');
            this.scene.start('play');    
        }
    }
}
