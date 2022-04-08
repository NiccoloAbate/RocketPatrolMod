class Play extends Phaser.Scene {
    constructor() {
        super("play");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
      }

    create() {
        let width = config.width;
        let height = config.height;

        this.starfield = this.add.tileSprite(0, 0, width, height, 'starfield').setOrigin(0, 0);
        
        let borderColor = 0xffffff;
        this.add.rectangle(0, 0, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, height - borderUISize, width, borderUISize, borderColor).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, height, borderColor).setOrigin(0, 0);
        this.add.rectangle(width - borderUISize, 0, borderUISize, height, borderColor).setOrigin(0, 0);
    
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, width/2, height - borderUISize - borderPadding, 'rocket');
        this.p1Rocket.setOrigin(0.5, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        this.starfield.tilePositionX -= 4;
        
        this.p1Rocket.update();
    }
}